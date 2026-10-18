import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/session'

// Chi è online adesso: nickname in ordine alfabetico. Gestito da Supabase Realtime Presence,
// niente tabelle: chi chiude l'app o perde la connessione sparisce da solo dopo pochi secondi.
const PresenceContext = createContext<{ online: string[] }>({ online: [] })

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { session, username } = useSession()
  // L'elenco è legato all'utente che l'ha ricevuto: cambiando account non resta quello vecchio.
  const [state, setState] = useState<{ uid: string; names: string[] } | null>(null)
  const uid = session?.user.id
  const online = state && state.uid === uid && username ? state.names : []

  useEffect(() => {
    if (!uid || !username) return
    // La chiave è l'id utente: più schede o dispositivi dello stesso utente contano come uno.
    const channel = supabase.channel('online', { config: { presence: { key: uid } } })
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<{ username: string }>()
        const names = Object.values(state)
          .map((metas) => metas[0]?.username)
          .filter((n): n is string => !!n)
        setState({ uid, names: names.sort((a, b) => a.localeCompare(b)) })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await channel.track({ username })
      })
    return () => { supabase.removeChannel(channel) }
  }, [uid, username])

  return <PresenceContext.Provider value={{ online }}>{children}</PresenceContext.Provider>
}

export const usePresence = () => useContext(PresenceContext)
