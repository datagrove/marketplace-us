import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

// const values = ui[lang] as uiObject
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

interface Props {
    // Define the type for the filterPosts prop
    posts: Array<Post>;
}

export const HomeCard: Component<Props> = (props) => {
    const [newPosts, setNewPosts] = createSignal<Array<any>>([]);
    const [postImages, setPostImages] = createSignal<string[]>([]);

    createEffect(async () => {
        if (props.posts) {
            const updatedPosts = await Promise.all(
                props.posts.map(async (post: any) => {
                    post.image_urls
                        ? (post.image_url = await downloadImage(
                              post.image_urls.split(",")[0]
                          ))
                        : (post.image_url = null);
                    // Set the default quantity to 1
                    post.quantity = 1;
                    return post;
                })
            );

            setNewPosts(updatedPosts);
        }
    });

    const downloadImage = async (path: string) => {
        try {
            const { data, error } = await supabase.storage
                .from("post.image")
                .download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            return url;
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error downloading image: ", error.message);
            }
        }
    };

    const downloadImages = async (image_Urls: string) => {
        try {
            const imageUrls = image_Urls.split(",");
            imageUrls.forEach(async (imageUrl: string) => {
                const { data, error } = await supabase.storage
                    .from("post.image")
                    .download(imageUrl);
                if (error) {
                    throw error;
                }
                const url = URL.createObjectURL(data);
                setPostImages([...postImages(), url]);
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div class="mb-4 flex justify-center">
            <ul class="flex flex-wrap justify-center md:flex-nowrap">
                {newPosts().map((post: any) => (
                    <li>
                        {/* { post.id } */}
                        {/* {`/${lang}/posts/${post.id}`} */}
                        <div class="mx-2 mb-4 flex h-[264px] w-40 flex-wrap justify-between rounded border-2 border-border1 px-1 dark:border-border1-DM md:mx-1 md:mb-0 2xl:h-[324px]">
                            <div class="home-card-img-div flex h-4/6 w-full items-center justify-center">
                                <a
                                    href={`/${lang}/posts/${post.id}`}
                                    class="h-full"
                                >
                                    <div
                                        id="homeCard-img"
                                        class="flex h-full w-full items-center justify-center"
                                    >
                                        {post.image_url ? (
                                            <img
                                                src={post.image_url}
                                                alt={
                                                    post.image_urls.split(
                                                        ","
                                                    )[0]
                                                        ? "User Image"
                                                        : "No Image"
                                                }
                                                class="max-h-full max-w-full"
                                            />
                                        ) : (
                                            <svg
                                                // width="100px"
                                                // height="100px"
                                                viewBox="0 0 152.13541 152.13544"
                                                version="1.1"
                                                id="svg1"
                                                class="h-full w-full fill-icon1 dark:fill-icon1-DM"
                                            >
                                                <defs id="defs1" />
                                                <g
                                                    id="layer1"
                                                    transform="translate(-55.18229,-70.37966)"
                                                >
                                                    <g
                                                        id="g1"
                                                        transform="matrix(0.82682292,0,0,0.82682292,25.416666,40.614035)"
                                                    >
                                                        <path
                                                            d="M 208,36 H 48 A 12.01312,12.01312 0 0 0 36,48 v 160 a 12.01312,12.01312 0 0 0 12,12 h 160 a 12.01312,12.01312 0 0 0 12,-12 V 48 A 12.01312,12.01312 0 0 0 208,36 Z m 4,172 a 4.004,4.004 0 0 1 -4,4 H 48 a 4.004,4.004 0 0 1 -4,-4 v -30.34369 l 33.17187,-33.171 a 4.00208,4.00208 0 0 1 5.65723,0 l 20.68652,20.68652 a 12.011,12.011 0 0 0 16.96973,0 l 44.68652,-44.68652 a 4.00208,4.00208 0 0 1 5.65723,0 L 212,161.65625 Z m 0,-57.65625 -35.51465,-35.51465 a 11.99916,11.99916 0 0 0 -16.96973,0 l -44.68652,44.68652 a 4.00681,4.00681 0 0 1 -5.65723,0 L 88.48535,138.8291 a 12.01009,12.01009 0 0 0 -16.96973,0 L 44,166.34393 V 48 a 4.004,4.004 0 0 1 4,-4 h 160 a 4.004,4.004 0 0 1 4,4 z M 108.001,92 v 0.0019 a 8.001,8.001 0 1 1 0,-0.0019 z"
                                                            id="path1"
                                                        />
                                                    </g>
                                                </g>
                                            </svg>
                                        )}
                                    </div>
                                </a>
                            </div>

                            <div id="homeCard-text" class="h-1/6">
                                <div class="">
                                    <a href={`/${lang}/posts/${post.id}`}>
                                        <p class="line-clamp-2 pt-1 text-start text-sm font-bold">
                                            {post.title}
                                        </p>
                                    </a>
                                </div>

                                <a href={`/${lang}/creator/${post.user_id}`}>
                                    <div class="my-1 flex items-center">
                                        <div>
                                            {post.seller_img ? (
                                                <img src={post.seller_img} />
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20px"
                                                    height="20px"
                                                    viewBox="0 0 32 32"
                                                    class="rounded-full border border-border1 fill-icon1 dark:border-border1-DM dark:fill-icon1-DM"
                                                >
                                                    <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
                                                </svg>
                                            )}
                                            <img />
                                        </div>
                                        <div class="truncate">
                                            <p class="ml-1 truncate text-xs font-light text-link1 dark:text-link1-DM">
                                                {post.seller_name}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div
                                id="homeCard-ratings-price"
                                class="flex h-1/6 items-end"
                            >
                                <div class="flex w-2/3 items-end">
                                    <div class="flex items-end justify-start">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15px"
                                            height="15px"
                                            viewBox="0 0 32 32"
                                            class="fill-icon1 dark:fill-icon1-DM"
                                        >
                                            <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                        </svg>

                                        <p class="ml-1 mr-0.5 text-xs font-bold">
                                            4.9
                                        </p>
                                        <p class="text-xs font-light">
                                            (30.3K)
                                        </p>
                                    </div>
                                </div>

                                <div class="flex w-1/3 items-end justify-end">
                                    <p class="text-xs font-bold">
                                        ${post.price}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* </a> */}
                    </li>
                ))}
            </ul>
        </div>
    );
};
