import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile,validateProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
import {RITUAL_TIMING} from '../src/summoning-ui.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright'),root=new URL('../',import.meta.url).pathname;
const roster=JSON.parse(await fs.readFile(root+'data/champions.json','utf8')),browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}),errors=[];
async function make({width=390,height=844,reduced='reduce',gems=5000,rolls=[]}={}){
 const c=await browser.newContext({viewport:{width,height},reducedMotion:reduced});
 await c.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External '+u.hostname);return route.abort();}try{const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff':'font/woff'})[path.extname(file)]});}catch{errors.push('Missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 await c.addInitScript(({p,key,rolls})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));window.__altarRolls=[...rolls];const native=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=a=>{if(a instanceof Uint32Array&&a.length===1&&window.__altarRolls.length){a[0]=Math.floor(window.__altarRolls.shift()*4294967296);return a;}return native(a);};},{p:{...defaultProfile(),gems},key:PROFILE_KEY,rolls});
 const page=await c.newPage();page.on('pageerror',e=>errors.push(e.message));return {c,page};
}
const read=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PROFILE_KEY);
const go=async(page,route='summon')=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();await page.evaluate(()=>document.fonts.ready);};
const fits=async(page,label)=>{assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' overflow');if(await page.locator('#modal[open]').count())assert.ok(await page.locator('#modal').evaluate(m=>m.scrollWidth<=m.clientWidth+1),label+' dialog overflow');};
try{
 await fs.mkdir(root+'artifacts',{recursive:true});
 const idle=await make();
 for(const [width,height] of [[320,568],[360,800],[390,844],[700,1000],[844,390],[568,320],[1440,1000]]){
  const p=idle.page;await p.setViewportSize({width,height});await go(p);await p.locator('.portal-architecture img').evaluate(i=>i.decode());await p.locator('.portal-energy').evaluateAll(a=>Promise.all(a.map(i=>i.decode())));
  await fits(p,width+' altar');const b=await p.locator('.altar-actions>button').evaluateAll(a=>a.map(n=>{const r=n.getBoundingClientRect();return {w:r.width,h:r.height,b:r.bottom,sw:n.scrollWidth,cw:n.clientWidth};}));
  assert.equal(b.length,2);assert.ok(b.every(r=>r.h>=44&&r.h<=64&&r.w>=44&&r.sw<=r.cw),'compact controls '+width+': '+JSON.stringify(b));
  assert.ok(await p.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),'altar should fit screen '+width+'x'+height);
  const art=await p.locator('.altar-portal').boundingBox();assert.ok(art.height>=130&&art.width>=130,'portal too small '+width);assert.ok(art.y+art.height<=height+1,'portal below screen');
  assert.ok((await p.locator('.portal-architecture img').evaluate(i=>i.currentSrc)).endsWith(width<=700&&height>=width?'portal-phone.webp':'portal-wide.webp'));
  assert.equal(await p.locator('.portal-architecture img').evaluate(i=>getComputedStyle(i).filter),'none');assert.equal(await p.locator('.portal-architecture img').evaluate(i=>getComputedStyle(i).opacity),'1');
  assert.ok(await p.locator('.portal-surface *').evaluateAll(a=>a.every(n=>getComputedStyle(n).animationName==='none')),'reduced-motion idle '+width);
  if([320,390,1440].includes(width))await p.screenshot({path:root+`artifacts/celestial-altar-${width}.png`});
 }
 await idle.page.setViewportSize({width:390,height:844});await go(idle.page);await idle.page.emulateMedia({reducedMotion:'no-preference'});await idle.page.reload();await idle.page.locator('.altar-page').waitFor();await idle.page.locator('.page-summon').evaluate(n=>Promise.all(n.getAnimations().map(a=>a.finished.catch(()=>{}))));
 const surface=await idle.page.locator('.altar-portal').boundingBox(),start=await idle.page.locator('.portal-energy').first().evaluate(n=>getComputedStyle(n).transform);await idle.page.waitForTimeout(350);assert.notEqual(await idle.page.locator('.portal-energy').first().evaluate(n=>getComputedStyle(n).transform),start);assert.deepEqual(await idle.page.locator('.altar-portal').boundingBox(),surface,'idle motion must not change geometry');
 await idle.page.evaluate(()=>document.body.classList.add('menu-motion-paused'));assert.equal(await idle.page.locator('.portal-energy').first().evaluate(n=>getComputedStyle(n).animationPlayState),'paused');await idle.c.close();
 // Real one-call animation, saving the roll and payment before any visual phase.
 const live=await make({reduced:'no-preference',rolls:[.88,0]}),p=live.page;await go(p);await p.locator('[data-action="summon"]').click();await p.locator('.is-activating').waitFor();let saved=await read(p);assert.equal(saved.gems,4900);assert.equal(saved.summons,1);assert.ok(validateProfile(saved,roster));
 assert.equal(await p.locator('.summon-ritual-traveler').count(),0);assert.equal(await p.locator('.is-activating .summon-ritual-vortex').count(),2);await p.waitForTimeout(550);await p.screenshot({path:root+'artifacts/celestial-ritual-charge-phone.png'});
 await p.locator('.summon-ritual-traveler').waitFor();await p.waitForTimeout(1900);assert.equal(await p.locator('.summon-ritual').getAttribute('data-rarity'),'mythical');assert.equal(await p.locator('.summon-ritual-traveler img').evaluate(i=>getComputedStyle(i).filter),'none');assert.equal(await p.locator('.summon-ritual-traveler').evaluate(i=>getComputedStyle(i).filter),'none');await fits(p,'arrival phone');await p.screenshot({path:root+'artifacts/celestial-ritual-arrival-phone.png'});
 await p.getByRole('button',{name:'Show results',exact:true}).click();assert.equal(await p.locator('.summon-result-card').count(),1);assert.equal(await p.locator('.result-mythical').count(),1);assert.deepEqual(await read(p),saved);await p.getByRole('button',{name:'Continue',exact:true}).click();
 // Ten calls preserve twins and the guaranteed Rare, and skipping cannot duplicate payment/results.
 await p.evaluate(()=>window.__altarRolls=[...Array.from({length:9},()=>[.99,0,0]).flat(),.99,0]);await p.locator('[data-action="multi-summon"]').click();await p.locator('.is-activating').waitFor();saved=await read(p);assert.equal(saved.gems,4000);assert.equal(saved.summons,20);await p.getByRole('button',{name:'Show results',exact:true}).click();assert.equal(await p.locator('.summon-result-card').count(),19);assert.equal(await p.locator('.result-rare').count(),1);assert.match(await p.locator('.summon-summary').innerText(),/9 twin-Common bonus/);await p.waitForTimeout(RITUAL_TIMING.activating+150);assert.deepEqual(await read(p),saved);assert.equal(await p.locator('.summon-result-card').count(),19);await p.screenshot({path:root+'artifacts/celestial-ritual-ten-results-phone.png'});await p.getByRole('button',{name:'Continue',exact:true}).click();
 // Escape and browser navigation still retain exactly one paid summon.
 await p.evaluate(()=>window.__altarRolls=[0,0]);await p.locator('[data-action="summon"]').click();await p.locator('.is-activating').waitFor();await p.keyboard.press('Escape');await p.locator('.summon-results').waitFor();assert.equal((await read(p)).summons,21);assert.equal((await read(p)).gems,3900);await p.getByRole('button',{name:'Continue',exact:true}).click();
 await p.evaluate(()=>window.__altarRolls=[.5,0]);await p.locator('[data-action="summon"]').click();await p.locator('.is-activating').waitFor();saved=await read(p);await p.evaluate(()=>location.hash='#/home');await p.locator('.home-shell').waitFor();await p.reload();await p.locator('.home-shell').waitFor();assert.deepEqual(await read(p),saved);assert.equal(saved.summons,22);assert.equal(saved.gems,3800);await live.c.close();
 // Reduced motion goes straight to the real results; insufficient balances stay disabled.
 const reduced=await make({rolls:[.99,0,0]}),rp=reduced.page;await go(rp);await rp.locator('[data-action="summon"]').click();await rp.locator('.summon-results').waitFor();assert.equal(await rp.locator('.summon-result-card').count(),2);assert.equal((await read(rp)).gems,4900);assert.equal((await read(rp)).summons,2);await reduced.c.close();
 const poor=await make({gems:99});await go(poor.page);assert.equal(await poor.page.locator('.altar-actions>button:disabled').count(),2);assert.equal(await poor.page.locator('.gem-shortage').count(),0);assert.equal((await read(poor.page)).gems,99);await poor.c.close();
 assert.deepEqual(errors,[]);console.log('Celestial Altar passes seven phone/tablet/desktop/landscape layouts, compact 44–64px summon controls, high-resolution art, stable animated idle geometry, reduced motion and hidden-tab pause. Real Mythical reveal, one/ten calls, 19-result twin batch with guaranteed Rare, early persistence, skip/timeout, Escape, navigation/reload and insufficient-Gem handling retain exact costs and copies. No missing assets or browser errors.');
}finally{await browser.close();}
