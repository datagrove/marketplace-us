import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { useTranslations } from "@i18n/utils";
import type { ListData } from "@lib/types";

export const POST: APIRoute = async ({ request, redirect }) => {
    const requestBody = await request.json();
    const url = new URL(request.url);

    //Set internationalization values
    const lang = requestBody.lang;
    //@ts-ignore
    const t = useTranslations(lang);

    const customerId = requestBody.customer_id;
    // const list_number = formData.get("list_number");
    // const list_name = formData.get("list_name");
    const access_token = requestBody.access_token;
    const refresh_token = requestBody.refresh_token;
    // Future work: could add default list here if we want to allow people to change it

    // Validate the formData - you'll probably want to do more than this
    if (!customerId) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.missingFields"),
            }),
            { status: 400 }
        );
    }

    const { data: favorites, error } = await supabase
        .from("favorites")
        .select("list_number")
        .eq("customer_id", customerId);
    if (error) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.favoriteListError"),
            }),
            { status: 500 }
        );
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
        return new Response(
            JSON.stringify({
                message: t("apiErrors.singleListFavoriteError"),
            }),
            { status: 500 }
        );
    }
    if (favoritesProducts) {
        const favoriteIds = favoritesProducts.map((item) => item.product_id);
        return new Response(
            JSON.stringify({
                message: t("apiErrors.success"),
                favoriteIds: favoriteIds,
            }),
            { status: 200 }
        );
    }

    return new Response(
        JSON.stringify({
            message: t("apiErrors.generalErrorFavorite"),
        }),
        { status: 500 }
    );
};
