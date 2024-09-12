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
    const imageUrl = formData.get("image_url")
        ? formData.get("image_url")
        : null;
    const resourceUrl = formData.get("resource_url");
    const resourceType = formData.get("resource_types");
    const secular = formData.get("secular");
    const resourceLinks = formData.get("resource_links");
    const draftStatus = formData.get("draft_status");
    const subtopics = formData.get("subtopics");

    // Validate the formData - you'll probably want to do more than this
    if (
        !title ||
        !subject ||
        !content ||
        !gradeLevel ||
        (!resourceUrl && !resourceLinks) ||
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

    const resourceLinksList = resourceLinks?.toString().split(",");
    console.log(resourceLinksList);

    let postSubmission = {
        title: title,
        content: content,
        // product_subject: JSON.parse(subject as string),
        // post_grade: JSON.parse(gradeLevel as string),
        image_urls: imageUrl,
        user_id: user.id,
        resource_urls: resourceUrl,
        // resource_types: JSON.parse(resourceType as string),
        secular: secular?.valueOf(),
        resource_links: resourceLinksList,
        draft_status: draftStatus?.valueOf(),
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
    }

    // else {
    //   console.log("Post ID: " + data[0].id);
    //   console.log("Post Data: " + JSON.stringify(data));
    // }
    const postId = data[0].id;

    try {
        //Insert values into each join table
        if (postId && subject) {
            const { error: subjectError } = await supabase
                .from("seller_post_subject")
                .insert(
                    JSON.parse(subject as string).map((subjectId: string) => ({
                        post_id: postId,
                        subject_id: parseInt(subjectId),
                    }))
                );
            if (subjectError) {
                console.log(subjectError);
                throw subjectError;
                //Thrown errors are not very specific so may want to return a response during testing
                // return new Response(
                //     JSON.stringify({
                //         //TODO Internationalize
                //         message: "Error inserting subject",
                //     }),
                //     { status: 500 }
                // );
            }
        }

        if (postId && gradeLevel) {
            const { error: gradeError } = await supabase
                .from("seller_post_grade")
                .insert(
                    JSON.parse(gradeLevel as string).map((gradeId: string) => ({
                        post_id: postId,
                        grade_id: parseInt(gradeId),
                    }))
                );
            if (gradeError) {
                console.log(gradeError);
                throw gradeError;
                //Thrown errors are not very specific so may want to return a response during testing
                // return new Response(
                //     JSON.stringify({
                //         // TODO Internationalize
                //         message: "Error inserting grade",
                //     }),
                //     { status: 500 }
                // );
            }
        }

        if (postId && resourceType) {
            const { error: resourceTypeError } = await supabase
                .from("seller_post_resource_types")
                .insert(
                    JSON.parse(resourceType as string).map(
                        (resourceTypeId: string) => ({
                            post_id: postId,
                            resource_type_id: parseInt(resourceTypeId),
                        })
                    )
                );
            if (resourceTypeError) {
                console.log(resourceTypeError);
                throw resourceTypeError;
                //Thrown errors are not very specific so may want to return a response during testing
                //     return new Response(
                //         JSON.stringify({
                //             // TODO Internationalize
                //             message: "resource type insert error",
                //         }),
                //         { status: 500 }
                //     );
            }
        }

        if (postId && subtopics) {
            const { error: subtopicError } = await supabase
                .from("seller_post_subtopic")
                .insert(
                    JSON.parse(subtopics as string).map(
                        (subtopicId: string) => ({
                            post_id: postId,
                            subtopic_id: parseInt(subtopicId),
                        })
                    )
                );
            if (subtopicError) {
                console.log("subtopicError: ", subtopicError);
                throw subtopicError;
                //Thrown errors are not very specific so may want to return a response during testing
                // return new Response(
                //     JSON.stringify({
                //         // TODO Internationalize
                //         message: "subtopic insert error",
                //     }),
                //     { status: 500 }
                // );
            }
        }

        //If all inserts are successful, return successful response
        return new Response(
            JSON.stringify({
                message: t("apiErrors.success"),
                id: data[0].id,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log("Error inserting join tables: ", error);

        //Remove post from database
        const { error: deletePostError } = await supabase
            .from("seller_post")
            .delete()
            .eq("id", postId);
        if (deletePostError) {
            console.log("deletePostError: ", deletePostError);
            return new Response(
                JSON.stringify({
                    // TODO Internationalize
                    message: "Error deleting post",
                }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                // TODO Internationalize
                message: "Error inserting join tables",
            }),
            { status: 500 }
        );
    }
};
