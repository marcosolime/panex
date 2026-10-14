import { ActivityIndicator, View, useWindowDimensions } from 'react-native'
import { Redirect, Slot } from 'expo-router'
import { useSession } from '@/lib/session'
import { useTheme } from '@/theme'
import { AppHeader, Nav } from '@/components/shell'

// Area riservata: senza accesso si torna al login. Intestazione e navigazione sono nostre, come nel prototipo.
export default function AppLayout() {
  const { session, loading } = useSession()
  const t = useTheme()
  const { width } = useWindowDimensions()
  if (loading) return <View style={{ flex: 1, backgroundColor: t.bg }}><ActivityIndicator style={{ marginTop: 80 }} /></View>
  if (!session) return <Redirect href="/login" />

  const wide = width >= 700
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader />
      {wide && (
        <View style={{ width: '100%', maxWidth: 980, alignSelf: 'center', paddingHorizontal: 14 }}>
          <Nav />
        </View>
      )}
      <View style={{ flex: 1, width: '100%', maxWidth: 980, alignSelf: 'center' }}>
        <Slot />
      </View>
      {!wide && <Nav bottom />}
    </View>
  )
}
