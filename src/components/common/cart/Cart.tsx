import {
  Show,
  createEffect,
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { items, setItems } from "@components/common/cart/AddToCartButton";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Item {
  description: string;
  price: number;
  price_id: string;
  quantity: number;
}

export const Cart = () => {
  const [totalItems, setTotalItems] = createSignal(0);

  const storedItems = localStorage.getItem("cartItems");

  onMount(() => {
    console.log("got stored items: " + storedItems);
    if (storedItems) {
      setItems(JSON.parse(storedItems));
      let count = 0;
      items.forEach((item) => {
        count += item.quantity;
      });
      setTotalItems(count);
    }
  });

  createEffect(() => {
    let count = 0;
    items.forEach((item) => {
      count += item.quantity;
    });
    setTotalItems(count);
  });

  window.addEventListener("beforeunload", () => {
    if (items.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(items));
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
    if (items.length > 0) {
      let total = 0;
      items.forEach((item: Item) => {
        total += item.price * item.quantity;
      });
      return (
        <div>
          <div class="text-3xl font-bold">{t("cartLabels.myCart")}</div>
          <div class="grid justify-between mt-2 pb-2 grid-cols-5">
            <div class="col-span-3 inline-block mr-2">{t("cartLabels.product")}</div>
            <div class="inline-block text-start mr-2">{t("cartLabels.quantity")}</div>
            <div class="inline-block text-start">{t("cartLabels.price")}</div>
          </div>
          <ul>
            {items.map((item: Item) => (
              <div class="grid justify-between mt-2 border-t-2 border-border1 dark:border-border1-DM pb-2 grid-cols-5">
                <div class="col-span-3 inline-block mr-2">
                  {item.description}
                </div>

                <div class="inline-block text-center">{item.quantity}</div>
                <div class="inline-block text-start">
                  ${item.price.toFixed(2)}
                </div>
              </div>
            ))}
          </ul>
          <div class="grid justify-between mt-2 border-t-2 border-border1 dark:border-border1-DM pb-2 grid-cols-5">
            <div class="col-span-3 inline-block mr-2 font-bold">{t("cartLabels.subTotal")}: </div>
            <div class="col-span-2 inline-block font-bold text-end">
              ${total.toFixed(2)}
            </div>
            <div class="col-span-5 text-xs italic text-center mt-4 mb-1">
            {t("cartLabels.taxes")}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div class="">
          <div>{t("cartLabels.emptyCart")}</div>

          <div class="flex justify-between mt-2 border-t-2 border-border1 dark:border-border1-DM pb-2">
            <div class="inline-block">{t("cartLabels.total")}: </div>
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
        aria-label={t("ariaLabels.cart")}
      >
        <svg viewBox="0 0 24 24" class="w-8 h-8 fill-none stroke-icon1 dark:stroke-icon1-DM">
          <path
            d="M3 3H4.37144C5.31982 3 6.13781 3.66607 6.32996 4.59479L8.67004 15.9052C8.86219 16.8339 9.68018 17.5 10.6286 17.5H17.5"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.82422 7H19.6743C20.3386 7 20.8183 7.6359 20.6358 8.27472L19.6217 11.8242C19.2537 13.1121 18.0765 14 16.7371 14H8.27734"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            cx="16.5"
            cy="20.5"
            r="0.5"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            cx="0.5"
            cy="0.5"
            r="0.5"
            transform="matrix(1 0 0 -1 10 21)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <Show when={items.length > 0}>
          <div class="absolute -bottom-0.5 right-1.5 bg-background2 dark:bg-background2-DM text-ptext2 dark:text-ptext2-DM opacity-[85%] dark:opacity-100 rounded-full w-5 h-5 text-xs flex justify-center items-center">
            {totalItems()}
          </div>
        </Show>
      </button>
      <div
        id="cartItems"
        class="hidden fixed z-50 right-2 bg-background1 dark:bg-background1-DM m-2 p-2 rounded-lg justify-start shadow-md shadow-shadow-LM dark:shadow-shadow-DM"
      >
        <div>{shoppingCart()}</div>
        {/* TODO: Style */}
        <div class="flex justify-center">
          <button class="btn-primary" onclick={goToCart} aria-label={t("buttons.viewCart")}>
            {t("buttons.viewCart")}
          </button>
        </div>
      </div>
    </div>
  );
};
