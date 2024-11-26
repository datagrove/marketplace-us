import type { Component } from "solid-js";
import { createSignal, For, onMount } from "solid-js";
import supabase from "@lib/supabaseClientServer";
import { useTranslations } from "../../i18n/utils";

interface Props {
    lang: "en" | "es" | "fr";
}

export const HomeStickyFilters: Component<Props> = (props) => {
    const [lang, setLang] = createSignal<"en" | "es" | "fr">(props.lang);
    const [subjects, setSubjects] =
        createSignal<Array<{ product_subject: string; id: number }>>();
    const [grades, setGrades] = createSignal<
        Array<{ grade: string; id: number }>
    >([]);
    const [selectedGrades, setSelectedGrades] = createSignal<Array<string>>([]);

    const language = lang();

    onMount(async () => {
        const { data: gradeData, error: grade_error } = await supabase
            .from("grade_level")
            .select("grade, id");

        if (grade_error) {
            console.log("supabase error: " + grade_error.message);
        } else {
            setGrades(gradeData);
        }

        //all subjects in the database
        let subjects_array: Array<{ product_subject: string; id: number }> = [];

        const { data: subject, error: subject_error } = await supabase
            .from("post_subject")
            .select("subject, id")
            .order("subject", { ascending: true });

        if (subject_error) {
            console.error("supabase error: " + subject_error.message);
        } else {
            subject.forEach((subject) => {
                subjects_array.push({
                    product_subject: subject.subject,
                    id: subject.id,
                });
            });
            subjects_array.sort((a, b) =>
                a.product_subject > b.product_subject ? 0 : -1
            );
            setSubjects(subjects_array);
        }
    });

    const t = useTranslations(lang());
    //selected subjects
    let selected_subjects_array: Array<string> = [];

    function hideFilterDivs() {
        hideGradeFilters();
        hideSubjectFilters();
        hideResourceTypeFilters();
    }

    function showGradeFilters() {
        let gradeDiv = document.getElementById("gradeDiv");

        if (gradeDiv?.classList.contains("hidden")) {
            gradeDiv.classList.remove("hidden");
            gradeDiv.classList.add("inline");

            hideSubjectFilters();
            hideResourceTypeFilters();
        } else if (gradeDiv?.classList.contains("inline")) {
            gradeDiv?.classList.remove("inline");
            gradeDiv?.classList.add("hidden");
        }
    }

    function hideGradeFilters() {
        let gradeDiv = document.getElementById("gradeDiv");

        if (gradeDiv?.classList.contains("inline")) {
            gradeDiv.classList.remove("inline");
            gradeDiv.classList.add("hidden");
        }
    }

    function showSubjectFilters() {
        let subjectDiv = document.getElementById("subjectDiv");

        if (subjectDiv?.classList.contains("hidden")) {
            subjectDiv.classList.remove("hidden");
            subjectDiv.classList.add("inline");

            hideGradeFilters();
            hideResourceTypeFilters();
        } else {
            subjectDiv?.classList.remove("inline");
            subjectDiv?.classList.add("hidden");
        }
    }

    function hideSubjectFilters() {
        let subjectDiv = document.getElementById("subjectDiv");

        if (subjectDiv?.classList.contains("inline")) {
            subjectDiv.classList.remove("inline");
            subjectDiv.classList.add("hidden");
        }
    }

    function showResourceTypeFilters() {
        let resourceTypeFilterDiv = document.getElementById("resourceTypeDiv");

        if (resourceTypeFilterDiv?.classList.contains("hidden")) {
            resourceTypeFilterDiv.classList.remove("hidden");
            resourceTypeFilterDiv.classList.add("inline");

            hideSubjectFilters();
            hideGradeFilters();
        } else if (resourceTypeFilterDiv?.classList.contains("inline")) {
            resourceTypeFilterDiv?.classList.remove("inline");
            resourceTypeFilterDiv?.classList.add("hidden");
        }
    }

    function hideResourceTypeFilters() {
        let resourceTypeFilterDiv = document.getElementById("resourceTypeDiv");

        if (resourceTypeFilterDiv?.classList.contains("inline")) {
            resourceTypeFilterDiv.classList.remove("inline");
            resourceTypeFilterDiv.classList.add("hidden");
        }
    }

    function addSelectedSubject(id: string) {
        let subjectErrorMessage = document.getElementById(
            "selectSubjectMessage"
        );

        subjectErrorMessage?.classList.remove("inline");
        subjectErrorMessage?.classList.add("hidden");

        if (selected_subjects_array.includes(id)) {
            let currentSubjectFilters = selected_subjects_array.filter(
                (el) => el !== id
            );
            selected_subjects_array = currentSubjectFilters;
        } else {
            selected_subjects_array.push(id);
        }
        console.log(selected_subjects_array);
    }

    function fetchFilteredResources() {
        if (selected_subjects_array.length < 1) {
            let errorMessage = document.getElementById("selectSubjectMessage");
            let subjectCheckboxes =
                document.getElementsByClassName("subjectCheckbox");

            errorMessage?.classList.remove("hidden");
            errorMessage?.classList.add("inline");

            let check = setInterval(function () {
                for (let i = 0; i < subjectCheckboxes.length; i++) {
                    subjectCheckboxes[i].addEventListener("change", () => {
                        clearInterval(check);
                    });
                }
                errorMessage?.classList.remove("inline");
                errorMessage?.classList.add("hidden");
            }, 5000);
        } else {
            localStorage.setItem(
                "selectedSubjects",
                JSON.stringify(selected_subjects_array)
            );
            window.location.href = `/${language}/resources`;
        }
    }

    function selectGrades(id: string) {
        if (selectedGrades().includes(id)) {
            let currentGradeFilters = selectedGrades().filter(
                (el) => el !== id
            );
            setSelectedGrades(currentGradeFilters);
        } else {
            setSelectedGrades([...selectedGrades(), id]);
        }
        console.log(selected_subjects_array);
    }

    window.addEventListener("beforeunload", () => {
        if (selectedGrades().length > 0) {
            localStorage.setItem(
                "selectedGrades",
                JSON.stringify(selectedGrades())
            );
        }
        if (selected_subjects_array.length > 0) {
            localStorage.setItem(
                "selectedSubjects",
                JSON.stringify(selected_subjects_array)
            );
        }
        // if (selectedGrades().length === 0) {
        //     localStorage.removeItem("selectedGrades");
        // }
    });

    return (
        <div class="sticky top-0 z-40">
            <div
                id="top-sticky-filter"
                class="sticky top-0 flex w-full items-center justify-center bg-background2 py-1 dark:bg-background2-DM"
            >
                <a onmouseover={hideFilterDivs} href={`/${language}/resources`}>
                    <div class="mx-5 hidden text-xl text-ptext2 dark:text-ptext2-DM md:inline">
                        {t("buttons.browseCatalog")}
                    </div>
                </a>

                <div>
                    <div
                        onclick={showGradeFilters}
                        class="relative mx-5 mt-3 min-h-[44px] min-w-[44px] text-xl text-ptext2 dark:text-ptext2-DM md:my-2 md:min-h-px md:min-w-px"
                    >
                        {t("formLabels.grades")}
                    </div>
                    <div
                        onmouseleave={hideGradeFilters}
                        id="gradeDiv"
                        class="absolute top-16 z-40 hidden max-h-[50svh] overflow-y-auto rounded border-2 border-border1 bg-background1 dark:border-border1-DM dark:bg-background1-DM"
                    >
                        <div class="flex h-5/6 flex-wrap">
                            <For each={grades()}>
                                {(grade) => (
                                    <div class="flex w-1/2 pl-1 pr-4">
                                        <div class="flex items-center">
                                            <input
                                                aria-label={`"replace"`}
                                                type="checkbox"
                                                id={`gradeCheckbox ${grade.id.toString()}`}
                                                onClick={() =>
                                                    selectGrades(
                                                        grade.id.toString()
                                                    )
                                                }
                                                class="gradeCheckbox h-[24px] w-[24px]"
                                            />
                                        </div>

                                        <label
                                            for={`gradeCheckbox ${grade.id.toString()}`}
                                            class="flex min-h-[44px] min-w-[44px] items-center pb-1 pl-1 pt-1 align-text-top text-xl md:min-h-px md:min-w-px"
                                        >
                                            {grade.grade}
                                        </label>
                                    </div>
                                )}
                            </For>
                        </div>

                        <div class="flex flex-col items-center justify-center ">
                            <a href={`/${language}/resources`}>
                                <button class="btn-primary mx-2 my-2 min-h-[59px] min-w-[59px] rounded-full  px-4 py-1 md:min-h-px md:min-w-px">
                                    {t("buttons.findResources")}
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="flex">
                    <div
                        onclick={showSubjectFilters}
                        class="relative mx-5 mt-3 min-h-[44px] min-w-[44px] text-xl text-ptext2 dark:text-ptext2-DM md:my-2 md:min-h-px md:min-w-px"
                    >
                        {t("formLabels.subjects")}
                    </div>
                    <div
                        onmouseleave={hideSubjectFilters}
                        id="subjectDiv"
                        class="absolute top-16 z-40 hidden max-h-[50svh] overflow-y-auto rounded border-2 border-border1 bg-background1 dark:border-border1-DM dark:bg-background1-DM"
                    >
                        {/* <p class="px-2">Add Subjects here</p> */}
                        <For each={subjects()}>
                            {(subject) => (
                                <div class="flex items-center pl-1 pr-4">
                                    <div>
                                        <input
                                            aria-label="replace"
                                            type="checkbox"
                                            id={`subjectCheckbox ${subject.id.toString()}`}
                                            onClick={() =>
                                                addSelectedSubject(
                                                    subject.id.toString()
                                                )
                                            }
                                            class="subjectCheckbox h-[24px] w-[24px]"
                                        />
                                    </div>

                                    <label
                                        for={`subjectCheckbox ${subject.id.toString()}`}
                                        class="flex min-h-[59px] min-w-[59px] items-center pb-1 pl-1 align-text-top text-xl md:min-h-px md:min-w-px"
                                    >
                                        {subject.product_subject}
                                    </label>
                                </div>
                            )}
                        </For>

                        <div class="flex flex-col items-center justify-center">
                            <div
                                id="selectSubjectMessage"
                                class="hidden px-2 text-center italic text-alert1 dark:text-alert1-DM"
                            >
                                {t("messages.selectSubject")}
                            </div>

                            <button
                                class="btn-primary mx-2  my-2 min-h-[59px] min-w-[59px] px-4 py-1 md:min-h-px md:min-w-px"
                                onclick={fetchFilteredResources}
                            >
                                {t("buttons.findResources")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* <div>
                    <h3
                        onclick={showResourceTypeFilters}
                        class="relative mx-5 text-ptext2 dark:text-ptext2-DM"
                    >
                        {t("formLabels.resourceTypes")}
                    </h3>
                    <div
                        onmouseleave={hideResourceTypeFilters}
                        id="resourceTypeDiv"
                        class="absolute top-8 z-40 hidden h-64 w-48 rounded border-2 border-border1 bg-background1 dark:border-border1-DM dark:bg-background1-DM"
                    >
                        <p class="px-2">Add Resource Types here</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
};
