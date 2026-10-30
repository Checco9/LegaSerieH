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
      nome: "Princeps",
      logo: "", // opzionale: percorso a un'immagine del logo (es. "loghi/princeps.png")
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
      mvp: 0,
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
      nome: "Berardi", squadra: "Princeps", gol: 0,
      trofei: [
        { nome: "Scudetto", numero: 1 },
        { nome: "Pallone D'Oro", numero: 1 }
      ]
    },
    { nome: "Campanale", squadra: "Princeps", gol: 0, trofei: [
      { nome: "Scudetto", numero: 1 }
    ] },
    { nome: "Zaza", squadra: "Princeps", gol: 0, trofei: [
      { nome: "Scudetto", numero: 1 },
      { nome: "MVP Centrocampisti", numero: 1 }
    ] },
    { nome: "Rossano", squadra: "Princeps", gol: 0, trofei: [
      { nome: "Scudetto", numero: 1 }
    ] },
    { nome: "Grosso", squadra: "Princeps", gol: 0, trofei: [] },
    { nome: "La Stella", squadra: "Princeps", gol: 0, trofei: [
      { nome: "Scudetto", numero: 1 }
    ] },
    { nome: "Bovino", squadra: "High Sea", gol: 0, trofei: [
      { nome: "MVP Attaccanti", numero: 1 }
    ] },
    { nome: "Dell'Accio", squadra: "High Sea", gol: 0, trofei: [] },
    { nome: "Capogna", squadra: "High Sea", gol: 0, trofei: [] },
    { nome: "Bacellieri", squadra: "High Sea", gol: 0, trofei: [] },
    { nome: "Chiarulli", squadra: "High Sea", gol: 0, trofei: [
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
    { nome: "Rossano", squadra: "Princeps", premi: 0 },
    { nome: "Chiarulli", squadra: "High Sea", premi: 0 }
    // Aggiungi qui i giocatori che vincono il premio MVP di giornata.
  ],

  // ---------- PORTIERI (es. clean sheet / gol subiti) ----------
  portieri: [
    { nome: "La Stella", squadra: "Princeps", cleanSheet: 0, golSubiti: 0 },
    { nome: "Gallo", squadra: "High Sea", cleanSheet: 0, golSubiti: 0 }
    // Aggiorna dopo ogni partita.
  ],

  // ---------- FORMAZIONI SQUADRE ----------
  squadre: [
    { nome: "Princeps", formazione: "linepu_princeps.png" },
    { nome: "High Sea", formazione: "lineup_highsea.png" }
    // Per aggiungere una squadra, aggiungi qui nome + nome file immagine.
  ],

  // ---------- NEWS (pagina iniziale) ----------
  // Aggiungi una notizia copiando un blocco. Compaiono in home
  // ordinate dalla più recente, non serve tenerle in ordine qui.
  news: [
    {
      data: "2026-06-09",
      titolo: "La Commissione ha deciso!",
      testo: "Con il campo appena rinnovato e poche gare giocate, l’annata non sarà conteggiata: il titolo non verrà assegnato per questa stagione."
    },
    {
      data: "2026-10-30",
      titolo: "Il precampionato si è concluso!",
      testo: "Si chiude con un 5-2 la partita di precampionato, le squadre si stanno riorganizzando e si presenteranno ufficialmente in vista della prima di campionato."
    }
    // { data: "AAAA-MM-GG", titolo: "...", testo: "..." },
  ]
};
