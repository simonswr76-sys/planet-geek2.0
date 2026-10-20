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

/* === MENU PRINCIPAL PLANET GEEK === */
(() => {
  if (document.querySelector(".pg-menu-button")) return;

  const button = document.createElement("button");
  button.className = "pg-menu-button";
  button.type = "button";
  button.setAttribute("aria-label", "Ouvrir le menu");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "pg-main-menu");
  button.innerHTML = "<span></span><span></span><span></span>";

  const menu = document.createElement("nav");
  menu.className = "pg-menu";
  menu.id = "pg-main-menu";
  menu.hidden = true;
  menu.setAttribute("aria-label", "Menu principal");

  menu.innerHTML = `
    <h2>PLANET GEEK</h2>
    <a href="#accueil" data-pg-action="home">🎮 Accueil</a>
    <button type="button" data-pg-action="favorites">⭐ Mes favoris</button>
    <a href="#pg-records">🏆 Meilleurs scores</a>
    <button type="button" data-pg-action="settings">⚙️ Paramètres</button>
  `;

  document.body.append(button, menu);

  function closeMenu() {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Ouvrir le menu");
  }

  button.addEventListener("click", () => {
    const open = menu.hidden;
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? "Fermer le menu" : "Ouvrir le menu"
    );
  });

  menu.addEventListener("click", event => {
    const action = event.target.closest("[data-pg-action]")
      ?.dataset.pgAction;

    if (!action) {
      if (event.target.closest("a")) closeMenu();
      return;
    }

    if (action === "home") {
      document.body.classList.remove("pg-favorites-only");
    }

    if (action === "favorites") {
      const toggle = document.querySelector(".pg-fav-toggle");
      if (toggle) {
        if (!document.body.classList.contains("pg-favorites-only")) {
          toggle.click();
        }
        document.querySelector(".game-card.is-favorite")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        alert("Le système de favoris n'est pas encore installé.");
      }
    }

    if (action === "settings") {
      alert("Paramètres : utilise les réglages de ton navigateur pour le moment.");
    }

    closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      closeMenu();
    }
  });

  const records = document.querySelector(".pg-records");
  if (records) records.id = "pg-records";

  const home = document.querySelector("header");
  if (home && !home.id) home.id = "accueil";
})();

