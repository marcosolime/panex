import { createClient } from '@supabase/supabase-js'
import 'expo-sqlite/localStorage/install'
import 'react-native-url-polyfill/auto'

// URL e chiave pubblica (publishable/anon) del progetto: si trovano in Project Settings → API Keys.
// Sono pubbliche per natura, protette dalle regole RLS. Mai la chiave service_role qui.
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
