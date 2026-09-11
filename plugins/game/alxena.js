// plugins/game/alxena.js
// 🎮 ALXENA Game Center — Dino Runner, Tic Tac Toe, Doom

import { sendAIRich } from '../../lib/AIRich.js'

export default {
    command: ['alxena', 'gamecenter', 'alxenagames'],
    category: 'game',
    description: '🎮 Mainkan Dino Runner, Tic Tac Toe, dan Doom di ALXENA Game Center!',
    async run(m, { sock }) {
        const hardScrollLock = String.raw`<style>
html,body{width:100%!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important;position:fixed!important;inset:0!important;overscroll-behavior:none!important;touch-action:none!important;-webkit-overflow-scrolling:none!important;}
html *,body *{touch-action:none;}
</style><script>
(()=>{
 const stop=e=>{if(e.cancelable)e.preventDefault();};
 ['touchmove','touchstart','touchend','gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,stop,{capture:true,passive:false}));
 document.documentElement.style.overflow='hidden';
 document.body && (document.body.style.overflow='hidden');
})();
</script>`;

        const targetChat = m.chat;

        // ========== HTML GAME PAYLOADS (pakai String.raw biar aman) ==========
        const dinoHtml = String.raw`<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}</style>
<body style="margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:none;overscroll-behavior:none;overflow:hidden;cursor:pointer">
<div style="width:100%;max-width:620px;margin:auto;padding:16px;box-sizing:border-box">
<div style="background:rgba(255,255,255,.06);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.15);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.35)">
<div style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center">
<div><div style="font-size:11px;letter-spacing:1.5px;color:rgba(255,255,255,.45)">ALXENA DINO</div><div style="font-size:21px;font-weight:bold;color:#fff">Dino Runner</div></div>
<div style="text-align:right"><div id="score" style="font-size:18px;font-weight:bold;color:#fff;text-shadow:0 0 10px rgba(108,92,231,.85);transition:transform .15s">00000</div><div id="best" style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px">BEST 00000</div></div>
</div>
<div style="padding:18px">
<canvas id="game" width="560" height="190" style="width:100%;height:auto;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.12);border-radius:12px;display:block"></canvas>
<div id="status" style="text-align:center;margin-top:10px;font-size:12px;color:rgba(255,255,255,.55)">Speed 5.0x</div>
</div></div></div>
<script>
const c=document.getElementById('game'),x=c.getContext('2d'),scoreEl=document.getElementById('score'),bestEl=document.getElementById('best'),statusEl=document.getElementById('status');
const GY=170;
let d,o,clouds,particles,ambient,trail,score,best=0,speed,gameOver,last,shake,flash,runT,spawnTimer,milestone,squash;
function loadBest(){
let vals=[];
try{let v=localStorage.getItem('alxena_dino_best');if(v)vals.push(parseInt(v,10))}catch(e){}
try{let v=sessionStorage.getItem('alxena_dino_best');if(v)vals.push(parseInt(v,10))}catch(e){}
try{let m=document.cookie.match(/(?:^|;\\s*)dino_best=(\\d+)/);if(m)vals.push(parseInt(m[1],10))}catch(e){}
return vals.length?Math.max(...vals.filter(v=>!isNaN(v))):0
}
function saveBest(v){
let val=String(Math.floor(v));
try{localStorage.setItem('alxena_dino_best',val)}catch(e){}
try{sessionStorage.setItem('alxena_dino_best',val)}catch(e){}
try{document.cookie='alxena_dino_best='+val+';max-age=31536000;path=/'}catch(e){}
try{
let rq=indexedDB.open('alxena_dino_db',1);
rq.onupgradeneeded=()=>{rq.result.createObjectStore('kv')};
rq.onsuccess=()=>{try{rq.result.transaction('kv','readwrite').objectStore('kv').put(val,'alxena_dino_best')}catch(e){}}
}catch(e){}
}
function loadBestAsync(cb){
try{
let rq=indexedDB.open('alxena_dino_db',1);
rq.onupgradeneeded=()=>{rq.result.createObjectStore('kv')};
rq.onsuccess=()=>{
try{
let gr=rq.result.transaction('kv','readonly').objectStore('kv').get('alxena_dino_best');
gr.onsuccess=()=>{if(gr.result)cb(parseInt(gr.result,10))}
}catch(e){}
}
}catch(e){}
}
best=loadBest();
loadBestAsync(v=>{if(!isNaN(v)&&v>best){best=v;bestEl.textContent='BEST '+String(Math.floor(best)).padStart(5,'0')}});
function reset(){
d={x:55,y:132,w:27,h:30,vy:0,jumping:false};
o=[];
clouds=[{x:120,y:32,w:44,s:.35},{x:300,y:52,w:60,s:.22},{x:460,y:26,w:36,s:.4},{x:560,y:70,w:50,s:.18}];
particles=[];
trail=[];
if(!ambient){ambient=[];for(let i=0;i<18;i++)ambient.push({x:Math.random()*c.width,y:Math.random()*c.height,r:.5+Math.random()*1.5,vx:.1+Math.random()*.3,ph:Math.random()*10})}
score=0;speed=5;gameOver=false;last=0;shake=0;flash=0;runT=0;milestone=0;squash=1;
spawnTimer=70+Math.random()*30;
bestEl.textContent='BEST '+String(Math.floor(best)).padStart(5,'0');
statusEl.textContent='Speed 5.0x'
}
function burst(px,py,n,col,spd){for(let i=0;i<n;i++)particles.push({x:px,y:py,vx:(Math.random()-.5)*spd,vy:-Math.random()*spd,life:1,col,size:2+Math.random()*2})}
function jumpDino(){
if(gameOver){reset();return}
if(!d.jumping){d.jumping=true;d.vy=-13;squash=.7;burst(d.x+13,d.y+30,10,'255,255,255',4)}
}
function cactus(){
let h=24+Math.random()*24;
o.push({x:c.width+20,y:GY-h,w:16+Math.random()*6,h});
if(Math.random()<.22){o.push({x:c.width+20+34+Math.random()*10,y:GY-(20+Math.random()*18),w:16,h:20+Math.random()*18})}
}
function hit(a,b){return a.x+4<b.x+b.w&&a.x+a.w-4>b.x&&a.y+4<b.y+b.h&&a.y+a.h>b.y}
function drawTrail(){
trail.forEach((p,i)=>{x.fillStyle='rgba(108,92,231,'+(.25*(i/trail.length))+')';x.fillRect(p.x,p.y,27,30)})
}
function drawDino(){
x.save();
let cx=d.x+13,cy=d.y+30;
x.translate(cx,cy);
x.scale(1/squash,squash);
x.translate(-cx,-cy);
let legOff=d.jumping?0:Math.sin(runT*.5)*5;
x.fillStyle='#eaeaea';
x.fillRect(d.x,d.y,27,30);
x.fillRect(d.x+22,d.y+5,13,18);
x.fillStyle='#6c5ce7';
x.fillRect(d.x+29,d.y+8,4,4);
x.fillStyle='#eaeaea';
x.fillRect(d.x+5,d.y+30,6,8+legOff);
x.fillRect(d.x+20,d.y+30,6,8-legOff);
x.restore()
}
function drawCactus(q){
x.save();
x.shadowColor='rgba(255,90,90,.35)';x.shadowBlur=10;
x.fillStyle='#e17a7a';
x.fillRect(q.x,q.y,q.w,q.h);
x.fillRect(q.x-7,q.y+10,7,6);
x.fillRect(q.x-7,q.y+4,6,12);
x.fillRect(q.x+q.w,q.y+18,7,6);
x.fillRect(q.x+q.w+1,q.y+12,6,12);
x.restore()
}
function drawParticles(){
particles.forEach(p=>{x.fillStyle='rgba('+p.col+','+Math.max(p.life,0)+')';x.fillRect(p.x,p.y,p.size,p.size)})
}
function drawAmbient(){
ambient.forEach(p=>{let a=.15+Math.sin(runT*.05+p.ph)*.1;x.fillStyle='rgba(180,160,255,'+a+')';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()})
}
function draw(){
x.clearRect(0,0,c.width,c.height);
x.save();
if(shake>0)x.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
drawAmbient();
x.fillStyle='rgba(255,255,255,.35)';
clouds.forEach(q=>{let b=Math.sin(runT*.03+q.x)*2;x.fillRect(q.x,q.y+b,q.w,5);x.fillRect(q.x+10,q.y+b-5,q.w*.45,10)});
x.strokeStyle='rgba(255,255,255,.25)';
x.lineWidth=2;
x.setLineDash([10,8]);
x.lineDashOffset=-runT*speed*.6;
x.beginPath();x.moveTo(0,GY);x.lineTo(c.width,GY);x.stroke();
x.setLineDash([]);
drawTrail();
drawDino();
o.forEach(drawCactus);
drawParticles();
if(flash>0){x.fillStyle='rgba(255,60,60,'+(flash*.35)+')';x.fillRect(0,0,c.width,c.height)}
x.restore();
if(gameOver){
x.fillStyle='rgba(15,15,25,.55)';x.fillRect(0,0,c.width,c.height);
x.fillStyle='#fff';x.textAlign='center';
x.font='bold 24px Arial';x.fillText('GAME OVER',c.width/2,85);
x.font='14px Arial';x.fillText('Tap layar untuk main lagi',c.width/2,112);
x.textAlign='left'
}
}
function loop(t){
if(!last)last=t;
let dt=Math.min((t-last)/16.67,2);
last=t;
runT+=dt;
if(!gameOver){
d.y+=d.vy*dt;d.vy+=.75*dt;
if(d.y>=132){
if(d.jumping){burst(d.x+13,GY,10,'255,255,255',3.5);squash=1.35}
d.y=132;d.vy=0;d.jumping=false
}
if(d.jumping)trail.push({x:d.x,y:d.y});
if(trail.length>6)trail.shift();
if(!d.jumping)trail.length=0;
squash+=(1-squash)*.18*dt;
if(!d.jumping&&Math.floor(runT)%8===0&&Math.random()<.4)burst(d.x+6,GY-2,1,'255,255,255',1.5);
ambient.forEach(p=>{p.x-=p.vx*dt;if(p.x<-4)p.x=c.width+4});
spawnTimer-=dt;
if(spawnTimer<=0){cactus();spawnTimer=Math.max(38,62-speed*1.4)+Math.random()*30}
o.forEach(q=>q.x-=speed*dt);
o=o.filter(q=>q.x>-40);
clouds.forEach(q=>{q.x-=q.s*dt;if(q.x<-80)q.x=c.width+Math.random()*100});
particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.3*dt;p.life-=.03*dt});
particles=particles.filter(p=>p.life>0);
speed=Math.min(11,speed+.0018*dt);
score+=dt*.6;
if(score>best)best=score;
if(Math.floor(score/500)>milestone){
milestone=Math.floor(score/500);
scoreEl.style.transform='scale(1.35)';
setTimeout(()=>scoreEl.style.transform='scale(1)',150)
}
scoreEl.textContent=String(Math.floor(score)).padStart(5,'0');
bestEl.textContent='BEST '+String(Math.floor(best)).padStart(5,'0');
statusEl.textContent='Speed '+speed.toFixed(1)+'x';
for(const q of o)if(hit(d,q)){
gameOver=true;shake=14;flash=1;
saveBest(best);
burst(d.x+13,d.y+15,18,'255,90,90',5)
}
}
if(shake>0)shake=Math.max(0,shake-.6*dt);
if(flash>0)flash=Math.max(0,flash-.05*dt);
draw();
requestAnimationFrame(loop)
}
document.addEventListener('pointerdown',e=>{e.preventDefault();jumpDino()});
document.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();jumpDino()}});
reset();
requestAnimationFrame(loop);
</script></body>`;

        const ticTacToeHtml = String.raw`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tic-Tac-Toe — Dark</title>
<style>
:root{
 --bg:transparent;
 --card:transparent;
 --card-2:#2a3942;
 --ink:#e9edef;
 --ink-soft:#aebac1;
 --muted:#8696a0;
 --accent:#00a884;
 --accent-2:#008069;
 --line:#2a3942;
 --line-strong:#374248;
 --cell-bg:#111b21;
 --o:#00a884;
 --x:#e9edef;
 --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{
 background:transparent;
 color:var(--ink);
 font-family:var(--sys);
 min-height:100vh;
 overflow-x:hidden;
 -webkit-font-smoothing:antialiased;
}

.stage{
 min-height:100vh;
 display:flex;flex-direction:column;
 align-items:center;justify-content:center;
 padding:12px 16px;
}

.card{
 width:100%;
 max-width:280px; 
}

.header{
 display:flex;align-items:baseline;justify-content:space-between;
 margin-bottom:10px;padding-bottom:8px;
 border-bottom:1px solid var(--line);
 gap:8px;
}
.header__title{
 font-size:17px;font-weight:600;
 color:var(--ink);letter-spacing:-.005em;
}
.header__sub{font-size:12px;color:var(--muted)}

.status{
 display:flex;align-items:center;justify-content:space-between;
 margin-bottom:10px;font-size:13px;gap:8px;
}
.status__turn{display:flex;align-items:center;gap:8px;color:var(--ink-soft)}
.status__indicator{
 width:9px;height:9px;border-radius:50%;
 background:var(--x);
 position:relative;flex-shrink:0;
 transition:background .2s ease;
}
.status__indicator.is-o{background:var(--o)}
.status__indicator.is-thinking::after{
 content:'';position:absolute;inset:-3px;
 border-radius:50%;border:1.5px solid var(--o);
 animation:ring 1.1s ease-out infinite;
}
@keyframes ring{
 0%{transform:scale(.7);opacity:1}
 100%{transform:scale(2.2);opacity:0}
}
.status__score{
 display:flex;gap:12px;
 font-variant-numeric:tabular-nums;
 color:var(--muted);font-size:12px;
}
.status__score b{
 color:var(--ink);font-weight:600;margin-left:3px;
}

.board{
 width:100%;aspect-ratio:1;
 position:relative;
 display:grid;
 grid-template-columns:1fr 1fr 1fr;
 grid-template-rows:1fr 1fr 1fr;
 background:var(--cell-bg);
 border-radius:8px;overflow:hidden;
 border:1px solid var(--line);
}
.cell{
 position:relative;background:transparent;border:none;
 cursor:pointer;padding:0;
 font-family:inherit;color:inherit;
}
.cell:disabled{cursor:default}
.cell:focus-visible{outline:2px solid var(--accent);outline-offset:-3px}
.cell::before{
 content:'';position:absolute;right:0;top:6%;bottom:6%;
 width:1px;background:var(--line-strong);
}
.cell:nth-child(3n)::before{display:none}
.cell::after{
 content:'';position:absolute;bottom:0;left:6%;right:6%;
 height:1px;background:var(--line-strong);
}
.cell:nth-last-child(-n+3)::after{display:none}
.cell.is-winning{background:rgba(0,168,132,0.14)}
.cell.is-winning-x{background:rgba(233,237,239,0.07)}

.mark{position:absolute;inset:22%;pointer-events:none}
.mark__svg{width:100%;height:100%;overflow:visible}
.mark__svg path,.mark__svg circle{
 fill:none;stroke:var(--x);stroke-width:9;
 stroke-linecap:round;
}
.mark--o .mark__svg path,.mark--o .mark__svg circle{stroke:var(--o)}
.mark__svg path{
 stroke-dasharray:120;stroke-dashoffset:120;
 animation:draw .3s ease-out forwards;
}
.mark__svg path:nth-child(2){animation-delay:.12s}
.mark__svg circle{
 stroke-dasharray:220;stroke-dashoffset:220;
 animation:draw .4s ease-out forwards;
}
@keyframes draw{to{stroke-dashoffset:0}}

.winning-line{
 position:absolute;height:4px;
 background:var(--o);
 transform-origin:left center;
 z-index:5;pointer-events:none;
 border-radius:2px;
}
.winning-line.is-x{background:var(--x)}

.levels{margin-top:10px}
.levels__label{
 font-size:11px;color:var(--muted);
 margin-bottom:6px;
}
.levels__list{
 display:flex;
 flex-wrap:nowrap;
 gap:8px;
 overflow-x:auto;
 overflow-y:hidden;
 -webkit-overflow-scrolling:touch;
 scrollbar-width:none;
 -ms-overflow-style:none;
 padding:2px 2px 4px;
 margin:0 -2px;
}
.levels__list::-webkit-scrollbar{
 display:none;
}
.level{
 background:transparent;
 border:1px solid var(--line-strong);
 border-radius:20px;
 padding:8px 14px;
 font-size:12px;font-weight:500;
 color:var(--ink-soft);
 cursor:pointer;
 font-family:inherit;
 transition:color .15s ease,border-color .15s ease,background .15s ease;
 white-space:nowrap;
 flex-shrink:0;
}
.level:hover{color:var(--ink);border-color:var(--ink-soft)}
.level.is-active{
 background:var(--accent);
 border-color:var(--accent);
 color:#0b141a;
}
.level:focus-visible{outline:2px solid var(--accent);outline-offset:1px}

.footer{
 margin-top:8px;
 display:flex;justify-content:center;
}
.footer__reset{
 background:none;border:none;
 color:var(--accent);
 font-family:inherit;
 font-size:13px;font-weight:500;
 cursor:pointer;
 padding:8px 16px;
 transition:color .15s ease;
}
.footer__reset:hover{color:var(--ink)}
.footer__reset:focus-visible{outline:2px solid var(--accent);outline-offset:1px}

.modal{
 position:fixed;inset:0;z-index:50;
 display:flex;align-items:center;justify-content:center;
 padding:24px;
 opacity:0;pointer-events:none;
 transition:opacity .3s ease;
}
.modal.is-open{opacity:1;pointer-events:auto}
.modal__backdrop{
 position:absolute;inset:0;
 background:transparent;
}
.modal__card{
 position:relative;
 background:var(--card-2);
 border-radius:12px;
 padding:24px 24px 0;
 text-align:center;
 max-width:300px;width:100%;
 box-shadow:0 24px 50px -12px rgba(0,0,0,0.6);
 transform:translateY(8px) scale(.96);
 transition:transform .35s cubic-bezier(.34,1.56,.64,1);
 overflow:hidden;
}
.modal.is-open .modal__card{transform:translateY(0) scale(1)}
.modal__title{
 font-size:20px;font-weight:700;
 letter-spacing:-.015em;
 color:var(--ink);margin-bottom:8px;line-height:1.25;
}
.modal__title.is-o{color:var(--o)}
.modal__sub{
 font-size:14px;color:var(--muted);
 margin-bottom:20px;line-height:1.4;
}
.modal__retry{
 background:transparent;border:none;
 color:var(--accent);
 font-family:inherit;
 font-size:16px;font-weight:600;
 letter-spacing:-.005em;
 cursor:pointer;
 padding:14px 24px;
 width:100%;
 border-top:1px solid var(--line-strong);
 transition:color .15s ease;
}
.modal__retry:hover{color:var(--ink)}
.modal__retry:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}

@media (max-width:380px){
 .stage{padding:12px 10px}
 .level{padding:7px 12px;font-size:11px}
 .modal__title{font-size:18px}
}
@media (prefers-reduced-motion:reduce){
 *,*::before,*::after{
 animation-duration:.01ms!important;
 animation-iteration-count:1!important;
 transition-duration:.01ms!important;
 }
}
</style>
</head>
<body>
<main class="stage">
 <div class="card">
 <div class="header">
 <div class="header__title">Tic-Tac-Toe</div>
 <div class="header__sub">Melawan AI</div>
 </div>

 <div class="status" aria-live="polite">
 <div class="status__turn">
 <span class="status__indicator" id="indicator"></span>
 <span id="status-text">Giliranmu</span>
 </div>
 <div class="status__score">
 <span>Kamu<b id="score-x">0</b></span>
 <span>Seri<b id="score-d">0</b></span>
 <span>AI<b id="score-o">0</b></span>
 </div>
 </div>

 <div class="board" id="board" role="grid" aria-label="Papan permainan tiga kali tiga"></div>

 <div class="levels">
 <div class="levels__label">Tingkat lawan</div>
 <div class="levels__list" id="levels-list" role="radiogroup" aria-label="Tingkat kesulitan"></div>
 </div>

 <div class="footer">
 <button class="footer__reset" id="reset">Ulang papan</button>
 </div>
 </div>
</main>

<div class="modal" id="modal" hidden>
 <div class="modal__backdrop" id="modal-backdrop"></div>
 <div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
 <h2 class="modal__title" id="modal-title">Kamu menang</h2>
 <p class="modal__sub" id="modal-sub">Bagus sekali. Mau coba lagi?</p>
 <button class="modal__retry" id="modal-retry">Coba lagi</button>
 </div>
</div>

<script>
const state={
 board:Array(9).fill(null),
 human:'X',ai:'O',
 turn:'X',
 over:false,winner:null,line:null,
 thinking:false,
 level:2,
 scores:{X:0,O:0,D:0}
};
const LEVELS=[
 {name:'Pemula'},
 {name:'Terlatih'},
 {name:'Taktisi'},
 {name:'Master'}
];
const WIN_LINES=[
 [0,1,2],[3,4,5],[6,7,8],
 [0,3,6],[1,4,7],[2,5,8],
 [0,4,8],[2,4,6]
];

const $=id=>document.getElementById(id);
const boardEl=$('board'),statusText=$('status-text'),indicator=$('indicator');
const levelsList=$('levels-list');
const scoreX=$('score-x'),scoreO=$('score-o'),scoreD=$('score-d');
const modal=$('modal');

function buildBoard(){
 boardEl.innerHTML='';
 for(let i=0;i<9;i++){
 const c=document.createElement('button');
 c.className='cell';
 c.setAttribute('role','gridcell');
 c.setAttribute('aria-label','Kotak '+(i+1));
 c.dataset.idx=i;
 c.addEventListener('click',()=>onCell(i));
 boardEl.appendChild(c);
 }
}
function buildLevels(){
 levelsList.innerHTML='';
 LEVELS.forEach((lvl,i)=>{
 const b=document.createElement('button');
 b.className='level'+(i===state.level?' is-active':'');
 b.setAttribute('role','radio');
 b.setAttribute('aria-checked',i===state.level?'true':'false');
 b.textContent=lvl.name;
 b.addEventListener('click',()=>setLevel(i));
 levelsList.appendChild(b);
 });
}
function setLevel(i){
 state.level=i;
 document.querySelectorAll('.level').forEach((el,idx)=>{
 const on=idx===i;
 el.classList.toggle('is-active',on);
 el.setAttribute('aria-checked',on?'true':'false');
 });
 resetBoard();
}
function markSVG(v){
 if(v==='X'){
 return '<svg class="mark__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><path d="M 22 22 L 78 78"/><path d="M 78 22 L 22 78"/></svg>';
 }
 return '<svg class="mark__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="50" r="30"/></svg>';
}
function renderCell(i){
 const cell=boardEl.children[i];
 const v=state.board[i];
 const existing=cell.querySelector('.mark');
 if(v){
 if(!existing){
 const m=document.createElement('div');
 m.className='mark mark--'+v.toLowerCase();
 m.innerHTML=markSVG(v);
 cell.appendChild(m);
 }
 cell.disabled=true;
 } else {
 if(existing) existing.remove();
 cell.disabled=state.over||state.thinking||state.turn!==state.human;
 }
 const isWin=!!(state.line&&state.line.includes(i));
 cell.classList.toggle('is-winning',isWin);
 cell.classList.toggle('is-winning-x',isWin&&state.winner==='X');
}
function render(){
 for(let i=0;i<9;i++) renderCell(i);
 if(state.over){
 if(state.winner==='X'){statusText.textContent='Kamu menang';indicator.className='status__indicator';}
 else if(state.winner==='O'){statusText.textContent='AI menang';indicator.className='status__indicator is-o';}
 else {statusText.textContent='Seri';indicator.className='status__indicator';}
 } else if(state.thinking){
 statusText.textContent='AI berpikir…';
 indicator.className='status__indicator is-o is-thinking';
 } else {
 statusText.textContent=state.turn===state.human?'Giliranmu':'Giliran AI';
 indicator.className='status__indicator'+(state.turn===state.ai?' is-o':'');
 }
 scoreX.textContent=state.scores.X;
 scoreO.textContent=state.scores.O;
 scoreD.textContent=state.scores.D;
}
function onCell(i){
 if(state.over||state.thinking) return;
 if(state.board[i]!==null) return;
 if(state.turn!==state.human) return;
 state.board[i]=state.human;
 renderCell(i);
 const r=checkWinner(state.board);
 if(r){endGame(r);return;}
 state.turn=state.ai;
 state.thinking=true;
 render();
 setTimeout(aiMove,380+Math.random()*340);
}
function aiMove(){
 if(!state.thinking) return;
 const m=chooseAIMove();
 if(m===null){state.thinking=false;render();return;}
 state.board[m]=state.ai;
 renderCell(m);
 state.thinking=false;
 const r=checkWinner(state.board);
 if(r){endGame(r);}
 else {state.turn=state.human;render();}
}
function chooseAIMove(){
 const empty=state.board.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
 if(!empty.length) return null;
 const L=state.level;
 if(L===0) return empty[Math.floor(Math.random()*empty.length)];
 if(L===1){
 const win=findImmediate(state.board,state.ai);
 if(win!==null) return win;
 if(Math.random()>0.15){
 const block=findImmediate(state.board,state.human);
 if(block!==null) return block;
 }
 if(state.board[4]===null) return 4;
 if(Math.random()>0.2){
 const corners=[0,2,6,8].filter(i=>state.board[i]===null);
 if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
 }
 return empty[Math.floor(Math.random()*empty.length)];
 }
 if(L===2){
 if(Math.random()<0.10) return empty[Math.floor(Math.random()*empty.length)];
 return minimaxMove(state.board,state.ai,4);
 }
 return minimaxMove(state.board,state.ai,9);
}
function findImmediate(board,player){
 for(const line of WIN_LINES){
 const cells=[board[line[0]],board[line[1]],board[line[2]]];
 const c=cells.filter(v=>v===player).length;
 const e=cells.filter(v=>v===null).length;
 if(c===2&&e===1) return line[cells.indexOf(null)];
 }
 return null;
}
function minimaxMove(board,player,maxDepth){
 let best=-Infinity,moves=[];
 for(let i=0;i<9;i++){
 if(board[i]!==null) continue;
 board[i]=player;
 const s=minimax(board,player==='O'?'X':'O',0,maxDepth,-Infinity,Infinity);
 board[i]=null;
 if(s>best){best=s;moves=[i];}
 else if(s===best){moves.push(i);}
 }
 return moves[Math.floor(Math.random()*moves.length)];
}
function minimax(board,current,depth,maxDepth,alpha,beta){
 const r=checkWinner(board);
 if(r){
 if(r.winner==='O') return 10-depth;
 if(r.winner==='X') return depth-10;
 return 0;
 }
 if(depth>=maxDepth) return 0;
 const isMax=current==='O';
 let best=isMax?-Infinity:Infinity;
 for(let i=0;i<9;i++){
 if(board[i]!==null) continue;
 board[i]=current;
 const s=minimax(board,current==='O'?'X':'O',depth+1,maxDepth,alpha,beta);
 board[i]=null;
 if(isMax){best=Math.max(best,s);alpha=Math.max(alpha,s);}
 else {best=Math.min(best,s);beta=Math.min(beta,s);}
 if(beta<=alpha) break;
 }
 return best;
}
function checkWinner(board){
 for(const line of WIN_LINES){
 const [a,b,c]=line;
 if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
 return {winner:board[a],line};
 }
 }
 if(board.every(v=>v!==null)) return {winner:'D',line:null};
 return null;
}
function endGame(r){
 state.over=true;
 state.winner=r.winner;
 state.line=r.line;
 if(r.winner==='X') state.scores.X++;
 else if(r.winner==='O') state.scores.O++;
 else state.scores.D++;
 render();
 if(r.line){
 setTimeout(()=>drawWinningLine(r.line,r.winner),220);
 setTimeout(()=>showModal(r.winner),950);
 } else {
 setTimeout(()=>showModal(r.winner),400);
 }
}
function showModal(winner){
 const title=$('modal-title');
 const sub=$('modal-sub');
 if(winner==='X'){
 title.textContent='Kamu menang';
 title.className='modal__title';
 sub.textContent='Bagus sekali. Mau coba lagi?';
 } else if(winner==='O'){
 title.textContent='AI menang';
 title.className='modal__title is-o';
 sub.textContent='Kali ini lawan lebih baik. Ulangi?';
 } else {
 title.textContent='Seri';
 title.className='modal__title';
 sub.textContent='Imbang. Main sekali lagi?';
 }
 modal.hidden=false;
 void modal.offsetWidth;
 modal.classList.add('is-open');
 setTimeout(()=>$('modal-retry').focus(),80);
}
function hideModal(){
 modal.classList.remove('is-open');
 setTimeout(()=>{modal.hidden=true;},350);
}
function drawWinningLine(line,winner){
 const rect=boardEl.getBoundingClientRect();
 const s=boardEl.children[line[0]].getBoundingClientRect();
 const e=boardEl.children[line[2]].getBoundingClientRect();
 const x1=s.left+s.width/2-rect.left;
 const y1=s.top+s.height/2-rect.top;
 const x2=e.left+e.width/2-rect.left;
 const y2=e.top+e.height/2-rect.top;
 const len=Math.hypot(x2-x1,y2-y1);
 const ang=Math.atan2(y2-y1,x2-x1);
 const el=document.createElement('div');
 el.className='winning-line'+(winner==='X'?' is-x':'');
 el.style.left=x1+'px';
 el.style.top=y1+'px';
 el.style.width=len+'px';
 el.style.transform='translateY(-50%) rotate('+ang+'rad) scaleX(0)';
 el.style.transition='transform .55s cubic-bezier(0.65,0,0.35,1)';
 boardEl.appendChild(el);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
 el.style.transform='translateY(-50%) rotate('+ang+'rad) scaleX(1)';
 }));
}
function resetBoard(){
 hideModal();
 state.board=Array(9).fill(null);
 state.turn=state.human;
 state.over=false;state.winner=null;state.line=null;
 state.thinking=false;
 const wl=boardEl.querySelector('.winning-line');
 if(wl) wl.remove();
 render();
}

 $('reset').addEventListener('click',resetBoard);
 $('modal-retry').addEventListener('click',resetBoard);
 $('modal-backdrop').addEventListener('click',resetBoard);
document.addEventListener('keydown',(e)=>{
 if(!modal.classList.contains('is-open')) return;
 if(e.key==='Escape'||e.key==='Enter'){e.preventDefault();resetBoard();}
});

buildBoard();
buildLevels();
render();
</script>
</body>
</html>`;

        const doomHtml = String.raw`{<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}</style>
<body style="margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:none;overscroll-behavior:none;overflow:hidden;cursor:pointer">
<div style="width:100%;max-width:620px;margin:auto;box-sizing:border-box">
<div style="position:relative;width:100%;aspect-ratio:16/9;background:rgba(255,255,255,.06);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.15);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.35)">
<canvas id="game" width="480" height="270" style="position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;touch-action:none"></canvas>
<div style="position:absolute;top:8px;left:12px;pointer-events:none;text-shadow:0 1px 4px rgba(0,0,0,.9)">
<div style="font-size:9px;letter-spacing:1.5px;color:rgba(255,255,255,.65)">ALXENA DOOM</div>
<div style="font-size:14px;font-weight:bold;color:#fff">Mini Doom FPS</div>
</div>
<div style="position:absolute;top:8px;right:12px;text-align:right;pointer-events:none;text-shadow:0 1px 4px rgba(0,0,0,.9)">
<div id="hp" style="font-size:13px;font-weight:bold;color:#fff;transition:transform .15s">HP 100</div>
<div id="ammo" style="font-size:9px;color:rgba(255,255,255,.75);margin-top:1px">AMMO 30 · SCORE 0</div>
</div>
<div id="status" style="position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:9px;color:rgba(255,255,255,.75);pointer-events:none;text-shadow:0 1px 4px rgba(0,0,0,.9)">5 musuh tersisa</div>
<div style="position:absolute;bottom:6px;left:6px;display:flex;gap:5px">
<button id="forward" style="width:44px;height:32px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:rgba(0,0,0,.4);color:#fff;font-size:14px;padding:0">▲</button>
</div>
<div style="position:absolute;bottom:6px;right:6px;display:grid;grid-template-columns:repeat(3,32px);gap:5px">
<button id="strafeL" style="width:32px;height:32px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:rgba(0,0,0,.4);color:#fff;font-size:13px;padding:0">◀</button>
<button id="fire" style="width:32px;height:32px;border:1px solid rgba(230,60,60,.5);border-radius:8px;background:rgba(230,60,60,.35);color:#fff;font-size:13px;padding:0">🔥</button>
<button id="strafeR" style="width:32px;height:32px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:rgba(0,0,0,.4);color:#fff;font-size:13px;padding:0">▶</button>
</div>
</div></div>
<script>
const c=document.getElementById('game'),x=c.getContext('2d'),hpEl=document.getElementById('hp'),ammoEl=document.getElementById('ammo'),statusEl=document.getElementById('status');
x.imageSmoothingEnabled=false;
const W=c.width,H=c.height;
const map=["################","#..............#","#..##....##....#","#..#..........##","#..#..####.....#","#.....#........#","###...#..####..#","#.....#........#","#..####........#","#........####..#","#........#.....#","#..##....#.....#","#..##..........#","#..............#","#..............#","################"];
const player={x:2.5,y:2.5,angle:0,hp:100,ammo:30,score:0,fireCooldown:0,muzzle:0,hurt:0};
let enemies,pickups,particles,ambient,shake,bobT,runT,endT,gameOver,win;
const keys=Object.create(null);
const FOV=Math.PI/3,MOVE=.052;
let zBuffer=new Float32Array(W);
function initEnemies(){return [{x:11.5,y:2.5,hp:60,max:60,dead:false,flash:0},{x:7.5,y:5.5,hp:60,max:60,dead:false,flash:0},{x:13.5,y:8.5,hp:60,max:60,dead:false,flash:0},{x:5.5,y:10.5,hp:60,max:60,dead:false,flash:0},{x:11.5,y:12.5,hp:60,max:60,dead:false,flash:0}]}
function initPickups(){return [{x:4.5,y:1.5,type:"ammo",taken:false},{x:14.5,y:5.5,type:"health",taken:false},{x:3.5,y:13.5,type:"ammo",taken:false}]}
function reset(){
player.x=2.5;player.y=2.5;player.angle=0;player.hp=100;player.ammo=30;player.score=0;player.fireCooldown=0;player.muzzle=0;player.hurt=0;
enemies=initEnemies();pickups=initPickups();particles=[];
if(!ambient){ambient=[];for(let i=0;i<16;i++)ambient.push({x:Math.random()*W,y:Math.random()*H,r:.6+Math.random()*1.2,vx:.15+Math.random()*.25,ph:Math.random()*10})}
shake=0;bobT=0;runT=0;endT=0;gameOver=false;win=false
}
function burst(px,py,n,col,spd,grav){for(let i=0;i<n;i++)particles.push({x:px,y:py,vx:(Math.random()-.5)*spd,vy:-Math.random()*spd,life:1,col,size:2+Math.random()*2.5,grav:grav||0})}
function isWall(px,py){const mx=Math.floor(px),my=Math.floor(py);if(mx<0||my<0||my>=map.length||mx>=map[0].length)return true;return map[my][mx]==="#"}
function canWalk(px,py){const r=.18;return !isWall(px-r,py-r)&&!isWall(px+r,py-r)&&!isWall(px-r,py+r)&&!isWall(px+r,py+r)}
function move(dx,dy){const nx=player.x+dx,ny=player.y+dy;if(canWalk(nx,player.y))player.x=nx;if(canWalk(player.x,ny))player.y=ny}
function normAngle(a){while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function lineClear(x1,y1,x2,y2){const d=Math.hypot(x2-x1,y2-y1),steps=Math.ceil(d/.08);for(let i=1;i<steps;i++){const t=i/steps,px=x1+(x2-x1)*t,py=y1+(y2-y1)*t;if(isWall(px,py))return false}return true}
function castRay(a){const ca=Math.cos(a),sa=Math.sin(a);let d=0;while(d<30){d+=.025;if(isWall(player.x+ca*d,player.y+sa*d))break}return d}
function screenPos(ex,ey){const dx=ex-player.x,dy=ey-player.y,d=Math.hypot(dx,dy);const a=normAngle(Math.atan2(dy,dx)-player.angle);const sx=W/2+Math.tan(a)*(W/2)/Math.tan(FOV/2);return {sx,d,a}}
function shoot(){
if(player.fireCooldown>0||player.ammo<=0||gameOver||win)return;
player.fireCooldown=13;player.ammo--;player.muzzle=4;
burst(W/2,H-88,7,'255,210,80',3,.1);
let best=null,bestDist=Infinity;
for(const e of enemies){
if(e.dead)continue;
const {sx,d,a}=screenPos(e.x,e.y);
if(d>10)continue;
const tol=.055+.16/d;
if(Math.abs(a)<tol&&d<bestDist&&lineClear(player.x,player.y,e.x,e.y)){best=e;bestDist=d}
}
if(best){
const dmg=25+Math.floor(Math.random()*12);
best.hp-=dmg;best.flash=6;
const {sx,d}=screenPos(best.x,best.y);
const size=Math.min(H*1.8,H/d*.72);
if(best.hp<=0){best.dead=true;player.score+=100;burst(sx,H/2,22,'220,40,40',4.5,.25)}
else{player.score+=10;burst(sx,H/2,10,'220,40,40',3.5,.2)}
}
}
function updateEnemies(){
for(const e of enemies){
if(e.dead)continue;
if(e.flash>0)e.flash--;
const d=dist(player,e);
if(d<1){
player.hp-=.18;player.hurt=6;shake=Math.max(shake,4.5);
const a=Math.atan2(e.y-player.y,e.x-player.x);
player.x-=Math.cos(a)*.015;player.y-=Math.sin(a)*.015;
continue
}
if(d<7&&lineClear(e.x,e.y,player.x,player.y)){
const a=Math.atan2(player.y-e.y,player.x-e.x),spd=.0085;
const nx=e.x+Math.cos(a)*spd,ny=e.y+Math.sin(a)*spd;
if(canWalk(nx,ny)){e.x=nx;e.y=ny}
if(Math.random()<.006&&d<6){player.hp-=2.5;player.hurt=10;shake=Math.max(shake,3.5);}
}
}
}
function updatePickups(){
for(const p of pickups){
if(p.taken)continue;
if(Math.hypot(player.x-p.x,player.y-p.y)<.55){
p.taken=true;
if(p.type==="ammo")player.ammo=Math.min(99,player.ammo+15);
if(p.type==="health")player.hp=Math.min(100,player.hp+25)
}
}
}
function update(){
runT++;
if(gameOver||win){endT++;return}
if(player.fireCooldown>0)player.fireCooldown--;
if(player.muzzle>0)player.muzzle--;
if(player.hurt>0)player.hurt--;
if(shake>0)shake=Math.max(0,shake-.6);
let dx=0,dy=0;
const moving=keys.forward||keys.strafeL||keys.strafeR;
if(moving)bobT++;else bobT+=.15;
if(keys.forward){dx+=Math.cos(player.angle)*MOVE;dy+=Math.sin(player.angle)*MOVE}
if(keys.strafeL){dx+=Math.cos(player.angle-Math.PI/2)*MOVE;dy+=Math.sin(player.angle-Math.PI/2)*MOVE}
if(keys.strafeR){dx+=Math.cos(player.angle+Math.PI/2)*MOVE;dy+=Math.sin(player.angle+Math.PI/2)*MOVE}
move(dx,dy);
updateEnemies();updatePickups();
if(keys.fire)shoot();
particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.grav;p.life-=.035});
particles=particles.filter(p=>p.life>0);
ambient.forEach(p=>{p.x-=p.vx;if(p.x<-4)p.x=W+4});
if(enemies.filter(e=>!e.dead).length===0)win=true;
if(player.hp<=0)gameOver=true
}
function wallColor(d,side){let l=230-d*18;if(side)l*=.76;l=Math.max(25,Math.min(220,l));return 'rgb('+Math.floor(l)+','+Math.floor(l*.62)+','+Math.floor(l*.48)+')'}
function drawWalls(bob){
const half=H/2+bob,halfFov=FOV/2;
const sky=x.createLinearGradient(0,0,0,half);sky.addColorStop(0,'#12151a');sky.addColorStop(1,'#34302b');
x.fillStyle=sky;x.fillRect(0,0,W,half);
const floor=x.createLinearGradient(0,half,0,H);floor.addColorStop(0,'#4a4540');floor.addColorStop(1,'#111');
x.fillStyle=floor;x.fillRect(0,half,W,H-half);
for(let px=0;px<W;px++){
const a=player.angle-halfFov+(px/W)*FOV;
let raw=castRay(a);
const corrected=raw*Math.cos(a-player.angle);
zBuffer[px]=corrected;
const wallH=Math.min(H*3,H/corrected),top=half-wallH/2;
const cellX=player.x+Math.cos(a)*raw,cellY=player.y+Math.sin(a)*raw;
const wx=cellX-Math.floor(cellX),wy=cellY-Math.floor(cellY);
const side=wx<.035||wx>.965;
x.fillStyle=wallColor(corrected,side);
x.fillRect(px,top,1,wallH)
}
}
function drawEnemySprite(e,bob){
if(e.dead)return;
const {sx,d,a}=screenPos(e.x,e.y);
if(Math.abs(a)>FOV*.7||d<.2)return;
const size=Math.min(H*1.8,H/d*.72);
const left=Math.floor(sx-size*.3),top=Math.floor(H/2+bob-size*.48),bottom=Math.floor(H/2+bob+size*.52);
const zi=Math.max(0,Math.min(W-1,Math.floor(sx)));
if(d>zBuffer[zi]+.25)return;
const hit=e.flash>0;
const wob=Math.sin(runT*.08+e.x*3)*2;
x.fillStyle=hit?'#fff':'#991b1b';
x.fillRect(left+size*.12+wob,top+size*.28,size*.36,size*.48);
x.fillRect(left+size*.16+wob,top,size*.28,size*.22);
if(size>25){
x.fillStyle='#ffd000';
x.fillRect(left+size*.22+wob,top+size*.09,Math.max(2,size*.035),Math.max(2,size*.045));
x.fillRect(left+size*.38+wob,top+size*.09,Math.max(2,size*.035),Math.max(2,size*.045))
}
x.fillStyle=hit?'#fff':'#741414';
x.fillRect(left-size*.03+wob,top+size*.28,size*.15,size*.11);
x.fillRect(left+size*.6-size*.12+wob,top+size*.28,size*.15,size*.11);
x.fillRect(left+size*.13+wob,bottom-size*.23,size*.14,size*.25);
x.fillRect(left+size*.35+wob,bottom-size*.23,size*.14,size*.25);
if(size>35){
const barW=size*.55;
x.fillStyle='#111';x.fillRect(sx-barW/2,top-size*.07,barW,4);
x.fillStyle='#e33';x.fillRect(sx-barW/2,top-size*.07,barW*Math.max(0,e.hp/e.max),4)
}
}
function drawPickup(p,bob){
if(p.taken)return;
const {sx,d,a}=screenPos(p.x,p.y);
if(Math.abs(a)>FOV*.6)return;
const pulse=1+.12*Math.sin(runT*.12+p.x*4);
const size=Math.min(45,H/d*.2)*pulse;
const zi=Math.max(0,Math.min(W-1,Math.floor(sx)));
if(d>zBuffer[zi]+.15)return;
x.save();
x.shadowColor=p.type==='health'?'rgba(33,197,93,.7)':'rgba(246,201,69,.7)';
x.shadowBlur=10;
x.fillStyle=p.type==='health'?'#21c55d':'#f6c945';
x.fillRect(sx-size/2,H/2+bob-size/2,size,size);
x.restore()
}
function drawWeapon(bob){
const cx=W/2,base=H+bob*1.5;
x.fillStyle='#282828';x.fillRect(cx-44,base-64,88,50);
x.fillStyle='#555';x.fillRect(cx-32,base-80,64,24);
if(player.muzzle>0){
x.fillStyle=player.muzzle%2?'#fff':'#ffd43b';
x.beginPath();x.moveTo(cx,base-96);x.lineTo(cx-20,base-68);x.lineTo(cx,base-74);x.lineTo(cx+20,base-68);x.closePath();x.fill()
}
}
function drawAmbient(){ambient.forEach(p=>{const a=.12+Math.sin(runT*.04+p.ph)*.08;x.fillStyle='rgba(200,190,255,'+a+')';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()})}
function drawParticles(){particles.forEach(p=>{x.fillStyle='rgba('+p.col+','+Math.max(p.life,0)+')';x.fillRect(p.x,p.y,p.size,p.size)})}
function drawCrosshair(){
const cx=W/2,cy=H/2;
x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=2;
x.beginPath();x.moveTo(cx-5,cy);x.lineTo(cx-1,cy);x.moveTo(cx+1,cy);x.lineTo(cx+5,cy);x.moveTo(cx,cy-5);x.lineTo(cx,cy-1);x.moveTo(cx,cy+1);x.lineTo(cx,cy+5);x.stroke()
}
function drawVignette(){
const g=x.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.75);
g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');
x.fillStyle=g;x.fillRect(0,0,W,H)
}
function drawEndScreen(){
if(!gameOver&&!win)return;
const a=Math.min(1,endT*.04);
x.fillStyle='rgba(0,0,0,'+(a*.75)+')';x.fillRect(0,0,W,H);
x.globalAlpha=a;
x.textAlign='center';x.fillStyle=win?'#ffd43b':'#f33';x.font='bold 22px Arial';
x.fillText(win?'LEVEL CLEAR':'YOU DIED',W/2,H/2-10);
x.fillStyle='#fff';x.font='12px Arial';x.fillText('Skor '+player.score+' · Tap untuk ulang',W/2,H/2+14);
x.textAlign='left';x.globalAlpha=1
}
function draw(){
x.clearRect(0,0,W,H);
x.save();
if(shake>0)x.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
const bob=Math.sin(bobT*.3)*(keys.forward||keys.strafeL||keys.strafeR?3:.8);
drawWalls(bob);
drawAmbient();
const sprites=[...enemies.filter(e=>!e.dead).map(e=>({t:'e',o:e})),...pickups.filter(p=>!p.taken).map(p=>({t:'p',o:p}))];
sprites.sort((a,b)=>dist(player,b.o)-dist(player,a.o));
for(const s of sprites)s.t==='e'?drawEnemySprite(s.o,bob):drawPickup(s.o,bob);
drawParticles();
drawWeapon(bob);
drawCrosshair();
drawVignette();
if(player.hurt>0){x.fillStyle='rgba(255,0,0,'+(player.hurt/45)+')';x.fillRect(0,0,W,H)}
x.restore();
drawEndScreen();
hpEl.textContent='HP '+Math.max(0,Math.floor(player.hp));
ammoEl.textContent='AMMO '+player.ammo+' · SCORE '+player.score;
statusEl.textContent=win?'Level clear!':gameOver?'Kamu tewas':enemies.filter(e=>!e.dead).length+' musuh tersisa'
}
function loop(){update();draw();requestAnimationFrame(loop)}
function bind(id,key){
const b=document.getElementById(id);
const down=e=>{e.preventDefault();keys[key]=true};
const up=e=>{e.preventDefault();keys[key]=false};
b.addEventListener('touchstart',down,{passive:false});
b.addEventListener('touchend',up,{passive:false});
b.addEventListener('touchcancel',up,{passive:false});
b.addEventListener('mousedown',down);
b.addEventListener('mouseup',up);
b.addEventListener('mouseleave',up)
}
bind('forward','forward');bind('strafeL','strafeL');bind('strafeR','strafeR');bind('fire','fire');

let looking=false;
let lookLastX=0;
let lookLastY=0;
c.addEventListener('pointerdown',e=>{
if(gameOver||win){e.preventDefault();reset();return;}
e.preventDefault();
looking=true;
lookLastX=e.clientX;
lookLastY=e.clientY;
c.setPointerCapture(e.pointerId);
},{passive:false});
c.addEventListener('pointermove',e=>{
if(!looking)return;
e.preventDefault();
const dx=e.clientX-lookLastX;
const dy=e.clientY-lookLastY;
// Camera only follows intentional horizontal swipes. Small vertical
// movements are ignored so accidental up/down drags do not interfere.
if(Math.abs(dx)>=Math.abs(dy)*0.75){
player.angle+=dx*0.009;
}
lookLastX=e.clientX;
lookLastY=e.clientY;
},{passive:false});
const stopLook=e=>{
if(e&&e.cancelable)e.preventDefault();
looking=false;
};
c.addEventListener('pointerup',stopLook,{passive:false});
c.addEventListener('pointercancel',stopLook,{passive:false});

window.addEventListener('keydown',e=>{
const k=e.key.toLowerCase();
if(k==='w')keys.forward=true;
if(k==='a')keys.strafeL=true;
if(k==='d')keys.strafeR=true;
if(k==='arrowleft')player.angle-=.1;
if(k==='arrowright')player.angle+=.1;
if(k===' ')keys.fire=true
});
window.addEventListener('keyup',e=>{
const k=e.key.toLowerCase();
if(k==='w')keys.forward=false;
if(k==='a')keys.strafeL=false;
if(k==='d')keys.strafeR=false;
if(k===' ')keys.fire=false
});
reset();
requestAnimationFrame(loop);
</script></body>`;

        const nekoParkHtml = String.raw`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>ALXENA Neko Park</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent;font-family:Arial,sans-serif;color:#fff;touch-action:none}
.wrap{width:100%;max-width:620px;margin:auto;padding:6px}
.game{position:relative;width:100%;aspect-ratio:16/10;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.16);background:#9ed9f2;box-shadow:0 8px 28px rgba(0,0,0,.35)}
canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.hud{position:absolute;top:7px;left:9px;right:9px;display:flex;justify-content:space-between;align-items:flex-start;pointer-events:none;text-shadow:0 1px 3px #0008}
.brand{font-size:10px;letter-spacing:1.7px;font-weight:700}.title{font-size:17px;font-weight:800}.coins{font-size:12px;font-weight:700;background:#0007;border:1px solid #fff3;border-radius:10px;padding:5px 8px}
.name{position:absolute;top:54px;left:0;right:0;text-align:center;font-size:9px;font-weight:700;text-shadow:0 1px 3px #000;pointer-events:none}
.controls{position:absolute;left:8px;right:8px;bottom:8px;display:flex;justify-content:space-between;align-items:end;pointer-events:none}
.pad,.actions{display:flex;gap:6px;pointer-events:auto}.btn{border:1px solid #fff4;border-radius:10px;background:#20153dcc;color:#fff;font-weight:800;min-width:42px;height:38px;padding:0 10px;box-shadow:0 3px 8px #0005}.btn:active{transform:translateY(1px);background:#6b3aaacc}.emote{min-width:38px;padding:0}.hint{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-size:8px;color:#fff;opacity:.82;text-shadow:0 1px 3px #000;pointer-events:none}
</style>
</head>
<body>
<div class="wrap"><div class="game">
<canvas id="c" width="640" height="400"></canvas>
<div class="hud"><div><div class="brand">ALXENA</div><div class="title">NEKO PARK</div></div><div class="coins" id="coin">🪙 0</div></div>
<div class="name">🐔 ALXENA CHICKEN</div>
<div class="hint">← → jalan • ▲ lompat • 🪙 ambil koin • emoji untuk emote</div>
<div class="controls"><div class="pad"><button class="btn" id="left">◀</button><button class="btn" id="right">▶</button><button class="btn" id="jump">▲</button></div><div class="actions"><button class="btn emote" data-e="👋">👋</button><button class="btn emote" data-e="❤️">❤️</button><button class="btn emote" data-e="😂">😂</button><button class="btn emote" data-e="✨">✨</button></div></div>
</div></div>
<script>
const c=document.getElementById('c'),ctx=c.getContext('2d'),coinEl=document.getElementById('coin');
const W=c.width,H=c.height;const keys={left:false,right:false};
let player,coins,particles,clouds,other,emote='',emoteT=0,t=0;
function reset(){player={x:150,y:275,vy:0,onGround:true,dir:1};coins=[];for(let i=0;i<9;i++)coins.push({x:190+i*48,y:250-(i%3)*24,taken:false});particles=[];clouds=[{x:70,y:65,s:1},{x:280,y:42,s:.7},{x:520,y:76,s:1.15}];other={x:420,y:275,dir:-1,step:0};}
function jump(){if(player.onGround){player.vy=-8.6;player.onGround=false}}
function bind(id,key,fn){const b=document.getElementById(id);const d=e=>{e.preventDefault();if(fn)fn();else keys[key]=true};const u=e=>{e.preventDefault();keys[key]=false};b.addEventListener('pointerdown',d,{passive:false});b.addEventListener('pointerup',u,{passive:false});b.addEventListener('pointercancel',u,{passive:false});b.addEventListener('pointerleave',u,{passive:false})}
bind('left','left');bind('right','right');bind('jump',null,jump);
document.querySelectorAll('.emote').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();emote=b.dataset.e;emoteT=70},{passive:false}));
window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=true;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=true;if(e.key==='ArrowUp'||e.key===' ')jump()});
window.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=false;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=false});
function burst(x,y){for(let i=0;i<8;i++)particles.push({x,y,vx:(Math.random()-.5)*2,vy:-Math.random()*2,life:1})}
function update(){t++;if(keys.left){player.x-=2.4;player.dir=-1}if(keys.right){player.x+=2.4;player.dir=1}player.vy+=.38;player.y+=player.vy;if(player.y>=275){player.y=275;player.vy=0;player.onGround=true}player.x=Math.max(40,Math.min(W-40,player.x));for(const q of coins){if(!q.taken&&Math.hypot(player.x-q.x,player.y-q.y)<28){q.taken=true;burst(q.x,q.y)}}other.x+=Math.sin(t*.025)*.7;other.step+=.12;particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.08;p.life-=.035});particles=particles.filter(p=>p.life>0);if(emoteT>0)emoteT--}
function chicken(x,y,dir,main=false){ctx.save();ctx.translate(x,y);ctx.scale(dir,1);const bob=Math.sin(t*.18+(main?0:2))*(main&&keys.left||keys.right?1.8:1);ctx.translate(0,bob);ctx.fillStyle=main?'#fff':'#f4f4f4';ctx.beginPath();ctx.ellipse(0,-22,20,23,0,0,7);ctx.fill();ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(0,-47,17,0,7);ctx.fill();ctx.fillStyle='#e33';ctx.beginPath();ctx.arc(-5,-61,5,0,7);ctx.arc(4,-61,5,0,7);ctx.fill();ctx.fillStyle='#222';ctx.beginPath();ctx.arc(5,-50,2,0,7);ctx.fill();ctx.fillStyle='#f39c12';ctx.beginPath();ctx.moveTo(17,-46);ctx.lineTo(29,-42);ctx.lineTo(17,-37);ctx.closePath();ctx.fill();ctx.fillStyle='#e5a323';ctx.fillRect(-10,0,5,13);ctx.fillRect(5,0,5,13);ctx.restore()}
function draw(){ctx.clearRect(0,0,W,H);let sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#f3b8dc');sky.addColorStop(1,'#ffd7c0');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff9';clouds.forEach(q=>{ctx.beginPath();ctx.arc(q.x,q.y,22*q.s,0,7);ctx.arc(q.x+24*q.s,q.y+3,18*q.s,0,7);ctx.arc(q.x+45*q.s,q.y,24*q.s,0,7);ctx.fill()});ctx.fillStyle='#b97ad1';ctx.beginPath();ctx.moveTo(0,210);ctx.quadraticCurveTo(150,150,300,205);ctx.quadraticCurveTo(450,260,640,185);ctx.lineTo(640,320);ctx.lineTo(0,320);ctx.fill();ctx.fillStyle='#b8e39a';ctx.fillRect(0,280,W,120);ctx.fillStyle='#69bd5b';ctx.fillRect(0,275,W,8);for(let i=0;i<14;i++){ctx.fillStyle='#5aa64e';ctx.fillRect(i*52+8,265+(i%2)*8,2,15)}ctx.fillStyle='#8c5a37';ctx.fillRect(95,220,6,60);ctx.fillRect(230,218,6,62);ctx.fillStyle='#b27a45';ctx.fillRect(80,205,170,18);ctx.fillStyle='#fff8';for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(310+i*20,250,5,0,7);ctx.fill()}for(const q of coins)if(!q.taken){ctx.strokeStyle='#ffd32a';ctx.lineWidth=4;ctx.beginPath();ctx.arc(q.x,q.y,9+Math.sin(t*.15+q.x)*2,0,7);ctx.stroke()}chicken(other.x,other.y,other.dir,false);chicken(player.x,player.y,player.dir,true);if(emoteT>0){ctx.font='22px Arial';ctx.textAlign='center';ctx.fillText(emote,player.x,player.y-75)}particles.forEach(p=>{ctx.fillStyle='rgba(255,215,60,'+p.life+')';ctx.fillRect(p.x,p.y,3,3)});coinEl.textContent='🪙 '+coins.filter(q=>q.taken).length}
function loop(){update();draw();requestAnimationFrame(loop)}
reset();loop();
</script></body></html>`;

        const dinoHtmlLocked = hardScrollLock + dinoHtml;
        const ticTacToeHtmlLocked = hardScrollLock + ticTacToeHtml;
        const doomHtmlLocked = hardScrollLock + doomHtml;

        // ========== BUILD PAYLOAD ==========
        // Neko Park is an original ALXENA chicken-park game. Realtime cross-device multiplayer needs a public realtime backend; the UI is structured for that next phase.
        const responseData = {
            response_id: '183d0aee-fb35-4349-8bc5-7793b11859db',
            sections: [
                {
                    view_model: {
                        primitive: {
                            text: '> ALXENA',
                            __typename: 'GenAIMarkdownTextUXPrimitive',
                        },
                        __typename: 'GenAISingleLayoutViewModel',
                    },
                }
            ],
            embedded_screens: [
                {
                    title: 'Preview',
                    content: [
                        {
                            __typename: 'FOAIDNixelButtonSheets',
                            tabs: [
                                {
                                    id: 'tab_0',
                                    tab_header: 'Dino Runner',
                                    sections: [
                                        {
                                            __typename: 'GenAIUnifiedResponseSection',
                                            view_model: {
                                                __typename: 'GenAISingleLayoutViewModel',
                                                primitive: {
                                                    __typename: 'GenAIaeacdsnwHtmlPrimitive',
                                                    payload: dinoHtmlLocked,
                                                    url: 'https://nixel.dev',
                                                    trusted_sources: ['nixel.dev'],
                                                },
                                            },
                                        },
                                    ],
                                    step_entries: [],
                                },
                                {
                                    id: 'tab_1',
                                    tab_header: 'Tic Tac Toe',
                                    sections: [
                                        {
                                            __typename: 'GenAIUnifiedResponseSection',
                                            view_model: {
                                                __typename: 'GenAISingleLayoutViewModel',
                                                primitive: {
                                                    __typename: 'GenAIaeacdsnwHtmlPrimitive',
                                                    payload: ticTacToeHtmlLocked,
                                                    url: 'https://nixel.dev',
                                                    trusted_sources: ['nixel.dev'],
                                                },
                                            },
                                        },
                                    ],
                                    step_entries: [],
                                },
                                {
                                    id: 'tab_2',
                                    tab_header: 'Doom',
                                    sections: [
                                        {
                                            __typename: 'GenAIUnifiedResponseSection',
                                            view_model: {
                                                __typename: 'GenAISingleLayoutViewModel',
                                                primitive: {
                                                    __typename: 'GenAIaeacdsnwHtmlPrimitive',
                                                    payload: doomHtmlLocked,
                                                    url: 'https://nixel.dev',
                                                    trusted_sources: ['nixel.dev'],
                                                },
                                            },
                                        },
                                    ],
                                    step_entries: [],
                                },
                                {
                                    id: 'tab_3',
                                    tab_header: 'Neko Park',
                                    sections: [
                                        {
                                            __typename: 'GenAIUnifiedResponseSection',
                                            view_model: {
                                                __typename: 'GenAISingleLayoutViewModel',
                                                primitive: {
                                                    __typename: 'GenAIaeacdsnwHtmlPrimitive',
                                                    payload: hardScrollLock + nekoParkHtml,
                                                    url: 'https://nixel.dev',
                                                    trusted_sources: ['nixel.dev'],
                                                },
                                            },
                                        },
                                    ],
                                    step_entries: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        // ========== SEND AIRICH ==========
        await sendAIRich(sock, targetChat, responseData, {
            messageText: '> ALXENA'
        });
    },
};