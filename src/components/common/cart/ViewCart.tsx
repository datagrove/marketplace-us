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

  onMount(async () => {
    await fetchItemDetails();
  })

  const fetchItemDetails = async () => {
    try {
      console.log("Cart Items: " + items.map((item: Item) => item.description));
      const details: ItemDetails[] = [];
      items.forEach(async (item) => {
        if (item.product_id !== "" &&
        !itemsDetails().some((items) => items.product_id === item.product_id)) {
          const { data, error } = await supabase
            .from("sellerposts")
            .select(
              "title, content, image_urls, price_id, product_id, seller_name, seller_id"
            )
            .eq("product_id", item.product_id);
          if (data) {
            console.log(data[0]);
            const currentItem: ItemDetails = data[0];
            currentItem.quantity = item.quantity;
            currentItem.price = item.price;
            console.log(currentItem);
            details.push(currentItem);
          }
          if (error) {
            console.log("Supabase error: " + error.code + " " + error.message);
          }
        } else if (item.product_id !== "" &&
        itemsDetails().some((items) => items.product_id === item.product_id)) {
          const index = itemsDetails().findIndex((itemDetail) => itemDetail.product_id === item.product_id);
          if (index !== -1) {
            const updatedItem: ItemDetails = { ...itemsDetails()[index] };
            details.push(updatedItem)
        }
      }
      });
      console.log("Details" + details)
      setItemsDetails([])
      setItemsDetails(details)
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

  function shoppingCart() {
    if (items.length > 0) {
      let total = 0;
      {
        console.log("items in cart: " + items.length);
      }
      items.forEach((item: Item) => {
        total += item.price * item.quantity;
      });
      setCartTotal(total);
      return (
        <div class="">
          {/* TODO: Internationalize */}
          <div class="text-3xl font-bold text-start">My Cart</div>
          <div class="max-h-screen overflow-auto">
            <CartCard items={itemsDetails()} />
          </div>
        </div>
      );
    } else {
      setCartTotal(0);
      return (
        //TODO: Revisit Styling
        <div class="">
          <div>Cart is empty</div>
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
        <div class="text-start text-xl mb-2">Order Summary</div>
        <div class="border border-border1 dark:border-border1-DM h-fit p-2">
          <div class="mb-4">
            <div class="flex justify-between">
              <div class="inline-block text-start font-bold">
                Subtotal ({totalItems()} items){" "}
              </div>
              <div class="inline-block text-end font-bold">${cartTotal()}</div>
            </div>
          </div>

          <button class="btn-primary" onclick={goToCheckout}>
            {/* TODO: Style and Internationalize */}
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
