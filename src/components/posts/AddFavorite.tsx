import type { Component } from "solid-js";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    // Define the type of the prop
    // (Id, UserId)
    id: number;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const FavoriteButton: Component<Props> = (props) => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [listNumber, setListNumber] = createSignal<string>("");
    const [added, setAdded] = createSignal<boolean>(false);
    const [favoritedProducts, setFavoritedProducts] = createSignal<number[]>(
        []
    );
    const [isFavorited, setIsFavorited] = createSignal<boolean>(false);

    onMount(async () => {
        if (UserError) {
            console.log("User Error: " + UserError.message);
        } else {
            if (User.session === null) {
                console.log("User Session: " + User.session);
                setSession(null);
            } else {
                setSession(User.session);
            }
        }

        const { data, error } = await supabase
            .from("favorites")
            .select("list_number")
            .eq("default_list", true);
        if (error) {
            console.log("supabase errror: " + error.message);
        }

        if (data) {
            if (data.length > 0) {
                setListNumber(data[0].list_number);
            }
        }
        getFavorites();
    });

    const getFavorites = async () => {
        const { data: favorites, error } = await supabase
            .from("favorites")
            .select("list_number")
            .eq("customer_id", session()?.user.id);
        if (error) {
            console.log("Favorite Error: " + error.code + " " + error.message);
            return;
        }

        const { data: favoritesProducts, error: favoritesProductsError } =
            await supabase
                .from("favorites_products")
                .select("product_id")
                .in(
                    "list_number",
                    favorites?.map((favorite) => favorite.list_number)
                );
        if (favoritesProductsError) {
            console.log(
                "Favorite Details Error: " +
                    favoritesProductsError.code +
                    " " +
                    favoritesProductsError.message
            );
        }
        if (favoritesProducts) {
            setFavoritedProducts(
                favoritesProducts.map((item) => item.product_id)
            );
            setIsFavorited(false)
            favoritedProducts().map((id) => {
                if (props.id === id) {
                    setIsFavorited(true);
                }
            });
        }
    };

    async function addToFavorites(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        const { data, error } = await supabase
            .from("favorites_products")
            .insert({
                list_number: listNumber(),
                product_id: props.id,
            });
        if (error) {
            console.log("supabase errror: " + error.message);
        }
        setAdded(true);
        getFavorites();
        setTimeout(() => setAdded(false), 3000);
    }

    async function removeFromFavorites(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        console.log("Removing from favorites");

        const { data, error } = await supabase
            .from("favorites_products")
            .delete()
            .eq("product_id", props.id)
            .eq("list_number", listNumber());
        if (error) {
            console.log("supabase errror: " + error.message);
        }
        setAdded(false);
        getFavorites();
        setTimeout(() => setAdded(false), 3000);
    }

    return (
        <div class="z-20 relative w-full">
            <Show when={!isFavorited()}>
                <button onclick={(e) => addToFavorites(e)} class="absolute top-0 right-0">
                    <svg fill="none" stroke="none" viewBox="0 0 512.00 512.00" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 fill-icon1 dark:fill-icon1-DM">
                        <g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(58.879999999999995,58.879999999999995), scale(0.77)">
                            <rect x="0" y="0" width="512.00" height="512.00" rx="256" fill="none" class="fill-none dark:fill-none"></rect>
                        </g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm74.69,252.82c-9.38,11.44-26.4,29.73-65.7,56.41a15.93,15.93,0,0,1-18,0c-39.3-26.68-56.32-45-65.7-56.41-20-24.37-29.58-49.4-29.3-76.5.31-31.06,25.22-56.33,55.53-56.33,20.4,0,35,10.63,44.1,20.41a6,6,0,0,0,8.72,0c9.11-9.78,23.7-20.41,44.1-20.41,30.31,0,55.22,25.27,55.53,56.33C360.27,251.42,350.68,276.45,330.69,300.82Z"></path>
                        </g>
                    </svg>
                </button>
            </Show>
            <Show when={isFavorited()}>
                <button onclick={(e) => removeFromFavorites(e)} class="absolute top-0 right-0">
                    <svg fill="none" stroke="none" viewBox="0 0 512.00 512.00" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 fill-icon1 dark:fill-icon1-DM">
                        <g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(58.879999999999995,58.879999999999995), scale(0.77)">
                            <rect x="0" y="0" width="512.00" height="512.00" rx="256" fill="none" class="fill-highlight1 dark:fill-highlight1-DM"></rect>
                        </g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm74.69,252.82c-9.38,11.44-26.4,29.73-65.7,56.41a15.93,15.93,0,0,1-18,0c-39.3-26.68-56.32-45-65.7-56.41-20-24.37-29.58-49.4-29.3-76.5.31-31.06,25.22-56.33,55.53-56.33,20.4,0,35,10.63,44.1,20.41a6,6,0,0,0,8.72,0c9.11-9.78,23.7-20.41,44.1-20.41,30.31,0,55.22,25.27,55.53,56.33C360.27,251.42,350.68,276.45,330.69,300.82Z"></path>
                        </g>
                    </svg>
                </button>
            </Show>
            <Show when={added() === true}>
                <div class="rounded-lg bg-background1 dark:bg-background1-DM text-black -right-1 top-24 absolute w-[194px] z-0 py-0.5 shadow-md">
                    <p class="text-center text-ptext1 dark:text-ptext1-DM italic pr-1">{t("messages.addedToFavorites")}</p>
                </div>
            </Show>
        </div>
    );
};
