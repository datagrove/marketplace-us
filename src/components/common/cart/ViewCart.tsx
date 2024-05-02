import {
  Show,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { CartCard } from "@components/common/cart/CartCard";
import { items, setItems } from "@components/common/cart/AddToCartButton";
import { AuthMode } from "@components/common/AuthMode";
import { CartAuthMode } from "./CartAuthMode";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);


export const CartView = () => {
  const [totalItems, setTotalItems] = createSignal(0);
  const [itemsDetails, setItemsDetails] = createSignal<Post[]>([]);
  const [cartTotal, setCartTotal] = createSignal(0);
  const [oldItems, setOldItems] = createSignal<Post[]>([]);


  createEffect(() => {
    let count = 0;
    items.forEach((item) => {
      count += item.quantity;
    });
    setTotalItems(count);
  });

  async function goToCheckout() {
    console.log("Checkout")
    window.location.href = `/${lang}/checkout`;
  }

  async function checkoutAsGuest() {
    console.log("Checkout As Guest")
  }

  function updateCards() {
    if (items.length > 0 ){
    console.log(items)
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
          <div class="text-3xl font-bold text-start">
            {t("cartLabels.myCart")}
          </div>
          <div class="max-h-screen overflow-auto">
            <CartCard items={items} deleteItem={updateCards} />
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

  // ADD EMAIL TO SEND FOR CONTACT US

  return (
    <div class="grid grid-cols-3">
      <div class="inline-block col-span-2">
        <div>{shoppingCart()}</div>
      </div>
      <div class="justify-center inline-block col-span-1">
        {/* TODO: Internationalization */}
        <div class="text-start text-xl mb-2">
          {t("cartLabels.orderSummary")}
        </div>
        <div class="border border-border1 dark:border-border1-DM h-fit p-2">
          <div class="mb-4">
            <div class="flex justify-between">
              <div class="inline-block text-start font-bold">
                {t("cartLabels.subTotal")} ({totalItems()}{" "}
                {t("cartLabels.items")}){" "}
              </div>
              <div class="inline-block text-end font-bold">${cartTotal()}</div>
            </div>
          </div>

          <div class="">
          <CartAuthMode goToCheckout={goToCheckout} checkoutAsGuest={checkoutAsGuest}/>
          </div>

        </div>
      </div>
    </div>
  );
};
