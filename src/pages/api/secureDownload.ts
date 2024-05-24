import supabase from "@lib/supabaseClientServiceRole";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";
import { SITE } from "@src/config";
import type { Post } from "@lib/types";

export const POST: APIRoute = async ({ request, redirect }) => {
    const response = await request.json();
    const resourceUrls = response.resourceUrls;
    var urlsToReturn: string[];

    const arrayUrls = resourceUrls.split(",");
    // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.
    urlsToReturn = await Promise.all(
        arrayUrls.map(async (resourceUrl: string) => {
            const { data, error } = await supabase.storage
                .from("resources")
                .createSignedUrl(resourceUrl, 60, { download: true });

            if (data) {
                return data.signedUrl;
            }
            if (error) {
                return new Response(
                    JSON.stringify({
                        message: error.message,
                    }),
                    { status: 400 }
                );
            }
        })
    );

    return new Response(
        JSON.stringify({
            message: "Success",
            downloadLinks: urlsToReturn,
        }),
        { status: 200 }
    );
};
