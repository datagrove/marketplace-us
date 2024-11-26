import type { Component } from "solid-js";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import Modal, { closeModal } from "@components/common/notices/modal";
import type { ListData } from "@lib/types";
import { CreateFavoriteList } from "@components/members/user/createFavoriteList";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    // Define the type of the prop
    // (Id, UserId)
    product_id: number;
    list_number: string;
    onRemoveFavorite: () => void;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const RemoveFavoriteButton: Component<Props> = (props) => {
    const removeFavorite = async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        const { data, error } = await supabase
            .from("favorites_products")
            .delete()
            .eq("product_id", props.product_id)
            .eq("list_number", props.list_number)
            .select();

        if (data) {
            props.onRemoveFavorite();
        }
    };

    return (
        //This has to be z-50 so that the modal will render above the Filter menu on mobile which is z-40
        <div class="relative z-30">
            <button
                id={`removeFavoriteButton + ${props.product_id}`}
                onclick={(e) => removeFavorite(e)}
                class="btn-primary text-2xl"
            >
                X
            </button>
        </div>
    );
};
