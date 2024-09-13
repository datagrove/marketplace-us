import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { Show, createSignal } from "solid-js";
import { useTranslations } from "../../i18n/utils";
import { lazyLoadImage } from "@lib/imageHelper";
import postPlaceHolder from "@src/assets/postPlaceHolder.svg";
import person from "@src/assets/person.svg";

interface Props {
    // Define the type for the filterPosts prop
    posts: Array<Post>;
    lang: "en" | "es" | "fr";
}

export const HomeCard: Component<Props> = (props) => {
    const [lang, setLang] = createSignal<"en" | "es" | "fr">(props.lang);

    const t = useTranslations(lang());

    return (
        <div class="mb-4 flex justify-center">
            <ul class="flex flex-wrap justify-center md:flex-nowrap">
                {props.posts.map((post: Post) => (
                    <li>
                        {/* { post.id } */}
                        {/* {`/${lang}/posts/${post.id}`} */}
                        <div class="mx-2 mb-4 grid h-[275px] w-40 grid-cols-1 grid-rows-9 justify-between rounded border-2 border-border1 px-1 dark:border-border1-DM md:mx-1 md:mb-0 2xl:h-[324px]">
                            <div class="home-card-img-div row-span-6 flex w-full items-center justify-center pb-1 pt-1">
                                <a
                                    href={`/${lang()}/posts/${post.id}`}
                                    class="h-full w-full"
                                    aria-label={`${t("ariaLabels.readMoreAbout")}${post.title}`}
                                >
                                    <div
                                        id="homeCard-img"
                                        class="flex h-full w-full items-center justify-center"
                                    >
                                        {post.image_url ? (
                                            <picture>
                                                <source
                                                    data-srcset={
                                                        post.image_url.webpUrl
                                                    }
                                                />
                                                <img
                                                    src={postPlaceHolder.src}
                                                    data-src={
                                                        post.image_url.jpegUrl
                                                    }
                                                    alt={
                                                        post.image_urls?.[0]
                                                            ? `Post Image ${post.image_urls[0]}.jpeg`
                                                            : "No Image"
                                                    }
                                                    class="h-40 w-40 rounded-lg object-contain"
                                                    loading="lazy"
                                                    onload={(e) => {
                                                        lazyLoadImage(
                                                            e.currentTarget as HTMLImageElement
                                                        );
                                                    }}
                                                />
                                            </picture>
                                        ) : (
                                            <svg viewBox="0 0 180 180">
                                                <circle
                                                    cx="90.255"
                                                    cy="90.193"
                                                    r="86.345"
                                                    style="fill:none;fill-opacity:1;stroke:currentColor;stroke-width:2.31085;stroke-dasharray:none;stroke-opacity:1"
                                                />
                                                <circle
                                                    cx="90.114"
                                                    cy="90.788"
                                                    r="79.812"
                                                    style="fill:none;fill-opacity:1;stroke:currentColor;stroke-width:2.13599;stroke-dasharray:none;stroke-opacity:1"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M12.063 4.042c2.997-.367 5.737 1.714 6.22 4.689a1 1 0 0 0 .534.731 3.976 3.976 0 0 1 2.153 3.077c.266 2.187-1.285 4.17-3.452 4.435a3.846 3.846 0 0 1-1.018-.016c-.362-.057-.566-.155-.641-.218a1 1 0 0 0-1.274 1.542c.475.393 1.09.57 1.604.651a5.838 5.838 0 0 0 1.572.026c3.271-.4 5.592-3.386 5.195-6.661a5.974 5.974 0 0 0-2.794-4.372c-.86-3.764-4.432-6.348-8.342-5.87a7.607 7.607 0 0 0-5.836 4.065C2.755 6.635 1 9.606 1 12.631c0 .975.334 2.501 1.491 3.798 1.186 1.329 3.13 2.297 6.117 2.297a1 1 0 1 0 0-2c-2.526 0-3.885-.8-4.625-1.63-.769-.86-.983-1.88-.983-2.464 0-1.895.85-3.47 2.22-4.18a7.675 7.675 0 0 0-.036 2.116 1 1 0 1 0 1.986-.241 5.638 5.638 0 0 1 .401-2.884 5.615 5.615 0 0 1 4.492-3.4Zm4.595 8.71a1 1 0 0 0-1.316-1.505l-3.358 2.938-2.344-1.953a1 1 0 0 0-1.28 1.536l2.64 2.2V22a1 1 0 1 0 2 0v-6.046z"
                                                    clip-rule="evenodd"
                                                    style="fill:currentColor;fill-opacity:1;stroke:none;stroke-width:1.00012;stroke-dasharray:none;stroke-opacity:1"
                                                    transform="matrix(5.90906 0 0 6.19044 17.877 12.727)"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </a>
                            </div>

                            <div
                                id="homeCard-text"
                                class="row-span-3 grid grid-rows-3"
                            >
                                <div class="row-span-2">
                                    <div
                                        onclick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.location.href = `/${lang()}/posts/${post.id}`;
                                        }}
                                    >
                                        <p class="line-clamp-2 pt-1 text-start text-sm font-bold">
                                            {post.title}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    onclick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.location.href = `/${lang()}/creator/${post.seller_id}`;
                                    }}
                                >
                                    <div class="my-1 flex items-center">
                                        <div>
                                            {post.seller_img ? (
                                                <picture>
                                                    <source
                                                        data-srcset={
                                                            post.seller_img
                                                                .webpUrl
                                                        }
                                                    />
                                                    <img
                                                        src={person.src}
                                                        data-src={
                                                            post.seller_img
                                                                .jpegUrl
                                                        }
                                                        class={`h-[25px] w-[25px] rounded-full`}
                                                        alt={`${post.seller_name} image`}
                                                        loading="lazy"
                                                        onload={(e) => {
                                                            lazyLoadImage(
                                                                e.currentTarget as HTMLImageElement
                                                            );
                                                        }}
                                                    />
                                                </picture>
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
                                        </div>
                                        <div class="truncate">
                                            <p class="ml-1 truncate text-xs font-light text-link1 dark:text-link1-DM">
                                                {post.seller_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                id="homeCard-ratings-price"
                                class="row-span-1 text-end"
                            >
                                {/* <div class="flex w-2/3 items-end"> */}
                                {/*     <div class="flex items-end justify-start"> */}
                                {/*         <svg */}
                                {/*             xmlns="http://www.w3.org/2000/svg" */}
                                {/*             width="15px" */}
                                {/*             height="15px" */}
                                {/*             viewBox="0 0 32 32" */}
                                {/*             class="fill-icon1 dark:fill-icon1-DM" */}
                                {/*         > */}
                                {/*             <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" /> */}
                                {/*         </svg> */}
                                {/**/}
                                {/*         <p class="ml-1 mr-0.5 text-xs font-bold"> */}
                                {/*             4.9 */}
                                {/*         </p> */}
                                {/*         <p class="text-xs font-light"> */}
                                {/*             (30.3K) */}
                                {/*         </p> */}
                                {/*     </div> */}
                                {/* </div> */}

                                <div class=" text-end">
                                    <Show when={post.price > 0}>
                                        <p class="text-xs font-bold">
                                            ${post.price.toFixed(2)}
                                        </p>
                                    </Show>
                                    <Show when={post.price === 0}>
                                        <p class="text-xs font-bold">
                                            {t("messages.free")}
                                        </p>
                                    </Show>
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
