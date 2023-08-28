import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (url, options) => {
      const response = await fetch(url, options);
      return response;
    },
  },
});

addEventListener("fetch", (event) => {
  // @ts-ignore
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request) {
  // Use the Supabase client to make requests to your Supabase project
}
