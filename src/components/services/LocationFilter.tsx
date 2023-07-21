import { Component, Suspense, createEffect, createResource, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
// import { productCategoryData } from '../../data'
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as uiObject

let major_municipalities = [];

const { data: major_municipality, error: major_municipality_error } = await supabase.from('major_municipality').select('major_municipality');

if (major_municipality_error) {
    console.log("supabase error: " + major_municipality_error.message)
} else {
    major_municipality.forEach(location => {
        major_municipalities.push(location.major_municipality)
    })
}

interface Props {
    // Define the type for the filterPosts prop
    filterPostsByLocation: (location: string) => void;
  }

export const CategoryCarousel: Component<Props> = (props) => {
    const [category, setCategory] = createSignal<string>('')
    const [formData, setFormData] = createSignal<FormData>()


    function submit(e: SubmitEvent) {
        e.preventDefault()

        if ((e.submitter as HTMLElement).getAttribute("data-value") === null) {
            setCategory('')
        } else {
            setCategory((e.submitter as HTMLElement)!.getAttribute("data-value")!)
        }

        const formData = new FormData(e.target as HTMLFormElement)
        formData.append("category_id", category())

        setFormData(formData)
    }

    return (
        <form onSubmit={submit}>
            <div class="product-carousel border-green-500 border-8 bg-white">
                <div class="bg-gray-400 flex content-center">
                    <ul class="flex content-center border-yellow-500 m-4">
                        {allCategoryInfo?.map((item) => (
                            <button 
                            class='bg-purple-700' 
                            onClick={() => {
                                props.filterPosts(item.category)
                            }}
                            >
                                <img src={item.icon} alt={item.ariaLabel} title={item.description} />
                                <p class="text-black">{item.name}</p>

                            </button>
                        ))
                        }
                    </ul>
                </div>
            </div>
        </form>
    )
}
