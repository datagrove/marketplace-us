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

const twitterUrl = "https://twitter.com/intent/tweet?text=Check%20this%20out%20!";
const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=";
const whatsappUrl = "https://wa.me/?text=";

const linkTarget = "_top";
const windowOptions = "menubar=yes,status=no,height=300,width=600";

interface Props {
    id: string | undefined;
}

export const SocialMediaShares: Component<Props> = (props) => {
// export const SocialMediaShares: Component = () => {

    const whatsAppButton = document.querySelector('#button--whatsapp');

    const showSocials = async(e:SubmitEvent) => {
        e.preventDefault();

        // const shareBtns = document.getElementsByClassName("share-btns");

        const shareBtn = e.currentTarget;
        const currSocialsBtnDiv = document.getElementById('socialsBtns' + props.id )

        console.log("shareBtn: ", shareBtn)

        console.log("shareBtn type: ", typeof shareBtn)

        console.log("currSocialsBtnDiv: ", currSocialsBtnDiv)

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

    function extractTitleText() {
        
        
        // return document.querySelector('h2')?.innerText;
    }

    function extractAnchorLink() {
        return document.querySelector('a')?.href;
    }
    
    function extractWindowLink() {
        const currLink = window.location.href;
        return currLink;
    }
    
    function openTwitterWindow(text:any, link:any) {
        const twitterQuery = `${text} ${link}`;
        return window.open(`${twitterUrl} ${twitterQuery}&`, linkTarget, windowOptions);
    }
    
    function registerShareButton() {
        extractWindowLink();
        const text= extractTitleText();
        const link = extractWindowLink();
        const twitterButton = document.querySelector('#button--twitter');
        twitterButton?.addEventListener('click', () => openTwitterWindow(text, link))
    }

    function openFacebookWindow(text:any, link:any) {
        const currPage = extractWindowLink();
        const testLink = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(currPage);
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(currPage)+ "&t=" + text, '', 'menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        console.log("TestLink: ", testLink)
        // return false; 
    }

    function registerFacebookButton() {
        extractWindowLink();
        const text = extractTitleText();
        const link = extractWindowLink();
        const facebookButton = document.querySelector('#button--facebook');
        facebookButton?.addEventListener('click', () => openFacebookWindow(text, link));
    }

    function openWhatsAppWindow(text:any, link:any) {
        // const currPage = extractWindowLink();
        const whatsappLink = whatsappUrl + "Check%20out%20this%20awesome%20service%20on%20TodoServis! ";
        // alert(link)
        window.open(whatsappLink + encodeURIComponent(link), 'menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');

    }

    function shareWhatsApp() {
        // alert("whatsapp clicked")
        // const text = extractTitleText(); //need to fix this function now
        const text = "THIS IS A TEST";
        const currId = props.id;
        // alert(currId);
        // alert(text)
        // const link = extractWindowLink();
        // const link = {`/${lang}/posts/${ props.id}`}

        const link = 'localhost:3000/' + lang  + '/posts/' + props.id; //need to update for production

        // alert(link)
        
        // console.log("link: ", link)

        const whatsAppButton = document.querySelector('#button--whatsapp');

        // alert(whatsAppButton?.id)
    
        whatsAppButton?.addEventListener('click', () => openWhatsAppWindow(text, link));
    }

    return (
        <div class="border-4 border-green-600">
            {/* <div>
                <h1>{ props.id }</h1>
            </div> */}

            <div class="flex justify-center items-center border-4 border-orange-300">
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

            <div id={ 'socialsBtns' + props.id } class="share-btns hidden flex-col md:flex-row justify-end border-4 border-red-400">
                <div id="x-share" class="flex justify-center items-center">
                    <button id="button--twitter" class="twitter-share-button" onclick={ registerShareButton }>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                        </svg>
                    </button>
                </div>

                <div id="facebook-share" class="flex justify-center items-center">
                    <button id="button--facebook" class="fb-share-button" onclick={ registerFacebookButton }>
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

                <div id="whatsapp-share" class="flex justify-center items-center">
                    <button id="button--whatsapp" class="wa-share-button" onclick={ shareWhatsApp }>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-whatsapp" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                            <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

};