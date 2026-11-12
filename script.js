/* ============================================================
   LEGA SERIE H — logica sito
   Gestisce solo navigazione e rendering. I dati veri e propri
   vivono in data.js: per aggiornare punteggi/marcatori/mvp/gk
   modifica SOLO quel file.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- Navigazione tra pagine ---------------- */
  const pagine = document.querySelectorAll(".page");
  const back = document.getElementById("back");

  function vaiA(idPagina){
    pagine.forEach(p => p.classList.remove("attiva"));
    document.getElementById(idPagina).classList.add("attiva");
    back.classList.toggle("mostra", idPagina !== "homepage");
    window.scrollTo(0, 0);
  }

  document.querySelectorAll("[data-target]").forEach(el => {
    el.addEventListener("click", () => vaiA(el.dataset.target));
  });

  back.addEventListener("click", () => vaiA("homepage"));

  /* ---------------- Classifica ---------------- */

  /* ---------------- Utilità ---------------- */

  function esc(t){
    return String(t ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // Una partita è "giocata" solo se hanno entrambi un gol inserito
  // (anche 0). Se manca uno dei due numeri risulta da giocare.
  function giocata(p){
    const valido = v => v !== undefined && v !== null && v !== "" && Number.isFinite(Number(v));
    return valido(p.golCasa) && valido(p.golTrasferta);
  }

  /* ---------------- Classifica automatica (opzionale) ---------------- */

  function classificaDaPartite(){
    const pt = DATA.punteggio || { vittoria: 3, pareggio: 1, sconfitta: 0 };
    const righe = DATA.standings.map(sq => ({ ...sq, punti: 0, vinte: 0, pareggi: 0, perse: 0, dr: 0 }));
    const perNome = Object.fromEntries(righe.map(r => [r.nome, r]));

    (DATA.partite || []).filter(giocata).forEach(p => {
      const casa = perNome[p.casa], tr = perNome[p.trasferta];
      if(!casa || !tr){
        console.warn("Partita ignorata nella classifica: nome squadra non riconosciuto", p);
        return;
      }
      const gc = Number(p.golCasa), gt = Number(p.golTrasferta);
      casa.dr += gc - gt; tr.dr += gt - gc;
      if(gc > gt){ casa.vinte++; casa.punti += pt.vittoria; tr.perse++; tr.punti += pt.sconfitta; }
      else if(gc < gt){ tr.vinte++; tr.punti += pt.vittoria; casa.perse++; casa.punti += pt.sconfitta; }
      else{ casa.pareggi++; tr.pareggi++; casa.punti += pt.pareggio; tr.punti += pt.pareggio; }
    });
    return righe;
  }

  function squadreInClassifica(){
    const righe = DATA.classificaAutomatica ? classificaDaPartite() : [...DATA.standings];
    return righe.sort((a, b) => b.punti - a.punti || b.dr - a.dr);
  }

  /* ---------------- Partite ---------------- */

  let filtroPartite = "tutte";

  function formattaDataPartita(iso, ora){
    if(!iso) return ora || "";
    const d = new Date(iso + "T00:00:00");
    if(isNaN(d)) return ora || "";
    const data = d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
    return ora ? `${data} · ${ora}` : data;
  }

  function cardPartita(p){
    const g = giocata(p);
    const gc = Number(p.golCasa), gt = Number(p.golTrasferta);
    const meta = [formattaDataPartita(p.data, p.ora), p.campo].filter(Boolean).map(esc).join(" · ");
    const centro = g
      ? `<span class="punteggio-partita">${gc}<i>–</i>${gt}</span>`
      : `<span class="punteggio-partita da-giocare">${p.ora ? esc(p.ora) : "vs"}</span>`;
    const badge = p.stato === "rinviata"
      ? `<span class="badge-partita rinviata">Rinviata</span>`
      : (g ? `<span class="badge-partita finale">Finale</span>` : "");
    const dettagli = (p.marcatori || p.mvp) ? `
        <div class="dettagli-partita">
          ${p.marcatori ? `<span><i class="fa-solid fa-futbol"></i> ${esc(p.marcatori)}</span>` : ""}
          ${p.mvp ? `<span><i class="fa-solid fa-star"></i> MVP: ${esc(p.mvp)}</span>` : ""}
        </div>` : "";

    return `
      <article class="card-partita ${g ? "giocata" : ""}">
        <div class="meta-partita"><span>${meta || "Data da definire"}</span>${badge}</div>
        <div class="match-partita">
          <span class="squadra-partita casa ${g && gc > gt ? "vincente" : ""}">${esc(p.casa)}</span>
          ${centro}
          <span class="squadra-partita trasferta ${g && gt > gc ? "vincente" : ""}">${esc(p.trasferta)}</span>
        </div>
        ${dettagli}
      </article>`;
  }

  function renderPartite(){
    const filtri = document.getElementById("partite-filtri");
    const lista = document.getElementById("partite-lista");
    if(!filtri || !lista) return;

    const tutte = DATA.partite || [];
    const nGiocate = tutte.filter(giocata).length;
    const opzioni = [
      ["tutte", "Tutte", tutte.length],
      ["giocate", "Giocate", nGiocate],
      ["da-giocare", "Da giocare", tutte.length - nGiocate]
    ];
    filtri.innerHTML = opzioni.map(([k, l, n]) =>
      `<button type="button" class="chip-partite ${filtroPartite === k ? "attivo" : ""}" data-f="${k}">${l} <span>${n}</span></button>`
    ).join("");
    filtri.querySelectorAll(".chip-partite").forEach(b => {
      b.addEventListener("click", () => { filtroPartite = b.dataset.f; renderPartite(); });
    });

    const elenco = tutte
      .filter(p => filtroPartite === "tutte" || (filtroPartite === "giocate") === giocata(p))
      .sort((a, b) => (a.giornata ?? 0) - (b.giornata ?? 0) || String(a.data || "").localeCompare(String(b.data || "")) || String(a.ora || "").localeCompare(String(b.ora || "")));

    // nei risultati conviene vedere per prime le giornate più recenti
    if(filtroPartite === "giocate") elenco.reverse();

    if(elenco.length === 0){
      lista.innerHTML = `<div class="partite-vuoto"><i class="fa-solid fa-futbol"></i><p>${tutte.length === 0 ? "Nessuna partita in calendario ancora." : "Nessuna partita in questa lista."}</p></div>`;
      return;
    }

    const gruppi = new Map();
    elenco.forEach(p => {
      const k = p.giornata ?? 0;
      if(!gruppi.has(k)) gruppi.set(k, []);
      gruppi.get(k).push(p);
    });

    lista.innerHTML = [...gruppi.entries()].map(([g, ps]) => `
      <section class="blocco-giornata">
        <h3 class="titolo-giornata">${g ? "Giornata " + esc(g) : "Altre partite"}</h3>
        ${ps.map(cardPartita).join("")}
      </section>`).join("");
  }

  function renderClassifica(){
    const corpo = document.getElementById("corpo-classifica");
    if(!corpo) return;

    const squadreOrdinate = squadreInClassifica();

    corpo.innerHTML = squadreOrdinate.map(sq => `
      <tr>
        <td class="cella-squadra">
          <span class="logo-squadra" style="${sq.logo ? `background-image:url('${sq.logo}');background-size:cover;` : ""}"></span>
          ${sq.nome}
        </td>
        <td data-label="PT">${sq.punti}</td>
        <td data-label="W">${sq.vinte}</td>
        <td data-label="T">${sq.pareggi}</td>
        <td data-label="L">${sq.perse}</td>
        <td data-label="MVP">${sq.mvp}</td>
        <td data-label="DR">${sq.dr > 0 ? "+" + sq.dr : sq.dr}</td>
      </tr>
    `).join("");
  }

  /* ---------------- Statistiche (marcatori / mvp / portieri) ---------------- */
  const statConfig = {
    marcatori: { chiaveValore: "gol", etichetta: "gol" },
    mvp: { chiaveValore: "premi", etichetta: "premi" },
    portieri: { chiaveValore: "cleanSheet", etichetta: "clean sheet" }
  };

  function renderStat(tipo){
    const lista = document.getElementById("stat-lista");
    const dati = DATA[tipo] || [];
    const { chiaveValore, etichetta } = statConfig[tipo];

    if(dati.length === 0){
      lista.innerHTML = `<div class="stat-vuoto">Nessun dato disponibile ancora.</div>`;
      return;
    }

    const ordinati = [...dati].sort((a, b) => b[chiaveValore] - a[chiaveValore]);
    const cliccabile = tipo === "marcatori";

    lista.innerHTML = ordinati.map((riga, i) => `
      <div class="stat-riga">
        <span>
          <span class="nome${cliccabile ? " cliccabile" : ""}" ${cliccabile ? `data-nome="${riga.nome}"` : ""}>${riga.nome}</span>
          <span class="squadra">${riga.squadra}</span>
        </span>
        <span class="valore">${riga[chiaveValore]} <small style="color:var(--text-dim);font-weight:400;">${etichetta}</small></span>
      </div>
    `).join("");

    if(cliccabile){
      lista.querySelectorAll(".nome.cliccabile").forEach(el => {
        el.addEventListener("click", () => apriBacheca(el.dataset.nome));
      });
    }
  }

  /* ---------------- Bacheca trofei giocatore ---------------- */
  const bachecaOverlay = document.getElementById("bacheca-overlay");
  const bachecaNome = document.getElementById("bacheca-nome");
  const bachecaSquadra = document.getElementById("bacheca-squadra");
  const bachecaTrofei = document.getElementById("bacheca-trofei");
  const bachecaChiudi = document.getElementById("bacheca-chiudi");

  function apriBacheca(nomeGiocatore){
    const giocatore = DATA.marcatori.find(g => g.nome === nomeGiocatore);
    if(!giocatore) return;

    bachecaNome.textContent = giocatore.nome;
    bachecaSquadra.textContent = giocatore.squadra;

    const trofei = giocatore.trofei || [];
    bachecaTrofei.innerHTML = trofei.length
      ? trofei.map(t => `
          <div class="trofeo">
            <i class="fa-solid fa-trophy"></i>
            <span class="trofeo-numero">${t.numero}</span>
            <span class="trofeo-nome">${t.nome}</span>
          </div>
        `).join("")
      : `<div class="bacheca-vuoto">Nessun trofeo ancora in bacheca.</div>`;

    bachecaOverlay.classList.add("mostra");
    document.body.classList.add("no-scroll");
  }

  function chiudiBacheca(){
    bachecaOverlay.classList.remove("mostra");
    document.body.classList.remove("no-scroll");
  }

  bachecaChiudi.addEventListener("click", chiudiBacheca);
  bachecaOverlay.addEventListener("click", e => {
    if(e.target === bachecaOverlay) chiudiBacheca();
  });
  document.addEventListener("keydown", e => {
    if(e.key === "Escape") chiudiBacheca();
  });

  const tabs = document.querySelectorAll(".stat-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("attivo"));
      tab.classList.add("attivo");
      renderStat(tab.dataset.stat);
    });
  });
  if(tabs.length){
    tabs[0].classList.add("attivo");
    renderStat(tabs[0].dataset.stat);
  }

  /* ---------------- Squadre / formazioni ---------------- */
  function renderSquadre(){
    const contenitore = document.getElementById("squadpage");
    if(!contenitore) return;

    const schede = DATA.squadre.map(sq => `
      <div class="scheda-squadra">
        <h3>${sq.nome}</h3>
        <div class="campo">
          <img src="${sq.formazione}" alt="Formazione ${sq.nome}" loading="lazy">
        </div>
      </div>
    `).join("");

    contenitore.insertAdjacentHTML("beforeend", schede);
  }

  /* ---------------- News (home) ---------------- */
  function renderNews(){
    const lista = document.getElementById("news-lista");
    if(!lista) return;

    const news = DATA.news || [];
    if(news.length === 0){
      lista.innerHTML = `<div class="news-vuoto">Nessuna news al momento.</div>`;
      return;
    }

    const ordinate = [...news].sort((a, b) => new Date(b.data) - new Date(a.data));
    const formattaData = iso => new Date(iso + "T00:00:00").toLocaleDateString("it-IT", {
      day: "numeric", month: "long", year: "numeric"
    });

    lista.innerHTML = ordinate.map(n => `
      <article class="news-card">
        <span class="news-data">${formattaData(n.data)}</span>
        <h3 class="news-titolo">${n.titolo}</h3>
        <p class="news-testo">${n.testo}</p>
      </article>
    `).join("");
  }

  renderPartite();
  renderClassifica();
  renderSquadre();
  renderNews();
});
