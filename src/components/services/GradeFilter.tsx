import type { Component } from "solid-js";
import { createEffect, createSignal, For } from "solid-js";

import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;

let grades: Array<{ grade: string; id: number }> = [];

const { data: gradeData, error: gradeError } = await supabase
    .from("grade_level")
    .select("*");

if (gradeError) {
    console.log("supabase error: " + gradeError.message);
} else {
    gradeData.forEach((grade) => {
        grades.push({
            grade: grade.grade,
            id: grade.id,
        });
    });
    grades.sort((a, b) => (a.id > b.id ? 0 : -1));
}

interface Props {
    // Define the type for the filterPosts prop
    filterPostsByGrade: (grade: string) => void;
}

export const GradeFilter: Component<Props> = (props) => {
    const [grade, setGrade] =
        createSignal<Array<{ grade: string; id: number }>>(grades);
    const [gradeFilters, setGradeFilters] = createSignal<
        Array<{ grade: string; id: number }>
    >([]);

    const setGradesFilter = (item: { grade: string; id: number }) => {
        if (gradeFilters().includes(item)) {
            let currentGradeFilters = gradeFilters().filter(
                (el) => el !== item
            );
            setGradeFilters(currentGradeFilters);
        } else {
            setGradeFilters([...gradeFilters(), item]);
        }
        props.filterPostsByGrade(item.id.toString());
    };

    return (
        <div>
            {/* Container for Mobile View */}
            <div class="container">
                {/*Mobile Filters Main Group*/}
                <details class="group mx-1 mb-4 rounded border border-border1 bg-background1 shadow dark:border-border1-DM dark:bg-background1-DM md:hidden">
                    <summary class="relative flex cursor-pointer list-none flex-wrap items-center rounded group-open:z-[1] group-open:rounded-b-none">
                        <h2 class="flex flex-1 p-2 font-bold">
                            {t("buttons.filters")}
                        </h2>
                        {/*Creates the Dropdown Arrow*/}
                        <div class="flex w-10 items-center justify-center">
                            <div class="ml-2 border-8 border-transparent border-l-border1 transition-transform group-open:rotate-90 dark:border-l-border1-DM"></div>
                        </div>
                    </summary>
                    {/*Grade*/}
                    <div class="px-4">
                        <details class="group/Grade rounded bg-background1 shadow dark:bg-background1-DM md:hidden">
                            <summary class="relative flex cursor-pointer list-none flex-wrap items-center justify-between rounded group-open/Grade:z-[1] group-open/Grade:rounded-b-none">
                                <div class="flex items-center pb-1">
                                    <h2 class="flex flex-1 font-bold text-ptext1 dark:text-ptext1-DM">
                                        {t("formLabels.grades")}
                                    </h2>
                                </div>

                                {/*Creates the Dropdown Arrow*/}
                                <div class="flex w-10 items-center justify-center">
                                    <div class="ml-2 border-8 border-transparent border-l-border1 transition-transform group-open/Grade:rotate-90 dark:border-l-border1-DM"></div>
                                </div>
                            </summary>
                            <div class="px-4">
                                <div class="h-42 flex-column rounded text-left">
                                    <div class="h-42 ml-8 mr-4 grid overflow-auto text-left">
                                        <For each={grade()}>
                                            {(item) => (
                                                <div class="flex w-11/12 flex-row">
                                                    <div class="inline">
                                                        <input
                                                            aria-label={
                                                                t(
                                                                    "ariaLabels.checkboxGrade"
                                                                ) + item.grade
                                                            }
                                                            type="checkbox"
                                                            class="grade mr-4 leading-tight"
                                                            onClick={() => {
                                                                setGradesFilter(
                                                                    item
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div class="inline">
                                                        <span class="text-ptext1 dark:text-ptext1-DM">
                                                            {item.grade}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </For>
                                    </div>
                                </div>
                            </div>
                        </details>
                    </div>
                </details>
            </div>
            {/* Filter Menus for md+ view */}
            <div class="hidden w-full bg-background1 dark:bg-background1-DM md:block md:rounded-lg md:border-2 md:border-border2 dark:md:border-border2-DM">
                {/*Grade*/}
                <div class="md:flex-column md:h-56 md:rounded md:border-b-2 md:border-border2 md:text-left dark:md:border-border2-DM">
                    <div class="flex flex-wrap justify-between">
                        <div class="w-4/5 pl-4">{t("formLabels.grades")}</div>
                    </div>

                    <div class="md:ml-8 md:mr-4 md:grid md:h-fit md:overflow-auto md:text-left">
                        <For each={grade()}>
                            {(item) => (
                                <div>
                                    <input
                                        aria-label={
                                            t("ariaLabels.checkboxGrade") +
                                            item.grade
                                        }
                                        type="checkbox"
                                        class="grade mr-4 leading-tight"
                                        onClick={() => {
                                            setGradesFilter(item);
                                        }}
                                    />
                                    <span class="text-ptext1 dark:text-ptext1-DM">
                                        {item.grade}
                                    </span>
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            </div>
        </div>
    );
};
