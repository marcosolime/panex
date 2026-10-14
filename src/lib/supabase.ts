import { createClient } from '@supabase/supabase-js'

// Versione web: il browser ha già localStorage, che supabase-js usa da solo
// per salvare la sessione, quindi non servono polyfill né expo-sqlite.
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)