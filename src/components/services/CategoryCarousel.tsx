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
import financeDM from '../../assets/categoryIcons/banking-bank-DM.svg'
import { currentLanguage } from '../../lib/languageSelectionStore';

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
            category.iconDM = financeDM
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

// const [selected, setSelected] = createSignal(false);

let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let light = window.matchMedia("(prefers-color-scheme: light)" || "(prefers-color-scheme: no-preference" ).matches;

export const CategoryCarousel: Component<Props> = (props) => {

    return (
            <div class="product-carousel my-2">
                <div class="flex flex-start justify-between">
                    <button class="w-12 hidden">
                        <img
                            src={leftArrow}
                            alt="Left Arrow"
                        />
                    </button>

                    <div class="flex justify-between items-center w-full overflow-auto py-4">
                        { allCategoryInfo?.map((item) => (
                            
                            <button 
                                id={ item.id }
                                class='flex flex-col flex-none justify-center items-center w-20 h-20' 
                                onClick={(e) => {
                                    props.filterPosts(item.category)

                                    let currBtn = e.target;

                                    if (!currBtn.classList.contains('selected')) {
                                        currBtn.classList.add('selected')
                                    } else {
                                        currBtn.classList.remove('selected')
                                    }

                                    console.log("color scheme: ", light, dark)

                                }}
                            >

{/* 
                                { light && <img src={ item.icon } alt={item.ariaLabel} title={item.description} class="w-8" /> }
                                { dark && <img src={ item.iconDM } alt={item.ariaLabel} title={item.description} class="w-8" /> } */}
                               
                                {/* <img src={ item.iconDM } /> */}
                                {/* {/* <img src={ item.icon } alt={item.ariaLabel} title={item.description} class="w-8" /> */}
                                <div class="bg-iconbg1 dark:bg-iconbg1-DM rounded-full">
                                    <img src={ item.icon } alt={item.ariaLabel} title={item.description} class="w-12 p-1 m-2" /> 
                                </div>
                                
                                <p class="text-ptext1 dark:text-ptext2-DM my-2 text-center text-xs">{item.name} </p>

                                {/* <svg width="800px" height="800px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="fill-logo dark:fill-logo-DM">
                                    <title>palette</title>
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                        <rect width="48" height="48" fill="none"/>
                                        </g>
                                        <g id="icons_Q2" data-name="icons Q2">
                                        <path d="M26.6,6H27c8.1,0,15,5.5,15,12S40.4,29,28,29c-3.8,0-5.8,2.2-6.4,4.3a5.5,5.5,0,0,0,2.3,6.1c1,.6,1,1.3.9,1.7a1.2,1.2,0,0,1-1.3.9C11.4,42,6,33,6,24S15.2,6,26.5,6h.1m-.1-4C13,2,2,11.8,2,24s8,22,21.5,22C29,46,31,39,26,36c-.9-.6-1-3,2-3,9,0,18-3,18-15C46,9,37,2,27,2Z"/>
                                        <path d="M21,10a3,3,0,1,0,3,3,2.9,2.9,0,0,0-3-3Z"/>
                                        <path d="M14,15a3,3,0,1,0,3,3,2.9,2.9,0,0,0-3-3Z"/>
                                        <path d="M29,9a3,3,0,1,0,3,3,2.9,2.9,0,0,0-3-3Z"/>
                                        <path d="M36,14a3,3,0,1,0,3,3,2.9,2.9,0,0,0-3-3Z"/>
                                        </g>
                                    </g>
                                </svg> */}
                            </button>
                            ))
                        }
                    </div>

                    <button class="w-12 hidden">
                        <img
                            src={rightArrow}
                            alt="Right Arrow"
                        />
                    </button>
                </div>


                {/* <div class="h-16 overflow-scroll w-full">
                        <ul class="flex flex-col items-center">
                            {allCategoryInfo?.map((item) => (
                                <button 
                                class='flex items-center h-12 py-1' 
                                onClick={() => {
                                    props.filterPosts(item.category)
                                }}
                                >
                                    <img src={item.icon} alt={item.ariaLabel} title={item.description} class="pr-4" />
                                    <p class="text-ptext1 dark:text-ptext1-DM text-center">{item.name}</p>

                                </button>
                            ))
                            }
                        </ul>
                    </div> */}
            </div>

    )
}
