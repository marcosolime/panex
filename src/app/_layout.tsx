import { Stack } from 'expo-router'
import Head from 'expo-router/head'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import { VT323_400Regular } from '@expo-google-fonts/vt323'
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p'
import { SessionProvider } from '@/lib/session'
import { ToastProvider } from '@/lib/toast'

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
        <Stack screenOptions={{ headerShown: false }} />
      </ToastProvider>
    </SessionProvider>
  )
}
