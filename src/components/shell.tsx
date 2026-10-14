import { Text, View } from 'react-native'
import { usePathname, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/session'
import { fonts } from '@/theme'
import { BalanceChip, Btn } from '@/components/ui'

// Intestazione: logo, saldo, utente e pulsante Esci.
export function AppHeader() {
  const { username } = useSession()
  const insets = useSafeAreaInsets()
  return (
    <View style={{ backgroundColor: '#3a3a3a', borderBottomWidth: 4, borderBottomColor: '#000', paddingTop: insets.top }}>
      <View style={{ width: '100%', maxWidth: 980, alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: 12 }}>
        <View>
          <Text style={{ fontFamily: fonts.title, fontSize: 22, textShadowColor: '#000', textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 0 }}>
            <Text style={{ color: '#7ed348' }}>Pan</Text>
            <Text style={{ color: '#f7c82b' }}>Ex</Text>
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 18, color: '#c8c8c8', marginTop: 4 }}>Panera Exchange</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {!!username && <Text style={{ fontFamily: fonts.body, fontSize: 21, color: '#c8c8c8' }}>{username}</Text>}
          <BalanceChip />
          <Btn title="Esci" variant="alt" onPress={() => supabase.auth.signOut()} />
        </View>
      </View>
    </View>
  )
}

const TABS = [
  ['/', 'Offerte'],
  ['/richieste', 'Richieste'],
  ['/ordini', 'Ordini'],
  ['/movimenti', 'Movimenti'],
] as const

// Navigazione: in alto su schermi larghi, in basso su telefono.
export function Nav({ bottom }: { bottom?: boolean }) {
  const path = usePathname()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  return (
    <View style={[{ flexDirection: 'row', gap: 8 },
      bottom ? { backgroundColor: '#3a3a3a', borderTopWidth: 4, borderTopColor: '#000', padding: 8, paddingBottom: 8 + insets.bottom }
             : { paddingVertical: 16 }]}>
      {TABS.map(([href, label]) => (
        <View key={href} style={bottom ? { flex: 1 } : undefined}>
          <Btn title={label} variant="alt" full={bottom} active={path === href} onPress={() => router.navigate(href)} />
        </View>
      ))}
    </View>
  )
}
