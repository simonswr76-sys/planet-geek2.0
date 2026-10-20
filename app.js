(() => {
const modal=document.getElementById('game-modal'), close=document.getElementById('close-modal');
let current='racer';
const XP_KEY='planetGeekProgressV1';
const readXP=()=>{try{return JSON.parse(localStorage.getItem(XP_KEY))||{xp:0,games:0,completed:[]}}catch{return {xp:0,games:0,completed:[]}}};
let xpState=readXP(), claimedThisRound=false;
const levelFor=xp=>Math.floor(Math.sqrt(Math.max(0,xp)/100))+1;
function renderXP(){
 const xp=Math.max(0,Number(xpState.xp)||0),games=Math.max(0,Number(xpState.games)||0),level=levelFor(xp),floor=(level-1)**2*100,next=level**2*100,progress=xp-floor,needed=next-floor;
 document.getElementById('xp-total').textContent=xp+' XP';document.getElementById('xp-level').textContent=level;document.getElementById('xp-games').textContent=games;
 document.getElementById('xp-next-label').textContent='Progression vers le niveau '+(level+1);document.getElementById('xp-progress-text').textContent=progress+' / '+needed+' XP';document.getElementById('xp-progress-fill').style.width=Math.min(100,progress/needed*100)+'%';
 const defs=[['first', 'Première partie',games>=1],['five','5 parties',games>=5],['ten','10 parties',games>=10],['level5','Niveau 5',level>=5],['xp500','500 XP',xp>=500]];
 document.getElementById('xp-badges').innerHTML=defs.map(([id,label,ok])=>'<span class="xp-badge '+(ok?'unlocked':'locked')+'">'+(ok?'✦ ':'🔒 ')+label+(ok?' ✓':'')+'</span>').join('');
}
function saveXP(){localStorage.setItem(XP_KEY,JSON.stringify(xpState));renderXP();}
function claimXP(){if(claimedThisRound){document.getElementById('game-help').textContent='XP déjà récupérée pour cette partie !';return;}xpState.xp=(Number(xpState.xp)||0)+10;xpState.games=(Number(xpState.games)||0)+1;xpState.completed=Array.isArray(xpState.completed)?xpState.completed:[];xpState.completed.push({game:current,date:new Date().toISOString()});claimedThisRound=true;saveXP();document.getElementById('claim-xp').disabled=true;document.getElementById('claim-xp').textContent='✓ XP RÉCUPÉRÉE';document.getElementById('game-help').textContent='+10 XP ajoutés à ton profil !';}
renderXP();
function openGame(game){current=game;claimedThisRound=false;window.currentGame=game;document.getElementById('claim-xp').disabled=false;document.getElementById('claim-xp').textContent='✓ TERMINER LA PARTIE · +10 XP';modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';PlanetGames.launch(game);}
function shut(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';document.getElementById('game-host').innerHTML='';}
document.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.game)));
document.getElementById('claim-xp').addEventListener('click',claimXP);
close.addEventListener('click',shut);modal.addEventListener('click',e=>{if(e.target===modal)shut();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')shut();});
document.getElementById('restart-game').addEventListener('click',()=>{window.currentGame=current;PlanetGames.launch(current);});
const search=document.getElementById('search'),filters=[...document.querySelectorAll('.filter')],cards=[...document.querySelectorAll('.game-card')];
let category='Tous';
function update(){let q=search.value.toLocaleLowerCase('fr');let visible=0;cards.forEach(c=>{let ok=(category==='Tous'||c.dataset.category===category)&&c.dataset.name.toLocaleLowerCase('fr').includes(q);c.hidden=!ok;if(ok)visible++;});document.getElementById('visible-count').textContent=visible;document.getElementById('empty').hidden=visible!==0;}
search.addEventListener('input',update);filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(f=>f.classList.toggle('active',f===b));category=b.dataset.category;update();}));
document.getElementById('year').textContent=new Date().getFullYear();
})();