/* === PLANET GEEK : SYSTÈME XP === */
(() => {
  if (window.PlanetXP) return;

  const STORAGE_KEY = "planetGeekProgressV1";

  const BADGES = [
    { id: "first", icon: "🎮", name: "Première partie",
      desc: "Terminer une partie", test: p => p.games >= 1 },
    { id: "five", icon: "🔥", name: "Joueur actif",
      desc: "Terminer 5 parties", test: p => p.games >= 5 },
    { id: "ten", icon: "🏅", name: "Habitué",
      desc: "Terminer 10 parties", test: p => p.games >= 10 },
    { id: "level5", icon: "⭐", name: "Niveau 5",
      desc: "Atteindre le niveau 5", test: p => level(p.xp) >= 5 },
    { id: "xp500", icon: "💎", name: "Collectionneur d'XP",
      desc: "Gagner 500 XP", test: p => p.xp >= 500 }
  ];

  function freshProgress() {
    return { xp: 0, games: 0, badges: [], history: [] };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== "object") return freshProgress();

      return {
        xp: Number.isFinite(saved.xp) && saved.xp >= 0 ? saved.xp : 0,
        games: Number.isInteger(saved.games) && saved.games >= 0
          ? saved.games : 0,
        badges: Array.isArray(saved.badges) ? saved.badges : [],
        history: Array.isArray(saved.history) ? saved.history : []
      };
    } catch {
      return freshProgress();
    }
  }

  let progress = load();

  // Chaque niveau suivant demande 100 XP supplémentaires.
  function level(xp) {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  function xpForLevel(n) {
    return (n - 1) * (n - 1) * 100;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch {
      showNotice("Sauvegarde indisponible dans ce navigateur.");
      return false;
    }
  }

  const panel = document.createElement("section");
  panel.className = "pg-xp-panel";
  panel.innerHTML = `
    <h2>⚡ Ma progression</h2>
    <div class="pg-xp-top">
      <div class="pg-xp-level">Niveau <span data-level>1</span></div>
      <div><strong data-xp>0 XP</strong></div>
    </div>
    <div class="pg-xp-bar" role="progressbar"
      aria-label="Progression vers le prochain niveau"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div class="pg-xp-fill"></div>
    </div>
    <div class="pg-xp-muted" data-next>0 / 100 XP vers le prochain niveau</div>
    <p>Parties terminées : <strong data-games>0</strong></p>
    <h3>🏅 Mes badges</h3>
    <div class="pg-badges"></div>
    <p class="pg-xp-notice" aria-live="polite"></p>
  `;

  const footer = document.querySelector("footer");
  const records = document.querySelector(".pg-records");
  const target = records || footer;

  if (target) target.before(panel);
  else (document.querySelector("main") || document.body).append(panel);

  function showNotice(message) {
    const notice = panel.querySelector(".pg-xp-notice");
    if (notice) notice.textContent = message;
  }

  function render() {
    const currentLevel = level(progress.xp);
    const start = xpForLevel(currentLevel);
    const end = xpForLevel(currentLevel + 1);
    const inside = progress.xp - start;
    const needed = end - start;
    const percent = Math.min(100, inside / needed * 100);

    panel.querySelector("[data-level]").textContent = currentLevel;
    panel.querySelector("[data-xp]").textContent = progress.xp + " XP";
    panel.querySelector("[data-games]").textContent = progress.games;
    panel.querySelector("[data-next]").textContent =
      currentLevel >= 100 ? "Niveau maximum !" :
      `${inside} / ${needed} XP vers le niveau ${currentLevel + 1}`;

    const bar = panel.querySelector(".pg-xp-bar");
    bar.setAttribute("aria-valuenow", Math.round(percent));
    panel.querySelector(".pg-xp-fill").style.width = percent + "%";

    const badgesEl = panel.querySelector(".pg-badges");
    badgesEl.replaceChildren();

    BADGES.forEach(badge => {
      const unlocked = progress.badges.includes(badge.id);
      const item = document.createElement("div");
      item.className = "pg-badge" + (unlocked ? "" : " locked");

      const icon = document.createElement("span");
      icon.className = "pg-badge-icon";
      icon.textContent = badge.icon;

      const name = document.createElement("strong");
      name.textContent = badge.name;

      const desc = document.createElement("div");
      desc.className = "pg-xp-muted";
      desc.textContent = unlocked ? "Débloqué !" : badge.desc;

      item.append(icon, name, desc);
      badgesEl.append(item);
    });
  }

  function checkBadges() {
    const newlyUnlocked = [];

    BADGES.forEach(badge => {
      if (!progress.badges.includes(badge.id) && badge.test(progress)) {
        progress.badges.push(badge.id);
        newlyUnlocked.push(badge.name);
      }
    });

    return newlyUnlocked;
  }

  window.PlanetXP = {
    // À appeler à la fin d'une vraie partie terminée.
    completeGame(gameId, score) {
      if (typeof gameId !== "string" || !gameId.trim()) return;
      if (!Number.isFinite(score) || score < 0) return;

      // Évite de récompenser plusieurs fois la même fin de partie.
      const key = `${gameId}:${Date.now()}:${Math.random()}`;
      progress.games += 1;
      progress.xp += 10;

      progress.history.push({
        game: gameId,
        score: Math.floor(score),
        date: new Date().toISOString()
      });

      // Conserve seulement les 50 dernières parties.
      progress.history = progress.history.slice(-50);

      const unlocked = checkBadges();
      if (!save()) return;

      render();
      showNotice(
        `+10 XP !` +
        (unlocked.length ? " Badge débloqué : " + unlocked.join(", ") : "")
      );
    },

    getProgress() {
      return {
        xp: progress.xp,
        level: level(progress.xp),
        games: progress.games,
        badges: [...progress.badges]
      };
    }
  };

  checkBadges();
  save();
  render();
})();
