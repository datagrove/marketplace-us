import type { Component } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as unknown as uiObject;
const productCategoryData = values.productCategoryInfo;

import rightArrow from "../../assets/categoryIcons/circled-right-arrow.svg";
import leftArrow from "../../assets/categoryIcons/circled-left-arrow.svg";
import history from "../../assets/categoryIcons/history.svg";
import art from "../../assets/categoryIcons/art.svg";
import geography from "../../assets/categoryIcons/geography.svg";
import math from "../../assets/categoryIcons/math.svg";
import science from "../../assets/categoryIcons/science.svg";
import specialty from "../../assets/categoryIcons/specialty.svg";
import holiday from "../../assets/categoryIcons/history.svg";
import social from "../../assets/categoryIcons/social.svg";

let categories: Array<any> = [];

const { data, error } = await supabase.from("post_subject").select("*");

if (error) {
  console.log("supabase error: " + error.message);
} else {
  data.forEach((category) => {
    categories.push({ category: category.category, id: category.id });
  });
}

categories.map((category) => {
  if (category.id === 1) {
    category.icon = geography;
  } else if (category.id === 2) {
    category.icon = history;
  } else if (category.id === 3) {
    category.icon = art;
  } else if (category.id === 4) {
    category.icon = holiday;
  } else if (category.id === 5) {
    category.icon = math;
  } else if (category.id === 6) {
    category.icon = science;
  } else if (category.id === 7) {
    category.icon = social;
  } else if (category.id === 8) {
    category.icon = specialty;
  }
});

const categoriesData = productCategoryData.categories;

let allCategoryInfo: any[] = [];

for (let i = 0; i < categoriesData.length; i++) {
  allCategoryInfo.push({
    ...categoriesData[i],
    ...categories.find(
      (itmInner) => itmInner.id.toString() === categoriesData[i].id,
    ),
  });
}

interface Props {
    // Define the type for the filterPosts prop
    filterPosts: (currentCategory: number) => void;
}

let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let light = window.matchMedia(
  "(prefers-color-scheme: light)" || "(prefers-color-scheme: no-preference",
).matches;

export const HomeCategoryCarousel: Component = () => {
    return (
        <div class="p-1 my-2 rounded-lg border-2 border-red-400">
            <div class="flex flex-start justify-between scrollbar-thin overflow-x-auto drop-shadow-md dark:drop-shadow-[0_4px_3px_rgba(97,97,97,1)]  scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-thumb-shadow-LM scrollbar-track-background1 dark:scrollbar-thumb-shadow-DM dark:scrollbar-track-background1-DM">
                <button class="hidden w-12">
                <img src={leftArrow.src} alt="Left Arrow" />
                </button>

                <div class="flex justify-between items-start pt-2 w-full h-[7.5rem]">
                {allCategoryInfo?.map((item) => (
                    <button
                    id={item.id}
                    class="flex flex-col flex-none justify-start items-center w-20 h-28 catBtn"
                    onClick={(e) => {
                        // props.filterPosts(item.id);

                        let currBtn = e.target;

                        if (!currBtn.classList.contains("selected")) {
                        currBtn.classList.add("selected");
                        } else {
                        currBtn.classList.remove("selected");
                        }
                    }}
                    >
                    <div class="rounded-full bg-iconbg1 dark:bg-iconbg1-DM">
                        {item.icon && item.icon.src ? (
                        <img
                            src={item.icon.src}
                            alt={item.ariaLabel + " Icon"}
                            title={item.description}
                            class="p-1 m-2 w-12 h-12"
                        />
                        ) : null}
                    </div>

                    <div class="flex flex-row justify-center items-center h-44">
                        <p class="text-xs text-center text-ptext1 dark:text-ptext2-DM">
                        {item.name}{" "}
                        </p>
                    </div>
                    </button>
                ))}
                </div>

                <button class="hidden w-12">
                <img src={rightArrow.src} alt="Right Arrow" />
                </button>
            </div>
        </div>
    )
}