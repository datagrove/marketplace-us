import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show, onMount } from "solid-js";
import { DeletePostButton } from "../posts/DeletePostButton";
import supabase from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { AddToCart } from "../common/cart/AddToCartButton";
import type { AuthSession } from "@supabase/supabase-js";
import { FavoriteButton } from "@components/posts/AddFavorite";
// import { lazyLoadImage } from "@lib/imageHelper";
// import postPlaceHolder from "@src/assets/postPlaceHolder.svg";
import { AverageRatingStars } from "@components/posts/AverageRatingStars";
import { RemoveFavoriteButton } from "@components/posts/RemoveFavorite";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    // Define the type for the filterPosts prop
    posts: Array<Post>;
    favoriteList?: string;
    onRemoveFavorite?: () => void;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewCard: Component<Props> = (props) => {
    const [newPosts, setNewPosts] = createSignal<Array<Post>>([]);
    const [quantity, setQuantity] = createSignal<number>(1);
    const [session, setSession] = createSignal<AuthSession | null>(null);

    createEffect(() => {
        const list = props.favoriteList;
        console.log(props.posts);
        console.log(props.favoriteList);
    });

    if (UserError) {
        console.log("User Error: " + UserError.message);
    } else {
        if (User.session === null) {
            console.log("User Session: " + User.session);
            setSession(null);
        } else {
            setSession(User.session);
        }
    }

    const resetQuantity = () => {
        setQuantity(1);
    };

    return (
        <div class="flex w-full justify-center">
            <ul class="flex w-full flex-wrap justify-center">
                {props.posts.map((post: Post, index) => (
                    <li class="mb-3 w-[99%]">
                        <a
                            href={`/${lang}/posts/${post.id}`}
                            aria-label={
                                t("ariaLabels.readMoreAbout") + post.title
                            }
                        >
                            <div class="mb-2 box-content flex h-full w-full flex-grow flex-row items-start justify-start rounded-lg border border-border1 border-opacity-25 shadow-md shadow-shadow-LM dark:border-border1-DM dark:border-opacity-25 dark:shadow-shadow-DM">
                                <div class="relative mr-2 flex h-48 w-48 shrink-0 items-center justify-center rounded-lg bg-background1 dark:bg-background1-DM">
                                    {post.image_url && index <= 4 ? (
                                        <div class="absolute top-0">
                                            <picture>
                                                <source
                                                    type="image/webp"
                                                    srcset={
                                                        post.image_url.webpUrl
                                                    }
                                                />
                                                <img
                                                    src={post.image_url.jpegUrl}
                                                    alt={
                                                        post.image_urls?.[0]
                                                            ? `User Image for Post ${post.title}`
                                                            : "No image"
                                                    }
                                                    class="h-48 w-48 rounded-lg bg-background1 object-contain dark:bg-background1-DM"
                                                    fetchpriority="high"
                                                    loading="eager"
                                                />
                                            </picture>

                                            <div class="absolute right-2 top-2 col-span-1 flex justify-end">
                                                <div class="inline-block">
                                                    <Show
                                                        when={
                                                            props.favoriteList ===
                                                                undefined ||
                                                            props.favoriteList ===
                                                                null ||
                                                            props.favoriteList ===
                                                                ""
                                                        }
                                                    >
                                                        <FavoriteButton
                                                            id={post.id}
                                                        />
                                                    </Show>
                                                    <Show
                                                        when={
                                                            props.favoriteList !==
                                                                undefined &&
                                                            props.favoriteList !==
                                                                null &&
                                                            props.favoriteList !==
                                                                ""
                                                        }
                                                    >
                                                        <RemoveFavoriteButton
                                                            product_id={post.id}
                                                            list_number={
                                                                props.favoriteList
                                                                    ? props.favoriteList
                                                                    : ""
                                                            }
                                                            onRemoveFavorite={
                                                                props.onRemoveFavorite
                                                                    ? props.onRemoveFavorite
                                                                    : () => {}
                                                            }
                                                        />
                                                    </Show>
                                                </div>
                                            </div>
                                        </div>
                                    ) : post.image_url && index > 4 ? (
                                        <div class="absolute top-0">
                                            <picture>
                                                <source
                                                    type="image/webp"
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
                                                            ? `User Image for Post ${post.title}`
                                                            : "No image"
                                                    }
                                                    class="h-48 w-48 rounded-lg bg-background1 object-contain dark:bg-background1-DM"
                                                    loading="lazy"
                                                    onload={(e) => {
                                                        lazyLoadImage(
                                                            e.currentTarget as HTMLImageElement
                                                        );
                                                    }}
                                                />
                                            </picture>

                                            <div class="absolute right-2 top-2 col-span-1 flex justify-end">
                                                <div class="inline-block">
                                                    <Show
                                                        when={
                                                            props.favoriteList ===
                                                                undefined ||
                                                            props.favoriteList ===
                                                                null ||
                                                            props.favoriteList ===
                                                                ""
                                                        }
                                                    >
                                                        <FavoriteButton
                                                            id={post.id}
                                                        />
                                                    </Show>
                                                    <Show
                                                        when={
                                                            props.favoriteList !==
                                                                undefined &&
                                                            props.favoriteList !==
                                                                null &&
                                                            props.favoriteList !==
                                                                ""
                                                        }
                                                    >
                                                        <RemoveFavoriteButton
                                                            product_id={post.id}
                                                            list_number={
                                                                props.favoriteList
                                                                    ? props.favoriteList
                                                                    : ""
                                                            }
                                                            onRemoveFavorite={
                                                                props.onRemoveFavorite
                                                                    ? props.onRemoveFavorite
                                                                    : () => {}
                                                            }
                                                        />
                                                    </Show>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div class="relative">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="35 0 186 256"
                                                id="Flat"
                                                class="h-full w-full fill-icon1 dark:fill-icon1-DM"
                                            >
                                                <path d="M208,36H48A12.01312,12.01312,0,0,0,36,48V208a12.01312,12.01312,0,0,0,12,12H208a12.01312,12.01312,0,0,0,12-12V48A12.01312,12.01312,0,0,0,208,36Zm4,172a4.004,4.004,0,0,1-4,4H48a4.004,4.004,0,0,1-4-4V177.65631l33.17187-33.171a4.00208,4.00208,0,0,1,5.65723,0l20.68652,20.68652a12.011,12.011,0,0,0,16.96973,0l44.68652-44.68652a4.00208,4.00208,0,0,1,5.65723,0L212,161.65625Zm0-57.65625L176.48535,114.8291a11.99916,11.99916,0,0,0-16.96973,0L114.8291,159.51562a4.00681,4.00681,0,0,1-5.65723,0L88.48535,138.8291a12.01009,12.01009,0,0,0-16.96973,0L44,166.34393V48a4.004,4.004,0,0,1,4-4H208a4.004,4.004,0,0,1,4,4ZM108.001,92v.00195a8.001,8.001,0,1,1,0-.00195Z" />
                                            </svg>

                                            <div class="absolute right-2 top-10 col-span-1 flex justify-end align-top">
                                                <div class="inline-block">
                                                    <Show
                                                        when={
                                                            props.favoriteList ===
                                                                undefined ||
                                                            props.favoriteList ===
                                                                null ||
                                                            props.favoriteList ===
                                                                ""
                                                        }
                                                    >
                                                        <FavoriteButton
                                                            id={post.id}
                                                        />
                                                    </Show>
                                                    <Show
                                                        when={
                                                            props.favoriteList !==
                                                                undefined &&
                                                            props.favoriteList !==
                                                                null &&
                                                            props.favoriteList !==
                                                                ""
                                                        }
                                                    >
                                                        <RemoveFavoriteButton
                                                            product_id={post.id}
                                                            list_number={
                                                                props.favoriteList
                                                                    ? props.favoriteList
                                                                    : ""
                                                            }
                                                            onRemoveFavorite={
                                                                props.onRemoveFavorite
                                                                    ? props.onRemoveFavorite
                                                                    : () => {}
                                                            }
                                                        />
                                                    </Show>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div
                                    id="cardContent"
                                    class="flex min-h-48 w-5/6 flex-col place-content-between px-1 pt-1 text-left"
                                >
                                    <div class="flex h-full min-h-48 flex-col place-content-between">
                                        <div class="flex flex-row justify-between">
                                            <div class="flex w-full flex-col">
                                                <p class="prose mr-1 line-clamp-2 text-lg font-bold text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                                    {post.title}
                                                </p>

                                                <div class="flex items-center">
                                                    {post.seller_img ? (
                                                        <picture>
                                                            <source
                                                                srcset={
                                                                    post
                                                                        .seller_img
                                                                        .webpUrl
                                                                }
                                                                type="image/webp"
                                                            />
                                                            <img
                                                                src={
                                                                    post
                                                                        .seller_img
                                                                        .jpegUrl
                                                                }
                                                                alt="Seller image"
                                                                class="mr-1 h-8 w-8 rounded-full"
                                                            />
                                                        </picture>
                                                    ) : (
                                                        <svg
                                                            width="24px"
                                                            height="24px"
                                                            class="mr-1 h-4 w-4 rounded-full border-2 border-border1 fill-icon1 dark:border-border1-DM dark:bg-icon1-DM md:h-auto md:w-auto"
                                                            viewBox="0 0 32 32"
                                                        >
                                                            <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
                                                        </svg>
                                                    )}
                                                    <p class="overflow-hidden text-xs font-light text-ptext1 dark:text-ptext1-DM md:text-base">
                                                        {post.seller_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <Show when={post.draft_status}>
                                                <div class="w-1/4">
                                                    <Show
                                                        when={post.draft_status}
                                                    >
                                                        <div class="rounded-full bg-black text-center text-white dark:bg-white dark:text-black">
                                                            {t(
                                                                "formLabels.draft"
                                                            )}
                                                        </div>
                                                    </Show>
                                                </div>
                                            </Show>
                                        </div>

                                        <div class="my-1 flex">
                                            <p
                                                class="prose mr-1 line-clamp-3 text-xs text-ptext1 dark:prose-invert dark:text-ptext1-DM"
                                                innerHTML={post.content}
                                            ></p>
                                        </div>

                                        <div class="details-div grid grid-flow-row auto-rows-min">
                                            <div class="grid w-full grid-cols-4 text-[10px]">
                                                <div class="col-span-1">
                                                    <div class="">
                                                        {t(
                                                            "formLabels.subjects"
                                                        )}
                                                        :
                                                    </div>
                                                </div>
                                                <div class="prose col-span-3 flex-wrap text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                                    <div class="flex-wrap">
                                                        {Array.from(
                                                            post.subject!
                                                        ).join(", ")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                class={`grid w-full grid-cols-4 text-[10px] ${post.subtopic && post.subtopic.length > 0 ? "" : "hidden"}`}
                                            >
                                                <div class="col-span-1">
                                                    <div class="">
                                                        {t(
                                                            "postLabels.subtopics"
                                                        )}
                                                        :
                                                    </div>
                                                </div>
                                                <div class="prose col-span-3 flex-wrap text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                                    <div class="flex-wrap">
                                                        {Array.from(
                                                            post.subtopic!
                                                        ).join(", ")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="grid w-full grid-cols-4 text-[10px]">
                                                <div class="col-span-1">
                                                    <div class="">
                                                        {t("formLabels.grades")}
                                                        :
                                                    </div>
                                                </div>
                                                <div class="prose col-span-3 flex-wrap text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                                    <div class="flex-wrap">
                                                        {post.grade!.join(", ")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="grid w-full grid-cols-4 text-[10px]">
                                                <div class="col-span-1">
                                                    <div class="">
                                                        {t(
                                                            "formLabels.resourceTypes"
                                                        )}
                                                        :
                                                    </div>
                                                </div>
                                                <div class="prose col-span-3 flex-wrap align-middle text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                                    <div class="flex-wrap">
                                                        {post.resourceTypes?.join(
                                                            ", "
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-2 flex h-full min-h-48 w-1/6 min-w-[88px] flex-col justify-start pr-1">
                                    <div class="price-reviews-div inline-block w-full text-end">
                                        <Show when={post.price > 0}>
                                            <p class="text-lg font-bold">
                                                ${post.price.toFixed(2)}
                                            </p>
                                        </Show>

                                        <Show when={post.price === 0}>
                                            <p class="text-lg font-bold">
                                                {t("messages.free")}
                                            </p>
                                        </Show>
                                        <div class="reviews-div my-1 flex w-full items-center justify-end text-end">
                                            <AverageRatingStars
                                                resourceId={post.id}
                                                page={"viewCard"}
                                            />
                                        </div>
                                    </div>

                                    <div class="fileTypes-div mt-1 flex h-fit w-full flex-col items-start justify-start"></div>

                                    <div class="mb-1 flex w-full flex-col text-end">
                                        <Show
                                            when={
                                                session() === null ||
                                                session()?.user.id !==
                                                    post.user_id
                                            }
                                        >
                                            <AddToCart
                                                item={{ ...post, quantity: 1 }}
                                                buttonClick={resetQuantity}
                                            />
                                        </Show>

                                        <div class="relative col-span-1 flex w-full justify-end align-top">
                                            <div class="inline-block">
                                                <DeletePostButton
                                                    id={post.id}
                                                    userId={post.user_id}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
