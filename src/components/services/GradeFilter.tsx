import type { Component } from "solid-js";
import { createEffect, createSignal, For, onMount } from "solid-js";

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
    const [selectedGrades, setSelectedGrades] = createSignal<string[]>([]);

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

    onMount(() => {
        if (localStorage.getItem("selectedGrades")) {
            setSelectedGrades([
                ...JSON.parse(localStorage.getItem("selectedGrades")!),
            ]);
            checkGradeBoxes();
        }
    });

    function checkGradeBoxes() {
        console.log("selectedGrades: ", selectedGrades());
        selectedGrades().map((grade) => {
            let gradeCheckElements = document.getElementsByClassName(
                "grade " + grade
            ) as HTMLCollectionOf<HTMLInputElement>;

            if (gradeCheckElements) {
                for (let i = 0; i < gradeCheckElements.length; i++) {
                    gradeCheckElements[i].checked = true;
                }
            }
        });
    }

    return (
        <div>
            {/* Filter Menus for md+ view */}
            <div class="mt-2 hidden w-full bg-background1 dark:bg-background1-DM md:block md:rounded-lg md:border-2 md:border-border2 dark:md:border-border2-DM">
                {/*Grade*/}
                <div class="md:flex-column flex-wrap pb-2 md:rounded md:border-b-2 md:border-border2 md:text-left dark:md:border-border2-DM">
                    <div class="flex flex-wrap justify-between">
                        <div class="w-4/5 pl-4">{t("formLabels.grades")}</div>
                    </div>

                    <div class="ml-2 md:flex md:h-fit md:flex-wrap md:overflow-auto md:text-left">
                        <For each={grade()}>
                            {(item) => (
                                <div class="flex w-1/2 flex-row">
                                    <input
                                        aria-label={
                                            t("ariaLabels.checkboxGrade") +
                                            " " +
                                            item.grade
                                        }
                                        type="checkbox"
                                        class={`grade ${item.id.toString()} mr-2 leading-tight`}
                                        onClick={() => {
                                            setGradesFilter(item);
                                        }}
                                        id={"grade " + item.id.toString()}
                                    />
                                    <div class="inline-block text-ptext1 dark:text-ptext1-DM">
                                        {item.grade}
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            </div>
        </div>
    );
};
