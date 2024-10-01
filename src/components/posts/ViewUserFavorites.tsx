import type { Component } from "solid-js";
import type { FilterPostsParams, User } from "@lib/types";
import stripe from "@lib/stripe";
import { createSignal, createEffect, Show, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient.tsx";
import { getLangFromUrl, useTranslations } from "../../i18n/utils.ts";
import { ui } from "../../i18n/ui.ts";
import type { uiObject } from "../../i18n/uiType.ts";
import type { AuthSession } from "@supabase/supabase-js";
import { ViewCard } from "@components/services/ViewCard.tsx";
import { MobileViewCard } from "@components/services/MobileViewCard.tsx";

import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
import { downloadPostImage, downloadUserImage } from "@lib/imageHelper.tsx";
import { AddAllToCart } from "@components/common/cart/AddAllToCart.tsx";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewUserFavorites: Component = () => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [favoritedItems, setFavoritedItems] = createSignal<Array<Post>>([]);
    const [loading, setLoading] = createSignal<boolean>(true);

    const screenSize = useStore(windowSize);

    if (UserError) {
        console.log("User Error: " + UserError.message);
    } else {
        setSession(User.session);
    }

    onMount(async () => {
        setSession(User?.session);
        await getFavorites();
    });

    async function fetchPosts({ post_id, lang }: FilterPostsParams) {
        const response = await fetch("/api/fetchFilterPosts", {
            method: "POST",
            body: JSON.stringify({
                lang: lang,
                listing_status: true,
                draft_status: false,
                post_id: post_id,
            }),
        });
        const data = await response.json();

        return data;
    }

    const getFavorites = async () => {
        setLoading(true);
        const response = await fetch("/api/getUserFavorites", {
            method: "POST",
            body: JSON.stringify({
                access_token: session()?.access_token,
                refresh_token: session()?.refresh_token,
                lang: lang,
                customer_id: session()?.user.id,
            }),
        });

        const data = await response.json();
        if (data) {
            if (data.type === "single") {
                console.log(data);
                setFavoritedItems(data.posts.body);
                setLoading(false);
            }
            if (data.type === "multiple") {
                console.log(data);
            }
        }
        if (response.status !== 200) {
            alert(data.message);
        }
    };

    return (
        <div>
            <div id="Cards">
                <Show
                    when={!loading()}
                    fallback={<div>{t("buttons.loading")}</div>}
                >
                    <Show
                        when={
                            favoritedItems().length > 0 && screenSize() !== "sm"
                        }
                    >
                        <ViewCard posts={favoritedItems()} />
                        <AddAllToCart favorites={favoritedItems()} />
                    </Show>

                    <Show
                        when={
                            favoritedItems().length > 0 && screenSize() === "sm"
                        }
                    >
                        <MobileViewCard lang={lang} posts={favoritedItems()} />
                        <AddAllToCart favorites={favoritedItems()} />
                    </Show>
                    <Show when={favoritedItems().length === 0}>
                        <p class="mb-6 italic">
                            {t("messages.noFavoriteItems")}
                        </p>
                        <a href={`/${lang}/resources`} class="btn-primary">
                            {t("buttons.browseCatalog")}
                        </a>
                    </Show>
                </Show>
            </div>
        </div>
    );
};
