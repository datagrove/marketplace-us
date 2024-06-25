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

export const ViewUserPurchases: Component = () => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [user, setUser] = createSignal<User>();
    const [purchasedItems, setPurchasedItems] = createSignal<Array<any>>([]);

    if (UserError) {
        console.log("User Error: " + UserError.message);
    } else {
        setSession(User.session);
    }

    onMount(async () => {
        setSession(User?.session);
        await fetchUser(User?.session?.user.id!);
        await getPurchasedItems();
    });

    const getPurchasedItems = async () => {
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
            const { data: productsInfo, error: productsInfoError } =
                await supabase
                    .from("seller_post")
                    .select("*")
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

                const newItemsDates = newItems.map((item) => {
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
                console.log(purchasedItems());
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
                <Show when={purchasedItems().length > 0}>
                    <ViewPurchaseCard posts={purchasedItems()} />
                </Show>
                <Show when={purchasedItems().length === 0}>
                    <p class="mb-6 italic">{t("messages.noPurchasedItems")}</p>
                    <a href={`/${lang}/services`} class="btn-primary">
                        {t("buttons.browseCatalog")}
                    </a>
                </Show>
            </div>
        </div>
    );
};
