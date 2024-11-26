import type { Component } from "solid-js";
import type { FilterPostsParams, Post } from "@lib/types";
import { createEffect, createSignal, Show } from "solid-js";
import { ViewCard } from "../services/ViewCard";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "@lib/stripe";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
import { MobileViewCard } from "@components/services/MobileViewCard";

const lang = getLangFromUrl(new URL(window.location.href));

interface Props {
    id: string | undefined;
}

export const UserViewCreatorPosts: Component<Props> = (props) => {
    const [posts, setPosts] = createSignal<Array<Post>>([]);
    const screenSize = useStore(windowSize);

    createEffect(async () => {
        let res = await fetchPosts();

        if (res.body.length < 1) {
            alert("No posts available.");
        } else {
            setPosts(res.body);
        }
    });

    async function fetchPosts() {
        const response = await fetch("/api/fetchFilterPosts", {
            method: "POST",
            body: JSON.stringify({
                lang: lang,
                listing_status: true,
                draft_status: false,
                seller_id: props.id,
            }),
        });
        const data = await response.json();

        return data;
    }

    return (
        <div class="">
            <Show when={screenSize() !== "sm"}>
                <ViewCard posts={posts()} />
            </Show>
            <Show when={screenSize() === "sm"}>
                <MobileViewCard lang={lang} posts={posts()} />
            </Show>
        </div>
    );
};
