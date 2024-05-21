import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import supabase from "@lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import type { Client } from "@lib/types";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    item: Post;
}

async function DownloadFiles(resource_urls: string) {
    const response = await fetch("/api/secureDownload", {
        method: "POST",
        body: JSON.stringify({ resourceUrls: resource_urls }),
    });
    const data = await response.json();
    console.log(data);
    data.downloadLinks.map((link: string) => {
        let newUrl = new URL(link);
        console.log(newUrl);
        window.location.assign(newUrl);
        // window.open(newUrl, "_blank");
    });
    if (response.status == 200) {
        alert("success Download");
    }
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const DownloadBtn: Component<Props> = (props: Props) => {
    const [client, setClient] = createSignal<Client>();
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [purchasedItems, setPurchasedItems] = createSignal<
        Array<{ resource_urls: string; id: number }>
    >([]);
    const [purchasedItemsId, setPurchasedItemsId] = createSignal<Array<number>>(
        []
    );

    const fetchClient = async (user_id: string) => {
        try {
            const { data, error } = await supabase
                .from("clientview")
                .select("*")
                .eq("user_id", user_id);

            if (error) {
                console.log(error);
            } else if (data[0] === undefined) {
                alert(t("messages.noClient")); //TODO: Change alert message
                location.href = `/${lang}`;
            } else {
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    onMount(async () => {
        setSession(User?.session);
        await fetchClient(User?.session?.user.id!);
        await getPurchasedItems();
    });

    const getPurchasedItems = async () => {
        console.log("Session Info: ");
        console.log(session());
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*")
            .eq("customer_id", session()?.user.id)
            // TODO: this is going to get change to check with a boolean  and not a string
            .eq("order_status", "true");
        if (error) {
            console.log("Orders Error: " + error.code + " " + error.message);
            return;
        }
        const orderedItemsIds = orders?.map((order) => order.order_number);

        const { data: orderDetails, error: orderDetailsError } = await supabase
            .from("order_details")
            .select("product_id")
            .in("order_number", orderedItemsIds);
        if (orderDetailsError) {
            console.log(
                "Order Details Error: " +
                    orderDetailsError.code +
                    " " +
                    orderDetailsError.message
            );
        }
        const products = orderDetails?.map((item) => item.product_id);
        console.log(products);
        if (products) {
            setPurchasedItemsId(products);
        }
        if (products !== undefined) {
            const { data: productsInfo, error: productsInfoError } =
                await supabase
                    .from("seller_post")
                    .select("resource_urls,id")
                    .in("id", products);

            if (productsInfoError) {
                console.log(
                    "Products Info Error: " +
                        productsInfoError.code +
                        " " +
                        productsInfoError.message
                );
                return;
            }
            setPurchasedItems(productsInfo);
            console.log(purchasedItems());
        }
    };

    function initializeDownload(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        if (purchasedItemsId().includes(props.item.id)) {
            purchasedItems().map((purchasedItem) => {
                if (purchasedItem.id === props.item.id) {
                    DownloadFiles(purchasedItem.resource_urls);
                }
            });
        }
    }
    return (
        <div class="btn-primary relative z-10 w-full">
            <button onclick={(e) => initializeDownload(e)}>
                {t("buttons.freeDownload")}
            </button>
        </div>
    );
};
