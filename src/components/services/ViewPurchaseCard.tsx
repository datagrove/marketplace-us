import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show, onMount } from "solid-js";
import { DeletePostButton } from "../posts/DeletePostButton";
import supabase from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { SocialMediaShares } from "../posts/SocialMediaShares";
import SocialModal from "../posts/SocialModal";
import { AddToCart } from "../common/cart/AddToCartButton";
import { Quantity } from "@components/common/cart/Quantity";
import type { AuthSession } from "@supabase/supabase-js";
import { DownloadBtn } from "./DownloadBtn.tsx";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    // Define the type for the filterPosts prop
    posts: Array<Post>;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewPurchaseCard: Component<Props> = (props) => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [purchasedItems, setPurchasedItems] = createSignal<Array<any>>([]);
    const [review, setReview] = createSignal<string>("");
    // const [updatedDate, setUpdatedDate] = createSignal<Date>(new Date(Date.now()));
    const [updatedDate, setUpdatedDate] = createSignal<Date>(new Date("2024-03-05 21:54:44.695358+00"));
    const [orderDate, setOrderDate] = createSignal<string>("");
    const [productID, setProductID] = createSignal<Number>();
    

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

    // onMount(async() => {
    //     console.log("order date now: ", orderDate());
    //     await getItemDates();
    //     console.log(orderDate());
    // })

    createEffect(async () => {
        // console.log("View Card Posts")
        // console.log(props.posts)
        if (props.posts) {
            const updatedPosts = await Promise.all(
                props.posts.map(async (post: Post) => {
                    post.image_urls
                        ? (post.image_url = await downloadImage(
                              post.image_urls.split(",")[0]
                          ))
                        : (post.image_url = undefined);

                    // Set the default quantity to 1
                    post.quantity = 1;
                    setProductID(post.id);
                    console.log("productID: ", productID());
                    getItemDates();
                    console.log("orderDate: ", orderDate());
                    getUpdatedDate(post);
                    return post;
                })
            );

            setPurchasedItems(updatedPosts);

        }
    });

    const ratePurchase = (e: Event) => {
        let selectedReviewID = e.currentTarget?.id;

        setReview(selectedReviewID);

        alert(t("messages.comingSoon"));
    }

    const follow = () => {
        alert(t("messages.comingSoon"));
    }

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

    const getItemDates = async() => {
        const { data: orderDetail, error } = await supabase
            .from("order_details")
            .select("*")
            .eq("product_id", productID())

        if (error) {
            console.log("Orders Error: " + error.code + " " + error.message);
            return;
        }

        let orderNumber = orderDetail[0].order_number;

        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("*")
            .eq("order_number", orderNumber)
        
        if(orderError) {
            console.log("orderError: " + orderError.code + " " + orderError.message);
            return;
        }

        // const { data: createdDate, error: createdDateError } = await supabase
        //     .from("seller_post")
        //     .select("created_at")
        //     .eq("id", post.id);
        
        // if(createdDateError) {
        //     console.log("orderError: " + createdDateError.code + " " + createdDateError.message);
        //     return;
        // }

        setOrderDate(order[0].order_date);
        // setUpdatedDate(createdDate[0].created_at);

        console.log("order date type?: ", typeof(order[0].order_date));
        
        console.log(orderDetail)
        console.log(orderDetail[0].product_id) // 5
        console.log(orderDetail[0].order_number) 
    };

    const getUpdatedDate = async(post: Post) => {
        const { data: createdDate, error: createdDateError } = await supabase
            .from("seller_post")
            .select("created_at")
            .eq("id", post.id);
        
        if(createdDateError) {
            console.log("orderError: " + createdDateError.code + " " + createdDateError.message);
            return;
        }

        console.log("createAt from getUpdatedDate function: ", createdDate[0])
    }

    return (
        <div class="border-2 border-black">
            { purchasedItems().map((post: Post ) => (
                <div class="flex">
                    {/* { setProductID(post.id) } */}
                    <div class="purchased-item-image-reviews w-[110px] border border-blue-400">
                        <div class="purchased-item-image w-fit">
                        { post.image_url ? (
                            <img
                                src={ post.image_url }
                                alt={
                                    post.image_urls?.split(",")[0]
                                        ? "User Image"
                                        : "No image"
                                }
                                class="h-full w-full rounded-lg bg-background1 object-cover dark:bg-icon1-DM"
                            />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="110px"
                                height="110px"
                                viewBox="35 0 186 256"
                                id="Flat"
                                class="fill-icon1 dark:fill-icon1-DM border border-border1 dark:border-border1-DM rounded"
                            >
                                <path d="M208,36H48A12.01312,12.01312,0,0,0,36,48V208a12.01312,12.01312,0,0,0,12,12H208a12.01312,12.01312,0,0,0,12-12V48A12.01312,12.01312,0,0,0,208,36Zm4,172a4.004,4.004,0,0,1-4,4H48a4.004,4.004,0,0,1-4-4V177.65631l33.17187-33.171a4.00208,4.00208,0,0,1,5.65723,0l20.68652,20.68652a12.011,12.011,0,0,0,16.96973,0l44.68652-44.68652a4.00208,4.00208,0,0,1,5.65723,0L212,161.65625Zm0-57.65625L176.48535,114.8291a11.99916,11.99916,0,0,0-16.96973,0L114.8291,159.51562a4.00681,4.00681,0,0,1-5.65723,0L88.48535,138.8291a12.01009,12.01009,0,0,0-16.96973,0L44,166.34393V48a4.004,4.004,0,0,1,4-4H208a4.004,4.004,0,0,1,4,4ZM108.001,92v.00195a8.001,8.001,0,1,1,0-.00195Z" />
                            </svg>
                        )}
                        </div>

                        <div 
                            id="user-profile-ratings-div" 
                            class="purchased-item-stars flex justify-between items-center w-full"
                            
                        >
                            <span id="user-rating-5" class="flex justify-center items-center" onClick={ (e) => ratePurchase(e) }>☆</span>
                            <span id="user-rating-4" class="" onClick={ (e) => ratePurchase(e) }>☆</span>
                            <span id="user-rating-3" class="" onClick={ (e) => ratePurchase(e) }>☆</span>
                            <span id="user-rating-2" class="" onClick={ (e) => ratePurchase(e) }>☆</span>
                            <span id="user-rating-1" class="" onClick={ (e) => ratePurchase(e) }>☆</span>
                        </div>
                    </div>
                    
                    <div class="purchased-item-text-buttons border border-red-400 w-full ml-2">
                        <a href={`/${ lang }/posts/${ post.id }`}><h1 class="font-bold line-clamp-2">{ post.title }</h1></a>
                        <div class="flex justify-between w-full my-1">
                            <a href={ `/${ lang }/provider/${ post.seller_id }`}><p class="text-xs font-light truncate">{ post.seller_name }</p></a>
                            <button 
                                class="w-1/3 bg-btn1 dark:btn1-DM rounded-full flex justify-center items-center text-ptext2 dark:text-ptext2-DM mr-0.5"
                                onClick={ follow }
                            >
                                <svg
                                    width="12px"
                                    height="12px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    class="mx-0.5"
                                >
                                    <circle
                                        cx="9"
                                        cy="7"
                                        r="4"
                                        stroke="none"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="stroke-icon2 dark:stroke-icon2-DM"
                                    />
                                    <path
                                        d="M2 21V17C2 15.8954 2.89543 15 4 15H14C15.1046 15 16 15.8954 16 17V21"
                                        stroke="none"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="stroke-icon2 dark:stroke-icon2-DM"
                                    />
                                    <path
                                        d="M19 8V14M16 11H22"
                                        stroke="none"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="stroke-icon2 dark:stroke-icon2-DM"
                                    />
                                </svg>
                                <p class="text-[10px] mx-0.5">{t("buttons.follow")}</p>
                            </button>
                        </div>

                        <div class="mt-4 mb-2">
                            <div class="flex mb-1">
                                <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="none" viewBox="0 0 24 24" aria-hidden="true" class="h-4 w-6 -ml-1 fill-icon2 dark:fill-icon2-DM stroke-icon1 dark:stroke-icon1-DM">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"></path>
                                </svg>
                                <p class="text-xs font-light">{t("menus.purchased")} &nbsp </p>
                                <p class="text-xs font-light">{ orderDate().slice(0, 10) }</p>
                            </div>

                            <div class="flex">
                                <svg x="0px" y="0px" viewBox="0 0 50 50" class="fill-icon1 dark:fill-icon1-DM h-4 w-4 mr-1"> 
                                    <path d="M 25 5 C 13.964844 5 5 13.964844 5 25 C 4.996094 25.359375 5.183594 25.695313 5.496094 25.878906 C 5.808594 26.058594 6.191406 26.058594 6.503906 25.878906 C 6.816406 25.695313 7.003906 25.359375 7 25 C 7 15.046875 15.046875 7 25 7 C 31.246094 7 36.726563 10.179688 39.957031 15 L 33 15 C 32.640625 14.996094 32.304688 15.183594 32.121094 15.496094 C 31.941406 15.808594 31.941406 16.191406 32.121094 16.503906 C 32.304688 16.816406 32.640625 17.003906 33 17 L 43 17 L 43 7 C 43.003906 6.730469 42.898438 6.46875 42.707031 6.277344 C 42.515625 6.085938 42.253906 5.980469 41.984375 5.984375 C 41.433594 5.996094 40.992188 6.449219 41 7 L 41 13.011719 C 37.347656 8.148438 31.539063 5 25 5 Z M 43.984375 23.984375 C 43.433594 23.996094 42.992188 24.449219 43 25 C 43 34.953125 34.953125 43 25 43 C 18.753906 43 13.269531 39.820313 10.042969 35 L 17 35 C 17.359375 35.007813 17.695313 34.816406 17.878906 34.507813 C 18.058594 34.195313 18.058594 33.808594 17.878906 33.496094 C 17.695313 33.1875 17.359375 32.996094 17 33 L 8.445313 33 C 8.316406 32.976563 8.1875 32.976563 8.058594 33 L 7 33 L 7 43 C 6.996094 43.359375 7.183594 43.695313 7.496094 43.878906 C 7.808594 44.058594 8.191406 44.058594 8.503906 43.878906 C 8.816406 43.695313 9.003906 43.359375 9 43 L 9 36.984375 C 12.648438 41.847656 18.460938 45 25 45 C 36.035156 45 45 36.035156 45 25 C 45.003906 24.730469 44.898438 24.46875 44.707031 24.277344 C 44.515625 24.085938 44.253906 23.980469 43.984375 23.984375 Z"></path> 
                                </svg>
                                <p class="text-xs font-light">{t("menus.updated")} &nbsp</p>
                                <p class="text-xs font-light">{ updatedDate().toISOString().slice(0, 10) }</p>
                            </div>
                            
                        </div>

                        <div class="flex justify-end items-center mr-0.5">
                            <DownloadBtn />
                        </div>
                    </div>

                </div>
            ))}
        </div>
    )
}