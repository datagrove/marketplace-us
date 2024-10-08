import supabase from "@lib/supabaseClientServer";
import type { APIRoute } from "astro";
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
        orderAscending,
        user_id,
        post_id,
        seller_id,
        from,
        to,
        downloadable,
        subtopics,
        priceMin,
        priceMax,
    }: FilterPostsParams = await request.json();

    const values = ui[lang] as uiObject;
    const postSubjects = values.subjectCategoryInfo.subjects;
    const postSubtopics = values.subjectCategoryInfo.subtopics;
    // console.log("From: ", from);
    // console.log(" To: ", to);
    // console.log(subtopics);

    try {
        let query = supabase
            .from("sellerposts")
            .select("*")
            .order("id", {
                ascending: orderAscending ? orderAscending : false,
            });

        if (Array.isArray(subjectFilters) && subjectFilters.length !== 0) {
            query = query.overlaps("subjects", subjectFilters);
        }
        if (Array.isArray(subtopics) && subtopics.length !== 0) {
            query = query.overlaps("subtopics", subtopics);
        }
        if (Array.isArray(gradeFilters) && gradeFilters.length !== 0) {
            query = query.overlaps("grades", gradeFilters);
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
        if (user_id) {
            query = query.eq("user_id", user_id);
        }
        if (draft_status) {
            query = query.eq("draft_status", draft_status);
        }
        if (listing_status) {
            query = query.eq("listing_status", listing_status);
        }
        if (post_id) {
            query = query.in("id", post_id);
        }
        if (seller_id) {
            query = query.eq("seller_id", seller_id);
        }
        if (from !== undefined && to !== undefined && from >= 0 && to >= 0) {
            query = query.range(from, to);
        }
        if (limit) {
            query = query.limit(limit);
        }
        if (downloadable === true) {
            query = query.not("resource_urls", "is", null);
        }
        if (typeof priceMin === "number") {
            query = query.gte("price_value", priceMin);
        }
        if (typeof priceMax === "number") {
            query = query.lte("price_value", priceMax);
        }

        // console.log(query)

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
        // else {
        //     console.log("Posts: ", posts.length);
        // }

        const { data: gradeData, error: gradeError } = await supabase
            .from("grade_level")
            .select("*");

        const { data: resourceTypesData, error: resourceTypesError } =
            await supabase.from("resource_types").select("*");

        if (gradeError || resourceTypesError) {
            return new Response(
                JSON.stringify({
                    message: gradeError?.message || resourceTypesError?.message,
                }),
                { status: 500 }
            );
        }

        let formattedPosts: Post[] = [];

        if (posts && gradeData && resourceTypesData) {
            // console.log(posts);
            formattedPosts = await Promise.all(
                posts.map(async (post: Post) => {
                    post.subject = [];
                    postSubjects.forEach((subject) => {
                        post.subjects.map((productSubject: number) => {
                            if (productSubject === Number(subject.id)) {
                                post.subject?.push(subject.name);
                            }
                        });
                    });

                    post.subtopic = [];
                    postSubtopics.forEach((subtopic) => {
                        post.subtopics.map((productSubtopic: number) => {
                            if (productSubtopic === Number(subtopic.id)) {
                                post.subtopic?.push(subtopic.name);
                            }
                        });
                    });

                    post.grade = [];
                    gradeData.forEach((databaseGrade) => {
                        post.grades.map((postGrade: number) => {
                            if (postGrade === databaseGrade.id) {
                                post.grade?.push(databaseGrade.grade);
                            }
                        });
                    });

                    sortResourceTypes(resourceTypesData);

                    post.resourceTypes = [];
                    resourceTypesData.forEach((databaseResourceTypes) => {
                        post.resource_types.map((postResourceTypes: number) => {
                            if (
                                postResourceTypes === databaseResourceTypes.id
                            ) {
                                post.resourceTypes?.push(
                                    databaseResourceTypes.type
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

                    if (post.image_urls) {
                        // const imageUrls = post.image_urls.split(",");
                        post.image_signedUrls = [];

                        const urls = await Promise.all(
                            post.image_urls.map(async (imageUrl: string) => {
                                const url = await downloadPostImage(imageUrl);
                                if (url) {
                                    post.image_signedUrls = [
                                        ...post.image_signedUrls,
                                        url,
                                    ];
                                    return url;
                                }
                            })
                        );

                        if (post.image_signedUrls.length > 0) {
                            post.image_url = post.image_signedUrls[0];
                        }
                    } else {
                        post.image_signedUrls = [];
                        post.image_url = undefined;
                    }

                    // (post.image_url = await downloadPostImage(
                    //       post.image_urls.split(",")[0]
                    //   ))
                    // : (post.image_url = undefined);

                    const { data: sellerImg, error: sellerImgError } =
                        await supabase
                            .from("sellerview")
                            .select("*")
                            .eq("seller_id", post.seller_id);

                    if (sellerImgError) {
                        console.log(sellerImgError);
                    }

                    if (sellerImg) {
                        if (sellerImg[0].image_url) {
                            post.seller_img = await downloadUserImage(
                                sellerImg[0].image_url
                            );
                        }
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
            );
        } else {
            return new Response(
                JSON.stringify({
                    message: "Something went wrong",
                }),
                { status: 500 }
            );
        }
    }
};

const urlCache = new Map<string, { webpUrl: string; jpegUrl: string }>();

const downloadPostImage = async (path: string) => {
    if (urlCache.has(path)) {
        return urlCache.get(path);
    }

    try {
        const [webpData, jpegData] = await Promise.all([
            supabase.storage
                .from("post.image")
                .createSignedUrl(`webp/${path}.webp`, 60 * 60 * 24 * 30),
            supabase.storage
                .from("post.image")
                .createSignedUrl(`jpeg/${path}.jpeg`, 60 * 60 * 24 * 30),
        ]);

        if (webpData.error || jpegData.error) {
            throw new Error(webpData.error?.message || jpegData.error?.message);
        }

        const url = {
            webpUrl: webpData.data.signedUrl,
            jpegUrl: jpegData.data.signedUrl,
        };
        urlCache.set(path, url); // Cache the URL
        return url;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error downloading image: ", error.message);
        }
    }
};

const downloadUserImage = async (path: string) => {
    if (urlCache.has(path)) {
        return urlCache.get(path);
    }

    try {
        const { data: webpData, error: webpError } = await supabase.storage
            .from("user.image")
            .createSignedUrl(`webp/${path}.webp`, 60 * 60 * 24 * 30);
        if (webpError) {
            throw webpError;
        }
        const webpUrl = webpData.signedUrl;

        const { data: jpegData, error: jpegError } = await supabase.storage
            .from("user.image")
            .createSignedUrl(`jpeg/${path}.jpeg`, 60 * 60 * 24 * 30);
        if (jpegError) {
            throw jpegError;
        }
        const jpegUrl = jpegData.signedUrl;

        const url = { webpUrl, jpegUrl };
        urlCache.set(path, url); // Cache the URL
        return url;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error downloading image: ", error.message);
        }
    }
};
