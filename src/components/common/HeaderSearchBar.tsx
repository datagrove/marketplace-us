import type { Component } from "solid-js";
import { createSignal, createEffect, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { IconSearch } from "@tabler/icons-solidjs";
import useLocalStorage from "@lib/LocalStorageHook";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const SearchBar: Component = () => {
    const [searchString, setSearchString] = createSignal<string>("");

    onMount(() => {
        if (
            localStorage.getItem("searchString") !== null &&
            localStorage.getItem("searchString") !== "" &&
            localStorage.getItem("searchString") !== "null"
        ) {
            setSearchString(localStorage.getItem("searchString")!);
        }
        // if (localStorage.getItem("searchString") !== null || localStorage.getItem("searchString") !== "" || localStorage.getItem("searchString") !== "null") {
        //     localStorage.removeItem("searchString");
        // }
    });

    const clickSearch = (e: Event) => {
        if (
            searchString() !== null &&
            searchString() !== "" &&
            searchString() !== "null"
        ) {
            localStorage.setItem("searchString", searchString());
            console.log("Set Search to Local Storage", searchString());
        }

        // console.log(window.location.href)
        if (
            window.location.pathname !== `/resources` &&
            window.location.pathname !== `/${lang}/resources`
        ) {
            window.location.href = `/${lang}/resources`;
        } else {
            //This relies on the search button on the resources page from the SearchBar component - if that button gets removed then this will need to be changed
            document.getElementById("searchButton")?.click();
        }
    };

    createEffect(() => {
        // Execute a function when the user presses a key on the keyboard
        document
            .getElementById("headerSearch")
            ?.addEventListener("keydown", (e: KeyboardEvent) => {
                console.log("Search Input Event:");
                console.log(e);
                // If the user presses the "Enter" key on the keyboard
                if (e.code === "Enter") {
                    // // Cancel the default action, if needed
                    // e.preventDefault();
                    // Trigger the button element with a click
                    console.log(searchString());
                    clickSearch(e);
                }
            });
    });

    return (
        <div class="search-form mx-4 mt-2 flex h-full w-full items-center justify-center">
            <div class="form flex h-full w-full items-center justify-between rounded-full border border-border1 px-1 text-ptext1  focus:border-2 focus:border-highlight1 focus:outline-none dark:border-border1-DM dark:focus:border-highlight1-DM">
                <input
                    type="text"
                    name="query"
                    id="headerSearch"
                    aria-label={t("formLabels.search")}
                    class="ml-2 h-full w-full rounded-full bg-background1 py-3 dark:bg-background1-DM dark:text-white"
                    value={searchString() ? searchString() : ""}
                    oninput={(e) => setSearchString(e.target.value)}
                />
                <IconSearch class="search-icon mr-2 dark:text-white" />
            </div>
        </div>
    );
};
