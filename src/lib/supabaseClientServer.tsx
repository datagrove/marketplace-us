import * as Supabase from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_VITE_SUPABASE_ANON_KEY;

const supabase: Supabase.SupabaseClient = Supabase.createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        global: {
            //@ts-ignore
            fetch: (...args) => fetch(...args),
        },
        auth: {
            storage: undefined,
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    }
);

export default supabase;
