import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();

    //Just console.log the formData for troubleshooting
    for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
    }

    //Set internationalization values
    const lang = formData.get("lang");
    //@ts-ignore
    const t = useTranslations(lang);

    //set the formData fields to variables
    const access_token = formData.get("access_token");
    const refresh_token = formData.get("refresh_token");
    const contribution = formData.get("contribution");

    // const firstName = formData.get("FirstName");
    // const lastName = formData.get("LastName");
    const creatorName = formData.get("CreatorName");

    const imageUrl = formData.get("image_url")
        ? formData.get("image_url")
        : null;
    console.log("imageURL: " + imageUrl);

    // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.


    //Get the session from supabase (for the server side) based on the access and refresh tokens
    const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
            refresh_token: refresh_token!.toString(),
            access_token: access_token!.toString(),
        });
    if (sessionError) {
        console.log("supabase error: " + sessionError.message);
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noSession"),
            }),
            { status: 500 }
        );
    }

    console.log(sessionData);

    //Make sure we have a session
    if (!sessionData?.session) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noSession"),
            }),
            { status: 500 }
        );
    }

    //Get the user and make sure we have a user
    const user = sessionData?.session.user;

    if (!user) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noUser"),
            }),
            { status: 500 }
        );
    }

    //Check if creator profile exists and if it does sets a redirect in the json response to send the user to their creator profile

    const { data: creatorExists, error: creatorExistsError } = await supabase
        .from("sellers")
        .select("user_id")
        .eq("user_id", user.id);
    if (creatorExistsError) {
        console.log("supabase error: " + creatorExistsError.message);
    } else if (creatorExists[0] !== undefined) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.creatorExists"),
                redirect: "/creator/profile",
            }),
            { status: 302 }
        );
    }


    //Build our submission to the creators table including the location id from the select from the location table on line 158
    let submission = {
        seller_name: creatorName,
        user_id: user.id,
        image_url: imageUrl,
        contribution: contribution,
    };

    //submit to the creators table and select it back
    const { error, data } = await supabase
        .from("sellers")
        .insert([submission])
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
        console.log("Profile Data: " + JSON.stringify(data));
    }

    // If everything works send a success response
    return new Response(
        JSON.stringify({
            // message: t("apiErrors.success"),
        }),
        { status: 200 }
    );
};
