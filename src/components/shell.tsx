import { Text, View, useWindowDimensions } from 'react-native'
import { usePathname, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/session'
import { fonts } from '@/theme'
import { BalanceChip, Btn } from '@/components/ui'
import { OnlineBadge } from '@/components/online-badge'

// Intestazione: logo, saldo, utente e pulsante Esci.
export function AppHeader() {
  const { username } = useSession()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const narrow = width < 700
  const name = !!username && <Text style={{ fontFamily: fonts.body, fontSize: 21, color: '#c8c8c8' }}>{username}</Text>
  const balanceAndExit = (
    <>
      <BalanceChip />
      <Btn title="Esci" variant="alt" onPress={() => supabase.auth.signOut()} />
    </>
  )
  return (
    <View style={{ backgroundColor: '#3a3a3a', borderBottomWidth: 4, borderBottomColor: '#000', paddingTop: insets.top }}>
      <View style={{ width: '100%', maxWidth: 980, alignSelf: 'center', flexDirection: 'row', alignItems: narrow ? 'flex-start' : 'center',
        justifyContent: 'space-between', flexWrap: narrow ? 'nowrap' : 'wrap', gap: 10, padding: 12 }}>
        <View>
          <Text style={{ fontFamily: fonts.title, fontSize: 22, textShadowColor: '#000', textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 0 }}>
            <Text style={{ color: '#7ed348' }}>Pan</Text>
            <Text style={{ color: '#f7c82b' }}>Ex</Text>
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 18, color: '#c8c8c8', marginTop: 4 }}>Panera Exchange</Text>
        </View>
        {/* Su telefono: saldo ed Esci, poi il nome, poi chi è online, tutto allineato a destra. */}
        <View style={{ alignItems: 'flex-end', gap: 6, flexShrink: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {!narrow && name}
            {balanceAndExit}
          </View>
          {narrow && name}
          <OnlineBadge />
        </View>
      </View>
    </View>
  )
}

const TABS = [
  ['/', 'Home'],
  ['/offerte', 'Offerte'],
  ['/richieste', 'Richieste'],
  ['/ordini', 'Ordini'],
  ['/movimenti', 'Movimenti'],
  ['/andamento', 'Andamento'],
] as const

// Navigazione: in alto su schermi larghi, in basso su telefono.
export function Nav({ bottom }: { bottom?: boolean }) {
  const path = usePathname()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const narrow = width < 600
  const buttons = TABS.map(([href, label]) => (
    <View key={href} style={bottom ? { width: narrow ? '33.333%' : '16.666%', padding: 3 } : undefined}>
      <Btn title={label} accessibilityLabel={label}
        variant="alt" full={bottom} compact={bottom} active={path === href} onPress={() => router.navigate(href)} />
    </View>
  ))
  if (bottom) return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#3a3a3a',
      borderTopWidth: 4, borderTopColor: '#000', padding: 5, paddingBottom: 5 + insets.bottom }}>
      {buttons}
    </View>
  )
  return <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 16 }}>{buttons}</View>
}
