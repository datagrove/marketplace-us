import type { Component } from "solid-js";
import { createSignal, For } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import * as allFilters from "../posts/fetchPosts";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject
const productCategories = values.subjectCategoryInfo.subjects

//all subjects in the database
let subjects_array: Array<{ product_subject: string; id: number }> = [];
//selected subjects
let selected_subjects_array: Array<string> = [];

let grades_array: Array<{ product_grade: string; id: number }> = [];
let selected_grades_array: Array<string> = [];

const { data: subject, error: subject_error } = await supabase.from("post_subject").select("subject, id");
const { data: grade, error: grade_error } = await supabase.from("grade_level").select("id, grade");

if(subject_error) {
    console.error("supabase error: " + subject_error.message);
} else {
    subject.forEach((subject) => {
        subjects_array.push({
            product_subject: subject.subject,
            id: subject.id,
        });
    });
    subjects_array.sort((a, b) => a.product_subject > b.product_subject ? 0 : -1, );
}

if(grade_error) {
    console.error("supabase error: " + grade_error);
} else {
    grade.forEach((grade) => {
        grades_array.push({
            product_grade: grade.grade,
            id: grade.id,
        });
    });
    grades_array.sort((a, b) => a.product_grade > b.product_grade ? 0 : -1);
}   

function hideFilterDivs() {
    hideGradeFilters();
    hideSubjectFilters();
    hideResourceTypeFilters();
}

function showGradeFilters() {
    let gradeDiv = document.getElementById("gradeDiv");

    if(gradeDiv?.classList.contains("hidden")) {
        gradeDiv.classList.remove("hidden");
        gradeDiv.classList.add("flex")
    
        hideSubjectFilters();
        hideResourceTypeFilters();
    } else if(gradeDiv?.classList.contains("flex")) {
        gradeDiv?.classList.remove("flex");
        gradeDiv?.classList.add("hidden");
    }
}

function hideGradeFilters() {
    let gradeDiv = document.getElementById("gradeDiv");

    if(gradeDiv?.classList.contains("flex")) {
        gradeDiv.classList.remove("flex");
        gradeDiv.classList.add("hidden")
    }
}

function showSubjectFilters() {
    let subjectDiv = document.getElementById("subjectDiv");
    
    if(subjectDiv?.classList.contains("hidden")) {
        subjectDiv.classList.remove("hidden");
        subjectDiv.classList.add("inline")

        hideGradeFilters();
        hideResourceTypeFilters();
    } else {
        subjectDiv?.classList.remove("inline");
        subjectDiv?.classList.add("hidden")
    }
}

function hideSubjectFilters() {
    let subjectDiv = document.getElementById("subjectDiv");

    if(subjectDiv?.classList.contains("inline")) {
        subjectDiv.classList.remove("inline");
        subjectDiv.classList.add("hidden")
    }
}

function showResourceTypeFilters() {
    let resourceTypeFilterDiv = document.getElementById("resourceTypeDiv");

    if(resourceTypeFilterDiv?.classList.contains("hidden")) {
        resourceTypeFilterDiv.classList.remove("hidden");
        resourceTypeFilterDiv.classList.add("inline");

        hideSubjectFilters();
        hideGradeFilters();
    } else if(resourceTypeFilterDiv?.classList.contains("inline")) {
        resourceTypeFilterDiv?.classList.remove("inline");
        resourceTypeFilterDiv?.classList.add("hidden");
    }
}

function hideResourceTypeFilters() {
    let resourceTypeFilterDiv = document.getElementById("resourceTypeDiv");

    if(resourceTypeFilterDiv?.classList.contains("inline")) {
        resourceTypeFilterDiv.classList.remove("inline");
        resourceTypeFilterDiv.classList.add("hidden")
    }
}

function addSelectedSubject(id: any) {
    let subjectErrorMessage = document.getElementById("selectSubjectMessage");

    subjectErrorMessage?.classList.remove("inline");
    subjectErrorMessage?.classList.add("hidden");
    
    selected_subjects_array.push(id)
}

function addSelectedGrade(id: any) {
    let gradeErrorMessage = document.getElementById("selectGradeMessage");

    gradeErrorMessage?.classList.remove("inline");
    gradeErrorMessage?.classList.add("hidden");

    selected_grades_array.push(id);
}

function fetchSubjectFilteredResources() {
    if(selected_subjects_array.length < 1) {
        let errorMessage = document.getElementById("selectSubjectMessage");
        let subjectCheckboxes = document.getElementsByClassName("subjectCheckbox");

        errorMessage?.classList.remove("hidden");
        errorMessage?.classList.add("inline");

        let check = setInterval(function() {
            for(let i = 0; i < subjectCheckboxes.length; i++) {
                subjectCheckboxes[i].addEventListener("change", () => {
                    clearInterval(check);
                })
            }
            errorMessage?.classList.remove("inline");
            errorMessage?.classList.add("hidden");

        }, 5000);
    } else {
        localStorage.setItem("selectedSubjects", JSON.stringify(selected_subjects_array))
        window.location.href= `/${lang}/services`;
    }
}

