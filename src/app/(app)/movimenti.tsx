import { useCallback, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/session'
import { useTheme } from '@/theme'
import { compareMoney, fmtDate, money, sumMoney } from '@/lib/format'
import { Amount, Card, Grid, Txt, fmt } from '@/components/ui'

type Entry = {
  id: number; amount: string; kind: 'grant' | 'hold' | 'sale' | 'refund'; memo: string | null; created_at: string
  orders: {
    quantity: number; items: { name: string } | null
    buyer: { username: string } | null; seller: { username: string } | null
  } | null
}

function describe(e: Entry): [string, string] {
  const o = e.orders
  const what = o ? `${o.quantity} ${o.items?.name ?? ''}` : ''
  switch (e.kind) {
    case 'grant': return ['Tosi ricevuti', e.memo ?? "Assegnati dall'amministratore"]
    case 'hold': return ['Acquisto', `${what} da ${o?.seller?.username}`]
    case 'sale': return ['Vendita', `${what} a ${o?.buyer?.username}`]
    case 'refund': return ['Rimborso', `${what} da ${o?.seller?.username}`]
  }
}

export default function Movimenti() {
  const { session, balance, refreshBalance } = useSession()
  const t = useTheme()
  const [entries, setEntries] = useState<Entry[]>([])
  const [blocked, setBlocked] = useState('0')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    refreshBalance()
    const ledger = await supabase
      .from('ledger')
      .select('id, amount::text, kind, memo, created_at, orders(quantity, items(name), buyer:profiles!buyer_id(username), seller:profiles!seller_id(username))')
      .order('created_at', { ascending: false })
      .limit(100)
    if (ledger.error) return setError(ledger.error.message)
    setError('')
    setEntries((ledger.data ?? []) as unknown as Entry[])

    // Tosi bloccati: ordini in attesa in cui sono il compratore.
    const pending = await supabase.from('orders').select('quantity, unit_price::text')
      .eq('status', 'pending').eq('buyer_id', session?.user.id ?? '')
    setBlocked(sumMoney((pending.data ?? []).map((o) => money(o.unit_price, o.quantity))))
  }, [refreshBalance, session])

  useFocusEffect(useCallback(() => { load() }, [load]))

  const stats = [
    { key: 'saldo', label: 'Saldo disponibile', value: balance === null ? '...' : fmt(balance), price: true },
    { key: 'bloccati', label: 'Bloccati in acquisti aperti', value: fmt(blocked), price: false },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14, gap: 14 }}>
        <Grid data={stats} keyOf={(x) => x.key} render={(x) => (
          <Card>
            <Txt variant="muted">{x.label}</Txt>
            <Amount variant={x.price ? 'price' : 'body'} style={{ fontSize: 36, lineHeight: 42 }} iconSize={50}>{x.value}</Amount>
          </Card>
        )} />
        {!!error && <Txt variant="error">{error}</Txt>}
        <Txt variant="title">Movimenti</Txt>
        <Card>
          {entries.length === 0 && <Txt variant="muted">Nessun movimento.</Txt>}
          {entries.map((e, i) => {
            const [title, detail] = describe(e)
            return (
              <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8,
                borderBottomWidth: i === entries.length - 1 ? 0 : 2, borderStyle: 'dashed', borderColor: t.soft }}>
                <View style={{ flex: 1 }}>
                  <Txt>{title}</Txt>
                  <Txt variant="muted">{detail} · {fmtDate(e.created_at)}</Txt>
                </View>
                <Txt style={{ color: compareMoney(e.amount, '0') < 0 ? t.red : t.pos }}>{compareMoney(e.amount, '0') > 0 ? '+' : ''}{fmt(e.amount)}</Txt>
              </View>
            )
          })}
        </Card>
      </ScrollView>
    </View>
  )
}
