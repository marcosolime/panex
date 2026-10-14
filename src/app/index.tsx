import { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Item = { id: string; name: string }

// Schermata di prova: login con email e password, poi lettura della tabella items.
export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    supabase
      .from('items')
      .select('id, name', { count: 'exact' })
      .order('name')
      .limit(10)
      .then(({ data, count, error }) => {
        if (error) setError(error.message)
        else {
          setItems(data ?? [])
          setTotal(count)
        }
      })
  }, [session])

  async function signIn() {
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
  }

  if (!session) {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>PanEx</Text>
        <TextInput style={styles.input} placeholder="Email" autoCapitalize="none"
          keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry
          value={password} onChangeText={setPassword} />
        <Button title="Accedi" onPress={signIn} />
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
    )
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Connessione riuscita</Text>
      <Text>Accesso come {session.user.email}</Text>
      <Text>Item nel catalogo: {total ?? '...'}</Text>
      <FlatList data={items} keyExtractor={(i) => i.id}
        renderItem={({ item }) => <Text>{item.name}</Text>} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button title="Esci" onPress={() => supabase.auth.signOut()} />
    </View>
  )
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 24, paddingTop: 64, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#999', padding: 10 },
  error: { color: 'crimson' },
})
