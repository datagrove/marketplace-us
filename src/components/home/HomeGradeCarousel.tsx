import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as uiObject;
const productCategoryData = values.subjectCategoryInfo;

function selectGradeCarousel(gradeBtn: any) {
    localStorage.setItem("selectedGradeCarousel", JSON.stringify(gradeBtn.id));
    window.location.href = `/${lang}/resources`;
}

export const HomeGradeCarousel: Component = () => {
    return (
        <div class="w-full overflow-x-scroll">
            {/* <svg width="80px" height="80px" viewBox="0 0 256 256" id="Flat" class="fill-icon1 dark:fill-icon1-DM">
                <path d="M128,28A100,100,0,1,0,228,128,100.1127,100.1127,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.10478,92.10478,0,0,1,128,220Zm8-136v92a4,4,0,0,1-8,0V91.47266l-17.78223,11.84961a4.00018,4.00018,0,0,1-4.43554-6.65821l24-15.99316A4.00031,4.00031,0,0,1,136,84Z"/>
            </svg> */}
            <div class="flex w-fit">
                <button
                    id="PK"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-2xl md:text-3xl">PreK</h1>
                </button>

                <button
                    id="K"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-2xl md:text-3xl">K</h1>
                </button>

                <button
                    id="1"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">1</h1>
                </button>

                <button
                    id="2"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">2</h1>
                </button>

                <button
                    id="3"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">3</h1>
                </button>

                <button
                    id="4"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">4</h1>
                </button>

                <button
                    id="5"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">5</h1>
                </button>

                <button
                    id="6"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">6</h1>
                </button>

                <button
                    id="7"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">7</h1>
                </button>

                <button
                    id="8"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">8</h1>
                </button>

                <button
                    id="9"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">9</h1>
                </button>

                <button
                    id="10"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">10</h1>
                </button>

                <button
                    id="11"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">11</h1>
                </button>

                <button
                    id="12"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="text-3xl">12</h1>
                </button>

                <button
                    id="CE"
                    class="gradeHomeSelectBtn"
                    onclick={(e) => selectGradeCarousel(e.target)}
                >
                    <h1 class="md:text-auto text-center text-xs">
                        Continuing Education
                    </h1>
                </button>
            </div>
        </div>
    );
};
