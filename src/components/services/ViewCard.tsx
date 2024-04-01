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

export const ViewCard: Component<Props> = (props) => {
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
    <div class="flex justify-center w-full">
      <ul class="md:flex md:flex-wrap md:justify-center md:w-full">
        {newPosts().map((post: any) => (
          <li class="w-[99%]">
            <a href={`/${lang}/posts/${post.id}`}>
              <div class="mb-2 flex flex-col md:flex-row md:justify-start justify-center items-center md:items-start rounded-lg md:h-48 shadow-md shadow-shadow-LM dark:shadow-shadow-DM box-content border border-opacity-25 border-border1 dark:border-border1-DM dark:border-opacity-25 w-full">
                <div class="flex md:w-48 w-full h-80 md:h-48 md:mr-2 items-center justify-center bg-background1 dark:bg-background1-DM rounded-lg">
                  {post.image_url ? (
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="35 0 186 256" id="Flat">
                      <path d="M208,36H48A12.01312,12.01312,0,0,0,36,48V208a12.01312,12.01312,0,0,0,12,12H208a12.01312,12.01312,0,0,0,12-12V48A12.01312,12.01312,0,0,0,208,36Zm4,172a4.004,4.004,0,0,1-4,4H48a4.004,4.004,0,0,1-4-4V177.65631l33.17187-33.171a4.00208,4.00208,0,0,1,5.65723,0l20.68652,20.68652a12.011,12.011,0,0,0,16.96973,0l44.68652-44.68652a4.00208,4.00208,0,0,1,5.65723,0L212,161.65625Zm0-57.65625L176.48535,114.8291a11.99916,11.99916,0,0,0-16.96973,0L114.8291,159.51562a4.00681,4.00681,0,0,1-5.65723,0L88.48535,138.8291a12.01009,12.01009,0,0,0-16.96973,0L44,166.34393V48a4.004,4.004,0,0,1,4-4H208a4.004,4.004,0,0,1,4,4ZM108.001,92v.00195a8.001,8.001,0,1,1,0-.00195Z"/>
                    </svg>
                  )}
                </div>

                <div
                  id="cardContent"
                  class="flex justify-between px-1 pt-1 text-left w-full md:w-5/6 md:h-full"
                >
                  <div class="w-full">
                    <div class="relative col-span-1 w-full flex align-top justify-end">
                      <div class="inline-block">
                        <DeletePostButton
                          id={post.id}
                          userId={post.user_id}
                          postImage={post.image_urls}
                        />
                      </div>
                    </div>

                    <div class="h-1/3">
                      <p class="text-lg font-bold text-ptext1 dark:text-ptext1-DM overflow-hidden max-h-14 col-span-4 pr-4 truncate">
                        {post.title}
                      </p>

                      <div class="flex">
                        { post.seller_img ? (
                          <img
                            src={ post.seller_img }
                            alt="Seller image"
                          />
                        ) : (
                          <svg fill="#000000" width="24px" height="24px" class="rounded-full border-2 border-border1 dark:border-border1-DM mr-1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/></svg>
                          
                        )}
                        <p class="overflow-hidden text-ptext1 font-light dark:text-ptext1-DM text-base mb-1">{post.seller_name}</p>
                      </div>
                    </div>

                    <div class="h-1/3">
                      <p
                        class=" text-ptext1 dark:text-ptext1-DM text-sm max-h-[60px] line-clamp-3 mb-2 pt-0.5 overflow-hidden mr-4 prose dark:prose-invert"
                        innerHTML={post.content}
                      ></p>
                    </div>


                    <div class="details-div flex h-1/3">
                      <div class="text-[10px] w-1/6">
                        <h6>{t("formLabels.subjects")}: </h6>
                        <h6>{t("formLabels.grades")}: </h6>
                        <h6>{t("formLabels.resourceTypes")}: </h6>
                        <h6>{t("formLabels.standards")}: </h6>
                      </div>

                      <div class="text-[10px] w-5/6">
                        <p>English, Language Arts, Reading</p>
                        <p>PreK-1st</p>
                        <p>Worksheets, Activities, Printables</p>
                        <p>1NBT.C.4, K.OA.A.2</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="h-full w-1/4 flex flex-col justify-between items-end pr-1">
                  <div class="price-reviews-div inline-block w-full text-end">
                    <p class="font-bold text-lg">${post.price.toFixed(2)} </p>

                    <div class="reviews-div  w-full flex justify-end text-end items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="12px" height="12px" viewBox="0 0 32 32"><script/><path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/><script/></svg>

                      <p class="text-xs ml-1">4.9 (30.3K)</p>
                    </div>
                  </div>

                  

                  <div class="fileTypes-div flex flex-col w-full items-center justify-end">
                    <div class="w-full flex justify-end items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 28 28" version="1.1">
                        <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="ic_fluent_checkmark_28_filled" fill="#212121" fill-rule="nonzero">
                              <path d="M10.5,19.5857864 L4.20710678,13.2928932 C3.81658249,12.9023689 3.18341751,12.9023689 2.79289322,13.2928932 C2.40236893,13.6834175 2.40236893,14.3165825 2.79289322,14.7071068 L9.79289322,21.7071068 C10.1834175,22.0976311 10.8165825,22.0976311 11.2071068,21.7071068 L25.2071068,7.70710678 C25.5976311,7.31658249 25.5976311,6.68341751 25.2071068,6.29289322 C24.8165825,5.90236893 24.1834175,5.90236893 23.7928932,6.29289322 L10.5,19.5857864 Z" id="🎨-Color">
                              </path>
                            </g>
                          </g>
                      </svg>

                      <p class="text-xs ml-1 my-0.5">File Type 1</p>
                    </div>

                    <div class="w-full flex justify-end items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 28 28" version="1.1">
                        <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="ic_fluent_checkmark_28_filled" fill="#212121" fill-rule="nonzero">
                              <path d="M10.5,19.5857864 L4.20710678,13.2928932 C3.81658249,12.9023689 3.18341751,12.9023689 2.79289322,13.2928932 C2.40236893,13.6834175 2.40236893,14.3165825 2.79289322,14.7071068 L9.79289322,21.7071068 C10.1834175,22.0976311 10.8165825,22.0976311 11.2071068,21.7071068 L25.2071068,7.70710678 C25.5976311,7.31658249 25.5976311,6.68341751 25.2071068,6.29289322 C24.8165825,5.90236893 24.1834175,5.90236893 23.7928932,6.29289322 L10.5,19.5857864 Z" id="🎨-Color">
                              </path>
                            </g>
                          </g>
                      </svg>

                      <p class="text-xs ml-1 my-0.5">Short</p>
                    </div>

                    <div class="w-full flex justify-end items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 28 28" version="1.1">
                        <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="ic_fluent_checkmark_28_filled" fill="#212121" fill-rule="nonzero">
                              <path d="M10.5,19.5857864 L4.20710678,13.2928932 C3.81658249,12.9023689 3.18341751,12.9023689 2.79289322,13.2928932 C2.40236893,13.6834175 2.40236893,14.3165825 2.79289322,14.7071068 L9.79289322,21.7071068 C10.1834175,22.0976311 10.8165825,22.0976311 11.2071068,21.7071068 L25.2071068,7.70710678 C25.5976311,7.31658249 25.5976311,6.68341751 25.2071068,6.29289322 C24.8165825,5.90236893 24.1834175,5.90236893 23.7928932,6.29289322 L10.5,19.5857864 Z" id="🎨-Color">
                              </path>
                            </g>
                          </g>
                      </svg>

                      <p class="text-xs ml-1 my-0.5">Longer File Type</p>
                    </div>
                  </div>

                  <div class="flex flex-col items-end justify-center w-full mb-1">
                    <AddToCart
                      description= {post.title}
                      price={post.price}
                      price_id={post.price_id}
                      product_id={post.product_id}
                      // quantity= {quantity()}
                      quantity={ 1 }
                      buttonClick={resetQuantity}
                    />
                    {/* <Quantity quantity={1} updateQuantity={updateQuantity}/> */}
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
