import type { Component } from "solid-js";
import { createEffect, createSignal, For } from "solid-js";

import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";


const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;

let grades: Array<{ grade: string; id: number }> =
  [];

const { data: gradeData, error: gradeError } =
  await supabase.from("grade_level").select('*');

if (gradeError) {
  console.log("supabase error: " + gradeError.message);
} else {
  gradeData.forEach((grade) => {
    grades.push({
      grade: grade.grade,
      id: grade.id,
    });
  });
  grades.sort((a, b) =>
    a.id > b.id ? 0 : -1,
  );
}


interface Props {
  // Define the type for the filterPosts prop
  filterPostsByGrade: (grade: string) => void;
}

export const GradeFilter: Component<Props> = (props) => {
  const [grade, setGrade] = createSignal<Array<{ grade: string; id: number }>>(grades);
  const [gradeFilters, setGradeFilters] = createSignal<Array<{ grade: string; id: number }>>([]);


  const setGradesFilter = (item: {
    grade: string;
    id: number;
  }) => {
    if (gradeFilters().includes(item)) {
      let currentGradeFilters = gradeFilters().filter(
        (el) => el !== item,
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
        <details class="mx-1 mb-4 rounded border shadow md:hidden bg-background1 group border-border1 dark:bg-background1-DM dark:border-border1-DM">
          <summary class="flex relative flex-wrap items-center list-none rounded cursor-pointer group-open:rounded-b-none group-open:z-[1]">
            <h2 class="flex flex-1 p-2 font-bold">{t("buttons.filters")}</h2>
            {/*Creates the Dropdown Arrow*/}
            <div class="flex justify-center items-center w-10">
              <div class="ml-2 border-8 border-transparent transition-transform border-l-border1 group-open:rotate-90 dark:border-l-border1-DM"></div>
            </div>
          </summary>
          {/*Grade*/}
          <div class="px-4">
            <details class="rounded shadow md:hidden bg-background1 group/Grade dark:bg-background1-DM">
              <summary class="flex relative flex-wrap justify-between items-center list-none rounded cursor-pointer group-open/Grade:rounded-b-none group-open/Grade:z-[1]">
                <div class="flex items-center pb-1">
                  <h2 class="flex flex-1 font-bold text-ptext1 dark:text-ptext1-DM">
                    {t("formLabels.grades")}
                  </h2>
                </div>

                {/*Creates the Dropdown Arrow*/}
                <div class="flex justify-center items-center w-10">
                  <div class="ml-2 border-8 border-transparent transition-transform border-l-border1 group-open/Grade:rotate-90 dark:border-l-border1-DM"></div>
                </div>
              </summary>
              <div class="px-4">
                <div class="text-left rounded h-42 flex-column">
                  <div class="grid overflow-auto mr-4 ml-8 text-left h-42">
                    <For each={grade()}>
                      {(item) => (
                        <div class="flex flex-row w-11/12">
                          <div class="inline">
                            <input
                              aria-label={
                                t("ariaLabels.checkboxGrade") +
                                item.grade
                              }
                              type="checkbox"
                              class="mr-4 leading-tight grade"
                              onClick={() => {
                                setGradesFilter(item);
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
      <div class="hidden md:block bg-background1 dark:bg-background1-DM w-full md:rounded-lg md:border-2 md:border-border2 dark:md:border-border2-DM">
        {/*Grade*/}
        <div class="md:h-56 md:flex-column md:text-left md:border-b-2 md:rounded md:border-border2 dark:md:border-border2-DM">
          <div class="flex flex-wrap justify-between">
            <div class="w-4/5 pl-4">{t("formLabels.grades")}</div>
          </div>

          <div class="md:grid md:text-left md:mr-4 md:ml-8 md:h-fit md:overflow-auto">
            <For each={grade()}>
              {(item) => (
                <div>
                  <input
                    aria-label={
                      t("ariaLabels.checkboxGrade") +
                      item.grade
                    }
                    type="checkbox"
                    class="grade leading-tight mr-4"
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
