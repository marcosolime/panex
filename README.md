# PanEx

App Expo/React Native per scambiare oggetti di gioco usando i Tosi. Gli utenti autenticati possono pubblicare offerte e richieste, aprire e confermare ordini, e consultare saldo e movimenti. L'autenticazione e i dati sono gestiti da Supabase; lo scambio degli oggetti avviene in gioco.

## Avvio

1. Installa le dipendenze con `npm install`.
2. Crea un file `.env` con `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` del progetto Supabase.
3. Avvia l'app con `npm start`. Usa `npm run android`, `npm run ios` o `npm run web` per aprire direttamente una piattaforma.

Le schermate si trovano in `src/app/`. Il client Supabase è in `src/lib/`; le operazioni su annunci e ordini richiedono le relative tabelle e funzioni nel database Supabase.
Prezzi e importi usano `numeric(20,5)` nel database (vedi `database/panex_decimals.sql`); le quantità degli item restano intere. Il client invia prezzi e tassi come stringhe e calcola i totali in unità da 0,00001 Tosi.

## TODOs

- Aggiungi icone per gli utenti (raccogli skin)
- Andamento prezzi singoli items
    Ora sto pensando alla prossima feature da implementare. Si tratta dell'andamento di mercato. Per ogni item venduto, si tiene traccia dell'andamento del prezzo, per esempio l'ultimo prezzo, la media, minimo in vendita ora, richiesta massima ora, e il totale degli scambi per quell'item. Sto pensando a un modo elegante di inserirla nell'app. Per esempio si potrebbe inserire una nuova schermata di andamento, selezionabile attraverso il pulsante 📈 allineato agli altri, di modo che non occupi troppo spazio su schermi piccoli, e la scritta "Andamento" a risoluzioni piu' elevate.

- asset icone title
- articoli: tasto 'modifica'
- categorie?
- utenti online
- !!! ricerca item, barra di scorrimento
- su nuovo articolo, imposta data odierna o passata

- Messaggi buffi in schermata di login
    const LOGIN_QUOTES = [
    "I TOSI VANNO E I TOSI VENGONO",
    "UN TOSI NESSUN TOSI E CENTOMILA TOSI",
    "LO FANNO",
    "ALL'INIZIO ERA PANERA...",
    "LA RAILWAY COMPANY EVADE LE TASSE",
    "FREE CIVANDE",
    "COSBRADO VUOL DIRE QUALITÁ",
    "LE TALPE",
    "...ANCHE LA CENERE",
    "MOSSA KANSAS CITY",
    "PIZZA ICARO: METANFETAMINE E GIARE DEL SECCHIA",
    "DIVERTENTE COME UN AFFARE S.E.R.",
    "I VILLICI NON PROVANO EMOZIONI",
    "AYATOLLAH CITTADINO DI AVALON",
    "STIANO COME KIM",
    "OSAMA BINLADEN fell from a high place",
    "È NERA",
    "DIE BDR SUCHT SOLDATEN",
    "FREE CIVANDE",
    "LA SICUREZZA SUL LAVORO È OPTIONAL",
    "SINDACATI VS CIVANDE",
    "LO FANNO",
    "NOVIZI COME I PARMENSI",
    "BRODO STRINATO AFRO PIUMATO",
    "IL SOLE DELLA PROSPERITÀ CONTINUA A SPLENDERE SU BRASIMOGNE",
    "GLORY TO BDR!",
    "PER OGGI ANCORA NESSUNA MORTE SUL LAVORO A BRASIMOGNE...",
    "/execute at @Vadim8 run summon minecraft:lightning",
    "LE CATENE",
    "ULRICO TE LO DICO",
    "TOSI, VUOI ENTRARE SU PANERA?",
    "JULIAN ASSANGE NELL'AMBASCIATA AVALONENSE",
    "FIRST COME, FIRST SERVE",
    "SOGNO FERROVIE DI NOTTE",
    "MA NON È SUCCESSO NIENTE CRISPO",
    "CRISPO METTI GIORNO CHE QUA SEMBRA LA STAZIONE DI BOLOGNA",
    "VERITÀ PER GIULIO REGENI",
    "IL PIL DI PANERA È DIMINUITO ANCORA...",
    "LA BDR TI IMPONE UNA PAUSA!",
    "LEO HIT THE GROUND TOO HARD",
    "TEMPO DELLE PURGHE A BRASIMOGNE",
    "NIENTE SEGHE A BRASIMOGNE",
    "IL SEMINARIO TI ASPETTA!",
    "LA BDR TI IMPONE DI DORMIRE, DOMANI SI LAVORA!"
    ];



