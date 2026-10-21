/* Planet Geek — récompense de connexion quotidienne + navigation */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const read = (key, fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const page = document.body.dataset.page || 'accueil';
  const navLinks = [...document.querySelectorAll('#quick-dock a')];
  const hrefByPage = {accueil:'index.html',jeux:'jeux.html',profil:'profil.html',boutique:'boutique.html',casier:'casier.html',pass:'pass.html',arene:'arene.html',stats:'stats.html'};
  navLinks.forEach(a => {
    const target = Object.entries(hrefByPage).find(([,href]) => a.getAttribute('href') === href);
    if (target && target[0] === page) a.setAttribute('aria-current','page');
  });
  const dayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };
  const pageSection = document.getElementById('lobby');
  if (pageSection && !document.getElementById('daily-login-card')) {
    const card = document.createElement('section');
    card.className = 'daily-login-card';
    card.id = 'daily-login-card';
    card.innerHTML = `
      <div class="daily-login-head">
        <div><div class="daily-login-title">RÉCOMPENSE QUOTIDIENNE</div>
        <div class="daily-login-sub">Connecte-toi chaque jour pour gagner des pièces PG et de l'XP.</div></div>
        <div class="daily-login-reward" id="daily-streak">Série : 0 jour(s)</div>
      </div>
      <div class="daily-login-rewards"><span class="daily-login-reward">+25 ◈ pièces PG</span><span class="daily-login-reward">+50 XP</span><span class="daily-login-reward">Bonus de série jusqu'à +100 ◈</span></div>
      <button class="daily-login-btn" id="claim-daily-login" type="button">Récupérer ma récompense</button>
      <p class="daily-login-status" id="daily-login-status" aria-live="polite"></p>`;
    const first = pageSection.firstElementChild;
    if (first) pageSection.insertBefore(card, first); else pageSection.appendChild(card);
    const state = read('planetGeekDailyLoginV1', {lastDay:'', streak:0});
    const today = dayKey();
    const yesterdayDate = new Date(); yesterdayDate.setDate(yesterdayDate.getDate()-1);
    const yesterday = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth()+1).padStart(2,'0')}-${String(yesterdayDate.getDate()).padStart(2,'0')}`;
    const streak = state.lastDay === today ? Math.max(1, Number(state.streak)||1) : state.lastDay === yesterday ? (Number(state.streak)||0)+1 : 0;
    $('#daily-streak').textContent = `Série : ${streak} jour(s)`;
    const btn = $('#claim-daily-login'), status = $('#daily-login-status');
    if (state.lastDay === today) {
      btn.disabled = true; btn.textContent = '✓ Récompense déjà récupérée';
      status.textContent = 'Reviens demain pour ta prochaine récompense.';
    } else {
      status.textContent = 'Ta récompense du jour est prête.';
      btn.addEventListener('click', () => {
        const fresh = read('planetGeekDailyLoginV1', {lastDay:'', streak:0});
        if (fresh.lastDay === today) { btn.disabled=true; status.textContent='Récompense déjà récupérée aujourd’hui.'; return; }
        const newStreak = fresh.lastDay === yesterday ? (Number(fresh.streak)||0)+1 : 1;
        const coinKey = 'planetGeekCoinsV1';
        const coins = Math.max(0, Number(localStorage.getItem(coinKey))||0);
        const bonus = Math.min(100, Math.max(0, newStreak-1)*10);
        localStorage.setItem(coinKey, String(coins+25+bonus));
        const xpKey = 'planetGeekProgressV1';
        const xp = read(xpKey, {xp:0,games:0,completed:[]});
        xp.xp = Math.max(0, Number(xp.xp)||0)+50;
        write(xpKey, xp);
        write('planetGeekDailyLoginV1', {lastDay:today, streak:newStreak});
        $('#daily-streak').textContent = `Série : ${newStreak} jour(s)`;
        btn.disabled = true; btn.textContent = '✓ Récompense récupérée';
        status.textContent = `+${25+bonus} pièces PG et +50 XP ajoutés ! Recharge la page pour actualiser tous les compteurs.`;
      });
    }
  }
  // Keep links for the special 3D game available from the game catalogue.
  document.querySelectorAll('a[href="#vol-un-oeuf"],a[href="vol-un-oeuf.html"]').forEach(a => {
    a.setAttribute('href','vol-un-oeuf.html');
  });
})();
