import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { CategoryCarousel } from "./CategoryCarousel";
import { ViewCard } from "./ViewCard";
import { MobileViewCard } from "./MobileViewCard";
import { GradeFilter } from "./GradeFilter";
import { SearchBar } from "./SearchBar";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import * as allFilters from "../posts/fetchPosts";
import stripe from "../../lib/stripe";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

export const ServicesView: Component = () => {
    const [posts, setPosts] = createSignal<Array<Post>>([]);
    const [searchPost, setSearchPost] = createSignal<Array<Post>>([]);
    const [currentPosts, setCurrentPosts] = createSignal<Array<Post>>([]);
    const [filters, setFilters] = createSignal<Array<string>>([]);
    const [gradeFilters, setGradeFilters] = createSignal<Array<string>>([]);
    const [searchString, setSearchString] = createSignal<string>("");
    const [noPostsVisible, setNoPostsVisible] = createSignal<boolean>(false);

    onMount(async () => {
        await fetchPosts();
    });

    let data;

    async function fetchPosts() {
        const { data, error } = await supabase.from("sellerposts").select("*");

        if (!data) {
            alert("No posts available.");
        }
        if (error) {
            console.log("supabase error: " + error.message);
        } else {
            console.log(data);
            const newItems = await Promise.all(
                data?.map(async (item) => {
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

                    if (item.price_id !== null) {
                        const priceData = await stripe.prices.retrieve(
                            item.price_id
                        );
                        item.price = priceData.unit_amount! / 100;
                    }
                    return item;
                })
            );
            console.log(newItems.map((item) => item));
            setPosts(newItems);
            setCurrentPosts(newItems);
        }
    }

    // start the page as displaying all posts
    if (!data) {
        let noPostsMessage = document.getElementById("no-posts-message");
        noPostsMessage?.classList.remove("hidden");

        setPosts([]);
        setCurrentPosts([]);
    } else {
        setPosts(data);
        setCurrentPosts(data);
    }

    const searchPosts = async (searchText: string) => {
        setSearchString(searchText);

        filterPosts();
    };

    const setCategoryFilter = (currentCategory: string) => {
        if (filters().includes(currentCategory)) {
            let currentFilters = filters().filter(
                (el) => el !== currentCategory
            );
            setFilters(currentFilters);
        } else {
            setFilters([...filters(), currentCategory]);
        }

        filterPosts();
    };

    let timeouts: (string | number | NodeJS.Timeout | undefined)[] = [];

    const filterPosts = async () => {
        const noPostsMessage = document.getElementById("no-posts-message");

        const res = await allFilters.fetchFilteredPosts(
            filters(),
            gradeFilters(),
            searchString()
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

        filterPosts();
    };

    const clearAllFilters = () => {
        let searchInput = document.getElementById("search") as HTMLInputElement;
        let selectedSubjects = document.querySelectorAll(".selected");
        const gradeCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].grade"
        ) as NodeListOf<HTMLInputElement>;

        if (searchInput.value !== null) {
            searchInput.value = "";
        }

        selectedSubjects.forEach((subject) => {
            subject.classList.remove("selected");
        });

        selectedSubjects.forEach((subject) => {
            subject.classList.remove("selected");
        });

        gradeCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) checkbox.click();
        });

        setSearchPost([]);
        setSearchString("");
        setFilters([]);
        setGradeFilters([]);
        filterPosts();
    };

    const clearSubjects = () => {
        let selectedSubjects = document.querySelectorAll(".selected");

        selectedSubjects.forEach((subject) => {
            subject.classList.remove("selected");
        });

        setFilters([]);
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

            <div class="clear-filters-btns flex flex-wrap items-center justify-center">
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

            <div class="h-fit">
                <CategoryCarousel filterPosts={setCategoryFilter} />
            </div>

            <div class="flex min-w-[270px] flex-col items-center md:h-full md:flex-row md:items-start">
                <div class="w-11/12 md:mr-4 md:w-56">
                    <GradeFilter filterPostsByGrade={filterPostsByGrade} />
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

                    <div class="inline md:hidden">
                        <MobileViewCard posts={currentPosts()} />
                    </div>
                </div>
            </div>
        </div>
    );
};
