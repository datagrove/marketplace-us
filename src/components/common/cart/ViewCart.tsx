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
  image_urls: string | null;
  price?: number;
  price_id: string;
  quantity?: number;
  product_id: string;
}

export const CartView = () => {
  const [totalItems, setTotalItems] = createSignal(0);
  const [itemsDetails, setItemsDetails] = createSignal<ItemDetails[]>([]);

  onMount(async () => {
    try {
      console.log("Cart Items: " + items.map((item: Item) => item.description));
      items.forEach(async (item) => {
        if (item.product_id !== "") {
          const { data , error } = await supabase.from("sellerposts").select("title, content, image_urls, price_id, product_id, seller_name, seller_id").eq("product_id", item.product_id);
        if (data){
          const currentItem: ItemDetails = data[0];
          currentItem.quantity = item.quantity;
          currentItem.price = item.price;
          console.log(currentItem);
          setItemsDetails([...itemsDetails(), currentItem]);
        } 
        if (error) {
          console.log("Supabase error: " + error.code + " " + error.message);
        }
      }
    });
    } catch (_) {
      // setItems([]);
      console.log("Cart Error");
    }
  });

  createEffect(() => {
    let count = 0;
    items.forEach((item) => {
      count += item.quantity;
    });
    setTotalItems(count);
  })

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
      return (
        <div>
          {/* TODO: Internationalize */}
          <div class="text-3xl font-bold">My Cart</div>
          <CartCard items={itemsDetails()} />
          <div class="grid justify-between mt-2 border-t-2 border-border1 dark:border-border1-DM pb-2 grid-cols-5">
            {/* TODO: Internationalize */}
            <div class="col-span-3 inline-block mr-2">Subtotal: </div>
            <div class="col-span-2 inline-block text-end">${total}</div>
            <div class="col-span-5 text-xs italic text-center mt-4 mb-1">
              Taxes calculated at checkout
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div class="">
          <div>Cart is empty</div>

          <div class="flex justify-between mt-2 border-t-2 border-border1 dark:border-border1-DM pb-2">
            {/* TODO: Internationalize */}
            <div class="inline-block">Total: </div>
            <div class="inline-block text-end">$0.00</div>
          </div>
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
          <button class="btn-primary" onclick={goToCheckout}>
            {/* TODO: Style and Internationalize */}
            Proceed to Checkout
          </button>
        </div>
    </div>
  );
};
