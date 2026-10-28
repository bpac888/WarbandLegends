import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright'),root=new URL('../',import.meta.url).pathname;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}),errors=[];
try{
 const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await c.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External '+u.hostname);return route.abort();}try{const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff':'font/woff'})[path.extname(file)]});}catch{errors.push('Missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 await c.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p:{...defaultProfile(),wins:4},key:PROFILE_KEY});
 const page=await c.newPage();page.on('pageerror',e=>errors.push(e.message));
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.page-'+route).waitFor();await page.evaluate(()=>document.fonts.ready);};
 for(const [width,height] of [[320,568],[390,844],[760,844],[1440,1000],[568,320],[844,390]]){
  await page.setViewportSize({width,height});await go('campaign');await page.locator('.world-painting').evaluate(i=>i.decode());
  assert.equal(await page.locator('.page-campaign [data-action="roster"],.campaign-realm-heading,.map-travel-hint,.campaign-progress-note').count(),0);
  assert.equal(await page.locator('.campaign-page-heading').innerText(),'Campaign');
  assert.equal(await page.locator('.campaign-node').count(),25);assert.equal(await page.locator('.campaign-node:disabled').count(),24);
  const layout=await page.evaluate(()=>{const v=document.querySelector('.campaign-map-viewport').getBoundingClientRect(),n=document.querySelector('.campaign-node[data-current="true"]').getBoundingClientRect();return {viewport:{x:v.x,y:v.y,w:v.width,h:v.height,b:v.bottom},node:{x:n.x,y:n.y,r:n.right,b:n.bottom,w:n.width,h:n.height},sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight};});
  assert.ok(layout.sw<=width&&layout.sh<=height+1,'Campaign should fill the screen without page scrolling '+width+'x'+height+': '+JSON.stringify(layout));
  assert.ok(layout.viewport.b<=height+1&&layout.node.x>=layout.viewport.x&&layout.node.r<=layout.viewport.x+layout.viewport.w&&layout.node.y>=layout.viewport.y&&layout.node.b<=layout.viewport.b,'current stage must be visible '+width+'x'+height);
  assert.ok(layout.node.w>=44&&layout.node.h>=44,'readable stage targets');

  if(height>500)assert.ok(layout.viewport.h>=height*(width<360?.5:.55),'map must occupy most of the screen '+width+': '+JSON.stringify(layout));
  if([320,390,1440].includes(width))await page.screenshot({path:root+`artifacts/campaign-focus-${width}.png`});
  const sources=[];for(const diff of ['normal','hard','nightmare']){await page.locator(`[data-action="campaign-difficulty"][data-difficulty="${diff}"]`).click();sources.push(await page.locator('.world-painting').getAttribute('src'));assert.equal(await page.locator('.campaign-node').count(),25);assert.equal(await page.locator('.campaign-node:disabled').count(),24);}
  assert.equal(new Set(sources).size,3);
  await page.locator('[data-action="campaign-difficulty"][data-difficulty="normal"]').click();await page.locator('.campaign-node[data-stage="ashen-gate"]').click();assert.equal(await page.locator('#modal [data-action="start"]').innerText(),'Confirm');assert.equal(await page.locator('#modal .modal-body p').count(),0);await page.getByRole('button',{name:'Close dialog',exact:true}).click();
  await page.locator('.campaign-node').last().scrollIntoViewIfNeeded();assert.ok(await page.locator('.campaign-map-viewport').evaluate(e=>e.scrollWidth<=e.clientWidth||e.scrollLeft>0),'map remains pannable');
  await go('quests');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await page.locator('.campaign-victory-bonus').count(),1);assert.match(await page.locator('.campaign-victory-bonus').innerText(),/50 Gems for every 5 campaign victories/);assert.equal(await page.locator('.campaign-victory-bonus [role="progressbar"]').getAttribute('aria-valuenow'),'4');
  assert.ok(await page.locator('.campaign-victory-bonus img').evaluate(i=>i.src.endsWith('/assets/items/inventory-gems.webp')));
  if(width===390)await page.screenshot({path:root+'artifacts/quests-campaign-bonus-phone.png',fullPage:true});
  await page.getByRole('button',{name:/Completed/,exact:false}).click();assert.equal(await page.locator('.campaign-victory-bonus').count(),1);
 }
 await page.evaluate(key=>{const p=JSON.parse(localStorage.getItem(key));p.wins=5;localStorage.setItem(key,JSON.stringify(p));},PROFILE_KEY);await page.reload();await page.locator('.campaign-victory-bonus').waitFor();assert.equal(await page.locator('.campaign-victory-bonus [role="progressbar"]').getAttribute('aria-valuenow'),'0');
 assert.deepEqual(errors,[]);
 console.log('Campaign fills phone/tablet/desktop/landscape screens at six sizes, current stage stays visible, all three 25-stage maps retain locks and 44px targets, simple confirmation and panning work. Recurring Gem bonus is on Quests with the shared art and correct progress across filters. No overflow, missing assets or browser errors.');
 await c.close();
}finally{await browser.close();}
