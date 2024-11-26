import type { Component } from "solid-js";
import type { FilterPostsParams, Post, User } from "@lib/types";
import stripe from "@lib/stripe";
import { createSignal, createEffect, Show, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient.tsx";
import { getLangFromUrl, useTranslations } from "../../i18n/utils.ts";
import { ui } from "../../i18n/ui.ts";
import type { uiObject } from "../../i18n/uiType.ts";
import type { AuthSession } from "@supabase/supabase-js";
import { ViewPurchaseCard } from "@components/services/ViewPurchaseCard.tsx";
import { ReviewPurchasedResource } from "@components/posts/ReviewPurchasedResource.tsx";
import type { PurchasedPost } from "@lib/types";

interface Props {
    session: AuthSession | null;
    lang: "en" | "es" | "fr";
}

export const ViewUserPurchases: Component<Props> = (props) => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [purchasedItems, setPurchasedItems] = createSignal<
        Array<PurchasedPost>
    >([]);
    const [loading, setLoading] = createSignal<boolean>(true);
    const lang = props.lang;

    const t = useTranslations(lang);

    const values = ui[lang] as uiObject;
    const productCategories = values.subjectCategoryInfo.subjects;

    onMount(async () => {
        setSession(props.session);
        await getPurchasedItems();
    });

    async function fetchPosts({ post_id }: FilterPostsParams) {
        const response = await fetch("/api/fetchFilterPosts", {
            method: "POST",
            body: JSON.stringify({
                lang: lang,
                post_id: post_id,
            }),
        });
        const data = await response.json();

        return data;
    }

    const getPurchasedItems = async () => {
        setLoading(true);
        console.log("Session Info: ");
        console.log(session());
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*")
            .eq("customer_id", session()?.user.id)
            .eq("order_status", true);
        if (error) {
            console.log("Orders Error: " + error.code + " " + error.message);
            return;
        }

        const orderedItemsIds = orders?.map((order) => order.order_number);

        const { data: orderDetails, error: orderDetailsError } = await supabase
            .from("order_details")
            .select("product_id, order_number")
            .in("order_number", orderedItemsIds);
        if (orderDetailsError) {
            console.log(
                "Order Details Error: " +
                    orderDetailsError.code +
                    " " +
                    orderDetailsError.message
            );
        }

        const itemsOrdered = orderDetails?.map(
            (item: { product_id: number; order_number: string }) => {
                const order = orders.find(
                    (order) => order.order_number === item.order_number
                );
                if (order) {
                    return {
                        ...item,
                        purchaseDate: new Date(order.order_date).toISOString(),
                    };
                } else {
                    return {
                        ...item,
                        purchaseDate: new Date("2000-01-01").toISOString(),
                    };
                }
            }
        );

        const products = orderDetails?.map((item) => item.product_id);
        if (products !== undefined) {
            //Refactor: Consider making an API call for all the calls to seller_post
            const response = await fetchPosts({
                post_id: products,
                lang: lang,
            });

            if (response.body.length < 1) {
                alert(t("messages.noPost"));
                location.href = `/${lang}/resources`;
            } else {
                const newItems: Post[] = response.body;

                itemsOrdered?.sort(function (a, b) {
                    return b.purchaseDate.localeCompare(a.purchaseDate);
                });

                console.log(itemsOrdered);
                console.log(newItems);

                const newItemsDates: PurchasedPost[] = newItems.map((item) => {
                    const orderInfo = itemsOrdered?.find(
                        (order) => order.product_id === item.id
                    );
                    if (orderInfo) {
                        return {
                            ...item,
                            purchaseDate: orderInfo.purchaseDate,
                        };
                    }
                    return item;
                });

                console.log(newItemsDates);

                setPurchasedItems(newItemsDates);
                setLoading(false);
                console.log(purchasedItems());
            }
        }
    };

    return (
        <div>
            <div id="Cards">
                <Show
                    when={!loading()}
                    fallback={<div>{t("buttons.loading")}</div>}
                >
                    <Show when={purchasedItems().length > 0}>
                        <ViewPurchaseCard posts={purchasedItems()} />
                    </Show>
                    <Show when={purchasedItems().length === 0}>
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