function fetchGradeFilteredResources() {
    if(selected_grades_array.length < 1) {
        let errorMessage = document.getElementById("selectGradeMessage");
        let gradeCheckboxes = document.getElementsByClassName("gradeCheckbox");

        errorMessage?.classList.remove("hidden");
        errorMessage?.classList.add("inline");

        let check = setInterval(function() {
            for(let i = 0; i < gradeCheckboxes.length; i++) {
                gradeCheckboxes[i].addEventListener("change", () => {
                    clearInterval(check);
                })
            }
            errorMessage?.classList.remove("inline");
            errorMessage?.classList.add("hidden");

        }, 5000);
    } else {
        localStorage.setItem("selectedGrades", JSON.stringify(selected_grades_array))
        window.location.href= `/${lang}/services`;
    }
}

export const HomeStickyFilters: Component = () => {
    const [subjects, setSubjects] = createSignal<Array<{ product_subject: string; id: number} >>(subjects_array)
    // const [selectSubjects, setSelectedSubjects] = createSignal<Array<{ product_subject: string; id: number }>>([]);
    
    return (
        <div class="sticky top-0 z-40">
            <div id="top-sticky-filter" class="flex justify-center items-center w-full bg-background2 dark:bg-background2-DM py-1 sticky top-0">
                <a onmouseover={ hideFilterDivs } href={ `/${lang}/services` }><h3 class="hidden md:inline mx-5 text-ptext2 dark:text-ptext2-DM">{t("buttons.browseCatalog")}</h3></a>
                
                <div>
                    <h3 onclick={ showGradeFilters } class="mx-5 text-ptext2 dark:text-ptext2-DM relative">{t("formLabels.grades")}</h3>
                    <div onmouseleave={ hideGradeFilters } id="gradeDiv" class="hidden border-2 border-border1 dark:border-border1-DM flex-wrap justify-center h-fit w-48 absolute top-8 rounded bg-background1 dark:bg-background1-DM z-50">
                        <For each={ grades_array }>
                            {(grade) => (
                                <div class="flex pl-2 pr-4 w-1/2">
                                    <div>
                                        <input 
                                            aria-label="replace"
                                            type="checkbox"
                                            onClick={ () => addSelectedGrade(grade.id) }
                                            class="gradeCheckbox"
                                        />
                                    </div>

                                    <div class="pl-1">
                                        { grade.product_grade }
                                    </div>
                                </div>
                            )}
                        </For>

                        <div class="flex flex-col justify-center items-center">
                            <div id="selectGradeMessage" class="hidden text-alert1 dark:text-alert1-DM text-center italic px-2">
                                {t("messages.selectGrade")}
                            </div>
                            
                            <button
                                class="px-4 mx-2 my-2 py-1 rounded-full bg-btn2 dark:bg-btn2-DM"
                                onclick={ fetchGradeFilteredResources }
                            >
                                {t("buttons.findResources")}
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 onclick={ showSubjectFilters} class="mx-5 text-ptext2 dark:text-ptext2-DM relative">{t("formLabels.subjects")}</h3>
                    <div onmouseleave={ hideSubjectFilters } id="subjectDiv" class="hidden border-2 border-border1 dark:border-border1-DM absolute top-8 rounded bg-background1 dark:bg-background1-DM z-50">
                        {/* <p class="px-2">Add Subjects here</p> */}
                        <For each={ subjects_array }>
                            {(subject) => (
                                <div class="flex pl-2 pr-4">
                                    <div>
                                        <input 
                                            aria-label="replace"
                                            type="checkbox"
                                            onClick={ () => addSelectedSubject(subject.id) }
                                            class="subjectCheckbox"
                                        />
                                    </div>

                                    <div class="pl-1">
                                        { subject.product_subject }
                                    </div>
                                </div>
                            )}
                        </For>

                        <div class="flex flex-col justify-center items-center">
                            <div id="selectSubjectMessage" class="hidden text-alert1 dark:text-alert1-DM text-center italic px-2">
                                {t("messages.selectSubject")}
                            </div>
                            
                            <button
                                class="px-4 mx-2 my-2 py-1 rounded-full bg-btn2 dark:bg-btn2-DM"
                                onclick={ fetchSubjectFilteredResources }
                            >
                                {t("buttons.findResources")}
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 onclick={ showResourceTypeFilters } class="mx-5 text-ptext2 dark:text-ptext2-DM relative">{t("formLabels.resourceTypes")}</h3>
                    <div onmouseleave={ hideResourceTypeFilters } id="resourceTypeDiv" class="hidden border-2 border-border1 dark:border-border1-DM h-64 w-48 absolute top-8 rounded bg-background1 dark:bg-background1-DM z-50">
                        <p class="px-2">Add Resource Types here</p>
                    </div>
                </div>
            </div>
        </div>
    )
}