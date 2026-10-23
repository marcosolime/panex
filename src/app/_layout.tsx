import { SessionProvider } from '@/lib/session'
import { ToastProvider } from '@/lib/toast'
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p'
import { VT323_400Regular } from '@expo-google-fonts/vt323'
import { useFonts } from 'expo-font'
import { Image } from 'expo-image'
import { Stack } from 'expo-router'
import Head from 'expo-router/head'
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'

export default function RootLayout() {
  const [loaded, error] = useFonts({ VT323_400Regular, PressStart2P_400Regular })
  if (!loaded && !error) return null
  return (
    <SessionProvider>
      <ToastProvider>
        <Head>
          <title>PanEx :: Panera Exchange</title>
        </Head>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: '#1c1c1c' }}>
          <Image source={require('@/assets/images/sfondo.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]} />
          <ThemeProvider value={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: 'transparent' } }}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
          </ThemeProvider>
        </View>
      </ToastProvider>
    </SessionProvider>
  )
}
