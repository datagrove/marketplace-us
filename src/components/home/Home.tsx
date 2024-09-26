import type { Component, JSXElement } from "solid-js";
import type { FilterPostsParams, Post } from "@lib/types";
import { createSignal, Show, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
import { HomeCard } from "@components/home/HomeCard";
import { HomeGradeCarousel } from "./HomeGradeCarousel";
import { useTranslations } from "../../i18n/utils";
import { debounce } from "@lib/utils/debounce";

// const lang = getLangFromUrl(new URL(window.location.href));

interface Props {
    lang: "en" | "es" | "fr";
    stickyFilters: JSXElement;
    subjectCarousel: JSXElement;
}

async function postRequest({
    lang,
    draft_status,
    listing_status,
    orderAscending,
}: FilterPostsParams) {
    const response = await fetch("/api/fetchFilterPosts", {
        method: "POST",
        body: JSON.stringify({
            lang: lang,
            limit: 8,
            draft_status: draft_status,
            listing_status: listing_status,
            orderAscending: orderAscending,
        }),
    });
    const data = await response.json();

    if (response.status !== 200) {
        alert(data.message);
    }

    return data;
}

const fetchPosts = debounce(postRequest, 500);

export const Home: Component<Props> = (props) => {
    const [lang, setLang] = createSignal<"en" | "es" | "fr">(props.lang);
    const [popularPosts, setPopularPosts] = createSignal<Array<Post>>([]);
    const [newPosts, setNewPosts] = createSignal<Array<Post>>([]);

    onMount(async () => {
        const res = await fetchPosts({
            lang: lang(),
            listing_status: true,
            draft_status: false,
        });

        if (
            res.body === null ||
            res.body === undefined ||
            res.body.length < 1
        ) {
            alert("No posts available.");
        }

        setPopularPosts(res.body);
        console.log("Pop posts", popularPosts());

        const newRes = await fetchPosts({
            lang: lang(),
            orderAscending: true,
            listing_status: true,
            draft_status: false,
        });

        if (
            newRes.body === null ||
            newRes.body === undefined ||
            newRes.body.length < 1
        ) {
            alert("No posts available.");
        } else {
            setNewPosts(newRes.body);
            console.log("New Posts", newPosts());
        }
    });

    const screenSize = useStore(windowSize);

    const t = useTranslations(props.lang);
    function redirectToResourcesPage() {
        window.location.href = `/${language}/resources`;
    }

    const language = lang();

    return (
        <div class="">
            {props.stickyFilters}

            <div id="home-scrolling" class="scroll">
                <a href={`/${language}/creator/createaccount`}>
                    <div
                        id="header-image"
                        class="flex h-24 items-center justify-center rounded-md bg-gradient-to-r from-highlight1 dark:from-[#3E8E3E] dark:via-highlight1-DM dark:to-[#3E8E3E]"
                    >
                        <Show when={screenSize() !== "sm"}>
                            <div>
                                <svg
                                    fill="none"
                                    width="80px"
                                    height="80px"
                                    viewBox="0 0 256 256"
                                    id="Flat"
                                    class="h-24 fill-icon1 dark:fill-icon1 md:w-24"
                                >
                                    <path d="M224,52H160a36.02912,36.02912,0,0,0-32,19.53955A36.02912,36.02912,0,0,0,96,52H32A12.01343,12.01343,0,0,0,20,64V192a12.01343,12.01343,0,0,0,12,12H96a28.03146,28.03146,0,0,1,28,28,4,4,0,0,0,8,0,28.03146,28.03146,0,0,1,28-28h64a12.01343,12.01343,0,0,0,12-12V64A12.01343,12.01343,0,0,0,224,52ZM96,196H32a4.00427,4.00427,0,0,1-4-4V64a4.00427,4.00427,0,0,1,4-4H96a28.03146,28.03146,0,0,1,28,28V209.39648A35.949,35.949,0,0,0,96,196Zm132-4a4.00427,4.00427,0,0,1-4,4H160a35.94218,35.94218,0,0,0-28,13.40747V88a28.03146,28.03146,0,0,1,28-28h64a4.00427,4.00427,0,0,1,4,4Z" />
                                </svg>
                            </div>
                        </Show>

                        <div class="ml-1">
                            <h1 class="text-ptext1 dark:text-ptext1 md:text-2xl">
                                {t("homePageText.becomeCreator")}
                            </h1>
                            <p class="text-center text-sm italic text-ptext2 dark:text-ptext1 md:text-lg">
                                {t("homePageText.clickToBecomeCreator")}
                            </p>
                        </div>
                    </div>
                </a>

                <div class="flex justify-center md:hidden">
                    <button
                        class="btn-primary mb-2 mt-3 min-h-[44px] min-w-[44px] px-16 py-1"
                        onClick={redirectToResourcesPage}
                    >
                        {t("buttons.browseCatalog")}
                    </button>
                </div>

                <div id="popular-resources" class="my-1 w-full md:mb-8">
                    <div class="py-1 text-center text-lg md:my-4 md:text-2xl">
                        {t("pageTitles.popularResources")}
                    </div>
                    <div class="md:max-w-auto flex h-[515px] max-w-full justify-start overflow-x-auto md:h-auto md:overflow-x-auto">
                        <HomeCard posts={popularPosts()} lang={lang()} />
                    </div>
                </div>

                <div id="home-subject-filter" class="md:mb-8">
                    <div class="py-1 text-center text-lg md:my-4 md:text-2xl">
                        {t("pageTitles.shopBySubject")}
                    </div>
                    {props.subjectCarousel}
                </div>

                <a href={`/${language}/about`}>
                    <div
                        id="home-image-1"
                        class="my-8 flex h-36 flex-col items-center justify-center rounded-md bg-gradient-to-r from-inputBorder1 dark:from-inputBorder1-DM dark:via-black dark:to-inputBorder1-DM"
                    >
                        <h1 class="text-center text-2xl font-bold text-htext1 dark:text-htext1-DM md:text-4xl">
                            {t("homePageText.welcome")}
                        </h1>
                        <p class="mt-4 text-center text-sm italic text-ptext1 dark:text-ptext1-DM md:text-lg">
                            {t("homePageText.clickToLearnMore")}
                        </p>
                    </div>
                </a>

                <div id="new-resources" class="md:mb-8">
                    <div class="py-1 text-center text-lg md:my-4 md:text-2xl">
                        {t("pageTitles.newResources")}
                    </div>
                    <div class="md:max-w-auto flex h-[515px] max-w-full justify-start overflow-x-auto md:h-auto md:overflow-x-auto">
                        <HomeCard posts={newPosts()} lang={lang()} />
                    </div>
                </div>

                <div id="home-grade-filter" class="md:mb-8">
                    <div class="py-1 text-center text-lg md:my-4 md:text-2xl">
                        {t("pageTitles.shopByGrade")}
                    </div>
                    <HomeGradeCarousel lang={lang()} />
                </div>

                <a href="https://forms.gle/e1snHR7pnAFRTa1MA" target="_blank">
                    <div
                        id="home-image-1"
                        class="my-8 flex h-36 flex-col items-center justify-center rounded-md bg-gradient-to-r from-inputBorder1 dark:from-inputBorder1-DM"
                    >
                        <h2 class="text-center text-2xl font-bold text-htext1 dark:text-htext1-DM md:text-4xl">
                            {t("homePageText.contribute")}
                        </h2>
                        <p class="mt-4 text-center text-sm italic text-ptext1 dark:text-ptext1-DM md:text-lg">
                            {t("homePageText.clickToContribute")}
                        </p>
                    </div>
                </a>
            </div>
        </div>
    );
};
