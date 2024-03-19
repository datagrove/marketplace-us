import { Show, createResource, createSignal, onMount } from "solid-js";
import type { Component } from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import cart from "@assets/shopping-cart.svg";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Item {
  description: string;
  price: number;
  price_id: string;
  quantity: number;
  product_id: string;
}

interface Props {
  description: string;
  price: number;
  price_id: string;
  quantity: number;
  product_id: string;
}

//TODO Remove this test code
if (localStorage.order === undefined || localStorage.order === null) {
  localStorage.order = JSON.stringify([
    {
      description: "t-shirt",
      price: 10,
      price_id: "",
      product_id: "",
      quantity: 3,
    },
    {
      description: "watch",
      price: 20.99,
      price_id: "",
      product_id: "",
      quantity: 1,
    },
  ]);
}

export const Cart: Component<Props> = (props: Props) => {
  const [items, setItems] = createSignal<Item[]>([]);

  onMount(() => {
    try {
      setItems(JSON.parse(localStorage.order));
    } catch (_) {
      setItems([]);
    }
  });

  function clickHandler() {
    let itemInCart = false;

    items().forEach((item: Item) => {
      if (item.product_id === props.product_id) {
        item.quantity += props.quantity;
        itemInCart = true;
      }
    });

    if (!itemInCart) {
      const newItem = {
        description: props.description,
        price: props.price,
        price_id: props.price_id,
        quantity: props.quantity,
        product_id: props.product_id,
      };
      setItems([...items(), newItem]);
    }

    localStorage.setItem("order", JSON.stringify(items()));
    console.log("Items: " + items().map((item: Item) => item.description));
    console.log("Order: " + localStorage.order);
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
