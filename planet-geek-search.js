(()=>{
  'use strict';
  const input=document.getElementById('search');
  const panel=document.getElementById('pg-search-results');
  const wrap=input?.closest('.search-wrap');
  if(!input||!panel||!wrap)return;
  const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').trim();
  const cards=[...document.querySelectorAll('#game-grid .game-card')];
  let active=-1,shown=[];
  const close=()=>{panel.hidden=true;panel.innerHTML='';active=-1;input.setAttribute('aria-expanded','false');};
  const open=()=>{panel.hidden=false;input.setAttribute('aria-expanded','true');};
  const choose=card=>{
    if(!card)return;
    const link=card.querySelector('a[href]');
    const play=card.querySelector('[data-game]');
    if(link){window.location.href=link.getAttribute('href');return;}
    close();
    if(play){play.click();return;}
    card.scrollIntoView({behavior:'smooth',block:'center'});
  };
  const render=()=>{
    const q=normalize(input.value);
    if(!q){close();return;}
    const tokens=q.split(/\s+/).filter(Boolean);
    shown=cards.map(card=>{
      const title=card.querySelector('h3')?.textContent?.trim()||card.dataset.name||'Jeu';
      const desc=card.querySelector('.game-info p')?.textContent?.trim()||'';
      const category=card.dataset.category||'Jeu';
      const hay=normalize([title,desc,category,card.dataset.name].join(' '));
      const score=tokens.reduce((n,t)=>n+(hay.includes(t)?1:0),0);
      return {card,title,desc,category,score};
    }).filter(x=>x.score===tokens.length).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title,'fr')).slice(0,7);
    if(!shown.length){panel.innerHTML='<div class="pg-search-empty">Aucun jeu trouvé. Essaie un autre mot.</div>';open();return;}
    panel.innerHTML=shown.map((x,i)=>`<button class="pg-search-result" type="button" role="option" aria-selected="${i===active}" data-index="${i}"><span class="pg-search-result-icon">${x.category==='Course'?'🏁':x.category==='Plateforme'?'⬆':x.category==='Réflexion'?'◇':'✦'}</span><span class="pg-search-result-copy"><strong>${x.title.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</strong><small>${x.desc.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])).slice(0,92)}</small></span><span class="pg-search-result-tag">${x.category}</span><span class="pg-search-result-arrow">↗</span></button>`).join('');
    panel.querySelectorAll('[data-index]').forEach(btn=>btn.addEventListener('click',()=>choose(shown[Number(btn.dataset.index)]?.card)));
    open();
  };
  const setActive=i=>{
    active=Math.max(0,Math.min(i,shown.length-1));
    panel.querySelectorAll('.pg-search-result').forEach((el,n)=>el.setAttribute('aria-selected',String(n===active)));
    panel.querySelectorAll('.pg-search-result')[active]?.scrollIntoView({block:'nearest'});
  };
  input.addEventListener('input',render);
  input.addEventListener('focus',()=>{if(input.value.trim())render();});
  input.addEventListener('keydown',e=>{
    if(panel.hidden)return;
    if(e.key==='ArrowDown'){e.preventDefault();setActive(active+1);}
    else if(e.key==='ArrowUp'){e.preventDefault();setActive(active<0?shown.length-1:active-1);}
    else if(e.key==='Enter'&&shown.length){e.preventDefault();choose(shown[active<0?0:active].card);}
    else if(e.key==='Escape')close();
  });
  document.getElementById('clear-search')?.addEventListener('click',close);
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))close();});
  input.setAttribute('aria-expanded','false');
})();
