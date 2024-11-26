import type { Component } from "solid-js";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import Modal, { closeModal } from "@components/common/notices/modal";
import type { ListData } from "@lib/types";
import { CreateFavoriteList } from "@components/members/user/createFavoriteList";
import { createStore } from "solid-js/store";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    // Define the type of the prop
    // (Id, UserId)
    id: number;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const [favoritesLists, setFavoritesLists] = createSignal<ListData[]>([]);

export const FavoriteButton: Component<Props> = (props) => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [listNumber, setListNumber] = createSignal<string>("");
    const [added, setAdded] = createSignal<boolean>(false);
    const [favoritedProducts, setFavoritedProducts] = createSignal<number[]>(
        []
    );
    const [isFavorited, setIsFavorited] = createSignal<boolean>(false);
    const [notUser, setNotUser] = createSignal<boolean>(false);
    const [loading, setLoading] = createSignal<boolean>(false);
    const [signInToAdd, setSignInToAdd] = createSignal<boolean>(false);
    // const [favoritesLists, setFavoritesLists] = createSignal<ListData[]>([]);

    onMount(async () => {
        if (UserError) {
            console.log("User Error: " + UserError.message);
        } else {
            console.log("User: ", User.session);
            if (User.session === null) {
                setSession(null);
                setNotUser(true);
                console.log("NotUser: ", notUser());
                console.log("Is Favorited: ", isFavorited());
            } else {
                setSession(User.session);
            }
        }

        if (session() !== null) {
            await getFavorites();
            await getLists();
        }
    });

    //Refactor so we aren't fetching all the favorite ids for every instance of the button
    const getFavorites = async () => {
        const response = await fetch("/api/getUserFavoriteIds", {
            method: "POST",
            body: JSON.stringify({
                access_token: session()?.access_token,
                refresh_token: session()?.refresh_token,
                lang: lang,
                customer_id: session()?.user.id,
            }),
        });

        const data = await response.json();

        if (data.favoriteIds) {
            setFavoritedProducts(data.favoriteIds);
            setIsFavorited(false);
            favoritedProducts().map((id) => {
                if (props.id === id) {
                    setIsFavorited(true);
                }
            });
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

    const getFavoriteLists = async () => {
        setLoading(true);
        console.log("Updating lists");

        if (notUser() === false) {
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
                console.log(data);
                setFavoritesLists(data.lists);
                console.log(favoritesLists());
            }
            if (response.status !== 200) {
                alert(data.message);
            }
        }

        setLoading(false);
    };

    async function addToFavorites(
        e: Event,
        list_number: string,
        buttonId: string
    ) {
        e.preventDefault();
        e.stopPropagation();

        setListNumber(list_number);
        console.log("Adding to favorites");
        console.log(notUser());

        if (notUser() === false) {
            const { data, error } = await supabase
                .from("favorites_products")
                .insert({
                    list_number: listNumber(),
                    product_id: props.id,
                });
            if (error) {
                console.log("supabase errror: " + error.message);
            }
            console.log(data);
            closeModal(buttonId, e);
            setAdded(true);
            console.log("Please update lists");
            await getFavoriteLists();
            await getFavorites();
            setTimeout(() => setAdded(false), 3000);
        }
    }

    // async function removeFromFavorites(e: Event) {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     console.log("Removing from favorites");

    //     const { data, error } = await supabase
    //         .from("favorites_products")
    //         .delete()
    //         .eq("product_id", props.id)
    //         .eq("list_number", listNumber());
    //     if (error) {
    //         console.log("supabase errror: " + error.message);
    //     }
    //     setAdded(false);
    //     getFavorites();

    //     if (window.location.href.includes("profile")) {
    //         window.location.reload();
    //         // window.location.href = "#favorites";
    //     }
    // }

    const getLists = async () => {
        await getFavoriteLists();
    };

    const notSignedInAdd = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        setSignInToAdd(true);
        setTimeout(() => setSignInToAdd(false), 3000);
    };

    //REFACTOR: Improve the aria label for the favorites button maybe with the post title?
    return (
        //This has to be z-50 so that the modal will render above the Filter menu on mobile which is z-40
        <div class="relative z-30 w-full">
            <Show when={!isFavorited()}>
                <Show when={!notUser()}>
                    <Modal
                        heading={"Save To"}
                        buttonId={`addFavoriteBtn ${props.id}`}
                        buttonClass="absolute right-0 top-0 z-30"
                        buttonAriaLabel={
                            t("ariaLabels.addToFavorites") + " " + props.id
                        }
                        buttonContent={
                            <svg
                                fill="none"
                                stroke="none"
                                viewBox="0 0 512.00 512.00"
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-8 w-8 rounded-full border border-inputBorder1 bg-icon1 fill-icon1 dark:border-inputBorder1-DM dark:bg-icon1-DM dark:fill-icon1-DM"
                            >
                                <g
                                    id="SVGRepo_bgCarrier"
                                    stroke-width="0"
                                    transform="translate(58.879999999999995,58.879999999999995), scale(0.77)"
                                >
                                    <rect
                                        x="0"
                                        y="0"
                                        width="512.00"
                                        height="512.00"
                                        rx="256"
                                        fill="none"
                                        class="fill-icon2 dark:fill-icon1"
                                    ></rect>
                                </g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        class=""
                                        d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm74.69,252.82c-9.38,11.44-26.4,29.73-65.7,56.41a15.93,15.93,0,0,1-18,0c-39.3-26.68-56.32-45-65.7-56.41-20-24.37-29.58-49.4-29.3-76.5.31-31.06,25.22-56.33,55.53-56.33,20.4,0,35,10.63,44.1,20.41a6,6,0,0,0,8.72,0c9.11-9.78,23.7-20.41,44.1-20.41,30.31,0,55.22,25.27,55.53,56.33C360.27,251.42,350.68,276.45,330.69,300.82Z"
                                    ></path>
                                </g>
                            </svg>
                        }
                        headingLevel={6}
                    >
                        <div>
                            <div
                                id="holder"
                                class="flex flex-row flex-wrap justify-start"
                            >
                                <Show
                                    when={
                                        favoritesLists().length > 0 &&
                                        !loading()
                                    }
                                >
                                    {favoritesLists().map((list) => (
                                        <button
                                            class="flex w-40 flex-col p-2"
                                            onclick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                addToFavorites(
                                                    e,
                                                    list.list_number,
                                                    `addFavoriteBtn ${props.id}`
                                                );
                                            }}
                                        >
                                            {listImages(list)}
                                            <div class="mt-2 line-clamp-2 font-bold">
                                                {list.list_name}
                                            </div>
                                            <div class="">
                                                {list.count +
                                                    " " +
                                                    t("postLabels.resources")}
                                            </div>
                                        </button>
                                    ))}
                                </Show>
                            </div>
                            <CreateFavoriteList
                                lang={lang}
                                user_id={session()?.user.id || ""}
                                onListCreated={getFavoriteLists}
                            />
                        </div>
                    </Modal>
                </Show>
                <Show when={notUser()}>
                    <button
                        onclick={(e) => notSignedInAdd(e)}
                        class="absolute right-0 top-0"
                        id="addFavoriteBtn"
                        aria-label={
                            t("ariaLabels.addToFavorites") + " " + props.id
                        }
                    >
                        <svg
                            fill="none"
                            stroke="none"
                            viewBox="0 0 512.00 512.00"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 rounded-full border border-inputBorder1 bg-icon1 fill-icon1 dark:border-inputBorder1-DM dark:bg-icon1-DM dark:fill-icon1-DM"
                        >
                            <g
                                id="SVGRepo_bgCarrier"
                                stroke-width="0"
                                transform="translate(58.879999999999995,58.879999999999995), scale(0.77)"
                            >
                                <rect
                                    x="0"
                                    y="0"
                                    width="512.00"
                                    height="512.00"
                                    rx="256"
                                    fill="none"
                                    class="fill-icon2 dark:fill-icon1"
                                ></rect>
                            </g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    class=""
                                    d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm74.69,252.82c-9.38,11.44-26.4,29.73-65.7,56.41a15.93,15.93,0,0,1-18,0c-39.3-26.68-56.32-45-65.7-56.41-20-24.37-29.58-49.4-29.3-76.5.31-31.06,25.22-56.33,55.53-56.33,20.4,0,35,10.63,44.1,20.41a6,6,0,0,0,8.72,0c9.11-9.78,23.7-20.41,44.1-20.41,30.31,0,55.22,25.27,55.53,56.33C360.27,251.42,350.68,276.45,330.69,300.82Z"
                                ></path>
                            </g>
                        </svg>
                    </button>
                </Show>
            </Show>
            <Show when={isFavorited()}>
                <Modal
                    children={
                        <>
                            <div>
                                <div
                                    id="holder"
                                    class="flex flex-row flex-wrap justify-start"
                                >
                                    <Show
                                        when={
                                            favoritesLists().length > 0 &&
                                            !loading()
                                        }
                                    >
                                        {favoritesLists().map((list) => (
                                            <button
                                                class="flex w-40 flex-col p-2"
                                                onclick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();

                                                    addToFavorites(
                                                        e,
                                                        list.list_number,
                                                        `addFavoriteBtn ${props.id}`
                                                    );
                                                }}
                                            >
                                                {listImages(list)}
                                                <div class="mt-2 line-clamp-2 font-bold">
                                                    {list.list_name}
                                                </div>
                                                <div class="">
                                                    {list.count +
                                                        " " +
                                                        t(
                                                            "postLabels.resources"
                                                        )}
                                                </div>
                                            </button>
                                        ))}
                                    </Show>
                                </div>
                                <div class="sticky -bottom-4 bg-background1 py-4 dark:bg-background1-DM">
                                    <CreateFavoriteList
                                        lang={lang}
                                        user_id={session()?.user.id || ""}
                                        onListCreated={getFavoriteLists}
                                        buttonContent={
                                            "+ " + t("buttons.createList")
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    }
                    heading={"Save To"}
                    buttonId={`addFavoriteBtn ${props.id}`}
                    buttonClass="absolute right-0 top-0"
                    buttonAriaLabel={
                        t("ariaLabels.addToFavorites") + " " + props.id
                    }
                    buttonContent={
                        <svg
                            fill="none"
                            stroke="none"
                            viewBox="0 0 512.00 512.00"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 rounded-full border border-inputBorder1 bg-icon1 fill-icon1 dark:border-inputBorder1-DM dark:bg-icon1-DM dark:fill-icon1-DM"
                        >
                            <g
                                id="SVGRepo_bgCarrier"
                                stroke-width="0"
                                transform="translate(58.879999999999995,58.879999999999995), scale(0.77)"
                            >
                                <rect
                                    x="0"
                                    y="0"
                                    width="512.00"
                                    height="512.00"
                                    rx="256"
                                    fill="none"
                                    class="fill-highlight1 dark:fill-highlight1-DM"
                                ></rect>
                            </g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm74.69,252.82c-9.38,11.44-26.4,29.73-65.7,56.41a15.93,15.93,0,0,1-18,0c-39.3-26.68-56.32-45-65.7-56.41-20-24.37-29.58-49.4-29.3-76.5.31-31.06,25.22-56.33,55.53-56.33,20.4,0,35,10.63,44.1,20.41a6,6,0,0,0,8.72,0c9.11-9.78,23.7-20.41,44.1-20.41,30.31,0,55.22,25.27,55.53,56.33C360.27,251.42,350.68,276.45,330.69,300.82Z"></path>
                            </g>
                        </svg>
                    }
                    headingLevel={6}
                ></Modal>
            </Show>
            <Show when={added() === true}>
                <div class="absolute -right-1 top-24 z-0 w-[190px] rounded-lg bg-background1 py-0.5 text-black shadow-md dark:bg-background1-DM md:w-[194px] lg:w-[240px]">
                    <p class="pr-1 text-center italic text-ptext1 dark:text-ptext1-DM">
                        {t("messages.addedToFavorites")}
                    </p>
                </div>
            </Show>
            <Show when={signInToAdd() === true}>
                <div class="absolute -right-1 top-24 z-0 w-[190px] rounded-lg bg-background1 py-0.5 text-black shadow-md dark:bg-background1-DM md:w-[194px] lg:w-[240px]">
                    <p class="pr-1 text-center italic text-ptext1 dark:text-ptext1-DM">
                        {t("messages.signIntoAddToFavorites")}
                    </p>
                </div>
            </Show>
        </div>
    );
};
