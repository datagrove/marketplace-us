import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, onMount, Show } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { CategoryCarousel } from "./CategoryCarousel";
import { ViewCard } from "./ViewCard";
import { MobileViewCard } from "./MobileViewCard";
import { GradeFilter } from "./GradeFilter";
import { SubjectFilter } from "./SubjectFilter";
import { SecularFilter } from "./SecularFilter";
import { FiltersMobile } from "./FiltersMobile";
import { SearchBar } from "./SearchBar";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import * as allFilters from "../posts/fetchPosts";
import stripe from "../../lib/stripe";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
import useLocalStorage from "@lib/LocalStorageHook";
import { IconX } from "@tabler/icons-solidjs";

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

export const ResourcesView: Component = () => {
    const [posts, setPosts] = createSignal<Array<Post>>([]);
    const [searchPost, setSearchPost] = createSignal<Array<Post>>([]);
    const [currentPosts, setCurrentPosts] = createSignal<Array<Post>>([]);
    const [subjectFilters, setSubjectFilters] = createSignal<Array<string>>([]);
    const [gradeFilters, setGradeFilters] = createSignal<Array<string>>([]);
    const [resourceTypesFilters, setResourceTypeFilters] = createSignal<Array<string>>([]);
    const [resourceFilters, setResourceFilters] = createSignal<Array<string>>(
        []
    );
    const [searchString, setSearchString] = createSignal<string>("");
    const [noPostsVisible, setNoPostsVisible] = createSignal<boolean>(false);
    const [secularFilters, setSecularFilters] = createSignal<boolean>(false);
    const [downHostedFilter, setDownHostedFilter] = createSignal<number>(0);

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
        const noPostsMessage = document.getElementById("no-posts-message");

        const res = await allFilters.fetchFilteredPosts(
            subjectFilters(),
            gradeFilters(),
            searchString(),
            resourceTypesFilters(),
            secularFilters(),
            downHostedFilter(),
        );

        if (res === null || res === undefined) {
            noPostsMessage?.classList.remove("hidden");
            setTimeout(() => {
                noPostsMessage?.classList.add("hidden");
            }, 3000);

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

                          const { data: resourceTypesData, error: resourceTypesError } =
                              await supabase.from("resource_types").select("*");

                          if (resourceTypesError) {
                              console.log(
                                  "supabase error: " + resourceTypesError.message
                              );
                          } else {
                              item.resourceTypes = [];
                              resourceTypesData.forEach((databaseResourceTypes) => {
                                  item.resource_types.map((itemResourceTypes: string) => {
                                      if (
                                          itemResourceTypes ===
                                          databaseResourceTypes.id.toString()
                                      ) {
                                          item.resource_types.push(databaseResourceTypes.resource_types);
                                      }
                                  });
                              });
                          }

                          return item;
                      })
                    : []
            );

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
                    const { data: resourceTypesData, error: resourceTypesError } =
                        await supabase.from("resource_types").select("*");

                    if (resourceTypesError) {
                        console.log("supabase error: " + resourceTypesError.message);
                    } else {
                        item.resource_types= [];
                        resourceTypesData.forEach((databaseResourceTypes) => {
                            item.resource_types.map((itemResourceTypes: string) => {
                                if (itemResourceTypes === databaseResourceTypes.id.toString()) {
                                    item.resource_types.push(databaseResourceTypes.resource_types);
                                }
                            });
                        });
                    }
                    return item;
                })
            );
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

        filterPosts();
    };

    const filterPostsByResourceTypes = (type: string) => {
        if (resourceTypesFilters().includes(type)) {
            let currentResourceTypesFilter= resourceTypesFilters().filter(
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

    const filterPostsByDownHosted = (downHosted: number) => {
      setDownHostedFilter(downHosted);
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
        const resourceTypesCheckoxes= document.querySelectorAll(
            "input[type='checkbox'].resourceType"
        ) as NodeListOf<HTMLInputElement>;


        console.log(subjectCheckboxes);
        console.log(gradeCheckboxes);
        console.log(resourceTypesCheckoxes);

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
        setResourceTypeFilters([])
        setSecularFilters(false);
        setDownHostedFilter(0);

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

    const clearResourceTypes= () => {
        const resourceTypesCheckoxes= document.querySelectorAll(
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

    const clearDownHosted = () => {

      const isCheckHosted = document.getElementsByClassName("checkBoxHosted") as HTMLCollectionOf<HTMLInputElement>;
      const isCheckDown = document.getElementsByClassName("checkBoxDown") as HTMLCollectionOf<HTMLInputElement>;

      if ( isCheckHosted[0].checked) {
      console.log("check box clear")
        isCheckHosted[0].checked = false;
      }

      if (isCheckDown[0].checked) {
      console.log("check box clear")
        isCheckDown[0].checked = false;
      }

      setDownHostedFilter(0);
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
                    downHostedFilter={filterPostsByDownHosted}
                    clearDownHosted={clearDownHosted}
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
                        downHostedFilter={filterPostsByDownHosted}
                        clearDownHosted={clearDownHosted}
                    />
                    {/* <div class="sticky top-0 w-3/12">
                        <div class="clear-filters-btns mr-4 flex w-11/12 flex-wrap items-center justify-center rounded border border-border2 dark:border-border2-DM">
                            <div class="flex w-full">
                                <button
                                    class="clearBtnRectangle flex w-1/2 items-center justify-center"
                                    onclick={clearGrade}
                                    aria-label={t(
                                        "clearFilters.filterButtons.2.ariaLabel"
                                    )}
                                >
                                    <div class="flex items-center">
                                        <IconX stroke={"2"} class="h-3 w-3" />
                                        <p class="text-xs">
                                            {t(
                                                "clearFilters.filterButtons.2.text"
                                            )}
                                        </p>
                                    </div>
                                </button>

                                <button
                                    class="clearBtnRectangle flex w-1/2 items-center justify-center"
                                    onclick={clearSubjects}
                                    aria-label={t(
                                        "clearFilters.filterButtons.1.ariaLabel"
                                    )}
                                >
                                    <div class="flex items-center">
                                        <IconX stroke={"2"} class="h-3 w-3" />
                                        <p class="text-xs">
                                            {t(
                                                "clearFilters.filterButtons.1.text"
                                            )}
                                        </p>
                                    </div>
                                </button>
                            </div>

                            <button
                                class="clearBtnRectangle flex w-full justify-center"
                                onclick={clearAllFilters}
                                aria-label={t(
                                    "clearFilters.filterButtons.0.ariaLabel"
                                )}
                            >
                                <div class="flex items-center">
                                    <IconX stroke={"2"} class="h-3 w-3" />
                                    <p class="text-xs">
                                        {t("clearFilters.filterButtons.0.text")}
                                    </p>
                                </div>
                            </button>
                        </div>

                        <div class="mr-4 w-11/12">
                            <GradeFilter
                                filterPostsByGrade={filterPostsByGrade}
                            />
                        </div>

                        <div class="w-11/12 md:mr-4">
                            <SubjectFilter filterPosts={setCategoryFilter} />
                        </div>
                    </div> */}
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
