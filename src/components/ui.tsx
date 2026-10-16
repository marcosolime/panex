import { useState, type ReactNode } from 'react'
import { Image } from 'expo-image'
import { Pressable, StyleSheet, Text, View, useWindowDimensions, type TextProps, type ViewProps } from 'react-native'
import { fonts, useTheme } from '@/theme'
import { useSession } from '@/lib/session'
import { fmtBalance } from '@/lib/format'
import { supabase } from '@/lib/supabase'

export { fmt, fmtBalance } from '@/lib/format'

type Variant = 'body' | 'muted' | 'title' | 'price' | 'error'

export function Txt({ variant = 'body', style, ...props }: TextProps & { variant?: Variant }) {
  const t = useTheme()
  const color = variant === 'muted' ? t.muted : variant === 'price' ? t.coin : variant === 'error' ? t.red : t.ink
  const font = variant === 'title'
    ? { fontFamily: fonts.title, fontSize: 12, lineHeight: 20 }
    : { fontFamily: fonts.body, fontSize: 22, lineHeight: 26 }
  return <Text style={[{ color }, font, style]} {...props} />
}

export function Btn({ title, onPress, variant = 'primary', disabled, active, full, compact }: {
  title: string; onPress: () => void; variant?: 'primary' | 'alt' | 'danger'; disabled?: boolean; active?: boolean; full?: boolean; compact?: boolean
}) {
  const t = useTheme()
  const bg = variant === 'primary' ? t.green : variant === 'danger' ? t.red : t.soft
  return (
    <Pressable onPress={onPress} disabled={disabled}
      style={({ pressed }) => [s.btnOuter, full && { alignSelf: 'stretch' },
        { borderColor: active ? t.gold : t.line, opacity: disabled ? 0.45 : 1, transform: [{ translateY: pressed ? 1 : 0 }] }]}>
      <View style={[s.btn, { backgroundColor: bg }, compact && { paddingHorizontal: 2 }]}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: compact ? 17 : 21, color: variant === 'alt' ? t.ink : '#fff', textAlign: 'center' }}>{title}</Text>
      </View>
    </Pressable>
  )
}

export function Card({ style, ...props }: ViewProps) {
  const t = useTheme()
  return <View style={[s.card, { backgroundColor: t.panel, borderColor: t.line }, style]} {...props} />
}

export function Badge({ text, tone = 'gold' }: { text: string; tone?: 'gold' | 'green' | 'gray' }) {
  const t = useTheme()
  const bg = tone === 'green' ? '#7ed348' : tone === 'gray' ? '#cfcfcf' : '#f2b705'
  return (
    <View style={[s.badge, { borderColor: t.line, backgroundColor: bg }]}>
      <Text style={{ fontFamily: fonts.body, fontSize: 18, color: '#262626' }}>{text}</Text>
    </View>
  )
}

export function ItemIcon({ id, size = 44 }: { id: string; size?: number }) {
  const [failedId, setFailedId] = useState<string | null>(null)
  const { data: { publicUrl } } = supabase.storage.from('item-icons').getPublicUrl(`icons/${id}.png`)
  return (
    <View style={{ width: size, height: size, padding: 2, backgroundColor: '#373737' }}>
      <View style={{ flex: 1, backgroundColor: '#898989', borderWidth: 2, borderColor: '#f0f0f0' }}>
        {failedId !== id && <Image source={{ uri: publicUrl }} style={{ width: '100%', height: '100%' }}
          contentFit="contain" cachePolicy="memory-disk" onError={() => setFailedId(id)} />}
      </View>
    </View>
  )
}

export function BalanceChip() {
  const { balance } = useSession()
  return (
    <View style={s.chip}>
      <View style={s.coin} />
      <Text style={{ fontFamily: fonts.body, fontSize: 24, color: '#fff' }}>
        {balance === null ? '...' : fmtBalance(balance)} Tosi
      </Text>
    </View>
  )
}

export function Checkbox({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const t = useTheme()
  return (
    <Pressable onPress={() => onChange(!value)} accessibilityRole="checkbox" accessibilityState={{ checked: value }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 26, height: 26, borderWidth: 3, borderColor: t.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        {value && <Text style={{ color: '#262626', fontSize: 20, lineHeight: 22 }}>✓</Text>}
      </View>
      <Txt>{label}</Txt>
    </Pressable>
  )
}

// Menu a tendina semplice: l'elenco si apre sotto il campo.
export function Select<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void
}) {
  const t = useTheme()
  const [open, setOpen] = useState(false)
  const box = [s.select, { borderColor: t.line, backgroundColor: t.panel }]
  return (
    <View style={{ minWidth: 200 }}>
      <Pressable onPress={() => setOpen(!open)} style={box}>
        <Txt>{options.find((o) => o.value === value)?.label}</Txt>
        <Txt>{open ? '⌃' : '⌄'}</Txt>
      </Pressable>
      {open && options.map((o) => (
        <Pressable key={o.value} onPress={() => { onChange(o.value); setOpen(false) }} style={[box, { borderTopWidth: 0 }]}>
          <Txt>{o.label}</Txt>
        </Pressable>
      ))}
    </View>
  )
}

// Numero di colonne in base alla larghezza (schede da almeno 260 punti, massimo 980 di contenuto).
export function useColumns() {
  const { width } = useWindowDimensions()
  const available = Math.min(width, 980) - 28
  return Math.max(1, Math.floor((available + 16) / 276))
}

export function Grid<T>({ data, keyOf, render }: { data: T[]; keyOf: (d: T) => string; render: (d: T) => ReactNode }) {
  const cols = useColumns()
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
      {data.map((d) => (
        <View key={keyOf(d)} style={{ width: `${100 / cols}%`, padding: 8 }}>{render(d)}</View>
      ))}
    </View>
  )
}

const s = StyleSheet.create({
  btnOuter: { borderWidth: 3 },
  btn: { paddingHorizontal: 12, paddingVertical: 4, borderWidth: 3, borderTopColor: 'rgba(255,255,255,0.35)', borderLeftColor: 'rgba(255,255,255,0.35)', borderBottomColor: 'rgba(0,0,0,0.35)', borderRightColor: 'rgba(0,0,0,0.35)' },
  card: { borderWidth: 3, padding: 12, boxShadow: '4px 4px 0px #000' },
  badge: { alignSelf: 'flex-start', borderWidth: 2, paddingHorizontal: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#262626', borderWidth: 3, borderColor: '#000', paddingHorizontal: 10, paddingVertical: 4 },
  coin: { width: 16, height: 16, backgroundColor: '#f2b705', borderWidth: 2, borderColor: '#000' },
  select: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 3, paddingHorizontal: 8, paddingVertical: 4 },
})
