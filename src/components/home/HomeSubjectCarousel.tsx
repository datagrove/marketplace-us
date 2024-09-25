import { createSignal, onMount, type Component } from "solid-js";
import supabase from "../../lib/supabaseClientServer";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import history from "../../assets/categoryIcons/history.svg";
import art from "../../assets/categoryIcons/art.svg";
import geography from "../../assets/categoryIcons/geography.svg";
import math from "../../assets/categoryIcons/math.svg";
import science from "../../assets/categoryIcons/science.svg";
import specialty from "../../assets/categoryIcons/thought-bubble.svg";
import holiday from "../../assets/categoryIcons/holiday.svg";
import social from "../../assets/categoryIcons/social.svg";
import ela from "../../assets/categoryIcons/open-book.svg";

interface Props {
    lang: "en" | "es" | "fr";
}

// let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
// let light = window.matchMedia(
//     "(prefers-color-scheme: light)" || "(prefers-color-scheme: no-preference"
// ).matches;

export const HomeSubjectCarousel: Component<Props> = (props) => {
    const [lang, setLang] = createSignal<"en" | "es" | "fr">(props.lang);
    const [SubjectData, setSubjectData] = createSignal<
        Array<{
            category?: string | undefined;
            id: number | string;
            icon?: ImageMetadata;
            name: string;
            description: string;
            ariaLabel: string;
        }>
    >([]);

    const language = lang();
    const values = ui[language] as uiObject;
    const productCategoryData = values.subjectCategoryInfo;

    console.log(productCategoryData);

    let categories: Array<{
        category: string;
        id: number;
        icon?: ImageMetadata;
    }> = [];
    let allCategoryInfo: {
        category?: string | undefined;
        id: number | string;
        icon?: ImageMetadata;
        name: string;
        description: string;
        ariaLabel: string;
    }[] = [];

    onMount(async () => {
        const { data, error } = await supabase
            .from("post_subject")
            .select("*")
            .order("subject", { ascending: true });

        if (error) {
            console.log("supabase error: " + error.message);
        } else {
            data.forEach((category) => {
                categories.push({
                    category: category.category,
                    id: category.id,
                });
            });
            console.log(data);
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
            } else if (category.id === 9) {
                category.icon = ela;
            }
        });

        const categoriesData = productCategoryData.subjects;

        for (let i = 0; i < categoriesData.length; i++) {
            allCategoryInfo.push({
                ...categoriesData[i],
                ...categories.find(
                    (itmInner) =>
                        itmInner.id.toString() === categoriesData[i].id
                ),
            });
        }

        setSubjectData(allCategoryInfo);
        console.log(allCategoryInfo);
    });

    return (
        <div class="my-2 rounded-lg p-1">
            <div class="flex-start flex justify-between overflow-x-auto drop-shadow-md scrollbar-thin scrollbar-track-background1  scrollbar-thumb-shadow-LM scrollbar-track-rounded-full scrollbar-thumb-rounded-full dark:drop-shadow-[0_4px_3px_rgba(97,97,97,1)] dark:scrollbar-track-background1-DM dark:scrollbar-thumb-shadow-DM">
                <div class="flex h-[8rem] w-full items-start justify-between pt-2">
                    {SubjectData()?.map((item) => (
                        <button
                            id={item.id.toString()}
                            class="catBtn flex h-28 w-20 flex-none flex-col items-center justify-start"
                            onClick={(e) => {
                                let currBtn = e.target;

                                if (!currBtn.classList.contains("selected")) {
                                    currBtn.classList.add("selected");
                                } else {
                                    currBtn.classList.remove("selected");
                                }

                                localStorage.setItem(
                                    "selectedSubjects",
                                    JSON.stringify([currBtn.id])
                                );
                                window.location.href = `/${language}/resources`;
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
                                <p class="pt-1 text-center text-xs text-ptext1 dark:text-ptext2-DM">
                                    {item.name}{" "}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
