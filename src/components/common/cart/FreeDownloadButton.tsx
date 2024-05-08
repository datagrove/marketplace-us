import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    item: Post;
    buttonClick: (event: Event) => void;
}

export const [items, setItems] = createStore<Post[]>([]);

export const FreeDownloadButton: Component<Props> = (props: Props) => {
    return (
        <div class="relative z-10 w-full">
            <button>{t("buttons.freeDownload")}</button>
        </div>
    );
};
