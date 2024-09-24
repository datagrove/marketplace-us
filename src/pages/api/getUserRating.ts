import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
    const { reviewer_id, resource_id } = await request.json();

    const { error, data } = await supabase
        .from("reviews")
        .select("overall_rating")
        .match({ reviewer_id: reviewer_id, resource_id: resource_id });

    if (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                // message: t("apiErrors.creatorCreateProfileError"),
                message: "fail to fetch",
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
        console.log("Review Data: ", JSON.stringify(data));
    }

    return new Response(
        JSON.stringify({
            body: data,
        }),
        { status: 200 }
    );
};
