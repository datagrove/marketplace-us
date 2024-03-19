import { Show, createEffect, createResource, createSignal, onMount } from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import cart from "@assets/shopping-cart.svg";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Item {
  description: string;
  price: number;
  price_id: string;
  quantity: number;
}

export const Cart = () => {
  const [items, setItems] = createSignal<Item[]>([]);
  const [totalItems, setTotalItems] = createSignal(0);

  onMount(() => {
    try {
      setItems(JSON.parse(localStorage.order));
      console.log("Items: " + items().map((item: Item) => item.description));
      items().forEach(item => {
        setTotalItems(totalItems() + item.quantity);
      });
    } catch (_) {
      setItems([]);
    }
  });

  createEffect(() => {
    setTotalItems(0);
    items().forEach(item => {
      setTotalItems(totalItems() + item.quantity);
  })
});

  function clickHandler() {
    if (localStorage.order) {
      setItems(JSON.parse(localStorage.order));
    }
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
      let total = 0;
      {
        console.log("items in cart: " + items().length);
      }
      items().forEach((item: Item) => {
        total += item.price * item.quantity;
      })
      return (
        <div>
        <div class="text-3xl font-bold">Cart</div>
        <ul>
          {items().map((item: Item) => (
            <div class="grid justify-between mt-2 border-t-2 border-border1 dark:border-border1-DM pb-2 grid-cols-5">
              <div class="col-span-3 inline-block mr-2">{item.description}</div>
              <div class="inline-block text-start">${item.price.toFixed(2)}</div>
              <div class="inline-block text-end">{item.quantity}</div>
            </div>
          ))}
        </ul>
        <div class="grid justify-between mt-2 border-t-2 border-border1 dark:border-border1-DM pb-2 grid-cols-5">
          {/* TODO: Internationalize */}
          <div class="col-span-3 inline-block mr-2">Subtotal: </div>
          <div class="col-span-2 inline-block text-end">${total}</div>
          <div class="col-span-5 text-xs italic text-center mt-4 mb-1">Taxes calculated at checkout</div>
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
    <div class="">
      <button
        onclick={clickHandler}
        class="rounded-lg p-1 mr-0 w-14 flex relative"
        //TODO: Internationalize Aria Label
        aria-label="Cart"
      >
        <img src={cart.src} class="w-8 h-8" />
        <Show when={items().length > 0}>
          <div class="absolute -bottom-0.5 right-1.5 bg-background2 dark:bg-background2-DM text-ptext2 dark:text-ptext2-DM opacity-[85%] rounded-full w-5 h-5 text-xs flex justify-center items-center">{totalItems()}</div>
        </Show>
      </button>
      <div
        id="cartItems"
        class="hidden fixed z-50 right-2 bg-background1 dark:bg-background1-DM m-2 p-2 rounded-lg justify-start shadow-md shadow-shadow-LM dark:shadow-shadow-DM"
      >
        <div>{shoppingCart()}</div>
        {/* TODO: Style and Internationalize */}
        <div class="flex justify-center">
        <button class="btn-primary" onclick={goToCart}>
          View Cart
        </button>
        </div>
      </div>
    </div>
  );
};
