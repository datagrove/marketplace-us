import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { ViewCard } from "../services/ViewCard";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "@lib/stripe"; 

const lang = getLangFromUrl(new URL(window.location.href));

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.productCategoryInfo.categories;

interface ProviderPost {
  user_id: string;
  content: string;
  id: number;
  //TODO: update this to allow a list of Subjects
  subject: string;
  title: string;
  seller_name: string;
  major_municipality: string;
  image_urls: string;
  price: number;
  price_id: string;
  quantity: number;
  product_id: string;
}

interface Props {
  id: string | undefined;
}

export const ClientViewProviderPosts: Component<Props> = (props) => {
  const [posts, setPosts] = createSignal<Array<ProviderPost>>([]);

  createEffect(async () => {
    const { data, error } = await supabase
      .from("sellerposts")
      .select("*")
      .eq("seller_id", props.id);
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
      }))
      ;
      setPosts(data);
      console.log("Posts")
      console.log(posts())
    }
  });
  return (
    <div class="">
      <ViewCard posts={posts()} />
    </div>
  );
};
