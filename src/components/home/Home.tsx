import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createEffect, createSignal, Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
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
import { IconH1 } from "@tabler/icons-solidjs";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;
const productSubjects = values.subjectCategoryInfo.subjects;

interface Props {
    id: string | undefined;
}

function redirectToResourcesPage() {
    window.location.href = `/${lang}/resources`;
}

export const Home: Component = () => {
    const [posts, setPosts] = createSignal<Array<Post>>([]);
    const [currentPosts, setCurrentPosts] = createSignal<Array<Post>>([]);
    const [popularPosts, setPopularPosts] = createSignal<Array<Post>>([]);
    const [newPosts, setNewPosts] = createSignal<Array<Post>>([]);
    const [subjectFilters, setSubjectFilters] = createSignal<Array<string>>([]);
    const [gradeFilters, setGradeFilters] = createSignal<Array<string>>([]);
    const [resourceTypeFilters, setResourceTypeFilters] = createSignal<
        Array<string>
    >([]);
    const [fileTypeFilters, setFileTypeFilters] = createSignal<Array<string>>(
        []
    );
    const [standardsFilters, setStandardsFilters] = createSignal<string>("");

    let test: any;

    createEffect(async () => {
        const { data, error } = await supabase
            .from("sellerposts")
            .select("*")
            .eq("listing_status", true)
            .limit(8);
        if (!data) {
            alert("No posts available.");
        }
        if (error) {
            console.log("supabase error: " + error.message);
        } else {
            const newItems = await Promise.all(
                data?.map(async (item) => {
                    item.subject = [];
                    productSubjects.forEach((productCategories) => {
                        item.product_subject.map((productSubject: string) => {
                            if (productSubject === productCategories.id) {
                                item.subject.push(productCategories.name);
                            }
                        });
                    });
                    delete item.product_subject;

                    if (item.price_id !== null) {
                        const priceData = await stripe.prices.retrieve(
                            item.price_id
                        );
                        item.price = priceData.unit_amount! / 100;
                    }
                    return item;
                })
            );
            setPopularPosts(data);
        }
    });

    createEffect(async () => {
        const { data, error } = await supabase
            .from("sellerposts")
            .select("*")
            .eq("listing_status", true)
            .order("id", { ascending: false })
            .limit(8);

        if (!data) {
            alert("No posts available");
        }

        if (error) {
            console.error("supabase error: " + error.message);
        } else {
            const popItems = await Promise.all(
                data?.map(async (item) => {
                    item.subject = [];
                    productSubjects.forEach((productCategories) => {
                        item.product_subject.map((productSubject: string) => {
                            if (productSubject === productCategories.id) {
                                item.subject.push(productCategories.name);
                            }
                        });
                    });
                    delete item.product_subject;

                    if (item.price_id !== null) {
                        const priceData = await stripe.prices.retrieve(
                            item.price_id
                        );
                        item.price = priceData.unit_amount! / 100;
                    }
                    return item;
                })
            );
            setNewPosts(data);
        }
    });

    const screenSize = useStore(windowSize);

    return (
        <div class="">
            <HomeStickyFilters />

            <div id="home-scrolling" class="scroll">
                <a href={ `/${ lang}/creator/createaccount`}>
                    <div
                        id="header-image"
                        class="flex h-24 justify-center items-center bg-gradient-to-r from-highlight1 dark:from-[#3E8E3E] dark:via-highlight1-DM dark:to-[#3E8E3E] rounded-md"
                    >
                        <Show when={ screenSize() !== "sm"}>
                            <div>
                                <svg fill="none" width="80px" height="80px" viewBox="0 0 256 256" id="Flat" class="fill-icon1 dark:fill-icon1 h-24 md:w-24">
                                    <path d="M224,52H160a36.02912,36.02912,0,0,0-32,19.53955A36.02912,36.02912,0,0,0,96,52H32A12.01343,12.01343,0,0,0,20,64V192a12.01343,12.01343,0,0,0,12,12H96a28.03146,28.03146,0,0,1,28,28,4,4,0,0,0,8,0,28.03146,28.03146,0,0,1,28-28h64a12.01343,12.01343,0,0,0,12-12V64A12.01343,12.01343,0,0,0,224,52ZM96,196H32a4.00427,4.00427,0,0,1-4-4V64a4.00427,4.00427,0,0,1,4-4H96a28.03146,28.03146,0,0,1,28,28V209.39648A35.949,35.949,0,0,0,96,196Zm132-4a4.00427,4.00427,0,0,1-4,4H160a35.94218,35.94218,0,0,0-28,13.40747V88a28.03146,28.03146,0,0,1,28-28h64a4.00427,4.00427,0,0,1,4,4Z"/>
                                </svg>
                            </div>
                        </Show>
                        
                        <div class="ml-1">
                            <h1 class="text-ptext1 dark:text-ptext1 md:text-2xl">{t("homePageText.becomeCreator")}</h1>
                            <p class="text-ptext2 dark:text-ptext1 text-sm md:text-lg italic">{t("homePageText.clickToBecomeCreator")}</p>
                        </div>
                    </div>
                </a>

                <div class="flex justify-center md:hidden">
                    <button
                        class="mb-4 mt-6 rounded-full bg-btn2 px-16 py-1 shadow dark:bg-btn2-DM"
                        onClick={redirectToResourcesPage}
                    >
                        {t("buttons.browseCatalog")}
                    </button>
                </div>

                <div id="popular-resources" class="my-1 w-full md:mb-8">
                    <h3 class="py-1 text-center text-lg md:my-4 md:text-2xl">
                        {t("pageTitles.popularResources")}
                    </h3>
                    <div class="md:max-w-auto flex h-[515px] max-w-full justify-start overflow-scroll md:h-auto md:overflow-scroll">
                        <HomeCard posts={popularPosts()} />
                    </div>
                </div>

                <div id="home-subject-filter" class="md:mb-8">
                    <h3 class="py-1 text-center text-lg md:my-4 md:text-2xl">
                        {t("pageTitles.shopBySubject")}
                    </h3>
                    <HomeSubjectCarousel />
                </div>

                <a href={ `/${lang}/about`}>
                    <div
                        id="home-image-1"
                        class="my-8 flex flex-col h-36 items-center justify-center bg-gradient-to-r from-inputBorder1 dark:from-inputBorder1-DM dark:via-black dark:to-inputBorder1-DM rounded-md"
                    >
                        <h1 class="text-htext1 dark:text-htext1-DM text-2xl md:text-4xl font-bold text-center">
                            {t("homePageText.welcome")}
                        </h1>
                        <p class="text-ptext1 dark:text-ptext1-DM mt-4 italic text-center text-sm md:text-lg">
                            {t("homePageText.clickToLearnMore")}
                        </p>
                    </div>
                </a>

                <div id="new-resources" class="md:mb-8">
                    <h3 class="py-1 text-center text-lg md:my-4 md:text-2xl">
                        {t("pageTitles.newResources")}
                    </h3>
                    <div class="md:max-w-auto flex h-[515px] max-w-full justify-start overflow-scroll md:h-auto md:overflow-scroll">
                        <HomeCard posts={newPosts()} />
                    </div>
                </div>

                <div id="home-grade-filter" class="md:mb-8">
                    <h3 class="py-1 text-center text-lg md:my-4 md:text-2xl">
                        {t("pageTitles.shopByGrade")}
                    </h3>
                    <HomeGradeCarousel />
                </div>

                <a href="https://forms.gle/e1snHR7pnAFRTa1MA" target="_blank">
                    <div
                        id="home-image-1"
                        class="my-8 flex flex-col h-36 items-center justify-center bg-gradient-to-r from-inputBorder1 dark:from-inputBorder1-DM rounded-md"
                    >
                        <h1 class="text-htext1 dark:text-htext1-DM text-2xl md:text-4xl font-bold text-center">
                            {t("homePageText.contribute")}
                        </h1>
                        <p class="text-ptext1 dark:text-ptext1-DM mt-4 italic text-center text-sm md:text-lg">
                            {t("homePageText.clickToContribute")}
                        </p>
                    </div>
                </a>
            </div>
        </div>
    );
};
