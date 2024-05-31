import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { useTranslations } from "@i18n/utils";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();

    for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
    }

    //Set internationalization values
    const lang = formData.get("lang");
    //@ts-ignore
    const t = useTranslations(lang);

    const stripeProductId = formData.get("product_id");
    const stripePriceId = formData.get("price_id");
    const postId = formData.get("id");
    const access_token = formData.get("access_token");
    const refresh_token = formData.get("refresh_token");

    // Validate the formData - you'll probably want to do more than this
    if (!stripeProductId || !stripePriceId || !postId) {
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

    let stripeUpdate = {
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
    };

    const { error, data } = await supabase
        .from("seller_post")
        .update([stripeUpdate])
        .eq("id", postId)
        .select();

    if (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                message: t("apiErrors.postError"),
            }),
            { status: 500 }
        );
    } else if (!data) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noPost"),
            }),
            { status: 500 }
        );
    } else {
        console.log("Post Data: " + JSON.stringify(data));
    }

    // Do something with the formData, then return a success response
    return new Response(
        JSON.stringify({
            message: t("apiErrors.success"),
            redirect: "/creator/profile",
        }),
        { status: 200 }
    );
};
