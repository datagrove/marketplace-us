import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_VITE_SUPABASE_LOCAL_URL
const supabaseAnonKey = import.meta.env.PUBLIC_VITE_SUPABASE_LOCAL_ANON_KEY

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: (...args) => fetch(...args),
      },
    auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
})