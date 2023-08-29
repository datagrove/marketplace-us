//TODO: Need to add a Country filter for future phases
import { Component, createEffect, createSignal, For } from "solid-js";

import { supabase } from "../../lib/supabaseClient";
// import { productCategoryData } from '../../data'
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;

let major_municipalities: Array<{ major_municipality: string; id: number }> =
  [];
let minor_municipalities: Array<{
  minor_municipality: string;
  id: number;
  major_municipality: number;
}> = [];
let governing_districts: Array<{
  governing_district: string;
  id: number;
  minor_municipality: number;
}> = [];

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
    a.major_municipality > b.major_municipality ? 0 : -1
  );
}

const { data: minor_municipality, error: minor_municipality_error } =
  await supabase
    .from("minor_municipality")
    .select("minor_municipality, id, major_municipality");

if (minor_municipality_error) {
  console.log("supabase error: " + minor_municipality_error.message);
} else {
  minor_municipality.forEach((location) => {
    minor_municipalities.push({
      minor_municipality: location.minor_municipality,
      id: location.id,
      major_municipality: location.major_municipality,
    });
  });
  minor_municipalities.sort((a, b) =>
    a.minor_municipality > b.minor_municipality ? 0 : -1
  );
}

const { data: governing_district, error: governingDistrictError } =
  await supabase
    .from("governing_district")
    .select("governing_district, id, minor_municipality");

if (governingDistrictError) {
  console.log("supabase error: " + governingDistrictError.message);
} else {
  governing_district.forEach((location) => {
    governing_districts.push({
      governing_district: location.governing_district,
      id: location.id,
      minor_municipality: location.minor_municipality,
    });
  });
  governing_districts.sort((a, b) =>
    a.governing_district > b.governing_district ? 0 : -1
  );
}

interface Props {
  // Define the type for the filterPosts prop
  filterPostsByMajorMunicipality: (location: string) => void;
  filterPostsByMinorMunicipality: (location: string) => void;
  filterPostsByGoverningDistrict: (location: string) => void;
}

