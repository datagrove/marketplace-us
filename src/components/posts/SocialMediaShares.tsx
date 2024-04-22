import type { Component } from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import placeholderImg from "../../assets/userImagePlaceholder.svg";
import dogLogo from "../../assets/dog-4-svgrepo-com (2).svg";
import { windowPersistentEvents } from "@nanostores/persistent";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

const xUrl = "https://twitter.com/intent/tweet?text=Check%20this%20out!%20";
const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=";
const fbMessengerUrl = "fb-messenger://share/?link=";
const whatsappUrl = "https://wa.me/?text=";
const emailURL =
    "mailto:?subject=Check this out this service from TodoServis!&body=Check%20out%20this%20service:%20";

const linkTarget = "_top";
const windowOptions = "menubar=no,status=no,height=300,width=600";

interface Post {
    id: number;
    title: string;
    image_urls: string | null;
}

interface Props {
    id: string | undefined;
}

export const SocialMediaShares: Component<Post> = (props) => {
    const showSocials = async (e: SubmitEvent) => {
        e.preventDefault();

        const shareBtn = e.currentTarget;
        const currSocialsBtnDiv = document.getElementById("socialsBtns" + props.id);

        if (currSocialsBtnDiv?.classList.contains("hidden")) {
            currSocialsBtnDiv.classList.remove("hidden");
            currSocialsBtnDiv.classList.add("flex");
        } else if (currSocialsBtnDiv?.classList.contains("flex")) {
            currSocialsBtnDiv.classList.remove("flex");
            currSocialsBtnDiv.classList.add("hidden");
        } else {
            return;
        }
    };

    const currPostLink = `www.todoservis.com/${lang}/posts/${props.id}`;
    const fbShareLink = facebookUrl + currPostLink;

    function xShare(e: Event) {
        e.stopPropagation();
        e.preventDefault();

        window.open(
            xUrl + `www.todoservis.com/${lang}/posts/${props.id}`,
            "_blank",
            windowOptions,
        );
    }

    function facebookShare(e: Event) {
        e.stopPropagation();
        e.preventDefault();

        window.open(fbShareLink, "_blank", windowOptions);
    }

    function facebookMessengerShare() {
        window.open(fbMessengerUrl, "_blank", windowOptions);
    }

    function whatsAppShare(e: Event) {
        e.stopPropagation();
        e.preventDefault();

        window.open(
            whatsappUrl +
            encodeURIComponent(`www.todoservis.com/${lang}/posts/${props.id}`),
            windowOptions,
        );
    }

    function emailShare(e: Event) {
        e.stopPropagation();
        e.preventDefault();

        window.open(
            emailURL +
            encodeURIComponent(`www.todoservis.com/${lang}/posts/${props.id}`),
        );
    }

    function linkShare(e: Event) {
        e.stopPropagation();
        e.preventDefault();

        return navigator.clipboard.writeText(currPostLink);
    }

    function embedShare(e: Event) {
        e.stopPropagation();
        e.preventDefault();

        const shareData = {
            title: "share test",
            text: "This is a test",
            url: currPostLink,
        };

        return navigator.share(shareData);
    }

    function textShare(e: Event) {
        e.stopPropagation();
        e.preventDefault();

        let message =
            "Check%20out%20this%20great%20service%20from%20TodoServis!%20";

        window.open(
            "sms:?&body=" + message + currPostLink,
            "_blank",
            windowOptions,
        );
    }

    return (
        <div class="px-4 pb-4 w-full h-full">
            <div>
                <h1 class="pb-4 text-xl text-htext2 dark:text-htext2-DM">
                    {t("socialModal.shareService")}:{" "}
                </h1>

                <div class="flex items-center pb-4">
                    <img
                        src={dogLogo.src}
                        class="p-1 mr-2 w-16 h-16 rounded border text-icon2 border-border2 bg-background1 dark:text-icon2-DM dark:border-border2-DM dark:bg-border1-DM"
                    />
                    <p class="text-ptext2 dark:text-ptext2-DM">{props.title}</p>
                </div>
            </div>

            <div class="flex justify-center">
                <div
                    id={"socialsBtns" + props.id}
                    class="grid grid-cols-4 auto-rows-min gap-4 md:grid-cols-2 share-btns"
                >
                    <button
                        id="button--x"
                        class="flex z-20 justify-start items-center font-bold rounded x-share-button socialBtn text-icon1 dark:text-icon1-DM"
                        title="Share to X - LANG!"
                        onclick={(e) => xShare(e)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="mr-1 icon icon-tabler icon-tabler-brand-x text-icon2 dark:text-icon2-DM"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                        </svg>
                        <p class="hidden px-1 text-xs font-light md:inline text-ptext2 dark:text-ptext2-DM">
                            {t("socialModal.twitterX")}
                        </p>
                    </button>

                    <button
                        id="button--facebook"
                        class="flex justify-start font-bold rounded fb-share-button socialBtn text-icon1 dark:text-icon1-DM"
                        title="Share to Facebook - LANG!"
                        onclick={(e) => facebookShare(e)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="mr-1 icon icon-tabler icon-tabler-brand-facebook-filled text-icon2 dark:text-icon2-DM"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                                d="M18 2a1 1 0 0 1 .993 .883l.007 .117v4a1 1 0 0 1 -.883 .993l-.117 .007h-3v1h3a1 1 0 0 1 .991 1.131l-.02 .112l-1 4a1 1 0 0 1 -.858 .75l-.113 .007h-2v6a1 1 0 0 1 -.883 .993l-.117 .007h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-6h-2a1 1 0 0 1 -.993 -.883l-.007 -.117v-4a1 1 0 0 1 .883 -.993l.117 -.007h2v-1a6 6 0 0 1 5.775 -5.996l.225 -.004h3z"
                                stroke-width="0"
                                fill="currentColor"
                            ></path>
                        </svg>
                        <p class="hidden px-1 text-xs font-light md:inline text-ptext2 dark:text-ptext2-DM">
                            {t("socialModal.facebook")}
                        </p>
                    </button>

                    <button
                        id="button--whatsapp"
                        class="flex justify-start font-bold rounded wa-share-button socialBtn text-icon1 dark:text-icon1-DM"
                        title="Share to WhatsApp - LANG!"
                        onclick={(e) => whatsAppShare(e)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="mr-1 icon icon-tabler icon-tabler-brand-whatsapp text-icon2 dark:text-icon2-DM"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                            <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                        </svg>
                        <p class="hidden px-1 text-xs font-light md:inline text-ptext2 dark:text-ptext2-DM">
                            {t("socialModal.WhatsApp")}
                        </p>
                    </button>

                    <button
                        id="button--email"
                        class="flex justify-start font-bold rounded email-share-button socialBtn text-icon1 dark:text-icon1-DM"
                        title="Share to Email"
                        onclick={(e) => emailShare(e)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-mail-forward 1 text-icon2 dark:text-icon2-DM"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 18h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5"></path>
                            <path d="M3 6l9 6l9 -6"></path>
                            <path d="M15 18h6"></path>
                            <path d="M18 15l3 3l-3 3"></path>
                        </svg>
                        <p class="hidden px-1 text-xs font-light md:inline text-ptext2 dark:text-ptext2-DM">
                            {t("socialModal.email")}
                        </p>
                    </button>

                    <button
                        id="button--link"
                        class="flex justify-start font-bold rounded link-share-button socialBtn text-icon1 dark:text-icon1-DM"
                        title="Copy Link"
                        onclick={(e) => linkShare(e)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="mr-1 icon icon-tabler icon-tabler-copy text-icon2 dark:text-icon2-DM"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
                            <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
                        </svg>
                        <p class="hidden px-1 text-xs font-light md:inline text-ptext2 dark:text-ptext2-DM">
                            {t("socialModal.copyLink")}
                        </p>
                    </button>

                    <button
                        id="button--embed"
                        class="flex justify-start font-bold rounded embed-share-button socialBtn text-icon1 dark:text-icon1-DM"
                        title="Embed"
                        onclick={(e) => embedShare(e)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="mr-1 icon icon-tabler icon-tabler-code text-icon2 dark:text-icon2-DM"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M7 8l-4 4l4 4"></path>
                            <path d="M17 8l4 4l-4 4"></path>
                            <path d="M14 4l-4 16"></path>
                        </svg>
                        <p class="hidden px-1 text-xs font-light md:inline text-ptext2 dark:text-ptext2-DM">
                            {t("socialModal.embedLink")}
                        </p>
                    </button>

                    <button
                        id="button--text"
                        class="flex justify-start font-bold rounded text-share-button socialBtn text-icon1 dark:text-icon1-DM"
                        title="Text"
                        onclick={(e) => textShare(e)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="mr-1 icon icon-tabler icon-tabler-device-mobile-message text-icon2 dark:text-icon2-DM"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M11 3h10v8h-3l-4 2v-2h-3z"></path>
                            <path d="M15 16v4a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1h2"></path>
                            <path d="M10 18v.01"></path>
                        </svg>
                        <p class="hidden px-1 text-xs font-light md:inline text-ptext2 dark:text-ptext2-DM">
                            {t("socialModal.textLink")}
                        </p>
                    </button>
                </div>
            </div>

            <div class="pt-6">
                <p class="text-xs italic text-ptext2 dark:text-ptext2-DM">
                    {t("socialModal.disclaimer")}
                </p>
            </div>
        </div>
    );
};
