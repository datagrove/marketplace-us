import { Component, createEffect, createSignal } from "solid-js";
import { ViewCard } from "../services/ViewCard";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject
const productCategories = values.productCategoryInfo.categories

// Define the type for the ProviderPost interface
interface ProviderPost {
  user_id: string;
  content: string;
  id: number;
  category: string;
  title: string;
  provider_name: string;
  major_municipality: string;
  minor_municipality: string;
  governing_district: string;
  image_urls: string;
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
      .from("providerposts")
      .select("*")
      .eq("user_id", session()!.user.id);
    if (!data) {
      alert("No posts available.");
    }
    if (error) {
      console.log("supabase error: " + error.message);
    } else {
      data?.map(item => {
        productCategories.forEach(productCategories => {
          if (item.service_category.toString() === productCategories.id) {
            item.category = productCategories.name
          }
        })
        delete item.service_category
      })
      setPosts(data);
    }
  });
  return (
    <div>
      <ViewCard posts={posts()} />
    </div>
  );
};
