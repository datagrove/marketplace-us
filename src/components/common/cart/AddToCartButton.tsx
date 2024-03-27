import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
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
  buttonClick: (event: Event) => void;
}

export const [items, setItems] = createStore<Item[]>([]);

export const AddToCart: Component<Props> = (props: Props) => {
  const storedItems = localStorage.getItem("cartItems");

  onMount(() => {
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  });

  function clickHandler(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    let itemInCart = false;

    const updatedItems = items.map((item: Item) => {
      if (item.product_id === props.product_id) {
        itemInCart = true;
        return { ...item, quantity: item.quantity + props.quantity };
      }
      return item;
    });

    if (!itemInCart) {
      const newItem = {
        description: props.description,
        price: props.price,
        price_id: props.price_id,
        quantity: props.quantity,
        product_id: props.product_id,
      };
      setItems([...updatedItems, newItem]);
    } else {
      setItems(updatedItems);
    }

    props.buttonClick(e);
    console.log(items);
  }

  return (
    <div class="relative z-10">
      <button
        onclick={(e) => clickHandler(e)}
        class="btn-primary"
        aria-label={t("buttons.addToCart")}
      >
        {t("buttons.addToCart")}
      </button>
    </div>
  );
};
