import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { useTranslations } from "@i18n/utils";

export const POST: APIRoute = async ({ request, redirect }) => {
    const requestData = await request.json();
    const url = new URL(request.url);

    //Set internationalization values
    const lang = requestData.lang;
    //@ts-ignore
    const t = useTranslations(lang);

    const list_number = requestData.list_number;
    // const list_name = formData.get("list_name");
    const access_token = requestData.access_token;
    const refresh_token = requestData.refresh_token;
    const limit = requestData.limit;
    // Future work: could add default list here if we want to allow people to change it

    // Validate the formData - you'll probably want to do more than this
    if (!list_number) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.missingFields"),
            }),
            { status: 400 }
        );
    }

    const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
            refresh_token: refresh_token!.toString(),
            access_token: access_token!.toString(),
        });
    if (sessionError) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noSession"),
            }),
            { status: 500 }
        );
    }

    // console.log(sessionData)

    if (!sessionData?.session) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noSession"),
            }),
            { status: 500 }
        );
    }

    const user = sessionData?.session.user;

    if (!user) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noUser"),
            }),
            { status: 500 }
        );
    }

    let query = supabase
        .from("favorites_products")
        .select("product_id")
        .eq("list_number", list_number);

    if (limit) {
        query = query.limit(limit);
    }

    const { count, error: countError } = await supabase
        .from("favorites_products")
        .select("product_id", { count: "exact" })
        .eq("list_number", list_number);


    const { data, error } = await query;

    //data:[{
    //  list_number: uuid
    //  product_id: int8
    //}]

    if (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                message: t("apiErrors.errorFavoriteFetch"),
            }),
            { status: 500 }
        );
    } else if (!data) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noFavoriteItems"),
            }),
            { status: 500 }
        );
    } else if (data.length === 0 && count === 0) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.success"),
                posts: data,
                count: count,
            }),
            { status: 200 }
        );
    }

    const productsInfo = data.map((item) => item.product_id);
    if (productsInfo !== undefined) {
        const response = await fetch(`${url.origin}/api/fetchFilterPosts`, {
            method: "POST",
            body: JSON.stringify({
                post_id: productsInfo,
                lang: lang,
            }),
        });

        const data = await response.json();

        if (data) {
            return new Response(
                JSON.stringify({
                    message: t("apiErrors.success"),
                    posts: data,
                    count: count,
                }),
                { status: 200 }
            );
        }
    }
    // Return a list of lists with information
    // Need the image from the first item on each list

    return new Response(
        JSON.stringify({
            message: t("apiErrors.generalErrorFavorite"),
        }),
        { status: 500 }
    );
};
