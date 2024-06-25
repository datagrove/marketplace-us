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
import { DownloadBtn } from "@components/members/user/DownloadBtn";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CheckoutStatus: Component = () => {
    // TODO: Merge anonymous user to a real user with stripe email
    const [session, setSession] = createSignal<Stripe.Checkout.Session>();
    const [products, setProducts] = createSignal<Partial<Post>[]>([]);
    const [paid, setPaid] = createSignal(false);
    const [loading, setLoading] = createSignal(true);

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

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .insert({
                    user_id: currentUser.id,
                    first_name: "Guest",
                    last_name: "User",
                    email: email,
                });

            if (profileError) {
                console.log(profileError);
            }

            const { data: user, error: userError } = await supabase
                .from("users")
                .insert({
                    display_name: null,
                    user_id: currentUser.id,
                    image_url: null,
                });
            // const response = await fetch("/api/convertAnonUser", {
            //   method: "POST",
            //   body: JSON.stringify({
            //     userId: currentUser?.id,
            //     email: session()?.customer_details?.email,
            //     lang: lang,
            //   })
            // });
            // const res = await response.json();
            // console.log(res);
        } else {
            console.log("The current user is not anonymous");
        }
    }

    async function fetchOrderedItems() {
        console.log("getting ordered items");
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
            .select("title, resource_urls, id")
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
        console.log("Products: ");
        console.log(products);
        setProducts(products);
        setLoading(false);
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

                        {loading() ? (
                            <div></div>
                        ) : (
                            products().map((item) => (
                                <div class="my-2 grid grid-cols-4 justify-between md:my-4">
                                    <a
                                        href={`/${lang}/posts/${item.id}`}
                                        class="col-span-3"
                                    >
                                        <p class="line-clamp-2 w-full">
                                            {item.title}
                                        </p>
                                    </a>

                                    <DownloadBtn item={item} />
                                </div>
                            ))
                        )}
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
