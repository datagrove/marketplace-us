import { Component, Suspense, createEffect, createResource, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import type { AuthSession } from '@supabase/supabase-js'

import travel from '../../assets/categoryIcons/travel.svg'
import worker from '../../assets/categoryIcons/worker.svg'
import palette from '../../assets/categoryIcons/palette.svg'
import paw from '../../assets/categoryIcons/paw.svg'
import legal from '../../assets/categoryIcons/legal.svg'
import garden from '../../assets/categoryIcons/garden.svg'
import engine from '../../assets/categoryIcons/engine-motor.svg'
import doctor from '../../assets/categoryIcons/doctor.svg'
import construction from '../../assets/categoryIcons/construction-tools.svg'
import computer from '../../assets/categoryIcons/computer-and-monitor.svg'
import cleaner from '../../assets/categoryIcons/cleaner-man.svg'
import rightArrow from '../../assets/categoryIcons/circled-right-arrow.svg'
import leftArrow from '../../assets/categoryIcons/circled-left-arrow.svg'
import beauty from '../../assets/categoryIcons/beauty-salon.svg'
import finance from '../../assets/categoryIcons/banking-bank.svg'

// async function postFormData(formData: FormData) {
//     const response = await fetch("/api/providerCreatePost", {
//         method: "POST",
//         body: formData,
//     });
//     const data = await response.json();

//     return data;
// }

export const CategoryCarousel: Component = () => {
    const [category, setCategory] = createSignal<string | null>(null)

    let categories: Array<string> = []

    createEffect(async () => {
        const { data, error } = await supabase.from('post_category').select('*');
        if (error) {
            console.log("supabase error: " + error.message)
        } else {
            data.forEach(category => {
               categories.push(category)
               console.log(categories)
            })
        }
    })

    function submit(e: MouseEvent) {
        e.preventDefault()
    }

    return (
        <div class="product-carousel border-green-500 border-8 bg-white">
            <div class="bg-gray-400 flex content-center">
                <button>
                    <img
                        src={leftArrow}
                        alt="Left Arrow"
                    />
                </button>
                {/* <ul class="flex content-center">
                    {categories?.map((item) => (
                        <div class="carousel-product ">
                            <div class="product-icon bg-white">
                                <img src={item.icon} alt={item.ariaLabel} />
                            </div>
                            <div class="product-info">
                                <p class="text-white">{item.name}</p>
                            </div>
                        </div>
                    ))
                    }
                </ul> */}
                <button>
                    <img
                        src={rightArrow}
                        alt="Right Arrow"
                    />
                </button>
            </div>
        </div>
    )
}
