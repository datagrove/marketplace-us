import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, onMount, Show } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { CategoryCarousel } from "./CategoryCarousel";
import { ViewCard } from "./ViewCard";
import { MobileViewCard } from "./MobileViewCard";
import { GradeFilter } from "./GradeFilter";
import { SubjectFilter } from "./SubjectFilter";
import { FiltersMobile } from "./FiltersMobile";
import { SearchBar } from "./SearchBar";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import * as allFilters from "../posts/fetchPosts";
import stripe from "../../lib/stripe";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

// interface Props {
//     subject: string | null;
//     grade: string | null;
//     searchString: string | null;
//     resourceTypes: string | null;
// }

export const ServicesView: Component = () => {
    const [posts, setPosts] = createSignal<Array<Post>>([]);
    const [searchPost, setSearchPost] = createSignal<Array<Post>>([]);
    const [currentPosts, setCurrentPosts] = createSignal<Array<Post>>([]);
    const [subjectFilters, setSubjectFilters] = createSignal<Array<string>>([]);
    const [gradeFilters, setGradeFilters] = createSignal<Array<string>>([]);
    const [resourceFilters, setResourceFilters] = createSignal<Array<string>>([]);
    const [searchString, setSearchString] = createSignal<string>("");
    const [noPostsVisible, setNoPostsVisible] = createSignal<boolean>(false);
    
    const screenSize = useStore(windowSize);

    onMount(async () => {
        if (localStorage.getItem("selectedSubjects") !== null && localStorage.getItem("selectedSubjects")) {
            setSubjectFilters([...subjectFilters(), ...JSON.parse(localStorage.getItem("selectedSubjects")!)]);
        }
        if (localStorage.getItem("selectedGrades") !== null && localStorage.getItem("selectedGrades")) {
            setGradeFilters([...gradeFilters(), ...JSON.parse(localStorage.getItem("selectedGrades")!)]);
        }
        if (localStorage.getItem("searchString") !== null && localStorage.getItem("searchString") !== undefined) {
            setSearchString(JSON.parse(localStorage.getItem("searchString")!));
        } 
        if (localStorage.getItem("selectedResourceTypes") !== null && localStorage.getItem("selectedResourceTypes")) {
            setResourceFilters([...resourceFilters(), ...JSON.parse(localStorage.getItem("selectedResourceTypes")!)]);
        }
        await filterPosts();
    });

    window.addEventListener("beforeunload", () => {
            localStorage.removeItem("selectedGrades");
            localStorage.removeItem("selectedSubjects");
    });


    const searchPosts = async (searchText: string) => {
        setSearchString(searchText);

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
        const noPostsMessage = document.getElementById("no-posts-message");

        const res = await allFilters.fetchFilteredPosts(
            subjectFilters(),
            gradeFilters(),
            searchString(),
            resourceFilters(),
        );

        if (res === null || res === undefined) {
            noPostsMessage?.classList.remove("hidden");

            setPosts([]);
            setCurrentPosts([]);
            console.error();
        } else if (Object.keys(res).length === 0) {
            noPostsMessage?.classList.remove("hidden");

            setTimeout(() => {
                noPostsMessage?.classList.add("hidden");
            }, 3000);

            timeouts.push(
                setTimeout(() => {
                    //Clear all filters after the timeout otherwise the message immediately disappears (probably not a perfect solution)
                    clearAllFilters();
                }, 3000)
            );

            let allPosts = await allFilters.fetchAllPosts();

            //Add the categories to the posts in the current language
            const allUpdatedPosts = await Promise.all(
                allPosts
                    ? allPosts.map(async (item) => {
                          item.subject = [];
                          productCategories.forEach((productCategories) => {
                              item.product_subject.map(
                                  (productSubject: string) => {
                                      if (
                                          productSubject ===
                                          productCategories.id
                                      ) {
                                          item.subject.push(
                                              productCategories.name
                                          );
                                      }
                                  }
                              );
                          });
                          delete item.product_subject;

                          const { data: gradeData, error: gradeError } =
                              await supabase.from("grade_level").select("*");

                          if (gradeError) {
                              console.log(
                                  "supabase error: " + gradeError.message
                              );
                          } else {
                              item.grade = [];
                              gradeData.forEach((databaseGrade) => {
                                  item.post_grade.map((itemGrade: string) => {
                                      if (
                                          itemGrade ===
                                          databaseGrade.id.toString()
                                      ) {
                                          item.grade.push(databaseGrade.grade);
                                      }
                                  });
                              });
                          }
                          return item;
                      })
                    : []
            );

            console.log(allUpdatedPosts);
            setPosts(allUpdatedPosts!);
            setCurrentPosts(allUpdatedPosts!);
        } else {
            for (let i = 0; i < timeouts.length; i++) {
                clearTimeout(timeouts[i]);
            }

            timeouts = [];

            let resPosts = await Promise.all(
                res.map(async (item) => {
                    item.subject = [];
                    productCategories.forEach((productCategories) => {
                        item.product_subject.map((productSubject: string) => {
                            if (productSubject === productCategories.id) {
                                item.subject.push(productCategories.name);
                                console.log(productCategories.name);
                            }
                        });
                    });
                    delete item.product_subject;

                    const { data: gradeData, error: gradeError } =
                        await supabase.from("grade_level").select("*");

                    if (gradeError) {
                        console.log("supabase error: " + gradeError.message);
                    } else {
                        item.grade = [];
                        gradeData.forEach((databaseGrade) => {
                            item.post_grade.map((itemGrade: string) => {
                                if (itemGrade === databaseGrade.id.toString()) {
                                    item.grade.push(databaseGrade.grade);
                                }
                            });
                        });
                    }
                    return item;
                })
            );

            console.log("res", resPosts);
            setPosts(resPosts);
            setCurrentPosts(resPosts);
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
        console.log(gradeFilters());
        filterPosts();
    };

    const clearAllFilters = () => {
        console.log("clearing all filters");
        let searchInput = document.getElementById("search") as HTMLInputElement;
        const subjectCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].subject"
        ) as NodeListOf<HTMLInputElement>;
        const gradeCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].grade"
        ) as NodeListOf<HTMLInputElement>;

        if (searchInput.value !== null) {
            searchInput.value = "";
        }

        gradeCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) checkbox.click();
        });

        subjectCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) checkbox.click();
        });

        setSearchPost([]);
        setSearchString("");
        setSubjectFilters([]);
        setGradeFilters([]);
        filterPosts();
    };

    const clearSubjects = () => {
        const subjectCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].subject"
        ) as NodeListOf<HTMLInputElement>;

        subjectCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) checkbox.click();
        });

        setSubjectFilters([]);
        filterPosts();
    };

    const clearGrade = () => {
        const gradeCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].grade"
        ) as NodeListOf<HTMLInputElement>;

        gradeCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) checkbox.click();
        });

        setGradeFilters([]);
        filterPosts();
    };

    return (
        <div class="">
            <div>
                <SearchBar search={searchPosts} />
                {/* <SearchBar search={ searchString } /> */}
            </div>

            <div class="clear-filters-btns flex flex-wrap items-center justify-center md:mb-2">
                <button
                    class="clearBtnRectangle"
                    onclick={clearAllFilters}
                    aria-label={t("clearFilters.filterButtons.0.ariaLabel")}
                >
                    <p class="text-xs">
                        {t("clearFilters.filterButtons.0.text")}
                    </p>
                </button>

                <button
                    class="clearBtnRectangle"
                    onclick={clearSubjects}
                    aria-label={t("clearFilters.filterButtons.1.ariaLabel")}
                >
                    <p class="text-xs">
                        {t("clearFilters.filterButtons.1.text")}
                    </p>
                </button>

                <button
                    class="clearBtnRectangle"
                    onclick={clearGrade}
                    aria-label={t("clearFilters.filterButtons.2.ariaLabel")}
                >
                    <p class="text-xs">
                        {t("clearFilters.filterButtons.2.text")}
                    </p>
                </button>
            </div>

            <Show when={ screenSize() === "sm"}>
                <FiltersMobile clearSubjects={ clearSubjects } clearGrade={ clearGrade } clearAllFilters={ clearAllFilters } filterPostsByGrade={ filterPostsByGrade } filterPostsBySubject={ setCategoryFilter }/>
            </Show>

            <div class="flex w-full min-w-[270px] flex-col items-center md:h-full md:w-auto md:flex-row md:items-start">
                <div class="sticky top-0 w-full md:w-auto">
                    <div class="w-11/12 md:mr-4 md:w-56">
                        <GradeFilter filterPostsByGrade={filterPostsByGrade} />
                    </div>

                    <div class="w-11/12 md:mr-4 md:w-56">
                        <SubjectFilter filterPosts={setCategoryFilter} />
                    </div>
                </div>

                <div class="w-11/12 items-center md:flex-1">
                    <div
                        id="no-posts-message"
                        class="my-1 hidden rounded bg-btn1 py-2 dark:bg-btn1-DM"
                    >
                        <h1 class="text-btn1Text dark:text-btn1Text-DM">
                            {t("messages.noPostsSearch")}
                        </h1>
                    </div>
                    <div class="hidden md:inline">
                        <ViewCard posts={currentPosts()} />
                    </div>

                    <div class="flex justify-center md:hidden">
                        <MobileViewCard posts={currentPosts()} />
                    </div>
                </div>
            </div>
        </div>
    );
};
