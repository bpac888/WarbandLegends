import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY,BATTLE_KEY} from '../src/storage.js';
import {DUNGEONS,DIFFICULTIES} from '../src/encounters.js';
import {battleFixtureResponse} from './battle-fixture.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright'),root=new URL('../',import.meta.url).pathname;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}),errors=[];
async function make(p=defaultProfile()){
 const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await c.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External '+u.hostname);return route.abort();}try{const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:battleFixtureResponse(file,await fs.readFile(file)),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff':'font/woff'})[path.extname(file)]});}catch{errors.push('Missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 await c.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p,key:PROFILE_KEY});
 const page=await c.newPage();page.on('pageerror',e=>errors.push(e.message));return {c,page};
}
const go=async(page,route)=>{await page.goto('http://legends.local/#/'+route);await page.locator('.page-'+route).waitFor();await page.evaluate(()=>document.fonts.ready);};
try{
 await fs.mkdir(root+'artifacts',{recursive:true});
 const {c,page}=await make();
 for(const [width,height] of [[320,568],[360,800],[390,844],[700,1000],[844,390],[1440,1000]]){
  await page.setViewportSize({width,height});await go(page,'dungeons');await page.locator('.dungeon-realm-painting img').evaluate(i=>i.decode());
  await page.locator('[data-action="dungeon-difficulty"][data-difficulty="normal"]').click();
  if(width<=700)await page.locator('.dungeon-phone-dragon img').evaluate(i=>i.decode());
  assert.equal(await page.locator('.dungeon-guardian').count(),7);assert.equal(await page.locator('.dungeon-guardian:disabled').count(),0);
  assert.equal(await page.locator('.dungeon-card,.recommended-level,.reward-line,.material-loot,.page-dungeons [data-action="roster"]').count(),0);
  assert.doesNotMatch(await page.locator('.page-dungeons').innerText(),/Beneath|chambers|Energy|Suggested|Gold|Gems/i);
  for(const d of DUNGEONS)assert.ok(!(await page.locator('.page-dungeons').innerText()).includes(d.name));
  assert.ok((await page.locator('.dungeon-realm-painting img').evaluate(i=>i.currentSrc)).endsWith(width<=700?'guardians-phone.webp':'guardians-wide.webp'));
  assert.ok(await page.locator('.dungeon-realm-painting img').evaluate(i=>i.naturalWidth>=1024&&getComputedStyle(i).opacity==='1'&&getComputedStyle(i).filter==='none'));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
  const boxes=await page.locator('.dungeon-guardian').evaluateAll(a=>a.map(n=>{const r=n.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height};}));
  assert.ok(boxes.every(r=>r.w>=44&&r.h>=44&&r.l>=0&&r.r<=width),'guardian hit areas '+width);
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert.ok(Math.min(a.r,b.r)-Math.max(a.l,b.l)<1||Math.min(a.b,b.b)-Math.max(a.t,b.t)<1,'overlap '+width);}
  assert.ok(await page.locator('.dungeon-art-effects i').evaluateAll(a=>a.every(n=>getComputedStyle(n).animationName==='none')));
  if([320,390,1440].includes(width)){await page.mouse.move(0,0);await page.screenshot({path:root+`artifacts/dungeon-realm-${width}.png`,fullPage:true});}
  if(width===390){
   const r=await page.locator('.dungeon-realm').boundingBox(),clip={x:r.x,y:r.y,width:r.width,height:r.height*.665};
   const before=await page.screenshot({clip});await page.locator('.dungeon-phone-dragon').evaluate(n=>n.style.display='none');const original=await page.screenshot({clip});await page.locator('.dungeon-phone-dragon').evaluate(n=>n.style.removeProperty('display'));
   assert.equal(createHash('sha256').update(before).digest('hex'),createHash('sha256').update(original).digest('hex'),'the six guardian faces and upper painting must remain pixel-identical');
   await page.mouse.click(r.x+r.width*.38,r.y+r.height*.77);assert.equal(await page.locator('#modal-title').innerText(),'Magmaheart Wyrm · Normal');await page.getByRole('button',{name:'Close dialog',exact:true}).click();
  }
  for(const d of DUNGEONS){
   await page.locator(`[data-dungeon="${d.id}"]`).click();assert.equal(await page.locator('#modal-title').innerText(),d.boss+' · Normal');
   assert.equal(await page.locator('#modal .modal-body').innerText(),'Confirm');assert.equal(await page.locator('#modal .modal-body img,#modal .energy-cost').count(),0);
   assert.ok(await page.locator('#modal').evaluate(m=>m.scrollWidth<=m.clientWidth+1));await page.getByRole('button',{name:'Close dialog',exact:true}).click();
  }
  for(const diff of ['hard','nightmare']){await page.locator(`[data-difficulty="${diff}"]`).click();assert.equal(await page.locator('.dungeon-guardian:disabled').count(),7);assert.equal(await page.locator('.guardian-seal').count(),7);}
  await page.locator('[data-difficulty="normal"]').click();await page.locator('.dungeon-guardian').first().focus();await page.keyboard.press('Enter');await page.locator('#modal[data-view="dungeon-stage"]').waitFor();await page.getByRole('button',{name:'Close dialog',exact:true}).click();
  await page.emulateMedia({reducedMotion:'no-preference'});assert.equal(await page.locator('.dungeon-alchemy-orbit').evaluate(n=>getComputedStyle(n).animationName),'dungeon-orbit');
  await page.evaluate(()=>document.body.classList.add('menu-motion-paused'));assert.equal(await page.locator('.dungeon-alchemy-orbit').evaluate(n=>getComputedStyle(n).animationPlayState),'paused');await page.emulateMedia({reducedMotion:'reduce'});
 }
 await c.close();
 // Launch all 21 real encounters through the painted bosses, charging the existing costs.
 const clears=Object.fromEntries(DUNGEONS.flatMap(d=>['normal','hard'].map(diff=>[`dungeon-${d.id}-${diff}`,1]))),initial={...defaultProfile(),dungeonClears:clears,dungeonWins:14};
 const run=await make(initial),p=run.page;let spent=0;
 for(const diff of DIFFICULTIES)for(const d of DUNGEONS){
  await go(p,'dungeons');await p.locator(`[data-action="dungeon-difficulty"][data-difficulty="${diff.id}"]`).click();await p.locator(`[data-dungeon="${d.id}"]`).click();await p.getByRole('button',{name:'Confirm',exact:true}).click();await p.locator('.board').waitFor();
  const b=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),BATTLE_KEY),cost={normal:1,hard:2,nightmare:3}[diff.id];spent+=cost;
  assert.equal(b.stageId,`dungeon-${d.id}-${diff.id}`);assert.equal(b.enemies[1].name,d.boss);assert.equal(b.energySpent,cost);if(d.id==='magmaheart_crucible')assert.equal(b.enemies[1].portrait,'assets/dungeons/magma-wyrm.svg');
  await p.locator('[data-action="battle-exit"]').click();await p.getByRole('button',{name:'Exit to Tavern',exact:true}).click();await p.locator('.home-shell').waitFor();
 }
 const after=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),PROFILE_KEY);assert.equal(after.energy,initial.energy-spent);assert.equal(spent,42);assert.equal(after.dungeonWins,14);assert.deepEqual(after.dungeonClears,clears);assert.equal(after.gold,initial.gold);assert.equal(after.gems,initial.gems);await run.c.close();
 const empty=await make({...defaultProfile(),energy:0});await go(empty.page,'dungeons');await empty.page.locator('.dungeon-guardian').first().click();await empty.page.getByRole('button',{name:'Confirm',exact:true}).click();await empty.page.waitForFunction(()=>document.querySelector('#notice').textContent.includes('Energy'));assert.equal(await empty.page.locator('.board').count(),0);await empty.c.close();
 assert.deepEqual(errors,[]);
 console.log('Seven painted guardians at six mobile/tablet/desktop/landscape sizes: no labels or info cards, separate phone art, high-resolution untinted paintings, nonoverlapping 44px+ hit areas, keyboard and compact confirmation, difficulty locks, reduced motion and hidden-tab pause. All 21 real boss launches retain their identities and 1/2/3 Energy costs; abandonment grants no rewards or progress. Zero Energy blocks entry. No missing assets or browser errors.');
}finally{await browser.close();}
