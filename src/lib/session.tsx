import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type Ctx = {
  session: Session | null
  loading: boolean
  username: string | null
  isAdmin: boolean
  balance: string | null
  refreshBalance: () => Promise<void>
}

const SessionContext = createContext<Ctx>({
  session: null, loading: true, username: null, isAdmin: false, balance: null, refreshBalance: async () => {},
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{ userId: string; username: string | null; isAdmin: boolean } | null>(null)
  const [accountBalance, setAccountBalance] = useState<{ userId: string; balance: string } | null>(null)
  const userId = session?.user.id
  const username = profile && profile.userId === userId ? profile.username : null
  const isAdmin = profile && profile.userId === userId ? profile.isAdmin : false
  const balance = accountBalance && accountBalance.userId === userId ? accountBalance.balance : null

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
    if (!userId) return
    const { data } = await supabase.from('balances').select('balance::text').maybeSingle()
    setAccountBalance({ userId, balance: data?.balance ?? '0' })
  }, [userId])

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    supabase.from('balances').select('balance::text').maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setAccountBalance({ userId, balance: data?.balance ?? '0' })
      })
    supabase.from('profiles').select('username, is_admin').eq('id', userId).maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile({ userId, username: data?.username ?? null, isAdmin: !!data?.is_admin })
      })
    return () => { cancelled = true }
  }, [userId])

  return (
    <SessionContext.Provider value={{ session, loading, username, isAdmin, balance, refreshBalance }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
