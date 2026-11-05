import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
const root=new URL('../',import.meta.url).pathname,{chromium}=createRequire(import.meta.url)('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
try{
 const context=await browser.newContext({reducedMotion:'reduce'}),errors=[];
 await context.route('**/*',async route=>{try{const u=new URL(route.request().url());assert.equal(u.hostname,'splash.local');const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(file)]});}catch{errors.push(route.request().url());await route.abort();}});
 await context.addInitScript(({key,p})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{key:PROFILE_KEY,p:{...defaultProfile(),helpSeen:true}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const [width,height]of [[320,568],[390,844],[430,932],[760,1024],[844,390],[1440,900]]){
  await page.setViewportSize({width,height});await page.goto('http://splash.local/#/splash');await page.locator('.splash-brand').waitFor();await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.splash-rule,.splash-heroes,.splash-constellation').count(),0);
  assert.equal(await page.locator('.splash-screen').evaluate(e=>getComputedStyle(e,'::after').display),'none');
  const image=await page.locator('.splash-landscape').evaluate(async e=>{const url=getComputedStyle(e).backgroundImage.slice(5,-2),im=new Image();im.src=url;await im.decode();return {url,width:im.naturalWidth,height:im.naturalHeight};});
  assert.equal(image.url.includes('legends-splash-phone.webp'),width/height<=.8);assert.ok(image.width>=900&&image.height>=850);
  const button=await page.locator('.splash-enter').boundingBox(),brand=await page.locator('.splash-brand').boundingBox(),caption=await page.locator('.splash-caption').boundingBox();
  assert.ok(button.height>=44&&button.x>=0&&button.x+button.width<=width);
  assert.ok(brand.y>=button.y+button.height+5,'logo stays below entry button');
  assert.ok(brand.x>=0&&brand.x+brand.width<=width&&brand.y+brand.height<=caption.y,'logo and caption fit');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight+1),'splash fits viewport');
  if(width===390||width===1440||width===844)await page.screenshot({path:root+`artifacts/splash-polished-${width}.png`});
 }
 const saved=await page.evaluate(key=>localStorage.getItem(key),PROFILE_KEY);await page.keyboard.press('Enter');await page.locator('.courtyard-scene').waitFor();assert.equal(await page.evaluate(key=>localStorage.getItem(key),PROFILE_KEY),saved);
 await page.goto('http://splash.local/#/splash');await page.getByRole('button',{name:/Enter The Courtyard/}).click();await page.locator('.courtyard-scene').waitFor();
 assert.deepEqual(errors,[]);console.log('PASS: dedicated HD phone art, no frame/divider or side figures, logo below entry, six viewport sizes, no overflow, keyboard/touch entry and unchanged save.');
}finally{await browser.close();}
