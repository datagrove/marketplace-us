import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import supabase from "@lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { Quantity } from "@components/common/cart/Quantity";
import { items, setItems } from "@components/common/cart/AddToCartButton";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Item {
  description: string;
  price: number;
  price_id: string;
  quantity: number;
  product_id: string;
}

interface ItemDetails {
  content: string;
  title: string;
  seller_name: string;
  image_urls: string | null;
  price?: number;
  price_id: string;
  quantity?: number;
  product_id: string;
}

interface Props {
  // Define the type for the filterPosts prop
  items: Array<ItemDetails>;
}

export const CartCard: Component<Props> = (props) => {
  const [newItems, setNewItems] = createSignal<Array<ItemDetails>>([]);
  const [quantity, setQuantity] = createSignal<number>(0);

  createEffect(async () => {
    if (props.items) {
      const updatedItems = await Promise.all(
        props.items.map(async (item: any) => {
          item.image_urls
            ? (item.image_url = await downloadImage(
                item.image_urls.split(",")[0]
              ))
            : (item.image_url = null);
          // Set the default quantity to 1 This should be replaced with the quantity from the quantity counter in the future
          // item.quantity = 1;
          return item;
        })
      );

      setNewItems(updatedItems);
    }
  });

  const updateQuantity = async (quantity: number, product_id?: string) => {
    console.log("Card Card Update Quantity")
    setQuantity(quantity);
    if(product_id){
      const updatedItems: Array<ItemDetails> = await Promise.all(
        props.items.map(async (item: ItemDetails) => {
          if (item.product_id === product_id) {
            item.quantity = quantity;
          }
          return item;
        })
      )
      setNewItems(updatedItems);
      console.log("Updated Items: " + updatedItems);
      
      const cartItems: Array<Item> = await Promise.all(
        props.items.map(async (oldItem: ItemDetails) => {
          let item: Item = {description: oldItem.title,
            price: oldItem.price? oldItem.price : 0,
            price_id: oldItem.price_id,
            quantity: oldItem.quantity? oldItem.quantity : 0,
            product_id: oldItem.product_id};
          if (oldItem.product_id === product_id) {
            item.quantity = quantity;
          } 
          return item;
        })
      )

      setItems(cartItems);
      console.log("Cart Store: " + cartItems);
    }
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
        {newItems().map((item: any) => (
          <li class=" w-[99%] py-4 border-b border-border1 dark:border-border1-DM border-opacity-50">
            <div class="mb-2 flex flex-col md:flex-row md:justify-start justify-center items-center md:items-start md:h-full  box-content w-full">
              <div class="flex md:w-48 w-full h-full md:h-full md:mr-2 items-center justify-center bg-background1 dark:bg-background1-DM rounded-lg">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={
                      item.image_urls.split(",")[0] ? "User Image" : "No image"
                    }
                    class="bg-background1 dark:bg-icon1-DM rounded-lg w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    viewBox="0 0 512 512"
                    version="1.1"
                    class="bg-gray-400 fill-logo w-full h-full object-cover"
                  >
                    <g id="Page-1" stroke="none" stroke-width="1">
                      <g id="icon" transform="translate(64.000000, 64.000000)">
                        <path
                          d="M384,1.42108547e-14 L384,384 L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L384,1.42108547e-14 Z M109.226667,142.933333 L42.666,249.881 L42.666,341.333 L341.333,341.333 L341.333,264.746 L277.333333,200.746667 L211.84,266.24 L109.226667,142.933333 Z M245.333333,85.3333333 C227.660221,85.3333333 213.333333,99.6602213 213.333333,117.333333 C213.333333,135.006445 227.660221,149.333333 245.333333,149.333333 C263.006445,149.333333 277.333333,135.006445 277.333333,117.333333 C277.333333,99.6602213 263.006445,85.3333333 245.333333,85.3333333 Z"
                          id="Combined-Shape"
                        ></path>
                      </g>
                    </g>
                  </svg>
                )}
              </div>

              <div
                id="cardContent"
                class="flex justify-between px-1 pt-1 text-left w-full md:w-5/6 md:h-full"
              >
                <div class="w-full h-full border border-yellow-500  grid grid-rows-4 grid-flow-col">
                  <div class="col-span-2">
                    <p class="text-2xl font-bold text-ptext1 dark:text-ptext1-DM overflow-hidden max-h-14 col-span-2 pr-4 truncate">
                      <a href={`/${lang}/posts/${item.id}`}>{item.title}</a>
                    </p>
                  </div>
                  <div class="col-span-2 border border-blue-500">
                    <p class="overflow-hidden text-ptext1 dark:text-ptext1-DM text-base mb-1 row-span-1">
                      <a href={`/${lang}/provider/${item.seller_id}`}>
                        {item.seller_name}
                      </a>
                    </p>
                  </div>
                  <div class="border border-purple-700 row-span-2 col-span-2 flex items-center">
                    <p
                      class=" text-ptext1 dark:text-ptext1-DM text-sm max-h-[60px] line-clamp-3 mb-2 pt-0.5 overflow-hidden mr-4 prose dark:prose-invert"
                      innerHTML={item.content}
                    ></p>
                  </div>
                  <div class="col-span-1 col-start-3 row-span-1 border border-green-500">
                    {/* Quantity */}
                    <Quantity quantity={item.quantity} updateQuantity={updateQuantity} product_id={item.product_id}/>
                  </div>
                  <div class="col-span-1 col-start-4 border border-green-500">
                    {/* Price */}
                  </div>
                  <div class="col-span-1 col-start-4 row-start-4 border border-green-500">
                    {/* Remove All from Cart */}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
