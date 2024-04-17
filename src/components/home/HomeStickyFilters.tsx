import type { Component } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import * as allFilters from "../posts/fetchPosts";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as unknown as uiObject
const productCategories = values.productCategoryInfo.categories

function hideFilterDivs() {
    hideGradeFilters();
    hideSubjectFilters();
    hideResourceTypeFilters();
}

function showGradeFilters() {
    let gradeDiv = document.getElementById("gradeDiv");
    let subjectDiv = document.getElementById("subjectDiv");
    let resourceTypeDiv = document.getElementById("resourceTypeDiv");

    if(gradeDiv?.classList.contains("hidden")) {
        gradeDiv.classList.remove("hidden");
        gradeDiv.classList.add("inline")
    }

    if(subjectDiv?.classList.contains("inline")) {
        hideSubjectFilters();
    }
    if(resourceTypeDiv?.classList.contains("inline")) {
        hideResourceTypeFilters();
    }

}

function hideGradeFilters() {
    let gradeDiv = document.getElementById("gradeDiv");

    if(gradeDiv?.classList.contains("inline")) {
        gradeDiv.classList.remove("inline");
        gradeDiv.classList.add("hidden")
    }
}

function showSubjectFilters() {
    let subjectDiv = document.getElementById("subjectDiv");
    let gradeDiv = document.getElementById("gradeDiv");
    let resourceTypeDiv = document.getElementById("resourceTypeDiv");

    if(subjectDiv?.classList.contains("hidden")) {
        subjectDiv.classList.remove("hidden");
        subjectDiv.classList.add("inline")
    }

    if(gradeDiv?.classList.contains("inline")) {
        hideGradeFilters();
    }

    if(resourceTypeDiv?.classList.contains("inline")) {
        hideResourceTypeFilters();
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
    let subjectDiv = document.getElementById("subjectDiv");
    let gradeDiv = document.getElementById("gradeDiv");

    if(resourceTypeFilterDiv?.classList.contains("hidden")) {
        resourceTypeFilterDiv.classList.remove("hidden");
        resourceTypeFilterDiv.classList.add("inline")
    }

    if(subjectDiv?.classList.contains("inline")) {
        hideSubjectFilters();
    }

    if(gradeDiv?.classList.contains("inline")) {
        hideGradeFilters();
    }
}

function hideResourceTypeFilters() {
    let resourceTypeFilterDiv = document.getElementById("resourceTypeDiv");

    if(resourceTypeFilterDiv?.classList.contains("inline")) {
        resourceTypeFilterDiv.classList.remove("inline");
        resourceTypeFilterDiv.classList.add("hidden")
    }
}

export const HomeStickyFilters: Component = () => {
    return (
        <div class="sticky top-0">
            <div id="top-sticky-filter" class="flex justify-center items-center w-full bg-background2 dark:bg-background2-DM py-1 sticky top-0">
                <a onmouseover={ hideFilterDivs } href={ `/${lang}/services` }><h3 class="hidden md:inline mx-5 text-ptext2 dark:text-ptext2-DM">{t("buttons.browseCatalog")}</h3></a>
                
                <div>
                    <h3 onmouseover={ showGradeFilters }  class="mx-5 text-ptext2 dark:text-ptext2-DM relative">{t("formLabels.grades")}</h3>
                    <div onmouseleave={ hideGradeFilters } id="gradeDiv" class="hidden border-2 border-border1 dark:border-border1-DM h-64 w-48 absolute top-8 rounded bg-background1 dark:bg-background1-DM z-50">
                        <p class="px-2">Add Grades here</p>
                    </div>
                </div>

                <div>
                    <h3 onmouseover={ showSubjectFilters } class="mx-5 text-ptext2 dark:text-ptext2-DM relative">{t("formLabels.subjects")}</h3>
                    <div onmouseleave={ hideSubjectFilters } id="subjectDiv" class="hidden border-2 border-border1 dark:border-border1-DM h-64 w-48 absolute top-8 rounded bg-background1 dark:bg-background1-DM z-50">
                        <p class="px-2">Add Subjects here</p>
                    </div>
                </div>

                <div>
                    <h3 onmouseover={ showResourceTypeFilters } class="mx-5 text-ptext2 dark:text-ptext2-DM relative">{t("formLabels.resourceTypes")}</h3>
                    <div onmouseleave={ hideResourceTypeFilters } id="resourceTypeDiv" class="hidden border-2 border-border1 dark:border-border1-DM h-64 w-48 absolute top-8 rounded bg-background1 dark:bg-background1-DM z-50">
                        <p class="px-2">Add Resource Types here</p>
                    </div>
                </div>
            </div>
        </div>
    )
}