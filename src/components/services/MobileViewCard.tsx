import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import { DeletePostButton } from "../posts/DeletePostButton";
import supabase from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { SocialMediaShares } from "../posts/SocialMediaShares";
import SocialModal from "../posts/SocialModal";
import { AddToCart } from "../common/cart/AddToCartButton";
import { Quantity } from "@components/common/cart/Quantity";


const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Post {
  content: string;
  id: number;
  category: string;
  title: string;
  seller_name: string;
  major_municipality: string;
  // minor_municipality: string;
  // governing_district: string;
  user_id: string;
  image_urls: string | null;
  price: number;
  price_id: string;
  quantity: number;
  product_id: string;
}

interface Props {
  // Define the type for the filterPosts prop
  posts: Array<Post>;
}

export const MobileViewCard: Component<Props> = (props) => {
  const [newPosts, setNewPosts] = createSignal<Array<any>>([]);
  const [quantity, setQuantity] = createSignal<number>(1);

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

  return (
    <div>
        { newPosts().map((post: any) => (
            <div class="border-2 border-gray-500 my-4">
                <div class="photo-price border-2 border-blue-400 w-full flex justify-between">
                    { post.image_url ? (
                        <img
                        src={post.image_url}
                        alt={
                            post.image_urls.split(",")[0]
                            ? "User Image"
                            : "No image"
                        }
                        class="bg-background1 dark:bg-icon1-DM rounded-lg w-full h-full object-cover"
                        />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="150px" height="150px" viewBox="35 0 186 256" id="Flat" class="border-2 border-red-300 fill-icon1 dark:fill-icon1-DM">

                        <path d="M208,36H48A12.01312,12.01312,0,0,0,36,48V208a12.01312,12.01312,0,0,0,12,12H208a12.01312,12.01312,0,0,0,12-12V48A12.01312,12.01312,0,0,0,208,36Zm4,172a4.004,4.004,0,0,1-4,4H48a4.004,4.004,0,0,1-4-4V177.65631l33.17187-33.171a4.00208,4.00208,0,0,1,5.65723,0l20.68652,20.68652a12.011,12.011,0,0,0,16.96973,0l44.68652-44.68652a4.00208,4.00208,0,0,1,5.65723,0L212,161.65625Zm0-57.65625L176.48535,114.8291a11.99916,11.99916,0,0,0-16.96973,0L114.8291,159.51562a4.00681,4.00681,0,0,1-5.65723,0L88.48535,138.8291a12.01009,12.01009,0,0,0-16.96973,0L44,166.34393V48a4.004,4.004,0,0,1,4-4H208a4.004,4.004,0,0,1,4,4ZM108.001,92v.00195a8.001,8.001,0,1,1,0-.00195Z"/>
                        </svg>
                    )}

                    <div class="content border-2 border-red-900 w-1/2">
                        <div class="border-2 border-yellow-600 flex items-start justify-end">
                            <div class="price-reviews-div inline-block text-end">
                                <p class="font-bold text-lg">${post.price.toFixed(2)} </p>

                                <div class="reviews-div  w-full flex justify-end text-end items-center">
                                    <svg width="12px" height="12px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM"><script/><path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/><script/></svg>

                                    <p class="text-xs ml-1">4.9 (30.3K)</p>
                                </div>
                            </div>
                        </div>

                        <div class="border-2 border-green-400 flex flex-col items-end justify-end py-1">
                            <h6 class="text-[10px] font-bold">{t("formLabels.subjects")}</h6>
                            <p class="text-[10px] font-light">English Language Arts</p>
                            <p class="text-[10px] font-light">Reading</p>
                        </div>

                        <div class="border-2 border-green-400 flex flex-col items-end justify-end py-1">
                            <h6 class="text-[10px] font-bold">{t("formLabels.grades")}</h6>
                            <p class="text-[10px] font-light">PreK-1st</p>
                        </div>
                    </div>
                </div>
        
                <div class="title-creator mb-1">
                    <div class="flex py-0.5 line-clamp-2">
                        { post.title }
                    </div>

                    <div class="flex items-center">
                        { post.seller_img ? (
                            <img
                            src={ post.seller_img }
                            alt="Seller image"
                            />
                        ) : (
                            <svg width="24px" height="24px" class="h-4 w-4 md:h-auto md:w-auto rounded-full border-2 border-border1 dark:border-border1-DM mr-1 fill-icon1 dark:bg-icon1-DM" viewBox="0 0 32 32"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/></svg>
                            
                        )}
                        <p class="overflow-hidden text-ptext1 font-light dark:text-ptext1-DM text-xs">{post.seller_name}</p>
                    </div>
                
                </div>
        
                <div class="show-more">

        
                </div>
        
                <div class="cart">
        
                </div>
            </div>
        ))}
        
        
    </div>
  );

};