import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
import {playerDate} from '../src/keeper.js';
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json'));
const {chromium}=createRequire(import.meta.url)('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const errors=[],context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await context.route('**/*',async route=>{try{const u=new URL(route.request().url()),file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(file)]});}catch{errors.push(route.request().url());await route.abort();}});
 const p={...defaultProfile(),helpSeen:true,pathDate:playerDate(),pathWins:2,pathGems:150,pathSummons:1},target=roster.find(c=>c.rarity==='legendary'),donors=roster.filter(c=>c.rarity==='common'&&!p.team.includes(c.id)).slice(0,2);
 for(const c of [target,...donors])p.collection[c.id]=1;
 await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p,key:PROFILE_KEY});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));const profile=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PROFILE_KEY);
 await page.goto('http://daily.local/#/inventory');await page.getByRole('button',{name:'Daily Gift and Today’s Path',exact:true}).click();await page.waitForURL('**/#/daily');
 assert.equal(await page.locator('.path-objectives>article').count(),4);assert.ok(await page.locator('[data-action="path-claim"]').isDisabled());
 const title=await page.locator('.path-heading').innerText();assert.match(title,/Today’s Path[\s\S]*•[\s\S]*Daily Objectives/);
 assert.ok(await page.locator('.path-heading').evaluate(e=>{const s=[...e.children].map(c=>getComputedStyle(c));return s[0].fontSize===s[2].fontSize&&s[0].fontFamily===s[2].fontFamily;}));
 for(const [width,height]of [[320,568],[360,800],[375,812],[390,844],[430,932],[760,1024],[844,390],[1440,900]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow '+width);
  const cells=await page.locator('.path-objectives>article').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
  assert.ok(Math.abs(cells[0].y-cells[1].y)<1&&Math.abs(cells[2].y-cells[3].y)<1&&cells[2].y>cells[0].y&&cells[1].x>cells[0].x,'2 by 2 objectives '+width);
  assert.ok(cells.every(c=>c.height<=100));assert.ok(await page.locator('.daily-vista h2').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)<=26));assert.ok((await page.locator('.daily-vista').boundingBox()).height<=230);
  for(const button of await page.locator('.topbar button').all()){const r=await button.boundingBox();if(r)assert.ok(r.x>=0&&r.x+r.width<=width+1,'header control fits '+width);}
  const brand=await page.locator('.topbar .brand').boundingBox(),wallet=await page.locator('.game-wallet').boundingBox();assert.ok(brand.y+brand.height<=wallet.y+1||wallet.y+wallet.height<=brand.y+1||brand.x+brand.width<=wallet.x+1,'brand does not overlap currencies '+width);
  await page.locator('.daily-path-shortcut img,.account-xp-reward img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));assert.ok(await page.locator('.account-xp-reward img').evaluate(i=>i.naturalWidth>=1000));
  if(width===390||width===1440)await page.screenshot({path:root+`artifacts/daily-polished-${width}.png`});
 }
 await page.setViewportSize({width:390,height:844});await page.locator('[data-action="daily-claim"]').click();assert.ok(await page.locator('[data-action="daily-claim"]').isDisabled());
 await page.goto('http://daily.local/#/champion/'+target.id);await page.locator('[data-action="feed-preview"]').click();
 for(const donor of donors)await page.locator(`input[name="feed-copy"][value="${donor.id}"]`).check();
 await page.locator('[data-action="feed-confirm"]').click();
 const grown=await profile();assert.equal(grown.pathHeroLevels[target.id],3);
 await page.getByRole('button',{name:'Daily Gift and Today’s Path',exact:true}).click();assert.match(await page.locator('[data-objective="levels"]').innerText(),/3 \/ 3 levels/);assert.ok(await page.locator('[data-action="path-claim"]').isEnabled());
 const before=await profile();await page.locator('[data-action="path-claim"]').click();const claimed=await profile();assert.equal(claimed.accountXp,before.accountXp+50);assert.equal(claimed.gold,before.gold+400);assert.equal(claimed.gems,before.gems+125);assert.ok(await page.locator('[data-action="path-claim"]').isDisabled());
 await page.reload();assert.deepEqual(await profile(),claimed);assert.ok(await page.locator('[data-action="path-claim"]').isDisabled());
 assert.deepEqual(errors,[]);console.log('PASS: compact Day header, matching path heading text, four compact 2x2 objectives, HD XP/medal art, header shortcut and eight responsive viewports, feeding advances the fourth goal, saved once-only chest rewards.');
}finally{await browser.close();}
