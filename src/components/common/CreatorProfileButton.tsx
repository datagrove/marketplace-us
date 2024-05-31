import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { currentSession } from "../../lib/userSessionStore";
import { useStore } from "@nanostores/solid";

import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CreatorProfileButton: Component = () => {
    const [user, setUser] = createSignal<AuthSession | null>(null);
    const [hidden, setHidden] = createSignal("");

    const CreatorProfileLink = document.getElementById("creatorProfileLink");

    const creatorRedirect = async (e: SubmitEvent) => {
        e.preventDefault();

        try {
            setUser(useStore(currentSession)());

            if (user() === null) {
                alert(t("messages.signIn"));
                location.href = `/${lang}/login`;
            } else {
                const { data: creator, error: creatorError } = await supabase
                    .from("sellers")
                    .select("*")
                    .eq("user_id", user()!.user.id);
                setHidden("hidden");

                if (!creator) {
                    CreatorProfileLink?.classList.add("hidden");
                }
                if (creatorError) {
                    console.log("Error: " + creatorError.message);
                } else if (!creator.length) {
                    alert(t("messages.viewCreatorAccount"));
                    location.href = `/${lang}/creator/createaccount`;
                } else {
                    location.href = `/${lang}/creator/profile`;
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    // console.log(CreatorProfileLink);
    return (
        <div>
            <form onSubmit={creatorRedirect}>
                <button class={hidden()} type="submit" id="creatorProfileLink">
                    {t("buttons.creatorProfile")}
                </button>
            </form>
        </div>
    );
};
