import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const ROOT=new URL('../',import.meta.url).pathname;
const PREVIEW=ROOT+'artifacts';
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const {createBattle,validMoves}=await import(new URL('../src/engine.js',import.meta.url));
 const {STARTER_TEAM,defaultProfile}=await import(new URL('../src/storage.js',import.meta.url));
 const roster=JSON.parse(await fs.readFile(ROOT+'data/champions.json','utf8'));
 await fs.mkdir(PREVIEW,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[],missing=[],external=[];
 await context.route('**/*',async route=>{const url=new URL(route.request().url());if(url.hostname!=='legends.local'){external.push(url.origin);return route.abort();}try{const p=path.join(ROOT+'dist',decodeURIComponent(url.pathname)==='/'?'index.html':decodeURIComponent(url.pathname));const body=await fs.readFile(p);const ext=path.extname(p);await route.fulfill({body,contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'})[ext]});}catch{missing.push(url.pathname);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();async function reloadBattle(){await page.goto('http://legends.local/#/home');await page.reload();await page.getByRole('button',{name:'Resume battle'}).click();}page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://legends.local/');await page.getByRole('button',{name:/Enter the Citadel/}).click();await page.getByRole('heading',{name:'Your warband'}).waitFor();
 await page.screenshot({path:PREVIEW+'/desktop-home.png',fullPage:true});
 await page.getByRole('button',{name:/Change champions/}).click();assert.equal(await page.locator('.roster-card').count(),135);
 await page.getByRole('searchbox').fill('Sivren');assert.equal(await page.locator('.roster-card').count(),1);
 await page.getByRole('searchbox').fill('');await page.locator('#mana-filter').selectOption('charging');assert.equal(await page.locator('.roster-card').count(),12);await page.getByRole('button',{name:'Special details for Dragon Mage',exact:true}).click();assert.equal(await page.locator('.special-level').count(),2);assert.ok((await page.locator('.ability-cost').textContent()).includes('8 / 10'));await page.getByRole('button',{name:/Back to your warband/}).click();assert.equal(await page.locator('#mana-filter').inputValue(),'charging');assert.equal(await page.locator('.roster-card').count(),12);
 await page.screenshot({path:PREVIEW+'/charging-roster.png',fullPage:true});
 await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:/Enter the Ashen Gate/}).click();await page.getByRole('button',{name:/Into the fray/}).click();
 assert.equal(await page.locator('.tile').count(),35);assert.equal(await page.locator('.hero-unit').count(),5);assert.equal(await page.locator('.enemy-unit').count(),3);
 await page.screenshot({path:PREVIEW+'/desktop-battle.png',fullPage:true});
 assert.equal(await page.locator('.board .rune-art').count(),35);assert.ok(await page.locator('.board .rune-art').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)));
 await page.getByRole('button',{name:'Effects guide',exact:true}).click();await page.getByRole('heading',{name:'The effect field guide'}).waitFor();assert.ok(await page.getByRole('heading',{name:'Tile Boost',exact:true}).isVisible());
 await page.getByRole('button',{name:'Ailments',exact:true}).click();assert.ok(await page.getByRole('heading',{name:'Mana Block',exact:true}).isVisible());assert.ok(await page.getByRole('heading',{name:'Bleed',exact:true}).isVisible());
 await page.getByRole('button',{name:'Instant actions',exact:true}).click();assert.ok(await page.getByRole('heading',{name:'Dispel',exact:true}).isVisible());await page.screenshot({path:PREVIEW+'/effect-guide.png',fullPage:true});await page.getByRole('button',{name:'Close dialog'}).click();

 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('legends.runes.battle.v3')));const move=validMoves(state.board)[0];
 await page.locator(`[data-index="${move[0]}"]`).focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.dataset.index),String(move[0]));
 await page.locator(`[data-index="${move[1]}"]`).focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>!document.querySelector('.board.resolving'));assert.equal(await page.locator('.move-counter b').textContent(),'1');assert.equal(await page.evaluate(()=>document.activeElement.dataset.index),String(move[1]));
 await reloadBattle();assert.equal(await page.locator('.move-counter b').textContent(),'1');
 await page.getByRole('button',{name:/Animation speed/}).click();assert.equal(await page.getByRole('button',{name:/Animation speed/}).textContent(),'2×');
 // Charge a genuine engine state to exercise skill targeting and persisted results.
 const charged=createBattle(roster,STARTER_TEAM,'ashen-gate',123);charged.heroes[0].mana=charged.heroes[0].manaMax;
 await page.evaluate(s=>localStorage.setItem('legends.runes.battle.v3',JSON.stringify(s)),charged);await reloadBattle();
 await page.locator('[data-action="hero"][data-uid="hero-0"]').click();await page.getByRole('button',{name:'Cast Charge 2'}).click();await page.locator('[data-action="enemy"][data-uid="enemy-0"]').click();await page.waitForFunction(()=>!document.querySelector('.board.resolving'));assert.equal(await page.locator('.move-counter b').textContent(),'0');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('legends.runes.battle.v3')).heroes[0].mana),0);
 const dragState=await page.evaluate(()=>JSON.parse(localStorage.getItem('legends.runes.battle.v3'))),dragMove=validMoves(dragState.board)[0];
 const from=await page.locator(`[data-index="${dragMove[0]}"]`).boundingBox(),to=await page.locator(`[data-index="${dragMove[1]}"]`).boundingBox();
 await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:5});await page.mouse.up();await page.waitForFunction(()=>!document.querySelector('.board.resolving'));assert.equal(await page.locator('.move-counter b').textContent(),'1');
 for(const width of [390,320]){await page.setViewportSize({width,height:844});await page.screenshot({path:`${PREVIEW}/mobile-${width}-battle.png`,fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);const tile=await page.locator('.tile').first().boundingBox();assert.ok(tile.width>=30);}
 // Three-charge UI: exact gates, holding charge, choosing a lower unlocked level.
 const three=roster.find(c=>c.id==='azure_sovereign'),threeTeam=[three.id,...STARTER_TEAM.slice(0,4)];
 for(const [amount,available] of [[5,1],[10,2],[15,3]]){
  const state=createBattle(roster,threeTeam,'ashen-gate',444);state.heroes[0].mana=amount;
  await page.evaluate(s=>localStorage.setItem('legends.runes.battle.v3',JSON.stringify(s)),state);await reloadBattle();
  assert.equal(await page.locator('.hero-unit').first().locator('.charge-notch').count(),2);
  await page.locator('[data-action="hero"][data-uid="hero-0"]').click();assert.equal(await page.locator('[data-action="choose-charge"]:enabled').count(),available);
  assert.equal(await page.locator('.special-level').count(),3);assert.ok(await page.evaluate(()=>document.querySelector('#modal').scrollWidth<=document.querySelector('#modal').clientWidth));
  if(amount===10)await page.screenshot({path:PREVIEW+'/mobile-charge-levels.png',fullPage:true});
  await page.getByRole('button',{name:'Close dialog'}).click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('legends.runes.battle.v3')).heroes[0].mana),amount);
  await page.locator('[data-action="hero"][data-uid="hero-0"]').click();await page.getByRole('button',{name:'Cast Charge '+available,exact:true}).click();await page.locator('[data-action="enemy"][data-uid="enemy-0"]').click();await page.waitForFunction(()=>!document.querySelector('.board.resolving'));
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('legends.runes.battle.v3')));assert.equal(saved.heroes[0].mana,0);assert.equal(saved.moves,0);assert.ok(saved.log.some(l=>l.text.includes('Charge '+available)));
 }
 const affected=createBattle(roster,STARTER_TEAM,'ashen-gate',555);affected.heroes[1].effects={shield:{turns:2,source:'hero-1',appliedMove:0},guard:{turns:2,source:'hero-1',appliedMove:0}};affected.heroes[1].shield=200;
 await page.evaluate(s=>localStorage.setItem('legends.runes.battle.v3',JSON.stringify(s)),affected);await reloadBattle();
 await page.locator('.hero-unit').nth(1).getByRole('button',{name:/Barrier on/}).click();assert.ok(await page.getByRole('heading',{name:'Barrier',exact:true}).isVisible());assert.ok(await page.getByRole('heading',{name:'Taunt',exact:true}).isVisible());await page.screenshot({path:PREVIEW+'/mobile-active-effects.png',fullPage:true});await page.getByRole('button',{name:'Close dialog'}).click();
 // Migration keeps progress and a v1 backup, restarting only the active encounter.
 const legacy=createBattle(roster,STARTER_TEAM,'ashen-gate',999);legacy.version=1;legacy.moves=12;legacy.heroes.forEach(h=>{h.mana=100;h.manaMax=100;h.hp=12;});
 await page.evaluate(s=>{localStorage.removeItem('legends.runes.battle.v3');localStorage.setItem('legends.runes.battle.v1',JSON.stringify(s));},legacy);await reloadBattle();assert.equal(await page.locator('.move-counter b').textContent(),'0');assert.ok((await page.locator('#notice').textContent()).includes('restarted'));assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('legends.runes.battle.v1')).moves),12);
 const previous=createBattle(roster,STARTER_TEAM,'ashen-gate',556);previous.version=2;previous.moves=6;previous.heroes[0].hp-=125;previous.heroes[0].mana=4.2;previous.heroes[0].effects.taunt={turns:2,source:'enemy-1',appliedMove:0};
 await page.evaluate(s=>{localStorage.removeItem('legends.runes.battle.v3');localStorage.setItem('legends.runes.battle.v2',JSON.stringify(s));},previous);await reloadBattle();
 const updated=await page.evaluate(()=>JSON.parse(localStorage.getItem('legends.runes.battle.v3')));assert.equal(updated.moves,6);assert.equal(updated.heroes[0].hp,previous.heroes[0].hp);assert.equal(updated.heroes[0].mana,4.2);assert.deepEqual(updated.board,previous.board);assert.ok(updated.enemies[1].effects.guard);assert.ok(!updated.heroes[0].effects.taunt);
 const won=createBattle(roster,STARTER_TEAM,'ashen-gate',777);won.enemies.forEach(e=>e.hp=0);won.phase='victory';await page.evaluate(s=>localStorage.setItem('legends.runes.battle.v3',JSON.stringify(s)),won);await page.goto('http://legends.local/#/home');await page.reload();assert.ok(await page.locator('.encounter-card[data-stage="frozen-pass"]').isEnabled());
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(external,[]);
 console.log(JSON.stringify({passed:true,checks:['135 champion roster/search','charging filter and Special previews','2-charge and 3-charge casting/holding','legacy battle migration','v2 health/charge/board preservation','effect codex tabs and status inspection','35 loaded high-density rune artworks','start and help','7x5 board, 5 heroes, 3 enemies','keyboard match and restored focus','drag swap','save/reload','animation speed','mana skill targeting','390px and 320px overflow and tile sizing','victory unlock','no browser errors/missing assets/external API requests'],screenshots:8},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
