import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { useTranslations } from "@i18n/utils";
import stripe from "../../lib/stripe";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();

    for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1] + " " + typeof(pair[1]));
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
    const product_id = formData.get("product_id");
    const description = formData.get("description");
    const price = formData.get("Price");
    const gradeLevel = formData.get("grade");
    const idSupabase = formData.get("idSupabase");
    const imageUrl = formData.get("image_url")
        ? formData.get("image_url")
        : null;
    // const resourceUrl = formData.get("resource_url");
    const resourceType = formData.get("resource_types");
    const secular = formData.get("secular");
    const resourceLinks = formData.get("resource_links");
    const draft_status = formData.get("draft_status");
    const subtopics = formData.get("subtopics");

    // Validate the formData - you'll probably want to do more than this
    if (
        !title ||
        !subject ||
        !content ||
        !gradeLevel
        // !resourceUrl ||
        // !tax_code
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

    const prices = await stripe.prices.list({
        product: String(product_id),
        active: true,
    });

    const price_info = await stripe.prices.create({
        unit_amount: Number(price),
        currency: "usd",
        tax_behavior: "exclusive",
        product: String(product_id),
    });

    const default_price = price_info.id;

    const stripe_update = await stripe.products.update(String(product_id), {
        name: String(title),
        description: String(description),
        default_price: default_price,
    });

    if (price) {
        const pricesToArchive = prices.data.map((item) => {
            return item.id;
        });

        pricesToArchive.forEach(async (item) => {
            await stripe.prices.update(String(item), {
                active: false,
            });
        });
    }

    const resourceLinksList = resourceLinks?.toString().split(",");

    if (stripe_update.active) {
        // let postSubmission = {
        //     title: title,
        //     content: content,
        //     // product_subject: JSON.parse(subject as string),
        //     // post_grade: JSON.parse(gradeLevel as string),
        //     image_urls: imageUrl,
        //     user_id: user.id,
        //     stripe_price_id: default_price,
        //     // resource_types: JSON.parse(resourceType as string),
        //     secular: secular?.valueOf(),
        //     resource_links: resourceLinksList,
        //     draft_status: draft_status?.valueOf(),
        // };
        // const { data, error } = await supabase
        //     .from("seller_post")
        //     .update([postSubmission])
        //     .eq("id", idSupabase)
        //     .select();
        // console.log(postSubmission);

        // if (error) {
        //     console.log(error);
        //     return new Response(
        //         JSON.stringify({
        //             message: t("apiErrors.postError"),
        //         }),
        //         { status: 500 }
        //     );
        // } else if (!data) {
        //     return new Response(
        //         JSON.stringify({
        //             message: t("apiErrors.noPost"),
        //         }),
        //         { status: 500 }
        //     );
        // }

        const postId = idSupabase;

        let postSubmission = {
            edit_post_id: Number(postId),
                new_title: title,
                new_content: content,
                new_image_urls: (imageUrl as string).split(",") || [],
                new_stripe_price_id: default_price,
                new_secular: secular === "true" ? true : false,
                new_draft_status: draft_status?.valueOf() === "true" ? true : false,
                new_subjects: JSON.parse(subject as string).map(Number), // Array of subject IDs
                new_grades: JSON.parse(gradeLevel as string).map(Number),  // Array of grade IDs
                new_resource_types: JSON.parse(resourceType as string).map(Number), // Array of resource type IDs
                new_subtopics: JSON.parse(subtopics as string).map(Number) || [], // Array of subtopic IDs
                new_resource_links: resourceLinksList || [], // Array of resourceLinks,
        }

        Object.entries(postSubmission).forEach(([key, value]) => {
            console.log(`${key}: `, value, `(type: ${typeof value})`);
        });

        try {
            const { error } = await supabase.rpc("update_post_with_join_data", {
                ...postSubmission
              });
              
              if (error) {
                console.error('Error updating post:', error);
                throw error;
              } else {
                console.log('Post updated successfully');
                return new Response(
                        JSON.stringify({
                            message: t("apiErrors.success"),
                        }),
                        { status: 200 }
                    );
              }
            // await supabase
            //     .from("seller_post_subject")
            //     .delete()
            //     .eq("post_id", postId);

            // await supabase
            //     .from("seller_post_grade")
            //     .delete()
            //     .eq("post_id", postId);

            // await supabase
            //     .from("seller_post_resource_types")
            //     .delete()
            //     .eq("post_id", postId);

            // await supabase
            //     .from("seller_post_subtopic")
            //     .delete()
            //     .eq("post_id", postId);
            // //Insert values into each join table
            // if (postId && subject) {
            //     const { error: subjectError } = await supabase
            //         .from("seller_post_subject")
            //         .insert(
            //             JSON.parse(subject as string).map(
            //                 (subjectId: string) => ({
            //                     post_id: postId,
            //                     subject_id: parseInt(subjectId),
            //                 })
            //             )
            //         );
            //     if (subjectError) {
            //         console.log(subjectError);
            //         throw subjectError;
            //         //Thrown errors are not very specific so may want to return a response during testing
            //         // return new Response(
            //         //     JSON.stringify({
            //         //         //TODO Internationalize
            //         //         message: "Error inserting subject",
            //         //     }),
            //         //     { status: 500 }
            //         // );
            //     }
            // }

            // if (postId && gradeLevel) {
            //     const { error: gradeError } = await supabase
            //         .from("seller_post_grade")
            //         .insert(
            //             JSON.parse(gradeLevel as string).map(
            //                 (gradeId: string) => ({
            //                     post_id: postId,
            //                     grade_id: parseInt(gradeId),
            //                 })
            //             )
            //         );
            //     if (gradeError) {
            //         console.log(gradeError);
            //         throw gradeError;
            //         //Thrown errors are not very specific so may want to return a response during testing
            //         // return new Response(
            //         //     JSON.stringify({
            //         //         // TODO Internationalize
            //         //         message: "Error inserting grade",
            //         //     }),
            //         //     { status: 500 }
            //         // );
            //     }
            // }

            // if (postId && resourceType) {
            //     const { error: resourceTypeError } = await supabase
            //         .from("seller_post_resource_types")
            //         .insert(
            //             JSON.parse(resourceType as string).map(
            //                 (resourceTypeId: string) => ({
            //                     post_id: postId,
            //                     resource_type_id: parseInt(resourceTypeId),
            //                 })
            //             )
            //         );
            //     if (resourceTypeError) {
            //         console.log(resourceTypeError);
            //         throw resourceTypeError;
            //         //Thrown errors are not very specific so may want to return a response during testing
            //         //     return new Response(
            //         //         JSON.stringify({
            //         //             // TODO Internationalize
            //         //             message: "resource type insert error",
            //         //         }),
            //         //         { status: 500 }
            //         //     );
            //     }
            // }

            // if (postId && subtopics) {
            //     const { error: subtopicError } = await supabase
            //         .from("seller_post_subtopic")
            //         .insert(
            //             JSON.parse(subtopics as string).map(
            //                 (subtopicId: string) => ({
            //                     post_id: postId,
            //                     subtopic_id: parseInt(subtopicId),
            //                 })
            //             )
            //         );
            //     if (subtopicError) {
            //         console.log("subtopicError: ", subtopicError);
            //         throw subtopicError;
            //         //Thrown errors are not very specific so may want to return a response during testing
            //         // return new Response(
            //         //     JSON.stringify({
            //         //         // TODO Internationalize
            //         //         message: "subtopic insert error",
            //         //     }),
            //         //     { status: 500 }
            //         // );
            //     }
            // }

            // //If all inserts are successful, return successful response
            // return new Response(
            //     JSON.stringify({
            //         message: t("apiErrors.success"),
            //         id: data[0].id,
            //     }),
            //     { status: 200 }
            // );
        } catch (error) {
            console.log("Error updating Post: ", error);

            return new Response(
                JSON.stringify({
                    // TODO Internationalize
                    message: "Error updating Post",
                }),
                { status: 500 }
            );
        }
    }

    return new Response(
        JSON.stringify({
            // TODO Internationalize
            message: "Error updating post",
        }),
        { status: 500 }
    );
};
