# PanEx

App Expo/React Native per scambiare oggetti di gioco usando i Tosi. Gli utenti autenticati possono pubblicare offerte e richieste, aprire e confermare ordini, e consultare saldo e movimenti. L'autenticazione e i dati sono gestiti da Supabase; lo scambio degli oggetti avviene in gioco.

## Avvio

1. Installa le dipendenze con `npm install`.
2. Crea un file `.env` con `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` del progetto Supabase.
3. Avvia l'app con `npm start`. Usa `npm run android`, `npm run ios` o `npm run web` per aprire direttamente una piattaforma.

Le schermate si trovano in `src/app/`. Il client Supabase è in `src/lib/`; le operazioni su annunci e ordini richiedono le relative tabelle e funzioni nel database Supabase.
