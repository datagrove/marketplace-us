import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createEffect, createSignal, Show } from "solid-js";
import { ViewCard } from "../services/ViewCard";
import { MobileViewCard } from "@components/services/MobileViewCard";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "@lib/stripe";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
import type { FilterPostsParams } from "@lib/types";

const lang = getLangFromUrl(new URL(window.location.href));

// Get the user session
const { data: User, error: UserError } = await supabase.auth.getSession();

async function fetchPosts({ lang }: FilterPostsParams) {
    const response = await fetch("/api/fetchFilterPosts", {
        method: "POST",
        body: JSON.stringify({
            lang: lang,
            listing_status: true,
            user_id: User.session?.user.id,
        }),
    });
    const data = await response.json();

    return data;
}

export const ViewCreatorPosts: Component = () => {
    // initialize posts and session
    const [posts, setPosts] = createSignal<Array<Post>>([]);
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const screenSize = useStore(windowSize);

    if (UserError) {
        console.log("User Error: " + UserError.message);
    } else {
        setSession(User.session);
    }

    // get posts from supabase that match with the user id and set them to posts. After that render them through ViewCard.
    // if there is a modification to the posts table, the page will refresh and the posts will be updated.
    createEffect(async () => {
        let res = await fetchPosts({ lang: lang });

        if (res.body.length < 1) {
            alert("No posts available.");
        } else {
            setPosts(res.body);
        }
    });
    return (
        <div class="">
            <Show when={screenSize() !== "sm"}>
                <div class="">
                    <ViewCard posts={posts()} />
                </div>
            </Show>

            <Show when={screenSize() === "sm"}>
                <div class="">
                    <MobileViewCard lang={lang} posts={posts()} />
                </div>
            </Show>
        </div>
    );
};
