import supabase from "@lib/supabaseClientServer";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";
import type { FilterPostsParams, Post } from "@lib/types";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { sortResourceTypes } from "@lib/utils/resourceSort";
import stripe from "@lib/stripe";

export const POST: APIRoute = async ({ request, redirect }) => {
    const {
        subjectFilters,
        gradeFilters,
        searchString,
        resourceFilters,
        secularFilter,
        lang,
        limit,
        draft_status,
        listing_status,
        orderAscending
    }: FilterPostsParams = await request.json();

    const values = ui[lang] as uiObject;
    const postSubjects = values.subjectCategoryInfo.subjects;

    try {
        let query = supabase
            .from("sellerposts")
            .select("*")
            .order("id", { ascending: orderAscending ? orderAscending : false })
            .eq("listing_status", listing_status? listing_status : true)
            .eq("draft_status", draft_status? draft_status : false);

        if (Array.isArray(subjectFilters) && subjectFilters.length !== 0) {
            query = query.overlaps("product_subject", subjectFilters);
        }
        if (Array.isArray(gradeFilters) && gradeFilters.length !== 0) {
            query = query.overlaps("post_grade", gradeFilters);
        }
        if (searchString && searchString.length !== 0) {
            query = query.textSearch("title_content", searchString);
        }
        if (secularFilter === true) {
            query = query.is("secular", true);
        }
        if (Array.isArray(resourceFilters) && resourceFilters.length !== 0) {
            query = query.overlaps("resource_types", resourceFilters);
        }
        if (limit){
            query = query.limit(limit)
        }

        const { data: posts, error } = await query;
        if (error) {
            return new Response(
                JSON.stringify({
                    message: error.message,
                    code: error.code,
                }),
                { status: 500 }
            );
        }

        const { data: gradeData, error: gradeError } = await supabase
            .from("grade_level")
            .select("*");

        if (gradeError) {
            return new Response(
                JSON.stringify({
                    message: gradeError.message,
                }),
                { status: 500 }
            );
        }

        const { data: resourceTypesData, error: resourceTypesError } =
            await supabase.from("resource_types").select("*");

        if (resourceTypesError) {
            return new Response(
                JSON.stringify({
                    message: resourceTypesError.message,
                }),
                { status: 500 }
            );
        }

        let formattedPosts: Post[] = [];

        if (posts && gradeData && resourceTypesData) {
            formattedPosts = await Promise.all(
                posts.map(async (post: Post) => {
                    post.subject = [];
                    postSubjects.forEach((subject) => {
                        post.product_subject.map((productSubject: string) => {
                            if (productSubject === subject.id) {
                                post.subject?.push(subject.name);
                            }
                        });
                    });

                    post.grade = [];
                    gradeData.forEach((databaseGrade) => {
                        post.post_grade.map((postGrade: string) => {
                            if (postGrade === databaseGrade.id.toString()) {
                                post.grade?.push(databaseGrade.grade);
                            }
                        });
                    });

                    sortResourceTypes(resourceTypesData);
                    post.resourceTypes = [];
                    resourceTypesData.forEach((databaseResourceTypes) => {
                        post.resource_types.map((postResourceTypes: string) => {
                            if (
                                postResourceTypes ===
                                databaseResourceTypes.id.toString()
                            ) {
                                post.resource_types.push(
                                    databaseResourceTypes.resource_types
                                );
                            }
                        });
                    });

                    if (post.price_id !== null) {
                        const priceData = await stripe.prices.retrieve(
                            post.price_id
                        );
                        post.price = priceData.unit_amount! / 100;
                    }

                    return post;
                })
            );
        }

        return new Response(
            JSON.stringify({
                body: formattedPosts,
            }),
            { status: 200 }
        );
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
        return new Response(
            JSON.stringify({
                message: e.message,
            }),
            { status: 500 }
        )} else {
            return new Response(
                JSON.stringify({
                    message: "Something went wrong",
                }),
                { status: 500 }
            )
        };
    }
};
