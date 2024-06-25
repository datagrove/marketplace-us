import {
    Show,
    createEffect,
    createResource,
    createSignal,
    onMount,
    useContext,
} from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { CartCard } from "@components/common/cart/CartCard";
import { CartCardDonate } from "@components/common/cart/CartCardDonate";
import { CartCardMobile } from "@components/common/cart/CartCardMobile";
import { CartCardDonateMobile } from "@components/common/cart/CartCardDonateMobile";
import { items, setItems } from "@components/common/cart/AddToCartButton";
import { AuthMode } from "@components/common/AuthMode";
import { CartAuthMode } from "./CartAuthMode";
import supabase from "@lib/supabaseClient";
// import { useWindowSize } from "@components/common/WindowSize";
// import { WindowSizeContext } from "@components/common/WindowSize";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CartView = () => {
    const [totalItems, setTotalItems] = createSignal(0);
    const [itemsDetails, setItemsDetails] = createSignal<Post[]>([]);
    const [cartTotal, setCartTotal] = createSignal(0);
    const [donation, setDonation] = createSignal(0);
    const screenSize = useStore(windowSize);

    createEffect(() => {
        let count = 0;
        items.forEach((item) => {
            count += item.quantity;
        });
        setTotalItems(count);
    });

    async function goToCheckout() {
        console.log("Checkout");
        window.location.href = `/${lang}/checkout`;
    }

    async function checkoutAsGuest() {
        console.log("Checkout As Guest");
        await supabase.auth.signInAnonymously();
        window.location.href = `/${lang}/checkout`;
    }

    function updateCards() {
        if (items.length > 0) {
            console.log(items);
        }
    }

    function updateDonation(amount: number) {
        if (amount > 0) {
            localStorage.setItem("donation_amount", amount.toString());
            setDonation(amount);
        } else {
            localStorage.setItem("donation_amount", "0");
            setDonation(0);
        }
    }

    async function goToResources() {
        window.location.href = `/${lang}/resources`;
    }

    function shoppingCart() {
        if (items.length > 0) {
            let total = 0;
            {
                console.log("items in cart: " + items.length);
                console.log("Item Details: " + itemsDetails());
            }
            items.forEach((item: Post) => {
                if (item.price) {
                    total += item.price * item.quantity;
                }
            });
            setCartTotal(total);
            return (
                <div class="">
                    <div class="flex justify-between text-start text-3xl font-bold">
                        {t("cartLabels.myCart")}
                    </div>
                    <div id="cartCards" class="overflow-auto">
                        <Show when={screenSize() === "sm"}>
                            <CartCardMobile
                                items={items}
                                deleteItem={updateCards}
                            />
                            {/* <CartCardDonateMobile
                                onSetDonation={updateDonation}
                            /> */}
                        </Show>
                        <Show when={screenSize() !== "sm"}>
                            {/* <CartCardDonate onSetDonation={updateDonation} /> */}
                            <CartCard items={items} deleteItem={updateCards} />
                        </Show>
                    </div>
                </div>
            );
        } else {
            setCartTotal(0);
            return (
                //TODO: Revisit Styling
                <div class="">
                    <div class="pb-4 text-2xl font-bold md:mr-14 md:border-b">
                        {t("cartLabels.emptyCart")}
                        <div class="p-2">
                            <button
                                class="btn-primary whitespace-nowrap sm:w-full md:w-1/3"
                                onClick={goToResources}
                            >
                                {t("menus.resources")}
                            </button>
                        </div>
                    </div>
                    {/* <Show when={screenSize() === "sm"}>
                        <CartCardDonateMobile onSetDonation={updateDonation} />
                    </Show>
                    <Show when={screenSize() !== "sm"}>
                        <CartCardDonate onSetDonation={updateDonation} />
                    </Show> */}
                </div>
            );
        }
    }

    return (
        <div class="flex flex-col md:grid md:grid-cols-3">
            <div class="col-span-2 mb-10 inline-block">
                <div>{shoppingCart()}</div>
                <div>
                    <Show when={screenSize() === "sm"}>
                        <CartCardDonateMobile onSetDonation={updateDonation} />
                    </Show>
                    <Show when={screenSize() !== "sm"}>
                        <CartCardDonate onSetDonation={updateDonation} />
                    </Show>
                    <a href={`/${lang}/resources`}>
                        <button
                            class="btn-primary mb-2 mt-4"
                            aria-label={t("buttons.continueShopping")}
                        >
                            {t("buttons.continueShopping")}
                        </button>
                    </a>
                </div>
            </div>
            <div class="sticky bottom-[70px] z-40 justify-center bg-background1 px-2 pb-3 dark:bg-background1-DM md:col-span-1 md:inline-block md:px-0">
                <div class="mb-2 text-start text-xl">
                    {t("cartLabels.orderSummary")}
                </div>
                <div class="border border-border1 p-2 dark:border-border1-DM md:h-fit">
                    <div class="mb-4">
                        <div class="flex justify-between">
                            <div class="inline-block text-start font-bold">
                                {t("cartLabels.subTotal")} ({totalItems()}{" "}
                                {t("cartLabels.items")}){" "}
                            </div>
                            <div class="inline-block text-end font-bold">
                                ${cartTotal()}
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <div class="inline-block text-start font-bold">
                                LearnGrove Support
                            </div>
                            <div class="inline-block text-end font-bold">
                                ${donation()}
                            </div>
                        </div>
                    </div>

                    <div class="">
                        <Show when={totalItems() > 0 || donation() > 0}>
                            <CartAuthMode
                                goToCheckout={goToCheckout}
                                checkoutAsGuest={checkoutAsGuest}
                            />
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    );
};
