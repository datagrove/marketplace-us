import { Component, createEffect, createSignal } from "solid-js";
import { ViewCard } from "../services/ViewCard";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";

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

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewProviderPosts: Component = () => {
  const [posts, setPosts] = createSignal<Array<ProviderPost>>([]);
  const [session, setSession] = createSignal<AuthSession | null>(null);

  if (UserError) {
    console.log("User Error: " + UserError.message);
  } else {
    setSession(User.session);
    console.log(User);
  }

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
