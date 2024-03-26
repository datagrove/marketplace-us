import { createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import type { Component } from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { items, setItems } from "@components/common/cart/AddToCartButton";
import { e } from "dist/_astro/web.DzrY7x_K";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
  product_id?: string;
  quantity: number;
  updateQuantity: (quantity: number, product_id?: string) => void;
}

export const Quantity: Component<Props> = (props: Props) => {
  const [updateQuantity, setUpdateQuantity] = createSignal<number>(1);

  onMount(() => {
    if (props.quantity) {
      setUpdateQuantity(props.quantity);
    } else setUpdateQuantity(1);
  });

  function inputHandler(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    setUpdateQuantity(Number((e.target as HTMLInputElement).value));
    props.updateQuantity(Number((e.target as HTMLInputElement).value), props.product_id?.toString());
  }

  function increase(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    setUpdateQuantity(updateQuantity() + 1);
    props.updateQuantity(updateQuantity(), props.product_id?.toString());
  }

  function decrease(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    setUpdateQuantity(updateQuantity() - 1);
    props.updateQuantity(updateQuantity(), props.product_id?.toString());
  }

  return (
    <div class="flex relative z-10">
      <button
        onclick={(e) => decrease(e)}
        class="btn-primary inline-block"
        aria-label={t("ariaLabels.decreaseQuantity")}
      >
        -
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="/^\d+$/"
        class="w-12 text-center text-black"
        onInput={(e) => inputHandler(e)}
        value={updateQuantity()}
        onclick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      ></input>
      <button
        onclick={(e) => increase(e)}
        class="btn-primary inline-block"
        aria-label={t("ariaLabels.increaseQuantity")}
      >
        +
      </button>
    </div>
  );
};
