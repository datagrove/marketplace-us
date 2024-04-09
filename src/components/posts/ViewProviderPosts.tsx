import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { ViewCard } from "../services/ViewCard";
import { MobileViewCard } from "@components/services/MobileViewCard";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "@lib/stripe";

const lang = getLangFromUrl(new URL(window.location.href));

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.productCategoryInfo.categories;

// Define the type for the ProviderPost interface
interface ProviderPost {
  content: string;
  id: number;
  subject: string;
  title: string;
  seller_name: string;
  major_municipality: string;
  user_id: string;
  image_urls: string | null;
  price: number;
  price_id: string;
  quantity: number;
  product_id: string;
  category: string;
}

// Get the user session
const { data: User, error: UserError } = await supabase.auth.getSession();


export const ViewProviderPosts: Component = () => {
  // initialize posts and session
  const [posts, setPosts] = createSignal<Array<ProviderPost>>([]);
  const [session, setSession] = createSignal<AuthSession | null>(null);

  if (UserError) {
    console.log("User Error: " + UserError.message);
  } else {
    setSession(User.session);
  }

  // get posts from supabase that match with the user id and set them to posts. After that render them through ViewCard.
  // if there is a modification to the posts table, the page will refresh and the posts will be updated.
  createEffect(async () => {
    const { data, error } = await supabase
      .from("sellerposts")
      .select("*")
      .eq("user_id", session()!.user.id);
    if (!data) {
      alert("No posts available.");
    }
    if (error) {
      console.log("supabase error: " + error.message);
    } else {
      const newItems = await Promise.all(
        data?.map(async (item) => {
          productCategories.forEach((productCategories) => {
            if (item.product_subject.toString() === productCategories.id) {
              item.subject = productCategories.name;
            }
          });
          delete item.product_subject;

          if (item.price_id !== null) {
            const priceData = await stripe.prices.retrieve(item.price_id);
            item.price = priceData.unit_amount! / 100;
          }
          return item;
        })
      );
      console.log(newItems.map(item => item.price))
      setPosts(newItems);
    }
  });
  return (
    <div class="">
      <div class="hidden md:inline">
        <ViewCard posts={posts()} />
      </div>

      <div class="inline md:hidden">
        <MobileViewCard posts={ posts() } />
      </div>

    </div>
  );
};
