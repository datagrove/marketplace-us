import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { useTranslations } from "@i18n/utils";

export const POST: APIRoute = async ({ request, redirect }) => {
    const requestBody = await request.json();
    const url = new URL(request.url);

    console.log("GetUserFavorites Request", requestBody);

    //Set internationalization values
    const lang = requestBody.lang;
    //@ts-ignore
    const t = useTranslations(lang);

    const customerId = requestBody.customer_id;
    // const list_number = formData.get("list_number");
    // const list_name = formData.get("list_name");
    const access_token = requestBody.access_token;
    const refresh_token = requestBody.refresh_token;
    // Future work: could add default list here if we want to allow people to change it

    // Validate the formData - you'll probably want to do more than this
    if (!customerId) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.missingFields"),
            }),
            { status: 400 }
        );
    }

    async function getItems(list_number: string, limit?: number) {
        let response: ReadableStream;
        if(limit){
            response = await fetch(`${url.origin}/api/getFavoritesOnList`, {
                method: "POST",
                body: JSON.stringify({
                    list_number: list_number,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    lang: lang,
                    limit: limit,
                }),
            });
    
        } else {
            response = await fetch(`${url.origin}/api/getFavoritesOnList`, {
                method: "POST",
                body: JSON.stringify({
                    list_number: list_number,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    lang: lang,
                }),
            });

        }
        

        const data = await response.json();
        return data;
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

    // let favoritesLists: <number>[] = [];
    // if (!list_number) {
    //     favoritesLists = JSON.parse(list_number as Number);
    // }
    // console.log(favoritesLists);

    const { error, data } = await supabase
        .from("favorites")
        .select("*")
        .eq("customer_id", customerId);

    //data:[{
    //  list_name: text
    //  list_number: uuid
    //  customer_id: uuid
    //  created_date: timestamp
    //  default_list: boolean
    //}]

    if (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                //TODO Fix error message
                message: t("apiErrors.postError"),
            }),
            { status: 500 }
        );
    } else if (!data) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noFavoriteLists"),
            }),
            { status: 500 }
        );
    }

    if (data.length === 0) {
        return new Response(
            JSON.stringify({
                message: t("apiErrors.noFavoriteLists"),
            }),
            { status: 500 }
        );
    } else if (data.length === 1) {
        // Make favorites Items call here
        const response = await getItems(data[0].list_number);
        
        if (response) {
            return new Response(
                JSON.stringify({
                    message: t("apiErrors.success"),
                    type: "single",
                    posts: response.posts,
                }),
                { status: 200 },
            );
        } else {
            return new Response(
                JSON.stringify({
                    // TODO Internationalize
                    message: "Error Getting User Favorites",
                }),
                { status: 500 }
            );
        }
        
    } else {
        // Return a list of lists with information
        let listData = data;
        listData.map(async (list) => {
            const response = await getItems(list.list_number);
            list.count = response.count
            list.image = response.posts[0].image_urls[0]
            return list
        })
        console.log(listData);
        // Need the image from the first item on each list
        return new Response(
            JSON.stringify({
                message: t("apiErrors.success"),
                id: data,
                type: "list",
            }),
            { status: 200 }
        );
    }

    return new Response(
        JSON.stringify({
            // TODO Internationalize
            message: "Error Getting User Favorites",
        }),
        { status: 500 }
    );
};

