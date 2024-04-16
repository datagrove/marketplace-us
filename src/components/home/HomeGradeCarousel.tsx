import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as unknown as uiObject;
const productCategoryData = values.productCategoryInfo;

import one from "../../assets/numberIcons/one.svg";
import two from "../../assets/numberIcons/two.svg";
import three from "../../assets/numberIcons/three.svg";
import four from "../../assets/numberIcons/four.svg";
import five from "../../assets/numberIcons/five.svg";
import six from "../../assets/numberIcons/six.svg";
import seven from "../../assets/numberIcons/seven.svg";
import eight from "../../assets/numberIcons/eight.svg";
import nine from "../../assets/numberIcons/nine.svg";
import rightArrow from "../../assets/categoryIcons/circled-right-arrow.svg";
import leftArrow from "../../assets/categoryIcons/circled-left-arrow.svg";

let grades: Array<any> = [];

export const HomeGradeCarousel: Component = () => {
    return (
        <div class="flex justify-center">
            <svg width="80px" height="80px" viewBox="0 0 256 256" id="Flat" class="fill-icon1 dark:fill-icon1-DM">
                <path d="M128,28A100,100,0,1,0,228,128,100.1127,100.1127,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.10478,92.10478,0,0,1,128,220Zm8-136v92a4,4,0,0,1-8,0V91.47266l-17.78223,11.84961a4.00018,4.00018,0,0,1-4.43554-6.65821l24-15.99316A4.00031,4.00031,0,0,1,136,84Z"/>
            </svg>

            <svg width="80px" height="80px" viewBox="0 0 256 256" id="Flat" class="fill-icon1 dark:fill-icon1-DM">
                <path d="M128,28A100,100,0,1,0,228,128,100.1127,100.1127,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.10478,92.10478,0,0,1,128,220Zm8-136v92a4,4,0,0,1-8,0V91.47266l-17.78223,11.84961a4.00018,4.00018,0,0,1-4.43554-6.65821l24-15.99316A4.00031,4.00031,0,0,1,136,84Z"/>
            </svg>

            <svg width="80px" height="80px" viewBox="0 0 256 256" id="Flat" class="fill-icon1 dark:fill-icon1-DM">
                <path d="M128,28A100,100,0,1,0,228,128,100.1127,100.1127,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.10478,92.10478,0,0,1,128,220Zm8-136v92a4,4,0,0,1-8,0V91.47266l-17.78223,11.84961a4.00018,4.00018,0,0,1-4.43554-6.65821l24-15.99316A4.00031,4.00031,0,0,1,136,84Z"/>
            </svg>

            <svg width="80px" height="80px" viewBox="0 0 256 256" id="Flat" class="fill-icon1 dark:fill-icon1-DM">
                <path d="M128,28A100,100,0,1,0,228,128,100.1127,100.1127,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.10478,92.10478,0,0,1,128,220Zm8-136v92a4,4,0,0,1-8,0V91.47266l-17.78223,11.84961a4.00018,4.00018,0,0,1-4.43554-6.65821l24-15.99316A4.00031,4.00031,0,0,1,136,84Z"/>
            </svg>

            <svg width="80px" height="80px" viewBox="0 0 256 256" id="Flat" class="fill-icon1 dark:fill-icon1-DM">
                <path d="M128,28A100,100,0,1,0,228,128,100.1127,100.1127,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.10478,92.10478,0,0,1,128,220Zm8-136v92a4,4,0,0,1-8,0V91.47266l-17.78223,11.84961a4.00018,4.00018,0,0,1-4.43554-6.65821l24-15.99316A4.00031,4.00031,0,0,1,136,84Z"/>
            </svg>
        </div>

    )
}