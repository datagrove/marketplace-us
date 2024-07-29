import type { Component } from "solid-js";
import type { User } from "@lib/types";
import stripe from "@lib/stripe";
import { createSignal, createEffect, Show, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient.tsx";
import { getLangFromUrl, useTranslations } from "../../i18n/utils.ts";
import { ui } from "../../i18n/ui.ts";
import type { uiObject } from "../../i18n/uiType.ts";
import type { AuthSession } from "@supabase/supabase-js";
import { ViewPurchaseCard } from "@components/services/ViewPurchaseCard.tsx";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewUserFavorites: Component = () => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [user, setUser] = createSignal<User>();
    const [favoritedItems, setFavoritedItems] = createSignal<Array<any>>([]);
    const [loading, setLoading] = createSignal<boolean>(true);

    if (UserError) {
        console.log("User Error: " + UserError.message);
    } else {
        setSession(User.session);
    }

    onMount(async () => {
        setSession(User?.session);
        await fetchUser(User?.session?.user.id!);
        await getFavorites();
    });

    const getFavorites = async () => {
        setLoading(true);
        const { data: favorites, error } = await supabase
            .from("favorites")
            .select("*")
            .eq("customer_id", session()?.user.id);
        if (error) {
            console.log("Favorite Error: " + error.code + " " + error.message);
            return;
        }

        const favoritesListIds = favorites?.map(
            (favorite) => favorite.list_number
        );

        const { data: favoritesProducts, error: favoritesProductsError } =
            await supabase
                .from("favorites_products")
                .select("product_id, list_number")
                .in("list_number", favoritesListIds);
        if (favoritesProductsError) {
            console.log(
                "Favorite Details Error: " +
                    favoritesProductsError.code +
                    " " +
                    favoritesProductsError.message
            );
        }

        const products = favoritesProducts?.map((item) => item.product_id);
        if (products !== undefined) {
            const { data: productsInfo, error: productsInfoError } =
                await supabase
                    .from("seller_post")
                    .select("*")
                    .order("id", { ascending: false })
                    .in("id", products);
            if (productsInfoError) {
                console.log(
                    "Products Info Error: " +
                        productsInfoError.code +
                        " " +
                        productsInfoError.message
                );
                return;
            } else {
                // console.log(productsInfo);
                const newItems = await Promise.all(
                    productsInfo?.map(async (item) => {
                        item.subject = [];
                        productCategories.forEach((productCategories) => {
                            item.product_subject.map(
                                (productSubject: string) => {
                                    if (
                                        productSubject === productCategories.id
                                    ) {
                                        item.subject.push(
                                            productCategories.name
                                        );
                                        console.log(productCategories.name);
                                    }
                                }
                            );
                        });
                        delete item.product_subject;

                        const { data: gradeData, error: gradeError } =
                            await supabase.from("grade_level").select("*");

                        if (gradeError) {
                            console.log(
                                "supabase error: " + gradeError.message
                            );
                        } else {
                            item.grade = [];
                            gradeData.forEach((databaseGrade) => {
                                item.post_grade.map((itemGrade: string) => {
                                    if (
                                        itemGrade ===
                                        databaseGrade.id.toString()
                                    ) {
                                        item.grade.push(databaseGrade.grade);
                                    }
                                });
                            });
                        }

                        if (item.stripe_price_id !== null) {
                            const priceData = await stripe.prices.retrieve(
                                item.stripe_price_id
                            );
                            item.price = priceData.unit_amount! / 100;
                        }
                        // console.log(item);
                        return item;
                    })
                );

                setFavoritedItems(newItems);
                setLoading(false);
                // console.log(favoritedItems());

                // This creates a list of each favorite list with all the products in that favorite list
                // Use this when we go to implement multiple lists
                const favoriteLists = favorites?.map((item) => {
                    console.log(item);
                    item.products = [];
                    favoritesProducts?.map((product) => {
                        if (product.list_number === item.list_number) {
                            const productInfo = newItems.find(
                                (products) => product.product_id === products.id
                            );
                            if (productInfo) {
                                item.products.push(productInfo);
                            }
                        }
                    });
                    return item;
                });
            }
        }
    };

    const fetchUser = async (user_id: string) => {
        try {
            const { data, error } = await supabase
                .from("user_view")
                .select("*")
                .eq("user_id", user_id);

            if (error) {
                console.log(error);
            } else if (data[0] === undefined) {
                alert(t("messages.noUser")); //TODO: Change alert message
                location.href = `/${lang}`;
            } else {
                console.log(data);
                setUser(data[0]);
                console.log(user());
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div id="Cards">
                <Show
                    when={!loading()}
                    fallback={<div>{t("buttons.loading")}</div>}
                >
                    <Show when={favoritedItems().length > 0}>
                        <ViewPurchaseCard posts={favoritedItems()} />
                    </Show>
                    <Show when={favoritedItems().length === 0}>
                        <p class="mb-6 italic">
                            {t("messages.noPurchasedItems")}
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
