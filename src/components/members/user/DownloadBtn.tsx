import { createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import supabase from "@lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import type { User } from "@lib/types";
import Modal from "@components/common/notices/modal";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    item: Partial<Post>;
}

async function DownloadFiles(resource_urls: string) {
    const response = await fetch("/api/secureDownload", {
        method: "POST",
        body: JSON.stringify({ resourceUrls: resource_urls }),
    });
    const data = await response.json();
    const openAllDownloadUrls = async () => {
        for (const links of data.downloadLinks) {
            let newUrl = new URL(links);
            await window.location.assign(newUrl);
            window.open(newUrl, "_blank");
        }
    };
    openAllDownloadUrls();

    if (response.status == 200) {
        alert("success Download");
    }
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const DownloadBtn: Component<Props> = (props: Props) => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [purchasedItems, setPurchasedItems] = createSignal<
        Array<{ resource_urls: string; resource_links: string[]; id: number }>
    >([]);
    const [purchasedItemsId, setPurchasedItemsId] = createSignal<Array<number>>(
        []
    );
    const [downloadEnabled, setDownloadEnabled] = createSignal(false);
    const [resourceURLs, setResourceURLs] = createSignal<string>("");
    const [resourceLinks, setResourceLinks] = createSignal<Array<string>>([]);
    const [showLinks, setShowLinks] = createSignal(false);

    const fetchUser = async (user_id: string) => {
        try {
            const { data, error } = await supabase
                .from("user_view")
                .select("*")
                .eq("user_id", user_id);

            if (error) {
                console.log(error);
            } else if (data[0] === undefined) {
                alert(t("messages.noUser")); //TODO: Change alert message
                location.href = `/${lang}`;
            } else {
                // console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    onMount(async () => {
        // console.log("Item");
        // console.log(props.item);
        setSession(User?.session);
        // await fetchUser(User?.session?.user.id!);
        await getPurchasedItems();
    });

    const getPurchasedItems = async () => {
        // console.log("Session Info: ");
        // console.log(session());
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*")
            .eq("customer_id", session()?.user.id)
            // TODO: this is going to get change to check with a boolean  and not a string
            .eq("order_status", true);
        if (error) {
            console.log("Orders Error: " + error.code + " " + error.message);
            return;
        }
        const orderedItemsIds = orders?.map((order) => order.order_number);

        // console.log("orders");
        // console.log(orders);

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
        // console.log(products);
        if (products) {
            setPurchasedItemsId(products);
        }
        if (products !== undefined) {
            const { data: productsInfo, error: productsInfoError } =
                await supabase
                    .from("seller_post")
                    .select("resource_urls, resource_links, id")
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
            console.log("Purchased Items");
            console.log(purchasedItems());

            // console.log("Checking purchased items");

            if (props.item.id !== undefined) {
                if (purchasedItemsId().includes(props.item.id)) {
                    for (const purchasedItem of purchasedItems()) {
                        if (purchasedItem.id === props.item.id) {
                            // console.log(purchasedItem.resource_urls);
                            setDownloadEnabled(true);
                            setResourceURLs(purchasedItem.resource_urls);
                            setResourceLinks(purchasedItem.resource_links);
                            // console.log(downloadEnabled());
                            break;
                        }
                    }
                }
            }
        }
    };

    function initializeDownload(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        // console.log("Starting Download");

        // console.log(props.item.id);

        if (props.item.id !== undefined) {
            if (purchasedItemsId().includes(props.item.id)) {
                for (const purchasedItem of purchasedItems()) {
                    if (purchasedItem.id === props.item.id) {
                        console.log(purchasedItem.resource_urls);
                        DownloadFiles(purchasedItem.resource_urls);
                        break;
                    }
                }
            }
        }
    }

    function serveLinks() {
        if (downloadEnabled()) {
            return (
                <>
                    <div class="mb-4 font-bold">
                        {t("messages.resourceLinks")}
                    </div>
                    {resourceLinks().map((link) => (
                        <div>
                            <a
                                class="text-btn1 underline dark:text-btn1-DM"
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {link}
                            </a>
                        </div>
                    ))}
                    <div class="mt-4 italic">
                        {t("messages.externalResourceDisclaimer")}
                    </div>
                </>
            );
        }
    }

    //     <button
    //     class={`${downloadEnabled() ? "btn-cart" : "btn-cart-disabled"} my-2 w-full shadow-none`}
    //     aria-label={t("buttons.downloadResources")}
    //     onclick={(e) => serveLinks(e)}
    //     disabled={!downloadEnabled()}
    // >
    //     {/* TODO Internationalize */}
    //     Get Links
    // </button>

    return (
        <>
            <div class="relative z-10 w-full">
                <Show when={!resourceURLs()}>
                    <Modal
                        buttonClass={`${downloadEnabled() ? "btn-cart" : "btn-cart-disabled"} my-2 w-full shadow-none`}
                        buttonId={"getLinks" + props.item.id}
                        buttonContent={t("buttons.getLinks")}
                        heading={t("formLabels.resourceLinks")}
                        headingLevel={2}
                        children={<>{serveLinks()}</>}
                    ></Modal>
                </Show>

                <Show when={resourceURLs()}>
                    <button
                        class={`${downloadEnabled() ? "btn-cart" : "btn-cart-disabled"} my-2 w-full shadow-none`}
                        aria-label={t("buttons.downloadResources")}
                        onclick={(e) => initializeDownload(e)}
                        disabled={!downloadEnabled()}
                    >
                        {t("buttons.downloadResources")}
                    </button>
                </Show>
            </div>
        </>
    );
};
