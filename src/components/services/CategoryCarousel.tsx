import type { Component } from 'solid-js';
import { supabase } from '../../lib/supabaseClient'
// import { productCategoryData } from '../../data'
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as uiObject
const productCategoryData = values.productCategoryInfo


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

let categories: Array<any> = []

const { data, error } = await supabase.from('post_category').select('*');

if (error) {
    console.log("supabase error: " + error.message)
} else {
    data.forEach(category => {
        categories.push({ category: category.category, id: category.id })
    })
}

categories.map(
    category => {
        if (category.id === 1) {
            category.icon = garden
        } else if (category.id === 2) {
            category.icon = beauty
        } else if (category.id === 3) {
            category.icon = construction
        } else if (category.id === 4) {
            category.icon = computer
        } else if (category.id === 5) {
            category.icon = engine
        } else if (category.id === 6) {
            category.icon = palette
        } else if (category.id === 7) {
            category.icon = finance
        } else if (category.id === 8) {
            category.icon = cleaner
        } else if (category.id === 9) {
            category.icon = paw
        } else if (category.id === 10) {
            category.icon = legal
        } else if (category.id === 11) {
            category.icon = doctor
        } else if (category.id === 12) {
            category.icon = worker
        } else if (category.id === 13) {
            category.icon = travel
        }
    }
)

const categoriesData = productCategoryData.categories

let allCategoryInfo: any[] = []

for (let i = 0; i < categoriesData.length; i++) {
    allCategoryInfo.push({
        ...categoriesData[i],
        ...(categories.find((itmInner) => itmInner.id.toString() === categoriesData[i].id))
    }
    );
}

interface Props {
    // Define the type for the filterPosts prop
    filterPosts: (currentCategory: string) => void;
  }

export const CategoryCarousel: Component<Props> = (props) => {

    return (
            <div class="product-carousel my-2">
                <div class="flex justify-between">
                    <button class="w-12">
                        <img
                            src={leftArrow}
                            alt="Left Arrow"
                        />
                    </button>

                    <div class="overflow-scroll w-3/4">
                        <ul class="flex">
                            {allCategoryInfo?.map((item) => (
                                <button 
                                class='m-2 w-12 rounded-full border-4 border-border' 
                                onClick={() => {
                                    props.filterPosts(item.category)
                                }}
                                >
                                    <img src={item.icon} alt={item.ariaLabel} title={item.description} class="w-48" />
                                    <p class="text-text1 dark:text-text1-DM text-center text-xs">{item.name}</p>

                                </button>
                            ))
                            }
                        </ul>
                    </div>

                    <button class="w-12">
                        <img
                            src={rightArrow}
                            alt="Right Arrow"
                        />
                    </button>
                </div>


                <div class="h-16 overflow-scroll w-full">
                        <ul class="flex flex-col items-center">
                            {allCategoryInfo?.map((item) => (
                                <button 
                                class='flex items-center h-12 py-1' 
                                onClick={() => {
                                    props.filterPosts(item.category)
                                }}
                                >
                                    <img src={item.icon} alt={item.ariaLabel} title={item.description} class="pr-4" />
                                    <p class="text-text1 dark:text-text1-DM text-center">{item.name}</p>

                                </button>
                            ))
                            }
                        </ul>
                    </div>
            </div>

    )
}
