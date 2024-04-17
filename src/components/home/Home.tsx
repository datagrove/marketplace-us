import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { HomeCard } from "@components/home/HomeCard";
import { HomeSubjectCarousel } from "@components/home/HomeSubjectCarousel";
import { HomeGradeCarousel } from "./HomeGradeCarousel";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "@lib/stripe"; 
import * as allFilters from "../posts/fetchPosts";

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
    const [posts, setPosts] = createSignal<Array<ProviderPost>>([]);
    const [currentPosts, setCurrentPosts] = createSignal<Array<ProviderPost>>([]);
    const [popularPosts, setPopularPosts] = createSignal<Array<ProviderPost>>([]);
    const [newPosts, setNewPosts] = createSignal<Array<ProviderPost>>([])
    const [subjectFilters, setSubjectFilters] = createSignal<Array<number>>([]);
    const [gradeFilters, setGradeFilters] = createSignal<Array<string>>([]);
    const [resourceTypeFilters, setResourceTypeFilters] = createSignal<Array<string>>([]);
    const [fileTypeFilters, setFileTypeFilters] = createSignal<Array<string>>([]);
    const [standardsFilters, setStandardsFilters] = createSignal<string>("");

    let test: any

    createEffect(async () => {
        const { data, error } = await supabase
          .from("sellerposts")
          .select("*")
          .limit(8)
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
            .limit(8)
        
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
        <div class="">
            <div id="top-sticky-filter" class="flex justify-center items-center w-full bg-background2 dark:bg-background2-DM py-1 sticky top-0">
                <h3 class="mx-5 text-ptext2 dark:text-ptext2-DM">{t("formLabels.grades")}</h3>
                <h3 class="mx-5 text-ptext2 dark:text-ptext2-DM">{t("formLabels.subjects")}</h3>
                <h3 class="mx-5 text-ptext2 dark:text-ptext2-DM">{t("formLabels.resourceTypes")}</h3>
            </div>

            <div id="home-scrolling" class="scroll">
                <div id="header-image" class="h-24 flex justify-center items-center bg-green-600">
                    HEADER IMAGE
                </div>

                <div id="popular-resources" class="w-full my-1">
                    <h3 class="text-center text-lg py-1">{t("pageTitles.popularResources")}</h3>
                    <div class="flex justify-start h-[515px] overflow-scroll md:h-auto max-w-full md:max-w-auto md:overflow-scroll">
                        <HomeCard posts={ popularPosts() }/>
                    </div>
                </div>

                <div id="home-subject-filter">
                    <h3 class="text-center text-lg py-1">{t("pageTitles.shopBySubject")}</h3>
                    <HomeSubjectCarousel />
                </div>

                <div id="home-image-1" class="h-36 bg-gray-200 flex justify-center items-center rounded my-8">
                    Clickable image and text
                </div>

                <div id="new-resources">
                    <h3 class="text-center text-lg py-1">{t("pageTitles.newResources")}</h3>
                    <div class="flex justify-start h-[515px] overflow-scroll md:h-auto max-w-full md:max-w-auto md:overflow-scroll">
                        <HomeCard posts={ newPosts() }/>
                    </div>
                </div>

                <div id="home-grade-filter">
                    <h3 class="text-center text-lg py-1">{t("pageTitles.shopByGrade")}</h3>
                    <HomeGradeCarousel />
                </div>

                <div id="home-image-1" class="h-36 bg-gray-200 flex justify-center items-center rounded my-8">
                    Clickable image and text
                </div>
            </div>
        </div>
    )
}