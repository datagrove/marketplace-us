import supabase from "../../lib/supabaseClientServer";
import stripe from "../../lib/stripe";
import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { useTranslations } from "@i18n/utils";
import { SITE } from "../../config";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();

    for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
    }

    //Set internationalization values
    const lang = formData.get("lang");
    //@ts-ignore
    const t = useTranslations(lang);

    const stripeAccountId = formData.get("account_id");
    const access_token = formData.get("access_token");
    const refresh_token = formData.get("refresh_token");

    // Validate the formData - you'll probably want to do more than this
    if (!stripeAccountId) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.missingFields"),
            }),
            { status: 400 }
        );
    }

    async function getAccountLink() {
        if (stripeAccountId === null) {
            return new Response(
                JSON.stringify({
                    message: t("apiErrors.missingFields"),
                }),
                { status: 500 }
            );
        } else {
            const accountLink = await stripe.accountLinks.create({
                account: stripeAccountId?.toString()!,
                refresh_url: SITE.url + "/creator/profile",
                return_url: SITE.url + "/creator/profile",
                type: "account_onboarding",
            });

            if (!accountLink) {
                return new Response(
                    JSON.stringify({
                        //TODO: Change this error to be more specific like "error creating account link"
                        message: t("apiErrors.creatorCreateProfileError"),
                    }),
                    { status: 500 }
                );
            }

            return accountLink;
        }
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

    const { error, data } = await supabase
        .from("sellers")
        .update({ stripe_connected_account_id: stripeAccountId })
        .eq("user_id", user.id)
        .select();

    if (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                message: t("apiErrors.creatorCreateProfileError"),
            }),
            { status: 500 }
        );
    } else if (!data) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noProfileData"),
            }),
            { status: 500 }
        );
    } else {
        console.log("Post Data: " + JSON.stringify(data));
    }

    const accountLink = await getAccountLink();

    // Do something with the formData, then return a success response
    return new Response(
        JSON.stringify({
            message: t("apiErrors.success"),
            redirect: accountLink.url,
        }),
        { status: 200 }
    );
};
