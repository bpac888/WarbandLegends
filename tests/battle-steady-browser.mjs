import {createRequire} from 'node:module';import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {battleFixtureResponse} from './battle-fixture.mjs';import {createBattle,COLORS,findMatches,swap} from '../src/engine.js';import {defaultProfile} from '../src/progression.js';import {PROFILE_KEY,BATTLE_KEY} from '../src/storage.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright'),root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json'));
const profile={...defaultProfile(),helpSeen:true},team=['rimebow_tessa',...profile.team.slice(1)];
function fixture(length=3,seed=42){const b=createBattle(roster,team,'ashen-gate',seed);b.enemies.forEach(e=>{e.hp=e.maxHp=100000;e.atk=1;e.countdown=99;e.passive=null;});b.heroes.forEach(h=>h.mana=0);b.board=Array.from({length:35},(_,i)=>({id:i+1,color:COLORS[(i%7+2*Math.floor(i/7))%5],special:null}));for(let i=0;i<length;i++)b.board[i].color='blue';b.board[2].color='red';b.board[9].color='blue';b.nextTile=100;assert.equal(findMatches(b.board).length,0);return b;}
function creation(length,type){for(let seed=1;seed<100;seed++){const b=fixture(length,seed);if(swap(b,2,9,{frames:false}).state.board.some(t=>t.special===type))return b;}throw Error('No persistent '+type+' fixture');}
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External '+u.hostname);return route.abort();}try{const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:battleFixtureResponse(file,await fs.readFile(file)),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.otf':'font/otf','.woff':'font/woff'})[path.extname(file)]});}catch(e){errors.push(u.pathname+': '+e.message);await route.fulfill({status:404,body:'missing'});}});
 await context.addInitScript(({p,k})=>{if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify(p));},{p:profile,k:PROFILE_KEY});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const stage=async b=>{await page.goto('http://legends.local/#/home');await page.locator('.topbar').waitFor();await page.evaluate(({k,b})=>localStorage.setItem(k,JSON.stringify(b)),{k:BATTLE_KEY,b});await page.goto('http://legends.local/#/battle');await page.locator('.board').waitFor();await page.evaluate(()=>document.fonts.ready);};
 const settled=async()=>page.waitForFunction(()=>!document.querySelector('.board.resolving'));
 const boxes=async()=>page.locator('.hero-main,.hero-main>img,.enemy-target>img,.board').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(n=>Math.round(n*100)/100);}));
 const steady=async(before,label)=>assert.deepEqual(await boxes(),before,label);
 for(const [width,height]of [[320,844],[390,844],[844,390],[1440,1000]]){
  await page.setViewportSize({width,height});const b=fixture();b.heroes[0].mana=5.5;await stage(b);const before=await boxes();
  await page.locator('.tile[data-index="2"]').click();await page.locator('.tile[data-index="9"]').click();await page.waitForFunction(k=>JSON.parse(localStorage.getItem(k))?.heroes[0].mana===6.5,BATTLE_KEY);await settled();
  assert.ok(await page.locator('.hero-unit[data-unit="hero-0"]').evaluate(e=>e.classList.contains('charged')));assert.equal(await page.locator('.battle-feedback').innerText(),'');assert.equal(await page.locator('.battle-feedback').isVisible(),false);await steady(before,width+' ready');
  await page.locator('.hero-main[data-uid="hero-0"]').click();assert.match(await page.locator('.battle-feedback').innerText(),/Choose an enemy/);await steady(before,width+' choose target');
  await page.locator('[data-action="cancel-cast"]').click();await steady(before,width+' cancel');assert.equal(await page.locator('.battle-feedback').isVisible(),false);
  await page.locator('.hero-main[data-uid="hero-0"]').click();await page.locator('.enemy-target[data-uid="enemy-0"]').click();await page.waitForFunction(k=>JSON.parse(localStorage.getItem(k))?.heroes[0].mana===0,BATTLE_KEY);await settled();await steady(before,width+' cast and spend mana');
  assert.equal(await page.locator('.battle-feedback').isVisible(),false);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const gallery=fixture();for(let r=0;r<5;r++)for(let c=0;c<3;c++)gallery.board[r*7+c]={id:r*7+c+1,color:COLORS[r],special:[null,'blast','prism'][c]};await stage(gallery);
  assert.equal(await page.locator('.tile.blast').count(),5);assert.equal(await page.locator('.tile.prism').count(),5);assert.equal(await page.locator('.special-mark').count(),0);
  assert.ok(await page.locator('.rune-art').evaluateAll(images=>Promise.all(images.map(async i=>{await i.decode();return i.naturalWidth>0&&i.naturalHeight>0;})).then(a=>a.every(Boolean))));
  for(const type of ['blast','prism']){assert.ok(await page.locator('.tile.'+type).evaluateAll((nodes,type)=>nodes.every(n=>n.querySelector('img').getAttribute('src').endsWith('-'+type+'.svg')&&n.getAttribute('aria-label').includes(type==='blast'?'Blast Rune':'Prismatic Rune')),type));}
  if(width===390)await page.screenshot({path:root+'artifacts/distinct-special-runes-phone.png'});
 }
 await page.setViewportSize({width:390,height:844});
 for(const [length,type]of [[4,'blast'],[5,'prism']]){await stage(creation(length,type));await page.locator('.tile[data-index="2"]').click();await page.locator('.tile[data-index="9"]').click();await page.waitForFunction(k=>JSON.parse(localStorage.getItem(k))?.moves===1,BATTLE_KEY);await settled();assert.ok(await page.locator('.tile.'+type).count()>0);assert.ok(await page.locator('.tile.'+type+' .rune-art').first().evaluate(i=>i.complete&&i.naturalWidth>0&&i.naturalHeight>0));}
 assert.deepEqual(errors,[]);console.log('Manual readiness, targeting, cancel and cast keep champion/enemy/board geometry fixed at 320/390/844-landscape/1440. All 15 rune paintings load; real 4/5 matches create distinct Blast/Prism art. No overflow, missing assets or browser errors.');
}finally{await browser.close();}
