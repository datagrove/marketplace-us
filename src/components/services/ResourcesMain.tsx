import type { Component } from "solid-js";
import { createSignal, createEffect, onMount, Show, onCleanup } from "solid-js";

import type { Post } from "@lib/types";
import { ViewCard } from "@components/services/ViewCard";
import { MobileViewCard } from "@components/services/MobileViewCard";
import { FiltersMobile } from "@components/services/FiltersMobile";
import { SearchBar } from "@components/services/SearchBar";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
import type { FilterPostsParams } from "@lib/types";
import { debounce } from "@lib/utils/debounce";
import Banner from "@components/common/notices/Banner";
import Modal from "@components/common/notices/modal";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

async function postRequest({
    subjectFilters,
    gradeFilters,
    searchString,
    resourceFilters,
    secularFilter,
    downloadable,
    subtopics,
    listing_status,
    draft_status,
    lang,
    from,
    to,
    priceMin,
    priceMax,
}: FilterPostsParams) {
    const response = await fetch("/api/fetchFilterPosts", {
        method: "POST",
        body: JSON.stringify({
            subjectFilters: subjectFilters,
            gradeFilters: gradeFilters,
            searchString: searchString,
            resourceFilters: resourceFilters,
            secularFilter: secularFilter,
            downloadable: downloadable,
            subtopics: subtopics,
            lang: lang,
            listing_status: listing_status,
            draft_status: draft_status,
            from: from,
            to: to,
            priceMin: priceMin,
            priceMax: priceMax,
        }),
    });
    const data = await response.json();

    return data;
}

const fetchPosts = debounce(postRequest, 500);

