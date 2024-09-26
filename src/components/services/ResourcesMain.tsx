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

    return (
        <div class="">
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
                />

                <Show when={screenSize() === "sm"}>
                    <div class="mb-2 w-full rounded-lg bg-btn1 py-2 dark:bg-btn1-DM">
                        <h1 class="text-lg text-btn1Text dark:text-ptext1">
                            {t("pageTitles.services")}
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
                                {t("pageTitles.services")}
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
