import type { Component } from "solid-js";
import type { Post } from "@lib/types";
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

    return (
        <div class="">
            <HomeStickyFilters />

            <div id="home-scrolling" class="scroll">
                <div
                    id="header-image"
                    class="flex h-24 items-center justify-center bg-green-600"
                >
                    HEADER IMAGE
                </div>

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

                <div
                    id="home-image-1"
                    class="my-8 flex h-36 items-center justify-center rounded bg-background2 dark:bg-background2-DM"
                >
                    <p class="text-ptext2 dark:text-ptext2-DM">
                        Clickable image and text
                    </p>
                </div>

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

                <div
                    id="home-image-2"
                    class="my-8 flex h-36 items-center justify-center rounded bg-background2 dark:bg-background2-DM"
                >
                    <p class="text-ptext2 dark:text-ptext2-DM">
                        Clickable image and text
                    </p>
                </div>
            </div>
        </div>
    );
};
