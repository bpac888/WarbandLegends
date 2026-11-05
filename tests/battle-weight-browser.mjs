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


 const state=createBattle(roster,REFERENCE_TEAM,'ashen-gate',945);
 for(const e of state.enemies){e.hp=e.maxHp=100000;e.atk=10;e.countdown=1;e.mana=e.manaMax;}
 state.heroes[0].mana=state.heroes[0].manaMax;
 for(const width of [390,1440])for(const speed of [1,2]){
  await page.setViewportSize({width,height:1000});await loadBattle(state);
  if(await page.locator('[data-action="speed"]').textContent()!==speed+'×')await page.locator('[data-action="speed"]').click();
  await page.locator('[data-action="hero"][data-uid="hero-0"]').click();await page.getByRole('button',{name:'Cast Charge 2'}).click();await page.locator('[data-action="enemy"][data-uid="enemy-0"]').click();
  await page.locator('.special-announcement').waitFor();await page.waitForTimeout(650);
  assert.equal(await page.locator('.special-announcement').count(),1,'cast still visible after 650ms at '+speed);
  assert.equal(await page.locator('.board.resolving').count(),1,'cast still owns its presentation frame');
  await page.screenshot({path:root+`artifacts/weighted-special-${width}-${speed}.png`});
  await page.waitForFunction(()=>!document.querySelector('.board.resolving'));
  assert.equal(await page.locator('.special-announcement,.spell-charge,.special-orb').count(),0,'cast effects complete before input resumes');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 for(const special of ['blast','prism'])for(const speed of [1,2]){
  const b=structuredClone(state);b.board[0].special=special;await loadBattle(b);if(await page.locator('[data-action="speed"]').textContent()!==speed+'×')await page.locator('[data-action="speed"]').click();
  await page.evaluate(()=>{window.__enemyReveals=[];let last=null;window.__revealObserver?.disconnect();window.__revealObserver=new MutationObserver(()=>{const caster=document.querySelector('.enemy-unit.special-caster'),uid=caster?.dataset.unit;if(last&&last.uid!==uid){window.__enemyReveals.push({...last,duration:performance.now()-last.at});last=null;}if(uid&&!last)last={uid,at:performance.now(),banner:!!document.querySelector('.special-announcement')};});window.__revealObserver.observe(document.querySelector('#app'),{childList:true,subtree:true});});
  await page.locator('[data-index="0"]').click();await page.locator('[data-index="0"]').click();
  await page.locator('.power-'+special).waitFor();
  assert.ok(await page.locator('.tile.matched').first().evaluate(e=>parseFloat(getComputedStyle(e).animationDuration))>=.44);
  if(special==='prism')assert.ok(await page.locator('.prism-link').count()>0);
  await page.waitForTimeout(130);await page.screenshot({path:root+`artifacts/weighted-${special}-${speed}.png`});
  // Enemy Specials now receive the same long reveal as heroes, even at x2.
  await page.waitForFunction(()=>window.__enemyReveals.length>0,null,{timeout:30000});
  const reveal=await page.evaluate(()=>window.__enemyReveals[0]);assert.ok(reveal.banner);assert.ok(reveal.duration>=1000,'enemy cast visible for '+reveal.duration+'ms at '+speed);
  await page.goto('http://legends.local/#/home');await page.locator('.courtyard-scene').waitFor();assert.equal(await page.locator('#effects-layer>*').count(),0);
 }
 await loadBattle(state);await page.evaluate(()=>{window.__autoCasts=[];let last=null;window.__autoObserver=new MutationObserver(()=>{const caster=document.querySelector('.auto-running .hero-unit.special-caster'),uid=caster?.dataset.unit;if(last&&last.uid!==uid){window.__autoCasts.push({...last,duration:performance.now()-last.at});last=null;}if(uid&&!last)last={uid,at:performance.now(),banner:!!document.querySelector('.special-announcement'),rate:document.querySelector('.battle-shell').style.getPropertyValue('--fx-rate')};});window.__autoObserver.observe(document.querySelector('#app'),{childList:true,subtree:true});});
 await page.getByRole('button',{name:'Auto battle',exact:true}).click();await page.waitForFunction(()=>window.__autoCasts.length>0,null,{timeout:30000});const autoCast=await page.evaluate(()=>window.__autoCasts[0]);assert.ok(autoCast.banner);assert.equal(autoCast.rate,'1.65');assert.ok(autoCast.duration>=1000,'Auto cast duration '+autoCast.duration);assert.equal(await page.locator('[data-action="speed"]').textContent(),'2×');await page.goto('http://legends.local/#/home');await page.locator('.courtyard-scene').waitFor();assert.equal(await page.locator('#effects-layer>*').count(),0);
 await page.emulateMedia({reducedMotion:'reduce'});await loadBattle(state);await page.evaluate(async state=>{const fx=await import('/src/battle-fx.js');fx.animateRunePower({cleared:[0],created:[{index:1,color:'red',special:'blast'}]},state,document.querySelector('#app'),{reduced:true});},{...state,board:state.board.map((t,i)=>i===0?{...t,special:'prism'}:t)});
 assert.equal(await page.locator('.rune-power,.prism-link').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS: weighted match timing, blast/prism activation, hero/enemy Specials at x1/x2, two viewports, reduced motion and navigation cleanup.');
}finally{await browser.close();}
