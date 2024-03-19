import { Show, createResource, createSignal, onMount } from "solid-js";
import type { Component } from "solid-js";
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

interface Props {
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

export const Cart: Component<Props> = (props: Props) => {
  const [items, setItems] = createSignal<Item[]>([]);

  onMount(() => {
    try {
      setItems(JSON.parse(localStorage.items));
    } catch (_) {
      setItems([]);
    }
  });

  function clickHandler() {
    
  }


  return (
    <div class="">
      <button
        onclick={clickHandler}
        class="btn-primary"
        // TODO:Internationalize
        aria-label="Add to Cart"
      >
        {/* TODO Internationalize */}
        Add to Cart
      </button>
      
    </div>
  );
};
