import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createBattle,COLORS} from '../src/engine.js';
import {defaultProfile,STARTER_TEAM} from '../src/progression.js';
import {PROFILE_KEY,BATTLE_KEY} from '../src/storage.js';
import {filterChampions} from '../src/collection.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'no-preference'}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('external '+u.host);return route.abort();}try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(p),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(p)]});}catch{errors.push('missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();};
 await go('roster');await page.locator('[data-tab="all"]').click();assert.equal(await page.locator('.library-card').count(),135);
 await page.locator('.library-art>img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
 await page.waitForFunction(()=>[...document.querySelectorAll('.library-art>img')].every(i=>i.complete&&i.naturalWidth>0));
 assert.ok(await page.locator('.library-art>img').evaluateAll(imgs=>imgs.every(i=>getComputedStyle(i).filter==='none'&&getComputedStyle(i).opacity==='1'&&getComputedStyle(i).objectFit==='contain')));
 assert.ok(await page.locator('.library-card').evaluateAll(cards=>cards.every(c=>c.querySelector('.library-label').getBoundingClientRect().top>=c.querySelector('.library-art').getBoundingClientRect().bottom-1)));
 await page.screenshot({path:root+'artifacts/identity-codex.png',fullPage:false});
 for(const [key,value]of [['color','red'],['role','attack'],['rarity','legendary'],['faction','dragondynasty'],['mana','charging']]){await page.locator('#collection-'+key).selectOption(value);const filters={tab:'all',color:'red',role:'attack',rarity:'legendary',faction:'dragondynasty',mana:'charging'};const selected=Object.fromEntries(await Promise.all(['color','role','rarity','faction','mana'].map(async k=>[k,await page.locator('#collection-'+k).inputValue()])));assert.equal(await page.locator('.library-card').count(),filterChampions(roster,defaultProfile(),{tab:'all',...selected}).length);}
 await page.locator('[data-action="reset-collection"]').first().click();assert.equal(await page.locator('.library-card').count(),135);
 await page.locator('#collection-search').fill('dragon dynasty');assert.equal(await page.locator('.library-card').count(),roster.filter(c=>c.faction==='dragondynasty').length);
 await page.locator('[data-action="reset-collection"]').first().click();await page.locator('#collection-sort').selectOption('attack');const ids=await page.locator('.library-card').evaluateAll(cards=>cards.map(c=>c.dataset.id));assert.deepEqual(ids,filterChampions(roster,defaultProfile(),{tab:'all',sort:'attack'}).map(c=>c.id));
 await page.locator('[data-action="roster"]').first().click();await page.locator('.roster-card').first().waitFor();assert.ok(await page.locator('.roster-card>img').evaluateAll(imgs=>imgs.every(i=>getComputedStyle(i).filter==='none'&&getComputedStyle(i).opacity==='1')));await page.getByRole('button',{name:'Close dialog'}).click();
 const state=createBattle(roster,STARTER_TEAM,'ashen-gate',4848);for(let i=0;i<15;i++){state.board[i].color=COLORS[i%5];state.board[i].special=[null,'blast','prism'][Math.floor(i/5)];}
 await page.evaluate(({p,b,pk,bk})=>{localStorage.setItem(pk,JSON.stringify(p));localStorage.setItem(bk,JSON.stringify(b));},{p:{...defaultProfile(),helpSeen:true},b:state,pk:PROFILE_KEY,bk:BATTLE_KEY});
 await page.reload();await page.locator('.topbar').waitFor();await go('battle');await page.locator('.board').waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('.board .rune-art')].every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.locator('.tile.blast').count(),5);assert.equal(await page.locator('.tile.prism').count(),5);
 for(const type of ['blast','prism'])for(const color of COLORS)assert.ok((await page.locator(`.tile.${type}.${color} .rune-art`).getAttribute('src')).endsWith(`${color}-${type}.svg`));
 await page.screenshot({path:root+'artifacts/identity-special-board.png',fullPage:true});
 for(const width of [390,320]){await page.setViewportSize({width,height:844});await page.screenshot({path:`${root}artifacts/identity-${width}-battle.png`,fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.setViewportSize({width:1440,height:1000});await go('summon');await page.locator('[data-action="summon"]').click();await page.waitForTimeout(600);assert.equal(await page.locator('.summon-reveal').count(),0);assert.equal(await page.locator('.is-activating .summon-ritual-vortex').count(),2);await page.screenshot({path:root+'artifacts/identity-portal-activation.png',fullPage:true});await page.locator('.summon-reveal').first().waitFor();await page.waitForTimeout(1100);assert.ok(await page.locator('.summon-reveal img').evaluateAll(imgs=>imgs.every(i=>getComputedStyle(i).filter==='none')));await page.screenshot({path:root+'artifacts/identity-portal-arrival.png',fullPage:true});
 await go('settings');await page.locator('#reduced-animation').check();await go('summon');await page.locator('[data-action="summon"]').click();await page.locator('.summon-reveal').first().waitFor();assert.ok(await page.locator('.summon-reveal').evaluateAll(cards=>cards.every(i=>getComputedStyle(i).animationName==='none')));
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,checks:['all 135 portraits load without dimming or veil','full portrait artwork above labels','combined filters, readable faction search, sorting and reset','bright team selection portraits','15 real tile variants render with correct special types','desktop and 390px/320px battle layout','portal activation before reveal and bright arrival','reduced animation preference','no missing assets, external calls or browser errors']},null,2));
}finally{await browser.close();}