export const LocationFilter: Component<Props> = (props) => {
  const [majorMunicipalities, setMajorMunicipalities] =
    createSignal<Array<{ major_municipality: string; id: number }>>(
      major_municipalities
    );
  const [minorMunicipalities, setMinorMunicipalities] = createSignal<
    Array<{
      minor_municipality: string;
      id: number;
      major_municipality: number;
    }>
  >(minor_municipalities);
  const [governingDistricts, setGoverningDistricts] = createSignal<
    Array<{
      governing_district: string;
      id: number;
      minor_municipality: number;
    }>
  >(governing_districts);
  const [locationFilters, setLocationFilters] = createSignal<
    Array<{ major_municipality: string; id: number }>
  >([]);
  const [minorLocationFilters, setMinorLocationFilters] = createSignal<
    Array<{
      minor_municipality: string;
      id: number;
      major_municipality: number;
    }>
  >([]);
  const [governingLocationFilters, setGoverningLocationFilters] = createSignal<
    Array<{
      governing_district: string;
      id: number;
      minor_municipality: number;
    }>
  >([]);

  let filteredMinorMunis: Array<{
    minor_municipality: string;
    id: number;
    major_municipality: number;
  }> = [];
  let filteredGoverningDistricts: Array<{
    governing_district: string;
    id: number;
    minor_municipality: number;
  }> = [];

  const setMajorMuniFilter = (item: {
    major_municipality: string;
    id: number;
  }) => {
    if (locationFilters().includes(item)) {
      let currentLocationFilters = locationFilters().filter(
        (el) => el !== item
      );
      setLocationFilters(currentLocationFilters);
    } else {
      setLocationFilters([...locationFilters(), item]);
    }
    props.filterPostsByMajorMunicipality(item.major_municipality);
  };

  createEffect(() => {
    filteredMinorMunis = [];

    locationFilters().forEach((item) => {
      let currentMinorMunis = minor_municipalities.filter(
        (el) => el.major_municipality === item.id
      );
      filteredMinorMunis = [...filteredMinorMunis, ...currentMinorMunis];
    });

    if (locationFilters().length === 0) {
      filteredMinorMunis = minor_municipalities;
    }
    setMinorMunicipalities(filteredMinorMunis);
  });

  const setMinorMuniFilter = (item: {
    minor_municipality: string;
    id: number;
    major_municipality: number;
  }) => {
    if (minorLocationFilters().includes(item)) {
      let currentMinorLocationFilters = minorLocationFilters().filter(
        (el) => el !== item
      );
      setMinorLocationFilters(currentMinorLocationFilters);
    } else {
      setMinorLocationFilters([...minorLocationFilters(), item]);
    }
    props.filterPostsByMinorMunicipality(item.minor_municipality);
  };

  createEffect(() => {
    filteredGoverningDistricts = [];

    minorLocationFilters().forEach((item) => {
      let currentGoverningDistricts = governing_districts.filter(
        (el) => el.minor_municipality === item.id
      );
      filteredGoverningDistricts = [
        ...filteredGoverningDistricts,
        ...currentGoverningDistricts,
      ];
    });

    if (minorLocationFilters().length === 0) {
      filteredGoverningDistricts = governing_districts;
    }
    setGoverningDistricts(filteredGoverningDistricts);
  });

  const setGoverningDistrictFilter = (item: {
    governing_district: string;
    id: number;
    minor_municipality: number;
  }) => {
    if (governingLocationFilters().includes(item)) {
      let currentGoverningLocationFilters = governingLocationFilters().filter(
        (el) => el !== item
      );
      setGoverningLocationFilters(currentGoverningLocationFilters);
    } else {
      setGoverningLocationFilters([...governingLocationFilters(), item]);
    }
    props.filterPostsByGoverningDistrict(item.governing_district);
  };

  return (
    <div>
      {/* Container for Mobile View */}
      <div class="container">
        {/*Mobile Filters Main Group*/}
        <details class="bg-background1 dark:bg-black shadow rounded group md:hidden mx-1 mb-4 border border-border1 dark:border-border1-DM">
          <summary class="list-none flex flex-wrap items-center cursor-pointer rounded group-open:rounded-b-none group-open:z-[1] relative">
            <h2 class="flex flex-1 p-2 font-bold">Filters</h2>{" "}
            {/* TODO:Internationalize this */}
            {/*Creates the Dropdown Arrow*/}
            <div class="flex w-10 items-center justify-center">
              <div class="border-8 border-transparent border-l-border1 dark:border-l-border1-DM ml-2 group-open:rotate-90 transition-transform"></div>
            </div>
          </summary>
          {/*Major Municipality*/}
          <div class="px-4">
            <details class="bg-background1 dark:bg-background1-DM shadow rounded group/majorMunicipality md:hidden">
              <summary class="list-none flex flex-wrap items-center cursor-pointer rounded group-open/majorMunicipality:rounded-b-none group-open/majorMunicipality:z-[1] relative">
                <h2 class="flex flex-1 pb-1 font-bold text-ptext1 dark:text-ptext1-DM">
                  {t("formLabels.majorMunicipality")}
                </h2>
                {/*Creates the Dropdown Arrow*/}
                <div class="flex w-10 items-center justify-center">
                  <div class="border-8 border-transparent border-l-border1 dark:border-l-border1-DM ml-2 group-open/majorMunicipality:rotate-90 transition-transform"></div>
                </div>
              </summary>
              <div class="px-4">
                <div class="h-42 flex-column text-left rounded">
                  <ul class="grid text-left mr-4 ml-8 h-42 overflow-auto">
                    <For each={majorMunicipalities()}>
                      {(item) => (
                        <li>
                          <input
                            type="checkbox"
                            class="leading-tight mr-4"
                            onClick={() => {
                              setMajorMuniFilter(item);
                            }}
                          />
                          <span class="text-ptext1 dark:text-ptext1-DM">
                            {item.major_municipality}
                          </span>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </details>
          </div>
          {/*Minor Municipality*/}
          <div class="px-4">
            <details class="bg-background1 dark:bg-background1-DM shadow shadow-shadow-LM dark:shadow-shadow-DM rounded group/minorMunicipality md:hidden">
              <summary class="list-none flex flex-wrap items-center cursor-pointer rounded group-open/minorMunicipality:rounded-b-none group-open/minorMunicipality:z-[1] relative">
                <h2 class="flex flex-1 pb-1 font-bold text-ptext1 dark:text-ptext1-DM">
                  {t("formLabels.minorMunicipality")}
                </h2>
                {/*Creates the Dropdown Arrow*/}
                <div class="flex w-10 items-center justify-center">
                  <div class="border-8 border-transparent border-l-border1 dark:border-l-border1-DM ml-2 group-open/minorMunicipality:rotate-90 transition-transform"></div>
                </div>
              </summary>
              <div class="px-4 pb-2">
                <div class="h-42 flex-column text-left rounded">
                  <ul class="grid text-left mr-4 ml-8 h-40 overflow-auto">
                    <For each={minorMunicipalities()}>
                      {(item) => (
                        <div>
                          <input
                            type="checkbox"
                            class="leading-tight mr-4"
                            onClick={() => {
                              setMinorMuniFilter(item);
                            }}
                          />
                          <span class="text-ptext1 dark:text-ptext1-DM">
                            {item.minor_municipality}
                          </span>
                        </div>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </details>
          </div>
          {/*Governing District*/}
          <div class="px-4">
            <details class="bg-background1 dark:bg-background1-DM shadow shadow-shadow-LM dark:shadow-shadow-DM rounded group/governingDistrict md:hidden">
              <summary class="list-none flex flex-wrap items-center cursor-pointer rounded group-open/governingDistrict:rounded-b-none group-open/governingDistrict:z-[1] relative">
                <h2 class="flex flex-1 pb-1 font-bold text-ptext1 dark:text-ptext1-DM">
                  {t("formLabels.governingDistrict")}
                </h2>
                {/*Creates the Dropdown Arrow*/}
                <div class="flex w-10 items-center justify-center">
                  <div class="border-8 border-transparent border-l-border1 dark:border-l-border1-DM ml-2 group-open/governingDistrict:rotate-90 transition-transform"></div>
                </div>
              </summary>
              <div class="px-4 pb-2">
                <div class="h-42 flex-column text-left rounded">
                  <ul class="grid text-left mr-4 ml-8 h-36 overflow-auto">
                    <For each={governingDistricts()}>
                      {(item) => (
                        <div>
                          <input
                            type="checkbox"
                            class="leading-tight mr-4"
                            onClick={() => {
                              setGoverningDistrictFilter(item);
                            }}
                          />
                          <span class="text-ptext1 dark:text-ptext1-DM">
                            {item.governing_district}
                          </span>
                        </div>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </details>
      </div>
      {/* Filter Menus for md+ view */}
      <div class="hidden md:block bg-background1 dark:bg-background1-DM w-full md:rounded-lg md:border-2 md:border-border2 dark:md:border-border2-DM">
        {/*Major Municipality*/}
        <div class="md:h-56 md:flex-column md:text-left md:border-b-2 md:rounded md:border-border2 dark:md:border-border2-DM">
          <div class="mt-2 ml-4">{t("formLabels.majorMunicipality")}</div>
          <ul class="md:grid md:text-left md:mr-4 md:ml-8 md:h-fit md:overflow-auto">
            <For each={majorMunicipalities()}>
              {(item) => (
                <li>
                  <input
                    type="checkbox"
                    class="leading-tight mr-4"
                    onClick={() => {
                      setMajorMuniFilter(item);
                    }}
                  />
                  <span class="text-ptext1 dark:text-ptext1-DM">
                    {item.major_municipality}
                  </span>
                </li>
              )}
            </For>
          </ul>
        </div>
        {/*Minor Municipality*/}
        <div class="md:h-56 md:flex-column md:text-left md:border-b-2 md:rounded md:border-border2 dark:md:border-border2-DM md:box-border">
          <div class="mt-2 mb-2 ml-4">{t("formLabels.minorMunicipality")}</div>
          <ul class=" box-border md:grid md:text-left md:mr-4 md:ml-8 md:h-44 md:overflow-auto">
            {" "}
            {/*Combination of h-full and overflow auto causing weird behavior */}
            <For each={minorMunicipalities()}>
              {(item) => (
                <div>
                  <input
                    type="checkbox"
                    class="leading-tight mr-4"
                    onClick={() => {
                      setMinorMuniFilter(item);
                    }}
                  />
                  <span class="text-ptext1 dark:text-ptext1-DM">
                    {item.minor_municipality}
                  </span>
                </div>
              )}
            </For>
          </ul>
        </div>
        {/*Governing District*/}
        <div class="md:h-56 md:flex-column md:text-left md:border-b-2 md:rounded md:border-border2 dark:md:border-border2-DM md:box-border">
          <div class="mt-2 mb-2 ml-4">{t("formLabels.governingDistrict")}</div>
          <ul class=" box-border md:grid md:text-left md:mr-4 md:ml-8 md:h-44 md:overflow-auto md:place-content-start">
            <For each={governingDistricts()}>
              {(item) => (
                <div>
                  <input
                    type="checkbox"
                    class="leading-tight mr-4"
                    onClick={() => {
                      setGoverningDistrictFilter(item);
                    }}
                  />
                  <span class="text-ptext1 dark:text-ptext1-DM">
                    {item.governing_district}
                  </span>
                </div>
              )}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
};
