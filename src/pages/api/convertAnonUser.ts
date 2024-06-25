import supabase from "@lib/supabaseClientServiceRole";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";
import { SITE } from "@src/config";
import type { Post } from "@lib/types";
import { lastAction } from "nanostores";

export const POST: APIRoute = async ({ request, redirect }) => {
    const response = await request.json();
    const user_id = response.userId;

    const lang = response.lang;
    const t = useTranslations(lang);
    // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.
    if (!user_id) {
        return new Response(
            JSON.stringify({
                //TODO Internationalize
                message: "No User ID",
            }),
            { status: 400 }
        );
    }

    const { data, error } = await supabase.auth.admin.updateUserById(user_id, {
        email: response.email,
        email_confirm: true,
    });

    if (error) {
        return new Response(
            JSON.stringify({
                message: error.message,
            }),
            { status: 400 }
        );
    }

    let profileSubmission = {
        first_name: "Guest",
        last_name: "User",
        email: response.email,
    };

    const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert([profileSubmission]);
    if (profileError) {
        return new Response(
            JSON.stringify({
                message: profileError.message + " " + t("apiErrors.profileCreateError"),
            }),
            { status: 400 }
        );
    }

    let userSubmission = {
        display_name: null,
        user_id: user_id,
        image_url: null,
    };

    const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([userSubmission]);

    if (userError) {
        return new Response(
            JSON.stringify({
                message: userError.message + " " + t("apiErrors.userCreateProfileError"),
            }),
            { status: 400 }
        );
    }

    if (data.user !== null && userData !== null) {
        // If everything works send a success response
        return new Response(
            JSON.stringify({
                message: "Success",
            }),
            { status: 200 }
        );
    }
    return new Response(
        JSON.stringify({
            message: "Failure",
        }),
        { status: 400 }
    );
};
