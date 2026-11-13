/* ============================================================
   DATI TORNEO — LEGA SERIE H
   ============================================================
   Questo è l'UNICO file che va modificato per aggiornare il sito
   dopo ogni giornata di campionato. Non serve toccare HTML/CSS/JS.

   Come aggiungere/aggiornare dati:
   - CLASSIFICA: modifica i numeri nell'oggetto della squadra
     (punti, vinte, pareggi, perse, mvp, differenza reti "dr").
     Le squadre vengono ordinate automaticamente per punti.
   - MARCATORI / MVP / PORTIERI: aggiungi o modifica le righe
     nelle rispettive liste. Basta copiare una riga e cambiare
     i valori. L'ordine in classifica è automatico (dal più alto).
   - SQUADRE: se cambi il nome del file immagine della formazione,
     aggiornalo qui in "formazione".
   - BACHECA TROFEI: dentro ogni giocatore in "marcatori" c'è un
     array "trofei". Ogni trofeo è { nome: "...", numero: N }.
     Compare cliccando sul nome del giocatore nella lista Marcatori.
     Per aggiungere un trofeo a un giocatore che non ne ha ancora,
     aggiungi semplicemente l'array "trofei" con dentro un oggetto.
   - NEWS: aggiungi una notizia in cima o in fondo all'array "news",
     l'ordine in pagina segue automaticamente la data (più recente
     prima). Formato data: "AAAA-MM-GG".
   ============================================================ */

