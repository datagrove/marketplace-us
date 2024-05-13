import type { Component } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as uiObject;
const productCategoryData = values.subjectCategoryInfo;

import rightArrow from "../../assets/categoryIcons/circled-right-arrow.svg";
import leftArrow from "../../assets/categoryIcons/circled-left-arrow.svg";
import history from "../../assets/categoryIcons/history.svg";
import art from "../../assets/categoryIcons/art.svg";
import geography from "../../assets/categoryIcons/geography.svg";
import math from "../../assets/categoryIcons/math.svg";
import science from "../../assets/categoryIcons/science.svg";
import specialty from "../../assets/categoryIcons/specialty.svg";
import holiday from "../../assets/categoryIcons/holiday.svg";
import social from "../../assets/categoryIcons/social.svg";

let subjects: Array<any> = [];

const { data, error } = await supabase.from("post_subject").select("*");

if (error) {
    console.log("supabase error: " + error.message);
} else {
    console.log(data);
    data.forEach((subject) => {
        subjects.push({ subject: subject.subject, id: subject.id });
    });
}

subjects.map((subject) => {
    if (subject.id === 1) {
        subject.icon = geography;
    } else if (subject.id === 2) {
        subject.icon = history;
    } else if (subject.id === 3) {
        subject.icon = art;
    } else if (subject.id === 4) {
        subject.icon = holiday;
    } else if (subject.id === 5) {
        subject.icon = math;
    } else if (subject.id === 6) {
        subject.icon = science;
    } else if (subject.id === 7) {
        subject.icon = social;
    } else if (subject.id === 8) {
        subject.icon = specialty;
    }
});

const subjectData = productCategoryData.subjects;

let allSubjectInfo: any[] = [];

for (let i = 0; i < subjectData.length; i++) {
    allSubjectInfo.push({
        ...subjectData[i],
        ...subjects.find(
            (itmInner) => itmInner.id.toString() === subjectData[i].id
        ),
    });
}

interface Props {
    // Define the type for the filterPosts prop
    filterPosts: (currentSubject: string) => void;
}

let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let light = window.matchMedia(
    "(prefers-color-scheme: light)" || "(prefers-color-scheme: no-preference"
).matches;

export const CategoryCarousel: Component<Props> = (props) => {
    return (
        <div class="product-carousel my-2 rounded-lg p-1">
            <div class="flex-start flex justify-between overflow-x-auto drop-shadow-md scrollbar-thin scrollbar-track-background1  scrollbar-thumb-shadow-LM scrollbar-track-rounded-full scrollbar-thumb-rounded-full dark:drop-shadow-[0_4px_3px_rgba(97,97,97,1)] dark:scrollbar-track-background1-DM dark:scrollbar-thumb-shadow-DM">
                <button class="hidden w-12">
                    <img src={leftArrow.src} alt="Left Arrow" />
                </button>

                <div class="flex h-[7.5rem] w-full items-start justify-between pt-2">
                    {allSubjectInfo?.map((item) => (
                        <button
                            id={item.id}
                            class="catBtn flex h-28 w-20 flex-none flex-col items-center justify-start"
                            onClick={(e) => {
                                props.filterPosts(item.id.toString());

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
                                        class="m-2 h-12 w-12 p-1"
                                    />
                                ) : null}
                            </div>

                            <div class="flex h-44 flex-row items-center justify-center">
                                <p class="text-center text-xs text-ptext1 dark:text-ptext2-DM">
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
    );
};
