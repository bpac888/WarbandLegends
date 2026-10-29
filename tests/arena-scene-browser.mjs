import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
import {ARENA_RIVALS} from '../src/modes.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json')),added=roster.slice(189);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('external '+u.hostname);return route.abort();}try{const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.otf':'font/otf','.ttf':'font/ttf'})[path.extname(file)]});}catch{errors.push('missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const profile={...defaultProfile(),helpSeen:true};for(const c of added)profile.collection[c.id]=1;
 await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p:profile,key:PROFILE_KEY});
 const settle=async()=>{await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));};
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();await settle();};
 const cdp=await context.newCDPSession(page);
 const index=async()=>Number(await page.locator('.arena-scene').getAttribute('data-rival-index'));
 const ready=async()=>{await page.locator('.arena-fighter>img').evaluate(i=>i.decode());await page.waitForFunction(()=>getComputedStyle(document.querySelector('.arena-fighter')).visibility!=='hidden');await settle();};
 const swipe=async(dx,dy=0)=>{const b=await page.locator('.arena-floor').boundingBox(),x=b.x+b.width/2-dx/2,y=b.y+b.height*.55-dy/2;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let n=1;n<=6;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*n/6,y:y+dy*n/6}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
 await go('arena');await ready();await page.evaluate(()=>window.arenaPainting=document.querySelector('.arena-scene-art'));
 const before=await page.locator('.arena-scene').boundingBox();
 const imageMotion=()=>page.locator('.arena-fighter>img').evaluate(i=>getComputedStyle(i).transform);
 const startMotion=await imageMotion(),startGlow=await page.locator('.glow-left').evaluate(e=>getComputedStyle(e).opacity);
 await page.waitForTimeout(750);assert.notEqual(await imageMotion(),startMotion,'rival should breathe gently');assert.notEqual(await page.locator('.glow-left').evaluate(e=>getComputedStyle(e).opacity),startGlow,'firelight should flicker');
 assert.deepEqual(await page.locator('.arena-scene').boundingBox(),before,'animation must not shift the layout');
 await swipe(-150);assert.equal(await index(),1);await ready();await swipe(150);assert.equal(await index(),0);await ready();
 await swipe(0,90);assert.equal(await index(),0);
 await page.locator('.arena-floor').focus();await page.keyboard.press('ArrowLeft');assert.equal(await index(),8);await ready();await page.keyboard.press('ArrowRight');assert.equal(await index(),0);await page.keyboard.press('End');assert.equal(await index(),8);await page.keyboard.press('Home');assert.equal(await index(),0);
 await page.locator('.arena-next').evaluate(b=>{for(let n=0;n<22;n++)b.click();});assert.equal(await index(),4);await ready();assert.ok((await page.locator('.arena-challenge').getAttribute('data-stage')).endsWith(ARENA_RIVALS[4].preset_id));assert.ok((await page.locator('.arena-fighter>img').getAttribute('src')).includes(ARENA_RIVALS[4].preset_id));
 assert.ok(await page.evaluate(()=>window.arenaPainting===document.querySelector('.arena-scene-art')));assert.deepEqual(await page.locator('.arena-scene').boundingBox(),before);
 for(const [width,height] of [[320,700],[390,844],[430,932],[760,1000],[1440,1000],[844,390],[568,320]]){
  await page.setViewportSize({width,height});await go('arena');await ready();
  assert.equal(await page.locator('.arena-fighter>img').count(),1);assert.equal(await page.locator('.arena-challenge').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.ok(!/Edit Warband|Visit Shop|Challenge rival warbands|GHOST RIVALS/.test(await page.locator('.page-arena').innerText()));
  for(const r of ARENA_RIVALS){
   const current=ARENA_RIVALS[await index()];assert.equal(await page.locator('.arena-challenge').getAttribute('data-stage'),'arena-'+current.preset_id);assert.equal(await page.locator('.arena-rival-identity h2').innerText(),current.player_name);
   assert.ok(await page.locator('.arena-fighter>img').evaluate(i=>i.naturalWidth===1024&&i.naturalHeight===1536&&getComputedStyle(i).filter==='none'));
   const picture=await page.locator('.arena-fighter').boundingBox(),dock=await page.locator('.arena-challenge-dock').boundingBox();assert.ok(picture.y+picture.height<=dock.y+4||picture.x+picture.width<=dock.x+1,'fighter overlaps controls '+width);
   await page.locator('.arena-next').click();await ready();
  }
  await page.screenshot({path:root+`artifacts/arena-scene-${width}x${height}.png`,fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await go('arena');await page.locator('.arena-floor').focus();await page.keyboard.press('Home');
 for(const n of [0,4,8]){await page.locator('.arena-floor').focus();await page.keyboard.press('Home');for(let k=0;k<n;k++)await page.keyboard.press('ArrowRight');await ready();const r=ARENA_RIVALS[n];await page.locator('.arena-challenge').click();assert.equal(await page.locator('#modal-title').innerText(),r.player_name);assert.ok(await page.getByRole('button',{name:'Confirm',exact:true}).isEnabled());assert.equal(await page.locator('#modal .encounter-preview,#modal .encounter-tactics,#modal .recommended-level').count(),0);assert.ok((await page.locator('#modal').boundingBox()).height<190);assert.equal(await page.locator('#modal .modal-body button').count(),1);assert.equal(await page.locator('.arena-fighter>img').evaluate(i=>getComputedStyle(i).animationPlayState),'paused');await page.screenshot({path:root+`artifacts/arena-confirm-${n}.png`});await page.locator('[data-action="close"]').first().click();}
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.arena-next').click();await ready();assert.equal(await page.locator('.arena-fighter').evaluate(e=>e.getAnimations().length),0);assert.equal(await page.locator('.arena-fighter>img').evaluate(e=>e.getAnimations().length),0);assert.equal(await page.locator('.arena-environment-life').evaluate(e=>e.getAnimations({subtree:true}).length),0);
 // Start the selected rival's actual encounter and preserve normal 1-Energy entry.
 const chosen=ARENA_RIVALS[await index()];const energyBefore=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).energy,PROFILE_KEY);
 await page.locator('.arena-challenge').click();await page.getByRole('button',{name:'Confirm',exact:true}).click();await page.locator('.board').waitFor();assert.equal(await page.locator('.enemy-unit').count(),4);
 const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PROFILE_KEY);assert.equal(saved.energy,energyBefore-1);assert.equal(saved.arenaWins,profile.arenaWins);await page.screenshot({path:root+'artifacts/arena-scene-real-battle.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,rivals:9,viewports:7,checks:['real touch swipes, reverse and wraparound','arrows, keyboard and rapid input','one full-body rival with stable scenery and geometry','matching names, artwork and challenge targets for all nine rivals','phone, tablet, desktop and landscape layouts','small confirmation popup and animation pause while open','gentle rival motion and firelight with stable geometry','reduced motion and actual four-enemy battle entry at normal Energy cost','no missing assets, overflow, external calls or browser errors']},null,2));
}finally{await browser.close();}
