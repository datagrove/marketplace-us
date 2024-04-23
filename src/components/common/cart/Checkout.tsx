import {
  Show,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import cart from "@assets/shopping-cart.svg";
import supabase from "@lib/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import { CartCard } from "@components/common/cart/CartCard";
import { items, setItems } from "@components/common/cart/AddToCartButton";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

console.log("Items to send to checkout: ");
console.log(items);

async function fetchClientCheckoutSecret(){
  const response = await fetch("/api/createStripeCheckout", {
    method: "POST",
    body: JSON.stringify(items),
  });
  const { clientSecret } = await response.json();
  return clientSecret
}

const stripe = await loadStripe(import.meta.env.PUBLIC_VITE_STRIPE_PUBLIC_KEY);

if (stripe === null) {
  // TODO: Internationalize
  alert("Can't load Stripe")
}

export const CheckoutView = () => {
  const [totalItems, setTotalItems] = createSignal(0);
  const [itemsDetails, setItemsDetails] = createSignal<Post[]>([]);
  const [cartTotal, setCartTotal] = createSignal(0);
  const [oldItems, setOldItems] = createSignal<Post[]>([]);

  onMount(async () => {
    await fetchClientCheckoutSecret()
    await mountCheckout()
  })


  createEffect(() => {
    let count = 0;
    items.forEach((item) => {
      count += item.quantity;
    });
    setTotalItems(count);
  });

  async function mountCheckout() {
    const checkout = await stripe!.initEmbeddedCheckout({
      fetchClientSecret: fetchClientCheckoutSecret,
    })

    checkout.mount('#checkout');

  }

  // function updateCards() {
  //   if (items.length > 0 ){
  //   console.log(items)
  //   }
  // }

  // function shoppingCart() {
  //   if (items.length > 0) {
  //     let total = 0;
  //     {
  //       console.log("items in cart: " + items.length);
  //       console.log("Item Details: " + itemsDetails());
  //     }
  //     items.forEach((item: Post) => {
  //       total += item.price * item.quantity;
  //     });
  //     setCartTotal(total);
  //     return (
  //       <div class="">
  //         <div class="text-3xl font-bold text-start">
  //           {t("cartLabels.myCart")}
  //         </div>
  //         <div class="max-h-screen overflow-auto">
  //           <CartCard items={items} deleteItem={updateCards} />
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     setCartTotal(0);
  //     return (
  //       //TODO: Revisit Styling
  //       <div class="">
  //         <div>{t("cartLabels.emptyCart")}</div>
  //       </div>
  //     );
  //   }
  // }

  // ADD EMAIL TO SEND FOR CONTACT US

  return (
    <div class="w-full h-full rounded-full">
      <div class="rounded-full" id="checkout"></div>
    </div>
  );
};
