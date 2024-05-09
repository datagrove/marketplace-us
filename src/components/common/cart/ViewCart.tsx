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
import { CartCardMobile } from "@components/common/cart/CartCardMobile";
import { items, setItems } from "@components/common/cart/AddToCartButton";
import { AuthMode } from "@components/common/AuthMode";
import { CartAuthMode } from "./CartAuthMode";
import supabase from "@lib/supabaseClient";
import { useWindowSize } from "@components/common/WindowSize";
import { WindowSizeContext } from "@components/common/WindowSize";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CartView = () => {
    const [totalItems, setTotalItems] = createSignal(0);
    const [itemsDetails, setItemsDetails] = createSignal<Post[]>([]);
    const [cartTotal, setCartTotal] = createSignal(0);
    const [oldItems, setOldItems] = createSignal<Post[]>([]);
    const screenSize = useWindowSize();

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

    function shoppingCart() {
        if (items.length > 0) {
            let total = 0;
            {
                console.log("items in cart: " + items.length);
                console.log("Item Details: " + itemsDetails());
            }
            items.forEach((item: Post) => {
                total += item.price * item.quantity;
            });
            setCartTotal(total);
            return (
                <div class="">
                    <div class="text-start text-3xl font-bold">
                        {t("cartLabels.myCart")}
                    </div>
                    <div id="cartCards" class="overflow-auto">
                        <Show when={screenSize() === "sm"}>
                            <CartCardMobile
                                items={items}
                                deleteItem={updateCards}
                            />
                        </Show>
                        <Show when={screenSize() !== "sm"}>
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
                    <div>{t("cartLabels.emptyCart")}</div>
                </div>
            );
        }
    }

    return (
        <div class="flex flex-col md:grid md:grid-cols-3">
            Window Size: {screenSize()}
            <div class="col-span-2 inline-block mb-10">
                <div>{shoppingCart()}</div>
            </div>
            <div class="md:col-span-1 md:inline-block justify-center px-2 md:px-0 sticky pb-3 bottom-[110px] bg-background1 dark:bg-background1-DM z-40">
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
                    </div>

                    <div class="">
                        <Show when={totalItems() > 0}>
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
