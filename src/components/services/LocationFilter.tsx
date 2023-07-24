//TODO: Need to add a Country filter for future phases
import type { Component } from 'solid-js';
import { supabase } from '../../lib/supabaseClient'
// import { productCategoryData } from '../../data'
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as uiObject

let major_municipalities: Array<string> = [];
let minor_municipalities: Array<string> = [];

const { data: major_municipality, error: major_municipality_error } = await supabase.from('major_municipality').select('major_municipality');

if (major_municipality_error) {
    console.log("supabase error: " + major_municipality_error.message)
} else {
    major_municipality.forEach(location => {
        major_municipalities.push(location.major_municipality)
    })
}

const { data: minor_municipality, error: minor_municipality_error } = await supabase.from('minor_municipality').select('minor_municipality');

if (minor_municipality_error) {
    console.log("supabase error: " + minor_municipality_error.message)
} else {
    minor_municipality.forEach(location => {
        minor_municipalities.push(location.minor_municipality)
    })
}

interface Props {
    // Define the type for the filterPosts prop
    filterPostsByMajorMunicipality: (location: string) => void;
    filterPostsByMinorMunicipality: (location: string) => void;
    filterPostsByGoverningDistrict: (location: string) => void;
  }

export const LocationFilter: Component<Props> = (props) => {

    const testFunction = (item: string) => {
        console.log(item)
        props.filterPostsByGoverningDistrict(item)
    }

    return (
            <div class=" border-green-500 border-8 bg-white">
                <div class="bg-gray-400 flex content-center">
                    <ul class="flex content-center border-yellow-500 m-4">
                        {major_municipalities?.map((item) => (
                            <div>
                                <input type="checkbox" 

                            onClick={() => {
                                testFunction(item)
                            }}
                            />
                                <p class="text-black">{item}</p>

                            </div>
                        ))
                        }
                    </ul>
                </div>
                <div class="bg-gray-400 flex content-center">
                    <ul class="flex content-center border-yellow-500 m-4">
                        {minor_municipalities?.map((item) => (
                            <div>
                                <input type="checkbox" 

                            onClick={() => {
                                props.filterPostsByMinorMunicipality(item)
                            }}
                            />
                                <p class="text-black">{item}</p>

                            </div>
                        ))
                        }
                    </ul>
                </div>
            </div>

    )
}
