import {
  Show,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import cart from "@assets/shopping-cart.svg";
import supabase from "@lib/supabaseClient";
import { CartCard } from "@components/common/cart/CartCard";
import { items } from "@components/common/cart/AddToCartButton";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Item {
  description: string;
  price: number;
  price_id: string;
  product_id: string;
  quantity: number;
}

interface ItemDetails {
  content: string;
  title: string;
  seller_name: string;
  seller_id: string;
  seller_image?: string,
  image_urls: string | null;
  price?: number;
  price_id: string;
  quantity?: number;
  product_id: string;
}

export const CartView = () => {
  const [totalItems, setTotalItems] = createSignal(0);
  const [itemsDetails, setItemsDetails] = createSignal<ItemDetails[]>([]);
  const [cartTotal, setCartTotal] = createSignal(0);
  const [oldItems, setOldItems] = createSignal<Item[]>([]);

  onMount(async () => {
    await fetchItemDetails();
  });

  const fetchItemDetails = async () => {
    console.log("Fetching Details");
    try {
      console.log("Cart Items: " + items.map((item: Item) => item.description));
      const promises = items.map(async (item) => {
        if (
          item.product_id !== "" &&
          !itemsDetails().some((items) => items.product_id === item.product_id)
        ) {
          const { data, error } = await supabase
            .from("sellerposts")
            .select(
              "title, content, image_urls, price_id, product_id, seller_name, seller_id"
            )
            .eq("product_id", item.product_id);
          console.log(data);

          if (data) {
            const currentItem: ItemDetails = data[0];

            const { data: sellerData, error: sellerError } = await supabase
              .from("sellerview")
              .select("image_url")
              .eq("seller_id", data[0].seller_id);
              if(sellerData){
                currentItem.seller_image = sellerData[0].image_url
              }
              if (sellerError) {
                console.log("Supabase error: "+ sellerError.code + " " + sellerError.message)
              }
              
            
            currentItem.quantity = item.quantity;
            currentItem.price = item.price;
            return currentItem;
          }
          if (error) {
            console.log("Supabase error: " + error.code + " " + error.message);
          }
        } else if (
          item.product_id !== "" &&
          itemsDetails().some((items) => items.product_id === item.product_id)
        ) {
          const index = itemsDetails().findIndex(
            (itemDetail) => itemDetail.product_id === item.product_id
          );
          if (index !== -1) {
            const updatedItem: ItemDetails = { ...itemsDetails()[index] };
            return updatedItem;
          }
        }
      });
      const details = await Promise.all(promises);
      // console.log("Details" + details)
      // setItemsDetails([])
      console.log("Setting Details: " + details);
      setItemsDetails(details.filter((item): item is ItemDetails => !!item));
    } catch (_) {
      // setItems([]);
      console.log("Cart Error");
    }
  };

  createEffect(() => {
    let count = 0;
    items.forEach((item) => {
      count += item.quantity;
    });
    setTotalItems(count);
  });

  function goToCheckout() {
    window.location.href = `/${lang}/cart`;
  }

  function updateCards() {
    if (items.length > 0 ){
    fetchItemDetails();
    }
  }

  function shoppingCart() {
    if (items.length > 0) {
      let total = 0;
      {
        console.log("items in cart: " + items.length);
        console.log("Item Details: " + itemsDetails());
      }
      items.forEach((item: Item) => {
        total += item.price * item.quantity;
      });
      setCartTotal(total);
      return (
        <div class="">
          <div class="text-3xl font-bold text-start">
            {t("cartLabels.myCart")}
          </div>
          <div class="max-h-screen overflow-auto">
            <CartCard items={itemsDetails()} deleteItem={updateCards} />
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

          <button
            class="btn-primary"
            onclick={goToCheckout}
            aria-label={t("buttons.proceedToCheckout")}
          >
            {/* TODO: Style*/}
            {t("buttons.proceedToCheckout")}
          </button>
        </div>
      </div>
    </div>
  );
};
