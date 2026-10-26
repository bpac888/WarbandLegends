import {battleFixtureResponse} from './battle-fixture.mjs';
import {createRequire} from 'node:module';import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {defaultProfile,summon} from '../src/progression.js';import {heroForId,nextCopyId} from '../src/hero-copies.js';
import {feedingQuote} from '../src/feeding.js';
import {PROFILE_KEY} from '../src/storage.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];await fs.mkdir(root+'artifacts',{recursive:true});
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External '+u.href);return route.abort();}try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:battleFixtureResponse(p,await fs.readFile(p)),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(p)]});}catch{errors.push('Missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();};

 const initial={...defaultProfile(),gold:10000,helpSeen:true},target=heroForId(roster,initial.team[0]);
 const grant=hero=>{const c=nextCopyId(initial,hero.id);initial.copySequence=c.sequence;initial.collection[c.id]=1;initial.heroXp[c.id]=0;initial.ascensions[c.id]=0;initial.awakenings[c.id]=0;return c.id;};
 const same=grant(target),rare=grant(roster.find(c=>c.rarity==='rare'&&c.color===target.color&&c.id!==target.id)),common=grant(roster.find(c=>c.rarity==='common'&&c.color===target.color)),protectedRare=grant(target),legendary=grant(roster.find(c=>c.rarity==='legendary')),mythical=grant(roster.find(c=>c.rarity==='mythical'));
 initial.teamSlots[0]=[protectedRare,...initial.team.slice(0,4)];const ids=[same,rare,common],q=feedingQuote(initial,target,ids,roster);assert.equal(q.xp,8550);
 const read=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),PROFILE_KEY);
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:900});await go('home');await page.evaluate(({k,p})=>localStorage.setItem(k,JSON.stringify(p)),{k:PROFILE_KEY,p:initial});await page.reload();await go('champion/'+target.id);const before=await read();
  await page.locator('[data-action="feed-preview"]').click();const dialog=page.locator('#modal');assert.match(await dialog.innerText(),/Common or Rare/);assert.match(await dialog.innerText(),/same hero ×5/);assert.equal(await dialog.locator('[name="feed-copy"]').count(),3);
  for(const id of [protectedRare,legendary,mythical,target.id])assert.equal(await dialog.locator('[name="feed-copy"][value="'+id+'"]').count(),0);
  for(const [id,amount]of [[same,6750],[rare,1350],[common,450]])assert.ok((await dialog.locator('label').filter({has:page.locator('[value="'+id+'"]')}).innerText()).includes('+'+amount+' XP'));
  for(const id of ids)await dialog.locator('[name="feed-copy"][value="'+id+'"]').check();assert.ok((await dialog.locator('.feeding-summary').innerText()).includes('+'+q.gained+' XP'));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(width===390)await page.screenshot({path:root+'artifacts/feeding-common-rare-phone.png'});
  await dialog.getByRole('button',{name:'Cancel',exact:true}).click();assert.deepEqual(await read(),before);
  await page.locator('[data-action="feed-preview"]').click();for(const id of ids)await dialog.locator('[name="feed-copy"][value="'+id+'"]').check();await dialog.locator('[data-action="feed-confirm"]').click();let saved=await read();assert.equal(saved.gold,initial.gold-75);assert.equal(saved.heroXp[target.id],q.gained);for(const id of ids)assert.equal(saved.collection[id],undefined);assert.equal(saved.collection[protectedRare],1);assert.equal(saved.collection[target.id],1);
  await page.reload();await page.locator('.hero-development').waitFor();assert.deepEqual(await read(),saved);
  await page.getByRole('button',{name:'Guide',exact:true}).click();await page.locator('[data-action="guide-topic"][data-topic="growth"]').click();assert.match(await dialog.innerText(),/3× Common XP/);assert.match(await dialog.innerText(),/15× Common XP/);await dialog.locator('[data-action="close"]').click();
 }
 assert.deepEqual(errors,[]);console.log('Mixed feeding, Rare 3× XP, matching Rare 5× bonus, protection, cancellation, persistence and Guide passed at 320/390/1440');
}finally{await browser.close();}
