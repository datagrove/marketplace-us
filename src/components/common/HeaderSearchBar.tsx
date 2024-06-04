import type { Component } from "solid-js";
import { createSignal, createEffect, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { IconSearch } from "@tabler/icons-solidjs";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);



export const SearchBar: Component = () => {
    const [searchString, setSearchString] = createSignal<string>("");

    onMount(() => {
        if (localStorage.getItem("searchString")) {
            setSearchString(localStorage.getItem("searchString")!);
        }
    });

    const clickSearch = (e: Event) => {
        localStorage.setItem("searchString", searchString());
        window.location.href = `/${lang}/resources`;
    };

    createEffect(() => {
        // Execute a function when the user presses a key on the keyboard
        document
            .getElementById("search")
            ?.addEventListener("keydown", (e: KeyboardEvent) => {
                console.log("Search Input Event:");
                console.log(e);
                // If the user presses the "Enter" key on the keyboard
                if (e.code === "Enter") {
                    // // Cancel the default action, if needed
                    // e.preventDefault();
                    // Trigger the button element with a click
                    clickSearch(e);
                }
            });
    });

    return (
        <div class="search-form w-full mx-4 flex justify-center items-center">
            <div class="w-full h-3/4 flex justify-between items-center form rounded-full border border-border1 px-1 text-ptext1  focus:border-2 focus:border-highlight1 focus:outline-none dark:border-border1-DM dark:focus:border-highlight1-DM">
                <label class="sr-only" for="search">
                    {t("formLabels.search")}
                </label>
                <input
                    type="text"
                    name="query"
                    id="search"
                    class="h-full rounded-full w-full"
                    value={searchString()}
                    oninput={(e) => setSearchString(e.target.value)}
                />
                <IconSearch class="search-icon mr-2" />
            </div>
        </div>
    );
};
