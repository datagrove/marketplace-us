//TODO: Need to add a Country filter for future phases
import type { Component } from "solid-js";
import { createEffect, createSignal, For } from "solid-js";

import { supabase } from "../../lib/supabaseClient";
// import { productCategoryData } from '../../data'
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { check } from "prettier";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;

let major_municipalities: Array<{ major_municipality: string; id: number }> =
  [];
// let minor_municipalities: Array<{
//   minor_municipality: string;
//   id: number;
//   major_municipality: number;
// }> = [];
// let governing_districts: Array<{
//   governing_district: string;
//   id: number;
//   minor_municipality: number;
// }> = [];

const { data: major_municipality, error: major_municipality_error } =
  await supabase.from("major_municipality").select("major_municipality, id");

if (major_municipality_error) {
  console.log("supabase error: " + major_municipality_error.message);
} else {
  major_municipality.forEach((location) => {
    major_municipalities.push({
      major_municipality: location.major_municipality,
      id: location.id,
    });
  });
  major_municipalities.sort((a, b) =>
    a.major_municipality > b.major_municipality ? 0 : -1,
  );
}

// const { data: minor_municipality, error: minor_municipality_error } =
//   await supabase
//     .from("minor_municipality")
//     .select("minor_municipality, id, major_municipality");
//
// if (minor_municipality_error) {
//   console.log("supabase error: " + minor_municipality_error.message);
// } else {
//   minor_municipality.forEach((location) => {
//     minor_municipalities.push({
//       minor_municipality: location.minor_municipality,
//       id: location.id,
//       major_municipality: location.major_municipality,
//     });
//   });
//   minor_municipalities.sort((a, b) =>
//     a.minor_municipality > b.minor_municipality ? 0 : -1
//   );
// }
//
// const { data: governing_district, error: governingDistrictError } =
//   await supabase
//     .from("governing_district")
//     .select("governing_district, id, minor_municipality");
//
// if (governingDistrictError) {
//   console.log("supabase error: " + governingDistrictError.message);
// } else {
//   governing_district.forEach((location) => {
//     governing_districts.push({
//       governing_district: location.governing_district,
//       id: location.id,
//       minor_municipality: location.minor_municipality,
//     });
//   });
//   governing_districts.sort((a, b) =>
//     a.governing_district > b.governing_district ? 0 : -1
//   );
// }

interface Props {
  // Define the type for the filterPosts prop
  filterPostsByMajorMunicipality: (location: string) => void;
  // filterPostsByMinorMunicipality: (location: string) => void;
  // filterPostsByGoverningDistrict: (location: string) => void;
}

