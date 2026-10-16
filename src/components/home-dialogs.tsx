import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { supabase } from '@/lib/supabase'
import { fonts, useTheme } from '@/theme'
import { Btn, Txt } from '@/components/ui'
import { Dialog } from '@/components/dialogs'
import { compareMoney, exceedsTosiLimit, fmt, money, parseTosi } from '@/lib/format'

// Nuovo articolo (solo admin): titolo e testo.
export function ArticleDialog({ onClose, onDone }: { onClose: () => void; onDone: (message: string) => void }) {
  const t = useTheme()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const input = [s.input, { borderColor: t.line, backgroundColor: t.panel, color: t.ink }]

  async function publish() {
    if (!title.trim()) return setErr('Scrivi un titolo.')
    if (!body.trim()) return setErr('Scrivi il testo dell\'articolo.')
    setBusy(true)
    setErr('')
    const { error } = await supabase.rpc('create_article', { p_title: title, p_body: body })
    setBusy(false)
    if (error) return setErr(error.message)
    onDone('Articolo pubblicato.')
  }

  return (
    <Dialog onClose={onClose}>
      <Txt variant="title">Nuovo articolo</Txt>
      <Txt variant="muted">Titolo</Txt>
      <TextInput value={title} onChangeText={setTitle} maxLength={120} placeholder="Titolo" placeholderTextColor={t.muted} style={input} />
      <Txt variant="muted">Testo</Txt>
      <TextInput value={body} onChangeText={setBody} maxLength={5000} multiline numberOfLines={8} textAlignVertical="top"
        placeholder="Scrivi qui l'articolo..." placeholderTextColor={t.muted} style={[input, { minHeight: 180 }]} />
      {!!err && <Txt variant="error">{err}</Txt>}
      <View style={s.row}>
        <Btn title="Annulla" variant="alt" onPress={onClose} />
        <Btn title="Pubblica" onPress={publish} disabled={busy} />
      </View>
    </Dialog>
  )
}

// Modifica dei dati della Banca Centrale Panera (solo admin).
export function BcpDialog({ rate, reserve, onClose, onDone }: {
  rate: string; reserve: number; onClose: () => void; onDone: (message: string) => void
}) {
  const t = useTheme()
  const [r, setR] = useState(money(rate))
  const [v, setV] = useState(String(reserve))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const input = [s.input, { borderColor: t.line, backgroundColor: t.panel, color: t.ink }]
  const parsedRate = parseTosi(r)

  async function save() {
    const reserveN = Number(v)
    if (!parsedRate) return setErr('Inserisci un tasso valido, usando virgola o punto per i decimali.')
    if (compareMoney(parsedRate.value, '0.00001') < 0) return setErr('Il tasso minimo dopo il troncamento è 0,00001.')
    if (exceedsTosiLimit(r, 100000000n)) return setErr('Il tasso massimo è 100.000.000.')
    if (!Number.isInteger(reserveN) || reserveN < 0) return setErr('La riserva deve essere un numero intero, zero o più.')
    setBusy(true)
    setErr('')
    const { error } = await supabase.rpc('update_bcp', { p_rate: parsedRate.value, p_reserve: reserveN })
    setBusy(false)
    if (error) return setErr(error.message)
    onDone('Dati BCP aggiornati.')
  }

  return (
    <Dialog onClose={onClose}>
      <Txt variant="title">Dati BCP</Txt>
      <Txt variant="muted">Tosi per 1 diamante</Txt>
      <TextInput value={r} onChangeText={setR} keyboardType="decimal-pad" style={input} />
      {parsedRate?.truncated && <Txt variant="muted">Verrà salvato come {fmt(parsedRate.value)} Tosi.</Txt>}
      <Txt variant="muted">Riserva totale (diamanti)</Txt>
      <TextInput value={v} onChangeText={setV} keyboardType="number-pad" style={input} />
      {!!err && <Txt variant="error">{err}</Txt>}
      <View style={s.row}>
        <Btn title="Annulla" variant="alt" onPress={onClose} />
        <Btn title="Salva" onPress={save} disabled={busy} />
      </View>
    </Dialog>
  )
}

const s = StyleSheet.create({
  input: { borderWidth: 3, paddingHorizontal: 8, paddingVertical: 4, fontFamily: fonts.body, fontSize: 22 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
})
