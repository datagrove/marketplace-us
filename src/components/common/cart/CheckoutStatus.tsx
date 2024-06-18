import type { Component } from "solid-js";
import {
    Show,
    createEffect,
    createResource,
    createSignal,
    onMount,
} from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { items, setItems } from "@components/common/cart/AddToCartButton";
import type Stripe from "stripe";
import supabase from "@lib/supabaseClient";
import type { Post } from "@lib/types";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CheckoutStatus: Component = () => {
    // TODO: Merge anonymous user to a real user with stripe email
    const [session, setSession] = createSignal<Stripe.Checkout.Session>();
    const [products, setProducts] = createSignal<Partial<Post>[]>([]);
    const [paid, setPaid] = createSignal(false);

    onMount(async () => {
        await CurrentCheckoutStatus();
    });

    function returnToResources() {
        window.location.href = `/${lang}/resources`;
    }

    function viewMyPurchases() {
        window.location.href = `/${lang}/user/profile`;
    }

    async function CurrentCheckoutStatus() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get("session_id");

        const response = await fetch(
            `/api/getCheckoutStatus?session_id=${sessionId}`,
            {
                method: "GET",
            }
        );
        const res = await response.json();
        const session = res.session as Stripe.Checkout.Session;
        if (session) {
            setSession(session);
        }

        if (session.status === "open") {
            window.location.replace(`/${lang}/checkout`);
        } else if (session.status === "complete") {
            console.log(session);
            await fetchOrderedItems();
            await convertUser(session.customer_details?.email as string);
            document.getElementById("success")?.classList.remove("hidden");
            document.getElementById("success")?.classList.add("flex");
            localStorage.removeItem("cartItems");
            if (session.payment_status === "paid") {
                setPaid(true);
            }
            setItems([]);
        }
    }

    async function convertUser(email: string) {
        const {
            data: { user: currentUser },
        } = await supabase.auth.getUser();
        console.log(currentUser);
        //@ts-ignore
        if (currentUser && currentUser.is_anonymous) {
            console.log("The current user is anonymous");
            const { data, error } = await supabase.auth.updateUser({
                email: email,
            });
            if (error) {
                console.log(error);
            }
            console.log(data);
            // const response = await fetch("/api/convertAnonUser", {
            //   method: "POST",
            //   body: JSON.stringify({
            //     userId: currentUser?.id,
            //     email: session()?.customer_details?.email
            //   })
            // });
            // const res = await response.json();
            // console.log(res);
        } else {
            console.log("The current user is not anonymous");
        }
    }

    async function fetchOrderedItems() {
        console.log(session());
        const { data: orderedItems, error } = await supabase
            .from("order_details")
            .select("*")
            .eq("order_number", session()?.metadata?.orderId);
        if (error) {
            console.log(
                "Order Details Error: " + error.code + " " + error.message
            );
            return;
        }
        const orderedItemsIds = orderedItems?.map((item) => item.product_id);
        const { data: products, error: productsError } = await supabase
            .from("seller_post")
            .select("title, resource_urls")
            .in("id", orderedItemsIds);
        if (productsError) {
            console.log(
                "Products Error: " +
                    productsError.code +
                    " " +
                    productsError.message
            );
            return;
        }
        console.log(products);
        setProducts(products);
    }

    return (
        <div class="">
            <div
                class="hidden flex-col items-center justify-center bg-btn1 py-2 text-white md:py-6"
                id="success"
            >
                <div class="flex justify-center">
                    <svg
                        viewBox="0 0 24 24"
                        id="check-mark-circle"
                        class="h-16 w-16 text-btn1 md:h-36 md:w-36"
                    >
                        <circle cx="12" cy="12" r="10" fill="white"></circle>
                        <path
                            d="M11,15.5a1,1,0,0,1-.71-.29l-3-3a1,1,0,1,1,1.42-1.42L11,13.09l4.29-4.3a1,1,0,0,1,1.42,1.42l-5,5A1,1,0,0,1,11,15.5Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
                <p class="text-center text-xl font-bold md:mt-2 md:text-3xl">
                    {t("checkout.success")}
                </p>
                <p class="text-center italic md:my-2">
                    {t("checkout.thankYou")}
                </p>
            </div>
            <div class="flex w-full justify-center">
                <div class="mt-4 w-96 md:w-full md:max-w-[500px]">
                    <div class="text-lg">
                        {t("checkout.orderID")}: {session()?.metadata?.orderId}
                    </div>
                    <div class="mb-4 mt-2 flex justify-between">
                        <p class="font-bold">{t("checkout.total")}</p>

                        <p class="font-bold">
                            $
                            {session()?.amount_total
                                ? (session()!.amount_total! / 100).toFixed(2)
                                : 0}
                        </p>
                    </div>
                    <div>
                        <p class="font-bold">{t("checkout.purchases")}</p>
                        {/* TODO: Clean up rendering */}
                        {/* {products().map((item) => (
                            <div class="grid grid-cols-2">
                                <p>{item.title}</p>
                                TODO: Fix to actually allow download
                                <button disabled={!paid()}>
                                    Download Button
                                </button>
                            </div>
                        ))} */}

                        {products().map((item) => (
                            <div class="my-2 flex justify-between md:my-4">
                                <a href={`/${lang}/posts/${item.id}`}>
                                    <p class="line-clamp-2 w-2/3">
                                        {item.title}
                                    </p>
                                </a>

                                <button class="bg-downloadBtn rounded-full">
                                    <svg
                                        width="60px"
                                        height="40px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        class="fill-white py-1"
                                    >
                                        <path
                                            d="M18.22 20.75H5.78C5.43322 20.7359 5.09262 20.6535 4.77771 20.5075C4.4628 20.3616 4.17975 20.155 3.94476 19.8996C3.70977 19.6442 3.52745 19.3449 3.40824 19.019C3.28903 18.693 3.23525 18.3468 3.25 18V15C3.25 14.8011 3.32902 14.6103 3.46967 14.4697C3.61033 14.329 3.80109 14.25 4 14.25C4.19892 14.25 4.38968 14.329 4.53033 14.4697C4.67099 14.6103 4.75 14.8011 4.75 15V18C4.72419 18.2969 4.81365 18.5924 4.99984 18.8251C5.18602 19.0579 5.45465 19.21 5.75 19.25H18.22C18.5154 19.21 18.784 19.0579 18.9702 18.8251C19.1564 18.5924 19.2458 18.2969 19.22 18V15C19.22 14.8011 19.299 14.6103 19.4397 14.4697C19.5803 14.329 19.7711 14.25 19.97 14.25C20.1689 14.25 20.3597 14.329 20.5003 14.4697C20.641 14.6103 20.72 14.8011 20.72 15V18C20.75 18.6954 20.5041 19.3744 20.0359 19.8894C19.5677 20.4045 18.9151 20.7137 18.22 20.75Z"
                                            fill="none"
                                            class="fill-white"
                                        />
                                        <path
                                            d="M12 15.75C11.9015 15.7504 11.8038 15.7312 11.7128 15.6934C11.6218 15.6557 11.5392 15.6001 11.47 15.53L7.47 11.53C7.33752 11.3878 7.2654 11.1997 7.26882 11.0054C7.27225 10.8111 7.35096 10.6258 7.48838 10.4883C7.62579 10.3509 7.81118 10.2722 8.00548 10.2688C8.19978 10.2654 8.38782 10.3375 8.53 10.47L12 13.94L15.47 10.47C15.6122 10.3375 15.8002 10.2654 15.9945 10.2688C16.1888 10.2722 16.3742 10.3509 16.5116 10.4883C16.649 10.6258 16.7277 10.8111 16.7312 11.0054C16.7346 11.1997 16.6625 11.3878 16.53 11.53L12.53 15.53C12.4608 15.6001 12.3782 15.6557 12.2872 15.6934C12.1962 15.7312 12.0985 15.7504 12 15.75Z"
                                            fill="none"
                                            class="fill-white"
                                        />
                                        <path
                                            d="M12 15.75C11.8019 15.7474 11.6126 15.6676 11.4725 15.5275C11.3324 15.3874 11.2526 15.1981 11.25 15V4C11.25 3.80109 11.329 3.61032 11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4V15C12.7474 15.1981 12.6676 15.3874 12.5275 15.5275C12.3874 15.6676 12.1981 15.7474 12 15.75Z"
                                            fill="none"
                                            class="fill-white"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div class="mt-8 flex flex-col items-center justify-center md:mb-8 md:mt-24 md:flex-row">
                        <button
                            class="my-1 w-64 rounded border border-border1 py-1 dark:border-border1-DM md:mx-4"
                            onClick={viewMyPurchases}
                        >
                            {t("buttons.viewOrders")}
                        </button>

                        <button
                            class="dark:bg-btn1-DM, my-1 w-64 rounded bg-btn1 py-1 text-ptext2 dark:text-ptext2-DM md:mx-4"
                            onClick={returnToResources}
                        >
                            {t("buttons.continueShopping")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