export const LocationFilter: Component<Props> = (props) => {
  const [majorMunicipalities, setMajorMunicipalities] =
    createSignal<Array<{ major_municipality: string; id: number }>>(
      major_municipalities,
    );
  // const [minorMunicipalities, setMinorMunicipalities] = createSignal<
  //   Array<{
  //     minor_municipality: string;
  //     id: number;
  //     major_municipality: number;
  //   }>
  // >(minor_municipalities);
  // const [governingDistricts, setGoverningDistricts] = createSignal<
  //   Array<{
  //     governing_district: string;
  //     id: number;
  //     minor_municipality: number;
  //   }>
  // >(governing_districts);
  const [locationFilters, setLocationFilters] = createSignal<
    Array<{ major_municipality: string; id: number }>
  >([]);
  // const [minorLocationFilters, setMinorLocationFilters] = createSignal<
  //   Array<{
  //     minor_municipality: string;
  //     id: number;
  //     major_municipality: number;
  //   }>
  // >([]);
  // const [governingLocationFilters, setGoverningLocationFilters] = createSignal<
  //   Array<{
  //     governing_district: string;
  //     id: number;
  //     minor_municipality: number;
  //   }>
  // >([]);
  //
  // let filteredMinorMunis: Array<{
  //   minor_municipality: string;
  //   id: number;
  //   major_municipality: number;
  // }> = [];
  // let filteredGoverningDistricts: Array<{
  //   governing_district: string;
  //   id: number;
  //   minor_municipality: number;
  // }> = [];

  const setMajorMuniFilter = (item: {
    major_municipality: string;
    id: number;
  }) => {
    if (locationFilters().includes(item)) {
      let currentLocationFilters = locationFilters().filter(
        (el) => el !== item,
      );
      setLocationFilters(currentLocationFilters);
    } else {
      setLocationFilters([...locationFilters(), item]);
    }
    props.filterPostsByMajorMunicipality(item.major_municipality);
  };

  // createEffect(() => {
  //   filteredMinorMunis = [];
  //
  //   locationFilters().forEach((item) => {
  //     let currentMinorMunis = minor_municipalities.filter(
  //       (el) => el.major_municipality === item.id
  //     );
  //     filteredMinorMunis = [...filteredMinorMunis, ...currentMinorMunis];
  //   });
  //
  //   if (locationFilters().length === 0) {
  //     filteredMinorMunis = minor_municipalities;
  //   }
  //   setMinorMunicipalities(filteredMinorMunis);
  // });
  //
  // const setMinorMuniFilter = (item: {
  //   minor_municipality: string;
  //   id: number;
  //   major_municipality: number;
  // }) => {
  //   if (minorLocationFilters().includes(item)) {
  //     let currentMinorLocationFilters = minorLocationFilters().filter(
  //       (el) => el !== item
  //     );
  //     setMinorLocationFilters(currentMinorLocationFilters);
  //   } else {
  //     setMinorLocationFilters([...minorLocationFilters(), item]);
  //   }
  //   props.filterPostsByMinorMunicipality(item.minor_municipality);
  // };
  //
  // createEffect(() => {
  //   filteredGoverningDistricts = [];
  //
  //   minorLocationFilters().forEach((item) => {
  //     let currentGoverningDistricts = governing_districts.filter(
  //       (el) => el.minor_municipality === item.id
  //     );
  //     filteredGoverningDistricts = [
  //       ...filteredGoverningDistricts,
  //       ...currentGoverningDistricts,
  //     ];
  //   });
  //
  //   if (minorLocationFilters().length === 0) {
  //     filteredGoverningDistricts = governing_districts;
  //   }
  //   setGoverningDistricts(filteredGoverningDistricts);
  // });
  //
  // const setGoverningDistrictFilter = (item: {
  //   governing_district: string;
  //   id: number;
  //   minor_municipality: number;
  // }) => {
  //   if (governingLocationFilters().includes(item)) {
  //     let currentGoverningLocationFilters = governingLocationFilters().filter(
  //       (el) => el !== item
  //     );
  //     setGoverningLocationFilters(currentGoverningLocationFilters);
  //   } else {
  //     setGoverningLocationFilters([...governingLocationFilters(), item]);
  //   }
  //   props.filterPostsByGoverningDistrict(item.governing_district);
  // };
  //
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
          {/*Major Municipality*/}
          <div class="px-4">
            <details class="rounded shadow md:hidden bg-background1 group/majorMunicipality dark:bg-background1-DM">
              <summary class="flex relative flex-wrap justify-between items-center list-none rounded cursor-pointer group-open/majorMunicipality:rounded-b-none group-open/majorMunicipality:z-[1]">
                <div class="flex items-center pb-1">
                  <h2 class="flex flex-1 font-bold text-ptext1 dark:text-ptext1-DM">
                    {t("formLabels.majorMunicipality")}
                  </h2>
                </div>

                {/*Creates the Dropdown Arrow*/}
                <div class="flex justify-center items-center w-10">
                  <div class="ml-2 border-8 border-transparent transition-transform border-l-border1 group-open/majorMunicipality:rotate-90 dark:border-l-border1-DM"></div>
                </div>
              </summary>
              <div class="px-4">
                <div class="text-left rounded h-42 flex-column">
                  <div class="grid overflow-auto mr-4 ml-8 text-left h-42">
                    <For each={majorMunicipalities()}>
                      {(item) => (
                        <div class="flex flex-row w-11/12">
                          <div class="inline">
                            <input
                              aria-label={
                                t("ariaLabels.checkboxMajorMunicipality") +
                                item.major_municipality
                              }
                              type="checkbox"
                              class="mr-4 leading-tight major-muni"
                              onClick={() => {
                                setMajorMuniFilter(item);
                              }}
                            />
                          </div>
                          <div class="inline">
                            <span class="text-ptext1 dark:text-ptext1-DM">
                              {item.major_municipality}
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
          {/*Minor Municipality*/}
          {/*

          */}
          {/*Governing District*/}
        </details>
      </div>
      {/* Filter Menus for md+ view */}
    </div>
  );
};
