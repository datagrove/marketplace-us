import { Component, createEffect, createSignal } from "solid-js";
import { ViewCard } from "../services/ViewCard";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";

interface ProviderPost {
  content: string;
  id: number;
  category: string;
  title: string;
  provider_name: string;
  major_municipality: string;
  minor_municipality: string;
  governing_district: string;
}
const [posts, setPosts] = createSignal<Array<ProviderPost>>([]);
const [currentPosts, setCurrentPosts] = createSignal<Array<ProviderPost>>([]);
const [session, setSession] = createSignal<AuthSession | null>(null);

const { data: User, error: UserError } = await supabase.auth.getSession();
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
    setCurrentPosts(data);
    console.log("got posts", currentPosts());
  }
});

export const DeleteProviderPosts: Component = () => {
  return (
    <div>
      <h1>chau</h1>
      <ViewCard posts={currentPosts()} />
    </div>
  );
};
