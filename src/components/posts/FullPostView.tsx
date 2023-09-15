import { Component, createSignal, createEffect, Show } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { DeletePostButton } from "../posts/DeletePostButton";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import { windowPersistentEvents } from "@nanostores/persistent";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject
const productCategories = values.productCategoryInfo.categories

interface Post {
    content: string;
    id: number;
    category: string;
    title: string;
    provider_name: string;
    major_municipality: string;
    minor_municipality: string;
    governing_district: string;
    user_id: string;
    image_urls: string | null;
    email: string;
    provider_id: number;
    provider_url: string;
}

interface Props {
    id: string | undefined;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewFullPost: Component<Props> = (props) => {
    const [post, setPost] = createSignal<Post>();
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [postImages, setPostImages] = createSignal<string[]>([]);

    createEffect(() => {
        if (props.id === undefined) {
            location.href = `/${lang}/404`
        } else if (props.id) {
            setSession(User.session);
            fetchPost(+props.id);
        }
    });

    const fetchPost = async (id: number) => {
        if (session()) {
            try {
                const { data, error } = await supabase
                    .from("providerposts")
                    .select("*")
                    .eq("id", id);

                if (error) {
                    console.log(error);
                } else if (data[0] === undefined) {
                    alert(t('messages.noPost'));
                    location.href = `/${lang}/services`
                } else {
                    data?.map(async (item) => {
                        productCategories.forEach(productCategories => {
                            if (item.service_category.toString() === productCategories.id) {
                                item.category = productCategories.name
                            }
                        })
                        delete item.service_category
                        item.provider_url = `/${lang}/provider/${item.provider_id}`
                    })
                    setPost(data[0]);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert(t('messages.signIn'))
            location.href = `/${lang}/login`
        }
    }

    createEffect(async () => {
        if (post() !== undefined) {
            if (post()?.image_urls === undefined || post()?.image_urls === null) {
            } else {
                await downloadImages(post()?.image_urls!)
            }
        }
    })

    const downloadImages = async (image_Urls: string) => {
        try {
            const imageUrls = image_Urls.split(',');
            imageUrls.forEach(async (imageUrl: string) => {
                const { data, error } = await supabase.storage
                    .from("post.image")
                    .download(imageUrl);
                if (error) {
                    throw error;
                }
                const url = URL.createObjectURL(data);
                setPostImages([...postImages(), url]);
            })
        } catch (error) {
            console.log(error)
        }
    }

    let slideIndex = 1;
    showSlide(slideIndex)

    function moveSlide(n: number) {
        showSlide(slideIndex += n);
    }

    function currentSlide(n: number) {
        showSlide(slideIndex = n);
    }

    function showSlide(n: number) {
        let i;
        const slides = document.getElementsByClassName("slide");
        // console.log(slides)
        const dots = document.getElementsByClassName("dot");

        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        for (i = 0; i < slides.length; i++) {
            slides[i].classList.add("hidden");
        }

        for (i = 0; i < dots.length; i++) {
            dots[i].classList.remove(`bg-white`);
            dots[i].classList.remove(`dark:bg-gray-600`);
            dots[i].classList.add(`bg-slate-300`);
            dots[i].classList.add(`dark:bg-gray-800`);
        }

        //show the active slide
        if (slides.length > 0) {
            slides[slideIndex - 1].classList.remove("hidden");
        }

        //show the active dot
        if (dots.length > 0) {
            dots[slideIndex - 1].classList.remove(`bg-slate-300`);
            dots[slideIndex - 1].classList.remove(`dark:bg-gray-800`);
            dots[slideIndex - 1].classList.add(`bg-white`);
            dots[slideIndex - 1].classList.add(`dark:bg-gray-600`);
        }

    }

    const twitterUrl = "https://twitter.com/intent/tweet?text=Check%20this%20out%20!";
    const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=";
    const whatsappUrl = "https://wa.me/?text=";
    const linkTarget = "_top";
    const windowOptions = "menubar=yes,status=no,height=300,width=600";

    function extractTitleText() {
        return document.querySelector('h2')?.innerText;
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

    function openWhatsappWindow(text:any, link:any) {
        const currPage = extractWindowLink();
        const testLink = whatsappUrl + "Check%20out%20this%20awesome%20service%20on%20TodoServis! ";
        window.open(testLink + encodeURIComponent(currPage), 'menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');

    }

    function registerWhatsAppButton() {
        const text = extractTitleText();
        const link = extractWindowLink();
        const whatsAppButton = document.querySelector('#button--whatsapp');
        whatsAppButton?.addEventListener('click', () => openWhatsappWindow(text, link));
    }
  
    return (
        <div>
            <h2 class="text-xl text-ptext1 dark:text-ptext1-DM pb-4 font-bold">
                {post()?.title}
            </h2>
            <Show when={postImages().length > 0}>
                <div class="relative w-full">
                    <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
                        <div class="slide">
                            <img
                                src={postImages()[0]}
                                class="absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-contain h-56 md:h-96"
                                alt={`${t('postLabels.image')} 1`} />
                        </div>
                        <Show when={postImages().length > 1}>
                            {postImages().slice(1).map((image: string, index: number) => (
                                <div class="hidden slide">
                                    <img
                                        src={image}
                                        class="absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-contain h-56 md:h-96"
                                        alt={`${t('postLabels.image')} ${index + 2}`} />
                                </div>
                            ))}
                        </Show>
                    </div>
                    <Show when={postImages().length > 1}>
                        <div class="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
                            <button
                                type="button"
                                class="dot w-3 h-3 rounded-full cursor-pointer bg-background1 dark:bg-background1-DM"
                                aria-label={`${t('postLabels.slide')} 1`}
                                onClick={() => currentSlide(1)}
                            >
                            </button>
                            {postImages().slice(1).map((image: string, index: number) => (
                                <button
                                    type="button"
                                    class="dot w-3 h-3 rounded-full cursor-pointer bg-background1 dark:bg-background1-DM"
                                    aria-label={`${t('postLabels.slide')} ${index + 1}`}
                                    onClick={() => currentSlide(index + 2)}
                                >
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                            onclick={() => moveSlide(-1)}
                        >
                            <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-white/50 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                <svg class="w-4 h-4 text-[#4A4A4A] dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                                </svg>
                                <span class="sr-only">{t('buttons.previous')}</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                            onclick={() => moveSlide(1)}>
                            <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-white/50 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                <svg class="w-4 h-4 text-[#4A4A4A] dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <span class="sr-only">{t('buttons.next')}</span>
                            </span>
                        </button>
                    </Show>
                </div>
            </Show>
            <p class="my-1"><span class="font-bold">{t('postLabels.provider')}</span><a href={post()?.provider_url} class="text-link1 hover:text-link1Hov dark:text-link1-DM dark:hover:bg-link1Hov-DM">{post()?.provider_name}</a></p>
            <p class="my-1">
                <span class="font-bold">{t('postLabels.location')}</span>{post()?.major_municipality}/{post()?.minor_municipality}/
                {post()?.governing_district}
            </p>
            <p class="my-1"><span class="font-bold">{t('postLabels.category')}</span>{post()?.category}</p>
            <div class="my-10 prose dark:prose-invert" id="post-content" innerHTML={post()?.content}></div>
            <div class="mt-4">
                <a href={`mailto:${post()?.email}`} class="btn-primary">{t('buttons.contact')}</a>
            </div>

            {/* <div class="flex justify-start share-btns mt-4 border-4 border-red-400">
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

                <div id="instagram-share" class="flex justify-center items-center">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-instagram" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path>
                            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                            <path d="M16.5 7.5l0 .01"></path>
                        </svg>
                    </button>
                </div> 

                <div id="whatsapp-share" class="flex justify-center items-center">
                    <button id="button--whatsapp" class="wa-share-button" onclick={ registerWhatsAppButton }>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-whatsapp" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                            <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                        </svg>
                    </button>
                </div>

            </div> */}

            <div class="flex justify-center mt-4">
                <DeletePostButton id={+props.id!} userId={(post()?.user_id !== undefined ? (post()!.user_id) : (""))} postImage={post()?.image_urls} />
            </div>
        </div>
    );

};
