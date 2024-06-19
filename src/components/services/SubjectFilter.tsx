import type { Component } from "solid-js";
import { createEffect, createSignal, For, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;
const productCategoryData = values.subjectCategoryInfo;

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

export const SubjectFilter: Component<Props> = (props) => {
    const [selectedSubjects, setSelectedSubjects] = createSignal<string[]>([]);

    onMount(() => {
        if (localStorage.getItem("selectedSubjects")) {
            setSelectedSubjects([...JSON.parse(localStorage.getItem("selectedSubjects")!)]);
            checkSubjectBoxes();
        }
    });

    function checkSubjectBoxes() {
        console.log(selectedSubjects());
        selectedSubjects().map((subject) => {
            let subjectCheckElements = document.getElementsByClassName("subject " + subject) as HTMLCollectionOf<HTMLInputElement>;
            if (subjectCheckElements) {
                for (let i = 0; i < subjectCheckElements.length; i++) {
                    subjectCheckElements[i].checked = true;
                }
            }
        })
    }

    return (
        <div class="hidden bg-background1 dark:bg-background1-DM md:mt-2 md:block w-full md:rounded-lg md:border-2 md:border-border2 dark:md:border-border2-DM">
            <div class="md:flex-column flex-wrap h-full pb-2 md:rounded md:border-b-2 md:border-border2 md:text-left dark:md:border-border2-DM">
                <div class="flex flex-wrap justify-between">
                    <div class="w-4/5 pl-4">{t("formLabels.subjects")}</div>
                </div>

                <div>
                    {allSubjectInfo?.map((item) => (
                        <div class="flex flex-row pl-2">
                            <div>
                                <input
                                    type="checkbox"
                                    class={`subject ${item.id.toString()} mr-2 leading-tight`}
                                    onClick={ () => {
                                        console.log("Subject selected: " + item.name);
                                        props.filterPosts(item.id.toString());
                                    }}
                                />
                            </div>

                            <div>
                                <span class="text-ptext1 dark:text-ptext1-DM">
                                    {item.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
