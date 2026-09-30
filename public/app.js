'use strict';

const games={
  '5812047309218':{
    name:'2048',kind:'PUZZLE',mode:'local',path:'games/2048/index.html',
    controls:'Arrow keys / WASD / swipe to move',
    source:'LOCAL · MIT-LICENSED ENGINE',
    official:'https://github.com/gabrielecirulli/2048'
  },
  '9482715603327':{
    name:'Cookie Clicker',kind:'IDLE',mode:'external',
    controls:'Mouse / touch · progress is handled by the original site',
    source:'EXTERNAL · ORTEIL / DASHNET',
    official:'https://orteil.dashnet.org/cookieclicker/'
  },
  '7259031846612':{
    name:'Slither.io',kind:'MULTIPLAYER',mode:'external',
    controls:'Mouse / touch · controls come from the original game',
    source:'EXTERNAL · SLITHER.IO',
    official:'https://slither.io/'
  },
  '5116842209374':{
    name:'Zombs Royale',kind:'BATTLE ROYALE',mode:'external',
    controls:'Keyboard / mouse · controls come from the original game',
    source:'EXTERNAL · ZOMBSROYALE.IO',
    official:'https://zombsroyale.io/'
  },
  '8824156073139':{
    name:'Hextris',kind:'PUZZLE',mode:'external',
    controls:'Arrow keys / touch · original open-source build',
    source:'EXTERNAL · ORIGINAL GPL BUILD',
    official:'https://hextris.github.io/hextris/'
  },
  '3468201975541':{
    name:'Agar.io',kind:'MULTIPLAYER',mode:'external',
    controls:'Mouse / touch · controls come from the original game',
    source:'EXTERNAL · AGAR.IO',
    official:'https://agar.io/'
  }
};

let current='5812047309218';
const frame=document.getElementById('game-frame');
const gate=document.getElementById('external-gate');
const openOriginal=document.getElementById('open-original');
const gateOriginal=document.getElementById('gate-original');

function routeFor(id){
  const base=new URL('.',location.href);
  return new URL('g/'+id+'/',base).href;
}

function selectGame(id,{updateHash=true}={}){
  const game=games[id];
  if(!game)return;
  current=id;

  document.querySelectorAll('[data-game]').forEach(button=>{
    const active=button.dataset.game===id;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });

  document.getElementById('game-name').textContent=game.name;
  document.getElementById('game-kind').textContent=game.kind;
  document.getElementById('controls').textContent=game.controls;
  document.getElementById('source-status').textContent=game.source;

  openOriginal.href=game.official;
  openOriginal.hidden=game.mode==='local';

  if(game.mode==='local'){
    gate.hidden=true;
    frame.hidden=false;
    if(!frame.src.endsWith(game.path)) frame.src=game.path;
    frame.title=game.name+' game';
  }else{
    frame.src='about:blank';
    frame.hidden=false;
    gate.hidden=false;
    document.getElementById('gate-title').textContent='Load '+game.name;
    document.getElementById('gate-copy').textContent=game.name+' is hosted by its original publisher. Loading it connects directly to '+new URL(game.official).hostname+'.';
    gateOriginal.href=game.official;
  }

  if(updateHash) history.replaceState(null,'','#'+id);
  syncAdmin();
}

function loadExternal(){
  const game=games[current];
  if(!game||game.mode!=='external')return;
  gate.hidden=true;
  frame.src=game.official;
  frame.title=game.name+' original game';
}

document.querySelectorAll('[data-game]').forEach(button=>button.addEventListener('click',()=>selectGame(button.dataset.game)));
document.getElementById('load-external').addEventListener('click',loadExternal);

const initial=location.hash.slice(1);
if(games[initial]) selectGame(initial,{updateHash:false});

document.getElementById('fullscreen').addEventListener('click',async()=>{
  try{
    if(document.fullscreenElement) await document.exitFullscreen();
    else await document.getElementById('player').requestFullscreen();
  }catch{
    document.getElementById('fullscreen').textContent='Fullscreen unavailable';
  }
});

const search=document.getElementById('game-search');
search.addEventListener('input',()=>{
  const q=search.value.trim().toLowerCase();
  let count=0;
  document.querySelectorAll('.game-card').forEach(card=>{
    const show=!q||card.dataset.search.includes(q);
    card.hidden=!show;
    if(show)count++;
  });
  document.getElementById('visible-count').textContent=String(count).padStart(2,'0');
});

document.getElementById('random-game').addEventListener('click',()=>{
  const visible=[...document.querySelectorAll('.game-card:not([hidden])')];
  if(!visible.length)return;
  const candidates=visible.filter(b=>b.dataset.game!==current);
  const pick=(candidates.length?candidates:visible)[Math.floor(Math.random()*(candidates.length||visible.length))];
  selectGame(pick.dataset.game);
  pick.scrollIntoView({block:'nearest'});
});

const adminPeek=document.getElementById('admin-peek');
const adminPanel=document.getElementById('admin-panel');
const adminSelect=document.getElementById('admin-game');

Object.entries(games).forEach(([id,game])=>{
  const option=document.createElement('option');
  option.value=id;
  option.textContent=game.name+' · '+id;
  adminSelect.append(option);
});

function nearBottom(){
  return window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-90;
}
function updateAdminPeek(){adminPeek.classList.toggle('armed',nearBottom())}
addEventListener('scroll',updateAdminPeek,{passive:true});
addEventListener('resize',updateAdminPeek);
updateAdminPeek();

function openAdmin(){
  adminPanel.hidden=false;
  adminSelect.value=current;
  syncAdmin();
}
function syncAdmin(){
  if(!adminSelect)return;
  adminSelect.value=current;
  document.getElementById('admin-route').textContent=routeFor(current);
}
adminPeek.addEventListener('click',openAdmin);
document.getElementById('admin-close').addEventListener('click',()=>adminPanel.hidden=true);
adminSelect.addEventListener('change',()=>{current=adminSelect.value;syncAdmin()});
document.getElementById('admin-jump').addEventListener('click',()=>selectGame(adminSelect.value));
document.getElementById('admin-official').addEventListener('click',()=>{
  const game=games[adminSelect.value];
  window.open(game.official,'_blank','noopener,noreferrer');
});
document.getElementById('admin-copy').addEventListener('click',async()=>{
  const value=routeFor(adminSelect.value);
  try{
    await navigator.clipboard.writeText(value);
    document.getElementById('admin-copy').textContent='Copied';
    setTimeout(()=>document.getElementById('admin-copy').textContent='Copy route',1000);
  }catch{
    document.getElementById('admin-route').textContent=value;
  }
});
document.addEventListener('keydown',event=>{
  if(event.shiftKey&&event.key.toLowerCase()==='a'){
    event.preventDefault();
    adminPanel.hidden?openAdmin():adminPanel.hidden=true;
  }
});
