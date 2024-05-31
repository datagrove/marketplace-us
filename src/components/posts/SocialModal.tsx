import { createSignal, Show, createEffect, onCleanup } from "solid-js";
import type { Component, JSX } from "solid-js";
import type { Post } from "@lib/types";
import { SocialMediaShares } from "./SocialMediaShares";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);


interface Props {
    post: Post;
}

const SocialModal: Component<Props> = (props: Props) => {
    const [isOpen, setIsOpen] = createSignal(false);

    function openModal(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        setIsOpen(true);
    }

    function closeModal(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        setIsOpen(false);
    }

    return (
        <div id="social-modal-div" class="relative z-10">
            <Show
                when={isOpen()}
                fallback={
                    <div class="h-fit w-fit">
                        <button
                            class="flex rounded px-1 pb-1 pt-1 font-bold"
                            type="button"
                            onClick={(e) => openModal(e)}
                            aria-label={t("socialModal.shareButton")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-share-2 h-6 w-6"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                ></path>
                                <path d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1"></path>
                                <path d="M12 14v-11"></path>
                                <path d="M9 6l3 -3l3 3"></path>
                            </svg>
                        </button>
                    </div>
                }
            >
                <button
                    class="flex rounded px-1 pb-1 pt-1 font-bold"
                    type="button"
                    onClick={closeModal}
                    aria-label={t("socialModal.closeShareMenu")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-share-2 h-6 w-6"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                        ></path>
                        <path d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1"></path>
                        <path d="M12 14v-11"></path>
                        <path d="M9 6l3 -3l3 3"></path>
                    </svg>
                </button>
                <div class="absolute right-1/4 flex h-screen w-[95vw] justify-center ">
                    <div class="z-50 flex h-[58vMin] w-[75vMin] flex-col-reverse items-end rounded-lg bg-background2 dark:bg-background2-DM md:w-[50vMin]">
                        <SocialMediaShares
                            id={props.post.id}
                            title={props.post.title}
                            image_urls={props.post.image_urls}
                        />

                        <button
                            aria-label={t("ariaLabels.closeDialog")}
                            class="modal-close flex h-8 w-8 items-start justify-center text-icon2 dark:text-icon2-DM"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default SocialModal;
