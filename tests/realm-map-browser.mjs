import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}),errors=[];
async function makeContext({width=390,height=844,withoutMapCSS=false}={}){
 const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
 await c.route('**/*',async route=>{
  const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External '+u.hostname);return route.abort();}
  try{const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));let body=await fs.readFile(file);if(withoutMapCSS&&file.endsWith('/realm-map.css'))body=Buffer.from('');await route.fulfill({body,contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff':'font/woff'})[path.extname(file)]});}
  catch(e){errors.push('Missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}
 });
 await c.addInitScript(({p,key})=>localStorage.setItem(key,JSON.stringify(p)),{p:defaultProfile(),key:PROFILE_KEY});return c;
}
try{
 await fs.mkdir(root+'artifacts',{recursive:true});
 for(const [width,height] of [[320,568],[360,800],[390,844],[700,1000],[844,390],[1440,1000]]){
  const c=await makeContext({width,height}),page=await c.newPage();page.on('pageerror',e=>errors.push(e.message));
  const go=async()=>{await page.goto('http://legends.local/#/world');await page.locator('.realm-map').waitFor();await page.evaluate(()=>document.fonts.ready);await page.locator('.realm-painting img').evaluate(i=>i.decode());};
  await go();assert.equal(await page.locator('.realm-destination').count(),4);
  assert.equal(await page.locator('.world-card,.world-grid,.adventure-vista').count(),0);
  assert.ok((await page.locator('.realm-painting img').evaluate(i=>i.currentSrc)).endsWith(width<=700?'adventure-realm-phone.webp':'adventure-realm-wide.webp'));
  const geometry=await page.locator('.realm-destination').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect(),label=n.querySelector('.realm-label').getBoundingClientRect();return {name:n.getAttribute('aria-label'),l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height,label:[label.left,label.right]};}));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow '+width);
  assert.ok(geometry.every(r=>r.w>=44&&r.h>=44&&r.l>=0&&r.r<=width&&r.label[0]>=0&&r.label[1]<=width),'clipped or small destinations '+width);
  for(let i=0;i<geometry.length;i++)for(let j=i+1;j<geometry.length;j++){const a=geometry[i],b=geometry[j];assert.ok(Math.min(a.r,b.r)-Math.max(a.l,b.l)<1||Math.min(a.b,b.b)-Math.max(a.t,b.t)<1,'overlapping destinations '+width);}
  assert.ok(await page.locator('.realm-living-art i').evaluateAll(a=>a.every(n=>getComputedStyle(n).animationName==='none')),'reduced motion '+width);
  if([320,390,1440].includes(width))await page.screenshot({path:root+`artifacts/living-adventure-${width}.png`,fullPage:true});
  for(const [id,label,selector] of [['campaign','Campaign','.page-campaign'],['events','Special Events','.page-events'],['dungeons','Dungeons','.page-dungeons'],['arena','Arena','.page-arena']]){
   await page.getByRole('button',{name:label,exact:true}).click();await page.locator(selector).waitFor();assert.equal(new URL(page.url()).hash,'#/'+id);await go();
  }
  await page.getByRole('button',{name:'Campaign',exact:true}).focus();assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Campaign');await page.keyboard.press('Enter');await page.locator('.page-campaign').waitFor();await go();
  await page.emulateMedia({reducedMotion:'no-preference'});assert.equal(await page.locator('.realm-portal-orbit').evaluate(n=>getComputedStyle(n).animationName),'realm-portal-orbit');
  await page.evaluate(()=>document.body.classList.add('menu-motion-paused'));assert.equal(await page.locator('.realm-portal-orbit').evaluate(n=>getComputedStyle(n).animationPlayState),'paused');
  await c.close();
 }
 // Toggle the new sheet on one settled Tavern to avoid font-raster differences between fresh contexts.
 for(const width of [390,1440]){
  const c=await makeContext({width,height:width===390?844:1000}),p=await c.newPage(),shots=[],styles=[];
  await p.goto('http://legends.local/#/home');await p.locator('.citadel-destinations').waitFor();await p.evaluate(()=>document.fonts.ready);await p.locator('img').evaluateAll(a=>Promise.all(a.map(i=>i.decode().catch(()=>{}))));
  for(const disabled of [true,false]){
   await p.evaluate(disabled=>document.querySelector('link[href$="realm-map.css"]').disabled=disabled,disabled);
   styles.push(await p.locator('.topbar,.home-shell,.keeper-panel,.citadel-destination').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return {rect:[r.x,r.y,r.width,r.height],background:s.background,font:s.font,color:s.color,border:s.border};})));
   const shot=await p.screenshot();await fs.writeFile(root+`artifacts/realm-tavern-${width}-${disabled?'without':'with'}.png`,shot);shots.push(createHash('sha256').update(shot).digest('hex'));
  }
  assert.deepEqual(styles[0],styles[1],'Tavern styles changed at '+width);
  assert.equal(shots[0],shots[1],'Tavern changed at '+width);await c.close();
 }
 assert.deepEqual(errors,[]);
 console.log('Illustrated Adventure: all four destination routes work at 320/360/390/700/844/1440, with separate full phone art, no overlapping hit areas or horizontal overflow, 44px+ targets, keyboard entry, reduced motion and paused background animation. Tavern screenshots remain identical at 390/1440. No missing assets or browser errors.');
}finally{await browser.close();}
