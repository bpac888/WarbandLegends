import './menu-atmosphere.js';
import {factionTeamHTML,factionUnitHTML} from './faction-ui.js';
import {refreshEnergy,energyStatus} from './keeper.js';
import {applyAutoAction} from './auto-battle.js';
import {ownedHeroes,battleRoster,heroForId,baseHeroId} from './hero-copies.js';
import {feedingQuote,consumeHeroes,availableDonors,feedingConfirmation} from './feeding.js';
import {guideHTML,guideTopics,effectCard} from './guide-ui.js';
import {AVATARS,claimDaily,claimPath,teamSlot} from './keeper.js';
import {keeperPanel,dailyPage,profileExtras} from './keeper-ui.js';
import {buyWithGems} from './economy.js';
import {gemConfirmation} from './gem-ui.js';
import {awakeningRank,materialPurchase,materialById,materialArt} from './ascension.js';
import {advancementConfirmation,materialConfirmation} from './ascension-ui.js';
import {encounterTactics,chargeComparisonHTML} from './tactics-ui.js';
import {reserveEntry,exchange} from './mode-progression.js';
import {ritualHTML,summonResults} from './summoning-ui.js';
import {getEncounter,entryError} from './encounters.js';
import {heroDevelopment,developedChampion,ascendChampion,awakenChampion} from './development.js';
import {developmentPanel,levelMark,rankTrack} from './development-ui.js';
import {glyph,rarityMark,roleMark,speedMark,statMarks} from './card-ui.js';
import {animateLaneShots,animateSpecial,animateBattleFeedback,battlePressure,clearBattleEffects} from './battle-fx.js';
import {DEFAULT_FILTERS,filterChampions} from './collection.js';
import * as Shell from './shell.js';
import {defaultProfile,summon,claimQuest,canUse,setOpenRoster,victoryRewards,summonBatch} from './progression.js';
import {EFFECTS} from './effects.js';
import {effectIcon} from './icons.js';
import {COLS,ROWS,COLORS,ELEMENTS,STAGES,createBattle,swap,activate,cast,validMoves,skillDescription,effectName,living,readyLevel,manaLevels,manaLabel,chargeText,MANA_SPEEDS} from './engine.js';
import {PROFILE_KEY,BATTLE_KEY,loadProfile,clearBattleSave,save,recordVictory} from './storage.js';
const app=document.querySelector('#app'),modal=document.querySelector('#modal'),modalContent=document.querySelector('#modal-content'),notice=document.querySelector('#notice');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={red:'<path d="M32 8c4 13 16 15 16 29a16 16 0 0 1-32 0c0-9 6-16 12-22-1 10 2 12 5 13 4-7 2-13-1-20Z"/>',green:'<path d="M50 12c1 27-10 40-28 32C5 27 25 12 50 12Z"/><path d="M17 51 42 22M28 39l-2-10m8 4 8 1" fill="none" stroke="var(--rune-dark)" stroke-width="3"/>',blue:'<path d="M32 9v46M12 20l40 24M12 44l40-24M24 14l8 7 8-7M24 50l8-7 8 7M13 29l10-2-1-10M51 35l-10 2 1 10M13 35l10 2-1 10M51 29l-10-2 1-10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',yellow:'<path d="m32 5 7 18 20 9-20 9-7 18-7-18L5 32l20-9Z"/><circle cx="32" cy="32" r="8" fill="var(--rune-dark)"/>',purple:'<path d="M43 9a24 24 0 1 0 11 35A22 22 0 0 1 43 9Z"/><path d="m44 22 3-6 3 6 6 3-6 3-3 6-3-6-6-3Z"/>'};
const rune=(color,extra='')=>`<svg viewBox="0 0 64 64" class="rune-icon ${extra}" aria-hidden="true">${icons[color]}</svg>`;
const faction=id=>id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()).replace('Dragondynasty','Dragon Dynasty').replace('Duneriders','Dune Riders');
const role=id=>({attack:'ATK',defense:'DEF',support:'SUP'}[id]||id);
const percent=(a,b)=>Math.max(0,Math.min(100,a/b*100));
let displayedBattle=null;
let battleSpeed=1;
let autoEnabled=false,autoWorker=null,autoTimer=null,autoJob=0,autoThinking=false,manualBattleSpeed=1;
function pauseAuto(){autoJob++;clearTimeout(autoTimer);autoTimer=null;autoWorker?.terminate();autoWorker=null;autoThinking=false;}
function stopAuto(){pauseAuto();selectedRune=null;pendingCaster=null;if(autoEnabled)battleSpeed=manualBattleSpeed;autoEnabled=false;}
function scheduleAuto(){
 if(!autoEnabled||busy||screen!=='battle'||battle?.phase!=='playing'||modal.open||document.hidden||autoTimer||autoThinking)return;
 autoTimer=setTimeout(()=>{autoTimer=null;if(!autoEnabled||busy||modal.open||document.hidden||screen!=='battle'||battle?.phase!=='playing')return;
  autoThinking=true;const id=++autoJob;
  try{
   autoWorker??=new Worker(new URL('./auto-worker.js',import.meta.url),{type:'module'});
   autoWorker.onerror=()=>{stopAuto();if(screen==='battle')renderBattle();toast('Auto paused. You can continue manually.');};
   autoWorker.onmessage=({data})=>{
    if(data.id!==autoJob||!autoEnabled||busy||modal.open||screen!=='battle'||battle?.phase!=='playing')return;
    if(data.error||!data.action){stopAuto();renderBattle();return;}
    const action=data.action;
    selectedRune=action.kind==='swap'?action.a:action.kind==='activate'?action.index:null;
    if(action.kind==='cast'&&action.target.startsWith('enemy'))selectedEnemy=action.target;
    renderBattle();
    if(action.kind==='swap')for(const n of [action.a,action.b])app.querySelector(`[data-index="${n}"]`)?.classList.add('auto-choice');
    else if(action.kind==='cast')for(const uid of [action.actor,action.target])app.querySelector(`[data-unit="${uid}"]`)?.classList.add('auto-choice');
    autoTimer=setTimeout(()=>{autoTimer=null;if(data.id!==autoJob||!autoEnabled||busy||modal.open||screen!=='battle'||battle?.phase!=='playing')return;autoThinking=false;const result=applyAutoAction(battle,action,{frames:true});if(result.error){stopAuto();renderBattle();return;}play(result);},260);
   };
   autoWorker.postMessage({id,state:battle});
  }catch{stopAuto();renderBattle();toast('Auto paused. You can continue manually.');}
 },160);
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAuto();else scheduleAuto();});
modal.addEventListener('close',scheduleAuto);
let campaignDifficulty='normal',dungeonDifficulty='normal',selectedEvent=null;
let roster=[],effects={},byId=new Map(),profile,battle=null,screen='splash',busy=false,selectedRune=null,pendingCaster=null,pendingLevel=1,selectedEnemy=null,animationToken=0,noticeTimer,storage,storageWarned=false;
try{storage=window.localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw Error('unavailable');}};}
const persist=(key,value)=>{if(key===PROFILE_KEY&&roster.length)byId=new Map(battleRoster(profile,roster).map(c=>[c.id,c]));if(!save(storage,key,value)&&!storageWarned){storageWarned=true;toast('Browser storage is unavailable. You can play, but this session cannot be saved.');}};
function toast(text){notice.textContent=text;notice.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('show'),4400);}
function brand(){return `<a class="brand" href="./" data-action="home" aria-label="Warband Legends home"><span class="brand-sigil"><img src="./assets/brand/warband-crest.webp" alt=""></span><span class="brand-name"><img class="title-wordmark" src="./assets/brand/warband-wordmark.png" alt="Warband Legends" width="2000" height="429"></span></a>`;}
function battleControls(){return `<footer class="topbar battle-topbar battle-dock" aria-label="Battle controls"><button class="icon-button battle-exit" data-action="battle-exit" aria-label="Abandon battle and return home" title="Exit battle">←</button><div class="topbar-right"><button class="icon-button" data-action="speed" aria-label="Animation speed ${battleSpeed} times" ${autoEnabled?'disabled title="Auto uses ×2 speed"':''}>${battleSpeed}×</button><button class="auto-battle-toggle ${autoEnabled?'active':''}" data-action="auto-battle" aria-label="Auto battle" aria-pressed="${autoEnabled}" ${battle?.phase!=='playing'?'disabled':''}>Auto ${autoEnabled?'On':'Off'}</button></div></footer>`;}
function header(page='home',guidePage=page){return `<header class="topbar with-nav">${brand()}${Shell.navigation(page)}<div class="topbar-right">${Shell.wallet(profile)}<button class="icon-button inventory-button" data-action="nav" data-page="inventory" aria-label="Bag" title="Bag"><img class="bag-nav-art" src="./assets/items/leather-backpack.webp" alt="" width="32" height="32"></button><button class="icon-button" data-action="nav" data-page="settings" aria-label="Settings">${Shell.uiIcon('settings')}</button><button class="icon-button header-guide" data-action="help" data-topic="${guideTopics[guidePage]||'overview'}" aria-label="Guide" title="Guide"><img class="guide-nav-art" src="./assets/items/guide-question.webp" alt="" width="30" height="30"></button></div></header>`;}
function elementLegend(){return `<div class="element-guide"><span class="element red">${rune('red')} Ember</span><b>›</b><span class="element green">${rune('green')} Verdant</span><b>›</b><span class="element blue">${rune('blue')} Frost</span><b>›</b><span class="element red small">${rune('red')}</span><span class="guide-divider"></span><span class="element yellow">${rune('yellow')}</span><b>⇄</b><span class="element purple">${rune('purple')}</span></div>`;}
function renderHome(){
  clearBattleEffects();screen='home';busy=false;pendingCaster=null;selectedRune=null;animationToken++;
  app.innerHTML=`${header()}<main class="home-shell">
  ${keeperPanel(profile)}${Shell.tavernDestinations()}
  </main>`;
}
function warbandPanel(){return `<section class="warband-section"><div class="section-heading"><div><h2>Warband</h2></div><div class="warband-actions"><button class="text-button" data-action="roster">Change Champions ${Shell.uiIcon('arrow')}</button></div></div><div class="warband-grid library-grid">${profile.team.map(id=>Shell.championCard(developedChampion(byId.get(id),profile),profile,{ownedTab:true})).join('')}</div><div class="team-footnote">${teamComposition(profile.team)}</div>${factionTeamHTML(profile.team.map(id=>byId.get(id)))}</section>`;}
function teamComposition(ids){const counts=Object.fromEntries(COLORS.map(c=>[c,0]));ids.forEach(id=>counts[byId.get(id).color]++);return `<span class="composition">${COLORS.map(c=>`<span class="color-pip ${c}" title="${ELEMENTS[c].name}: ${counts[c]} champions">${counts[c]}</span>`).join('')}<b>${Object.values(counts).every(n=>n===1)?'Rainbow warband':Object.values(counts).filter(Boolean).sort((a,b)=>b-a).join(' / ')+' formation'}</b></span>`;}
function statusIcons(unit){return Object.entries(unit.effects).map(([id,e])=>`<button class="status ${EFFECTS[id]?.cat==='debuff'?'negative':'positive'} ${id.startsWith('vulnerable_')?id.replace('vulnerable_',''):''}" data-action="status" data-uid="${unit.uid}" aria-label="${esc(effectName(id))} on ${esc(unit.name)}, ${e.turns} board move${e.turns===1?'':'s'} remaining" title="${esc(effectName(id))} · ${e.turns} moves">${effectIcon(id)}<small>${e.turns}</small></button>`).join('');}
function showStatuses(uid){const unit=[...(displayedBattle||battle).heroes,...(displayedBattle||battle).enemies].find(u=>u.uid===uid);if(!unit)return;openModal(esc(unit.name)+' · Active effects',`<p>Timers count completed board moves for both sides. Tap any badge during battle to inspect its effect.</p><div class="effect-codex">${Object.entries(unit.effects).map(([id,e])=>effectCard(id,`${e.turns} board move${e.turns===1?'':'s'} remaining`)).join('')||'<p>No active timed effects.</p>'}</div>`,'statuses');}
function renderBattle(state=battle,frame={}){
  if(screen!=='battle')return;
  const focusedIndex=document.activeElement?.dataset.index,previous=displayedBattle;displayedBattle=state;
  const stage=getEncounter(state.stageId),actor=state.heroes.find(h=>h.uid===pendingCaster),castingSpec=actor&&manaLevels(actor).find(l=>l.level===pendingLevel),cleared=new Set(frame.cleared||[]);
  const pressure=battlePressure(state);
  app.innerHTML=`<main class="battle-shell ${autoEnabled?'auto-running':''}"><div class="battle-pressure-vignette ${pressure.critical?'pressure-critical':''}" style="--battle-pressure:${pressure.intensity}" aria-hidden="true"></div><section class="battle-center encounter-battle" data-mode="${stage.mode}" data-difficulty="${stage.difficulty}" style="--encounter-art:url('${new URL(stage.art,document.baseURI).href}')" data-scene="${stage.id}" aria-label="Puzzle battle"><div class="battle-sky"><div class="battle-sky-shade"></div><div class="enemy-line" data-scenario-phase="${state.scenario?.triggered?'triggered':state.scenario?'waiting':'none'}">${state.enemies.map((u,i)=>`<article class="enemy-unit ${u.color} ${u.hp<=0?'fallen':''} ${frame.actor===u.uid?'attacking':''} ${i===1&&state.scenario?.triggered&&u.hp>0?'guardian-phase-active '+(state.scenario.id==='iron-overpressure'?'overpressure-active':'last-light-active'):''} ${selectedEnemy===u.uid?'targeted':''}" style="grid-column:${stage.mode==='arena'?'auto':`${u.lanes[0]+1} / span ${u.lanes.length}`}" data-unit="${u.uid}"><button class="enemy-target" data-action="enemy" data-uid="${u.uid}" aria-label="Target ${esc(u.name)}, ${u.hp} health, attacks in ${u.countdown} move${u.countdown===1?'':'s'}" ${u.hp<=0?'disabled':''}><span class="enemy-countdown">⚔ <b>${u.countdown}</b></span><img src="${u.portrait}" alt="${esc(u.name)}" width="480" height="640"><span class="enemy-ground"></span><span class="enemy-name">${esc(u.name)}</span><span class="enemy-hp hp-bar"><i style="width:${percent(u.hp,u.maxHp)}%"></i><span class="enemy-hp-label">${Math.ceil(u.hp)} / ${u.maxHp}${u.shield?' + '+u.shield+' ◈':''}</span></span><span class="enemy-mana" aria-label="Special charge ${chargeText(u.mana)} of ${u.manaMax}"><i style="width:${percent(u.mana,u.manaMax)}%"></i></span><span class="enemy-element">${rune(u.color)}</span></button><button class="enemy-info" data-action="inspect-unit" data-uid="${u.uid}" aria-label="Enemy ability details for ${esc(u.name)}">i</button><div class="statuses">${statusIcons(u)}</div></article>`).join('')}</div><div class="attack-lanes" aria-label="Seven attack lanes">${Array.from({length:7},(_,column)=>{const target=state.enemies.find(e=>e.hp>0&&e.lanes.includes(column));return `<span class="lane-track ${target?'':'lane-empty'} ${frame.shots?.some(s=>s.index%7===column)?'lane-active':''}" data-lane="${column}" data-lane-target="${target?.uid||''}" role="img" aria-label="Lane ${column+1}: ${target?esc(target.name):'empty, double mana'}" title="${target?esc(target.name):'Empty lane · double mana'}"><i></i><b>${target?'⌃':'◇'}</b></span>`;}).join('')}</div></div>
  <div class="board-surround"><div class="board ${busy?'resolving':''}" role="grid" aria-label="Seven column, five row runeboard" aria-rowcount="5" aria-colcount="7" data-testid="board">${state.board.map((t,i)=>`<button class="tile ${t.color} ${t.special?'special '+t.special:''} ${selectedRune===i?'selected':''} ${cleared.has(i)?'matched':''} ${frame.kind==='fall'?'falling':''}" role="gridcell" aria-rowindex="${Math.floor(i/7)+1}" aria-colindex="${i%7+1}" data-action="tile" data-index="${i}" data-tile-id="${t.id}" aria-selected="${selectedRune===i}" aria-label="${ELEMENTS[t.color].name}${t.special?' '+(t.special==='prism'?'Prismatic Rune':'Blast Rune'):' rune'}, row ${Math.floor(i/7)+1}, column ${i%7+1}" ${busy?'disabled':''} style="--tile-order:${Math.floor(i/7)}"><img class="rune-art" src="./assets/runes/${t.color}${t.special?'-'+t.special:''}.svg" alt="" width="256" height="256" draggable="false"></button>`).join('')}</div></div>
  <div class="battle-feedback" role="status" aria-live="polite">${!autoEnabled&&actor?`Choose ${castingSpec.target==='ally'?'an ally':'an enemy'} <button data-action="cancel-cast">Cancel</button>`:''}</div>
  <div class="hero-line">${state.heroes.map(u=>`<article class="hero-unit ${u.color} ${u.hp<=0?'fallen':''} ${readyLevel(u)?'charged':''} ${pendingCaster===u.uid?'casting':''} ${frame.actor===u.uid?'attacking':''}" data-unit="${u.uid}"><button class="hero-main" data-action="hero" data-uid="${u.uid}" aria-label="${esc(u.name)}, ${u.hp} health, ${chargeText(u.mana)} of ${u.manaMax} tile charge, ${manaLabel(u)}${readyLevel(u)?', Special ready'+(u.special.charging?', charge '+readyLevel(u):''):''}" ${u.hp<=0?'disabled':''}><img src="${u.portrait}" alt="${esc(u.name)}" width="480" height="640"><div class="hero-shade"></div>${rankTrack(u,profile)}${readyLevel(u)?`<span class="special-state">${glyph('speed')}${u.special.charging?'READY · '+readyLevel(u):'READY'}</span>`:''}<span class="hero-name">${esc(u.name)}</span><span class="hp-bar"><i style="width:${percent(u.hp,u.maxHp)}%"></i><span class="hero-health">${Math.ceil(u.hp)}${u.shield?' + '+u.shield+' ◈':''}</span></span>${manaBar(u)}<span class="hero-mana-speed">${speedMark(u)}</span><span class="hero-element">${rune(u.color)}</span></button><button class="hero-info" data-action="inspect-unit" data-uid="${u.uid}" aria-label="Ability details for ${esc(u.name)}">i</button><div class="statuses">${statusIcons(u)}</div></article>`).join('')}</div>
  </section>
</main>${battleControls()}`;
  if(focusedIndex!==undefined&&!busy)app.querySelector(`[data-index="${focusedIndex}"]`)?.focus({preventScroll:true});
  if(frame.kind&&previous)animateNumbers(previous,state);
  paintLanePreview(selectedRune);
  scheduleAuto();
  if(frame.kind==='match')animateLaneShots(frame,state,app,{speed:battleSpeed,reduced:reducedAnimation()});
  if(['enemy','skill','mechanic','passive'].includes(frame.kind)&&previous)animateSpecial(previous,state,frame,app,{speed:battleSpeed,reduced:reducedAnimation()});
  if(frame.kind&&previous)animateBattleFeedback(previous,state,frame,app,{speed:battleSpeed,reduced:reducedAnimation(),calm:autoEnabled});
  if(modal.open&&modal.dataset.view==='history')renderHistory(state);
}
function reducedAnimation(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
function paintLanePreview(index){app.querySelectorAll('.lane-preview,.lane-target').forEach(n=>n.classList.remove('lane-preview','lane-target'));if(index===null||index===undefined||screen!=='battle')return;const lane=app.querySelector(`[data-lane="${index%7}"]`);lane?.classList.add('lane-preview');if(lane?.dataset.laneTarget)app.querySelector(`[data-unit="${lane.dataset.laneTarget}"]`)?.classList.add('lane-target');}
app.addEventListener('pointerover',event=>{const tile=event.target.closest('[data-index]');if(tile&&!busy)paintLanePreview(Number(tile.dataset.index));});
app.addEventListener('focusin',event=>{const tile=event.target.closest('[data-index]');if(tile&&!busy)paintLanePreview(Number(tile.dataset.index));});
app.addEventListener('pointerout',event=>{if(event.target.closest('.board')&&!event.relatedTarget?.closest?.('.board')&&!busy)paintLanePreview(selectedRune);});
function animateNumbers(previous,current){for(const unit of [...current.heroes,...current.enemies]){
 const before=[...previous.heroes,...previous.enemies].find(u=>u.uid===unit.uid);if(!before||before.hp===unit.hp)continue;const target=app.querySelector(`[data-unit="${unit.uid}"]`)?.getBoundingClientRect();if(!target)continue;
 const label=document.createElement('span'),delta=Math.round(unit.hp-before.hp);label.className=`combat-number ${delta>0?'restored':'wounded'}`;label.style.cssText=`left:${target.x+target.width/2}px;top:${target.y+target.height*.42}px`;label.textContent=(delta>0?'+':'−')+Math.abs(delta);document.querySelector('#effects-layer').append(label);setTimeout(()=>label.remove(),900/battleSpeed);
}}
async function play(result){
  if(result.error){toast(result.error);return;}
  const focusAfter=document.activeElement?.dataset.index;
  battle=result.state;settleVictory();persist(PROFILE_KEY,profile);
  busy=true;pendingCaster=null;selectedRune=null;const token=++animationToken;
  for(const frame of result.frames){if(token!==animationToken)return;renderBattle(frame.state,frame);const ms={swap:160,match:650,fall:260,enemy:750,upkeep:450,skill:1250,mechanic:1250,passive:950,shuffle:600,settled:50,result:400}[frame.kind]||300;await new Promise(resolve=>setTimeout(resolve,(window.matchMedia('(prefers-reduced-motion: reduce)').matches)?50:ms/battleSpeed));}
  if(token!==animationToken)return;busy=false;renderBattle();if(focusAfter!==undefined)app.querySelector(`[data-index="${focusAfter}"]`)?.focus({preventScroll:true});if(battle.phase!=='playing'){stopAuto();renderBattle();showResult();}
}
function start(stageId){
  syncEnergy();
  const error=entryError(profile,stageId);if(error){toast(error);return;}
  const begin=()=>{const seed=crypto.getRandomValues(new Uint32Array(1))[0];battle=createBattle(battleRoster(profile,roster),profile.team,stageId,seed,{progression:true,sandbox:profile.openRoster,awakenings:profile.awakenings,ascensions:profile.ascensions,levels:Object.fromEntries(profile.team.map(id=>[id,heroDevelopment(profile,byId.get(id)).level]))});const reserved=reserveEntry(profile,battle);if(reserved.error){profile=reserved.profile;persist(PROFILE_KEY,profile);closeModal();toast(reserved.error);battle=null;return;}stopAuto();profile=reserved.profile;battle=reserved.battle;battleSpeed=1;persist(PROFILE_KEY,profile);selectedEnemy=battle.enemies[1].uid;go('battle');};

  begin();
}
function openModal(title,body,view='info'){pauseAuto();modal.dataset.view=view;modalContent.innerHTML=`<header class="modal-header"><div><span class="eyebrow">WARBAND LEGENDS</span><h2 id="modal-title">${title}</h2></div>${view==='result'?'':'<button class="icon-button" data-action="close" aria-label="Close dialog">×</button>'}</header><div class="modal-body">${body}</div>`;if(!modal.open)modal.showModal();}
function settleVictory(){if(['victory','defeat'].includes(battle?.phase)&&(['arena','event'].includes(getEncounter(battle.stageId)?.mode)||battle.phase==='victory')&&!battle.sandbox&&!profile.recorded.includes(battle.id)){
 const reward=victoryRewards(profile,battle),before=profile;profile=recordVictory(profile,battle,roster);
 battle.rewardSummary={...reward,growth:reward.xp?battle.heroes.filter(h=>before.collection[h.id]).map(h=>{const c=byId.get(h.id),old=heroDevelopment(before,c),next=heroDevelopment(profile,c);return {id:h.id,name:h.name,portrait:h.portrait,before:old.level,after:next.level,gained:(profile.heroXp[h.id]||0)-(before.heroXp[h.id]||0),cap:next.cap,ratio:next.ratio};}):[]};
}}
function showResult(){const victory=battle.phase==='victory',reward=battle.rewardSummary,isDungeon=getEncounter(battle.stageId)?.mode==='dungeon';openModal(victory?(isDungeon?'The dungeon is conquered.':getEncounter(battle.stageId)?.mode==='arena'?'The Arena is yours.':getEncounter(battle.stageId)?.mode==='event'?'The event is conquered.':'The crossing is yours.'):'The runes will rise again.',`<div class="result-sigil ${victory?'won':''}">${victory?'✦':'◇'}</div><p class="result-copy">${victory?'Victory':'Defeat'} in ${battle.moves} move${battle.moves===1?'':'s'} · ${battle.cascades} cascade${battle.cascades===1?'':'s'}</p>${battle.sandbox?'<p class="sandbox-result">Playtesting · maximum-level heroes. No rewards or campaign progress.</p>':reward?`<div class="result-rewards">${reward.gold?`<span>+${esc(reward.gold)} Gold</span>`:''}${reward.rating?`<span>${reward.rating>0?'+':''}${reward.rating} rating</span>`:''}${reward.arenaTokens?`<span>+${reward.arenaTokens} Arena Tokens</span>`:''}${reward.eventTokens?`<span>+${reward.eventTokens} Event Tokens</span>`:''}${Object.entries(reward.materials||{}).map(([id,n])=>`<span class="material-reward"><img src="${materialArt(id)}" alt="">+${n} ${materialById(id).name}</span>`).join('')}${reward.accountXp?`<span>+${reward.accountXp} profile XP</span>`:''}${reward.gems?`<span>+${esc(reward.gems)} Gems</span>`:''}</div>${reward.milestone?'<p class="milestone-reward">Five victories · 50 bonus Gems earned</p>':''}<div class="victory-growth">${(reward.growth||[]).map(g=>`<div class="victory-hero ${g.after>g.before?'leveled-up':''}" aria-label="View ${esc(g.name)}, level ${g.after}"><span class="victory-portrait"><img src="${g.portrait}" alt="">${rankTrack(byId.get(g.id),profile)}</span><span><b>${esc(g.name)}</b><strong>${g.after>g.before?'LEVEL UP · ':''}Lv. ${g.before}${g.after>g.before?' → '+g.after:''}</strong><small>${g.gained?'+'+g.gained+' XP':g.after===g.cap?'Level Cap Reached':'No XP gained'}</small><span class="hero-xp-bar"><i style="width:${g.ratio*100}%"></i></span></span></div>`).join('')}</div>`:''}<p>${victory?'Your rewards have been saved.':'Strengthen your warband and try again.'}</p><div class="modal-actions"><button class="button gold" data-action="home">Return to Tavern</button></div>`,'result');}
function manaBar(unit){return `<span class="mana-bar" aria-hidden="true"><i style="width:${percent(unit.mana,unit.manaMax)}%"></i>${manaLevels(unit).slice(0,-1).map(l=>`<b class="charge-notch ${unit.mana>=l.tiles?'filled':''}" style="left:${percent(l.tiles,unit.manaMax)}%"></b>`).join('')}</span>`;}
function effectList(description){return `<div class="resolution-heading">Resolution Order</div><ol class="special-sequence" aria-label="Special resolution order">${description.steps.map(e=>`<li data-step-kind="${e.kind}"><span class="sequence-icon" aria-hidden="true">${e.id?effectIcon(e.id):glyph(e.kind==='heal'?'health':'attack')}</span><div><b>${esc(e.name)}</b><small>${esc(e.scope)} · ${e.duration?e.duration+' board move'+(e.duration===1?'':'s'):'Instant'}</small><p>${esc(e.description)}</p>${e.periodic?'<em>First tick: start of the next valid board move.</em>':''}</div></li>`).join('')}</ol>`;}

function specialLevelsHTML(unit,canCast=false){return `<div class="special-levels ${unit.special.charging?'multi-charge':''}">${manaLevels(unit).map(l=>{const d=skillDescription(unit,effects,l.level),available=Number.isFinite(unit.mana)&&unit.mana>=l.tiles&&unit.hp>0;return `<section class="special-level ${available?'available':''}" data-charge-level="${l.level}"><header><b>${unit.special.charging?'Charge '+l.level:manaLabel(unit)}</b><span>${l.tiles} tiles</span></header>${chargeComparisonHTML(unit,l.level)}${canCast?`<p class="special-targeting">${esc(d.targeting)}</p>`:''}${effectList(d)}${canCast?`<button class="button ${available?'gold':'outline'}" data-action="choose-charge" data-uid="${unit.uid}" data-level="${l.level}" ${!available?'disabled':''}>${available?'Cast '+(unit.special.charging?'Charge '+l.level:'Special'):'Need '+chargeText(l.tiles-unit.mana)+' more tiles'}</button>`:''}</section>`;}).join('')}</div>`;}
function inspect(unit){if(!unit.uid)unit=developedChampion(unit,profile,{preview:profile.openRoster,sandbox:profile.openRoster});openModal(esc(unit.name),`<div class="champion-detail ${unit.color}"><img src="${unit.portrait}" alt="${esc(unit.name)}"><div><span class="eyebrow">${faction(unit.faction)} · ${unit.rarity} ${role(unit.role)}</span><h3>${esc(unit.special.name)}</h3><p class="detail-element ${unit.color}">${rune(unit.color)} ${ELEMENTS[unit.color].name} · ${unit.color}</p><p class="ability-cost">${manaLabel(unit)} · ${manaLevels(unit).map(l=>l.tiles).join(' / ')} tiles · ${unit.side==='enemy'?'Casts when full at an attack opportunity':'No board move to cast'}</p>${unit.side==='enemy'?`<p class="enemy-charge-detail">${chargeText(unit.mana)} / ${unit.manaMax} tile charge · attacks in ${unit.countdown} board move${unit.countdown===1?'':'s'}</p>`:''}<dl><div><dt>HP</dt><dd>${unit.maxHp||unit.hp}</dd></div><div><dt>ATK</dt><dd>${unit.atk}</dd></div><div><dt>DEF</dt><dd>${unit.def}</dd></div></dl></div></div>${specialLevelsHTML(unit)}${factionUnitHTML(unit)}${unit.passive?`<div class="passive-info"><b>Passive · ${esc(unit.passive.name)}</b><p>${esc(unit.passive.desc)}</p></div>`:''}<details class="champion-story"><summary>${esc(unit.title)}</summary><p>${esc(unit.lore)}</p></details>${inspectingFromRoster?'<button class="text-button" data-action="back-roster">← Back to your warband</button>':''}`,'ability');}
let inspectingFromRoster=false;
function chooseSpecial(hero){
  pendingCaster=null;selectedRune=null;renderBattle();
  if(!readyLevel(hero)){inspectingFromRoster=false;inspect(hero);return;}
  if(hero.special.charging){openModal(esc(hero.special.name),`<p><strong>${esc(hero.name)}</strong> · ${chargeText(hero.mana)} / ${hero.manaMax} tiles.</p>${specialLevelsHTML(hero,true)}`,'charge');return;}
  aimSpecial(hero,1);
}
function aimSpecial(hero,level){const spec=manaLevels(hero).find(l=>l.level===level);if(!spec||hero.mana<spec.tiles)return;closeModal();if(spec.target==='self'){play(cast(battle,hero.uid,hero.uid,level));return;}pendingCaster=hero.uid;pendingLevel=level;selectedRune=null;renderBattle();}
function renderHistory(state=displayedBattle||battle){if(!state)return;openModal('Battle chronicle',`<div class="history-list">${state.log.slice().reverse().map(l=>`<p class="log-${l.tone}"><small>MOVE ${l.move}</small>${esc(l.text)}</p>`).join('')}</div>`,'history');}
let questLimit=0,questState='active',shopTab='supplies';
let rosterFilter='all',rosterQuery='',rosterMana='all',rosterRarity='all',draftTeam=[];
function openRoster(keepDraft=false){if(!keepDraft){draftTeam=[...profile.team];rosterFilter='all';rosterQuery='';rosterMana='all';rosterRarity='all';}inspectingFromRoster=false;openModal('Assemble your warband.',`<p>Choose five hero copies. ${profile.openRoster?'All champions are available for playtesting.':'Only collected champions can join your team.'}</p><div id="draft-team"></div><div class="roster-controls"><input id="champion-search" type="search" placeholder="Search champion or faction…" aria-label="Search champions"><div class="color-filters"><button data-action="filter" data-color="all" class="active">All</button>${COLORS.map(c=>`<button class="${c}" data-action="filter" data-color="${c}" aria-label="Filter ${ELEMENTS[c].name}">${rune(c)}</button>`).join('')}</div></div><div class="roster-selects"><label>Mana<select id="mana-filter"><option value="all">All mana speeds</option>${Object.entries(MANA_SPEEDS).map(([id,m])=>`<option value="${id}" ${rosterMana===id?'selected':''}>${m.label}</option>`).join('')}<option value="charging" ${rosterMana==='charging'?'selected':''}>Charging</option></select></label><label>Rarity<select id="rarity-filter"><option value="all">All rarities</option>${['common','rare','legendary','mythical'].map(r=>`<option value="${r}" ${rosterRarity===r?'selected':''}>${r}</option>`).join('')}</select></label></div><div id="roster-grid" class="roster-grid"></div><div class="roster-save"><span id="draft-count"></span><button class="button gold" data-action="save-team" id="save-team">Save warband ↗</button></div>`,'roster');document.querySelector('#champion-search').value=rosterQuery;renderRoster();}
function renderRoster(){
  const list=filterChampions(profile.openRoster?battleRoster(profile,roster):ownedHeroes(profile,roster),profile,{tab:profile.openRoster?'all':'owned',query:rosterQuery,color:rosterFilter,mana:rosterMana,rarity:rosterRarity});
  document.querySelector('#roster-grid').innerHTML=list.map(c=>`<article class="roster-entry ${c.color}"><button class="roster-card ${c.color} ${draftTeam.includes(c.id)?'picked':''}" data-action="pick" data-id="${c.id}" aria-pressed="${draftTeam.includes(c.id)}"><img src="${c.portrait}" alt="" loading="lazy" width="480" height="640"><span class="roster-shade"></span>${rankTrack(c,profile)}${roleMark(c.role)}<span class="roster-color">${rune(c.color)}</span><span class="roster-label">${rarityMark(c.rarity)}<strong>${esc(c.name)}</strong></span>${draftTeam.includes(c.id)?'<span class="pick-number">'+(draftTeam.indexOf(c.id)+1)+'</span>':''}</button><span class="roster-mana">${levelMark(c,profile)} ${manaLabel(c)}</span><button class="roster-details" data-action="roster-details" data-id="${c.id}" aria-label="Special details for ${esc(c.name)}">View Special ↗</button></article>`).join('')||'<p>No champions match this search.</p>';
  document.querySelector('#draft-team').innerHTML=teamComposition(draftTeam)+factionTeamHTML(draftTeam.map(id=>byId.get(id)));document.querySelector('#draft-count').textContent=`${draftTeam.length} / 5 selected · ${list.length} champions shown`;document.querySelector('#save-team').disabled=draftTeam.length!==5;
  modalContent.querySelectorAll('[data-action="filter"]').forEach(b=>b.classList.toggle('active',b.dataset.color===rosterFilter));
}
function tapTile(index){if(busy||screen!=='battle'||pendingCaster)return;if(selectedRune===index){if(battle.board[index].special)play(activate(battle,index));else{selectedRune=null;renderBattle();}return;}if(selectedRune!==null){const a=selectedRune;selectedRune=null;play(swap(battle,a,index));if(!busy)renderBattle();}else{selectedRune=index;renderBattle();}}
function closeModal(){if(modal.open)modal.close();modal.dataset.view='';scheduleAuto();}
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');if(!button||button.disabled)return;const {action,id,uid,stage,color,index}=button.dataset;
  if(button.tagName==='A')event.preventDefault();
  if(['tile','hero','enemy','choose-charge'].includes(action)&&autoEnabled){stopAuto();if(screen==='battle'&&!busy)renderBattle();}
  if(action==='auto-battle'){if(!battle||battle.phase!=='playing')return;if(autoEnabled)stopAuto();else{manualBattleSpeed=battleSpeed;autoEnabled=true;battleSpeed=2;pendingCaster=null;selectedRune=null;}if(!busy)renderBattle();else{button.textContent=autoEnabled?'Auto On':'Auto Off';button.setAttribute('aria-pressed',String(autoEnabled));button.classList.toggle('active',autoEnabled);}return;}
  if(action==='encounter-tactics'){const state=displayedBattle||battle,stage=getEncounter(state.stageId);openModal(esc(stage.name),encounterTactics(stage,state)||`<p>${esc(stage.description)}</p><p>Defeat the enemy warband. Read attack countdowns, elements and lanes.</p>`,'tactics');return;}
  if(action==='dossier-section'){document.getElementById(button.dataset.section)?.scrollIntoView({behavior:reducedAnimation()?'instant':'smooth',block:'start'});return;}
  if(action==='material-preview'){openModal('Acquire material',materialConfirmation(profile,id),'material');return;}
  if(action==='material-confirm'){const r=materialPurchase(profile,id);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderShell('shop');toast(r.item.name+' added to your inventory.');return;}
  if(['ascend-preview','awaken-preview'].includes(action)){const c=byId.get(id);if(!c)return;const kind=action.split('-')[0];openModal(kind==='ascend'?'Ascend your champion':'Awaken your champion',advancementConfirmation(c,profile,kind),'advancement');return;}
  if(['ascend-confirm','awaken-confirm'].includes(action)){const c=byId.get(id);if(!c)return;const r=(action==='ascend-confirm'?ascendChampion:awakenChampion)(profile,c,Number(button.dataset.tier));if(r.error){closeModal();renderChampionPage(id);toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderChampionPage(id);document.querySelector(action==='ascend-confirm'?'#hero-ascension':'#hero-awakening')?.scrollIntoView({block:'center',behavior:'instant'});toast(action==='ascend-confirm'?'Ascended! Level '+r.cap+' is now unlocked.':'Limit Break '+r.rank+' reached! Five more levels unlocked.');return;}
  if(action==='open-codex'){collectionFilters.tab='all';go('roster');return;}
  if(action==='event-select'){selectedEvent=button.dataset.event;renderShell('events');return;}
  if(action==='exchange-preview'){openModal('Exchange your spoils',Shell.exchangeConfirmation(profile,id),'exchange');return;}
  if(action==='exchange-confirm'){const r=exchange(profile,id);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderShell('shop');toast('Exchange complete. Your rewards are saved.');return;}
  if(action==='skip-ritual'){finishRitual();return;}
  if(action==='multi-summon'){openPortal(10);return;}
  if(action==='campaign-difficulty'){campaignDifficulty=button.dataset.difficulty;renderShell('campaign');return;}
  if(action==='dungeon-difficulty'){dungeonDifficulty=button.dataset.difficulty;renderShell('dungeons');return;}
  if(action==='preview-encounter'){const e=getEncounter(stage);if(e){const campaign=e.mode==='campaign',dungeon=e.mode==='dungeon',difficulty={normal:'Normal',hard:'Hard',nightmare:'Nightmare'}[e.difficulty],title=campaign?`${difficulty} · Stage ${e.number} · ${esc(e.name)}`:dungeon?`${esc(e.bossName)} · ${difficulty}`:esc(e.name);openModal(title,Shell.encounterPreview(profile,stage),campaign?'campaign-stage':dungeon?'dungeon-stage':'encounter');}return;}
  if(action==='nav'){go(button.dataset.page);return;}
  if(action==='champion'){go('champion/'+encodeURIComponent(id)+(button.dataset.preview==='true'?'/codex':''));return;}
  if(action==='reset-collection'){collectionFilters={...DEFAULT_FILTERS,tab:collectionFilters.tab};renderCollectionPage();return;}
  if(action==='collection-tab'){collectionFilters.tab=button.dataset.tab;renderCollectionPage();return;}
  if(action==='summon'){openPortal();return;}
  if(action==='daily-claim'||action==='path-claim'){const r=(action==='daily-claim'?claimDaily:claimPath)(profile);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);renderShell('daily');toast('Daily rewards saved.');return;}
  if(action==='avatar'){if(!AVATARS.includes(id))return;profile={...profile,avatar:id};persist(PROFILE_KEY,profile);renderShell('settings');return;}
  if(action==='team-save'){const slot=Number(button.dataset.slot);openModal('Save warband '+(slot+1),'<p>Save your current five champions to this slot'+(profile.teamSlots[slot]?' and replace its existing team':'')+'?</p><div class="modal-actions"><button class="button outline" data-action="close">Cancel</button><button class="button gold" data-action="team-confirm" data-slot="'+slot+'">Save warband</button></div>','team-slot');return;}
  if(action==='team-confirm'||action==='team-load'){const r=teamSlot(profile,Number(button.dataset.slot),action==='team-load'?'load':'save');if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();collectionFilters.tab='teams';go('roster');toast(action==='team-load'?'Warband loaded for your next battle.':'Warband saved.');return;}
  if(action==='quest-status'){questState=button.dataset.state;questLimit=0;renderShell('quests');return;}
  if(action==='quest-more'){questLimit=(questLimit||(innerWidth<600?6:12))+(innerWidth<600?6:12);renderShell('quests');return;}
  if(action==='shop-tab'){shopTab=button.dataset.tab;renderShell('shop');return;}
  if(action==='gem-preview'){openModal('Spend Gems',gemConfirmation(profile,id),'gem-shop');return;}
  if(action==='gem-confirm'){const r=buyWithGems(profile,id);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderShell('shop');toast(r.offer.name+' purchased.');return;}
  if(action==='claim-quest'){const result=claimQuest(profile,id,roster);if(result.error)toast(result.error);else{profile=result.profile;persist(PROFILE_KEY,profile);renderShell('quests');toast('Quest rewards added to your inventory.');}return;}
  if(action==='save-name'){const input=document.querySelector('#player-name');const name=input.value.trim().slice(0,24);if(!name){toast('Enter a player name first.');return;}profile.name=name;persist(PROFILE_KEY,profile);renderShell('settings');toast('Player name saved.');return;}
  if(action==='restart-preview'){openModal('Restart your journey?',`<p>This will erase this browser's Warband Legends progress, champions, resources, quests and current battle. You will begin again with the starter team.</p><div class="modal-actions"><button class="button outline" data-action="close">Keep progress</button><button class="button gold" data-action="restart-confirm">Erase progress and restart</button></div>`,'restart');return;}
  if(action==='restart-confirm'&&modal.dataset.view==='restart'){restartJourney();return;}

  if(action==='close'){if(modal.dataset.view==='ritual')finishRitual();else closeModal();return;}
  if(action==='battle-exit'){if(battle?.phase!=='playing'){closeModal();go('home');return;}openModal('Exit battle?','<p>This battle will be abandoned.</p><div class="modal-actions"><button class="button outline" data-action="close">Stay in battle</button><button class="button gold" data-action="home">Exit to Tavern</button></div>','battle-exit');return;}
  if(action==='home'){closeModal();go('home');return;}
  if(action==='guide-effects'){openGuide('effects',button.dataset.kind);return;}
  if(action==='status'){showStatuses(uid);return;}
  if(action==='help'){openGuide(button.dataset.topic||'overview');return;}
  if(action==='open-guide'){openGuide(button.dataset.topic||'overview');return;}
  if(action==='guide-topic'){openGuide(button.dataset.topic);return;}
  if(action==='feed-preview'){const target=byId.get(id);if(!target)return;if(!availableDonors(profile,target,roster,battle).length){toast('Collect a spare Common or Rare hero to train this champion.');return;}openModal('Train with Common & Rare heroes',feedingConfirmation(profile,target,roster,battle),'feeding');return;}
  if(action==='feed-confirm'){const donors=[...modalContent.querySelectorAll('[name="feed-copy"]:checked')].map(n=>n.value);const r=consumeHeroes(profile,byId.get(id),donors,roster,{battle,expectedXp:Number(button.dataset.xp)});if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderChampionPage(id);toast('Training complete · +'+r.gained+' XP · level '+r.before+' → '+r.after+'.');return;}
  if(action==='history'){renderHistory();return;}
  if(action==='speed'){battleSpeed=battleSpeed===1?2:1;button.textContent=`${battleSpeed}×`;button.setAttribute('aria-label',`Animation speed ${battleSpeed} times`);return;}
  if(action==='roster'){openRoster();return;}
  if(action==='inspect-roster'){go('champion/'+encodeURIComponent(id));return;}
  if(action==='roster-details'){inspectingFromRoster=true;inspect(byId.get(id));return;}
  if(action==='back-roster'){openRoster(true);return;}
  if(action==='choose-charge'&&!busy){const hero=battle.heroes.find(h=>h.uid===uid);if(hero)aimSpecial(hero,Number(button.dataset.level));return;}
  if(action==='inspect-unit'){inspectingFromRoster=false;inspect([...(displayedBattle||battle).heroes,...(displayedBattle||battle).enemies].find(u=>u.uid===uid));return;}
  if(action==='filter'){rosterFilter=color;renderRoster();return;}
  if(action==='pick'){if(draftTeam.includes(id))draftTeam=draftTeam.filter(c=>c!==id);else if(!canUse(profile,id))toast('Collect this champion at the portal first.');else if(draftTeam.length<5)draftTeam.push(id);else toast('Your warband has five champions. Remove one to make room.');renderRoster();return;}
  if(action==='save-team'&&draftTeam.length===5&&draftTeam.every(id=>canUse(profile,id))){profile.team=[...draftTeam];persist(PROFILE_KEY,profile);closeModal();go('home');toast('Your new warband is ready. It will enter the next encounter.');return;}
  if(action==='start'){start(stage);return;}
  if(action==='retry'){const stageId=battle.stageId;closeModal();battle=null;start(stageId);return;}
  if(action==='cancel-cast'){pendingCaster=null;renderBattle();return;}
  if(action==='hint'&&!busy){const move=validMoves(battle.board)[0];if(move){renderBattle();for(const i of move)app.querySelector(`[data-index="${i}"]`)?.classList.add('hint');toast('The glowing runes can be swapped.');}return;}
  if(action==='tile'){tapTile(Number(index));return;}
  if(action==='hero'&&!busy){const hero=battle.heroes.find(h=>h.uid===uid);if(!hero||hero.hp<=0)return;const caster=battle.heroes.find(h=>h.uid===pendingCaster),spec=caster&&manaLevels(caster).find(l=>l.level===pendingLevel);if(spec?.target==='ally'){play(cast(battle,pendingCaster,uid,pendingLevel));return;}chooseSpecial(hero);return;}
  if(action==='enemy'&&!busy){if(pendingCaster){const hero=battle.heroes.find(h=>h.uid===pendingCaster),spec=manaLevels(hero).find(l=>l.level===pendingLevel);if(spec.target==='enemy')play(cast(battle,pendingCaster,uid,pendingLevel));else toast('Choose one of your living champions to heal.');}else{selectedEnemy=uid;renderBattle();}return;}

});
document.addEventListener('change',event=>{if(event.target.name==='feed-copy'){const confirm=modalContent.querySelector('[data-action="feed-confirm"]');if(!confirm)return;const ids=[...modalContent.querySelectorAll('[name="feed-copy"]:checked')].map(n=>n.value),q=feedingQuote(profile,byId.get(confirm.dataset.id),ids,roster,{battle});modalContent.querySelector('.feeding-summary').textContent=q.error||`+${q.gained} XP · Level ${q.before.level} → ${q.after.level} · ${q.gold} gold · ${ids.length} consumed`;confirm.disabled=!!q.error;}});
document.addEventListener('change',event=>{if(event.target.id==='mana-filter'){rosterMana=event.target.value;renderRoster();}if(event.target.id==='rarity-filter'){rosterRarity=event.target.value;renderRoster();}});
modal.addEventListener('click',event=>{if(event.target===modal&&modal.dataset.view!=='result')closeModal();});
modal.addEventListener('close',()=>{modal.dataset.view='';});
document.addEventListener('input',event=>{if(event.target.id==='champion-search'){rosterQuery=event.target.value;renderRoster();}});
let drag=null,suppressClickUntil=0;
app.addEventListener('pointerdown',event=>{const tile=event.target.closest('[data-index]');if(tile&&!busy&&!pendingCaster){if(autoEnabled)stopAuto();drag={index:Number(tile.dataset.index),x:event.clientX,y:event.clientY};}});
app.addEventListener('pointerup',event=>{if(!drag)return;const old=drag;drag=null;const distance=Math.hypot(event.clientX-old.x,event.clientY-old.y);if(distance<14)return;const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-index]');if(target){event.preventDefault();suppressClickUntil=Date.now()+400;selectedRune=null;play(swap(battle,old.index,Number(target.dataset.index)));}});
// Suppress the synthetic click after a drag before the delegated click handler runs.
app.addEventListener('click',event=>{if(Date.now()<suppressClickUntil&&event.target.closest('[data-index]')){event.stopPropagation();event.preventDefault();}},true);
app.addEventListener('pointercancel',()=>{drag=null;});
app.addEventListener('keydown',event=>{const tile=event.target.closest('[data-index]');if(!tile)return;const i=Number(tile.dataset.index),delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key];if(delta){event.preventDefault();const n=i+delta;if(n>=0&&n<35&&(!(Math.abs(delta)===1)||Math.floor(i/7)===Math.floor(n/7)))app.querySelector(`[data-index="${n}"]`)?.focus();}});
let collectionFilters={...DEFAULT_FILTERS},summoning=false,summonToken=0,portalReveal=null;
function abandonBattle(){
  stopAuto();
  clearBattleEffects();
  animationToken++;busy=false;battle=null;displayedBattle=null;pendingCaster=null;selectedRune=null;selectedEnemy=null;
  clearBattleSave(storage);
  if(profile?.eventEntry){profile={...profile,eventEntry:null};persist(PROFILE_KEY,profile);}
}
window.addEventListener('pagehide',abandonBattle);
window.addEventListener('pageshow',event=>{if(event.persisted)renderRoute();});
function go(path){const hash='#/'+path;if(location.hash!==hash)history.pushState(null,'',hash);renderRoute();}
function renderRoute(){
  if(!profile)return;
  syncEnergy();
  document.body.classList.toggle('reduce-animation',reducedAnimation());
  const raw=location.hash.replace(/^#\/?/,'')||'splash',parts=raw.split('/'),page=parts[0];
  if(page!=='battle'&&battle)abandonBattle();
  pauseAuto();animationToken++;busy=false;pendingCaster=null;selectedRune=null;closeModal();clearBattleEffects();
  if(page!=='summon'){summonToken++;summoning=false;portalReveal=null;}
  if(page==='splash'){screen='splash';app.innerHTML=Shell.splash();}
  else if(page==='home')renderHome();
  else if(page==='battle'){if(!battle){go('campaign');return;}screen='battle';renderBattle();if(battle.phase!=='playing')showResult();}
  else if(page==='roster')renderCollectionPage();
  else if(page==='champion'){let id;try{id=decodeURIComponent(parts[1]||'');}catch{id='';}renderChampionPage(id,parts[2]==='codex');}
  else if(['world','campaign','summon','quests','inventory','settings','daily',...Object.keys(Shell.MODES)].includes(page))renderShell(page);
  else{go('home');return;}
  window.scrollTo({top:0,behavior:'instant'});
}
function openGuide(topic,effectKind='buff'){openModal('The Guide',guideHTML(topic,byId.get(app.querySelector('.champion-page')?.dataset.championId),effectKind),'page-guide');}
function shellFrame(page,body){const active=['shop','daily'].includes(page)?'home':page==='campaign'||page==='dungeons'||Shell.MODES[page]?'world':page==='champion'?'roster':page;app.innerHTML=`${header(active,page)}<main class="game-page page-${page}">${body}</main>`;}
function renderShell(page,center=true){screen=page;const body=page==='world'?Shell.world():page==='campaign'?Shell.campaign(profile,{difficulty:campaignDifficulty}):page==='dungeons'?Shell.dungeons(profile,{difficulty:dungeonDifficulty}):page==='arena'?Shell.arena(profile,roster):page==='events'?Shell.events(profile,{selected:selectedEvent}):page==='shop'?Shell.exchangePage(profile,{tab:shopTab}):page==='summon'?Shell.portal(profile,roster,{charging:summoning,reveal:portalReveal}):page==='quests'?Shell.quests(profile,{limit:questLimit||(innerWidth<600?6:12),state:questState}):page==='inventory'?Shell.inventory(profile):page==='settings'?Shell.settings(profile)+profileExtras(profile,roster):page==='daily'?dailyPage(profile):Shell.foundation(page);shellFrame(page,body);if(page==='campaign'&&center){const viewport=document.querySelector('.campaign-map-viewport'),node=viewport?.querySelector('[data-current="true"]');if(node){viewport.scrollLeft=node.offsetLeft-viewport.clientWidth/2;viewport.scrollTop=node.offsetTop-viewport.clientHeight/2;}}}
function renderCollectionPage(){screen='roster';shellFrame('roster',warbandPanel()+Shell.collection(profile,roster,collectionFilters));if(collectionFilters.tab!=='teams')renderLibrary();}
function renderLibrary(){const results=Shell.collectionResults(profile,roster,collectionFilters);document.querySelector('#library-grid').innerHTML=results.html;document.querySelector('#library-count').textContent=`${results.count} of ${collectionFilters.tab==='all'?roster.length:Object.keys(profile.collection).length} Champions · ${collectionFilters.tab==='all'?'Codex':'Collection'}`;}
function renderChampionPage(id,preview=false){const expanded=app.querySelector('.champion-page')?.dataset.championId===id?[...app.querySelectorAll('.advancement-menu[open]')].map(n=>n.id):[];const source=byId.get(id);if(!source){go('roster');toast('This champion could not be found.');return;}const unit=developedChampion(source,profile,{preview}),owned=!preview&&!!profile.collection[id];screen='champion';shellFrame('champion',`<button class="text-button" data-action="nav" data-page="roster">← Back to Collection</button><nav class="dossier-sections" aria-label="Champion details">${owned?`<button data-action="dossier-section" data-section="hero-development">${glyph('attack')} Development</button>`:''}<button data-action="dossier-section" data-section="hero-special">${glyph('speed')} Special</button>${unit.passive?`<button data-action="dossier-section" data-section="hero-passive">${glyph('defense')} Passive</button>`:''}</nav><section class="champion-page ${unit.color}" data-champion-id="${esc(id)}"><div class="champion-showcase"><img src="${unit.portrait}" alt="${esc(unit.name)}">${levelMark(source,profile,{preview,showTier:false})}${rankTrack(source,profile,{preview})}</div><div class="champion-biography"><span class="eyebrow">${unit.rarity} · ${faction(unit.faction)} · ${role(unit.role)}</span><h1>${esc(unit.name)}</h1><p class="champion-title">${esc(unit.title)}</p><div class="detail-element ${unit.color}">${rune(unit.color)} ${unit.color} · ${manaLabel(unit)}</div><details class="champion-story"><summary>Read Their Story</summary><p class="champion-lore">${esc(unit.lore)}</p></details><section class="champion-special" id="hero-special"><div class="section-heading"><div><span class="eyebrow">SPECIAL ABILITY · ${manaLabel(unit).toUpperCase()}</span><h2>${esc(unit.special.name)}</h2></div></div>${specialLevelsHTML(unit)}</section></div></section>${developmentPanel(source,preview?{...profile,collection:{}}:profile)}${unit.passive?`<section class="passive-info" id="hero-passive"><span class="eyebrow">PASSIVE ABILITY</span><h2>${esc(unit.passive.name)}</h2><p>${esc(unit.passive.desc)}</p></section>`:''}`);for(const section of expanded){const menu=document.getElementById(section);if(menu)menu.open=true;}}
function randomUnit(){return crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;}
let ritualResult=null;
function finishRitual(){if(!ritualResult||screen!=='summon')return;const result=ritualResult;ritualResult=null;summoning=false;summonToken++;renderShell('summon');openModal(result.count===1?'A soul answers.':result.count+' souls answer.',summonResults(result),'summon-results');}
async function openPortal(count=1){
 if(screen!=='summon'||summoning)return;let result;try{result=summonBatch(profile,roster,randomUnit,count);}catch(error){toast(error.message);return;}if(result.error){toast(result.error);return;}
 profile=result.profile;persist(PROFILE_KEY,profile);summoning=true;portalReveal=null;ritualResult=result;const token=++summonToken;renderShell('summon');openModal('The portal awakens',ritualHTML(result,'activating'),'ritual');
 const reduced=reducedAnimation();await new Promise(resolve=>setTimeout(resolve,reduced?0:1500));if(token!==summonToken||screen!=='summon')return;
 if(reduced){finishRitual();return;}openModal('A soul crosses the threshold',ritualHTML(result,'arriving'),'ritual');await new Promise(resolve=>setTimeout(resolve,2800));if(token!==summonToken||screen!=='summon')return;finishRitual();
}
modal.addEventListener('cancel',event=>{if(modal.dataset.view==='result'){event.preventDefault();return;}if(modal.dataset.view==='ritual'){event.preventDefault();finishRitual();}});
function restartJourney(){const oldProfile=storage.getItem(PROFILE_KEY),oldBattle=storage.getItem(BATTLE_KEY),fresh=defaultProfile();try{storage.setItem(PROFILE_KEY,JSON.stringify(fresh));storage.removeItem(BATTLE_KEY);}catch{try{if(oldProfile===null)storage.removeItem(PROFILE_KEY);else storage.setItem(PROFILE_KEY,oldProfile);if(oldBattle!==null)storage.setItem(BATTLE_KEY,oldBattle);}catch{}toast('Restart failed. Your saved progress is still available.');return;}profile=fresh;battle=null;displayedBattle=null;byId=new Map(battleRoster(profile,roster).map(c=>[c.id,c]));go('splash');toast('A new journey begins.');}
window.addEventListener('hashchange',renderRoute);
document.addEventListener('keydown',event=>{if(screen==='splash'&&event.key==='Enter'&&!event.repeat){event.preventDefault();go('home');}});
document.addEventListener('change',async event=>{
 const id=event.target.id;
 if(['collection-color','collection-rarity','collection-sort'].includes(id)){collectionFilters[id.replace('collection-','')]=event.target.value;renderLibrary();}
 if(id==='open-roster'){const oldTeam=profile.team.join('|');profile=setOpenRoster(profile,event.target.checked);persist(PROFILE_KEY,profile);if(oldTeam!==profile.team.join('|'))toast('Your team now uses collected champions. You can adjust it in the roster.');}

});
async function boot(){try{
  const responses=await Promise.all([fetch('./data/champions.json'),fetch('./data/effects.json')]);if(responses.some(r=>!r.ok))throw Error('Roster files could not be loaded.');[roster,effects]=await Promise.all(responses.map(r=>r.json()));byId=new Map(roster.map(c=>[c.id,c]));profile=loadProfile(storage,roster);byId=new Map(battleRoster(profile,roster).map(c=>[c.id,c]));battle=null;clearBattleSave(storage);if(profile.eventEntry)profile={...profile,eventEntry:null};persist(PROFILE_KEY,profile);renderRoute();
}catch(error){app.innerHTML=`<main class="loading"><h1>The Runes Could Not Awaken.</h1><p>${esc(error.message)}</p><p>Run this game through its local server or static hosting, rather than opening index.html as a file.</p><button class="button gold" onclick="location.reload()">Try again</button></main>`;}}
boot();

function syncEnergy(){
 if(!profile)return;const updated=refreshEnergy(profile);if(updated!==profile){profile=updated;persist(PROFILE_KEY,profile);}
 const e=energyStatus(profile),label=app.querySelector('.energy-amount');if(label){label.textContent=`${e.current}/${e.max}`;label.setAttribute('aria-label',`${e.current} of ${e.max} Energy`);}
}
setInterval(syncEnergy,15000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncEnergy();});
