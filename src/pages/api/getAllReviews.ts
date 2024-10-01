
import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";
import type { Review } from "@lib/types";

export const POST: APIRoute = async ({ request, redirect }) => {
  console.log(request)
    const {
    resource_id ,
  } = await request.json()

    const { error, data } = await supabase
        .from("reviews")
        .select("*")
        .eq("resource_id",resource_id)

    if (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                // message: t("apiErrors.creatorCreateProfileError"),
                message:"fail to fetch"
            }),
            { status: 500 }
        );
    } else if (!data) {
        return new Response(
            JSON.stringify({
                // message: t("apiErrors.noProfileData"),
                message: "no data to fetch",
            }),
            { status: 500 }
        );
    } else {
        console.log("Profile Data: " + JSON.stringify(data));
    }

    // If everything works send a success response
    return new Response(
        JSON.stringify({
        body:data,
        }),
        { status: 200 }
    );
};
