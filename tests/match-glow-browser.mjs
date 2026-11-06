import {battleFixtureResponse} from './battle-fixture.mjs';
import {REFERENCE_TEAM} from './reference-team.mjs';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createBattle} from '../src/engine.js';
import {PROFILE_KEY,BATTLE_KEY} from '../src/storage.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'no-preference'}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('external '+u.host);return route.abort();}try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:battleFixtureResponse(p,await fs.readFile(p)),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(p)]});}catch{errors.push('missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await fs.mkdir(root+'artifacts',{recursive:true});
 await page.goto('http://legends.local/#/home');await page.locator('.courtyard-scene').waitFor();
 async function loadBattle(state){await page.evaluate(({state,pk,bk})=>{const p=JSON.parse(localStorage.getItem(pk));p.helpSeen=true;localStorage.setItem(pk,JSON.stringify(p));localStorage.setItem(bk,JSON.stringify(state));},{state,pk:PROFILE_KEY,bk:BATTLE_KEY});await page.reload();await page.locator('.topbar').waitFor();await page.goto('http://legends.local/#/battle');await page.locator('.board').waitFor({timeout:5000}).catch(async e=>{console.error(JSON.stringify({errors,body:await page.locator('body').innerText()}));await page.screenshot({path:root+'artifacts/experience-load-error.png',fullPage:true});throw e;});}



 const colors=['red','blue','green','yellow','purple'];
 const fixture=color=>{
  const b=createBattle(roster,REFERENCE_TEAM,'ashen-gate',945);
  b.board.forEach((t,i)=>{t.color=colors[(i%7+Math.floor(i/7)*2)%5];t.special=null;});
  const other=colors[(colors.indexOf(color)+1)%5];
  for(const i of [1,2,7])b.board[i].color=color;for(const i of [0,3])b.board[i].color=other;
  for(const e of b.enemies){e.hp=e.maxHp=100000;e.atk=1;e.countdown=99;e.mana=0;}
  for(const h of b.heroes)h.mana=0;
  return b;
 };
 async function observe(){await page.evaluate(()=>{
  window.__glows=[];window.__glowObserver?.disconnect();window.__glowObserver=new MutationObserver(records=>{
   for(const record of records)for(const e of record.addedNodes)if(e.nodeType===1&&e.matches('.match-bloom')){
    const tile=document.querySelector('[data-index="'+e.dataset.index+'"]'),r=tile.getBoundingClientRect(),s=getComputedStyle(e);
    window.__glows.push({color:[...e.classList].find(c=>['red','blue','green','yellow','purple'].includes(c)),rgb:s.getPropertyValue('--rgb').trim(),duration:parseFloat(s.animationDuration),hidden:e.getAttribute('aria-hidden'),pointer:s.pointerEvents,x:parseFloat(e.style.left),y:parseFloat(e.style.top),tileX:r.left+r.width/2,tileY:r.top+r.height/2});
   }
  });window.__glowObserver.observe(document.querySelector('#effects-layer'),{childList:true});
 });}
 for(const width of [390,1440])for(const speed of [1,2])for(const color of width===390?colors:['purple']){
  await page.setViewportSize({width,height:width===390?844:900});const b=fixture(color);await loadBattle(b);
  if(await page.locator('[data-action="speed"]').textContent()!==speed+'×')await page.locator('[data-action="speed"]').click();
  await observe();await page.locator('[data-index="0"]').click();await page.locator('[data-index="7"]').click();
  await page.waitForFunction(()=>window.__glows.length>=3);
  const glows=await page.evaluate(()=>window.__glows.slice(0,3));
  assert.ok(glows.every(g=>g.color===color&&g.rgb&&g.hidden==='true'&&g.pointer==='none'),'matched color and decorative overlay '+color);
  assert.ok(glows.every(g=>Math.abs(g.duration-.56/speed)<.005),'matches battle speed');
  assert.ok(glows.every(g=>Math.abs(g.x-g.tileX)<2&&Math.abs(g.y-g.tileY)<2),'centered on matched tiles');
  if(width===390&&speed===1&&color==='red'){
   await page.locator('.match-bloom').evaluateAll(nodes=>nodes.forEach(e=>e.getAnimations().forEach(a=>{a.pause();a.currentTime=160;})));
   await page.screenshot({path:root+'artifacts/match-color-glow-phone.png'});
  }
  await page.goto('http://legends.local/#/home');await page.locator('.courtyard-scene').waitFor();assert.equal(await page.locator('.match-bloom').count(),0,'leaving clears pending effects');
 }
 await page.emulateMedia({reducedMotion:'reduce'});await loadBattle(fixture('blue'));await observe();
 await page.locator('[data-index="0"]').click();await page.locator('[data-index="7"]').click();await page.waitForFunction(()=>!document.querySelector('.board.resolving'));
 assert.equal(await page.evaluate(()=>window.__glows.length),0,'reduced motion suppresses the bursts');
 assert.deepEqual(errors,[]);console.log('PASS: real matches in all five colors at x1/x2, phone and desktop, centered non-blocking color glow, cleanup on exit, and reduced motion.');
}finally{await browser.close();}
