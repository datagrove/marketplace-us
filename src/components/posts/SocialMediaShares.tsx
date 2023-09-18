import type { Component } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const values = ui[lang] as uiObject
const productCategories = values.productCategoryInfo.categories

const xUrl = "https://twitter.com/intent/tweet?text=Check%20this%20out!%20";
const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=";
const fbMessengerUrl = "fb-messenger://share/?link="
const whatsappUrl = "https://wa.me/?text=";
const emailURL = "mailto:?subject=Check this out this service from TodoServis!&body=Check%20out%20this%20service:%20";

const linkTarget = "_top";
const windowOptions = "menubar=no,status=no,height=300,width=600";

interface Props {
    id: string | undefined;
}

export const SocialMediaShares: Component<Props> = (props) => {
    const showSocials = async(e:SubmitEvent) => {
        e.preventDefault();

        const shareBtn = e.currentTarget;
        const currSocialsBtnDiv = document.getElementById('socialsBtns' + props.id )

        if(currSocialsBtnDiv?.classList.contains("hidden")) {
            currSocialsBtnDiv.classList.remove("hidden");
            currSocialsBtnDiv.classList.add("flex");
        } else if(currSocialsBtnDiv?.classList.contains("flex")) {
            currSocialsBtnDiv.classList.remove("flex");
            currSocialsBtnDiv.classList.add("hidden");
        } else {
            return;
        }
    }

    function xShare() {
        window.open(xUrl + encodeURIComponent(`www.todoservis.com/${ lang }/posts/${ props.id }`), "_blank", windowOptions);
    }

    function facebookShare() {
        window.open(facebookUrl + encodeURIComponent(`www.todoservis.com/${ lang }/posts/${ props.id }`), "_blank", windowOptions);
    }

    function facebookMessengerShare() {
        window.open(fbMessengerUrl, "_blank", windowOptions);
    }

    function whatsAppShare() {
        window.open(whatsappUrl + encodeURIComponent(`www.todoservis.com/${ lang }/posts/${ props.id }`), windowOptions);
    }

    function emailShare() {
        // window.location.href = "mailto:?subject=Check this out this service from TodoServis!&amp;body=Check out this service:" + encodeURIComponent(`www.todoservis.com/${ lang }/posts/${ props.id }`)
        // window.location.href="mailto:?subject=Check this out this service from TodoServis!&body=Check%20out%20this%20service:";
        window.open(emailURL + encodeURIComponent(`www.todoservis.com/${ lang }/posts/${ props.id }`));

    }
    
    return (
        <div class="border-4 border-green-600">
            <div class="flex justify-end items-center border-4 border-orange-300">
                <form id={ props.id } onSubmit={ showSocials } class="flex">
                    <button
                        type="submit"
                        aria-label="CHANGE THIS"
                        id = { props.id }
                        class="p-1 rounded font-bold text-icon1 dark:text-icon1-DM"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-share-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1"></path>
                            <path d="M12 14v-11"></path>
                            <path d="M9 6l3 -3l3 3"></path>
                        </svg>
                    </button>
                </form>
            </div>

            <div id={ 'socialsBtns' + props.id } class="share-btns hidden flex-col justify-end border-4 border-red-400">
                <div id="x-share" class="flex justify-center items-center">
                    <button id="button--x" class="x-share-button p-1 rounded font-bold text-icon1 dark:text-icon1-DM" title="Share to X - LANG!" onclick={ xShare }>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                        </svg>
                    </button>
                    {/* <p>Share to X</p> */}
                </div>

                <div id="facebook-share" class="flex justify-center items-center">
                    <button id="button--facebook" class="fb-share-button p-1 rounded font-bold text-icon1 dark:text-icon1-DM" title="Share to Facebook - LANG!" onclick={ facebookShare }>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-facebook-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M18 2a1 1 0 0 1 .993 .883l.007 .117v4a1 1 0 0 1 -.883 .993l-.117 .007h-3v1h3a1 1 0 0 1 .991 1.131l-.02 .112l-1 4a1 1 0 0 1 -.858 .75l-.113 .007h-2v6a1 1 0 0 1 -.883 .993l-.117 .007h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-6h-2a1 1 0 0 1 -.993 -.883l-.007 -.117v-4a1 1 0 0 1 .883 -.993l.117 -.007h2v-1a6 6 0 0 1 5.775 -5.996l.225 -.004h3z" stroke-width="0" fill="currentColor"></path>
                        </svg>
                    </button>
                </div>

                {/* <div id="instagram-share" class="flex justify-center items-center">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-instagram" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path>
                            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                            <path d="M16.5 7.5l0 .01"></path>
                        </svg>
                    </button>
                </div> */}

                <div id="fbMessenger-share" class="flex justify-center items-center">
                    <button id="button--fbMessenger" class="fbMessenger-share-button p-1 rounded font-bold text-icon1 dark:text-icon1-DM" title="Share to Facebook Messenger - LANG!" onclick={ facebookMessengerShare }>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-messenger" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
                            <path d="M8 13l3 -2l2 2l3 -2"></path>
                        </svg>
                    </button>
                </div>

                <div id="whatsapp-share" class="flex justify-center items-center">
                    <button id="button--whatsapp" class="wa-share-button p-1 rounded font-bold text-icon1 dark:text-icon1-DM" title="Share to WhatsApp - LANG!" onclick={ whatsAppShare }>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-whatsapp" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                            <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                        </svg>
                    </button>
                </div>

                <div id="email-share" class="flex justify-center items-center">
                    <button id="button--email" class="email-share-button p-1 rounded font-bold text-icon1 dark:text-icon1-DM" title="Share to Email" onclick={ emailShare }>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mail-forward" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 18h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5"></path>
                            <path d="M3 6l9 6l9 -6"></path>
                            <path d="M15 18h6"></path>
                            <path d="M18 15l3 3l-3 3"></path>
                        </svg>
                    </button>

                </div>
            </div>
        </div>
    );

}