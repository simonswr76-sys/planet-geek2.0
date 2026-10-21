/* Planet Geek — grande mise à jour UI. N'utilise que de nouvelles clés localStorage. */
(() => {
  'use strict';
  const FAV_KEY = 'pgFavoritesV2';
  const PREF_KEY = 'pgDisplayPrefsV1';
  const read = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const favorites = new Set(Array.isArray(read(FAV_KEY, [])) ? read(FAV_KEY, []) : []);
  const prefs = Object.assign({ contrast: false, motion: false }, read(PREF_KEY, {}));
  document.documentElement.classList.toggle('pg-high-contrast', !!prefs.contrast);
  document.documentElement.classList.toggle('pg-reduced-motion', !!prefs.motion);

  const toast = document.createElement('div');
  toast.className = 'pg-update-toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  let toastTimer;
  const notify = message => { toast.textContent = message; toast.classList.add('is-visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2300); };

  const cards = [...document.querySelectorAll('.game-card')];
  function updateFavoriteButton(card) {
    const id = card.dataset.game || card.dataset.name || card.querySelector('h3')?.textContent?.trim();
    if (!id) return;
    let button = card.querySelector(':scope > .pg-favorite-btn');
    if (!button) {
      button = document.createElement('button'); button.type = 'button'; button.className = 'pg-favorite-btn';
      button.setAttribute('aria-label', 'Ajouter aux favoris'); button.title = 'Ajouter aux favoris';
      button.addEventListener('click', event => {
        event.preventDefault(); event.stopPropagation();
        const key = card.dataset.game || card.dataset.name || card.querySelector('h3')?.textContent?.trim();
        if (!key) return;
        if (favorites.has(key)) { favorites.delete(key); notify('Retiré de tes favoris'); }
        else { favorites.add(key); notify('Jeu ajouté à tes favoris'); }
        write(FAV_KEY, [...favorites]); refreshFavorites();
      });
      card.appendChild(button);
    }
    const active = favorites.has(id);
    button.textContent = active ? '★' : '☆';
    button.classList.toggle('is-favorite', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Retirer des favoris' : 'Ajouter aux favoris');
    button.title = active ? 'Retirer des favoris' : 'Ajouter aux favoris';
  }
  function refreshFavorites() { cards.forEach(updateFavoriteButton); }
  refreshFavorites();

  const tools = document.createElement('div'); tools.className = 'pg-utility-tools';
  tools.innerHTML = '<button type="button" class="pg-tool-btn" data-pg-action="search" title="Rechercher ( / )" aria-label="Rechercher un jeu">⌕ <span>Rechercher</span></button><button type="button" class="pg-tool-btn" data-pg-action="favorites" title="Voir les jeux favoris" aria-label="Voir les jeux favoris">★ <span>Favoris</span></button><button type="button" class="pg-tool-btn" data-pg-action="settings" title="Options d’affichage" aria-label="Options d’affichage">⚙ <span>Affichage</span></button><button type="button" class="pg-tool-btn pg-top-btn" data-pg-action="top" title="Retour en haut" aria-label="Retour en haut">↑</button>';
  document.body.appendChild(tools);

  const panel = document.createElement('section'); panel.className = 'pg-settings-panel'; panel.hidden = true;
  panel.setAttribute('aria-label', 'Options d’affichage');
  panel.innerHTML = '<div class="pg-settings-head"><strong>Options d’affichage</strong><button type="button" data-pg-close aria-label="Fermer les options">×</button></div><label><input type="checkbox" data-pg-pref="contrast"> Contraste renforcé</label><label><input type="checkbox" data-pg-pref="motion"> Réduire les animations</label><p>Ces préférences sont enregistrées sur cet appareil.</p>';
  document.body.appendChild(panel);
  panel.querySelector('[data-pg-pref="contrast"]').checked = !!prefs.contrast;
  panel.querySelector('[data-pg-pref="motion"]').checked = !!prefs.motion;
  const search = document.getElementById('search');
  const focusSearch = () => { if (search) { search.focus(); search.scrollIntoView({ behavior: prefs.motion ? 'auto' : 'smooth', block: 'center' }); } else notify('La recherche est disponible sur la page Jeux.'); };
  tools.addEventListener('click', event => {
    const button = event.target.closest('[data-pg-action]'); if (!button) return;
    switch (button.dataset.pgAction) {
      case 'search': focusSearch(); break;
      case 'favorites': {
        if (!cards.length) { notify('Les favoris sont visibles dans la page Jeux.'); break; }
        const fav = cards.find(card => favorites.has(card.dataset.game || card.dataset.name || card.querySelector('h3')?.textContent?.trim()));
        if (fav) { fav.scrollIntoView({ behavior: prefs.motion ? 'auto' : 'smooth', block: 'center' }); fav.classList.add('pg-favorite-pulse'); setTimeout(() => fav.classList.remove('pg-favorite-pulse'), 1300); }
        else notify('Ajoute un jeu aux favoris avec ☆ sur sa carte.');
        break;
      }
      case 'settings': panel.hidden = !panel.hidden; if (!panel.hidden) panel.querySelector('input')?.focus(); break;
      case 'top': window.scrollTo({ top: 0, behavior: prefs.motion ? 'auto' : 'smooth' }); break;
    }
  });
  panel.querySelector('[data-pg-close]').addEventListener('click', () => { panel.hidden = true; });
  panel.addEventListener('change', event => {
    const input = event.target.closest('[data-pg-pref]'); if (!input) return;
    prefs[input.dataset.pgPref] = input.checked;
    document.documentElement.classList.toggle('pg-high-contrast', !!prefs.contrast);
    document.documentElement.classList.toggle('pg-reduced-motion', !!prefs.motion);
    write(PREF_KEY, prefs); notify('Préférence enregistrée');
  });
  document.addEventListener('keydown', event => {
    const tag = document.activeElement?.tagName;
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || document.activeElement?.isContentEditable;
    if (event.key === '/' && !typing) { event.preventDefault(); focusSearch(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); focusSearch(); }
    if (event.key === 'Escape') panel.hidden = true;
  });
  // Le bouton Favoris fait défiler vers le prochain favori, sans interférer avec les filtres/recherche existants.
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshFavorites(); });
})();
