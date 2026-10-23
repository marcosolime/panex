import { OnlineBadge } from '@/components/online-badge'
import { BalanceChip, Btn } from '@/components/ui'
import { useSession } from '@/lib/session'
import { supabase } from '@/lib/supabase'
import { fonts } from '@/theme'
import { Image } from 'expo-image'
import { usePathname, useRouter } from 'expo-router'
import { Text, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Logo PanEx: "Pan" verde, "Ex" giallo, ombra nera piena.
export function Logo({ size = 22 }: { size?: number }) {
  return (
    <Text style={{ fontFamily: fonts.title, fontSize: size, textShadowColor: '#000', textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 0 }}>
      <Text style={{ color: '#7ed348' }}>Pan</Text>
      <Text style={{ color: '#f7c82b' }}>Ex</Text>
    </Text>
  )
}

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image
            source={require('@/assets/images/logo.gif')}
            style={{ width: 72, height: 72 }}
            contentFit="contain"
            accessibilityLabel="Logo PanEx"
          />
          <View>
            <Logo />
            <Text style={{ fontFamily: fonts.body, fontSize: 18, color: '#c8c8c8', marginTop: 4 }}>Panera Exchange</Text>
          </View>
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

// Firma dell'autore: una riga grigia e discreta, senza link.
// In VT323 sono circa 190px, quindi sta su una riga anche sui telefoni più stretti.
export function Signature() {
  return (
    <Text style={{ fontFamily: fonts.body, fontSize: 17, color: '#a8a8a8', textAlign: 'center' }}>
      © 2026 Marco Solime · Tokyo
    </Text>
  )
}

// Barra a piè di pagina con la firma, stessa grafica dell'intestazione.
export function Footer() {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ backgroundColor: '#3a3a3a', borderTopWidth: 4, borderTopColor: '#000', paddingTop: 5, paddingHorizontal: 8, paddingBottom: 5 + insets.bottom }}>
      <Signature />
    </View>
  )
}
