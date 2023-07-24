//TODO: Need to add a Country filter for future phases
//TODO: Sort Lists Alphabetically
import { Component, createEffect, createSignal, For } from 'solid-js';

import { supabase } from '../../lib/supabaseClient'
// import { productCategoryData } from '../../data'
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as uiObject

let major_municipalities: Array<{ major_municipality: string, id: number }> = [];
let minor_municipalities: Array<{ minor_municipality: string, id: number, major_municipality: number }> = [];
let governing_districts: Array<{ governing_district: string, id: number, minor_municipality: number }> = [];

const { data: major_municipality, error: major_municipality_error } = await supabase.from('major_municipality').select('major_municipality, id');

if (major_municipality_error) {
    console.log("supabase error: " + major_municipality_error.message)
} else {
    major_municipality.forEach(location => {
        major_municipalities.push({ major_municipality: location.major_municipality, id: location.id })
    })
    major_municipalities.sort((a, b) => a.major_municipality > b.major_municipality ? 0 : -1)
}

const { data: minor_municipality, error: minor_municipality_error } = await supabase.from('minor_municipality').select('minor_municipality, id, major_municipality');

if (minor_municipality_error) {
    console.log("supabase error: " + minor_municipality_error.message)
} else {
    minor_municipality.forEach(location => {
        minor_municipalities.push({ minor_municipality: location.minor_municipality, id: location.id, major_municipality: location.major_municipality })
    })
    minor_municipalities.sort((a, b) => a.minor_municipality > b.minor_municipality ? 0 : -1)
}

const { data: governing_district, error: governingDistrictError } = await supabase.from('governing_district').select('governing_district, id, minor_municipality');

if (governingDistrictError) {
    console.log("supabase error: " + governingDistrictError.message)
} else {
    governing_district.forEach(location => {
        governing_districts.push({ governing_district: location.governing_district, id: location.id, minor_municipality: location.minor_municipality })
    })
    governing_districts.sort((a,b) => a.governing_district > b.governing_district ? 0 : -1)
}

interface Props {
    // Define the type for the filterPosts prop
    filterPostsByMajorMunicipality: (location: string) => void;
    filterPostsByMinorMunicipality: (location: string) => void;
    filterPostsByGoverningDistrict: (location: string) => void;
}

export const LocationFilter: Component<Props> = (props) => {
    const [majorMunicipalities, setMajorMunicipalities] = createSignal<Array<{ major_municipality: string, id: number }>>(major_municipalities)
    const [minorMunicipalities, setMinorMunicipalities] = createSignal<Array<{ minor_municipality: string, id: number, major_municipality: number }>>(minor_municipalities)
    const [governingDistricts, setGoverningDistricts] = createSignal<Array<{ governing_district: string, id: number, minor_municipality: number }>>(governing_districts)
    const [locationFilters, setLocationFilters] = createSignal<Array<{ major_municipality: string, id: number }>>([])
    const [minorLocationFilters, setMinorLocationFilters] = createSignal<Array<{ minor_municipality: string, id: number, major_municipality: number }>>([])
    const [governingLocationFilters, setGoverningLocationFilters] = createSignal<Array<{ governing_district: string, id: number, minor_municipality: number }>>([])

    let filteredMinorMunis: Array<{ minor_municipality: string, id: number, major_municipality: number }> = [];
    let filteredGoverningDistricts: Array<{ governing_district: string, id: number, minor_municipality: number }> = [];

    const testFunction = (item: { major_municipality: string, id: number }) => {
        if (locationFilters().includes(item)) {
            let currentLocationFilters = locationFilters().filter((el) => el !== item)
            setLocationFilters(currentLocationFilters)
        } else {
            setLocationFilters([...locationFilters(), item])
        }
        props.filterPostsByGoverningDistrict(item.major_municipality)
    }

    createEffect(() => {
        filteredMinorMunis = [];

        locationFilters().forEach((item) => {
            let currentMinorMunis = minor_municipalities.filter((el) => el.major_municipality === item.id)
            filteredMinorMunis = [...filteredMinorMunis, ...currentMinorMunis]
        })

        if(locationFilters().length === 0) {
            filteredMinorMunis = minor_municipalities
        }
        setMinorMunicipalities(filteredMinorMunis)
    })

    const test2Function = (item: { minor_municipality: string, id: number, major_municipality: number }) => {
        if (minorLocationFilters().includes(item)) {
            let currentMinorLocationFilters = minorLocationFilters().filter((el) => el !== item)
            setMinorLocationFilters(currentMinorLocationFilters)
        } else {
            setMinorLocationFilters([...minorLocationFilters(), item])
        }
        props.filterPostsByMinorMunicipality(item.minor_municipality)
    }

    createEffect(() => {
        filteredGoverningDistricts = [];

        minorLocationFilters().forEach((item) => {
            let currentGoverningDistricts = governing_districts.filter((el) => el.minor_municipality === item.id)
            filteredGoverningDistricts = [...filteredGoverningDistricts, ...currentGoverningDistricts]
        })

        if(minorLocationFilters().length === 0) {
            filteredGoverningDistricts = governing_districts
        }
        setGoverningDistricts(filteredGoverningDistricts)
    })

    const test3Function = (item: { governing_district: string, id: number, minor_municipality: number }) => {
        if (governingLocationFilters().includes(item)) {
            let currentGoverningLocationFilters = governingLocationFilters().filter((el) => el !== item)
            setGoverningLocationFilters(currentGoverningLocationFilters)
        } else {
            setGoverningLocationFilters([...governingLocationFilters(), item])
        }
        props.filterPostsByMinorMunicipality(item.governing_district)
    }

    return (
        <div class=" border-green-500 border-8 bg-white">
            <div class="bg-gray-400 flex content-center">
                <ul class="flex content-center border-yellow-500 m-4">
                    <For each={majorMunicipalities()}>{(item) =>
                        <div>
                            <input type="checkbox"

                                onClick={() => {
                                    testFunction(item)
                                }}
                            />
                            <p class="text-black">{item.major_municipality}</p>

                        </div>
                    }</For>
                </ul>
            </div>
            <div class="bg-gray-400 flex content-center">
                <ul class="flex content-center border-yellow-500 m-4">
                    <For each={minorMunicipalities()}>{(item) =>
                        <div>
                            <input type="checkbox"

                                onClick={() => {
                                    test2Function(item)
                                }}
                            />
                            <p class="text-black">{item.minor_municipality}</p>

                        </div>
                    }</For>
                </ul>
            </div>
            <div class="bg-gray-400 flex content-center">
                <ul class="flex content-center border-yellow-500 m-4">
                    <For each={governingDistricts()}>{(item) =>
                        <div>
                            <input type="checkbox"

                                onClick={() => {
                                    test3Function(item)
                                }}
                            />
                            <p class="text-black">{item.governing_district}</p>

                        </div>
                    }</For>
                </ul>
            </div>
        </div>

    )
}
