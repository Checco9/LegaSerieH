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
  function renderClassifica(){
    const corpo = document.getElementById("corpo-classifica");
    if(!corpo) return;

    const squadreOrdinate = [...DATA.standings].sort((a, b) => b.punti - a.punti);

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
  }

  function chiudiBacheca(){
    bachecaOverlay.classList.remove("mostra");
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

  renderClassifica();
  renderSquadre();
  renderNews();
});
