import { Component, createSignal, createEffect, Show } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { DeletePostButton } from "../posts/DeletePostButton";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

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
            <div class="flex justify-center mt-4">
                <DeletePostButton id={+props.id!} userId={(post()?.user_id !== undefined ? (post()!.user_id) : (""))} postImage={post()?.image_urls} />
            </div>
        </div>
    );

};
