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

    const access_token = formData.get("access_token");
    const refresh_token = formData.get("refresh_token");
    const title = formData.get("Title");
    const subject = formData.get("subject");
    const content = formData.get("Content");
    const country = formData.get("country");
    const tax_code = formData.get("TaxCode");
    const price = formData.get("Price");
    const gradeLevel = formData.get("grade");
    // const majorMunicipality = formData.get("MajorMunicipality");
    // const minorMunicipality = formData.get("MinorMunicipality");
    // const governingDistrict = formData.get("GoverningDistrict");
    const imageUrl = formData.get("image_url")
        ? formData.get("image_url")
        : null;
    const resourceUrl = formData.get("resource_url");
    const resourceType = formData.get("resource_types");
    console.log("imageURL: " + imageUrl);
    console.log(formData);

    // Validate the formData - you'll probably want to do more than this
    if (
        !title ||
        !subject ||
        !content ||
        !gradeLevel ||
        !resourceUrl ||
        !tax_code ||
        price === ""
    ) {
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

    let postSubmission = {
        title: title,
        content: content,
        product_subject: JSON.parse(subject as string),
        post_grade: JSON.parse(gradeLevel as string),
        image_urls: imageUrl,
        user_id: user.id,
        resource_urls: resourceUrl,
        resource_types: JSON.parse(resourceType as string),
    };
    const { error, data } = await supabase
        .from("seller_post")
        .insert([postSubmission])
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
            id: data[0].id,
        }),
        { status: 200 }
    );
};
