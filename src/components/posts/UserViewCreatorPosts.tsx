import type { Component } from "solid-js";
import type { Post } from "@lib/types";
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

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

interface Props {
    id: string | undefined;
}

export const UserViewCreatorPosts: Component<Props> = (props) => {
    const [posts, setPosts] = createSignal<Array<Post>>([]);
    const screenSize = useStore(windowSize);

    createEffect(async () => {
        const { data, error } = await supabase
            .from("sellerposts")
            .select("*")
            .order("id", { ascending: false })
            .eq("seller_id", props.id)
            .eq("listing_status", true);
        if (!data) {
            alert("No posts available.");
        }
        if (error) {
            console.log("supabase error: " + error.message);
        } else {
            const newItems = await Promise.all(
                data?.map(async (item) => {
                    item.subject = [];
                    productCategories.forEach((productCategories) => {
                        item.product_subject.map((productSubject: string) => {
                            if (productSubject === productCategories.id) {
                                item.subject.push(productCategories.name);
                                console.log(productCategories.name);
                            }
                        });
                    });
                    delete item.product_subject;

                    const { data: gradeData, error: gradeError } =
                        await supabase.from("grade_level").select("*");

                    if (gradeError) {
                        console.log("supabase error: " + gradeError.message);
                    } else {
                        item.grade = [];
                        gradeData.forEach((databaseGrade) => {
                            item.post_grade.map((itemGrade: string) => {
                                if (itemGrade === databaseGrade.id.toString()) {
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
            setPosts(data);
            console.log("Posts");
            console.log(posts());
        }
    });
    return (
        <div class="">
            <Show when={screenSize() !== "sm"}>
                <ViewCard posts={posts()} />
            </Show>
            <Show when={screenSize() === "sm"}>
                <MobileViewCard posts={posts()} />
            </Show>
        </div>
    );
};
