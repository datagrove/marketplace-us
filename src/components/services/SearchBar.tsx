import type { Component } from "solid-js";
import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import useLocalStorage from "@lib/LocalStorageHook";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    // Define the type for the filterPosts prop
    search: (searchString: string) => void;
}

export const SearchBar: Component<Props> = (props) => {
    const [searchString, setSearchString] = useLocalStorage("searchString", "");

    onMount(() => {
        if (localStorage.getItem("searchString")) {
            setSearchString(localStorage.getItem("searchString")!);
        }
        // window.addEventListener("storage", onStorageChange);
        // window.addEventListener("storage", logEvent);
    });

    const clickSearch = () => {
        localStorage.setItem("searchString", searchString());
        props.search(searchString());
    };

    // function onStorageChange(event: StorageEvent) {
    //     if (event.key === "searchString") {
    //         setSearchString(event.newValue ? event.newValue : "");
    //     }
    // }

    // function logEvent (event: StorageEvent) {
    //     console.log("Storage Event")
    //     console.log(event)
    // }

    // onCleanup(() => {
    //     window.removeEventListener("storage", onStorageChange);
    // });

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
                    console.log("button click");
                    clickSearch();
                }
            });
    });

    return (
        <div class="search-form">
            <div class="form">
                <label class="sr-only" for="search">
                    {t("formLabels.search")}
                </label>
                {/* <input
                    type="text"
                    name="query"
                    id="search"
                    value={searchString()}
                    class="rounded border border-border1 px-1 text-ptext1 placeholder:italic placeholder:text-ptext1 placeholder:opacity-[65%] focus:border-2 focus:border-highlight1 focus:outline-none dark:border-border1-DM dark:focus:border-highlight1-DM"
                    placeholder={t("formLabels.search")}
                    oninput={(e) => setSearchString(e.target.value)}
                /> */}
                {/* <button id="searchButton" class="btn-primary mx-6" onclick={(e) => props.search(searchString())}>{t('formLabels.search')}</button> */}
                <button
                    id="searchButton"
                    class="btn-primary mx-6 hidden"
                    onclick={clickSearch}
                >
                    {t("formLabels.search")}
                </button>
            </div>
        </div>
    );
};
