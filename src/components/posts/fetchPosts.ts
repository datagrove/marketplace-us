import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "@lib/stripe";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

// one giant filter function that includes the logic for all combinations
export async function fetchFilteredPosts(
    subjectFilters: Array<string>,
    // subjectFilters: Array<string>,
    gradeFilters: Array<string>,
    searchString: string,
    resourceFilters: Array<string>
) {
    try {
        let query = supabase.from("sellerposts").select("*").eq("listing_status", true);
        if (subjectFilters.length !== 0) {
            query = query.overlaps("product_subject", subjectFilters);
        }
        if (gradeFilters.length !== 0) {
            query = query.overlaps("post_grade", gradeFilters);
        }
        if (searchString.length !== 0) {
            query = query.textSearch("title_content", searchString);
        }

        try {
            console.log(query);
            const { data: posts, error } = await query;
            if (error) {
                console.log("supabase error: " + error.code + error.message);
            } else {
                const newItems = await Promise.all(
                    posts?.map(async (item) => {
                        if (item.price_id !== null) {
                            const priceData = await stripe.prices.retrieve(
                                item.price_id
                            );
                            item.price = priceData.unit_amount! / 100;
                        }
                        return item;
                    })
                );
                console.log(newItems);
                return newItems;
            }
        } catch (e) {
            console.error(e);
        }
    } catch (e) {
        console.error(e);
    }
}

export async function fetchAllPosts() {
    try {
        const { data: allPosts, error } = await supabase
            .from("sellerposts")
            .select("*")
            .eq("listing_status", true);

        if (error) {
            console.log("supabase error: " + error.message);
        } else {
            const newItems = await Promise.all(
                allPosts?.map(async (item) => {
                    if (item.price_id !== null) {
                        const priceData = await stripe.prices.retrieve(
                            item.price_id
                        );
                        item.price = priceData.unit_amount! / 100;
                    }
                    return item;
                })
            );
            return newItems;
        }
    } catch (e) {
        console.error(e);
    }
}
