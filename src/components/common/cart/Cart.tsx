import { Show, createEffect, createSignal, onMount, onCleanup } from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { items, setItems } from "@components/common/cart/AddToCartButton";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//Clean up localStorage for testing
// localStorage.removeItem("cartItems");

export const Cart = () => {
    const [totalItems, setTotalItems] = createSignal(0);

    const storedItems = localStorage.getItem("cartItems");

    onMount(() => {
        if (storedItems) {
            setItems(JSON.parse(storedItems));
            let count = 0;
            items.forEach((item) => {
                count += item.quantity;
            });
            setTotalItems(count);
        }
    });

    createEffect(() => {
        let count = 0;
        items.forEach((item) => {
            count += item.quantity;
        });
        setTotalItems(count);
    });

    window.addEventListener("beforeunload", () => {
        if (items.length > 0) {
            localStorage.setItem("cartItems", JSON.stringify(items));
        }
        if (items.length === 0) {
            localStorage.removeItem("cartItems");
        }
    });

    function clickHandler() {
        const listShow = document.getElementById("cartItems");
        if (listShow?.classList.contains("hidden")) {
            listShow?.classList.remove("hidden");
            document.getElementById("cartBackdrop")?.classList.remove("hidden");
        } else {
            listShow?.classList.add("hidden");
        }
    }

    function goToCart() {
        window.location.href = `/${lang}/cart`;
    }

    function shoppingCart() {
        if (items.length > 0) {
            let total = 0;
            items.forEach((item: Post) => {
                if (item.price) {
                    total += item.price * item.quantity;
                }
            });
            return (
                <div>
                    <div class="text-3xl font-bold">
                        {t("cartLabels.myCart")}
                    </div>
                    <div class="mt-2 grid grid-cols-5 justify-between pb-2">
                        <div class="col-span-3 mr-2 inline-block">
                            {t("cartLabels.product")}
                        </div>
                        <div class="mr-2 inline-block text-start">
                            {t("cartLabels.quantity")}
                        </div>
                        <div class="inline-block text-start">
                            {t("cartLabels.price")}
                        </div>
                    </div>
                    <ul>
                        {items.map((item: Post) => (
                            <div class="mt-2 grid grid-cols-5 justify-between border-t-2 border-border1 pb-2 dark:border-border1-DM">
                                <div class="col-span-3 mr-2 inline-block">
                                    {item.title}
                                </div>

                                <div class="inline-block text-center">
                                    {item.quantity}
                                </div>
                                <div class="inline-block text-start">
                                    <Show when={item.price}>
                                        ${item.price.toFixed(2)}
                                    </Show>
                                    <Show when={!item.price}>
                                        {t("messages.free")}
                                    </Show>
                                </div>
                            </div>
                        ))}
                    </ul>
                    <div class="mt-2 grid grid-cols-5 justify-between border-t-2 border-border1 pb-2 dark:border-border1-DM">
                        <div class="col-span-3 mr-2 inline-block font-bold">
                            {t("cartLabels.subTotal")}:{" "}
                        </div>
                        <div class="col-span-2 inline-block text-end font-bold">
                            ${total.toFixed(2)}
                        </div>
                        <div class="col-span-5 mb-1 mt-4 text-center text-xs italic">
                            {t("cartLabels.taxes")}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div class="">
                    <div>{t("cartLabels.emptyCart")}</div>

                    <div class="mt-2 flex justify-between border-t-2 border-border1 pb-2 dark:border-border1-DM">
                        <div class="inline-block">
                            {t("cartLabels.total")}:{" "}
                        </div>
                        <div class="inline-block text-end">$0.00</div>
                    </div>
                </div>
            );
        }
    }

    function hideMenu() {
        document.getElementById("cartItems")?.classList.add("hidden");
        document.getElementById("cartBackdrop")?.classList.add("hidden");
    }

    // ADD EMAIL TO SEND FOR CONTACT US

    return (
        <div class="">
            <button
                onclick={clickHandler}
                class="relative flex w-fit rounded-lg p-1 md:w-14"
                aria-label={t("ariaLabels.cart")}
            >
                <svg
                    viewBox="0 0 24 24"
                    class="h-8 w-8 fill-none stroke-icon1 dark:stroke-icon1-DM"
                >
                    <path
                        d="M3 3H4.37144C5.31982 3 6.13781 3.66607 6.32996 4.59479L8.67004 15.9052C8.86219 16.8339 9.68018 17.5 10.6286 17.5H17.5"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M6.82422 7H19.6743C20.3386 7 20.8183 7.6359 20.6358 8.27472L19.6217 11.8242C19.2537 13.1121 18.0765 14 16.7371 14H8.27734"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="16.5"
                        cy="20.5"
                        r="0.5"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="0.5"
                        cy="0.5"
                        r="0.5"
                        transform="matrix(1 0 0 -1 10 21)"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <Show when={items.length > 0}>
                    <div class="absolute md:-bottom-0.5 md:right-1.5 bottom-0 right-8 flex h-5 w-5 items-center justify-center rounded-full bg-background2 text-xs text-ptext2 opacity-[85%] dark:bg-background2-DM dark:text-ptext2-DM dark:opacity-100">
                        {totalItems()}
                    </div>
                </Show>
            </button>
            <div
                id="cartBackdrop"
                class="cartBackdrop absolute left-0 top-0 hidden h-full w-screen"
                onClick={() => hideMenu()}
            >
                {/* This allows that if someone clicks anywhere outside the modal the modal will hide */}
            </div>
            <div
                id="cartItems"
                class="fixed right-2 z-50 m-2 hidden justify-start rounded-lg bg-background1 p-2 shadow-md shadow-shadow-LM dark:bg-background1-DM dark:shadow-shadow-DM"
            >
                <div>{shoppingCart()}</div>
                {/* TODO: Style */}
                <div class="flex justify-center">
                    <button
                        class="btn-primary"
                        onclick={goToCart}
                        aria-label={t("buttons.viewCart")}
                    >
                        {t("buttons.viewCart")}
                    </button>
                </div>
            </div>
        </div>
    );
};
