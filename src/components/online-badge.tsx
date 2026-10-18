import { useEffect, useState } from 'react'
import { Animated, Platform, Pressable, Text, View } from 'react-native'
import { fonts, useTheme } from '@/theme'
import { usePresence } from '@/lib/presence'
import { useSession } from '@/lib/session'
import { Btn, Txt } from '@/components/ui'
import { Dialog } from '@/components/dialogs'

// Lucina verde lampeggiante + "N utenti online". Al tocco mostra chi c'è.
export function OnlineBadge() {
  const { online } = usePresence()
  const { username } = useSession()
  const t = useTheme()
  const [open, setOpen] = useState(false)
  const [blink] = useState(() => new Animated.Value(1))

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(blink, { toValue: 0.25, duration: 900, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(blink, { toValue: 1, duration: 900, useNativeDriver: Platform.OS !== 'web' }),
    ]))
    loop.start()
    return () => loop.stop()
  }, [blink])

  if (online.length === 0) return null
  const label = online.length === 1 ? '1 utente online' : `${online.length} utenti online`

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Animated.View style={{ width: 10, height: 10, backgroundColor: '#7ed348', borderWidth: 2, borderColor: '#000', opacity: blink }} />
        <Text style={{ fontFamily: fonts.body, fontSize: 19, color: '#c8c8c8' }}>{label}</Text>
      </Pressable>
      {open && (
        <Dialog onClose={() => setOpen(false)}>
          <Txt variant="title">{label}</Txt>
          {online.map((n) => (
            <View key={n} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 10, height: 10, backgroundColor: '#7ed348', borderWidth: 2, borderColor: t.line }} />
              <Txt>{n}{n === username ? ' (tu)' : ''}</Txt>
            </View>
          ))}
          <Btn title="Chiudi" variant="alt" onPress={() => setOpen(false)} />
        </Dialog>
      )}
    </>
  )
}
