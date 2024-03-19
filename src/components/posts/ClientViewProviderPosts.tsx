import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { ViewCard } from "../services/ViewCard";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.productCategoryInfo.categories;

interface ProviderPost {
  user_id: string;
  content: string;
  id: number;
  category: string;
  title: string;
  seller_name: string;
  major_municipality: string;
  // minor_municipality: string;
  // governing_district: string;
  image_urls: string;
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
      data?.map((item) => {
        productCategories.forEach((productCategories) => {
          if (item.product_category.toString() === productCategories.id) {
            item.category = productCategories.name;
          }
        });
        delete item.product_category;
      });
      setPosts(data);
    }
  });
  return (
    <div class="">
      <ViewCard posts={posts()} />
    </div>
  );
};
