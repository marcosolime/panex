import { useCallback, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/session'
import { useToast } from '@/lib/toast'
import { useTheme } from '@/theme'
import { fmtDate } from '@/lib/format'
import { Badge, Btn, Card, Grid, ItemIcon, Txt, fmt } from '@/components/ui'
import { ConfirmDialog } from '@/components/dialogs'

type Order = {
  id: string; quantity: number; unit_price: number; status: 'pending' | 'completed' | 'cancelled'
  created_at: string; buyer_id: string; seller_id: string; item_id: string
  items: { name: string } | null; buyer: { username: string } | null; seller: { username: string } | null
}
type Pending = { order: Order; type: 'confirm' | 'cancel' }

const STATUS = { pending: 'In attesa', completed: 'Concluso', cancelled: 'Annullato' } as const
const TONE = { pending: 'gold', completed: 'green', cancelled: 'gray' } as const

export default function Ordini() {
  const { session, refreshBalance } = useSession()
  const toast = useToast()
  const t = useTheme()
  const me = session?.user.id
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')
  const [action, setAction] = useState<Pending | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id, quantity, unit_price, status, created_at, buyer_id, seller_id, item_id, items(name), buyer:profiles!buyer_id(username), seller:profiles!seller_id(username)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else {
      setError('')
      setOrders((data ?? []) as unknown as Order[])
    }
  }, [])

  useFocusEffect(useCallback(() => { load() }, [load]))

  const todo = useMemo(() => orders.filter((o) => o.status === 'pending'), [orders])
  const done = useMemo(() => orders.filter((o) => o.status !== 'pending'), [orders])

  async function run() {
    if (!action) return
    setBusy(true)
    setErr('')
    const fn = action.type === 'confirm' ? 'confirm_order' : 'cancel_order'
    const { error } = await supabase.rpc(fn, { p_order_id: action.order.id })
    setBusy(false)
    if (error) return setErr(error.message)
    setAction(null)
    toast(action.type === 'confirm'
      ? `Scambio concluso: ${fmt(action.order.quantity * action.order.unit_price)} Tosi a ${action.order.seller?.username}.`
      : 'Ordine annullato.')
    await refreshBalance()
    load()
  }

  function dialogText(a: Pending) {
    const o = a.order
    const total = fmt(o.quantity * o.unit_price)
    if (a.type === 'confirm') return `Confermi di aver ricevuto ${o.quantity} ${o.items?.name ?? o.item_id}? I ${total} Tosi andranno a ${o.seller?.username}. Non si può annullare.`
    return o.buyer_id === me
      ? `L'ordine verrà annullato e i ${total} Tosi ti verranno restituiti.`
      : `L'ordine verrà annullato e i ${total} Tosi torneranno a ${o.buyer?.username}.`
  }

  function card(o: Order) {
    const buyer = o.buyer_id === me
    const name = o.items?.name ?? o.item_id
    return (
      <Card>
        <View style={s.row}>
          <ItemIcon name={name} />
          <View style={{ flex: 1 }}>
            <Txt variant="title">{o.quantity} × {name}</Txt>
            <Txt variant="muted">{buyer ? `Acquisto da ${o.seller?.username}` : `Vendita a ${o.buyer?.username}`} · {fmtDate(o.created_at)}</Txt>
          </View>
        </View>
        <Txt variant="price" style={{ marginTop: 8 }}>{fmt(o.quantity * o.unit_price)} Tosi</Txt>
        {o.status === 'pending' && (
          <Txt style={{ marginTop: 4 }}>
            {buyer ? `Aspetta la consegna da ${o.seller?.username} in gioco, poi premi Ricevuto.`
              : `Consegna ${o.quantity} ${name} a ${o.buyer?.username} in gioco.`}
          </Txt>
        )}
        <View style={[s.row, { marginTop: 10 }]}>
          <Badge text={STATUS[o.status]} tone={TONE[o.status]} />
          {o.status === 'pending' && buyer && <Btn title="Ricevuto" onPress={() => { setErr(''); setAction({ order: o, type: 'confirm' }) }} />}
          {o.status === 'pending' && <Btn title="Annulla" variant="danger" onPress={() => { setErr(''); setAction({ order: o, type: 'cancel' }) }} />}
        </View>
      </Card>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ padding: 14, gap: 14 }}>
        <Txt variant="muted">I Tosi restano bloccati finché il compratore non preme Ricevuto, dopo lo scambio in gioco.</Txt>
        {!!error && <Txt variant="error">{error}</Txt>}
        <Txt variant="title">Da fare</Txt>
        {todo.length === 0 ? <Txt>Niente da fare per ora.</Txt> : <Grid data={todo} keyOf={(o) => o.id} render={card} />}
        <Txt variant="title" style={{ marginTop: 8 }}>Conclusi</Txt>
        {done.length === 0 ? <Txt>Nessun ordine concluso.</Txt> : <Grid data={done} keyOf={(o) => o.id} render={card} />}
      </ScrollView>
      {action && (
        <ConfirmDialog
          title={action.type === 'confirm' ? 'Confermi la ricezione?' : "Annullare l'ordine?"}
          text={dialogText(action)} confirmLabel={action.type === 'confirm' ? 'Ricevuto' : 'Annulla ordine'}
          danger={action.type === 'cancel'} busy={busy} error={err} onConfirm={run} onClose={() => setAction(null)} />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
})
