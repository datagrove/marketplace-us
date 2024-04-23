import type { Component } from "solid-js";
import {
  Show,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CheckoutStatus: Component = () => {
  onMount(async () => {
    await CurrentCheckoutStatus();
  });

  async function CurrentCheckoutStatus() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    const response = await fetch(
      `/api/getCheckoutStatus?session_id=${sessionId}`,
      {
        method: "GET",
      }
    );
    const res = await response.json();
    const session = res.session;

    if (session.status === "open") {
      window.location.replace(`/${lang}/checkout`);
    } else if (session.status === "complete") {
      document.getElementById("success")?.classList.remove("hidden");
      document.getElementById("success")?.classList.add("flex");
    }
  }

  return (
    <div>
      <div class="flex-col items-center bg-btn1 text-white hidden" id="success">
        <svg
          viewBox="0 0 24 24"
          id="check-mark-circle"
          class="text-btn1 w-16 h-16"
        >
          <circle cx="12" cy="12" r="10" fill="white"></circle>
          <path
            d="M11,15.5a1,1,0,0,1-.71-.29l-3-3a1,1,0,1,1,1.42-1.42L11,13.09l4.29-4.3a1,1,0,0,1,1.42,1.42l-5,5A1,1,0,0,1,11,15.5Z"
            fill="currentColor"
          ></path>
        </svg>
        {/* <p>{t("checkout.success")}</p> */}
        <p class="text-3xl font-bold">Success!</p>
        {/* <p>{t("checkout.thanks")}</p> */}
        <p class="italic">Thank you for your order</p>
      </div>
      <div class="border border-red-500"></div>
    </div>
  );
};
