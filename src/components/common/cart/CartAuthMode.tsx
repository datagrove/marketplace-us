import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import supabase from "@lib/supabaseClient";
import { currentSession } from "@lib/userSessionStore";
import { useStore } from "@nanostores/solid";
import { SignOut } from "@lib/sign_out";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import "@src/styles/global.css";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    goToCheckout: () => void;
    checkoutAsGuest: () => void;
}

export const CartAuthMode: Component<Props> = (props) => {
    const [authMode, setAuthMode] = createSignal<"signed_in" | "signed_out">(
        "signed_out"
    );

    createEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            currentSession.set(session);
        });

        if (useStore(currentSession)() === null) {
            setAuthMode("signed_out");
        } else if (useStore(currentSession)() !== null) {
            setAuthMode("signed_in");
        }
    });

    return (
        <div>
            {/* If the auth mode is sign in then return the sign in button */}
            {authMode() === "signed_in" ? (
                <button
                    class="btn-primary"
                    onclick={props.goToCheckout}
                    aria-label={t("buttons.proceedToCheckout")}
                >
                    {/* TODO: Style*/}
                    {t("buttons.proceedToCheckout")}
                </button>
            ) : //Else if the auth mode is sign up then return the sign out button
            authMode() === "signed_out" ? (
                <div class="inline-block">
                    <button
                        class="btn-secondary max-w-1/2 inline"
                        onclick={props.checkoutAsGuest}
                        // TODO: INTERNATIONALIZE
                        aria-label="checkout as guest"
                    >
                        {/* TODO: Internationalize*/}
                        Checkout as Guest
                    </button>
                    <form class="max-w-1/2 inline">
                        <button
                            class="btn-primary"
                            type="submit"
                            formaction={`/${lang}/login`}
                        >
                            {t("pageTitles.signIn")}
                        </button>
                    </form>
                </div>
            ) : (
                // Else return an error if it is neither auth mode
                "Error"
            )}
        </div>
    );
};
