import type { Component } from "solid-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import supabase from "../../lib/supabaseClient";
import { useStore } from "@nanostores/solid";

import "../../styles/global.css";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const signup = () => {
    location.href = `/${lang}/signup`;
};

export const SignUpBtn: Component = () => {
    return (
        <div>
            <button class="btn-primary ml-2" type="submit" onclick={signup}>
                {t("pageTitles.signUp")}
            </button>
        </div>
    );
};
