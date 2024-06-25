import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show } from "solid-js";
import { DeletePostButton } from "../posts/DeletePostButton";
import supabase from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { SocialMediaShares } from "../posts/SocialMediaShares";
import SocialModal from "../posts/SocialModal";
import { AddToCart } from "../common/cart/AddToCartButton";
import { Quantity } from "@components/common/cart/Quantity";
import { doc } from "prettier";
import type { AuthSession } from "@supabase/supabase-js";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    // Define the type for the filterPosts prop
    posts: Array<Post>;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const MobileViewCard: Component<Props> = (props) => {
    const [newPosts, setNewPosts] = createSignal<Array<any>>([]);
    const [quantity, setQuantity] = createSignal<number>(1);
    const [session, setSession] = createSignal<AuthSession | null>(null);

    if (UserError) {
        console.log("User Error: " + UserError.message);
    } else {
        setSession(User.session);
    }

    createEffect(async () => {
        if (props.posts) {
            const updatedPosts = await Promise.all(
                props.posts.map(async (post: any) => {
                    post.image_urls
                        ? (post.image_url = await downloadImage(
                              post.image_urls.split(",")[0]
                          ))
                        : (post.image_url = null);

                    post.seller_img
                        ? (post.seller_img = await downloadSellerImage(
                              post.seller_img
                          ))
                        : null;

                    // Set the default quantity to 1
                    post.quantity = 1;

                    const { data: resourceTypeData, error } = await supabase
                        .from("resource_types")
                        .select("*");

                    if (error) {
                        console.log("supabase error: " + error.message);
                    } else {
                        post.resourceTypes = [];
                        resourceTypeData.forEach((databaseResourceTypes) => {
                            post.resource_types.map(
                                (itemResourceType: string) => {
                                    if (
                                        itemResourceType ===
                                        databaseResourceTypes.id.toString()
                                    ) {
                                        post.resourceTypes!.push(
                                            databaseResourceTypes.type
                                        );
                                    }
                                }
                            );
                        });
                    }

                    return post;
                })
            );

            setNewPosts(updatedPosts);
        }
    });

    const updateQuantity = (quantity: number) => {
        setQuantity(quantity);
    };

    const resetQuantity = () => {
        setQuantity(1);
    };

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

    const downloadSellerImage = async (path: string) => {
        try {
            const { data, error } = await supabase.storage
                .from("user.image")
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

    function changeShowBtn(e: Event, postId: number) {
        e.preventDefault();
        e.stopPropagation();

        let postID = postId.toString();
        let showMoreID = `${postID}more`;
        let showLessID = `${postID}less`;
        let postContentID = `${postID}content`;

        console.log("id: ", postID);

        let showMoreDiv = document.getElementById(postID);
        let showMoreBtn = document.getElementById(showMoreID);
        let showLessBtn = document.getElementById(showLessID);
        let postContent = document.getElementById(postContentID);

        console.log("showMoreBtn: ", showMoreBtn);
        console.log("showLessBtn: ", showLessBtn);

        if (showMoreBtn?.classList.contains("flex")) {
            showMoreBtn.classList.remove("flex");
            showMoreBtn.classList.add("hidden");
            showLessBtn?.classList.remove("hidden");
            showLessBtn?.classList.add("flex");
            postContent?.classList.add("flex");
            postContent?.classList.remove("hidden");
        } else if (showLessBtn?.classList.contains("flex")) {
            showLessBtn?.classList.remove("flex");
            showLessBtn?.classList.add("hidden");
            showMoreBtn?.classList.remove("hidden");
            showMoreBtn?.classList.add("flex");
            postContent?.classList.remove("flex");
            postContent?.classList.add("hidden");
        }

        // if(showMoreBtn?.classList.contains("flex")) {
        //     showMoreBtn.classList.remove("flex");
        //     showMoreBtn.classList.add("hidden");
        //     showLessBtn?.classList.remove("hidden");
        //     showLessBtn?.classList.add("flex");
        // }
    }

    return (
        <div class="">
            {newPosts().map((post: Post) => (
                <div class="mb-4 rounded border border-border1 dark:border-border1-DM">
                    <a href={`/${lang}/posts/${post.id}`}>
                        <div class="photo-price flex h-48 w-full justify-between rounded-lg bg-background1 dark:bg-background1-DM">
                            <div class="flex h-48 w-48 shrink-0 items-center justify-center rounded-lg bg-background1 dark:bg-background1-DM">
                                {post.image_url ? (
                                    <img
                                        src={post.image_url}
                                        alt={
                                            post.image_urls!.split(",")[0]
                                                ? "User Image"
                                                : "No image"
                                        }
                                        class="h-full w-full rounded-lg bg-background1 object-cover dark:bg-icon1-DM"
                                    />
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="35 0 186 256"
                                        id="Flat"
                                        class="h-full w-full fill-icon1 dark:border-border1-DM dark:fill-icon1-DM"
                                    >
                                        <path d="M208,36H48A12.01312,12.01312,0,0,0,36,48V208a12.01312,12.01312,0,0,0,12,12H208a12.01312,12.01312,0,0,0,12-12V48A12.01312,12.01312,0,0,0,208,36Zm4,172a4.004,4.004,0,0,1-4,4H48a4.004,4.004,0,0,1-4-4V177.65631l33.17187-33.171a4.00208,4.00208,0,0,1,5.65723,0l20.68652,20.68652a12.011,12.011,0,0,0,16.96973,0l44.68652-44.68652a4.00208,4.00208,0,0,1,5.65723,0L212,161.65625Zm0-57.65625L176.48535,114.8291a11.99916,11.99916,0,0,0-16.96973,0L114.8291,159.51562a4.00681,4.00681,0,0,1-5.65723,0L88.48535,138.8291a12.01009,12.01009,0,0,0-16.96973,0L44,166.34393V48a4.004,4.004,0,0,1,4-4H208a4.004,4.004,0,0,1,4,4ZM108.001,92v.00195a8.001,8.001,0,1,1,0-.00195Z" />
                                    </svg>
                                )}
                            </div>

                            <div class="content mr-1 w-1/2">
                                <div class="flex items-start justify-end">
                                    <div class="price-reviews-div inline-block text-end">
                                        <Show when={post.price}>
                                            <p class="text-lg font-bold">
                                                ${post.price}{" "}
                                            </p>
                                        </Show>

                                        <Show when={!post.price}>
                                            <p class="text-lg font-bold">
                                                {t("messages.free")}
                                            </p>
                                        </Show>

                                        <div class="reviews-div flex w-full items-center justify-end text-end">
                                            {/* <svg
                                                width="12px"
                                                height="12px"
                                                viewBox="0 0 32 32"
                                                class="fill-icon1 dark:fill-icon1-DM"
                                            >
                                                <script />
                                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                                <script />
                                            </svg>

                                            <p class="ml-1 text-xs">
                                                4.9 (30.3K)
                                            </p> */}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col items-end justify-end py-1">
                                    <h6 class="text-[12px] font-bold">
                                        {t("formLabels.subjects")}
                                    </h6>
                                    {post
                                        .subject!.slice(0, 3)
                                        .map((subject: string) => {
                                            return (
                                                <div class="text-[10px] font-light">
                                                    {subject}
                                                </div>
                                            );
                                        })}
                                    <Show when={post.subject!.length > 3}>
                                        <div class="text-[10px] font-light">
                                            ...{t("formLabels.more")}
                                        </div>
                                    </Show>
                                </div>

                                <div class="flex flex-col items-end justify-end py-1">
                                    <h6 class="text-[12px] font-bold">
                                        {t("formLabels.grades")}
                                    </h6>
                                    {post
                                        .grade!.slice(0, 3)
                                        .map((grade: string) => {
                                            return (
                                                <p class="text-[10px] font-light">
                                                    {grade}
                                                </p>
                                            );
                                        })}
                                    <Show when={post.grade!.length > 3}>
                                        <div class="text-[10px] font-light">
                                            ...{t("formLabels.more")}
                                        </div>
                                    </Show>
                                </div>
                            </div>
                        </div>
                    </a>

                    <div class="title-creator mb-1 ml-1">
                        <a href={`/${lang}/posts/${post.id}`}>
                            <div class="mr-1 line-clamp-2 py-0.5 pt-4 text-start text-lg font-bold text-ptext1 dark:text-ptext1-DM">
                                {post.title}
                            </div>
                        </a>
                        <a href={`/${lang}/creator/${post?.seller_id}`}>
                            <div class="flex w-fit items-center py-1 pr-4">
                                {post.seller_img ? (
                                    <img
                                        src={post.seller_img}
                                        alt="Seller image"
                                    />
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
                                <p class="overflow-hidden text-xs font-light text-ptext1 dark:text-ptext1-DM">
                                    {post.seller_name}
                                </p>
                            </div>
                        </a>
                    </div>

                    <div
                        id={post.id.toString()}
                        class="show-more flex w-full flex-wrap items-center"
                    >
                        <button
                            id={`${post.id}more`}
                            class="flex w-full justify-center"
                            onclick={(e) => changeShowBtn(e, post.id)}
                        >
                            <p
                                class={`${post.id}more pr-1 text-htext1 dark:text-htext1-DM`}
                            >
                                {t("buttons.showMore")}
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class={`${post.id}more h-6 w-6 text-htext1 dark:text-htext1-DM`}
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                />
                            </svg>
                        </button>

                        <button
                            id={`${post.id}less`}
                            class="hidden w-full justify-center"
                            onclick={(e) => changeShowBtn(e, post.id)}
                        >
                            <p class="pr-1 text-htext1 dark:text-htext1-DM">
                                {t("buttons.showLess")}
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="h-6 w-6 text-htext1 dark:text-htext1-DM"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                />
                            </svg>
                        </button>

                        <a href={`/${lang}/posts/${post.id}`}>
                            <div
                                id={`${post.id}content`}
                                class="hidden w-full flex-col justify-start"
                            >
                                <p
                                    class="prose mb-2 line-clamp-3 text-start text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM"
                                    innerHTML={post.content}
                                ></p>

                                <div class="details grid grid-cols-5">
                                    {/* SUBJECTS */}
                                    <div class=" col-span-2 mr-2 text-end text-[10px] font-bold">
                                        {t("formLabels.subjects")}:
                                    </div>
                                    <div class="prose col-span-3 grid flex-wrap text-start text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                        <div class="flex-wrap">
                                            {Array.from(post.subject!).join(
                                                ", "
                                            )}
                                        </div>
                                    </div>

                                    {/* GRADES */}
                                    <div class="col-span-2 mr-2 text-end text-[10px] font-bold">
                                        <div class="">
                                            {t("formLabels.grades")}:
                                        </div>
                                    </div>
                                    <div class="prose col-span-3 flex-wrap text-start text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                        <div class="flex-wrap">
                                            {post.grade!.join(", ")}
                                        </div>
                                    </div>

                                    {/* RESOURCE TYPES */}
                                    <div class="col-span-2 mr-2 text-end text-[10px] font-bold">
                                        {t("formLabels.resourceTypes")}:
                                    </div>
                                    <div class="prose col-span-3 flex flex-wrap text-start text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                        <div class="flex-wrap">
                                            {post.resourceTypes!.join(", ")}
                                        </div>
                                    </div>
                                    {/* <h6 class="text-start text-[10px] font-bold">
                                    {t("formLabels.standards")}:{" "}
                                </h6>
                                <p class="truncate text-start text-[10px]">
                                    RF.K.2, RF.K.3, RF.K.3c
                                </p> */}
                                </div>

                                <div class="mt-2 flex">
                                    {/* <div class="mr-3 flex items-center justify-start">
                                    <svg
                                        width="12px"
                                        height="12px"
                                        viewBox="0 0 28 28"
                                        version="1.1"
                                        class="fill-icon1 dark:fill-icon1-DM"
                                    >
                                        <g
                                            id="🔍-Product-Icons"
                                            stroke="none"
                                            stroke-width="1"
                                            fill="none"
                                            fill-rule="evenodd"
                                            class="fill-icon1 dark:fill-icon1-DM"
                                        >
                                            <g
                                                id="ic_fluent_checkmark_28_filled"
                                                fill-rule="nonzero"
                                            >
                                                <path
                                                    d="M10.5,19.5857864 L4.20710678,13.2928932 C3.81658249,12.9023689 3.18341751,12.9023689 2.79289322,13.2928932 C2.40236893,13.6834175 2.40236893,14.3165825 2.79289322,14.7071068 L9.79289322,21.7071068 C10.1834175,22.0976311 10.8165825,22.0976311 11.2071068,21.7071068 L25.2071068,7.70710678 C25.5976311,7.31658249 25.5976311,6.68341751 25.2071068,6.29289322 C24.8165825,5.90236893 24.1834175,5.90236893 23.7928932,6.29289322 L10.5,19.5857864 Z"
                                                    id="🎨-Color"
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>

                                    <p class="my-0.5 ml-1 text-[10px]">Short</p>
                                </div>

                                <div class="mr-3 flex items-center justify-start">
                                    <svg
                                        width="12px"
                                        height="12px"
                                        viewBox="0 0 28 28"
                                        version="1.1"
                                        class="fill-icon1 dark:fill-icon1-DM"
                                    >
                                        <g
                                            id="🔍-Product-Icons"
                                            stroke="none"
                                            stroke-width="1"
                                            fill="none"
                                            fill-rule="evenodd"
                                            class="fill-icon1 dark:fill-icon1-DM"
                                        >
                                            <g
                                                id="ic_fluent_checkmark_28_filled"
                                                fill-rule="nonzero"
                                            >
                                                <path
                                                    d="M10.5,19.5857864 L4.20710678,13.2928932 C3.81658249,12.9023689 3.18341751,12.9023689 2.79289322,13.2928932 C2.40236893,13.6834175 2.40236893,14.3165825 2.79289322,14.7071068 L9.79289322,21.7071068 C10.1834175,22.0976311 10.8165825,22.0976311 11.2071068,21.7071068 L25.2071068,7.70710678 C25.5976311,7.31658249 25.5976311,6.68341751 25.2071068,6.29289322 C24.8165825,5.90236893 24.1834175,5.90236893 23.7928932,6.29289322 L10.5,19.5857864 Z"
                                                    id="🎨-Color"
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>

                                    <p class="my-0.5 ml-1 text-[10px]">
                                        This is Medium
                                    </p>
                                </div>

                                <div class="mr-3 flex items-center justify-start">
                                    <svg
                                        width="12px"
                                        height="12px"
                                        viewBox="0 0 28 28"
                                        version="1.1"
                                        class="fill-icon1 dark:fill-icon1-DM"
                                    >
                                        <g
                                            id="🔍-Product-Icons"
                                            stroke="none"
                                            stroke-width="1"
                                            fill="none"
                                            fill-rule="evenodd"
                                            class="fill-icon1 dark:fill-icon1-DM"
                                        >
                                            <g
                                                id="ic_fluent_checkmark_28_filled"
                                                fill-rule="nonzero"
                                            >
                                                <path
                                                    d="M10.5,19.5857864 L4.20710678,13.2928932 C3.81658249,12.9023689 3.18341751,12.9023689 2.79289322,13.2928932 C2.40236893,13.6834175 2.40236893,14.3165825 2.79289322,14.7071068 L9.79289322,21.7071068 C10.1834175,22.0976311 10.8165825,22.0976311 11.2071068,21.7071068 L25.2071068,7.70710678 C25.5976311,7.31658249 25.5976311,6.68341751 25.2071068,6.29289322 C24.8165825,5.90236893 24.1834175,5.90236893 23.7928932,6.29289322 L10.5,19.5857864 Z"
                                                    id="🎨-Color"
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>

                                    <p class="my-0.5 ml-1 text-[10px]">
                                        Longer File Type Name
                                    </p>
                                </div> */}
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="cart my-2 w-full px-1">
                        <Show
                            when={
                                session() === null ||
                                session()?.user.id !== post.user_id
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
                                    postImage={post.image_urls}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
