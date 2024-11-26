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
import { CreateFavoriteList } from "@components/members/user/createFavoriteList.tsx";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
import { downloadPostImage, downloadUserImage } from "@lib/imageHelper.tsx";
import { AddAllToCart } from "@components/common/cart/AddAllToCart.tsx";
import type { Post, ListData } from "@lib/types";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewUserFavorites: Component = () => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [favoritedItems, setFavoritedItems] = createSignal<Array<Post>>([]);
    const [loading, setLoading] = createSignal<boolean>(true);
    const [multipleLists, setMultipleLists] = createSignal<boolean>(false);
    const [favoriteLists, setFavoriteLists] = createSignal<Array<ListData>>([]);
    const [listName, setListName] = createSignal<string>("");
    const [listNumber, setListNumber] = createSignal<string>("");

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
        console.log("Get user favorites: ", data);
        if (data) {
            if (data.type === "single") {
                console.log(data);
                setFavoritedItems(data.posts);
                setListName(data.list_name);
                setListNumber(data.list_number);
                setLoading(false);
            }
            if (data.type === "multiple") {
                setMultipleLists(true);
                setFavoriteLists(data.lists as ListData[]);
                console.log(data.lists);
                setLoading(false);
            }
        }
        if (response.status !== 200) {
            alert(data.message);
        }
    };

    const getCurrentListFavorites = async (
        list_id: string,
        list_name: string
    ) => {
        setLoading(true);
        const response = await fetch(`/api/getFavoritesOnList`, {
            method: "POST",
            body: JSON.stringify({
                list_number: list_id,
                access_token: session()?.access_token,
                refresh_token: session()?.refresh_token,
                lang: lang,
            }),
        });
        const data = await response.json();

        console.log(data);

        if (data.posts && data.posts.body && data.posts.body.length > 0) {
            setFavoritedItems(data.posts.body);
            setLoading(false);
            setListName(list_name);
            setListNumber(list_id);
        } else {
            alert(t("messages.noPosts"));
            setFavoritedItems([]);
            setLoading(false);
            await getFavorites();
        }
    };

    const listImages = (list: ListData) => {
        if (list.posts.length > 0 && list.posts[0].image_url) {
            return (
                <picture>
                    <source
                        type="image/webp"
                        srcset={list.posts[0].image_url.webpUrl}
                    />
                    <img
                        src={list.posts[0].image_url.jpegUrl}
                        alt={
                            list.posts[0].image_urls?.[0]
                                ? `User Image for Post ${list.posts[0].title}`
                                : "No image"
                        }
                        class="h-36 w-36 rounded-lg bg-background1 object-contain dark:bg-background1-DM"
                        fetchpriority="high"
                        loading="eager"
                    />
                </picture>
            );
        } else {
            return (
                <svg viewBox="0 0 180 180" class="h-36 w-36">
                    <circle
                        cx="90.255"
                        cy="90.193"
                        r="86.345"
                        style="fill:none;fill-opacity:1;stroke:currentColor;stroke-width:2.31085;stroke-dasharray:none;stroke-opacity:1"
                    />
                    <circle
                        cx="90.114"
                        cy="90.788"
                        r="79.812"
                        style="fill:none;fill-opacity:1;stroke:currentColor;stroke-width:2.13599;stroke-dasharray:none;stroke-opacity:1"
                    />
                    <path
                        fill-rule="evenodd"
                        d="M12.063 4.042c2.997-.367 5.737 1.714 6.22 4.689a1 1 0 0 0 .534.731 3.976 3.976 0 0 1 2.153 3.077c.266 2.187-1.285 4.17-3.452 4.435a3.846 3.846 0 0 1-1.018-.016c-.362-.057-.566-.155-.641-.218a1 1 0 0 0-1.274 1.542c.475.393 1.09.57 1.604.651a5.838 5.838 0 0 0 1.572.026c3.271-.4 5.592-3.386 5.195-6.661a5.974 5.974 0 0 0-2.794-4.372c-.86-3.764-4.432-6.348-8.342-5.87a7.607 7.607 0 0 0-5.836 4.065C2.755 6.635 1 9.606 1 12.631c0 .975.334 2.501 1.491 3.798 1.186 1.329 3.13 2.297 6.117 2.297a1 1 0 1 0 0-2c-2.526 0-3.885-.8-4.625-1.63-.769-.86-.983-1.88-.983-2.464 0-1.895.85-3.47 2.22-4.18a7.675 7.675 0 0 0-.036 2.116 1 1 0 1 0 1.986-.241 5.638 5.638 0 0 1 .401-2.884 5.615 5.615 0 0 1 4.492-3.4Zm4.595 8.71a1 1 0 0 0-1.316-1.505l-3.358 2.938-2.344-1.953a1 1 0 0 0-1.28 1.536l2.64 2.2V22a1 1 0 1 0 2 0v-6.046z"
                        clip-rule="evenodd"
                        style="fill:currentColor;fill-opacity:1;stroke:none;stroke-width:1.00012;stroke-dasharray:none;stroke-opacity:1"
                        transform="matrix(5.90906 0 0 6.19044 17.877 12.727)"
                    />
                </svg>
            );
        }
    };

    return (
        <div>
            <div id="CreateFavoritesButton" class="flex justify-end pb-4">
                <CreateFavoriteList
                    lang={lang}
                    user_id={session()?.user.id || ""}
                    onListCreated={getFavorites}
                />
            </div>
            <Show
                when={
                    multipleLists() &&
                    favoritedItems().length === 0 &&
                    !loading()
                }
            >
                <div
                    id="List Cards"
                    class="flex flex-row flex-wrap justify-start"
                >
                    {favoriteLists().map((list) => (
                        <>
                            <button
                                class="flex w-40 flex-col p-2"
                                onclick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    getCurrentListFavorites(
                                        list.list_number,
                                        list.list_name
                                    );
                                }}
                            >
                                {listImages(list)}
                                <div class="mt-2 line-clamp-2 text-start font-bold">
                                    {list.list_name}
                                </div>
                                <div class="">
                                    {list.count +
                                        " " +
                                        t("postLabels.resources")}
                                </div>
                            </button>
                        </>
                    ))}
                </div>
            </Show>
            <div id="Favorites Cards">
                <Show
                    when={!loading()}
                    fallback={<div>{t("buttons.loading")}</div>}
                >
                    <Show when={favoritedItems().length > 0}>
                        <div class="relative mb-4 flex w-full flex-row justify-start text-2xl font-bold">
                            <button
                                class="mr-2 flex items-start"
                                onclick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await getFavorites();
                                    setFavoritedItems([]);
                                }}
                            >
                                &larr;
                            </button>
                            <div class="w-full text-center">{listName()}</div>
                        </div>
                        <Show when={screenSize() !== "sm"}>
                            <ViewCard
                                posts={favoritedItems()}
                                favoriteList={listNumber()}
                                onRemoveFavorite={() =>
                                    getCurrentListFavorites(
                                        listNumber(),
                                        listName()
                                    )
                                }
                            />
                        </Show>
                        <Show when={screenSize() === "sm"}>
                            <MobileViewCard
                                lang={lang}
                                posts={favoritedItems()}
                                favoriteList={listNumber()}
                                onRemoveFavorite={() =>
                                    getCurrentListFavorites(
                                        listNumber(),
                                        listName()
                                    )
                                }
                            />
                        </Show>
                        <AddAllToCart favorites={favoritedItems()} />
                    </Show>

                    <Show
                        when={
                            favoritedItems().length === 0 &&
                            favoriteLists().length === 0
                        }
                    >
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
