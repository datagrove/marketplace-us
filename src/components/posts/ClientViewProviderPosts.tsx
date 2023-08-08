import { Component, createEffect, createSignal } from "solid-js";
import { ViewCard } from "../services/ViewCard";
import { supabase } from "../../lib/supabaseClient";

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

interface Props {
  id: string | undefined;
}

export const ClientViewProviderPosts: Component<Props> = (props) => {
  const [posts, setPosts] = createSignal<Array<ProviderPost>>([]);

  createEffect(async () => {
    const { data, error } = await supabase
      .from("providerposts")
      .select("*")
      .eq("provider_id", props.id);
    if (!data) {
      alert("No posts available.");
    }
    if (error) {
      console.log("supabase error: " + error.message);
    } else {
      setPosts(data);
      console.log("got posts", posts());
    }
  });
  return (
    <div>
      <ViewCard posts={posts()} />
    </div>
  );
};
