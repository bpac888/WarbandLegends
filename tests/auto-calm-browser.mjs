import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {battleFixtureResponse} from './battle-fixture.mjs';
import {createBattle} from '../src/engine.js';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY,BATTLE_KEY} from '../src/storage.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright'),root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local')return route.abort();try{const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:battleFixtureResponse(file,await fs.readFile(file)),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'})[path.extname(file)]});}catch(e){errors.push(u.pathname+': '+e.message);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const p={...defaultProfile(),helpSeen:true};await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p,key:PROFILE_KEY});
 const b=createBattle(roster,['sera_emberleaf_tender','varya_stormbound_circuit','qadir_glassveil_warden','iona_signal_keeper','skeldra_night_aurora'],'ashen-gate',31);
 for(const e of b.enemies){e.hp=e.maxHp=100000;e.atk=10;e.countdown=2;e.passive=null;}
 for(const h of b.heroes){h.hp=Math.floor(h.maxHp*.4);h.mana=h.manaMax;h.effects={poison:{turns:2,source:'enemy-0',appliedMove:0}};}
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();};
 const load=async()=>{await go('home');await page.evaluate(({k,b})=>localStorage.setItem(k,JSON.stringify(b)),{k:BATTLE_KEY,b});await go('battle');await page.locator('.board').waitFor();};
 for(const [width,height] of [[320,844],[390,844],[844,390],[1440,1000]]){
  await page.setViewportSize({width,height});await load();await page.getByRole('button',{name:'Auto battle',exact:true}).click();
  await page.evaluate(()=>{window.__autoSamples=[];window.__sampleAuto=true;const sample=()=>{const s=document.querySelector('.auto-running');if(window.__sampleAuto&&s){const rect=n=>{const r=n.getBoundingClientRect();return [r.x,r.y,r.width,r.height];};window.__autoSamples.push({feedback:s.querySelector('.battle-feedback').getBoundingClientRect().height,portraits:[...s.querySelectorAll('.hero-main,.enemy-target>img')].map(rect),statuses:s.querySelectorAll('.status').length,transform:getComputedStyle(s.querySelector('.battle-center')).transform});}if(window.__sampleAuto)requestAnimationFrame(sample);};requestAnimationFrame(sample);});
  await page.waitForFunction(k=>JSON.parse(localStorage.getItem(k))?.heroes[0].mana===0,BATTLE_KEY);
  await page.waitForFunction(k=>JSON.parse(localStorage.getItem(k))?.moves>=2,BATTLE_KEY,{timeout:25000});
  await page.evaluate(()=>window.__sampleAuto=false);const samples=await page.evaluate(()=>window.__autoSamples);
  assert.ok(samples.length>30);assert.ok(samples.every(s=>s.feedback===0),'Auto action strip reappeared');assert.ok(new Set(samples.map(s=>s.statuses)).size>1,'status changes were not exercised');
  for(let i=0;i<8;i++)for(let j=0;j<4;j++){const values=samples.map(s=>s.portraits[i][j]);assert.ok(Math.max(...values)-Math.min(...values)<1,`Portrait moved or resized at ${width}, unit ${i}, dimension ${j}: ${Math.min(...values)}–${Math.max(...values)}`);}
  assert.ok(samples.every(s=>s.transform==='none'),'Auto shook the stage');assert.equal(await page.locator('.battle-hit-flash').count(),0);
  if(width===390)await page.screenshot({path:root+'artifacts/auto-calm-phone.png'});
  await page.getByRole('button',{name:'Auto battle',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.board.resolving'));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 assert.deepEqual(errors,[]);console.log('Auto portraits stay fixed through casts, cleanses, status changes and rune moves at four viewports; no message strip, screen shake, hit flash or browser errors');
}finally{await browser.close();}
