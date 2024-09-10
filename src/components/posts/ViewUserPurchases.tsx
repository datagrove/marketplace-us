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
import { ReviewPurchasedResource } from "@components/posts/ReviewPurchasedResource.tsx";
import type { PurchasedPost } from "@lib/types";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

interface Props {
    session: AuthSession | null;
}

export const ViewUserPurchases: Component<Props> = (props) => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [purchasedItems, setPurchasedItems] = createSignal<
        Array<PurchasedPost>
    >([]);
    const [loading, setLoading] = createSignal<boolean>(true);

    onMount(async () => {
        setSession(props.session);
        await getPurchasedItems();
    });

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

        const itemsOrdered = orderDetails?.map((item) => {
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
        });

        const products = orderDetails?.map((item) => item.product_id);
        if (products !== undefined) {
            //Refactor: Consider making an API call for all the calls to seller_post
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
                console.log(productsInfo);
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
                        console.log(item);
                        return item;
                    })
                );

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
