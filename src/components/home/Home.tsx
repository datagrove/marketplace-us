import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { HomeStickyFilters } from "./HomeStickyFilters";
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

function redirectToResourcesPage() {
    window.location.href = `/${lang}/services`
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
            <HomeStickyFilters />

            <div id="home-scrolling" class="scroll">
                <div id="header-image" class="h-24 flex justify-center items-center bg-green-600">
                    HEADER IMAGE
                </div>

                <div class="flex justify-center md:hidden">
                    <button 
                        class="rounded-full bg-btn2 dark:bg-btn2-DM mt-6 mb-4 px-16 py-1 shadow"
                        onClick={ redirectToResourcesPage }
                    >
                        {t("buttons.browseCatalog")}
                    </button>
                </div>

                <div id="popular-resources" class="w-full my-1 md:mb-8">
                    <h3 class="text-center text-lg md:text-2xl md:my-4 py-1">{t("pageTitles.popularResources")}</h3>
                    <div class="flex justify-start h-[515px] overflow-scroll md:h-auto max-w-full md:max-w-auto md:overflow-scroll">
                        <HomeCard posts={ popularPosts() }/>
                    </div>
                </div>

                <div id="home-subject-filter" class="md:mb-8">
                    <h3 class="text-center text-lg md:text-2xl md:my-4 py-1">{t("pageTitles.shopBySubject")}</h3>
                    <HomeSubjectCarousel />
                </div>

                <div id="home-image-1" class="h-36 bg-background2 dark:bg-background2-DM flex justify-center items-center rounded my-8">
                    <p class="text-ptext2 dark:text-ptext2-DM">Clickable image and text</p>
                </div>

                <div id="new-resources" class="md:mb-8">
                    <h3 class="text-center text-lg md:text-2xl md:my-4 py-1">{t("pageTitles.newResources")}</h3>
                    <div class="flex justify-start h-[515px] overflow-scroll md:h-auto max-w-full md:max-w-auto md:overflow-scroll">
                        <HomeCard posts={ newPosts() }/>
                    </div>
                </div>

                <div id="home-grade-filter" class="md:mb-8">
                    <h3 class="text-center text-lg md:text-2xl md:my-4 py-1">{t("pageTitles.shopByGrade")}</h3>
                    <HomeGradeCarousel />
                </div>

                <div id="home-image-2" class="h-36 bg-background2 dark:bg-background2-DM flex justify-center items-center rounded my-8">
                    <p class="text-ptext2 dark:text-ptext2-DM">Clickable image and text</p>
                </div>
            </div>
        </div>
    )
}