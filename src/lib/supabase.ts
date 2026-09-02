import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// In dev, warn loudly if the env vars are missing instead of failing silently.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. ' +
      'Create a .env file (see .env.example) with your Supabase project credentials.'
  )
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key'
)

// Whether Supabase is actually configured (vs. running on placeholder values).
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
