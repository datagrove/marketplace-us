import * as Supabase from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env
    .PUBLIC_VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase: Supabase.SupabaseClient = Supabase.createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
        global: {
            //@ts-ignore
            fetch: (...args) => fetch(...args),
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export default supabase;
