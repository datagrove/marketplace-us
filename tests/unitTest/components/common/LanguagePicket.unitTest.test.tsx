import { languages } from "../../i18n/ui";
import type { Component } from "solid-js";
import { createSignal, createEffect, onMount } from "solid-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import language from "../../assets/language.svg";

const lang = getLangFromUrl(new URL(window.location.href));

const icon = language;
export const LanguagePicker: Component = () => {
    const [selectedLanguage, setSelectedLanguage] = createSignal<string>(lang);
    const [selectedValue, setSelectedValue] = createSignal("");

    const handleLanguageChange = (e: Event) => {
        setSelectedLanguage((e.target as HTMLSelectElement).value);

        const path = window.location.pathname.split("/");
        console.log(window.location.pathname);

        if (path[1] === "") {
            console.log("Path Index 1 blank");
            path[0] = selectedLanguage();
            window.location.href = path[0];
        } else if (path[1] === selectedLanguage()) {
            console.log("Already at Language");
            window.location.href = window.location.href;
        } else if (Object.keys(languages).includes(path[1])) {
            console.log("Path Index 1 contains a language");
            console.log(path);
            path[1] = selectedLanguage();
            console.log(path.join("/"));
            window.location.href = window.location.origin + path.join("/");
        } else {
            console.log("Path Index 1 doesn't contain a language");
            console.log(path);
            path[0] = selectedLanguage();
            console.log(path.join("/"));
            window.location.href = "/" + path.join("/");
        }
    };

    return (
        <div class="mr-4 flex rounded-lg border border-border1 text-ptext1 focus:border-border1 focus:outline-none dark:border-border1-DM dark:text-ptext1-DM dark:focus:border-border1-DM">
            <svg
                class="ml-2 h-full w-4 rounded-l-lg bg-background1 stroke-icon1 pt-0.5 dark:bg-background1-DM dark:stroke-icon1-DM"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                >
                    <path d="M4 5h7M9 3v2c0 4.418-2.239 8-5 8" />
                    <path d="M5 9c0 2.144 2.952 3.908 6.7 4m.3 7l4-9l4 9m-.9-2h-6.2" />
                </g>
            </svg>
            <select
                class="rounded-r-lg bg-background1 dark:bg-background1-DM "
                value={selectedLanguage()}
                onChange={handleLanguageChange}
            >
                {Object.entries(languages).map(([lang, label]) => (
                    <option value={lang}>{label}</option>
                ))}
            </select>
        </div>
    );
};
