import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import type { Component } from "solid-js";
import { IconSun, IconMoon } from "@tabler/icons-solidjs";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const ThemeBtn: Component = () => {
    const [theme, setTheme] = createSignal("dark");
    const [icon, setIcon] = createSignal(IconSun);

    onMount(() => {
        findTheme();
        if (theme() === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }
        updateLocalStorage("theme", theme());
        
    });

    function findTheme() {
        if (
            typeof localStorage !== "undefined" &&
            localStorage.getItem("theme")
        ) {
            return setTheme(localStorage.getItem("theme")!);
        }
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return setTheme("dark");
        } else {
            return setTheme("light");
        }       
    }

    function updateLocalStorage(key: string, newValue: string) {
        const oldValue = localStorage.getItem(key);
        localStorage.setItem(key, newValue);
        setTheme(newValue);

        const storageEvent = new StorageEvent("storage", {
            key: key,
            oldValue: oldValue,
            newValue: newValue,
            url: window.location.href,
            storageArea: localStorage,
        });

        window.dispatchEvent(storageEvent);
    }

    const handleToggleClick = () => {
        const element = document.documentElement;
        element.classList.toggle("dark");

        const isDark = element.classList.contains("dark");
        updateLocalStorage("theme", isDark ? "dark" : "light");
    };

    // document
    //     .getElementById("themeToggle")!
    //     .addEventListener("click", handleToggleClick);

    return (
        <div class="">
            <button
                id="themeToggle"
                type="button"
                class="inline-flex items-center rounded-lg p-1 md:p-2.5 text-sm text-ptext1 hover:bg-gray-100 focus:outline-none focus:ring-1 md:focus:ring-4 focus:ring-gray-200 dark:text-ptext1-DM dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                aria-label={t("ariaLabels.darkMessage")}
                data-aw-toggle-color-scheme
                onClick={handleToggleClick}
            >
                {theme() === "light" ? <IconMoon class="w-4 h-4 md:w-6 md:h-6" /> : <IconSun class="w-5 h-5 md:w-8 md:h-8" />}
            </button>
        </div>
    );
};
