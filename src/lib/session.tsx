import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type Ctx = {
  session: Session | null
  loading: boolean
  username: string | null
  balance: number | null
  refreshBalance: () => Promise<void>
}

const SessionContext = createContext<Ctx>({
  session: null, loading: true, username: null, balance: null, refreshBalance: async () => {},
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  // La vista balances mostra solo il saldo di chi interroga (grazie alla RLS sul registro).
  const refreshBalance = useCallback(async () => {
    const { data } = await supabase.from('balances').select('balance').maybeSingle()
    setBalance(data?.balance ?? 0)
  }, [])

  useEffect(() => {
    if (!session) {
      setUsername(null)
      setBalance(null)
      return
    }
    refreshBalance()
    supabase.from('profiles').select('username').eq('id', session.user.id).maybeSingle()
      .then(({ data }) => setUsername(data?.username ?? null))
  }, [session, refreshBalance])

  return (
    <SessionContext.Provider value={{ session, loading, username, balance, refreshBalance }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
