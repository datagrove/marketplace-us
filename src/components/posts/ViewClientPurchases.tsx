import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import type { Client } from "@lib/types";
import stripe from "@lib/stripe";
import { createSignal, createEffect, Show, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient.tsx";
import { getLangFromUrl, useTranslations } from "../../i18n/utils.ts";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import type { AuthSession } from "@supabase/supabase-js";
import { ViewPurchaseCard } from "@components/services/ViewPurchaseCard.tsx";
import { DownloadBtn } from "../services/DownloadBtn.tsx";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewClientPurchases: Component = () => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [client, setClient] = createSignal<Client>();
    const [purchasedItems, setPurchasedItems] = createSignal<Array<any>>([]);

    if (UserError) {
        console.log("User Error: " + UserError.message);
    } else {
        setSession(User.session);
    }

    onMount(async () => {
        setSession(User?.session);
        await fetchClient(User?.session?.user.id!);
        await getPurchasedItems();
    });

    const getPurchasedItems = async () => {
        console.log("Session Info: ");
        console.log(session());
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*")
            .eq("customer_id", session()?.user.id);
        if (error) {
            console.log("Orders Error: " + error.code + " " + error.message);
            return;
        }
        const orderedItemsIds = orders?.map((order) => order.order_number);

        const { data: orderDetails, error: orderDetailsError } = await supabase
            .from("order_details")
            .select("product_id")
            .in("order_number", orderedItemsIds);
        if (orderDetailsError) {
            console.log(
                "Order Details Error: " +
                    orderDetailsError.code +
                    " " +
                    orderDetailsError.message
            );
        }
        const products = orderDetails?.map((item) => item.product_id);
        console.log(products);
        if (products !== undefined) {
            const { data: productsInfo, error: productsInfoError } =
                await supabase
                    .from("sellerposts")
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

                        if (item.price_id !== null) {
                            const priceData = await stripe.prices.retrieve(
                                item.price_id
                            );
                            item.price = priceData.unit_amount! / 100;
                        }
                        return item;
                    })
                );
                setPurchasedItems(newItems);
                console.log(purchasedItems());
            }
        }
    };

    const fetchClient = async (user_id: string) => {
        try {
            const { data, error } = await supabase
                .from("clientview")
                .select("*")
                .eq("user_id", user_id);

            if (error) {
                console.log(error);
            } else if (data[0] === undefined) {
                alert(t("messages.noClient")); //TODO: Change alert message
                location.href = `/${lang}`;
            } else {
                console.log(data);
                setClient(data[0]);
                console.log(client());
            }
        } catch (error) {
            console.log(error);
        }
    };

    createEffect(async () => {
        const { data, error } = await supabase
            .from("sellerpost")
            .select("all")
            .eq("user_id", session()!.user.id);

            console.log("in ViewClientPurchases createEffect")

            
            // if (error) {
            //     console.log("supabase error: " + error.message);
            // } else {
            //     const newItems = await Promise.all(
            //         data?.map(async (item) => {
            //             item.subject = [];
            //             productCategories.forEach((productCategories) => {
            //                 item.product_subject.map((productSubject: string) => {
            //                     if (productSubject === productCategories.id) {
            //                         item.subject.push(productCategories.name);
            //                         console.log(productCategories.name);
            //                     }
            //                 });
            //             });
            //             delete item.product_subject;
    
            //             const { data: gradeData, error: gradeError } =
            //                 await supabase.from("grade_level").select("*");
    
            //             if (gradeError) {
            //                 console.log("supabase error: " + gradeError.message);
            //             } else {
            //                 item.grade = [];
            //                 gradeData.forEach((databaseGrade) => {
            //                     item.post_grade.map((itemGrade: string) => {
            //                         if (itemGrade === databaseGrade.id.toString()) {
            //                             item.grade.push(databaseGrade.grade);
            //                         }
            //                     });
            //                 });
            //             }
    
            //             if (item.price_id !== null) {
            //                 const priceData = await stripe.prices.retrieve(
            //                     item.price_id
            //                 );
            //                 item.price = priceData.unit_amount! / 100;
            //             }
            //             return item;
            //         })
            //     );
            //     console.log(newItems.map((item) => item.price));
            //     setPurchasedItems(newItems);
            // }
        })

    return (
        <div>
            <div>
                <ViewPurchaseCard posts={ purchasedItems() } />
            </div>
        </div>
    )
}