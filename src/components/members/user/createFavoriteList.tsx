import { createSignal, createEffect, onMount } from "solid-js";
import type { Component } from "solid-js";
import { useTranslations } from "@i18n/utils";
import Modal from "@components/common/notices/modal";
import supabase from "@lib/supabaseClient";
import { isOpen, setIsOpen } from "@components/common/notices/modal";

interface Props {
    user_id: string;
    lang: "en" | "es" | "fr";
}

export const CreateFavoriteList: Component<Props> = (props) => {
    const [listName, setListName] = createSignal("");
    const lang = props.lang;
    const t = useTranslations(lang);

    onMount(() => {
        if (props.user_id === "") {
            alert();
        }
    });

    createEffect(() => {
        console.log(listName());
    });

    function createListMenu() {
        return (
            <div class="flex flex-col p-4">
                <label for="listName">{t("formLabels.listName")}</label>
                <input
                    id="listName"
                    type="text"
                    class="rounded-md border border-black text-black"
                    oninput={(e) => setListName(e.target.value)}
                />
                <div class="flex justify-center">
                    <button
                        class="btn-primary mt-4 w-fit"
                        onclick={(e) => {
                            createList(e);
                        }}
                    >
                        {t("buttons.createList")}
                    </button>
                </div>
            </div>
        );
    }

    async function createList(e: Event) {
        e.preventDefault();
        console.log(listName());

        const { data: favoriteList, error: favoriteError } = await supabase
            .from("favorites")
            .insert({
                customer_id: props.user_id,
                list_name: listName(),
            });
        if (favoriteError) {
            console.log(favoriteError.message);
        }

        setIsOpen(false);
    }

    return (
        <Modal
            children={<>{createListMenu()}</>}
            buttonClass={`btn-primary text-2xl`}
            buttonId="createFavoriteListMenu"
            buttonContent={"+"}
            heading={t("buttons.createFavoriteList")}
            headingLevel={3}
        ></Modal>
    );
};
