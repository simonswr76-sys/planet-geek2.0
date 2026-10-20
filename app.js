(() => {
const modal=document.getElementById('game-modal'), close=document.getElementById('close-modal');
let current='racer';
function openGame(game){current=game;window.currentGame=game;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';PlanetGames.launch(game);}
function shut(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';document.getElementById('game-host').innerHTML='';}
document.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.game)));
close.addEventListener('click',shut);modal.addEventListener('click',e=>{if(e.target===modal)shut();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')shut();});
document.getElementById('restart-game').addEventListener('click',()=>{window.currentGame=current;PlanetGames.launch(current);});
const search=document.getElementById('search'),filters=[...document.querySelectorAll('.filter')],cards=[...document.querySelectorAll('.game-card')];
let category='Tous';
function update(){let q=search.value.toLocaleLowerCase('fr');let visible=0;cards.forEach(c=>{let ok=(category==='Tous'||c.dataset.category===category)&&c.dataset.name.toLocaleLowerCase('fr').includes(q);c.hidden=!ok;if(ok)visible++;});document.getElementById('visible-count').textContent=visible;document.getElementById('empty').hidden=visible!==0;}
search.addEventListener('input',update);filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(f=>f.classList.toggle('active',f===b));category=b.dataset.category;update();}));
document.getElementById('year').textContent=new Date().getFullYear();
})();

/* ⭐🏆 Planet Geek : favoris et records locaux */
(() => {
  const FAVORITES_KEY = "planetGeekFavorites";
  const SCORES_KEY = "planetGeekBestScores";

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      alert("La sauvegarde locale est indisponible.");
      return false;
    }
  }

  let favorites = read(FAVORITES_KEY, []);
  let records = read(SCORES_KEY, {});

  if (!Array.isArray(favorites)) favorites = [];
  if (!records || typeof records !== "object" ||
      Array.isArray(records)) records = {};

  const cards = [...document.querySelectorAll(".game-card")];

  // Crée les boutons favoris sur les cartes
  cards.forEach(card => {
    const game = card.dataset.game;
    if (!game) return;

    let button = card.querySelector(".pg-fav-btn");

    if (!button) {
      button = document.createElement("button");
      button.className = "pg-fav-btn";
      button.type = "button";
      button.setAttribute("aria-label", "Ajouter aux favoris");
      button.title = "Ajouter aux favoris";
      button.textContent = "☆";
      card.appendChild(button);
    }

    function refreshButton() {
      const active = favorites.includes(game);
      button.textContent = active ? "★" : "☆";
      button.classList.toggle("is-favorite", active);
      button.title = active
        ? "Retirer des favoris"
        : "Ajouter aux favoris";
      button.setAttribute(
        "aria-label",
        button.title
      );
      card.classList.toggle("is-favorite", active);
    }

    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      favorites = favorites.filter(id => id !== game);

      if (!card.classList.contains("is-favorite")) {
        favorites.push(game);
      }

      if (!write(FAVORITES_KEY, favorites)) return;

      refreshButton();
    });

    refreshButton();
  });

  // Bouton pour afficher uniquement les favoris
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "pg-fav-toggle";
  toggle.textContent = "☆ Afficher mes favoris";
  toggle.setAttribute("aria-pressed", "false");

  const search = document.getElementById("search");
  if (search) {
    search.insertAdjacentElement("afterend", toggle);
  } else {
    document.querySelector(".game-card")?.before(toggle);
  }

  toggle.addEventListener("click", () => {
    const active = document.body.classList.toggle(
      "pg-favorites-only"
    );

    toggle.textContent = active
      ? "← Afficher tous les jeux"
      : "☆ Afficher mes favoris";

    toggle.setAttribute("aria-pressed", String(active));
  });

  // 🏆 Tableau des records
  const section = document.createElement("section");
  section.className = "pg-records";
  section.innerHTML = `
    <h2>🏆 Mes meilleurs scores</h2>
    <ol class="pg-record-list"></ol>
    <p class="pg-record-empty">
      Joue à un jeu pour enregistrer ton premier record.
    </p>
    <button type="button" class="pg-record-reset">
      Effacer mes records
    </button>
  `;

  const footer = document.querySelector("footer");
  (footer || document.querySelector("main") ||
    document.body).before(section);

  function renderRecords() {
    const list = section.querySelector(".pg-record-list");
    const empty = section.querySelector(".pg-record-empty");

    list.replaceChildren();

    const entries = Object.entries(records)
      .filter(([game, score]) =>
        typeof game === "string" &&
        Number.isFinite(score) &&
        score >= 0
      )
      .sort((a, b) => b[1] - a[1]);

    entries.forEach(([game, score]) => {
      const card = cards.find(c => c.dataset.game === game);
      const name = card?.dataset.name || game;
      const li = document.createElement("li");
      li.textContent = `${name} : ${score}`;
      list.appendChild(li);
    });

    empty.hidden = entries.length > 0;
  }

  section.querySelector(".pg-record-reset")
    .addEventListener("click", () => {
      if (!confirm("Effacer tous tes records locaux ?")) return;
      records = {};
      if (write(SCORES_KEY, records)) renderRecords();
    });

  // Fonction appelée par les jeux quand une partie se termine.
  window.PlanetScores = {
    save(game, score) {
      if (typeof game !== "string" ||
          !Number.isFinite(score) || score < 0) return;

      const previous = Number(records[game]) || 0;

      if (score > previous) {
        records[game] = score;

        if (write(SCORES_KEY, records)) {
          renderRecords();
        }
      }
    },

    get(game) {
      return Number(records[game]) || 0;
    }
  };

  renderRecords();
})();
