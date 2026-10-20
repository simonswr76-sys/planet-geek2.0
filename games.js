(() => {
const host = document.getElementById('game-host');
const title = document.getElementById('modal-title');
const help = document.getElementById('game-help');
let cleanup = () => {};
const colors = {cyan:'#4aeaff',pink:'#ff5ac8',purple:'#a78bfa',yellow:'#ffe47a',white:'#f2fbff',red:'#ff6680'};
function canvasGame(name, instructions, setup) {
  host.innerHTML = '<canvas class="game-canvas" width="720" height="390" aria-label="'+name+'"></canvas><div class="game-note">'+instructions+'</div>';
  const c = host.querySelector('canvas'), ctx = c.getContext('2d');
  let running = true, frame = 0, raf, state = setup(c,ctx);
  const loop = () => { if(!running) return; frame++; state.draw(frame); raf=requestAnimationFrame(loop); };
  loop();
  cleanup = () => {running=false;cancelAnimationFrame(raf);window.removeEventListener('keydown',key);window.removeEventListener('keyup',keyup);c.removeEventListener('pointerdown',pointer);};
  function key(e){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','a','d','w','s'].includes(e.key)){e.preventDefault();state.key?.(e.key,true);}}
  function keyup(e){state.key?.(e.key,false);}
  function pointer(e){const r=c.getBoundingClientRect();state.pointer?.((e.clientX-r.left)/r.width*c.width,(e.clientY-r.top)/r.height*c.height);}
  window.addEventListener('keydown',key);window.addEventListener('keyup',keyup);c.addEventListener('pointerdown',pointer);
}
function racer(){
 canvasGame('Neon Racer','Utilise ← → ou A / D pour changer de voie. Sur téléphone, touche à gauche ou à droite.',(c,x)=>{
 let lane=1,obs=[],score=0,over=false,tick=0,xpGiven=false;
 function draw(){
  x.fillStyle='#071222';x.fillRect(0,0,720,390);
  x.fillStyle='#102641';x.beginPath();x.moveTo(180,0);x.lineTo(540,0);x.lineTo(680,390);x.lineTo(40,390);x.closePath();x.fill();
  x.strokeStyle='#4aeaff';x.lineWidth=3;x.beginPath();x.moveTo(180,0);x.lineTo(40,390);x.moveTo(540,0);x.lineTo(680,390);x.stroke();
  for(let k=1;k<3;k++){x.strokeStyle='#ffffff55';x.setLineDash([18,18]);x.beginPath();x.moveTo(180+k*120,0);x.lineTo(40+k*213,390);x.stroke();}x.setLineDash([]);
  if(!over&&tick%42===0)obs.push({lane:Math.floor(Math.random()*3),y:-35});
  obs.forEach(o=>{o.y+=3.1+Math.min(score/300,4);x.fillStyle='#ff4fc8';x.shadowColor='#ff4fc8';x.shadowBlur=15;x.fillRect(170+o.lane*126-o.y*.08,o.y,35,30);x.shadowBlur=0;});
  const px=170+lane*126,py=305;
  x.fillStyle='#4aeaff';x.shadowColor='#4aeaff';x.shadowBlur=20;x.beginPath();x.moveTo(px+18,py-23);x.lineTo(px+35,py+15);x.lineTo(px,py+15);x.closePath();x.fill();x.shadowBlur=0;
  obs=obs.filter(o=>{if(o.y>280&&o.y<335&&o.lane===lane)over=true;return o.y<420;});
  if(!over)score++;
  x.fillStyle='#f4fbff';x.font='bold 19px Orbitron';x.fillText('SCORE '+Math.floor(score/5),22,35);
   if(over && !xpGiven){
  xpGiven = true;
  window.PlanetXP?.completeGame('racer', Math.floor(score/5));
}
  if(over){x.fillStyle='#030918bb';x.fillRect(0,0,720,390);x.fillStyle='#ff79d6';x.textAlign='center';x.font='bold 34px Orbitron';x.fillText('CRASH !',360,175);x.fillStyle='white';x.font='18px Rajdhani';x.fillText('Score : '+Math.floor(score/5)+' · Recommence pour rejouer',360,215);x.textAlign='left';}
  tick++;
 }
 return {draw,key:(k)=>{if(k==='ArrowLeft'||k==='a')lane=Math.max(0,lane-1);if(k==='ArrowRight'||k==='d')lane=Math.min(2,lane+1);},pointer:(px)=>{lane=px<c.width/2?Math.max(0,lane-1):Math.min(2,lane+1);}};
 });
}
function jumper(){
 canvasGame('Pixel Jumper','Utilise ← → pour bouger et Espace / ↑ pour sauter. Sur téléphone, touche à gauche ou à droite.',(c,x)=>{
 let px=350,py=285,vx=0,vy=0,ground=false,keys={},plats=[{x:280,y:335,w:160},{x:130,y:270,w:115},{x:420,y:210,w:115},{x:220,y:150,w:100},{x:500,y:95,w:100}],cam=0,score=0;
 function draw(){
 x.fillStyle='#101a43';x.fillRect(0,0,720,390);
 for(let i=0;i<55;i++){x.fillStyle=i%3?'#6adfff':'#bd9cff';x.fillRect((i*97)%720,(i*53)%390,2,2);}
 x.fillStyle='#ffdf79';x.beginPath();x.arc(600,60,28,0,7);x.fill();
 vx=(keys.ArrowLeft||keys.a?-4:0)+(keys.ArrowRight||keys.d?4:0);px+=vx;vy+=.42;py+=vy;
 if((keys[' ']||keys.ArrowUp||keys.w)&&ground){vy=-10;ground=false;}
 ground=false;
 plats.forEach(p=>{let yy=p.y+cam;x.fillStyle='#48ebd7';x.shadowColor='#48ebd7';x.shadowBlur=8;x.fillRect(p.x,yy,p.w,8);x.shadowBlur=0;if(vy>0&&py+24>=yy&&py+24<=yy+13&&px+20>p.x&&px<p.x+p.w){py=yy-24;vy=0;ground=true;score=Math.max(score,Math.floor((390-yy)/10));}});
 if(py<145)cam+=2.2;
 x.fillStyle='#ff68c9';x.fillRect(px,py,20,24);x.fillStyle='#fff';x.fillRect(px+12,py+5,4,4);
 if(px<0)px=0;if(px>700)px=700;
 x.fillStyle='white';x.font='bold 18px Orbitron';x.fillText('HAUTEUR '+score,20,30);
 if(py>420){x.fillStyle='#030918dd';x.fillRect(0,0,720,390);x.textAlign='center';x.fillStyle='#ff85d5';x.font='bold 30px Orbitron';x.fillText('OUPS !',360,180);x.fillStyle='white';x.font='18px Rajdhani';x.fillText('Recommence pour retenter ta chance',360,218);x.textAlign='left';}
 }
 return {draw,key:(k,v)=>{keys[k]=v;},pointer:(px)=>{keys.ArrowLeft=px<c.width/2;keys.ArrowRight=px>=c.width/2;setTimeout(()=>{keys.ArrowLeft=keys.ArrowRight=false;},180);}};
 });
}
function blaster(){
 canvasGame('Star Blaster','Déplace-toi avec ← → ou A / D. Esquive les météorites. Sur téléphone, touche à gauche ou à droite.',(c,x)=>{
let px=350,rocks=[],score=0,t=0,over=false,xpGiven=false;
 function draw(){
 x.fillStyle='#050b20';x.fillRect(0,0,720,390);
 for(let i=0;i<65;i++){x.fillStyle=i%4?'#6ceeff':'#d7aaff';x.fillRect((i*71)%720,(i*43+t*.7)%390,2,2);}
 if(over && !xpGiven){
  xpGiven = true;
  window.PlanetXP?.completeGame('blaster', Math.floor(score/4));
}if(!over&&t%28===0)rocks.push({x:20+Math.random()*680,y:-20,r:8+Math.random()*12,v:2+Math.random()*2});
 rocks.forEach(r=>{r.y+=r.v;x.fillStyle='#ff6a94';x.shadowColor='#ff477f';x.shadowBlur=12;x.beginPath();x.arc(r.x,r.y,r.r,0,7);x.fill();x.shadowBlur=0;if(Math.abs(r.x-px)<r.r+15&&r.y>320&&r.y<365)over=true;});
 rocks=rocks.filter(r=>r.y<420);x.fillStyle='#4aeaff';x.shadowColor='#4aeaff';x.shadowBlur=16;x.beginPath();x.moveTo(px,315);x.lineTo(px-19,358);x.lineTo(px,350);x.lineTo(px+19,358);x.closePath();x.fill();x.shadowBlur=0;
 if(!over)score++;x.fillStyle='white';x.font='bold 18px Orbitron';x.fillText('SCORE '+Math.floor(score/4),20,30);
 if(over){x.fillStyle='#030918dd';x.fillRect(0,0,720,390);x.textAlign='center';x.fillStyle='#ff719b';x.font='bold 30px Orbitron';x.fillText('MISSION TERMINÉE',360,175);x.fillStyle='white';x.font='18px Rajdhani';x.fillText('Score : '+Math.floor(score/4),360,215);x.textAlign='left';}t++;
 }
 return {draw,key:(k,v)=>{if(k==='ArrowLeft'||k==='a')px=Math.max(20,px-25);if(k==='ArrowRight'||k==='d')px=Math.min(700,px+25);},pointer:(xpos)=>px=xpos};
 });
}
function memory(){
 const icons=['✦','◆','☀','♜','●','⚡','♥','✿'];
 let deck=[...icons,...icons].sort(()=>Math.random()-.5),first=null,lock=false,moves=0,pairs=0;
 host.innerHTML='<div class="score-line" id="memory-score">PAIRES 0 / 8 · COUPS 0</div><div class="memory-board" id="memory-board"></div><p class="game-note">Retourne deux cartes. Si elles sont identiques, elles restent visibles !</p>';
 const board=host.querySelector('#memory-board'),line=host.querySelector('#memory-score');
 deck.forEach((symbol,i)=>{const b=document.createElement('button');b.className='memory-card';b.textContent='?';b.setAttribute('aria-label','Carte cachée');b.onclick=()=>{if(lock||b.classList.contains('flipped')||b.classList.contains('matched'))return;b.textContent=symbol;b.classList.add('flipped');b.setAttribute('aria-label','Carte '+symbol);if(!first){first=b;return;}moves++;if(first.textContent===symbol){first.classList.add('matched');b.classList.add('matched');first=null;pairs++;}else{lock=true;const old=first;setTimeout(()=>{old.textContent='?';b.textContent='?';old.classList.remove('flipped');b.classList.remove('flipped');lock=false;},650);first=null;}line.textContent='PAIRES '+pairs+' / 8 · COUPS '+moves;if(pairs===8)line.textContent='BRAVO ! 8 PAIRES TROUVÉES EN '+moves+' COUPS';};board.appendChild(b);});
 cleanup=()=>{};
}

function mahjong(){
 let level=1,tiles=[],selected=null,moves=0,removed=0;
 const symbols=['龍','竹','發','中','萬','東','南','西','北','白','春','秋','梅','蘭','菊','鳥'];
 host.innerHTML='<div class="mahjong-toolbar"><div class="score-line" id="mahjong-status">NIVEAU 1 · COUPS 0</div><label class="level-progress">Niveau <select class="level-select" id="mahjong-level"><option value="1">1 · Débutant</option><option value="2">2 · Intermédiaire</option><option value="3">3 · Expert</option></select></label><button type="button" id="mahjong-shuffle">↻ Nouvelle partie</button></div><div id="mahjong-board" class="mahjong-board" aria-label="Plateau de Mahjong"></div><div id="mahjong-message" class="game-note">Clique sur deux tuiles identiques qui ont un côté libre. Les tuiles grisées sont bloquées.</div>';
 const board=host.querySelector('#mahjong-board'),status=host.querySelector('#mahjong-status'),message=host.querySelector('#mahjong-message'),levelSelect=host.querySelector('#mahjong-level');
 function start(l){
  level=l;levelSelect.value=String(l);moves=0;removed=0;selected=null;
  const count=[24,32,40][l-1], pairs=[];
  for(let i=0;i<count/2;i++){const sym=symbols[i%symbols.length];pairs.push(sym,sym);}
  // Shuffle pair order, but keep the board fully visible in a simple grid.
  for(let i=pairs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pairs[i],pairs[j]]=[pairs[j],pairs[i]];}
  tiles=pairs.map((sym,i)=>({id:i,sym,removed:false,row:Math.floor(i/8),col:i%8}));
  message.textContent='Associe les tuiles identiques. Commence par les bords : une tuile est libre si son côté gauche OU droit est ouvert.';
  render();
 }
 function free(t){
  if(t.removed)return false;
  const left=tiles.some(o=>!o.removed&&o.row===t.row&&o.col===t.col-1);
  const right=tiles.some(o=>!o.removed&&o.row===t.row&&o.col===t.col+1);
  return !left||!right;
 }
 function render(){
  board.innerHTML='';
  board.style.gridTemplateColumns='repeat(8, minmax(0, 1fr))';
  tiles.forEach(t=>{
   const b=document.createElement('button');
   b.type='button';
   b.className='mahjong-tile'+(t.removed?' removed':'')+(!t.removed&&!free(t)?' blocked':'')+(selected===t.id?' selected':'');
   b.textContent=t.removed?'':t.sym;
   b.setAttribute('aria-label',t.removed?'Tuile retirée':'Tuile '+t.sym+(free(t)?', libre':', bloquée'));
   b.disabled=t.removed||!free(t);
   b.addEventListener('click',()=>choose(t));
   board.appendChild(b);
  });
  status.textContent='NIVEAU '+level+' · COUPS '+moves+' · TUILES '+(tiles.length-removed)+' / '+tiles.length;
  if(removed===tiles.length){
   message.innerHTML='<div class="mahjong-win">NIVEAU TERMINÉ !</div><button type="button" id="mahjong-next" class="restart-btn">'+(level<3?'NIVEAU SUIVANT →':'REJOUER ↻')+'</button>';
   host.querySelector('#mahjong-next').onclick=()=>start(level<3?level+1:1);
  }
 }
 function choose(t){
  if(selected===null){selected=t.id;message.textContent='Tuile sélectionnée : '+t.sym+'. Choisis la même tuile sur un bord libre.';render();return;}
  const first=tiles.find(o=>o.id===selected);
  if(first&&first.id!==t.id&&first.sym===t.sym&&free(first)&&free(t)){
   first.removed=true;t.removed=true;removed+=2;moves++;selected=null;
   message.textContent='Bien joué ! Continue à associer les tuiles identiques.';render();
  }else{
   selected=t.id;message.textContent=first&&first.sym===t.sym?'Ces tuiles ne sont pas libres. Choisis une tuile de bord.':'Ce ne sont pas les mêmes tuiles. Essaie encore !';render();
  }
 }
 levelSelect.addEventListener('change',()=>start(Number(levelSelect.value)));
 host.querySelector('#mahjong-shuffle').addEventListener('click',()=>start(level));
 start(1);cleanup=()=>{};
}


function snake(){
 host.innerHTML='<div class="score-line" id="snake-score">SCORE 0 · NIVEAU 1</div><canvas class="game-canvas" width="600" height="360"></canvas><div class="game-note">Utilise les flèches du clavier pour diriger le serpent et manger les étoiles. Évite les murs et ton corps.</div>';
 const c=host.querySelector('canvas'),x=c.getContext('2d'),line=host.querySelector('#snake-score');
 const cell=20,cols=30,rows=18; let body=[{x:8,y:9},{x:7,y:9},{x:6,y:9}],dir={x:1,y:0},next={x:1,y:0},food={x:18,y:9},score=0,dead=false,tick=0,raf;
 function spawn(){let f;do{f={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}}while(body.some(b=>b.x===f.x&&b.y===f.y));food=f;}
 function key(e){const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};if(map[e.key]){e.preventDefault();let n=map[e.key];if(n.x!==-dir.x||n.y!==-dir.y)next=n;}if(dead&&e.key==='Enter')reset();}
 function reset(){body=[{x:8,y:9},{x:7,y:9},{x:6,y:9}];dir=next={x:1,y:0};score=0;dead=false;tick=0;spawn();}
 function draw(){x.fillStyle='#06101f';x.fillRect(0,0,c.width,c.height);x.strokeStyle='#142943';for(let i=0;i<=cols;i++){x.beginPath();x.moveTo(i*cell,0);x.lineTo(i*cell,c.height);x.stroke()}for(let i=0;i<=rows;i++){x.beginPath();x.moveTo(0,i*cell);x.lineTo(c.width,i*cell);x.stroke()}
 x.fillStyle='#ff5bc8';x.shadowColor='#ff5bc8';x.shadowBlur=12;x.beginPath();x.arc(food.x*cell+10,food.y*cell+10,7,0,7);x.fill();x.shadowBlur=0;
 body.forEach((b,i)=>{x.fillStyle=i?'#25bfe8':'#70fff0';x.shadowColor=x.fillStyle;x.shadowBlur=i?0:10;x.fillRect(b.x*cell+2,b.y*cell+2,cell-4,cell-4)});x.shadowBlur=0;
 if(!dead&&tick++%Math.max(4,8-Math.floor(score/5))===0){dir=next;let h={x:body[0].x+dir.x,y:body[0].y+dir.y};if(h.x<0||h.x>=cols||h.y<0||h.y>=rows||body.some(b=>b.x===h.x&&b.y===h.y)){dead=true}else{body.unshift(h);if(h.x===food.x&&h.y===food.y){score++;spawn()}else body.pop()}}
 line.textContent='SCORE '+score+' · NIVEAU '+(1+Math.floor(score/5));if(dead){x.fillStyle='#020817d9';x.fillRect(0,0,c.width,c.height);x.fillStyle='#ff6acb';x.textAlign='center';x.font='bold 30px sans-serif';x.fillText('PARTIE TERMINÉE',300,165);x.fillStyle='white';x.font='18px sans-serif';x.fillText('Score : '+score+' · Clique sur RECOMMENCER',300,200);x.textAlign='left'}raf=requestAnimationFrame(draw)}
 window.addEventListener('keydown',key);draw();cleanup=()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',key)};
}
function tictactoe(){
 let cells=Array(9).fill(''),turn='X',done=false,score=0;
 host.innerHTML='<div class="score-line" id="ttt-status">À TOI DE JOUER · TU ES X</div><div id="ttt-board" style="display:grid;grid-template-columns:repeat(3,minmax(70px,110px));gap:8px;justify-content:center;margin:18px auto"></div><div class="game-note">Aligne trois symboles pour gagner. Tu joues contre une IA simple.</div>';
 const board=host.querySelector('#ttt-board'),status=host.querySelector('#ttt-status');
 function winner(a){for(const [i,j,k] of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]])if(a[i]&&a[i]===a[j]&&a[j]===a[k])return a[i];return a.every(Boolean)?'draw':null}
 function render(){board.innerHTML='';cells.forEach((v,i)=>{const b=document.createElement('button');b.textContent=v||'+';b.disabled=!!v||done;b.style.cssText='aspect-ratio:1;border:1px solid #2adcf4;border-radius:12px;background:#0b1a32;color:'+(v==='X'?'#4aeaff':'#ff5ac8')+';font-size:36px;font-weight:bold;cursor:pointer';b.onclick=()=>play(i);board.appendChild(b)});}
 function endCheck(){const w=winner(cells);if(w){done=true;status.textContent=w==='draw'?'MATCH NUL !':w==='X'?'BRAVO, TU AS GAGNÉ !':'L’IA A GAGNÉ';render();const b=document.createElement('button');b.className='restart-btn';b.textContent='REJOUER';b.onclick=reset;host.appendChild(b);return true}return false}
 function play(i){if(done||cells[i])return;cells[i]='X';if(endCheck())return;const open=cells.map((v,i)=>v?null:i).filter(v=>v!==null);let pick=open.find(i=>wouldWin(i,'O'));if(pick===undefined)pick=open.find(i=>wouldWin(i,'X'));if(pick===undefined)pick=open[Math.floor(Math.random()*open.length)];if(pick!==undefined)cells[pick]='O';if(!endCheck())render()}
 function wouldWin(i,s){cells[i]=s;const yes=winner(cells)===s;cells[i]='';return yes}
 function reset(){cells=Array(9).fill('');done=false;status.textContent='À TOI DE JOUER · TU ES X';render();}render();cleanup=()=>{};
}
function reaction(){
 host.innerHTML='<div class="score-line" id="reaction-status">TEST DE RÉFLEXES</div><div style="display:grid;place-items:center;min-height:260px"><button id="reaction-button" style="width:min(90%,420px);min-height:180px;border:2px solid #4aeaff;border-radius:20px;background:#10243d;color:white;font-size:24px;font-weight:bold;cursor:pointer">CLIQUE POUR COMMENCER</button></div><div class="game-note">Clique quand le bouton devient vert. Si tu cliques trop tôt, recommence !</div>';
 const b=host.querySelector('#reaction-button'),s=host.querySelector('#reaction-status');let mode='ready',timer=null,start=0;
 b.onclick=()=>{if(mode==='ready'||mode==='done'||mode==='early'){mode='wait';b.textContent='ATTENDS LE VERT…';b.style.background='#4b2440';b.style.borderColor='#ff5ac8';s.textContent='PRÉPARE-TOI';timer=setTimeout(()=>{mode='go';start=performance.now();b.textContent='MAINTENANT !';b.style.background='#087b5b';b.style.borderColor='#66ffb7';s.textContent='CLIQUE !'},900+Math.random()*2800)}else if(mode==='wait'){clearTimeout(timer);mode='early';b.textContent='TROP TÔT ! RECOMMENCE';b.style.background='#4b182b';s.textContent='FAIS ATTENTION';}else if(mode==='go'){const ms=Math.round(performance.now()-start);mode='done';b.textContent=ms+' ms · REJOUER';b.style.background='#10243d';s.textContent=ms<250?'RÉFLEXES ÉCLAIR !':ms<400?'BIEN JOUÉ !':'ESSAIE DE FAIRE MIEUX !'}};cleanup=()=>clearTimeout(timer);
}

function launch(game){
 cleanup(); title.textContent=({racer:'Neon Racer',jumper:'Pixel Jumper',blaster:'Star Blaster',memory:'Memory Matrix',mahjong:'Mahjong Neon',snake:'Snake Neon',ttt:'Tic Tac Toe',reaction:'Reflex Rush'})[game]||'Jeu';
 help.textContent=({racer:'Évite les obstacles !',jumper:'Grimpe le plus haut possible !',blaster:'Survis dans l’espace !',memory:'Retrouve toutes les paires !',mahjong:'Associe les tuiles libres et passe les 3 niveaux !',snake:'Mange les étoiles et bats ton record !',ttt:'Aligne trois symboles contre l’IA.',reaction:'Teste ta vitesse de réaction !'})[game]||'Amuse-toi bien !';
 ({racer, jumper, blaster, memory, mahjong, snake, ttt:tictactoe, reaction})[game]?.();
}
window.PlanetGames={launch,restart:()=>{const game=window.currentGame;if(game)launch(game);}};
window.addEventListener('beforeunload',()=>cleanup());
})();
