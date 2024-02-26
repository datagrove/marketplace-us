import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { currentSession } from "../../lib/userSessionStore";
import { useStore } from "@nanostores/solid";

import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const ProviderProfileButton: Component = () => {
  const [providerProfile, setProviderProfile] = createSignal(null);
  const [user, setUser] = createSignal<AuthSession | null>(null);
  const [hidden, setHidden] = createSignal("");

  const ProviderProfileLink = document.getElementById("providerProfileLink");

  const providerRedirect = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
      setUser(useStore(currentSession)());

      if (user() === null) {
        alert(t("messages.signIn"));
        location.href = `/${lang}/login`;
      } else {
        const { data: provider, error: providerError } = await supabase
          .from("providers")
          .select("*")
          .eq("user_id", user()!.user.id);
        setHidden("hidden");

        if (!provider) {
          ProviderProfileLink?.classList.add("hidden");
        }
        if (providerError) {
          console.log("Error: " + providerError.message);
        } else if (!provider.length) {
          alert(t("messages.viewProviderAccount"));
          location.href = `/${lang}/provider/createaccount`;
        } else {
          location.href = `/${lang}/provider/profile`;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(ProviderProfileLink);
  return (
    <div>
      <form onSubmit={providerRedirect}>
        <button class={hidden()} type="submit" id="providerProfileLink">
          {t("buttons.providerProfile")}
        </button>
      </form>
    </div>
  );
};
