import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {battleFixtureResponse} from './battle-fixture.mjs';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY,BATTLE_KEY} from '../src/storage.js';
import {createBattle} from '../src/engine.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
const errors=[],p={...defaultProfile(),helpSeen:true,gold:20000,gems:1800,wins:12,dungeonWins:4};
async function contextFor({width=390,height=844,legacy=false,battle=null}={}){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External request: '+u.hostname);return route.abort();}
  try{
   const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));
   let body=await fs.readFile(file);
   if(legacy&&u.pathname.endsWith('/citadel-theme.css'))body=Buffer.from('');
   if(legacy&&u.pathname.endsWith('/menu-atmosphere.js'))body=Buffer.from('export {};');
   await route.fulfill({body:battleFixtureResponse(file,body),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.otf':'font/otf','.ttf':'font/ttf','.woff':'font/woff'})[path.extname(file)]});
  }catch(e){errors.push('Missing '+u.pathname+': '+e.message);await route.fulfill({status:404,body:'missing'});}
 });
 await context.addInitScript(({p,profileKey,battle,battleKey})=>{if(!localStorage.getItem(profileKey))localStorage.setItem(profileKey,JSON.stringify(p));if(battle)localStorage.setItem('legends.test.battle-fixture',JSON.stringify(battle));},{p,profileKey:PROFILE_KEY,battle,battleKey:BATTLE_KEY});
 return context;
}
async function fits(page,label){
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' horizontal overflow');
 if(await page.locator('#modal[open]').count())assert.ok(await page.locator('#modal').evaluate(m=>m.scrollWidth<=m.clientWidth+1),label+' dialog overflow');
 const rects=await page.locator('.topbar.with-nav .brand,.topbar.with-nav .nav-shortcut,.topbar.with-nav .topbar-right>.icon-button,.topbar.with-nav .game-wallet>span').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return {name:el.getAttribute('aria-label')||el.className,left:r.left,top:r.top,right:r.right,bottom:r.bottom};}));
 for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){
  const a=rects[i],b=rects[j],overlap=Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;
  assert.ok(!overlap,`${label}: header ${a.name} overlaps ${b.name}`);
 }
}
try{
 const context=await contextFor(),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator(route==='splash'?'.splash-screen':'.topbar').waitFor();await page.evaluate(()=>document.fonts.ready);};
 const routes=['splash','home','world','campaign','dungeons','arena','events','shop','inventory','roster','quests','daily','settings','alliance','champion/alkyron_starbreaker'];
 for(const width of [320,360,390,760,900,1440]){
  await page.setViewportSize({width,height:width>760?1000:844});
  for(const route of routes){
   await go(route);await fits(page,width+' '+route);
   assert.ok(await page.locator('body').evaluate(b=>b.classList.contains('menu-theme')));
   if(route!=='splash')assert.equal(await page.locator('.realm-atmosphere').evaluate(e=>e.hidden),false);
   if(width===390&&['home','world','shop','inventory','quests','daily','settings','events','roster','champion/alkyron_starbreaker'].includes(route))await page.screenshot({path:root+`artifacts/citadel-${route.replaceAll('/','-')}-phone.png`});
   if(route==='shop'){
    assert.equal(await page.locator('.game-nav [data-page="home"]').getAttribute('aria-current'),'page');
    for(const tab of ['gems','tokens','premium','supplies']){await page.locator(`[data-action="shop-tab"][data-tab="${tab}"]`).click();await fits(page,width+' shop '+tab);}
   }
  }
 }
 assert.equal(await page.evaluate(()=>document.fonts.check('600 20px "Citadel UI"')),true);assert.equal(await page.evaluate(()=>document.fonts.check('600 32px "Citadel Display"')),true);
 await page.setViewportSize({width:390,height:844});
 await go('shop');await page.locator('[data-action="material-preview"][data-id="star-thread"]').click();await fits(page,'purchase dialog');await page.screenshot({path:root+'artifacts/citadel-purchase-phone.png'});await page.locator('#modal [data-action="close"]').first().click();
 await page.locator('[data-action="shop-tab"][data-tab="premium"]').click();assert.equal(await page.locator('.premium-offers>article').count(),8);assert.ok(await page.locator('.premium-offers .button').evaluateAll(a=>a.every(b=>b.disabled)));await page.screenshot({path:root+'artifacts/citadel-premium-phone.png'});
 await go('roster');await page.locator('.collection-filters>summary').click();await page.locator('#collection-rarity').selectOption('rare');await fits(page,'filters');await page.locator('[data-action="collection-tab"][data-tab="teams"]').click();await fits(page,'saved teams');await page.screenshot({path:root+'artifacts/citadel-teams-phone.png'});
 await page.locator('[data-action="help"]').first().click();for(const topic of ['battles','growth','factions','summon']){await page.locator(`[data-action="guide-topic"][data-topic="${topic}"]`).click();await fits(page,'guide '+topic);}await page.screenshot({path:root+'artifacts/citadel-guide-phone.png'});await page.locator('#modal [data-action="close"]').first().click();
 await go('events');for(const button of await page.locator('[data-action="event-select"]').all()){await button.click();await fits(page,'event selection');}
 await go('settings');await page.locator('#player-name').fill('Celestial Keeper');await page.locator('[data-action="save-name"]').click();assert.equal(await page.locator('#player-name').inputValue(),'Celestial Keeper');assert.equal(await page.locator('.avatar-options>button').count(),6);assert.equal(await page.locator('.avatar-options').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),2);
 await go('daily');await page.locator('[data-action="daily-claim"]').click();assert.ok(await page.locator('[data-action="daily-claim"]').isDisabled());
 await go('campaign');await page.locator('.campaign-node[data-stage="ashen-gate"]').click();assert.equal(await page.locator('#modal [data-action="start"]').innerText(),'Confirm');await fits(page,'campaign confirmation');await page.locator('#modal [data-action="close"]').first().click();await page.locator('.campaign-node').last().scrollIntoViewIfNeeded();assert.ok(await page.locator('.campaign-map-viewport').evaluate(e=>e.scrollLeft>0),'phone campaign map must remain horizontally scrollable');
 assert.ok(await page.locator('.realm-atmosphere').evaluate(e=>[...e.children].every(n=>getComputedStyle(n).animationName==='none')),'reduced motion must disable decorative animations');
 await page.emulateMedia({reducedMotion:'no-preference'});await go('home');assert.equal(await page.locator('.aether-tracery').evaluate(e=>getComputedStyle(e).animationName),'aether-orbit');
 await page.setViewportSize({width:1440,height:1000});await go('shop');await page.locator('[data-action="shop-tab"][data-tab="premium"]').click();await page.screenshot({path:root+'artifacts/citadel-premium-desktop.png'});
 await context.close();
 // Exact visual regression check: the new menu styles/module must leave battles intact.
 for(const width of [390,1440]){
  const b=createBattle(roster,p.team,'ashen-gate',417),shots=[],signatures=[];b.enemies.forEach(e=>{e.hp=e.maxHp=100000;e.countdown=99;});
  for(const legacy of [true,false]){
   const c=await contextFor({width,height:width===390?844:1000,legacy,battle:b}),bp=await c.newPage();bp.on('pageerror',e=>errors.push(e.message));
   await bp.goto('http://legends.local/#/battle');await bp.locator('.board').waitFor();await bp.evaluate(()=>document.fonts.ready);
   if(!legacy){assert.equal(await bp.locator('body').evaluate(b=>b.classList.contains('menu-theme')),false);assert.equal(await bp.locator('.realm-atmosphere').evaluate(e=>e.hidden),true);}
   signatures.push(await bp.locator('.battle-shell,.board,.hero-unit,.enemy-unit,.battle-dock,.hero-name,.enemy-name,.hp-bar').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return {box:[r.x,r.y,r.width,r.height],font:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight,color:s.color,background:s.background,border:s.border,padding:s.padding,filter:s.filter,opacity:s.opacity};})));
   const image=await bp.screenshot();shots.push(createHash('sha256').update(image).digest('hex'));if(!legacy)await fs.writeFile(root+`artifacts/citadel-battle-preserved-${width}.png`,image);await c.close();
  }
  assert.deepEqual(signatures[1],signatures[0],width+' battle styles or geometry changed');assert.equal(shots[1],shots[0],width+' battle screenshot changed');
 }
 assert.deepEqual(errors,[]);
 console.log('15 routes at 320/360/390/760/900/1440; all Shop departments, purchase dialog, Guide topics, events, collection filters, Teams, settings and daily claim pass. New fonts load locally; reduced motion disables effects. Battle screenshots and computed layout match the previous presentation exactly at 390/1440. No header overlap, horizontal overflow, missing assets or browser errors.');
}finally{await browser.close();}
