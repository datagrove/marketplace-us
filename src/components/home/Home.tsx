import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { HomeCard } from "@components/home/HomeCard";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "@lib/stripe"; 

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as unknown as uiObject
const productCategories = values.productCategoryInfo.categories

interface ProviderPost {
    user_id: string;
    content: string;
    id: number;
    //TODO: update this to allow a list of Subjects
    subject: string;
    title: string;
    seller_name: string;
    seller_img: string;
    major_municipality: string;
    image_urls: string;
    price: number;
    price_id: string;
    quantity: number;
    product_id: string;
}

interface Props {
    id: string | undefined;
}

export const Home: Component = () => {
    const [popularPosts, setPopularPosts] = createSignal<Array<ProviderPost>>([]);
    const [newPosts, setNewPosts] = createSignal<Array<ProviderPost>>([])

    createEffect(async () => {
        const { data, error } = await supabase
          .from("sellerposts")
          .select("*")
          .limit(5)
        if (!data) {
          alert("No posts available.");
        }
        if (error) {
          console.log("supabase error: " + error.message);
        } else {
          const newItems = await Promise.all(
          data?.map(async (item) => {
            productCategories.forEach((productCategories) => {
              if (item.product_subject.toString() === productCategories.id) {
                item.subject = productCategories.name;
              }
            });
            delete item.product_subject;
    
            if (item.price_id !== null) {
              const priceData = await stripe.prices.retrieve(item.price_id);
              item.price = priceData.unit_amount! / 100;
            }
            return item;
          }))
          ;
          setPopularPosts(data);
        }        
    });

    createEffect(async() => {
        const { data, error } = await supabase
            .from("sellerposts")
            .select("*")
            .order("id", { ascending: false })
            .limit(5)
        
        if(!data) {
            alert("No posts available");
        }

        if(error) {
            console.error("supabase error: " + error.message);
        } else {
            const popItems = await Promise.all(
                data?.map(async(item) => {
                    productCategories.forEach((productCategories) => {
                        if(item.product_subject.toString() === productCategories.id) {
                            item.subject = productCategories.name;
                        }
                    });
                    delete item.product_subject;

                    if(item.price_id !== null) {
                        const priceData = await stripe.prices.retrieve(item.price_id);
                        item.price = priceData.unit_amount! / 100;
                    }
                    return item;
                }))
            setNewPosts(data);
        }
    })
    
    return (
        <div class=" border-2 border-orange-500">
            <div id="top-sticky-filter" class="flex justify-center items-center w-full bg-gray-200 py-1 sticky top-0">
                <h3 class="mx-5">{t("formLabels.grades")}</h3>
                <h3 class="mx-5">{t("formLabels.subjects")}</h3>
                <h3 class="mx-5">{t("formLabels.resourceTypes")}</h3>
            </div>

            <div id="home-scrolling" class="scroll">
                <div id="header-image" class="h-24 flex justify-center items-center bg-green-600">
                    HEADER IMAGE
                </div>

                <div id="popular-resources" class="w-full my-1">
                    <h3 class="text-center text-lg py-1">{t("pageTitles.popularResources")}</h3>
                    <HomeCard posts={ popularPosts() }/>
                </div>

                <div id="home-subject-filter">
                    <h3 class="text-center text-lg py-1">{t("pageTitles.shopBySubject")}</h3>
                </div>

                <div id="home-image-1" class="h-36 bg-gray-200 flex justify-center items-center rounded my-8">
                    Clickable image and text
                </div>

                <div id="new-resources">
                    <h3 class="text-center text-lg py-1">{t("pageTitles.newResources")}</h3>
                    <HomeCard posts={ newPosts() }/>
                </div>

                <div id="home-grade-filter">
                    <h3 class="text-center text-lg py-1">{t("pageTitles.shopByGrade")}</h3>
                </div>

                <div id="home-image-1" class="h-36 bg-gray-200 flex justify-center items-center rounded my-8">
                    Clickable image and text
                </div>
            </div>
        </div>
    )
}