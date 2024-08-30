import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, onMount, Show } from "solid-js";
import { ViewCard } from "./ViewCard";
import { MobileViewCard } from "./MobileViewCard";
import { FiltersMobile } from "./FiltersMobile";
import { SearchBar } from "./SearchBar";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
import type { FilterPostsParams } from "@lib/types";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

async function fetchPosts({
    subjectFilters,
    gradeFilters,
    searchString,
    resourceFilters,
    secularFilter,
    listing_status,
    draft_status,
}: FilterPostsParams) {
    const response = await fetch("/api/fetchFilterPosts", {
        method: "POST",
        body: JSON.stringify({
            subjectFilters: subjectFilters,
            gradeFilters: gradeFilters,
            searchString: searchString,
            resourceFilters: resourceFilters,
            secularFilter: secularFilter,
            lang: lang,
            listing_status: listing_status,
            draft_status: draft_status,
        }),
    });
    const data = await response.json();

    return data;
}

export const ResourcesView: Component = () => {
    const [posts, setPosts] = createSignal<Array<Post>>([]);
    const [searchPost, setSearchPost] = createSignal<Array<Post>>([]);
    const [currentPosts, setCurrentPosts] = createSignal<Array<Post>>([]);
    const [subjectFilters, setSubjectFilters] = createSignal<Array<string>>([]);
    const [gradeFilters, setGradeFilters] = createSignal<Array<string>>([]);
    const [resourceTypesFilters, setResourceTypeFilters] = createSignal<
        Array<string>
    >([]);
    const [resourceFilters, setResourceFilters] = createSignal<Array<string>>(
        []
    );
    const [searchString, setSearchString] = createSignal<string>("");
    const [noPostsVisible, setNoPostsVisible] = createSignal<boolean>(false);
    const [secularFilters, setSecularFilters] = createSignal<boolean>(false);

    const screenSize = useStore(windowSize);

    onMount(async () => {
        if (
            localStorage.getItem("selectedSubjects") !== null &&
            localStorage.getItem("selectedSubjects")
        ) {
            setSubjectFilters([
                ...subjectFilters(),
                ...JSON.parse(localStorage.getItem("selectedSubjects")!),
            ]);
        }
        if (
            localStorage.getItem("selectedGrades") !== null &&
            localStorage.getItem("selectedGrades")
        ) {
            setGradeFilters([
                ...gradeFilters(),
                ...JSON.parse(localStorage.getItem("selectedGrades")!),
            ]);
        }
        if (
            localStorage.getItem("searchString") !== null &&
            localStorage.getItem("searchString") !== undefined
        ) {
            const searchStringValue =
                localStorage.getItem("searchString") || "";
            setSearchString(searchStringValue);
        }
        if (
            localStorage.getItem("selectedResourceTypes") !== null &&
            localStorage.getItem("selectedResourceTypes")
        ) {
            setResourceFilters([
                ...resourceFilters(),
                ...JSON.parse(localStorage.getItem("selectedResourceTypes")!),
            ]);
        }
        await filterPosts();
    });

    window.addEventListener("beforeunload", () => {
        localStorage.removeItem("selectedGrades");
        localStorage.removeItem("selectedSubjects");
        localStorage.removeItem("searchString");
        localStorage.removeItem("selectedResourceTypes");
    });

    const searchPosts = async () => {
        if (localStorage.getItem("searchString") !== null) {
            setSearchString(localStorage.getItem("searchString") as string);
        }

        filterPosts();
    };

    const setCategoryFilter = (currentCategory: string) => {
        if (subjectFilters().includes(currentCategory)) {
            let currentFilters = subjectFilters().filter(
                (el) => el !== currentCategory
            );
            setSubjectFilters(currentFilters);
        } else {
            setSubjectFilters([...subjectFilters(), currentCategory]);
        }

        filterPosts();
    };

    let timeouts: (string | number | NodeJS.Timeout | undefined)[] = [];

    const filterPosts = async () => {
        console.log("Filtering posts...");
        const noPostsMessage = document.getElementById("no-posts-message");

        const res = await fetchPosts({
            subjectFilters: subjectFilters(),
            gradeFilters: gradeFilters(),
            searchString: searchString(),
            resourceFilters: resourceTypesFilters(),
            secularFilter: secularFilters(),
            lang: lang,
            listing_status: true,
            draft_status: false,
        });

        console.log(res);

        if (
            res.body === null ||
            res.body === undefined ||
            res.body.length < 1
        ) {
            noPostsMessage?.classList.remove("hidden");
            setTimeout(() => {
                noPostsMessage?.classList.add("hidden");
            }, 3000);

            setPosts([]);
            setCurrentPosts([]);
            console.error();

            timeouts.push(
                setTimeout(() => {
                    //Clear all filters after the timeout otherwise the message immediately disappears (probably not a perfect solution)
                    clearAllFilters();
                }, 3000)
            );

            let allPosts = await fetchPosts({
                subjectFilters: [],
                gradeFilters: [],
                searchString: "",
                resourceFilters: [],
                secularFilter: false,
                lang: lang,
                listing_status: true,
                draft_status: false,
            });

            setPosts(allPosts);
            setCurrentPosts(allPosts);
            console.log(allPosts);
        } else {
            for (let i = 0; i < timeouts.length; i++) {
                clearTimeout(timeouts[i]);
            }

            timeouts = [];

            setPosts(res.body);
            setCurrentPosts(res.body);
        }
    };

    const filterPostsByGrade = (grade: string) => {
        if (gradeFilters().includes(grade)) {
            let currentGradeFilters = gradeFilters().filter(
                (el) => el !== grade
            );
            setGradeFilters(currentGradeFilters);
        } else {
            setGradeFilters([...gradeFilters(), grade]);
        }

        filterPosts();
    };

    const filterPostsByResourceTypes = (type: string) => {
        if (resourceTypesFilters().includes(type)) {
            let currentResourceTypesFilter = resourceTypesFilters().filter(
                (el) => el !== type
            );
            setResourceTypeFilters(currentResourceTypesFilter);
        } else {
            setResourceTypeFilters([...resourceTypesFilters(), type]);
        }

        filterPosts();
    };

    const filterPostsBySecular = (secular: boolean) => {
        setSecularFilters(secular);
        filterPosts();
    };

    const clearAllFilters = () => {
        let searchInput = document.getElementById("search") as HTMLInputElement;
        const subjectCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].subject"
        ) as NodeListOf<HTMLInputElement>;
        const gradeCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].grade"
        ) as NodeListOf<HTMLInputElement>;
        const resourceTypesCheckoxes = document.querySelectorAll(
            "input[type='checkbox'].resourceType"
        ) as NodeListOf<HTMLInputElement>;

        if (searchInput !== null && searchInput.value !== null) {
            searchInput.value = "";
        }

        gradeCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
        });

        subjectCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
        });

        resourceTypesCheckoxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
        });

        localStorage.removeItem("selectedGrades");
        localStorage.removeItem("selectedSubjects");
        localStorage.removeItem("searchString");
        localStorage.removeItem("selectedResourceTypes");

        setSearchPost([]);
        setSearchString("");
        // localStorage.setItem("searchString", "");
        setSubjectFilters([]);
        setGradeFilters([]);
        setResourceTypeFilters([]);
        setSecularFilters(false);

        filterPosts();
    };

    const clearSubjects = () => {
        const subjectCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].subject"
        ) as NodeListOf<HTMLInputElement>;

        subjectCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
        });

        localStorage.removeItem("selectedSubjects");
        setSubjectFilters([]);
        filterPosts();
    };

    const clearGrade = () => {
        const gradeCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].grade"
        ) as NodeListOf<HTMLInputElement>;

        console.log(gradeCheckboxes);

        gradeCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
        });

        localStorage.removeItem("selectedGrades");
        setGradeFilters([]);
        filterPosts();
    };

    const clearResourceTypes = () => {
        const resourceTypesCheckoxes = document.querySelectorAll(
            "input[type='checkbox'].resourceType"
        ) as NodeListOf<HTMLInputElement>;

        console.log(resourceTypesCheckoxes);

        resourceTypesCheckoxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
        });

        // localStorage.removeItem("selectedGrades");
        setResourceTypeFilters([]);
        filterPosts();
    };

    const clearSecular = () => {
        const secularCheckbox = document.getElementById(
            "secularCheck"
        ) as HTMLInputElement;

        console.log(secularCheckbox);

        if (secularCheckbox && secularCheckbox.checked) {
            secularCheckbox.checked = false;
        }

        setSecularFilters(false);
        filterPosts();
    };

    return (
        <div class="">
            <div>
                <SearchBar search={searchPosts} />
                {/* <SearchBar search={ searchString } /> */}
            </div>

            <Show when={screenSize() === "sm"}>
                <FiltersMobile
                    clearSubjects={clearSubjects}
                    clearGrade={clearGrade}
                    clearAllFilters={clearAllFilters}
                    filterPostsByGrade={filterPostsByGrade}
                    filterPostsBySubject={setCategoryFilter}
                    secularFilter={filterPostsBySecular}
                    clearSecular={clearSecular}
                    filterPostsByResourceTypes={filterPostsByResourceTypes}
                    clearResourceTypes={clearResourceTypes}
                />
            </Show>

            <Show when={screenSize() === "sm"}>
                <div class="mb-2 rounded-lg bg-btn1 py-2 dark:bg-btn1-DM">
                    <h1 class="text-lg text-ptext1-DM dark:text-ptext1">
                        {t("pageTitles.services")}
                    </h1>
                </div>
            </Show>

            <div class="flex w-full flex-col items-center md:h-full md:w-auto md:flex-row md:items-start">
                <Show when={screenSize() !== "sm"}>
                    <FiltersMobile
                        clearSubjects={clearSubjects}
                        clearGrade={clearGrade}
                        clearAllFilters={clearAllFilters}
                        filterPostsByGrade={filterPostsByGrade}
                        filterPostsBySubject={setCategoryFilter}
                        secularFilter={filterPostsBySecular}
                        clearSecular={clearSecular}
                        clearResourceTypes={clearResourceTypes}
                        filterPostsByResourceTypes={filterPostsByResourceTypes}
                    />
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
                            <ViewCard posts={currentPosts()} />
                        </div>
                    </Show>
                    <Show when={screenSize() === "sm"}>
                        <div class="flex justify-center">
                            <MobileViewCard posts={currentPosts()} />
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
};
