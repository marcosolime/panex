import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { Text, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fonts } from '@/theme'

const ToastContext = createContext<(message: string) => void>(() => {})

// Messaggio breve in basso al centro, come nel prototipo.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const show = useCallback((m: string) => {
    setMessage(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(''), 3500)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      {!!message && (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, zIndex: 50, alignItems: 'center',
          bottom: (width < 700 ? 90 : 16) + insets.bottom }}>
          <View style={{ backgroundColor: '#262626', borderWidth: 3, borderColor: '#f2b705', paddingHorizontal: 14, paddingVertical: 6, maxWidth: '92%' }}>
            <Text style={{ fontFamily: fonts.body, fontSize: 21, color: '#fff', textAlign: 'center' }}>{message}</Text>
          </View>
        </View>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
