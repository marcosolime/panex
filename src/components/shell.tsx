import { Text, View, useWindowDimensions } from 'react-native'
import { Link, usePathname, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/session'
import { fonts } from '@/theme'
import { BalanceChip, Btn } from '@/components/ui'
import { OnlineBadge } from '@/components/online-badge'

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
        <View>
          <Logo />
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

// Cuore pixel-art come quelli della barra vita di Minecraft.
const HEART = ['.##.##.', '#o#####', '#######', '.#####.', '..###..', '...#...']
const PX = 2

function PixelHeart() {
  return (
    <View accessibilityLabel="amore" style={{ marginHorizontal: 5 }}>
      {HEART.map((row, y) => (
        <View key={y} style={{ flexDirection: 'row' }}>
          {[...row].map((c, x) => (
            <View key={x} style={{ width: PX, height: PX, backgroundColor: c === '#' ? '#e02b2b' : c === 'o' ? '#ffb3b3' : 'transparent' }} />
          ))}
        </View>
      ))}
    </View>
  )
}

const sign = { fontFamily: fonts.body, fontSize: 17, color: '#a8a8a8', textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0 } as const

// Firma dell'autore, piccola e discreta, pensata per stare su sfondo scuro.
// Su telefono una sola riga breve: il nome stesso fa da link al sito.
const SITE = 'https://marcosolime.github.io/'
const link = { color: '#f7c82b', textDecorationLine: 'underline' } as const

export function Signature() {
  const narrow = useWindowDimensions().width < 500
  const name = <>Marco (<Text style={{ color: '#ff8c1a' }}>Redfox</Text>) Solime</>
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={sign}>{narrow ? 'Con' : 'Realizzato con'}</Text>
      <PixelHeart />
      {narrow ? (
        <Text style={sign} numberOfLines={1}>da <Link href={SITE} target="_blank" style={link}>{name}</Link></Text>
      ) : (
        <Text style={sign}>da {name} · <Link href={SITE} target="_blank" style={link}>marcosolime.github.io</Link></Text>
      )}
    </View>
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
