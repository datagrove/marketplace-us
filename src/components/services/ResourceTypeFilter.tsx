
import type { Component } from "solid-js";
import { createEffect, createSignal, For, onMount } from "solid-js";

import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;

let resourceTypes: Array<{ resourceType: string; id: number }> = [];

const { data: type, error: resourceTypeError } = await supabase
  .from("resource_types")
  .select("*");

if (gradeError) {
  console.log("supabase error: " + gradeError.message);
} else {
  type.forEach((type) => {
    resourceTypes.push({
      resourceType: type.type,
      id: type.id,
    });
  });
  resourceTypes.sort((a, b) => (a.id > b.id ? 0 : -1));
}

interface Props {
  // Define the type for the filterPosts prop
  filterPostsByGrade: (grade: string) => void;
}

export const GradeFilter: Component<Props> = (props) => {
  const [type, setType] =
    createSignal<Array<{ resourceType: string; id: number }>>(resourceTypes);
  const [resourceTypeFilters, setResourceTypeFilters] = createSignal<
    Array<{ resourceType: string; id: number }>
  >([]);
  const [selectedResourceTypes, setSelectedResourceTypes] = createSignal<string[]>([]);

  const setResourceTypeFilter = (item: { resourceType: string; id: number }) => {
    if (resourceTypeFilters().includes(item)) {
      let currentGradeFilters = resourceTypeFilters().filter(
        (el) => el !== item
      );
      setResourceTypeFilters(currentGradeFilters);
    } else {
      setResourceTypeFilters([...resourceTypeFilters(), item]);
    }
    props.filterPostsByGrade(item.id.toString());
  };

  onMount(() => {
    if (localStorage.getItem("selectedResourceTypes")) {
      setSelectedResourceTypes([
        ...JSON.parse(localStorage.getItem("selectedGrades")!),
      ]);
      checkResourceTypeBoxes();
    }
  });

  function checkResourceTypeBoxes() {
    console.log("selectedGrades: ", selectedResourceTypes());
    selectedResourceTypes().map((type) => {
      let resourceTypeCheckElements = document.getElementsByClassName(
        "type " + type
      ) as HTMLCollectionOf<HTMLInputElement>;

      if (resourceTypeCheckElements) {
        for (let i = 0; i < resourceTypeCheckElements.length; i++) {
          resourceTypeCheckElements[i].checked = true;
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
            <For each={type()}>
              {(item) => (
                <div class="flex w-1/2 flex-row">
                  <input
                    aria-label={
                      t("ariaLabels.checkboxGrade") +
                      " " +
                      item.resourceType
                    }
                    type="checkbox"
                    class={`grade ${item.id.toString()} mr-2 leading-tight`}
                    onClick={() => {
                      setResourceTypeFilter(item);
                    }}
                    id={"grade " + item.id.toString()}
                  />
                  <div class="inline-block text-ptext1 dark:text-ptext1-DM">
                    {item.resourceType}
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