export const ResourcesView: Component = () => {
    const [posts, setPosts] = createSignal<Array<Post>>([]);
    const [searchPost, setSearchPost] = createSignal<Array<Post>>([]);
    const [subjectFilters, setSubjectFilters] = createSignal<Array<number>>([]);
    const [subtopicFilters, setSubtopicFilters] = createSignal<Array<number>>(
        []
    );
    const [gradeFilters, setGradeFilters] = createSignal<Array<number>>([]);
    const [resourceTypesFilters, setResourceTypeFilters] = createSignal<
        Array<number>
    >([]);
    const [searchString, setSearchString] = createSignal<string>("");
    const [secularFilters, setSecularFilters] = createSignal<boolean>(false);
    const [downloadFilter, setDownloadFilter] = createSignal<boolean>(false);
    const [clearFilters, setClearFilters] = createSignal<boolean>(false);
    const [page, setPage] = createSignal<number>(1);
    const [loading, setLoading] = createSignal<boolean>(false);
    const [hasMore, setHasMore] = createSignal<boolean>(true);
    const [priceFilterMin, setPriceFilterMin] = createSignal<number | null>(
        null
    );
    const [priceFilterMax, setPriceFilterMax] = createSignal<number | null>(
        null
    );

    let postsPerPage: number = 10;

    const screenSize = useStore(windowSize);

    if (screenSize() === "sm") {
        postsPerPage = 5;
    }

    onMount(async () => {
        const localSubjects = localStorage.getItem("selectedSubjects");
        const localGrades = localStorage.getItem("selectedGrades");
        const localSearch = localStorage.getItem("searchString");
        const localResourceTypes = localStorage.getItem(
            "selectedResourceTypes"
        );

        if (localSubjects !== null && localSubjects) {
            setSubjectFilters([
                ...subjectFilters(),
                ...JSON.parse(localSubjects).map(Number),
            ]);
        }
        if (localGrades !== null && localGrades) {
            setGradeFilters([
                ...gradeFilters(),
                ...JSON.parse(localGrades).map(Number),
            ]);
        }
        if (localSearch !== null && localSearch !== undefined) {
            const searchStringValue = localSearch || "";
            setSearchString(searchStringValue);
        }
        if (localResourceTypes !== null && localResourceTypes) {
            setResourceTypeFilters([
                ...resourceTypesFilters(),
                ...JSON.parse(localResourceTypes).map(Number),
            ]);
        }
        fetchPaginatedPosts(page());

        const loadMoreTrigger = document.getElementById("load-more-trigger");

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading() && hasMore()) {
                    setPage((prev) => prev + 1);
                    fetchPaginatedPosts(page());
                }
            },
            {
                root: null,
                rootMargin: "100px",
                threshold: 1.0,
            }
        );

        if (loadMoreTrigger) {
            observer.observe(loadMoreTrigger);
        }

        onCleanup(() => {
            if (loadMoreTrigger) {
                observer.unobserve(loadMoreTrigger);
            }
        });
    });

    window.addEventListener("beforeunload", () => {
        localStorage.removeItem("selectedGrades");
        localStorage.removeItem("selectedSubjects");
        localStorage.removeItem("searchString");
        localStorage.removeItem("selectedResourceTypes");
    });

    let noPostsMessageTimeout: NodeJS.Timeout;

    const fetchPaginatedPosts = async (pageValue: number) => {
        const noPostsMessage = document.getElementById("no-posts-message");

        if (noPostsMessageTimeout) {
            noPostsMessage?.classList.add("hidden");
            clearTimeout(noPostsMessageTimeout);
        }
        setLoading(true);
        const from = (pageValue - 1) * postsPerPage;
        const to = from + postsPerPage - 1;

        const res = await fetchPosts({
            subjectFilters: subjectFilters(),
            gradeFilters: gradeFilters(),
            searchString: searchString(),
            resourceFilters: resourceTypesFilters(),
            secularFilter: secularFilters(),
            downloadable: downloadFilter(),
            subtopics: subtopicFilters(),
            listing_status: true,
            draft_status: false,
            lang: lang,
            from: from,
            to: to,
            priceMin: priceFilterMin(),
            priceMax: priceFilterMax(),
        });

        if (res.body && res.body.length > 0) {
            setPosts((prevPosts) => [...prevPosts, ...res.body]);
            if (res.body.length < postsPerPage) {
                setHasMore(false); // No more posts if fewer than the page size were fetched
            }
        } else {
            if (pageValue === 1) {
                noPostsMessage?.classList.remove("hidden"); // Show no-posts message on the first page
                noPostsMessageTimeout = setTimeout(() => {
                    noPostsMessage?.classList.add("hidden");
                    clearAllFilters();
                }, 3000);

                // Clear posts if there are no results on the first page
            } else {
                setHasMore(false); // No more posts to load in subsequent pages
            }
        }

        setLoading(false);
    };

    function triggerNewSearch() {
        setPage(1); // Reset page to 1
        setPosts([]); // Clear current posts
        setHasMore(true);
        fetchPaginatedPosts(page());
    }

    const searchPosts = async (searchString: string) => {
        if (searchString !== null) {
            setSearchString(searchString);
        }
        triggerNewSearch();
    };

    const setCategoryFilter = (currentCategory: number) => {
        if (subjectFilters().includes(currentCategory)) {
            let currentFilters = subjectFilters().filter(
                (el) => el !== currentCategory
            );
            setSubjectFilters(currentFilters);
        } else {
            setSubjectFilters([...subjectFilters(), currentCategory]);
        }
        triggerNewSearch();
    };

    const filterPostsByGrade = (grade: number) => {
        if (gradeFilters().includes(grade)) {
            let currentGradeFilters = gradeFilters().filter(
                (el) => el !== grade
            );
            setGradeFilters(currentGradeFilters);
        } else {
            setGradeFilters([...gradeFilters(), grade]);
        }

        triggerNewSearch();
    };

    const filterPostsByResourceTypes = (type: number) => {
        if (resourceTypesFilters().includes(type)) {
            let currentResourceTypesFilter = resourceTypesFilters().filter(
                (el) => el !== type
            );
            setResourceTypeFilters(currentResourceTypesFilter);
        } else {
            setResourceTypeFilters([...resourceTypesFilters(), type]);
        }

        triggerNewSearch();
    };

    const filterPostsBySecular = (secular: boolean) => {
        setSecularFilters(secular);
        triggerNewSearch();
    };

    const filterPostsByDownloadable = (downloadable: boolean) => {
        setDownloadFilter(downloadable);
        triggerNewSearch();
    };

    const filterPostsBySubtopic = (subtopics: Array<number>) => {
        setSubtopicFilters(subtopics);
        triggerNewSearch();
    };

    const filterPostsByPrice = (min: number, max: number) => {
        setPriceFilterMin(min);
        setPriceFilterMax(max);
        triggerNewSearch();
    };

    const clearAllFilters = () => {
        console.log("clear all filters RM triggered");
        let searchInput = document.getElementById(
            "headerSearch"
        ) as HTMLInputElement;

        if (searchInput !== null && searchInput.value !== null) {
            searchInput.value = "";
        }

        setClearFilters(true);

        setSearchPost([]);
        setSearchString("");
        setSubjectFilters([]);
        setGradeFilters([]);
        setResourceTypeFilters([]);
        setSecularFilters(false);
        setDownloadFilter(false);
        setSubtopicFilters([]);
        setPriceFilterMax(null);
        setPriceFilterMin(null);

        triggerNewSearch();
        setClearFilters(false);
    };

    const clearSubjects = () => {
        setSubjectFilters([]);
        setSubtopicFilters([]);
        triggerNewSearch();
    };

    const clearGrade = () => {
        setGradeFilters([]);
        triggerNewSearch();
    };

    const clearResourceTypes = () => {
        setResourceTypeFilters([]);
        triggerNewSearch();
    };

    const clearSecular = () => {
        setSecularFilters(false);
        triggerNewSearch();
    };

    const clearDownloadFilter = () => {
        setDownloadFilter(false);
        triggerNewSearch();
    };

    const clearSubtopicsFilter = () => {
        setSubtopicFilters([]);
        triggerNewSearch();
    };

    const clearPriceFilter = () => {
        setPriceFilterMin(null);
        setPriceFilterMax(null);
        triggerNewSearch();
    };

    return (
        <div class="">
            {/* <!-- 
    For best experience keep banner content to <90 characters 
    linkLocation and linkLabel are optional but make sure to include both if used
    possible banner props are:
    content: string | JSX.Element
    linkLocation?: string
    linkLabel?: string
    startDate?: string YYYY-MM-DD
    endDate?: string YYYY-MM-DD
     --> */}
            <div class="mb-4">
                <Banner
                    content={
                        <Modal
                            buttonClass=""
                            buttonId="scavenger1"
                            buttonContent={t("huntModal.buttonContent")}
                            buttonAriaLabel={t("huntModal.buttonAria")}
                            heading={t("huntModal.stop1")}
                            headingLevel={3}
                        >
                            <>
                                <div class="flex justify-center text-lg font-bold">
                                    🎉 {t("huntModal.solvedClue1")} 🎉
                                </div>
                                <div class="text-center text-lg italic">
                                    {t("huntModal.solveAll")}
                                </div>
                                <br />
                                <div class="text-center font-bold">
                                    {t("huntModal.discountCode")}:{" "}
                                </div>
                                <div class="text-center text-2xl font-bold text-htext1 dark:text-htext1-DM">
                                    BROWSEANDSAVE10
                                </div>
                                <br />
                                <div class="text-center font-bold">
                                    {t("huntModal.nextClue")}
                                </div>

                                <Show
                                    when={lang === "en"}
                                    fallback={t("huntModal.clue1Lang")}
                                >
                                    <div class="flex justify-center text-center italic leading-loose">
                                        At LearnGrove’s site, create your own
                                        space,
                                        <br />
                                        Your homeschooling needs all in one neat
                                        place.
                                        <br />
                                        Share a bit, then start to find,
                                        <br />
                                        Resources crafted to inspire your mind!
                                        <br />
                                    </div>
                                </Show>
                            </>
                        </Modal>
                    }
                    startDate="2024-11-17"
                    endDate="2024-12-31"
                />
            </div>
            <div>
                <SearchBar search={searchPosts} clearFilters={clearFilters()} />
                {/* <SearchBar search={ searchString } /> */}
            </div>

            <div class="flex w-full flex-col items-center md:h-full md:w-auto md:flex-row md:items-start">
                <FiltersMobile
                    clearSubjects={clearSubjects}
                    clearGrade={clearGrade}
                    clearAllFilters={clearAllFilters}
                    clearFilters={clearFilters()}
                    filterPostsByGrade={filterPostsByGrade}
                    filterPostsBySubject={setCategoryFilter}
                    secularFilter={filterPostsBySecular}
                    clearSecular={clearSecular}
                    clearResourceTypes={clearResourceTypes}
                    filterPostsByResourceTypes={filterPostsByResourceTypes}
                    clearDownloadFilter={clearDownloadFilter}
                    filterPostsByDownloadable={filterPostsByDownloadable}
                    filterPostsBySubtopic={filterPostsBySubtopic}
                    clearSubtopics={clearSubtopicsFilter}
                    filterPostsByPrice={filterPostsByPrice}
                    clearPriceFilter={clearPriceFilter}
                />

                <Show when={screenSize() === "sm"}>
                    <div class="mb-2 rounded-lg bg-btn1 py-2 dark:bg-btn1-DM">
                        <h1 class="text-lg text-btn1Text dark:text-ptext1">
                            {t("hElementText.services")}
                        </h1>
                    </div>
                </Show>

                <div class="w-11/12 items-center md:w-8/12 md:flex-1">
                    <div
                        id="no-posts-message"
                        class="my-1 hidden rounded bg-btn1 py-2 dark:bg-btn1-DM"
                    >
                        <h1 class="text-btn1Text dark:text-btn1Text-DM">
                            {t("messages.noPostsSearch")}
                        </h1>
                    </div>
                    <Show when={screenSize() !== "sm"}>
                        <div class="mb-2 flex w-full items-center justify-center rounded-lg bg-btn1 opacity-80 dark:bg-btn1-DM md:h-24">
                            <h1 class="text-center text-lg text-ptext1-DM dark:text-ptext1 md:text-3xl">
                                {t("h1ElementText.services")}
                            </h1>
                        </div>
                    </Show>
                    <Show when={screenSize() !== "sm"}>
                        <div class="inline">
                            <ViewCard posts={posts()} />
                            <div
                                id="load-more-trigger"
                                class="h-10 w-full"
                            ></div>
                        </div>
                    </Show>
                    <Show when={screenSize() === "sm"}>
                        <div class="flex flex-col justify-center">
                            <MobileViewCard lang={lang} posts={posts()} />
                            <div
                                id="load-more-trigger"
                                class="h-10 w-full"
                            ></div>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
};
