import { Show, createResource, createSignal, onMount } from "solid-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import cart from "../../assets/shopping-cart.svg";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Item {
  description: string;
  price: number;
  price_id: string;
  quantity: number;
}

//TODO Remove this test code
localStorage.items = JSON.stringify([
  { description: "t-shirt", price: 1000, price_id: "", quantity: 2 },
  { description: "watch", price: 2000, price_id: "", quantity: 2 },
]);

export const Cart = () => {
  const [items, setItems] = createSignal<Item[]>([]);

  onMount(() => {
    try {
      setItems(JSON.parse(localStorage.items));
      console.log("Items: " + items().map((item: Item) => item.description));
    } catch (_) {
      setItems([]);
    }
  });

  function clickHandler() {
    const listShow = document.getElementById("cartItems");
    if (listShow?.classList.contains("hidden")) {
      listShow?.classList.remove("hidden");
    } else {
      listShow?.classList.add("hidden");
    }
  }

  function goToCart() {
    window.location.href = `/${lang}/cart`;
  }

  function shoppingCart() {
    if (items().length > 0) {
      {
        console.log("items in cart: " + items().length);
      }
      return (
        <ul>
          {items().map((item: Item) => (
            <div class="flex justify-between mt-2 border-t-2 border-border1 dark:border-border1-DM pb-2">
              <div class="inline-block">{item.description}</div>
              <div class="inline-block text-end">{item.price}</div>
              <div class="inline-block text-end">{item.quantity}</div>
            </div>
          ))}
        </ul>
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
    <div class="">
      <button
        onclick={clickHandler}
        class="rounded-lg  p-2 mr-0 flex"
        //TODO: Internationalize Aria Label
        aria-label="Cart"
      >
        <img src={cart.src} class="w-6 h-6" />
      </button>
      <div
        id="cartItems"
        class="hidden fixed z-50 right-2 bg-background1 dark:bg-background1-DM m-2 p-2 rounded-lg justify-start shadow-md shadow-shadow-LM dark:shadow-shadow-DM"
      >
        <div>{shoppingCart()}</div>
        {/* TODO: Style and Internationalize */}
        <button class="btn-primary" onclick={goToCart}>
          View Cart
        </button>
      </div>
    </div>
  );
};
