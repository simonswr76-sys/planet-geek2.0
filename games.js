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
  function key(e){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','a','d','w','s','q','A','D','Q','W','S'].includes(e.key)){e.preventDefault();state.key?.(e.key,true);}}
  function keyup(e){state.key?.(e.key,false);}
  function pointer(e){const r=c.getBoundingClientRect();state.pointer?.((e.clientX-r.left)/r.width*c.width,(e.clientY-r.top)/r.height*c.height);}
  window.addEventListener('keydown',key);window.addEventListener('keyup',keyup);c.addEventListener('pointerdown',pointer);
}
function racer(){
 canvasGame('Neon Racer','Utilise ← → ou A / D pour changer de voie. Sur téléphone, touche à gauche ou à droite.',(c,x)=>{
 let lane=1,obs=[],score=0,over=false,tick=0;
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
 let px=350,rocks=[],score=0,t=0,over=false;
 function draw(){
 x.fillStyle='#050b20';x.fillRect(0,0,720,390);
 for(let i=0;i<65;i++){x.fillStyle=i%4?'#6ceeff':'#d7aaff';x.fillRect((i*71)%720,(i*43+t*.7)%390,2,2);}
 if(!over&&t%28===0)rocks.push({x:20+Math.random()*680,y:-20,r:8+Math.random()*12,v:2+Math.random()*2});
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
 const SAVE='planetGeekMahjongV2', TOTAL=100, symbols=['龍','竹','發','中','萬','東','南','西','北','白','春','秋','梅','蘭','菊','鳥','🀄','🀙','🀐','🀄'];
 let saved={unlocked:1,completed:[],level:1,tiles:null,moves:0};
 try{saved={...saved,...JSON.parse(localStorage.getItem(SAVE)||'{}')}}catch{}
 let level=Math.max(1,Math.min(TOTAL,Number(saved.level)||1)),tiles=[],selected=null,moves=0,removed=0,undoStack=[];
 host.innerHTML='<div class="mahjong-toolbar"><div class="score-line" id="mahjong-status"></div><label class="level-progress">Niveau <select class="level-select" id="mahjong-level"></select></label><button type="button" id="mahjong-hint">💡 Indice</button><button type="button" id="mahjong-undo">↶ Annuler</button><button type="button" id="mahjong-shuffle">↻ Mélanger</button></div><div class="mahjong-subline" id="mahjong-progress"></div><div id="mahjong-board" class="mahjong-board mahjong-classic" aria-label="Plateau de Mahjong solitaire"></div><div id="mahjong-message" class="game-note">Retire toutes les paires identiques. Une tuile est libre si elle n’est pas recouverte et si au moins un côté (gauche ou droite) est ouvert.</div>';
 const board=host.querySelector('#mahjong-board'),status=host.querySelector('#mahjong-status'),message=host.querySelector('#mahjong-message'),levelSelect=host.querySelector('#mahjong-level'),progress=host.querySelector('#mahjong-progress');
 function layout(){let out=[],id=0;const shapes=[ [4,7],[2,9],[1,10],[0,11],[0,11],[1,10],[2,9],[4,7] ];shapes.forEach(([lo,hi],row)=>{for(let col=lo;col<=hi;col++)out.push({id:id++,row,col,layer:0});});
 // classic layered centre: 4 tiles on level 1 and one raised central tile
 [[4,2],[5,2],[6,5],[7,5]].forEach(([col,row])=>out.push({id:id++,row,col,layer:1}));
 // add four lower central tiles to complete 72 tiles
 [[5,3],[6,3],[5,4],[6,4]].forEach(([col,row])=>out.push({id:id++,row,col,layer:1}));
 return out;
 }
 function save(){try{localStorage.setItem(SAVE,JSON.stringify({unlocked:Math.max(1,Number(saved.unlocked)||1),completed:saved.completed||[],level:saved.level||level,tiles:removed===tiles.length?null:tiles.map(t=>({...t})),moves}))}catch{}}
 function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function free(t){if(t.removed)return false;const covered=tiles.some(o=>!o.removed&&o.layer>t.layer&&Math.abs(o.col-t.col)<1&&Math.abs(o.row-t.row)<1);if(covered)return false;const left=tiles.some(o=>!o.removed&&o.layer===t.layer&&o.row===t.row&&o.col===t.col-1);const right=tiles.some(o=>!o.removed&&o.layer===t.layer&&o.row===t.row&&o.col===t.col+1);return !left||!right;}
 function pairsAvailable(){const f=tiles.filter(t=>!t.removed&&free(t));for(let i=0;i<f.length;i++)for(let j=i+1;j<f.length;j++)if(f[i].sym===f[j].sym)return true;return false;}
 function renderLevels(){levelSelect.innerHTML='';for(let i=1;i<=TOTAL;i++){const op=document.createElement('option');op.value=i;op.textContent='Niveau '+i+(saved.completed.includes(i)?' ✓':i>(saved.unlocked||1)?' 🔒':'');op.disabled=i>(saved.unlocked||1);levelSelect.appendChild(op);}levelSelect.value=String(level);progress.textContent='Progression : '+(saved.completed||[]).length+' / '+TOTAL+' niveaux terminés · Sauvegarde automatique';}
 function start(l,restore=false){level=Math.max(1,Math.min(TOTAL,l));selected=null;undoStack=[];
  if(restore&&saved.tiles&&saved.level===level){tiles=saved.tiles.map(t=>({...t}));moves=Number(saved.moves)||0;removed=tiles.filter(t=>t.removed).length;}
  else {const coords=layout();let pairs=[];for(let i=0;i<coords.length/2;i++){let sym=symbols[(i*7+level*3)%symbols.length];pairs.push(sym,sym);}shuffle(pairs);tiles=coords.map((t,i)=>({...t,sym:pairs[i],removed:false}));moves=0;removed=0;saved.level=level;}
  renderLevels();render();save();
 }
 function render(){board.innerHTML='';board.style.height='350px';tiles.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='mahjong-tile mahjong-real'+(t.removed?' removed':'')+(!t.removed&&!free(t)?' blocked':'')+(selected===t.id?' selected':'');b.textContent=t.removed?'':t.sym;b.setAttribute('aria-label',t.removed?'Tuile retirée':'Tuile '+t.sym+(free(t)?', libre':', bloquée'));b.disabled=t.removed||!free(t);b.style.left=(Math.max(0,t.col)*34+Math.max(0,t.layer)*9)+'px';b.style.top=(Math.max(0,t.row)*37-Math.max(0,t.layer)*10)+'px';b.style.zIndex=String(t.layer*10+t.row);b.onclick=()=>choose(t);board.appendChild(b);});status.textContent='NIVEAU '+level+' / '+TOTAL+' · PAIRES '+Math.floor(removed/2)+' / '+tiles.length/2+' · COUPS '+moves;}
 function choose(t){if(!free(t))return;if(selected===null){selected=t.id;render();return;}const first=tiles.find(o=>o.id===selected);if(first&&first.id!==t.id&&first.sym===t.sym&&free(first)){undoStack.push(tiles.map(o=>({...o})));first.removed=true;t.removed=true;removed+=2;moves++;selected=null;message.textContent='Bien joué ! Deux tuiles retirées.';if(removed===tiles.length){if(!saved.completed.includes(level))saved.completed.push(level);saved.unlocked=Math.max(saved.unlocked||1,Math.min(TOTAL,level+1));saved.tiles=null;saved.level=level<TOTAL?level+1:1;render();renderLevels();save();message.innerHTML='<div class="mahjong-win">NIVEAU '+level+' TERMINÉ !</div><button type="button" id="mahjong-next" class="restart-btn">'+(level<TOTAL?'NIVEAU SUIVANT →':'RECOMMENCER LES 100 NIVEAUX ↻')+'</button>';host.querySelector('#mahjong-next').onclick=()=>start(level<TOTAL?level+1:1);return;}}
 else {selected=t.id;message.textContent=first&&first.id!==t.id?'Ces tuiles ne correspondent pas. Choisis deux tuiles identiques libres.':'Tuile sélectionnée.';}render();save();if(removed<tiles.length&&!pairsAvailable())message.textContent='Plus de paire disponible : utilise Mélanger pour continuer.';}
 levelSelect.addEventListener('change',()=>start(Number(levelSelect.value)));host.querySelector('#mahjong-shuffle').onclick=()=>{const remaining=shuffle(tiles.filter(t=>!t.removed));let pairs=[];for(let i=0;i<remaining.length/2;i++)pairs.push(remaining[i].sym,remaining[i].sym);shuffle(pairs);remaining.forEach((t,i)=>t.sym=pairs[i]);selected=null;message.textContent='Tuiles restantes mélangées.';render();save();};
 host.querySelector('#mahjong-hint').onclick=()=>{const f=tiles.filter(t=>!t.removed&&free(t));let pair=null;for(let i=0;i<f.length&&!pair;i++)for(let j=i+1;j<f.length;j++)if(f[i].sym===f[j].sym){pair=[f[i],f[j]];break;}if(pair){selected=pair[0].id;render();message.textContent='Indice : cherche les deux tuiles entourées.';setTimeout(()=>{if(host.contains(board)){selected=pair[1].id;render();}},700);}else message.textContent='Aucune paire libre. Essaie Mélanger.';};
 host.querySelector('#mahjong-undo').onclick=()=>{if(!undoStack.length){message.textContent='Aucun coup à annuler.';return;}tiles=undoStack.pop();removed=tiles.filter(t=>t.removed).length;moves=Math.max(0,moves-1);selected=null;render();save();message.textContent='Dernier coup annulé.';};
 start(level,!!(saved.tiles&&saved.level===level));
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


function neonPong(){
 canvasGame('Neon Pong','Déplace ta raquette avec ↑ ↓ ou W / S. Premier à 5 points !',(c,x)=>{
  let py=150,ai=150,bx=360,by=195,vx=4,vy=2,player=0,cpu=0,over=false;
  function resetBall(dir){bx=360;by=195;vx=4*dir;vy=Math.random()>.5?2:-2;}
  function draw(){
   x.fillStyle='#050b20';x.fillRect(0,0,720,390);
   x.strokeStyle='#ffffff55';x.setLineDash([10,10]);x.beginPath();x.moveTo(360,0);x.lineTo(360,390);x.stroke();x.setLineDash([]);
   x.fillStyle='#4aeaff';x.shadowColor='#4aeaff';x.shadowBlur=15;x.fillRect(25,py,12,90);
   x.fillStyle='#ff5ac8';x.shadowColor='#ff5ac8';x.fillRect(683,ai,12,90);
   x.fillStyle='white';x.shadowBlur=12;x.beginPath();x.arc(bx,by,9,0,Math.PI*2);x.fill();x.shadowBlur=0;
   x.textAlign='center';x.font='bold 32px sans-serif';x.fillStyle='#4aeaff';x.fillText(player,300,45);x.fillStyle='#ff5ac8';x.fillText(cpu,420,45);
   if(!over){
    bx+=vx;by+=vy;ai+=(by-45-ai)*.055;ai=Math.max(0,Math.min(300,ai));
    if(by<9||by>381)vy=-vy;
    if(bx<37&&bx>20&&by>py&&by<py+90){vx=Math.abs(vx)*1.04;vy+=(by-(py+45))*.08;}
    if(bx>680&&bx<698&&by>ai&&by<ai+90){vx=-Math.abs(vx)*1.04;vy+=(by-(ai+45))*.08;}
    if(bx<0){cpu++;if(cpu>=5)over=true;else resetBall(1);}
    if(bx>720){player++;if(player>=5)over=true;else resetBall(-1);}
   }else{
    x.fillStyle='#030918dd';x.fillRect(80,130,560,120);x.fillStyle=player>=5?'#4aeaff':'#ff5ac8';x.font='bold 30px sans-serif';x.fillText(player>=5?'TU AS GAGNÉ !':'L’ORDINATEUR A GAGNÉ',360,180);x.fillStyle='white';x.font='18px sans-serif';x.fillText('Clique sur RECOMMENCER pour rejouer',360,215);
   }
   x.textAlign='left';
  }
  return {draw,key:(k)=>{if(k==='ArrowUp'||k==='w')py=Math.max(0,py-24);if(k==='ArrowDown'||k==='s')py=Math.min(300,py+24);},pointer:(px,pyClick)=>{py=Math.max(0,Math.min(300,pyClick-45));}};
 });
}

function blockMaster(){
 const size=8;let grid=Array.from({length:size},()=>Array(size).fill(0));let score=0,selected=null,shapes=[[[0,0]],[[0,0],[1,0]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,0],[1,1]],[[0,0],[1,0],[2,0],[1,1]]];
 host.innerHTML='<div class="score-line" id="blocks-score">SCORE 0</div><div id="blocks-board" style="display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:4px;max-width:440px;margin:15px auto"></div><p class="game-note">Choisis une pièce, puis clique sur une case pour la placer. Complète une ligne ou une colonne !</p><div id="blocks-pieces" style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap"></div><p id="blocks-message" class="game-note">Choisis une pièce pour commencer.</p>';
 const board=host.querySelector('#blocks-board'),line=host.querySelector('#blocks-score'),pieces=host.querySelector('#blocks-pieces'),message=host.querySelector('#blocks-message');
 function makePieces(){pieces.innerHTML='';selected=null;for(let n=0;n<3;n++){const shape=shapes[Math.floor(Math.random()*shapes.length)],b=document.createElement('button');b.type='button';b.textContent=shape.map(()=> '■').join(' ');b.style.cssText='padding:10px;background:#10243d;color:#4aeaff;border:1px solid #4aeaff;border-radius:8px;cursor:pointer';b.onclick=()=>{selected={shape,button:b};pieces.querySelectorAll('button').forEach(q=>q.style.outline='');b.style.outline='2px solid #ff5ac8';message.textContent='Clique sur le plateau pour placer la pièce.';};pieces.appendChild(b);}}
 function render(){board.innerHTML='';grid.forEach((row,y)=>row.forEach((v,z)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Ligne '+(y+1)+', colonne '+(z+1));b.style.cssText='aspect-ratio:1;min-width:0;padding:0;border-radius:4px;border:1px solid #25415c;background:'+(v?'#4aeaff':'#0b1830')+';cursor:pointer';b.onclick=()=>place(z,y);board.appendChild(b);}));line.textContent='SCORE '+score;}
 function place(z,y){if(!selected){message.textContent='Choisis d’abord une pièce en dessous du plateau.';return;}const shape=selected.shape,cells=shape.map(([dx,dy])=>[z+dx,y+dy]);if(cells.some(([xx,yy])=>xx>=size||yy>=size||grid[yy][xx])){message.textContent='La pièce ne rentre pas ici. Essaie une autre case.';return;}cells.forEach(([xx,yy])=>grid[yy][xx]=1);score+=cells.length;const rows=[];for(let yy=0;yy<size;yy++)if(grid[yy].every(Boolean))rows.push(yy);const cols=[];for(let xx=0;xx<size;xx++)if(grid.every(r=>r[xx]))cols.push(xx);score+=(rows.length+cols.length)*10;rows.forEach(yy=>grid[yy].fill(0));cols.forEach(xx=>grid.forEach(r=>r[xx]=0));selected=null;makePieces();render();message.textContent=(rows.length+cols.length)?'Bien joué ! Ligne(s) complétée(s) !':'Pièce placée ! Continue.';}
 makePieces();render();cleanup=()=>{};
}

function dinoDash(){
 canvasGame('Dino Dash','Espace / ↑ pour sauter. Sur téléphone, touche le jeu pour sauter. Tiens le plus longtemps possible !',(c,x)=>{let y=300,vy=0,ground=true,obs=[],score=0,t=0,over=false;function jump(){if(ground&&!over){vy=-11;ground=false;}if(over){y=300;vy=0;ground=true;obs=[];score=0;t=0;over=false;}}return {key:k=>{if(k===' '||k==='ArrowUp'||k==='w')jump();},pointer:jump,draw:()=>{x.fillStyle='#101a2c';x.fillRect(0,0,720,390);x.fillStyle='#192d3a';x.fillRect(0,320,720,70);x.strokeStyle='#6affb6';x.lineWidth=3;x.beginPath();x.moveTo(0,320);x.lineTo(720,320);x.stroke();for(let i=0;i<7;i++){x.fillStyle='#7fdda5';x.fillRect((i*123-t*2)%720,65+(i%3)*28,3,3);}if(!over&&t%58===0)obs.push({x:740,w:20+Math.random()*18,h:25+Math.random()*25});obs.forEach(o=>{o.x-=5+score/250;x.fillStyle='#6affb6';x.fillRect(o.x,320-o.h,o.w,o.h);x.fillRect(o.x+5,300-o.h,6,10);if(o.x<92&&o.x+o.w>55&&y+25>320-o.h)over=true;});obs=obs.filter(o=>o.x>-50);if(!ground){vy+=.55;y+=vy;if(y>=300){y=300;vy=0;ground=true;}}x.fillStyle='#ffe47a';x.fillRect(55,y,35,25);x.fillStyle='#101a2c';x.fillRect(79,y+5,5,5);if(!over)score++;x.fillStyle='white';x.font='bold 20px Orbitron';x.fillText('SCORE '+Math.floor(score/5),20,30);if(over){x.fillStyle='#020816cc';x.fillRect(0,0,720,390);x.textAlign='center';x.fillStyle='#6affb6';x.font='bold 32px Orbitron';x.fillText('FIN DE COURSE',360,175);x.fillStyle='white';x.font='18px Rajdhani';x.fillText('Score '+Math.floor(score/5)+' · touche pour recommencer',360,215);x.textAlign='left';}t++;}}});
}
function flappyRocket(){canvasGame('Flappy Rocket','Espace ou clic pour voler. Passe entre les portails !',(c,x)=>{let py=190,v=0,gates=[],score=0,t=0,over=false;function flap(){if(over){py=190;v=0;gates=[];score=0;t=0;over=false;}else v=-6.2;}return {key:k=>{if(k===' '||k==='ArrowUp')flap();},pointer:flap,draw:()=>{x.fillStyle='#080f2b';x.fillRect(0,0,720,390);for(let i=0;i<60;i++){x.fillStyle='#6ceeff';x.fillRect((i*97)%720,(i*59)%390,2,2);}if(!over&&t%90===0){let gapY=70+Math.random()*210;gates.push({x:740,gap:gapY,passed:false});}v+=.28;py+=v;gates.forEach(g=>{g.x-=3;x.fillStyle='#a78bfa';x.fillRect(g.x,0,42,g.gap-65);x.fillRect(g.x,g.gap+65,42,390-g.gap-65);if(g.x<85&&g.x+42>55&&(py<g.gap-65||py>g.gap+65))over=true;if(!g.passed&&g.x<55){score++;g.passed=true;}});gates=gates.filter(g=>g.x>-50);x.fillStyle='#ffe47a';x.beginPath();x.arc(70,py,13,0,7);x.fill();if(py<0||py>390)over=true;x.fillStyle='white';x.font='bold 20px Orbitron';x.fillText('PORTAILS '+score,20,30);if(over){x.fillStyle='#020816cc';x.fillRect(0,0,720,390);x.textAlign='center';x.fillStyle='#ffe47a';x.font='bold 32px Orbitron';x.fillText('MISSION ÉCHOUÉE',360,175);x.fillStyle='white';x.font='18px Rajdhani';x.fillText('Score '+score+' · touche pour recommencer',360,215);x.textAlign='left';}t++;}}});}
function brickBreaker(){canvasGame('Brick Breaker','Déplace la raquette avec ← → ou la souris. Casse toutes les briques !',(c,x)=>{let px=310,bx=360,by=280,vx=3,vy=-3,bricks=[],score=0,over=false;function reset(){px=310;bx=360;by=280;vx=3;vy=-3;score=0;over=false;bricks=[];for(let r=0;r<5;r++)for(let col=0;col<10;col++)bricks.push({x:28+col*67,y:45+r*25,alive:true,h:r});}reset();return {key:(k)=>{if(k==='ArrowLeft'||k==='a')px=Math.max(0,px-28);if(k==='ArrowRight'||k==='d')px=Math.min(630,px+28);},pointer:xpos=>px=Math.max(0,Math.min(630,xpos-45)),draw:()=>{x.fillStyle='#071222';x.fillRect(0,0,720,390);bricks.forEach(b=>{if(b.alive){x.fillStyle=['#4aeaff','#a78bfa','#ff5ac8','#ffe47a','#ff6680'][b.h];x.fillRect(b.x,b.y,60,16);}});x.fillStyle='#4aeaff';x.fillRect(px,350,90,12);x.fillStyle='white';x.beginPath();x.arc(bx,by,7,0,7);x.fill();if(!over){bx+=vx;by+=vy;if(bx<7||bx>713)vx*=-1;if(by<7)vy*=-1;if(by>340&&by<365&&bx>px&&bx<px+90)vy=-Math.abs(vy);if(by>390)over=true;bricks.forEach(b=>{if(b.alive&&bx>b.x&&bx<b.x+60&&by>b.y&&by<b.y+16){b.alive=false;vy*=-1;score+=10;}});if(bricks.every(b=>!b.alive))over=true;}x.fillStyle='white';x.font='bold 18px Orbitron';x.fillText('SCORE '+score,20,28);if(over){x.fillStyle='#020816cc';x.fillRect(0,0,720,390);x.textAlign='center';x.fillStyle='#4aeaff';x.font='bold 30px Orbitron';x.fillText(bricks.every(b=>!b.alive)?'BRAVO !':'FIN DE PARTIE',360,175);x.fillStyle='white';x.font='18px Rajdhani';x.fillText('Score '+score+' · bouton Recommencer pour rejouer',360,215);x.textAlign='left';}}};});}
function whackMole(){host.innerHTML='<div class="score-line" id="mole-score">SCORE 0 · TEMPS 30</div><div class="mole-grid" id="mole-grid"></div><p class="game-note">Clique sur les créatures qui apparaissent avant qu’elles disparaissent !</p><button class="restart-btn" id="mole-start">▶ Démarrer</button>';const line=host.querySelector('#mole-score'),grid=host.querySelector('#mole-grid'),start=host.querySelector('#mole-start');let score=0,time=30,timer=null,active=-1,playing=false;const holes=[];for(let i=0;i<9;i++){const b=document.createElement('button');b.className='mole-hole';b.textContent='';b.onclick=()=>{if(playing&&i===active){score+=10;active=-1;paint();}};grid.appendChild(b);holes.push(b);}function paint(){holes.forEach((b,i)=>{b.textContent=i===active?'🦎':'·';b.classList.toggle('mole-active',i===active);});line.textContent='SCORE '+score+' · TEMPS '+time;}function end(){playing=false;clearInterval(timer);active=-1;paint();line.textContent='TERMINÉ ! SCORE '+score+' · Clique sur Démarrer pour rejouer.';}start.onclick=()=>{clearInterval(timer);score=0;time=30;playing=true;active=Math.floor(Math.random()*9);paint();timer=setInterval(()=>{time--;active=Math.floor(Math.random()*9);paint();if(time<=0)end();},750);};cleanup=()=>{clearInterval(timer);};paint();}


function spaceInvaders(){canvasGame('Space Invaders','Flèches ou A/D pour bouger, Espace pour tirer. Détruis les aliens !',(c,x)=>{let px=350,shots=[],aliens=[],tick=0,score=0,over=false;for(let r=0;r<3;r++)for(let col=0;col<8;col++)aliens.push({x:100+col*65,y:50+r*42,alive:true});return {key:(k)=>{if(k==='ArrowLeft'||k==='a')px=Math.max(15,px-25);if(k==='ArrowRight'||k==='d')px=Math.min(690,px+25);if(k===' '&&!over)shots.push({x:px,y:325});},pointer:xx=>px=xx,draw:()=>{x.fillStyle='#061020';x.fillRect(0,0,720,390);for(let i=0;i<55;i++){x.fillStyle='#7ceeff';x.fillRect((i*71)%720,(i*37)%390,2,2);}if(!over&&tick%75===0)aliens.filter(a=>a.alive).forEach(a=>a.y+=10);shots.forEach(s=>{s.y-=7;x.fillStyle='#ffe47a';x.fillRect(s.x,s.y,4,12);aliens.forEach(a=>{if(a.alive&&s.x>a.x&&s.x<a.x+24&&s.y>a.y&&s.y<a.y+20){a.alive=false;s.y=-20;score+=10;}});});shots=shots.filter(s=>s.y>-20);aliens.filter(a=>a.alive).forEach(a=>{x.fillStyle='#a78bfa';x.fillRect(a.x,a.y,24,18);x.fillStyle='#061020';x.fillRect(a.x+5,a.y+5,4,4);x.fillRect(a.x+15,a.y+5,4,4);if(a.y>320)over=true;});x.fillStyle='#42e8ff';x.fillRect(px-18,345,36,15);if(aliens.every(a=>!a.alive))over=true;x.fillStyle='white';x.font='bold 18px Orbitron';x.fillText('SCORE '+score,20,28);if(over){x.fillStyle='#020816cc';x.fillRect(0,0,720,390);x.textAlign='center';x.fillStyle='#42e8ff';x.font='bold 30px Orbitron';x.fillText(aliens.every(a=>!a.alive)?'PLANÈTE SAUVÉE !':'FIN DE MISSION',360,180);x.fillStyle='white';x.font='18px Rajdhani';x.fillText('Score '+score+' · Recommence pour rejouer',360,218);x.textAlign='left';}tick++;}}});}
function mathSprint(){host.innerHTML='<div class="score-line" id="math-info">SCORE 0 · TEMPS 30</div><div class="math-card"><div id="math-question">Prêt ?</div><form id="math-form"><input id="math-answer" type="number" inputmode="numeric" autocomplete="off" placeholder="Ta réponse" required><button class="feature-button" type="submit">Valider</button></form><button class="restart-btn" id="math-start">▶ Démarrer</button></div><p class="game-note">Réponds au plus grand nombre de calculs en 30 secondes.</p>';const info=host.querySelector('#math-info'),q=host.querySelector('#math-question'),form=host.querySelector('#math-form'),input=host.querySelector('#math-answer'),start=host.querySelector('#math-start');let score=0,time=30,a=0,b=0,timer=null,playing=false;function next(){a=1+Math.floor(Math.random()*12);b=1+Math.floor(Math.random()*12);q.textContent=a+' × '+b+' = ?';input.value='';input.focus();}function end(){playing=false;clearInterval(timer);q.textContent='Terminé ! Score : '+score;info.textContent='SCORE '+score+' · FINI';}start.onclick=()=>{clearInterval(timer);score=0;time=30;playing=true;info.textContent='SCORE 0 · TEMPS 30';next();timer=setInterval(()=>{time--;info.textContent='SCORE '+score+' · TEMPS '+time;if(time<=0)end();},1000);};form.onsubmit=e=>{e.preventDefault();if(!playing)return;if(Number(input.value)===a*b)score+=10;else score=Math.max(0,score-2);info.textContent='SCORE '+score+' · TEMPS '+time;next();};cleanup=()=>clearInterval(timer);}
function colorTap(){host.innerHTML='<div class="score-line" id="color-info">SCORE 0 · TEMPS 20</div><div class="color-game"><p id="color-prompt">Appuie sur Démarrer !</p><button type="button" id="color-pad" aria-label="Zone de réaction">●</button><button type="button" class="restart-btn" id="color-start">▶ Démarrer</button></div>';const info=host.querySelector('#color-info'),prompt=host.querySelector('#color-prompt'),pad=host.querySelector('#color-pad'),start=host.querySelector('#color-start');let score=0,time=20,target='',playing=false,timer=null;const palette=[['ROUGE','#ff526e'],['BLEU','#42e8ff'],['VERT','#65f6ad'],['VIOLET','#b18cff']];function next(){const p=palette[Math.floor(Math.random()*palette.length)];target=p[0];prompt.textContent='Clique quand le rond est '+target+' !';pad.style.background=p[1];pad.dataset.color=target;}start.onclick=()=>{clearInterval(timer);score=0;time=20;playing=true;next();timer=setInterval(()=>{time--;info.textContent='SCORE '+score+' · TEMPS '+time;if(time<=0){playing=false;clearInterval(timer);prompt.textContent='Terminé ! Score : '+score;}},1000);};pad.onclick=()=>{if(!playing)return;score+=5;next();info.textContent='SCORE '+score+' · TEMPS '+time;};cleanup=()=>clearInterval(timer);}
function orbitCatch(){canvasGame('Orbit Catch','Flèches ou touche à gauche/droite pour bouger. Attrape les étoiles, évite les météores.',(c,x)=>{let px=360,items=[],score=0,t=0,over=false;return {key:k=>{if(k==='ArrowLeft'||k==='a')px=Math.max(20,px-25);if(k==='ArrowRight'||k==='d')px=Math.min(700,px+25);},pointer:xx=>px=xx,draw:()=>{x.fillStyle='#071126';x.fillRect(0,0,720,390);x.strokeStyle='#254a80';for(let r=70;r<360;r+=65){x.beginPath();x.ellipse(360,190,r,r*.45,0,0,7);x.stroke();}if(!over&&t%28===0)items.push({x:20+Math.random()*680,y:-10,good:Math.random()>.28});items.forEach(o=>{o.y+=3.5;x.fillStyle=o.good?'#ffe47a':'#ff6486';x.font='24px sans-serif';x.fillText(o.good?'✦':'✹',o.x,o.y);if(o.y>325&&o.y<365&&Math.abs(o.x-px)<25){if(o.good)score+=10;else over=true;o.y=450;}});items=items.filter(o=>o.y<430);x.fillStyle='#42e8ff';x.beginPath();x.arc(px,350,15,0,7);x.fill();x.fillStyle='white';x.font='bold 18px Orbitron';x.fillText('SCORE '+score,20,28);if(over){x.fillStyle='#020816cc';x.fillRect(0,0,720,390);x.textAlign='center';x.fillStyle='#ff6680';x.font='bold 30px Orbitron';x.fillText('OUCH !',360,180);x.fillStyle='white';x.font='18px Rajdhani';x.fillText('Score '+score+' · Recommence pour rejouer',360,218);x.textAlign='left';}t++;}}});}
function caveExplorer(){canvasGame('Cave Explorer','Flèches pour te déplacer, Espace pour sauter. Collecte les cristaux sans tomber.',(c,x)=>{let px=50,py=280,vy=0,keys={},gems=[{x:180,y:270},{x:330,y:220},{x:480,y:270},{x:610,y:190}],score=0,over=false;return {key:(k,v)=>{keys[k]=v;if((k===' '||k==='ArrowUp')&&v&&py>=280)vy=-10;},pointer:xx=>{px=xx;},draw:()=>{x.fillStyle='#111a2d';x.fillRect(0,0,720,390);x.fillStyle='#27374a';x.fillRect(0,320,720,70);x.fillStyle='#344b5e';for(let i=0;i<10;i++)x.fillRect(i*78,320+(i%2)*20,50,15);if(keys.ArrowLeft)px-=3;if(keys.ArrowRight)px+=3;px=Math.max(0,Math.min(690,px));vy+=.45;py+=vy;if(py>280){py=280;vy=0;}gems.forEach(g=>{if(g.x>-100){x.fillStyle='#42e8ff';x.beginPath();x.moveTo(g.x,g.y-12);x.lineTo(g.x+10,g.y);x.lineTo(g.x,g.y+12);x.lineTo(g.x-10,g.y);x.closePath();x.fill();if(Math.abs(px-g.x)<20&&Math.abs(py-g.y)<25){g.x=-200;score+=25;}}});x.fillStyle='#ffe47a';x.fillRect(px,py,24,32);x.fillStyle='white';x.font='bold 18px Orbitron';x.fillText('CRISTAUX '+score,20,28);if(gems.every(g=>g.x<0)){x.fillStyle='#020816cc';x.fillRect(0,0,720,390);x.textAlign='center';x.fillStyle='#42e8ff';x.font='bold 30px Orbitron';x.fillText('GROTTE EXPLORÉE !',360,180);x.textAlign='left';}}};});}


function extraArcade(mode){
 const configs={gemtap:{name:'Gem Tap',desc:'Clique sur les gemmes avant la fin des 20 secondes.',time:20},meteordodge:{name:'Meteor Dodge',desc:'Utilise ← → ou A/D pour esquiver les météores.',time:30},numberrush:{name:'Number Rush',desc:'Résous les calculs avant la fin des 30 secondes.',time:30},starcatcher:{name:'Star Catcher',desc:'Déplace le panier avec la souris ou les flèches pour attraper les étoiles.',time:30},colormemory:{name:'Color Memory',desc:'Regarde la séquence de couleurs puis répète-la.',time:0}};
 const cfg=configs[mode];
 if(mode==='numberrush'){
  host.innerHTML='<div class="score-line" id="extra-info">SCORE 0 · TEMPS 30</div><div class="math-card"><div id="extra-question">Prêt ?</div><form id="extra-form"><input id="extra-answer" type="number" inputmode="numeric" placeholder="Réponse" required><button class="feature-button">Valider</button></form><button class="restart-btn" id="extra-start">▶ Démarrer</button><p id="extra-msg" class="game-note"></p></div><p class="game-note">Chaque bonne réponse rapporte 10 points.</p>';
  const info=host.querySelector('#extra-info'),q=host.querySelector('#extra-question'),form=host.querySelector('#extra-form'),inp=host.querySelector('#extra-answer'),start=host.querySelector('#extra-start'),msg=host.querySelector('#extra-msg');let score=0,time=30,a=0,b=0,timer,playing=false;function next(){a=1+Math.random()*12|0;b=1+Math.random()*12|0;q.textContent=a+' × '+b+' = ?';inp.value='';}start.onclick=()=>{clearInterval(timer);score=0;time=30;playing=true;next();timer=setInterval(()=>{time--;info.textContent='SCORE '+score+' · TEMPS '+time;if(time<=0){playing=false;clearInterval(timer);q.textContent='Terminé ! Score : '+score;}},1000)};form.onsubmit=e=>{e.preventDefault();if(!playing)return;if(+inp.value===a*b){score+=10;msg.textContent='Bien joué !'}else msg.textContent='Essaie encore !';info.textContent='SCORE '+score+' · TEMPS '+time;next()};cleanup=()=>clearInterval(timer);return;
 }
 if(mode==='colormemory'){
  host.innerHTML='<div class="score-line" id="cm-score">NIVEAU 1</div><div id="cm-seq" class="game-note">Appuie sur Démarrer et mémorise la séquence.</div><div id="cm-buttons" style="display:grid;grid-template-columns:repeat(2,minmax(90px,140px));gap:10px;justify-content:center;margin:18px"><button data-c="0" style="height:80px;background:#ff5277;border:0;border-radius:14px"></button><button data-c="1" style="height:80px;background:#42e8ff;border:0;border-radius:14px"></button><button data-c="2" style="height:80px;background:#65f6ad;border:0;border-radius:14px"></button><button data-c="3" style="height:80px;background:#b18cff;border:0;border-radius:14px"></button></div><button id="cm-start" class="restart-btn">▶ Démarrer</button>';
  const line=host.querySelector('#cm-score'),msg=host.querySelector('#cm-seq'),buttons=[...host.querySelectorAll('[data-c]')],start=host.querySelector('#cm-start');let seq=[],pos=0,level=1,accept=false,timer;function show(){accept=false;msg.textContent='Observe la séquence…';let i=0;const pulse=()=>{buttons.forEach(b=>b.style.filter='');if(i>=seq.length){accept=true;pos=0;msg.textContent='À toi de répéter !';return}buttons[seq[i]].style.filter='brightness(1.8)';i++;setTimeout(pulse,520)};pulse()}start.onclick=()=>{seq=[];level=1;line.textContent='NIVEAU '+level;seq.push(Math.random()*4|0);show()};buttons.forEach((b)=>b.onclick=()=>{if(!accept)return;if(+b.dataset.c!==seq[pos]){accept=false;msg.textContent='Raté ! Niveau atteint : '+level+'. Appuie sur Démarrer pour rejouer.';return}pos++;if(pos===seq.length){accept=false;level++;line.textContent='NIVEAU '+level;seq.push(Math.random()*4|0);setTimeout(show,450)}});cleanup=()=>{};return;
 }
 if(mode==='gemtap'){
  host.innerHTML='<div class="score-line" id="gem-info">SCORE 0 · TEMPS 20</div><div id="gem-field" style="position:relative;height:300px;overflow:hidden;border:1px solid #25415c;border-radius:14px;background:radial-gradient(circle,#132e50,#071222)"></div><button id="gem-start" class="restart-btn">▶ Démarrer</button><p class="game-note">Clique sur les gemmes qui apparaissent !</p>';const field=host.querySelector('#gem-field'),info=host.querySelector('#gem-info'),start=host.querySelector('#gem-start');let score=0,time=20,timer,spawn,playing=false;function make(){if(!playing)return;const b=document.createElement('button');b.textContent=['💎','✦','🔷'][Math.random()*3|0];b.style.cssText='position:absolute;font-size:28px;background:transparent;border:0;cursor:pointer;left:'+Math.random()*85+'%;top:'+Math.random()*78+'%';b.onclick=()=>{if(playing){score+=5;info.textContent='SCORE '+score+' · TEMPS '+time;b.remove()}};field.appendChild(b);setTimeout(()=>b.remove(),900)}start.onclick=()=>{clearInterval(timer);clearInterval(spawn);field.innerHTML='';score=0;time=20;playing=true;timer=setInterval(()=>{time--;info.textContent='SCORE '+score+' · TEMPS '+time;if(time<=0){playing=false;clearInterval(timer);clearInterval(spawn);field.innerHTML='<p style="text-align:center;padding:100px 10px;color:white">Terminé ! Score : '+score+'</p>'}},1000);spawn=setInterval(make,600)};cleanup=()=>{clearInterval(timer);clearInterval(spawn)};return;
 }
 // Two playable canvas modes: dodge meteors and catch falling stars.
 canvasGame(cfg.name,cfg.desc,(c,x)=>{let px=350,items=[],score=0,t=0,over=false,keys={};return {key:(k,v)=>{keys[k]=v;if(mode==='meteordodge'&&(k==='ArrowLeft'||k==='a')&&v)px=Math.max(25,px-35);if(mode==='meteordodge'&&(k==='ArrowRight'||k==='d')&&v)px=Math.min(695,px+35)},pointer:xx=>px=xx,draw:()=>{x.fillStyle='#071222';x.fillRect(0,0,720,390);for(let i=0;i<60;i++){x.fillStyle='#526b9a';x.fillRect((i*83)%720,(i*47)%390,2,2)}if(!over&&t%30===0)items.push({x:25+Math.random()*670,y:-20,good:mode==='starcatcher'||Math.random()>.25});items.forEach(o=>{o.y+=mode==='starcatcher'?4:3.5;x.font='25px sans-serif';x.fillStyle=o.good?'#ffe47a':'#ff6680';x.fillText(mode==='starcatcher'?(o.good?'⭐':'💫'):'☄️',o.x,o.y);if(o.y>320&&o.y<370&&Math.abs(o.x-px)<30){if(mode==='starcatcher'){score+=10;o.y=450}else over=true}});items=items.filter(o=>o.y<420);if(mode==='starcatcher'){x.fillStyle='#42e8ff';x.fillRect(px-28,345,56,15)}else{x.fillStyle='#42e8ff';x.beginPath();x.moveTo(px,335);x.lineTo(px-17,370);x.lineTo(px+17,370);x.fill()}if(!over)score++;x.fillStyle='white';x.font='bold 20px sans-serif';x.fillText('SCORE '+score,18,28);if(over){x.fillStyle='#020816cc';x.fillRect(80,130,560,120);x.fillStyle='#ff6680';x.textAlign='center';x.font='bold 30px sans-serif';x.fillText('FIN DE PARTIE',360,180);x.fillStyle='white';x.font='18px sans-serif';x.fillText('Score '+score+' · clique pour recommencer',360,215);x.textAlign='left'}t++}}});
}

function royaumePixel(){
 canvasGame('Royaume Pixel','PC : ← → ou Q / D pour courir, ESPACE ou ↑ pour sauter. Téléphone : utilise les boutons tactiles. Ramasse les pièces, évite les créatures et atteins le drapeau !',(c,x)=>{
  const W=720,H=390, gravity=.55;
  let level=1,score=0,lives=3,coins=0,over=false,won=false,keys={},cam=0,frame=0,player,platforms=[],treasures=[],foes=[],flagX=0;
  const levelDefs=[
   {end:1850, gaps:[[360,430],[780,850],[1220,1300]], platforms:[[220,292,100],[500,265,120],[670,300,100],[900,245,125],[1080,285,110],[1370,255,130],[1570,290,100]]},
   {end:2200, gaps:[[300,390],[650,735],[1080,1170],[1570,1650]], platforms:[[170,280,110],[430,250,120],[790,270,120],[960,220,110],[1210,255,120],[1430,230,100],[1710,265,120],[1920,230,100]]},
   {end:2550, gaps:[[350,450],[800,900],[1260,1360],[1730,1830],[2150,2230]], platforms:[[210,260,110],[500,235,120],[690,280,100],[950,230,120],[1110,270,110],[1400,215,130],[1580,260,110],[1870,220,120],[2040,270,100],[2290,235,110]]}
  ];
  function buildLevel(){
   const d=levelDefs[level-1]; flagX=d.end-70; cam=0; over=false; won=false;
   player={x:35,y:285,w:23,h:30,vx:0,vy:0,ground:false,inv:0};
   platforms=[{x:0,y:345,w:d.end+100,h:45,ground:true}];
   d.gaps.forEach(g=>{platforms.push({x:g[0],y:345,w:g[1]-g[0],h:45,ground:true,gap:true})});
   // Ground is split around pits.
   platforms=platforms.filter(p=>!p.gap);
   let cursor=0; const ground=[]; d.gaps.sort((a,b)=>a[0]-b[0]).forEach(g=>{if(g[0]>cursor)ground.push({x:cursor,y:345,w:g[0]-cursor,h:45,ground:true});cursor=g[1]}); if(cursor<d.end+100)ground.push({x:cursor,y:345,w:d.end+100-cursor,h:45,ground:true});
   platforms=ground.concat(d.platforms.map(p=>({x:p[0],y:p[1],w:p[2],h:12,ground:false})));
   treasures=[]; for(let i=130;i<d.end-100;i+=115){let py=300;const plat=d.platforms.find(p=>i>p[0]-10&&i<p[0]+p[2]+10);if(plat)py=plat[1]-25;treasures.push({x:i,y:py,got:false,phase:Math.random()*6});}
   foes=[]; for(let i=260;i<d.end-150;i+=250){if(d.gaps.some(g=>i>g[0]-35&&i<g[1]+35))continue;foes.push({x:i,y:315,w:25,h:25,vx:(i%2?1:-1)*(.8+level*.18),left:i-65,right:i+65,alive:true});}
  }
  buildLevel();
  const controls=document.createElement('div'); controls.className='game-controls'; controls.setAttribute('aria-label','Commandes tactiles');
  controls.style.cssText='display:flex;justify-content:space-between;gap:10px;max-width:440px;margin:10px auto 0;touch-action:none;';
  controls.innerHTML='<div style="display:flex;gap:8px"><button type="button" data-pgkey="left" aria-label="Aller à gauche">◀</button><button type="button" data-pgkey="right" aria-label="Aller à droite">▶</button></div><button type="button" data-pgkey="jump" aria-label="Sauter" style="background:#43276b;border-color:#b58aff">SAUT</button>';
  host.appendChild(controls);
  controls.querySelectorAll('button').forEach(b=>{const k=b.dataset.pgkey;const down=e=>{e.preventDefault();keys[k]=true;if(k==='jump')keys.jumpPressed=true;};const up=e=>{e.preventDefault();keys[k]=false;};b.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,up));});
  function reset(){score=0;coins=0;lives=3;level=1;keys={};buildLevel();}
  function finish(){over=true;const best=Number(localStorage.getItem('pg_royaume_pixel_best')||0);if(score>best)localStorage.setItem('pg_royaume_pixel_best',String(score));}
  function draw(){
   frame++; x.clearRect(0,0,W,H);
   const sky=x.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#17265a');sky.addColorStop(1,'#65bce8');x.fillStyle=sky;x.fillRect(0,0,W,H);
   // Pixel clouds and distant hills
   for(let i=0;i<8;i++){const cx=((i*145-cam*.22)%850+850)%850-60;x.fillStyle='#ffffff35';x.fillRect(cx,45+(i%3)*24,48,13);x.fillRect(cx+12,34+(i%3)*24,24,13);}
   for(let i=0;i<6;i++){const hx=((i*180-cam*.12)%1000+1000)%1000-100;x.fillStyle=i%2?'#377a89':'#286b80';x.beginPath();x.moveTo(hx,345);x.lineTo(hx+80,220);x.lineTo(hx+160,345);x.fill();}
   x.save();x.translate(-cam,0);
   // platforms
   platforms.forEach(p=>{x.fillStyle=p.ground?'#7b4b2b':'#87512f';x.fillRect(p.x,p.y,p.w,p.h);x.fillStyle='#58d66d';x.fillRect(p.x,p.y,p.w,7);x.fillStyle='#b87943';for(let bx=p.x+8;bx<p.x+p.w-5;bx+=24)x.fillRect(bx,p.y+14,12,5);});
   // coins
   treasures.forEach(t=>{if(t.got)return;const bob=Math.sin(frame*.08+t.phase)*3;x.fillStyle='#ffdb4d';x.shadowColor='#ffb800';x.shadowBlur=10;x.beginPath();x.ellipse(t.x,t.y+bob,7,10,0,0,Math.PI*2);x.fill();x.shadowBlur=0;x.strokeStyle='#fff3a0';x.stroke();});
   // enemies
   foes.forEach(f=>{if(!f.alive)return;x.fillStyle='#7b3fbc';x.fillRect(f.x,f.y+5,f.w,f.h-5);x.fillStyle='#c78cff';x.fillRect(f.x+3,f.y,f.w-6,8);x.fillStyle='#fff';x.fillRect(f.x+5,f.y+9,5,6);x.fillRect(f.x+16,f.y+9,5,6);x.fillStyle='#222';x.fillRect(f.x+7,f.y+11,2,3);x.fillRect(f.x+18,f.y+11,2,3);});
   // goal flag
   x.fillStyle='#eaf6ff';x.fillRect(flagX,230,5,115);x.fillStyle='#ff5ac8';x.beginPath();x.moveTo(flagX+5,232);x.lineTo(flagX+50,247);x.lineTo(flagX+5,265);x.fill();x.fillStyle='#ffe47a';x.fillRect(flagX-7,342,20,5);
   // player: original little explorer, not a copyrighted character
   if(player.inv<=0||Math.floor(frame/5)%2===0){x.fillStyle='#26345c';x.fillRect(player.x+2,player.y+20,8,10);x.fillRect(player.x+14,player.y+20,8,10);x.fillStyle='#2ce0ff';x.fillRect(player.x,player.y+7,player.w,16);x.fillStyle='#ffd1a1';x.fillRect(player.x+3,player.y,17,13);x.fillStyle='#ff6f91';x.fillRect(player.x+1,player.y-3,21,6);x.fillStyle='#15213c';x.fillRect(player.x+14,player.y+4,3,4);}
   x.restore();
   if(!over&&!won){
    const left=keys.left||keys.ArrowLeft||keys.q||keys.Q||keys.a||keys.A, right=keys.right||keys.ArrowRight||keys.d||keys.D;
    player.vx=left?-3.2:right?3.2:0;player.x+=player.vx;player.vy=Math.min(12,player.vy+gravity);const oldY=player.y;player.y+=player.vy;player.ground=false;
    platforms.forEach(p=>{if(player.x+player.w>p.x&&player.x<p.x+p.w&&oldY+player.h<=p.y+4&&player.y+player.h>=p.y&&player.vy>=0){player.y=p.y-player.h;player.vy=0;player.ground=true;}});
    if((keys.jump||keys.jumpPressed||keys[' ']||keys.ArrowUp||keys.w||keys.W)&&player.ground){player.vy=-10.8;player.ground=false;keys.jumpPressed=false;}
    if(player.inv>0)player.inv--;
    treasures.forEach(t=>{if(!t.got&&Math.abs((player.x+player.w/2)-t.x)<19&&Math.abs((player.y+player.h/2)-t.y)<25){t.got=true;coins++;score+=10;}});
    foes.forEach(f=>{if(!f.alive)return;f.x+=f.vx;if(f.x<f.left||f.x>f.right)f.vx*=-1;if(player.x+player.w>f.x&&player.x<f.x+f.w&&player.y+player.h>f.y&&player.y<f.y+f.h){if(player.vy>1&&oldY+player.h<=f.y+9){f.alive=false;player.vy=-7;score+=50;}else if(player.inv===0){lives--;player.inv=100;player.vy=-5;if(lives<=0)finish();}}});
    if(player.y>H+60){lives--;if(lives<=0)finish();else{player.x=Math.max(25,player.x-100);player.y=250;player.vy=0;player.inv=90;}}
    if(player.x>flagX){if(level<3){level++;score+=100;buildLevel();}else{won=true;finish();}}
    cam=Math.max(0,Math.min(flagX-W+110,player.x-220));
   }
   x.fillStyle='#071222dd';x.fillRect(10,10,300,58);x.fillStyle='#fff';x.font='bold 16px sans-serif';x.fillText('MONDES '+level+'/3   •   PIÈCES '+coins,22,33);x.fillText('SCORE '+score+'   •   VIES '+('♥'.repeat(Math.max(0,lives))),22,55);
   if(over||won){x.fillStyle='#071222df';x.fillRect(95,105,530,180);x.textAlign='center';x.fillStyle=won?'#ffe47a':'#ff83c9';x.font='bold 30px sans-serif';x.fillText(won?'ROYAUME TERMINÉ !':'PARTIE TERMINÉE',360,155);x.fillStyle='#fff';x.font='19px sans-serif';x.fillText('Score : '+score+'  •  Pièces : '+coins,360,190);x.font='16px sans-serif';x.fillText('Appuie sur RECOMMENCER pour rejouer',360,225);x.textAlign='left';}
  }
  return {draw,key:(k,v)=>{keys[k]=v;if((k===' '||k==='ArrowUp'||k==='w'||k==='W')&&v)keys.jumpPressed=true;},pointer:()=>{}};
 });
}

function launch(game){
 cleanup(); title.textContent=({gemtap:'Gem Tap',meteordodge:'Meteor Dodge',numberrush:'Number Rush',starcatcher:'Star Catcher',colormemory:'Color Memory',gemrush:'Gem Rush',meteorzero:'Meteor Zero',quizflash:'Quiz Flash',panierstellar:'Panier Stellaire',memoirecosmique:'Mémoire Cosmique',racer:'Neon Racer',royaumePixel:'Royaume Pixel',jumper:'Pixel Jumper',blaster:'Star Blaster',memory:'Memory Matrix',mahjong:'Mahjong Neon',dino:'Dino Dash',flappy:'Flappy Rocket',bricks:'Brick Breaker',mole:'Critter Pop',snake:'Snake Neon',ttt:'Tic Tac Toe',reaction:'Reflex Rush',pong:'Neon Pong',blocks:'Block Master',invaders:'Space Invaders',math:'Math Sprint',color:'Color Tap',orbit:'Orbit Catch',cave:'Cave Explorer'})[game]||'Jeu';
 help.textContent=({gemtap:'Clique sur les gemmes pour marquer des points.',meteordodge:'Esquive les météores.',numberrush:'Résous des calculs rapidement.',starcatcher:'Attrape les étoiles.',colormemory:'Répète la séquence de couleurs.',gemrush:'Clique sur les gemmes avant la fin du chrono.',meteorzero:'Esquive les météores et survis.',quizflash:'Enchaîne les calculs en temps limité.',panierstellar:'Attrape les étoiles qui tombent.',memoirecosmique:'Répète la séquence de couleurs.',racer:'Évite les obstacles !',royaumePixel:'Plateforme à défilement horizontal : pièces, ennemis et trois mondes.',jumper:'Grimpe le plus haut possible !',blaster:'Survis dans l’espace !',memory:'Retrouve toutes les paires !',mahjong:'Mahjong solitaire avec 100 niveaux et sauvegarde automatique.',dino:'Saute par-dessus les obstacles et bats ton record.',flappy:'Passe entre les portails sans les toucher.',bricks:'Casse toutes les briques avec la balle.',mole:'Attrape les créatures avant la fin du temps.',snake:'Mange les étoiles et bats ton record !',ttt:'Aligne trois symboles contre l’IA.',reaction:'Teste ta vitesse de réaction !',pong:'Bats l’ordinateur au ping-pong !',blocks:'Place les blocs et complète les lignes !',invaders:'Défends la planète contre les aliens.',math:'Résous des calculs en 30 secondes.',color:'Teste tes réflexes et clique sur la zone de couleur.',orbit:'Attrape les étoiles et évite les météores.',cave:'Explore la grotte et collecte les cristaux.'})[game]||'Amuse-toi bien !';
 ({gemtap:()=>extraArcade('gemtap'),meteordodge:()=>extraArcade('meteordodge'),numberrush:()=>extraArcade('numberrush'),starcatcher:()=>extraArcade('starcatcher'),colormemory:()=>extraArcade('colormemory'),gemrush:()=>extraArcade('gemtap'),meteorzero:()=>extraArcade('meteordodge'),quizflash:()=>extraArcade('numberrush'),panierstellar:()=>extraArcade('starcatcher'),memoirecosmique:()=>extraArcade('colormemory'),racer, royaumePixel, jumper, blaster, memory, mahjong, dino:dinoDash, flappy:flappyRocket, bricks:brickBreaker, mole:whackMole, snake, ttt:tictactoe, reaction, pong:neonPong, blocks:blockMaster,invaders:spaceInvaders,math:mathSprint,color:colorTap,orbit:orbitCatch,cave:caveExplorer})[game]?.();
}
window.PlanetGames={launch,restart:()=>{const game=window.currentGame;if(game)launch(game);}};
window.addEventListener('beforeunload',()=>cleanup());
})();