const DATA = {

  // ---------- CLASSIFICA ----------
  standings: [
    {
      nome: "FCAC",
      logo: "logo1_20261102_212506_0000.png", // opzionale: percorso a un'immagine del logo (es. "loghi/princeps.png")
      punti: 0,
      vinte: 0,
      pareggi: 0,
      perse: 0,
      mvp: 0,
      dr: 0
    },
    {
      nome: "High Sea",
      logo: "",
      punti: 0,
      vinte: 0,
      pareggi: 0,
      perse: 0,
      mvp: 2,
      dr: 0
    }
    // Per aggiungere una nuova squadra, copia uno di questi blocchi
    // e incollalo qui sotto con una virgola prima.
  ],

  // ---------- MARCATORI ----------
  // "trofei" è opzionale: se un giocatore non ha ancora trofei,
  // puoi anche lasciare l'array vuoto [].
  marcatori: [
    {
      nome: "Berardi", squadra: "FCAC", gol: 5,
      trofei: [
        { nome: "Scudetto", numero: 1 },
        { nome: "Pallone D'Oro", numero: 1 }
      ]
    },
    { nome: "Campanale", squadra: "FCAC", gol: 5, trofei: [
      { nome: "Scudetto", numero: 1 }
    ] },
    { nome: "Zaza", squadra: "FCAC", gol: 4, trofei: [
      { nome: "Scudetto", numero: 1 },
      { nome: "MVP Centrocampisti", numero: 1 }
    ] },
    { nome: "Rossano", squadra: "FCAC", gol: 0, trofei: [
      { nome: "Scudetto", numero: 1 }
    ] },
    { nome: "Grosso", squadra: "FCAC", gol: 0, trofei: [] },
    { nome: "La Stella", squadra: "FCAC", gol: 0, trofei: [
      { nome: "Scudetto", numero: 1 }
    ] },
    { nome: "Bovino", squadra: "High Sea", gol: 5, trofei: [
      { nome: "MVP Attaccanti", numero: 1 }
    ] },
    { nome: "Dell'Accio", squadra: "High Sea", gol: 6, trofei: [] },
    { nome: "Capogna", squadra: "High Sea", gol: 6, trofei: [] },
    { nome: "Bacellieri", squadra: "High Sea", gol: 2, trofei: [] },
    { nome: "Chiarulli", squadra: "High Sea", gol: 2, trofei: [
      { nome: "MVP Difensori", numero: 1 }
    ] },
    { nome: "Gallo", squadra: "High Sea", gol: 0, trofei: [
      { nome: "Scudetto", numero: 1 },
      { nome: "Guanto d'Oro", numero: 1 }
    ] }
    // Aggiungi qui i marcatori man mano che segnano.
    // Se un giocatore segna più volte, aumenta semplicemente "gol".
  ],

  // ---------- MVP (numero di premi MVP vinti) ----------
  mvp: [
    { nome: "Bovino", squadra: "High Sea", premi: 1 },
    { nome: "Chiarulli", squadra: "High Sea", premi: 1 }
    // Aggiungi qui i giocatori che vincono il premio MVP di giornata.
  ],

  // ---------- PORTIERI (es. clean sheet / gol subiti) ----------
  portieri: [
    { nome: "La Stella", squadra: "FCAC", cleanSheet: 0, golSubiti: 22 },
    { nome: "Gallo", squadra: "High Sea", cleanSheet: 0, golSubiti: 15 }
    // Aggiorna dopo ogni partita.
  ],

  // ---------- PUNTEGGIO (usato solo se classificaAutomatica è true) ----------
  punteggio: { vittoria: 3, pareggio: 1, sconfitta: 0 },

  // Se true, vinte/pareggi/perse/punti/DR della CLASSIFICA vengono
  // ricalcolati dalle partite giocate qui sotto (i numeri scritti a mano
  // in "standings" vengono ignorati, tranne "mvp" che resta manuale).
  // Se false, la classifica resta quella scritta a mano in "standings".
  classificaAutomatica: true,

  // ---------- PARTITE ----------
  // Una riga per partita. Campi:
  //   giornata    numero della giornata (serve per raggruppare)
  //   data, ora   "AAAA-MM-GG" e "HH:MM" (facoltativi)
  //   campo       dove si gioca (facoltativo)
  //   casa, trasferta   nomi ESATTAMENTE come in "standings"
  //   golCasa, golTrasferta   il risultato: se mancano = da giocare
  //   marcatori   testo libero, es. "Berardi 2, Bovino" (facoltativo)
  //   mvp         nome del giocatore MVP della partita (facoltativo)
  //   stato       "rinviata" per segnalare un rinvio (facoltativo)
  //
  // Esempi (copia, incolla e modifica):
  //   { giornata: 1, data: "2026-09-12", ora: "15:00", campo: "Campo 1",
  //     casa: "Princeps", trasferta: "High Sea",
  //     golCasa: 2, golTrasferta: 1, marcatori: "Berardi 2, Bovino", mvp: "Berardi" },
  //   { giornata: 2, data: "2026-09-19", ora: "15:00", campo: "Campo 1",
  //     casa: "High Sea", trasferta: "Princeps" },
  partite: [
      { giornata: 1, data: "2026-11-06", ora: "11:00", campo: "T.Stadium",
       casa: "FCAC", trasferta: "High Sea",
       golCasa: 8, golTrasferta: 9, marcatori: "Berardi 2, Bovino 2, Campanale 4, Zaza, Dell'Accio, Bacellieri, Capogna 4, Autogoal", mvp: "Bovino" },
     { giornata: 2, data: "2026-11-10", ora: "10:00", campo: "T.Stadium",
       casa: "High Sea", trasferta: "FCAC",
       golCasa: 6, golTrasferta: 3, marcatori: "Berardi, Bovino, Campanale, Zaza, Dell'Accio 2, Bacellieri, Capogna, Chiarulli", mvp: "Chiarulli" },
     { giornata: 3, data: "2026-11-13", ora: "11:00", campo: "T.Stadium",
       casa: "FCAC", trasferta: "High Sea",
       golCasa: 4, golTrasferta: 7, marcatori: "Dell'Accio 3, Bovino 2, Capogna, Chiarulli, Berardi 2, Zaza 2", mvp: "?" }
  ],
   
  // ---------- FORMAZIONI SQUADRE ----------
  squadre: [
    { nome: "FCAC", formazione: "linepu_princeps.png" },
    { nome: "High Sea", formazione: "lineup_highsea.png" }
    // Per aggiungere una squadra, aggiungi qui nome + nome file immagine.
  ],

  // ---------- NEWS (pagina iniziale) ----------
  // Aggiungi una notizia copiando un blocco. Compaiono in home
  // ordinate dalla più recente, non serve tenerle in ordine qui.
  news: [
    {
      data: "2026-11-06",
      titolo: "Prima di campionato!",
      testo: "Si chiude con un 9-8 la prima di campionato!"
    },
    {
      data: "2026-11-10",
      titolo: "Ancora loro!",
      testo: "Altra prestazione convincente degli High Sea che battono 6-3 gli avversari al T.Stadium! Importante nella vittoria è l'apporto difensivo dell'mvp Chiarulli!"
    }
    // { data: "AAAA-MM-GG", titolo: "...", testo: "..." },
  ]
};
