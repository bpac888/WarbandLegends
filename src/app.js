import {campaignArc} from './campaign-story.js?v=0.46.0';
import {detailMotionHTML,mountDetailMotion,playCinematic,stopCinematic,introOnce,playIntro,CHARACTER_CLIPS,motionAllowed} from './cinematics.js?v=0.46.0';
import {scenarioStatus} from './chapter.js?v=0.46.0';
import {chapterId,chapterKey,isChapterBoss,claimChapter,storyHTML,chapterGiftHTML,journalHTML,openingStoryHTML,aftermathHTML,narrativeKey} from './campaign-journal.js?v=0.46.0';
import {claimWeekly,weeklyWindow} from './weekly.js?v=0.46.0';
import {teamName,teamPower,estimateNote,renameTeam,toggleHeroPreference} from './team-preferences.js?v=0.46.0';
import {swipeTarget} from './board-gestures.js?v=0.46.0';
import {createCombatPractice,practiceBoard,practicePhaseDone,practicePrompt,practiceHints,PRACTICE_PHASES} from './combat-practice.js?v=0.46.0';
import {recordTutorial,tutorialState,tutorialFinished} from './tutorial.js?v=0.46.0';
import {specialSummary} from './special-summary.js?v=0.46.0';
import {nextFirstStep,firstStepsHTML} from './first-steps.js?v=0.46.0';
import {useExperienceTome} from './experience-tomes.js?v=0.46.0';
import {premiumItem,activateBooster} from './premium-items.js?v=0.46.0';
import {premiumItemConfirmation} from './premium-items-ui.js?v=0.46.0';
import {ascensionTier} from './ascension.js?v=0.46.0';
import {battleTiming} from './battle-pacing.js?v=0.46.0';
import {collectionFiltersHTML} from './collection-filter-ui.js?v=0.46.0';
import {lootTicketQuote,useLootTicket} from './loot-tickets.js?v=0.46.0';
import {lootTicketConfirmation,lootTicketResult} from './loot-ticket-ui.js?v=0.46.0';
import {courtyardHTML} from './courtyard-ui.js?v=0.46.0';
import {mountCourtyard} from './courtyard-view.js?v=0.46.0';
import {profileEditorHTML,mountProfileEditor} from './profile-editor.js?v=0.46.0';
import {saveTeam} from './teams.js?v=0.46.0';
import {mountArenaScene} from './arena-scene.js?v=0.46.0';
import './menu-atmosphere.js?v=0.46.0';
import {factionTeamHTML,factionUnitHTML} from './faction-ui.js?v=0.46.0';
import {refreshEnergy,energyStatus} from './keeper.js?v=0.46.0';
import {applyAutoAction} from './auto-battle.js?v=0.46.0';
import {ownedHeroes,battleRoster,heroForId,baseHeroId} from './hero-copies.js?v=0.46.0';
import {feedingQuote,consumeHeroes,availableDonors,feedingConfirmation} from './feeding.js?v=0.46.0';
import {guideHTML,guideTopics,effectCard} from './guide-ui.js?v=0.46.0';
import {claimDaily,claimPath,teamSlot} from './keeper.js?v=0.46.0';
import {dailyPage} from './keeper-ui.js?v=0.46.0';
import {buyWithGems} from './economy.js?v=0.46.0';
import {gemConfirmation} from './gem-ui.js?v=0.46.0';
import {tierLevel,awakeningRank,materialPurchase,materialById,materialArt} from './ascension.js?v=0.46.0';
import {advancementConfirmation,materialConfirmation} from './ascension-ui.js?v=0.46.0';
import {encounterTactics,chargeComparisonHTML} from './tactics-ui.js?v=0.46.0';
import {reserveEntry,exchange} from './mode-progression.js?v=0.46.0';
import {ritualHTML,summonResults,RITUAL_TIMING} from './summoning-ui.js?v=0.46.0';
import {getEncounter,entryError} from './encounters.js?v=0.46.0';
import {heroDevelopment,developedChampion,ascendChampion,awakenChampion} from './development.js?v=0.46.0';
import {developmentPanel,levelMark,rankTrack} from './development-ui.js?v=0.46.0';
import {glyph,rarityMark,roleMark,speedMark,statMarks} from './card-ui.js?v=0.46.0';
import {animateDefeats,animateLaneShots,animateSpecial,animateBattleFeedback,battlePressure,clearBattleEffects,planSpecialEffects,animateMatchGlow,animateRunePower,animateNumbers,animateBoardMotion} from './battle-fx.js?v=0.46.0';
import {DEFAULT_FILTERS,filterChampions,factionLabel} from './collection.js?v=0.46.0';
import * as Shell from './shell.js?v=0.46.0';
import {defaultProfile,summon,claimQuest,canUse,setOpenRoster,victoryRewards,summonBatch} from './progression.js?v=0.46.0';
import {EFFECTS} from './effects.js?v=0.46.0';
import {effectIcon} from './icons.js?v=0.46.0';
import {COLS,ROWS,COLORS,ELEMENTS,STAGES,createBattle,swap,activate,cast,validMoves,skillDescription,effectName,living,readyLevel,manaLevels,manaLabel,chargeText} from './engine.js?v=0.46.0';
import {PROFILE_KEY,BATTLE_KEY,loadProfile,clearBattleSave,save,recordVictory} from './storage.js?v=0.46.0';
const app=document.querySelector('#app'),modal=document.querySelector('#modal'),modalContent=document.querySelector('#modal-content'),notice=document.querySelector('#notice');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={red:'<path d="M32 8c4 13 16 15 16 29a16 16 0 0 1-32 0c0-9 6-16 12-22-1 10 2 12 5 13 4-7 2-13-1-20Z"/>',green:'<path d="M50 12c1 27-10 40-28 32C5 27 25 12 50 12Z"/><path d="M17 51 42 22M28 39l-2-10m8 4 8 1" fill="none" stroke="var(--rune-dark)" stroke-width="3"/>',blue:'<path d="M32 9v46M12 20l40 24M12 44l40-24M24 14l8 7 8-7M24 50l8-7 8 7M13 29l10-2-1-10M51 35l-10 2 1 10M13 35l10 2-1 10M51 29l-10-2 1-10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',yellow:'<path d="m32 5 7 18 20 9-20 9-7 18-7-18L5 32l20-9Z"/><circle cx="32" cy="32" r="8" fill="var(--rune-dark)"/>',purple:'<path d="M43 9a24 24 0 1 0 11 35A22 22 0 0 1 43 9Z"/><path d="m44 22 3-6 3 6 6 3-6 3-3 6-3-6-6-3Z"/>'};
const rune=(color,extra='')=>`<svg viewBox="0 0 64 64" class="rune-icon ${extra}" aria-hidden="true">${icons[color]}</svg>`;
const faction=factionLabel;
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
   autoWorker??=new Worker(new URL('./auto-worker.js?v=0.46.0',import.meta.url),{type:'module'});
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
let campaignDifficulty='normal',dungeonDifficulty='normal',selectedEvent=null,selectedArena=0;
let courtyardView=null;
let roster=[],effects={},byId=new Map(),profile,battle=null,screen='splash',busy=false,selectedRune=null,pendingCaster=null,pendingLevel=1,selectedEnemy=null,animationToken=0,noticeTimer,storage,storageWarned=false;
try{storage=window.localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw Error('unavailable');}};}
const persist=(key,value)=>{if(key===PROFILE_KEY&&roster.length)byId=new Map(battleRoster(profile,roster).map(c=>[c.id,c]));if(!save(storage,key,value)&&!storageWarned){storageWarned=true;toast('Browser storage is unavailable. You can play, but this session cannot be saved.');}};
function toast(text){notice.textContent=text;notice.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('show'),4400);}
function brand(){return `<a class="brand" href="./" data-action="home" aria-label="Warband Legends home"><span class="brand-sigil"><img src="./assets/brand/warband-crest.webp" alt=""></span><span class="brand-name"><img class="title-wordmark" src="./assets/brand/warband-wordmark.png" alt="Warband Legends" width="2000" height="429"></span></a>`;}
let combatPractice=null;
function battleControls(){return `<footer class="topbar battle-topbar battle-dock" aria-label="Battle controls"><button class="icon-button battle-exit" data-action="battle-exit" aria-label="Abandon battle and return home" title="Exit battle">←</button><div class="topbar-right"><button class="icon-button" data-action="speed" aria-label="Animation speed ${battleSpeed} times" ${autoEnabled?'disabled title="Auto uses ×2 speed"':''}>${battleSpeed}×</button><button class="auto-battle-toggle ${autoEnabled?'active':''}" data-action="auto-battle" aria-label="Auto battle" aria-pressed="${autoEnabled}" ${battle?.phase!=='playing'||combatPractice?'disabled':''}>Auto ${autoEnabled?'On':'Off'}</button></div></footer>`;}
function header(page='home',guidePage=page){return `<header class="topbar with-nav">${brand()}${Shell.navigation(page)}<div class="topbar-right">${Shell.wallet(profile,{page:guidePage})}<button class="icon-button inventory-button ${guidePage==='inventory'?'active':''}" ${guidePage==='inventory'?'aria-current="page"':''} data-action="nav" data-page="inventory" aria-label="Bag" title="Bag"><img class="bag-nav-art" src="./assets/items/leather-backpack.webp" alt="" width="32" height="32"></button><button class="icon-button shop-nav ${guidePage==='shop'?'active':''}" ${guidePage==='shop'?'aria-current="page"':''} data-action="nav" data-page="shop" aria-label="Shop" title="Shop"><img class="shop-nav-art" src="./assets/items/shop-stall.webp" alt="" width="34" height="34"></button><button class="icon-button header-guide" data-action="help" data-topic="${guideTopics[guidePage]||'overview'}" aria-label="Guide" title="Guide"><img class="guide-nav-art" src="./assets/items/guide-question.webp" alt="" width="30" height="30"></button></div></header>`;}
function elementLegend(){return `<div class="element-guide"><span class="element red">${rune('red')} Ember</span><b>›</b><span class="element green">${rune('green')} Verdant</span><b>›</b><span class="element blue">${rune('blue')} Frost</span><b>›</b><span class="element red small">${rune('red')}</span><span class="guide-divider"></span><span class="element yellow">${rune('yellow')}</span><b>⇄</b><span class="element purple">${rune('purple')}</span></div>`;}
function renderHome(){
  clearBattleEffects();screen='home';busy=false;pendingCaster=null;selectedRune=null;animationToken++;
  courtyardView?.destroy();
  app.innerHTML=header()+courtyardHTML(profile);
  const guidance=firstStepsHTML(profile,'home');if(guidance)app.querySelector('.courtyard-home').insertAdjacentHTML('afterbegin',guidance);
  courtyardView=mountCourtyard(app.querySelector('.courtyard-scene'),{profile,onNavigate:id=>{if(id==='roster')collectionFilters.tab='all';go(id);},onProfile:()=>openPlayerProfile(),isPaused:()=>modal.open});
}
function warbandPanel(){return `<section class="warband-section"><div class="section-heading"><div><h2>Team ${profile.activeTeamSlot+1} <span class="active-team-mark">Active Warband</span></h2></div><div class="warband-actions"><button class="text-button" data-action="roster">Change Champions ${Shell.uiIcon('arrow')}</button></div></div><div class="warband-grid library-grid">${profile.team.map(id=>Shell.championCard(developedChampion(byId.get(id),profile),profile,{ownedTab:true})).join('')}</div><div class="team-footnote">${teamComposition(profile.team)}</div>${factionTeamHTML(profile.team.map(id=>byId.get(id)))}</section>`;}
function teamComposition(ids){const counts=Object.fromEntries(COLORS.map(c=>[c,0]));ids.forEach(id=>counts[byId.get(id).color]++);return `<span class="composition">${COLORS.map(c=>`<span class="color-pip ${c}" title="${ELEMENTS[c].name}: ${counts[c]} champions">${counts[c]}</span>`).join('')}<b>${Object.values(counts).every(n=>n===1)?'Rainbow warband':Object.values(counts).filter(Boolean).sort((a,b)=>b-a).join(' / ')+' formation'}</b></span>`;}
function statusIcons(unit){if(unit.hp<=0)return '';return Object.keys(unit.effects).map(id=>`<button class="status ${EFFECTS[id]?.cat==='debuff'?'negative':'positive'}" data-action="status" data-effect="${id}" data-uid="${unit.uid}" aria-label="${esc(effectName(id))} on ${esc(unit.name)}" title="${esc(effectName(id))}">${effectIcon(id)}</button>`).join('');}
function activeEffectsHTML(unit){return Object.keys(unit.effects||{}).length?`<section class="battle-active-effects"><h3>Active Effects</h3><div class="effect-codex">${Object.entries(unit.effects).map(([id,e])=>effectCard(id,`${e.turns} board move${e.turns===1?'':'s'} remaining`,false)).join('')}</div></section>`:'';}

function showStatuses(uid){const unit=[...(displayedBattle||battle).heroes,...(displayedBattle||battle).enemies].find(u=>u.uid===uid);if(!unit)return;openModal(esc(unit.name)+' · Active effects',`<div class="effect-codex">${Object.entries(unit.effects).map(([id,e])=>effectCard(id,`${e.turns} board move${e.turns===1?'':'s'} remaining`)).join('')||'<p>No active timed effects.</p>'}</div>`,'statuses');}
function renderBattle(state=battle,frame={}){
  if(screen!=='battle')return;
  const focusedIndex=document.activeElement?.dataset.index,previous=displayedBattle;displayedBattle=state;
  const stage=getEncounter(state.stageId),actor=state.heroes.find(h=>h.uid===pendingCaster),castingSpec=actor&&manaLevels(actor).find(l=>l.level===pendingLevel),cleared=new Set(frame.cleared||[]);
  const pressure=battlePressure(state),timing=battleTiming(frame.kind,{speed:battleSpeed,reduced:reducedAnimation(),special:!!(previous&&planSpecialEffects(previous,state,frame)?.special)});
  document.querySelector('#effects-layer').style.setProperty('--fx-rate',timing.rate);
  if(previous)animateDefeats(previous,state,frame,app,{speed:battleSpeed,reduced:reducedAnimation()});
  app.innerHTML=`<main style="--fx-rate:${timing.rate}" class="battle-shell ${combatPractice?'practice-battle':''} ${autoEnabled?'auto-running':''}"><div class="battle-pressure-vignette ${pressure.critical?'pressure-critical':''}" style="--battle-pressure:${pressure.intensity}" aria-hidden="true"></div><section class="battle-center encounter-battle" data-mode="${stage.mode}" data-difficulty="${stage.difficulty}" style="--encounter-art:url('${new URL(stage.art,document.baseURI).href}')" data-scene="${stage.id}" aria-label="Puzzle battle"><div class="battle-sky"><div class="battle-sky-shade"></div><div class="enemy-line" data-scenario-phase="${state.scenario?.triggered?'triggered':state.scenario?'waiting':'none'}">${state.enemies.map((u,i)=>`<article class="enemy-unit ${u.color} ${u.hp<=0?'fallen':''} ${frame.actor===u.uid?'attacking':''} ${i===1&&state.scenario?.triggered&&u.hp>0?'guardian-phase-active '+(state.scenario.id==='iron-overpressure'?'overpressure-active':'last-light-active'):''} ${selectedEnemy===u.uid?'targeted':''}" style="grid-column:${stage.mode==='arena'?'auto':`${u.lanes[0]+1} / span ${u.lanes.length}`}" data-unit="${u.uid}"><button class="enemy-target" data-action="enemy" data-uid="${u.uid}" aria-label="Target ${esc(u.name)}, ${u.hp} health, attacks in ${u.countdown} move${u.countdown===1?'':'s'}" ${u.hp<=0?'disabled':''}><span class="enemy-countdown">⚔ <b>${combatPractice?'—':u.countdown}</b></span><img src="${u.portrait}" alt="${esc(u.name)}" width="480" height="640"><span class="enemy-ground"></span><span class="enemy-name">${esc(u.name)}</span><span class="enemy-hp hp-bar"><i style="width:${percent(u.hp,u.maxHp)}%"></i><span class="enemy-hp-label">${combatPractice?'Practice target':Math.ceil(u.hp)+' / '+u.maxHp}${u.shield?' + '+u.shield+' ◈':''}</span></span><span class="enemy-mana" aria-label="Special charge ${chargeText(u.mana)} of ${u.manaMax}"><i style="width:${percent(u.mana,u.manaMax)}%"></i></span><span class="enemy-element">${rune(u.color)}</span></button><button class="enemy-info" data-action="inspect-unit" data-uid="${u.uid}" aria-label="Enemy ability details for ${esc(u.name)}">i</button><div class="statuses">${statusIcons(u)}</div></article>`).join('')}</div><div class="attack-lanes" aria-label="Seven attack lanes">${Array.from({length:7},(_,column)=>{const target=state.enemies.find(e=>e.hp>0&&e.lanes.includes(column));return `<span class="lane-track ${target?'':'lane-empty'} ${frame.shots?.some(s=>s.index%7===column)?'lane-active':''}" data-lane="${column}" data-lane-target="${target?.uid||''}" role="img" aria-label="Lane ${column+1}: ${target?esc(target.name):'empty, double mana'}" title="${target?esc(target.name):'Empty lane · double mana'}"><i></i><b>${target?'⌃':'◇'}</b></span>`;}).join('')}</div></div>
  <div class="board-surround"><div class="board ${busy?'resolving':''}" role="grid" aria-label="Seven column, five row runeboard" aria-rowcount="5" aria-colcount="7" data-testid="board">${state.board.map((t,i)=>`<button class="tile ${t.color} ${t.special?'special '+t.special:''} ${selectedRune===i?'selected':''} ${combatPractice&&practiceHints(PRACTICE_PHASES[combatPractice.phase],state).includes(i)?'practice-hint':''} ${cleared.has(i)?'matched':''} ${frame.kind==='fall'?'falling':''}" role="gridcell" aria-rowindex="${Math.floor(i/7)+1}" aria-colindex="${i%7+1}" data-action="tile" data-index="${i}" data-tile-id="${t.id}" aria-selected="${selectedRune===i}" aria-label="${ELEMENTS[t.color].name}${t.special?' '+(t.special==='prism'?'Prismatic Rune':'Blast Rune'):' rune'}, row ${Math.floor(i/7)+1}, column ${i%7+1}" ${busy?'disabled':''} style="--tile-order:${Math.floor(i/7)}"><img class="rune-art" src="./assets/runes/${t.color}${t.special?'-'+t.special:''}.svg" alt="" width="256" height="256" draggable="false"></button>`).join('')}</div></div>
  ${scenarioStatus(state)?`<div class="battle-mechanic-notice" role="status"><b>${esc(scenarioStatus(state).name)}</b> ${esc(scenarioStatus(state).text)}</div>`:''}<div class="battle-feedback" role="status" aria-live="polite">${!autoEnabled&&actor?`Choose ${castingSpec.target==='ally'?'an ally':'an enemy'} <button data-action="cancel-cast">Cancel</button>`:combatPractice?combatPractice.phase===PRACTICE_PHASES.length?`Practice complete <button data-action="practice-reward">Collect Quest Reward</button>`:esc(practicePrompt(PRACTICE_PHASES[combatPractice.phase],state.heroes.find(h=>h.uid===combatPractice.actor)?.name||'the ready champion')):''}</div>
  <div class="hero-line">${state.heroes.map(u=>`<article class="hero-unit ${u.color} ${u.hp<=0?'fallen':''} ${readyLevel(u)?'charged':''} ${pendingCaster===u.uid?'casting':''} ${frame.actor===u.uid?'attacking':''}" data-unit="${u.uid}"><button class="hero-main" data-action="hero" data-uid="${u.uid}" aria-label="${esc(u.name)}, ${u.hp} health, ${chargeText(u.mana)} of ${u.manaMax} tile charge, ${manaLabel(u)}${readyLevel(u)?', Special ready'+(u.special.charging?', charge '+readyLevel(u):''):''}" ${u.hp<=0?'disabled':''}><img src="${u.portrait}" alt="${esc(u.name)}" width="480" height="640"><div class="hero-shade"></div>${rankTrack(u,profile)}${readyLevel(u)?`<span class="special-state">${glyph('speed')}${u.special.charging?'READY · '+readyLevel(u):'READY'}</span>`:''}<span class="hero-name">${esc(u.name)}</span><span class="hp-bar"><i style="width:${percent(u.hp,u.maxHp)}%"></i><span class="hero-health">${Math.ceil(u.hp)}${u.shield?' + '+u.shield+' ◈':''}</span></span>${manaBar(u)}<span class="hero-mana-speed">${speedMark(u)}</span><span class="hero-element">${rune(u.color)}</span></button><button class="hero-info" data-action="inspect-unit" data-uid="${u.uid}" aria-label="Ability details for ${esc(u.name)}">i</button><div class="statuses">${statusIcons(u)}</div></article>`).join('')}</div>
  </section>
</main>${battleControls()}`;
  if(focusedIndex!==undefined&&!busy)app.querySelector(`[data-index="${focusedIndex}"]`)?.focus({preventScroll:true});
  if(frame.kind&&previous)animateNumbers(previous,state,frame,app,{speed:battleSpeed,reduced:reducedAnimation()});
  paintLanePreview(selectedRune);
  scheduleAuto();
  if(previous&&['swap','fall'].includes(frame.kind))animateBoardMotion(previous,state,frame,app,{speed:battleSpeed,reduced:reducedAnimation()});
  if(frame.kind==='match'){animateMatchGlow(frame,state,app,{speed:battleSpeed,reduced:reducedAnimation()});animateRunePower(frame,state,app,{speed:battleSpeed,reduced:reducedAnimation()});}
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
async function play(result){
  if(result.error){toast(result.error);return;}
  const previousBattle=battle;
  if(combatPractice&&combatPractice.phase<PRACTICE_PHASES.length&&!practicePhaseDone(result,PRACTICE_PHASES[combatPractice.phase],previousBattle)){toast(practicePrompt(PRACTICE_PHASES[combatPractice.phase],battle.heroes.find(h=>h.uid===combatPractice.actor)?.name||'the ready champion'));return;}
  const focusAfter=document.activeElement?.dataset.index;
  battle=result.state;settleVictory();persist(PROFILE_KEY,profile);
  busy=true;pendingCaster=null;selectedRune=null;const token=++animationToken;
  const cinematicActor=result.frames.find(f=>f.kind==='skill')?.actor,cinematicHero=previousBattle?.heroes.find(h=>h.uid===cinematicActor);if(!combatPractice&&cinematicHero&&(cinematicHero.baseId||cinematicHero.id.split('~')[0])==='qingluo_jade_tempest'){await playCinematic('jade-dragon',{profile,reduced:reducedAnimation(),label:'Qingluo · Jade Tempest',duration:battleSpeed===2?900:1500});if(token!==animationToken)return;}
  for(const frame of result.frames){if(token!==animationToken)return;const timing=battleTiming(frame.kind,{speed:battleSpeed,reduced:reducedAnimation(),special:!!(displayedBattle&&planSpecialEffects(displayedBattle,frame.state,frame)?.special)});renderBattle(frame.state,frame);await new Promise(resolve=>setTimeout(resolve,timing.duration));}
  if(token!==animationToken)return;busy=false;renderBattle();if(focusAfter!==undefined)app.querySelector(`[data-index="${focusAfter}"]`)?.focus({preventScroll:true});if(combatPractice&&combatPractice.phase<PRACTICE_PHASES.length&&practicePhaseDone(result,PRACTICE_PHASES[combatPractice.phase],previousBattle)){combatPractice.phase++;if(combatPractice.phase===PRACTICE_PHASES.length){for(const event of ['special','match4','match5'])profile=recordTutorial(profile,event);persist(PROFILE_KEY,profile);combatPractice={phase:PRACTICE_PHASES.length,actor:combatPractice.actor};renderBattle();openModal('Practice complete!',`<p>You made a normal match, cast a Special, and created and activated both a Blast Rune and a Prismatic Rune. Blast Runes clear nearby tiles; Prismatic Runes clear one color. Your first quest reward is ready.</p><div class="modal-actions"><button class="button gold" data-action="practice-reward">Collect Practice Reward</button></div>`,'practice-complete');return;}const nextPhase=PRACTICE_PHASES[combatPractice.phase];if(nextPhase==='special'){const hero=battle.heroes.find(h=>h.uid===combatPractice.actor);hero.mana=hero.manaMax;}else if(nextPhase==='match4'||nextPhase==='match5')battle=practiceBoard(battle,nextPhase==='match4'?4:5);renderBattle();}else if(battle.phase!=='playing'){stopAuto();renderBattle();showResult();}
}
function startCombatPractice(){stopAuto();const lesson=createCombatPractice(battleRoster(profile,roster),profile.team);battle=lesson.state;combatPractice={phase:0,actor:lesson.actor};battleSpeed=1;selectedEnemy=battle.enemies[1].uid;go('battle');}
function previewEncounter(stageId,{story=true}={}){
 const e=getEncounter(stageId);if(!e)return;
 const campaign=e.mode==='campaign',dungeon=e.mode==='dungeon',arc=campaign?campaignArc(e.difficulty):null;
 if(story&&campaign&&(e.number===1||isChapterBoss(e))){openModal(`Act ${arc.act} · ${arc.title}`,e.number===1?openingStoryHTML(e.id,{difficulty:e.difficulty}):storyHTML(chapterId(e),{stageId:e.id,difficulty:e.difficulty}),'chapter-story');return;}
 const difficulty={normal:'Normal',hard:'Hard',nightmare:'Nightmare'}[e.difficulty],title=campaign?`${difficulty} · Stage ${e.number} · ${esc(e.name)}`:dungeon?`${esc(e.bossName)} · ${difficulty}`:esc(e.name);
 openModal(title,`<div class="battle-team-preview"><div class="entry-team-heading"><strong>${esc(teamName(profile,profile.activeTeamSlot))}</strong><span title="${estimateNote}" aria-label="Estimated team power ${teamPower(profile,profile.team,roster).toLocaleString()}">Power ${teamPower(profile,profile.team,roster).toLocaleString()}</span></div>${factionTeamHTML(profile.team.map(id=>byId.get(id)))}</div>`+Shell.encounterPreview(profile,e.id),campaign?'campaign-stage':dungeon?'dungeon-stage':e.mode==='arena'?'arena-stage':e.mode==='event'?'event-stage':'encounter');
}
function start(stageId){
  syncEnergy();
  const error=entryError(profile,stageId);if(error){toast(error);return;}

  const begin=()=>{const seed=crypto.getRandomValues(new Uint32Array(1))[0];battle=createBattle(battleRoster(profile,roster),profile.team,stageId,seed,{progression:true,sandbox:profile.openRoster,awakenings:profile.awakenings,ascensions:profile.ascensions,levels:Object.fromEntries(profile.team.map(id=>[id,heroDevelopment(profile,byId.get(id)).level]))});const reserved=reserveEntry(profile,battle);if(reserved.error){profile=reserved.profile;persist(PROFILE_KEY,profile);closeModal();toast(reserved.error);battle=null;return;}stopAuto();profile=reserved.profile;battle=reserved.battle;battleSpeed=1;persist(PROFILE_KEY,profile);selectedEnemy=battle.enemies[1].uid;go('battle');};

  begin();
}
function openModal(title,body,view='info'){pauseAuto();modal.dataset.view=view;modalContent.innerHTML=`<header class="modal-header"><div>${['roster','page-guide','event-stage','chapter-story','chapter-journal','team-name','campaign-stage','dungeon-stage','arena-stage','encounter'].includes(view)?'':'<span class="eyebrow">WARBAND LEGENDS</span>'}<h2 id="modal-title">${title}</h2></div>${view==='result'?'':'<button class="icon-button" data-action="close" aria-label="Close dialog">×</button>'}</header><div class="modal-body">${body}</div>`;if(!modal.open)modal.showModal();if(view==='chapter-story'){modal.scrollTop=0;modalContent.querySelector('.modal-body').scrollTop=0;mountDetailMotion(modalContent,profile,reducedAnimation());}if(view==='chapter-journal')modal.scrollTop=0;if(view==='roster'){const title=modalContent.querySelector('#modal-title');title.tabIndex=-1;title.focus({preventScroll:true});}if(view==='result'){modal.scrollTop=0;modalContent.querySelector('[data-action="home"]')?.focus({preventScroll:true});}if(view==='ritual')modalContent.querySelector('[data-action="skip-ritual"]')?.focus({preventScroll:true});}
function settleVictory(){if(['victory','defeat'].includes(battle?.phase)&&(['arena','event'].includes(getEncounter(battle.stageId)?.mode)||battle.phase==='victory')&&!battle.sandbox&&!profile.recorded.includes(battle.id)){
 const rewardAt=Date.now(),reward=victoryRewards(profile,battle,rewardAt),before=profile;profile=recordVictory(profile,battle,roster,rewardAt);
 battle.rewardSummary={...reward,growth:reward.xp?battle.heroes.filter(h=>before.collection[h.id]).map(h=>{const c=byId.get(h.id),old=heroDevelopment(before,c),next=heroDevelopment(profile,c);return {id:h.id,name:h.name,portrait:h.portrait,before:tierLevel(before,c,old.level).level,after:tierLevel(profile,c,next.level).level,gained:(profile.heroXp[h.id]||0)-(before.heroXp[h.id]||0),cap:tierLevel(profile,c,next.cap).level,ratio:next.ratio};}):[]};
}}
function showResult(){const victory=battle.phase==='victory',reward=battle.rewardSummary,isDungeon=getEncounter(battle.stageId)?.mode==='dungeon';openModal(victory?(isDungeon?'The dungeon is conquered.':getEncounter(battle.stageId)?.mode==='arena'?'The Arena is yours.':getEncounter(battle.stageId)?.mode==='event'?'The event is conquered.':'The crossing is yours.'):'The runes will rise again.',`<div class="result-sigil ${victory?'won':''}">${victory?'✦':'◇'}</div><p class="result-copy">${victory?'Victory':'Defeat'} in ${battle.moves} move${battle.moves===1?'':'s'} · ${battle.cascades} cascade${battle.cascades===1?'':'s'}</p>${victory&&getEncounter(battle.stageId)?.mode==='weekly'?'<p>Weekly challenge complete. Your gift is ready on the Daily Gift page.</p><button class="button gold" data-action="nav" data-page="daily">Weekly Challenges</button>':''}${battle.sandbox?'<p class="sandbox-result">Playtesting · maximum-level heroes. No rewards or campaign progress.</p>':reward?`<div class="result-rewards">${reward.gold?`<span>+${esc(reward.gold)} Gold</span>`:''}${reward.rating?`<span>${reward.rating>0?'+':''}${reward.rating} rating</span>`:''}${reward.arenaTokens?`<span>+${reward.arenaTokens} Arena Tokens</span>`:''}${reward.eventTokens?`<span>+${reward.eventTokens} Event Tokens</span>`:''}${Object.entries(reward.materials||{}).map(([id,n])=>`<span class="material-reward"><img src="${materialArt(id)}" alt="">+${n} ${materialById(id).name}</span>`).join('')}${reward.accountXp?`<span>+${reward.accountXp} profile XP</span>`:''}${reward.gems?`<span>+${esc(reward.gems)} Gems</span>`:''}</div>${reward.milestone?'<p class="milestone-reward">Five victories · 50 bonus Gems earned</p>':''}<details class="victory-growth-details"><summary>Champion gains · ${(reward.growth||[]).filter(g=>g.after>g.before).length} leveled up</summary><div class="victory-growth">${(reward.growth||[]).map(g=>`<div class="victory-hero ${g.after>g.before?'leveled-up':''}" aria-label="View ${esc(g.name)}, level ${g.after}"><span class="victory-portrait"><img src="${g.portrait}" alt="">${rankTrack(byId.get(g.id),profile)}</span><span><b>${esc(g.name)}</b><strong>${g.after>g.before?'LEVEL UP · ':''}Lv. ${g.before}${g.after>g.before?' → '+g.after:''}</strong><small>${g.gained?'+'+g.gained+' XP':g.after===g.cap?'Level Cap Reached':'No XP gained'}</small><span class="hero-xp-bar"><i style="width:${g.ratio*100}%"></i></span></span></div>`).join('')}</div></details>`:''}${victory&&!battle.sandbox?chapterGiftHTML(profile,getEncounter(battle.stageId)):''}<p class="result-saved">${victory?'Your rewards have been saved.':'Strengthen your warband and try again.'}</p><div class="modal-actions"><button class="button gold" data-action="home">Return to Courtyard</button></div>`,'result');}
function manaBar(unit){return `<span class="mana-bar" aria-hidden="true"><i style="width:${percent(unit.mana,unit.manaMax)}%"></i>${manaLevels(unit).slice(0,-1).map(l=>`<b class="charge-notch ${unit.mana>=l.tiles?'filled':''}" style="left:${percent(l.tiles,unit.manaMax)}%"></b>`).join('')}</span>`;}
function effectList(description){return `<ol class="special-sequence" aria-label="Special resolution order">${description.steps.map(e=>`<li data-step-kind="${e.kind}"><span class="sequence-icon" aria-hidden="true">${e.id?effectIcon(e.id):glyph(e.kind==='heal'?'health':'attack')}</span><div><b>${esc(e.name)}</b><small>${esc(e.scope)} · ${e.duration?e.duration+' board move'+(e.duration===1?'':'s'):'Instant'}</small><p>${esc(e.description)}</p>${e.periodic?'<em>First tick: start of the next valid board move.</em>':''}</div></li>`).join('')}</ol>`;}

function specialLevelsHTML(unit,canCast=false,dossier=false){return `<div class="special-levels ${unit.special.charging?'multi-charge':''}">${manaLevels(unit).map(l=>{const d=skillDescription(unit,effects,l.level),available=Number.isFinite(unit.mana)&&unit.mana>=l.tiles&&unit.hp>0;return `<section class="special-level ${available?'available':''}" data-charge-level="${l.level}">${dossier&&!unit.special.charging?'':`<header><b>${unit.special.charging?'Charge '+l.level:manaLabel(unit)}</b><span>${l.tiles} tiles</span></header>`}<p class="special-at-a-glance"><span>Special Ability Quick Summary</span>${esc(specialSummary(l))}</p>${chargeComparisonHTML(unit,l.level)}${canCast?`<p class="special-targeting">${esc(d.targeting)}</p>`:''}${effectList(d)}${canCast?`<button class="button ${available?'gold':'outline'}" data-action="choose-charge" data-uid="${unit.uid}" data-level="${l.level}" ${!available?'disabled':''}>${available?'Cast '+(unit.special.charging?'Charge '+l.level:'Special'):'Need '+chargeText(l.tiles-unit.mana)+' more tiles'}</button>`:''}</section>`;}).join('')}</div>`;}
function inspect(unit){if(!unit.uid)unit=developedChampion(unit,profile,{preview:profile.openRoster,sandbox:profile.openRoster});openModal(esc(unit.name),`<div class="champion-detail ${unit.color}"><img src="${unit.portrait}" alt="${esc(unit.name)}"><div><span class="eyebrow">${faction(unit.faction)} · ${unit.rarity} ${role(unit.role)}</span><h3>${esc(unit.special.name)}</h3><p class="detail-element ${unit.color}">${rune(unit.color)} ${ELEMENTS[unit.color].name} · ${unit.color}</p><p class="ability-cost">${manaLabel(unit)} · ${manaLevels(unit).map(l=>l.tiles).join(' / ')} tiles · ${unit.side==='enemy'?'Casts when full at an attack opportunity':'No board move to cast'}</p>${unit.side==='enemy'?`<p class="enemy-charge-detail">${chargeText(unit.mana)} / ${unit.manaMax} tile charge · attacks in ${unit.countdown} board move${unit.countdown===1?'':'s'}</p>`:''}<dl><div><dt>HP</dt><dd>${unit.maxHp||unit.hp}</dd></div><div><dt>ATK</dt><dd>${unit.atk}</dd></div><div><dt>DEF</dt><dd>${unit.def}</dd></div></dl></div></div>${activeEffectsHTML(unit)}${specialLevelsHTML(unit)}${factionUnitHTML(unit)}${unit.passive?`<div class="passive-info"><b>Passive · ${esc(unit.passive.name)}</b><p>${esc(unit.passive.desc)}</p></div>`:''}<details class="champion-story"><summary>${esc(unit.title)}</summary><p>${esc(unit.lore)}</p></details>${inspectingFromRoster?'<button class="text-button" data-action="back-roster">← Back to your warband</button>':''}`,'ability');}
let inspectingFromRoster=false;
function chooseSpecial(hero){
  pendingCaster=null;selectedRune=null;renderBattle();
  if(!readyLevel(hero)){inspectingFromRoster=false;inspect(hero);return;}
  if(hero.special.charging){openModal(esc(hero.special.name),`<p><strong>${esc(hero.name)}</strong> · ${chargeText(hero.mana)} / ${hero.manaMax} tiles.</p>${specialLevelsHTML(hero,true)}`,'charge');return;}
  aimSpecial(hero,1);
}
function aimSpecial(hero,level){const spec=manaLevels(hero).find(l=>l.level===level);if(!spec||hero.mana<spec.tiles)return;closeModal();if(spec.target==='self'){play(cast(battle,hero.uid,hero.uid,level));return;}pendingCaster=hero.uid;pendingLevel=level;selectedRune=null;renderBattle();}
function renderHistory(state=displayedBattle||battle){if(!state)return;openModal('Battle chronicle',`<div class="history-list">${state.log.slice().reverse().map(l=>`<p class="log-${l.tone}"><small>MOVE ${l.move}</small>${esc(l.text)}</p>`).join('')}</div>`,'history');}
let questLimit=0,questState='active',shopTab='supplies',exchangeChoices={},boosterExpiryTimer=null;
let teamFilters={...DEFAULT_FILTERS},draftTeam=[],editingTeamSlot=0;
function renderTeamFilters(){const holder=modalContent.querySelector('#team-filters'),open=!!holder.querySelector('details[open]');holder.innerHTML=collectionFiltersHTML(roster,teamFilters,{prefix:'team'});holder.querySelector('details').open=open;}
function openRoster(keepDraft=false,slot=profile.activeTeamSlot){if(!keepDraft){editingTeamSlot=slot;draftTeam=[...(profile.teamSlots[slot]||profile.team)];teamFilters={...DEFAULT_FILTERS};}inspectingFromRoster=false;const numeral=['I','II','III','IV'][editingTeamSlot];openModal(numeral,`<div id="draft-team"></div><div id="team-filters">${collectionFiltersHTML(roster,teamFilters,{prefix:'team'})}</div><div id="roster-grid" class="roster-grid"></div><div class="roster-save"><span id="draft-count"></span><div class="team-editor-actions"><button class="button outline" data-action="clear-team">Clear team</button><button class="button gold" data-action="save-team" id="save-team">Save Team</button></div></div>`,'roster');document.getElementById('modal-title').setAttribute('aria-label','Team '+numeral);renderRoster();}

function renderRoster(){
  const list=filterChampions(profile.openRoster?battleRoster(profile,roster):ownedHeroes(profile,roster),profile,{...teamFilters,tab:profile.openRoster?'all':'owned'});
  document.querySelector('#roster-grid').innerHTML=list.map(c=>`<article class="roster-entry ${c.color}"><button class="roster-card ${c.color} tier-${c.rarity} ${draftTeam.includes(c.id)?'picked':''}" data-action="pick" data-id="${c.id}" aria-pressed="${draftTeam.includes(c.id)}"><img src="${c.portrait}" alt="" loading="lazy" width="480" height="640"><span class="roster-shade"></span>${rankTrack(c,profile)}${roleMark(c.role)}<span class="roster-color">${rune(c.color)}</span><span class="roster-label">${rarityMark(c.rarity)}<strong>${esc(c.name)}</strong></span>${draftTeam.includes(c.id)?'<span class="pick-number">'+(draftTeam.indexOf(c.id)+1)+'</span>':''}</button><span class="roster-mana">${levelMark(c,profile)} ${manaLabel(c)}</span></article>`).join('')||'<p>No champions match these filters.</p>';
  document.querySelector('#draft-team').innerHTML=`<p class="team-power" title="${estimateNote}">${esc(teamName(profile,editingTeamSlot))} · Power ${teamPower(profile,draftTeam,roster).toLocaleString()} (estimate)</p>`+factionTeamHTML(draftTeam.map(id=>byId.get(id)));document.querySelector('#draft-count').textContent=`${draftTeam.length} / 5 selected · ${list.length} champions shown`;document.querySelector('#save-team').disabled=draftTeam.length!==5;

}
function tapTile(index){if(busy||screen!=='battle'||pendingCaster)return;if(selectedRune===index){if(battle.board[index].special)play(activate(battle,index));else{selectedRune=null;renderBattle();}return;}if(selectedRune!==null){const a=selectedRune;selectedRune=null;play(swap(battle,a,index));if(!busy)renderBattle();}else{selectedRune=index;renderBattle();}}
function openPlayerProfile(){openModal('Your Profile',profileEditorHTML(profile),'profile-editor');mountProfileEditor(modalContent,{avatar:profile.avatar,onAvatar:avatar=>{profile={...profile,avatar};persist(PROFILE_KEY,profile);courtyardView?.updateProfile(profile);},onName:name=>{profile={...profile,name};persist(PROFILE_KEY,profile);courtyardView?.updateProfile(profile);}});}
function closeModal(){if(modal.dataset.view==='battle-exit'){drag=null;edgeTap=null;suppressClickUntil=0;}if(modal.dataset.view==='chapter-story')stopCinematic();if(modal.open)modal.close();modal.dataset.view='';scheduleAuto();}
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');if(!button||button.disabled)return;const {action,id,uid,stage,color,index}=button.dataset;
  if(button.tagName==='A')event.preventDefault();
  if(['tile','hero','enemy','choose-charge'].includes(action)&&autoEnabled){stopAuto();if(screen==='battle'&&!busy)renderBattle();}
  if(action==='play-intro'){playIntro(profile,reducedAnimation());return;}
  if(action==='practice-reward'){questState='ready';go('quests');return;}
  if(action==='auto-battle'){if(combatPractice)return;if(!battle||battle.phase!=='playing')return;if(autoEnabled)stopAuto();else{manualBattleSpeed=battleSpeed;autoEnabled=true;battleSpeed=2;pendingCaster=null;selectedRune=null;}if(!busy)renderBattle();else{button.textContent=autoEnabled?'Auto On':'Auto Off';button.setAttribute('aria-pressed',String(autoEnabled));button.classList.toggle('active',autoEnabled);}return;}
  if(action==='encounter-tactics'){const state=displayedBattle||battle,stage=getEncounter(state.stageId);openModal(esc(stage.name),encounterTactics(stage,state)||`<p>${esc(stage.description)}</p><p>Defeat the enemy warband. Read attack countdowns, elements and lanes.</p>`,'tactics');return;}
  if(action==='dossier-section'){document.getElementById(button.dataset.section)?.scrollIntoView({behavior:reducedAnimation()?'instant':'smooth',block:'start'});return;}
  if(action==='material-preview'){openModal('Acquire material',materialConfirmation(profile,id),'material');return;}
  if(action==='material-confirm'){const r=materialPurchase(profile,id);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderShell('shop');toast(r.item.name+' added to your inventory.');return;}
  if(['ascend-preview','awaken-preview'].includes(action)){const c=byId.get(id);if(!c)return;const kind=action.split('-')[0];openModal(kind==='ascend'?'Ascend your champion':'Awaken your champion',advancementConfirmation(c,profile,kind),'advancement');return;}
  if(['ascend-confirm','awaken-confirm'].includes(action)){const c=byId.get(id);if(!c)return;const r=(action==='ascend-confirm'?ascendChampion:awakenChampion)(profile,c,Number(button.dataset.tier));if(r.error){closeModal();renderChampionPage(id);toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderChampionPage(id);document.querySelector(action==='ascend-confirm'?'#hero-ascension':'#hero-awakening')?.scrollIntoView({block:'center',behavior:'instant'});toast(action==='ascend-confirm'?'Ascended! Level '+r.cap+' is now unlocked.':'Limit Break '+r.rank+' reached! Five more levels unlocked.');return;}
  if(action==='open-codex'){collectionFilters.tab='all';go('roster');return;}
  if(action==='event-select'){selectedEvent=button.dataset.event;const e=getEncounter('event-'+selectedEvent);if(e)openModal(esc(e.name),Shell.encounterPreview(profile,e.id),'event-stage');return;}
  if(action==='loot-preview'){syncEnergy();const q=lootTicketQuote(profile,stage,roster);if(q.error){toast(q.error);return;}openModal('Use a Loot Ticket?',lootTicketConfirmation(q),'loot-confirm');return;}
  if(action==='loot-confirm'&&modal.dataset.view==='loot-confirm'){const result=useLootTicket(profile,stage,roster,{expectedUses:Number(button.dataset.uses),activeBattle:battle?.phase==='playing'});if(result.error){closeModal();toast(result.error);return;}profile=result.profile;persist(PROFILE_KEY,profile);closeModal();renderShell('campaign');openModal('Stage cleared',lootTicketResult(result),'loot-result');return;}
  if(action==='exchange-preview'){openModal('Exchange your spoils',Shell.exchangeConfirmation(profile,id),'exchange');return;}
  if(action==='exchange-confirm'&&modal.dataset.view==='exchange'){const r=exchange(profile,id);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderShell('shop');toast('Exchange complete. Your rewards are saved.');return;}
  if(action==='skip-ritual'){finishRitual(true);return;}
  if(action==='multi-summon'){openPortal(10);return;}
  if(action==='campaign-act-next'){const next=button.dataset.difficulty;if(!['hard','nightmare'].includes(next))return;campaignDifficulty=next;go('campaign');return;}
  if(action==='campaign-difficulty'){campaignDifficulty=button.dataset.difficulty;renderShell('campaign');return;}
  if(action==='dungeon-difficulty'){dungeonDifficulty=button.dataset.difficulty;renderShell('dungeons');return;}
  if(action==='preview-encounter'){previewEncounter(stage);return;}
  if(action==='dismiss-first-steps'){profile={...profile,onboardingDismissed:true};persist(PROFILE_KEY,profile);if(screen==='home')renderHome();else if(screen==='champion')renderChampionPage(app.querySelector('.champion-page').dataset.championId);else renderShell(screen);return;}
  if(action==='first-step'){const step=nextFirstStep({...profile,onboardingDismissed:false});if(!step)return;if(step.id==='quest'){questState='ready';go('quests');const card=app.querySelector('[data-quest="'+step.quest+'"]');card?.scrollIntoView({block:'center',behavior:'instant'});card?.querySelector('[data-action="claim-quest"]')?.focus({preventScroll:true});return;}if(step.id==='practice'){startCombatPractice();return;}if(step.page==='campaign')campaignDifficulty='normal';if(step.id==='feed'){const target=profile.team.map(id=>byId.get(id)).find(c=>c&&!heroDevelopment(profile,c).atCap);if(target){go('champion/'+encodeURIComponent(target.id));app.querySelector('#hero-development')?.scrollIntoView({block:'start',behavior:'instant'});}else{collectionFilters.tab='owned';go('roster');}return;}if(step.id==='team'){collectionFilters.tab='teams';go('roster');openRoster();return;}if(step.id==='guide'){openGuide('overview');return;}if(step.page==='shop')shopTab=step.tab||'supplies';go(step.page);return;}
  if(action==='nav'){go(button.dataset.page);return;}
  if(action==='champion'){go('champion/'+encodeURIComponent(id)+(button.dataset.preview==='true'?'/codex':''));return;}
  if(action==='reset-collection'){collectionFilters={...DEFAULT_FILTERS,tab:collectionFilters.tab};renderCollectionPage();return;}
  if(action==='collection-tab'){collectionFilters.tab=button.dataset.tab;renderCollectionPage();return;}
  if(action==='summon'){openPortal();return;}
  if(action==='daily-claim'||action==='path-claim'){const r=(action==='daily-claim'?claimDaily:claimPath)(profile);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);renderShell('daily');toast('Daily rewards saved.');return;}
  if(action==='edit-profile'){openPlayerProfile();return;}
  if(action==='team-rename'){const slot=Number(button.dataset.slot);openModal('Name your team',`<label>Team name<input id="team-name-input" maxlength="24" value="${esc(teamName(profile,slot))}"></label><div class="modal-actions"><button class="button outline" data-action="close">Cancel</button><button class="button gold" data-action="team-rename-save" data-slot="${slot}">Save name</button></div>`,'team-name');return;}
  if(action==='team-rename-save'){const r=renameTeam(profile,Number(button.dataset.slot),modalContent.querySelector('#team-name-input').value);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderCollectionPage();return;}
  if(action==='hero-preference'){profile=toggleHeroPreference(profile,id,button.dataset.preference);persist(PROFILE_KEY,profile);renderChampionPage(id);return;}
  if(action==='team-edit'){openRoster(false,Number(button.dataset.slot));return;}
  if(action==='team-load'){const slot=Number(button.dataset.slot),r=teamSlot(profile,slot,'load');if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);collectionFilters.tab='teams';go('roster');toast('Team '+(slot+1)+' is active for all battles.');return;}
  if(action==='quest-status'){questState=button.dataset.state;questLimit=0;renderShell('quests');return;}
  if(action==='quest-more'){questLimit=(questLimit||(innerWidth<600?6:12))+(innerWidth<600?6:12);renderShell('quests');return;}
  if(action==='shop-tab'){shopTab=button.dataset.tab;renderShell('shop');return;}
  if(action==='premium-item-preview'){const item=premiumItem(id);if(!item)return;openModal(item.name,premiumItemConfirmation(profile,id,roster,button.dataset.champion),'premium-item');return;}
  if(action==='premium-item-confirm'&&modal.dataset.view==='premium-item'){
   const item=premiumItem(id);if(!item)return;let result;
   if(item.kind)result=activateBooster(profile,id);
   else{const hero=heroForId(roster,modalContent.querySelector('#premium-item-champion')?.value);if(!hero){toast('Choose an eligible champion.');return;}result=item.maxLevels?useExperienceTome(profile,id,hero):id==='tome-of-ascension'?ascendChampion(profile,hero,ascensionTier(profile,hero),{tome:true}):awakenChampion(profile,hero,awakeningRank(profile,hero),{tome:true});}
   if(result.error){toast(result.error);return;}profile=result.profile;persist(PROFILE_KEY,profile);closeModal();if(screen==='champion')renderChampionPage(app.querySelector('.champion-page')?.dataset.championId);else renderShell('inventory');toast(item.kind?item.name+' active for 24 hours.':item.name+' used.');return;
  }
  if(action==='gem-preview'){openModal('Spend Gems',gemConfirmation(profile,id),'gem-shop');return;}
  if(action==='gem-confirm'){const r=buyWithGems(profile,id);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderShell('shop');toast(r.offer.name+' purchased.');return;}
  if(action==='claim-quest'){const result=claimQuest(profile,id,roster);if(result.error)toast(result.error);else{profile=result.profile;persist(PROFILE_KEY,profile);renderShell('quests');toast('Quest rewards added to your inventory.');announceTutorialCompletion();}return;}

  if(action==='restart-preview'){openModal('Restart your journey?',`<p>This will erase this browser's Warband Legends progress, champions, resources, quests and current battle. You will begin again with the starter team.</p><div class="modal-actions"><button class="button outline" data-action="close">Keep progress</button><button class="button gold" data-action="restart-confirm">Erase progress and restart</button></div>`,'restart');return;}
  if(action==='restart-confirm'&&modal.dataset.view==='restart'){restartJourney();return;}

  if(action==='close'){if(modal.dataset.view==='ritual')finishRitual(true);else closeModal();return;}
  if(action==='battle-exit'){if(battle?.phase!=='playing'){closeModal();go('home');return;}requestBattleExit('home');return;}
  if(action==='home'){closeModal();if(button.dataset.leaveBattle){const destination=button.dataset.page||'home';abandonBattle();history.replaceState(null,'','#/'+destination);renderRoute();}else go('home');return;}
  if(action==='guide-effects'){openGuide('effects',button.dataset.kind);return;}
  if(action==='status'){showStatuses(uid);return;}
  if(action==='help'){openGuide(button.dataset.topic||'overview');return;}
  if(action==='open-guide'){openGuide(button.dataset.topic||'overview');return;}
  if(action==='guide-topic'){openGuide(button.dataset.topic);return;}
  if(action==='feed-preview'){const target=byId.get(id);if(!target)return;if(!availableDonors(profile,target,roster,battle).length){toast('Collect a spare Common or Rare hero to train this champion.');return;}openModal('Train with Common & Rare heroes',feedingConfirmation(profile,target,roster,battle),'feeding');return;}
  if(action==='feed-confirm'){const donors=[...modalContent.querySelectorAll('[name="feed-copy"]:checked')].map(n=>n.value);const r=consumeHeroes(profile,byId.get(id),donors,roster,{battle,expectedXp:Number(button.dataset.xp)});if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();renderChampionPage(id);toast('Training complete · +'+r.gained+' XP · level '+r.displayBefore+' → '+r.displayAfter+'.');return;}
  if(action==='history'){renderHistory();return;}
  if(action==='speed'){battleSpeed=battleSpeed===1?2:1;button.textContent=`${battleSpeed}×`;button.setAttribute('aria-label',`Animation speed ${battleSpeed} times`);return;}
  if(action==='roster'){openRoster();return;}
  if(action==='inspect-roster'){go('champion/'+encodeURIComponent(id));return;}
  if(action==='roster-details'){inspectingFromRoster=true;inspect(byId.get(id));return;}
  if(action==='back-roster'){openRoster(true);return;}
  if(action==='choose-charge'&&!busy){const hero=battle.heroes.find(h=>h.uid===uid);if(hero)aimSpecial(hero,Number(button.dataset.level));return;}
  if(action==='inspect-unit'){inspectingFromRoster=false;inspect([...(displayedBattle||battle).heroes,...(displayedBattle||battle).enemies].find(u=>u.uid===uid));return;}
  if(action==='team-filters-reset'){teamFilters={...DEFAULT_FILTERS};renderTeamFilters();renderRoster();return;}
  if(action==='clear-team'){draftTeam=[];renderRoster();return;}
  if(action==='pick'){if(draftTeam.includes(id))draftTeam=draftTeam.filter(c=>c!==id);else if(!canUse(profile,id))toast('Collect this champion at the portal first.');else if(draftTeam.length<5)draftTeam.push(id);else toast('Your warband has five champions. Remove one to make room.');renderRoster();return;}
  if(action==='save-team'){const r=saveTeam(profile,editingTeamSlot,draftTeam,roster);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);closeModal();collectionFilters.tab='teams';go('roster');toast('Team '+(editingTeamSlot+1)+' saved.');return;}

  if(action==='chapter-journal'){openModal('Chapter Journal',journalHTML(profile,{difficulty:screen==='campaign'?campaignDifficulty:'normal'}),'chapter-journal');return;}
  if(action==='opening-replay'){openModal('Act '+campaignArc(button.dataset.difficulty||'normal').act+' · '+campaignArc(button.dataset.difficulty||'normal').title,openingStoryHTML('',{replay:true,difficulty:button.dataset.difficulty||'normal'}),'chapter-story');return;}
  if(action==='aftermath-replay'){const d=button.dataset.difficulty,id=Number(button.dataset.chapter);if((profile.campaignProgress?.[d]||0)<id*5)return;openModal('After the crossing',aftermathHTML(d,id),'chapter-story');return;}
  if(action==='story-replay'){openModal('Act '+campaignArc(button.dataset.difficulty||'normal').act+' · '+campaignArc(button.dataset.difficulty||'normal').title,storyHTML(Number(button.dataset.chapter),{replay:true,difficulty:button.dataset.difficulty||'normal'}),'chapter-story');return;}
  if(action==='story-continue'){const e=getEncounter(stage);if(!isChapterBoss(e)&&!(e?.mode==='campaign'&&e.number===1))return;profile={...profile,storySeen:[...new Set([...(profile.storySeen||[]),narrativeKey(e)])]};persist(PROFILE_KEY,profile);previewEncounter(stage,{story:false});return;}
  if(action==='chapter-claim'){const r=claimChapter(profile,button.dataset.key);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);if(battle?.phase==='victory')showResult();else openModal('Chapter Journal',journalHTML(profile),'chapter-journal');toast('Chapter gift saved.');return;}
  if(action==='weekly-team'){collectionFilters.tab='teams';go('roster');return;}
  if(action==='weekly-claim'){const r=claimWeekly(profile,button.dataset.key);if(r.error){toast(r.error);return;}profile=r.profile;persist(PROFILE_KEY,profile);go('daily');toast('Weekly gift saved.');return;}
  if(action==='start'){start(stage);return;}
  if(action==='retry'){const stageId=battle.stageId;closeModal();battle=null;start(stageId);return;}
  if(action==='cancel-cast'){pendingCaster=null;renderBattle();return;}
  if(action==='hint'&&!busy){const move=validMoves(battle.board)[0];if(move){renderBattle();for(const i of move)app.querySelector(`[data-index="${i}"]`)?.classList.add('hint');toast('The glowing runes can be swapped.');}return;}
  if(action==='tile'){if(combatPractice?.phase===PRACTICE_PHASES.length)return;tapTile(Number(index));return;}
  if(action==='hero'&&!busy){if(combatPractice?.phase===PRACTICE_PHASES.length)return;const hero=battle.heroes.find(h=>h.uid===uid);if(!hero||hero.hp<=0)return;const caster=battle.heroes.find(h=>h.uid===pendingCaster),spec=caster&&manaLevels(caster).find(l=>l.level===pendingLevel);if(spec?.target==='ally'){play(cast(battle,pendingCaster,uid,pendingLevel));return;}chooseSpecial(hero);return;}
  if(action==='enemy'&&!busy){if(pendingCaster){const hero=battle.heroes.find(h=>h.uid===pendingCaster),spec=manaLevels(hero).find(l=>l.level===pendingLevel);if(spec.target==='enemy')play(cast(battle,pendingCaster,uid,pendingLevel));else toast('Choose one of your living champions to heal.');}else{selectedEnemy=uid;renderBattle();}return;}

});
document.addEventListener('change',event=>{if(event.target.id==='cinematic-preference'){profile={...profile,cinematicsEnabled:event.target.checked};persist(PROFILE_KEY,profile);if(!event.target.checked)stopCinematic();return;}if(event.target.name==='feed-copy'){const confirm=modalContent.querySelector('[data-action="feed-confirm"]');if(!confirm)return;const ids=[...modalContent.querySelectorAll('[name="feed-copy"]:checked')].map(n=>n.value),q=feedingQuote(profile,byId.get(confirm.dataset.id),ids,roster,{battle});modalContent.querySelector('.feeding-summary').textContent=q.error||`+${q.gained} XP${q.boosted?' (+25% booster)':''} · Level ${q.displayBefore} → ${q.displayAfter} · ${q.gold} gold · ${ids.length} consumed`;confirm.disabled=!!q.error;}});
document.addEventListener('change',event=>{if(event.target.id==='cinematic-preference'){profile={...profile,cinematicsEnabled:event.target.checked};persist(PROFILE_KEY,profile);if(!event.target.checked)stopCinematic();return;}const id=event.target.id;if(['team-color','team-rarity','team-faction','team-sort','team-direction'].includes(id)){teamFilters[id.replace('team-','')]=event.target.value;if(id==='team-sort'){teamFilters.direction=event.target.value==='rarity'?'desc':'asc';renderTeamFilters();}renderRoster();}});
modal.addEventListener('click',event=>{if(event.target===modal&&modal.dataset.view!=='result')closeModal();});
modal.addEventListener('close',()=>{if(!modal.open)modal.dataset.view='';});

let drag=null,suppressClickUntil=0,edgeTap=null;
// Safari reserves edge-start touches for its history swipe unless cancelled early.
document.addEventListener('touchstart',event=>{
 edgeTap=null;if(screen!=='battle'||battle?.phase!=='playing'||modal.open||event.touches.length!==1)return;
 const touch=event.touches[0];if(touch.clientX>24||!event.cancelable)return;
 edgeTap={id:touch.identifier,x:touch.clientX,y:touch.clientY,target:event.target.closest('button'),moved:false};event.preventDefault();
},{passive:false});
document.addEventListener('touchmove',event=>{if(!edgeTap)return;const touch=[...event.touches].find(t=>t.identifier===edgeTap.id);if(!touch)return;if(Math.hypot(touch.clientX-edgeTap.x,touch.clientY-edgeTap.y)>8)edgeTap.moved=true;if(event.cancelable)event.preventDefault();},{passive:false});
document.addEventListener('touchend',event=>{
 const tap=edgeTap;if(!tap||![...event.changedTouches].some(t=>t.identifier===tap.id))return;edgeTap=null;
 // Cancelling the native gesture also cancels its compatibility click.
 if(!tap.moved&&tap.target?.isConnected&&!tap.target.disabled&&screen==='battle'&&!modal.open&&!busy&&Date.now()>=suppressClickUntil){drag=null;tap.target.click();}
},{passive:false});
document.addEventListener('touchcancel',()=>{edgeTap=null;});

app.addEventListener('pointerdown',event=>{const tile=event.target.closest('[data-index]');if(screen!=='battle'||drag||!event.isPrimary||event.button!==0||!tile||tile.disabled||busy||pendingCaster)return;if(autoEnabled)stopAuto();drag={pointerId:event.pointerId,index:Number(tile.dataset.index),x:event.clientX,y:event.clientY,size:Math.min(tile.clientWidth,tile.clientHeight)};});
function continueBoardSwipe(event,finish=false){if(!drag||event.pointerId!==drag.pointerId)return;const old=drag;if(screen!=='battle'||busy||pendingCaster){drag=null;return;}const target=swipeTarget(old.index,event.clientX-old.x,event.clientY-old.y,{tileSize:old.size,finish});if(target===undefined){if(finish)drag=null;return;}drag=null;event.preventDefault();suppressClickUntil=Date.now()+400;selectedRune=null;if(target!==null)play(swap(battle,old.index,target));else renderBattle();}
document.addEventListener('pointermove',event=>continueBoardSwipe(event),{passive:false});
document.addEventListener('pointerup',event=>continueBoardSwipe(event,true),{passive:false});
document.addEventListener('pointercancel',event=>{if(drag?.pointerId===event.pointerId)drag=null;});
window.addEventListener('blur',()=>{drag=null;edgeTap=null;});
// Suppress the synthetic click after a drag before the delegated click handler runs.
app.addEventListener('click',event=>{if(Date.now()<suppressClickUntil&&event.target.closest('[data-index]')){event.stopPropagation();event.preventDefault();}},true);
app.addEventListener('keydown',event=>{const tile=event.target.closest('[data-index]');if(!tile)return;const i=Number(tile.dataset.index),delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key];if(delta){event.preventDefault();const n=i+delta;if(n>=0&&n<35&&(!(Math.abs(delta)===1)||Math.floor(i/7)===Math.floor(n/7)))app.querySelector(`[data-index="${n}"]`)?.focus();}});
let collectionFilters={...DEFAULT_FILTERS},summoning=false,summonToken=0,portalReveal=null;
function abandonBattle(){
  drag=null;edgeTap=null;suppressClickUntil=0;
  combatPractice=null;
  stopAuto();
  clearBattleEffects();
  animationToken++;busy=false;battle=null;displayedBattle=null;pendingCaster=null;selectedRune=null;selectedEnemy=null;
  clearBattleSave(storage);
  if(profile?.weeklyEntry){profile={...profile,weeklyEntry:null};persist(PROFILE_KEY,profile);}
  if(profile?.eventEntry){profile={...profile,eventEntry:null};persist(PROFILE_KEY,profile);}
}
window.addEventListener('pagehide',()=>{abandonBattle();courtyardView?.destroy();courtyardView=null;});
window.addEventListener('pageshow',event=>{if(event.persisted)renderRoute();});
function go(path){const hash='#/'+path;if(location.hash!==hash)history.pushState(null,'',hash);renderRoute();}
function requestBattleExit(destination){openModal('Exit battle?','<p>This battle will be abandoned.</p><div class="modal-actions"><button class="button outline" data-action="close">Stay in battle</button><button class="button gold" data-action="home" data-leave-battle="true" data-page="'+esc(destination)+'">Exit battle</button></div>','battle-exit');}
function handleHashNavigation(){
 const destination=location.hash.replace(/^#\/?/,'')||'splash';
 if(screen==='battle'&&battle?.phase==='playing'&&destination.split('/')[0]!=='battle'){
  history.pushState(null,'','#/battle');drag=null;edgeTap=null;suppressClickUntil=Date.now()+400;requestBattleExit(destination);return;
 }
 renderRoute();
}
let weeklyRefreshTimer=null;

function renderRoute(){
  if(!profile)return;
  stopCinematic();clearTimeout(weeklyRefreshTimer);
  syncEnergy();
  document.body.classList.toggle('reduce-animation',reducedAnimation());
  const raw=location.hash.replace(/^#\/?/,'')||'splash',parts=raw.split('/'),page=parts[0];
  if(page!=='home'&&courtyardView){courtyardView.destroy();courtyardView=null;}
  if(page!=='battle'&&battle)abandonBattle();
  pauseAuto();animationToken++;busy=false;pendingCaster=null;selectedRune=null;closeModal();clearBattleEffects();
  if(page!=='summon'){summonToken++;summoning=false;portalReveal=null;}
  if(page==='splash'){screen='splash';app.innerHTML=Shell.splash({cinematics:motionAllowed(profile,reducedAnimation())});introOnce(profile,reducedAnimation());}
  else if(page==='home')renderHome();
  else if(page==='battle'){if(!battle){go('campaign');return;}screen='battle';renderBattle();if(battle.phase!=='playing')showResult();}
  else if(page==='weekly'){go('daily');return;}
  else if(page==='roster')renderCollectionPage();
  else if(page==='settings'){go('home');openGuide('tools');return;}
  else if(page==='champion'){let id;try{id=decodeURIComponent(parts[1]||'');}catch{id='';}renderChampionPage(id,parts[2]==='codex');}
  else if(['world','campaign','summon','quests','inventory','daily',...Object.keys(Shell.MODES)].includes(page))renderShell(page);
  else{go('home');return;}
  window.scrollTo({top:0,behavior:'instant'});if(page!=='battle'&&page!=='splash')announceTutorialCompletion();
}
function announceTutorialCompletion(){if(!tutorialFinished(profile)||tutorialState(profile).celebrated||modal.open)return;profile={...profile,onboardingComplete:true,tutorial:{...tutorialState(profile),celebrated:true}};persist(PROFILE_KEY,profile);openModal('You’re ready to start your adventure!',`<img class="tutorial-complete-trophy" src="./assets/items/tutorial-complete-trophy.webp" alt="Tutorial complete trophy" width="180" height="180"><p>You’ve learned to summon, collect quest rewards, train champions, explore your supplies, shape a team and use the Guide.</p><p>Your next campaign stage is waiting. Adventure at your own pace!</p><div class="modal-actions"><button class="button outline" data-action="close">Keep Exploring</button><button class="button gold" data-action="nav" data-page="campaign">Start My Adventure</button></div>`,'tutorial-complete');}
function openGuide(topic,effectKind='buff'){const next=recordTutorial(profile,'guide');if(next!==profile){profile=next;persist(PROFILE_KEY,profile);const card=app.querySelector('.first-steps');if(card)card.outerHTML=firstStepsHTML(profile,screen);}openModal('The Guide',guideHTML(topic,byId.get(app.querySelector('.champion-page')?.dataset.championId),effectKind,profile),'page-guide');}
function shellFrame(page,body){clearTimeout(boosterExpiryTimer);const active=page==='daily'?'home':page!=='shop'&&(page==='campaign'||page==='dungeons'||page==='weekly'||Shell.MODES[page])?'world':page==='champion'?'roster':page;app.innerHTML=`${header(active,page)}<main class="game-page page-${page}">${firstStepsHTML(profile,page)}${body}</main>`;}
function renderShell(page,center=true){screen=page;const next=recordTutorial(profile,page==='shop'?shopTab==='supplies'?'shop':shopTab:page==='inventory'?'inventory':'');if(next!==profile){profile=next;persist(PROFILE_KEY,profile);}const body=page==='world'?Shell.world():page==='campaign'?Shell.campaign(profile,{difficulty:campaignDifficulty}):page==='dungeons'?Shell.dungeons(profile,{difficulty:dungeonDifficulty}):page==='arena'?Shell.arena(profile,roster,{selected:selectedArena}):page==='events'?Shell.events(profile,{selected:selectedEvent}):page==='shop'?Shell.exchangePage(profile,{tab:shopTab,choices:exchangeChoices}):page==='summon'?Shell.portal(profile,roster,{charging:summoning,reveal:portalReveal}):page==='quests'?Shell.quests(profile,{limit:questLimit||(innerWidth<600?6:12),state:questState}):page==='inventory'?Shell.inventory(profile):page==='daily'?dailyPage(profile,roster):Shell.foundation(page);shellFrame(page,body);if(page==='daily')weeklyRefreshTimer=setTimeout(()=>{if(screen==='daily')renderShell('daily');},Math.max(100,+weeklyWindow().reset-Date.now()+100));if(page==='inventory'){const now=Date.now(),expiry=Object.values(profile.boosters||{}).filter(t=>t>now).sort((a,b)=>a-b)[0];if(expiry)boosterExpiryTimer=setTimeout(()=>{if(screen==='inventory')renderShell('inventory');},Math.min(2147483647,expiry-now+10));}if(page==='arena')mountArenaScene(app.querySelector('.arena-scene'),{selected:selectedArena,onSelect:index=>{selectedArena=index;}});if(page==='campaign'&&center){const viewport=document.querySelector('.campaign-map-viewport'),node=viewport?.querySelector('[data-current="true"]');if(node){viewport.scrollLeft=node.offsetLeft-viewport.clientWidth/2;viewport.scrollTop=node.offsetTop-viewport.clientHeight/2;}}}
function renderCollectionPage(){const filtersOpen=!!app.querySelector('.collection-filters[open]');screen='roster';shellFrame('roster',Shell.collection(profile,roster,collectionFilters,collectionFilters.tab==='teams'?warbandPanel():''));if(collectionFilters.tab!=='teams'){renderLibrary();if(filtersOpen)app.querySelector('.collection-filters').open=true;}}
function renderLibrary(){const results=Shell.collectionResults(profile,roster,collectionFilters);document.querySelector('#library-grid').innerHTML=results.html;document.querySelector('#library-count').textContent=`${results.count} of ${collectionFilters.tab==='all'?roster.length:Object.keys(profile.collection).length} Champions · ${collectionFilters.tab==='all'?'Codex':'Collection'}`;}
function renderChampionPage(id,preview=false){const expanded=app.querySelector('.champion-page')?.dataset.championId===id?[...app.querySelectorAll('.advancement-menu[open]')].map(n=>n.id):[];const source=byId.get(id);if(!source){go('roster');toast('This champion could not be found.');return;}const unit=developedChampion(source,profile,{preview}),owned=!preview&&!!profile.collection[id];screen='champion';shellFrame('champion',`<button class="text-button" data-action="nav" data-page="roster">← Back to Collection</button><section class="champion-page ${unit.color} tier-${unit.rarity}" data-champion-id="${esc(id)}"><div class="champion-showcase"><img src="${unit.portrait}" alt="${esc(unit.name)}">${detailMotionHTML(id)}${levelMark(source,profile,{preview,showTier:false})}${rankTrack(source,profile,{preview})}</div><div class="champion-biography"><span class="eyebrow">${unit.rarity} · ${faction(unit.faction)} · ${role(unit.role)}</span><h1>${esc(unit.name)}</h1>${owned?`<div class="hero-preferences"><button class="button outline" data-action="hero-preference" data-preference="favorites" data-id="${esc(id)}" aria-pressed="${(profile.favorites||[]).includes(id)}">${(profile.favorites||[]).includes(id)?'★ Favorite':'☆ Favorite'}</button><button class="button outline" data-action="hero-preference" data-preference="lockedHeroes" data-id="${esc(id)}" aria-pressed="${(profile.lockedHeroes||[]).includes(id)}">${(profile.lockedHeroes||[]).includes(id)?'Locked from feeding':'Lock from feeding'}</button></div>`:''}<p class="champion-title">${esc(unit.title)}</p><div class="detail-element ${unit.color}"><img class="detail-affinity" src="./assets/runes/${unit.color}.svg" alt=""><span>${unit.color} <span class="detail-separator" aria-hidden="true">·</span> ${manaLabel(unit)}</span></div><details class="champion-story"><summary>Read Their Story</summary><p class="champion-lore">${esc(unit.lore)}</p></details><section class="champion-special" id="hero-special"><span class="special-ability-label">Special Ability</span><div class="section-heading special-name-row"><h2>${esc(unit.special.name)}</h2>${!unit.special.charging?`<span class="special-tile-cost">${manaLevels(unit)[0].tiles} tiles</span>`:''}</div>${specialLevelsHTML(unit,false,true)}</section></div></section>${developmentPanel(source,preview?{...profile,collection:{}}:profile)}${unit.passive?`<section class="passive-info" id="hero-passive"><span class="eyebrow">PASSIVE ABILITY</span><h2>${esc(unit.passive.name)}</h2><p>${esc(unit.passive.desc)}</p></section>`:''}`);mountDetailMotion(app,profile,reducedAnimation());for(const section of expanded){const menu=document.getElementById(section);if(menu)menu.open=true;}}
function randomUnit(){return crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;}
let ritualResult=null;
async function finishRitual(skip=false){if(!ritualResult||screen!=='summon')return;const result=ritualResult;ritualResult=null;summoning=false;const token=++summonToken;closeModal();renderShell('summon');const featured=result.results?.find(r=>['legendary','mythical'].includes(r.champion.rarity)&&CHARACTER_CLIPS[r.champion.id]);if(featured&&!skip){await playCinematic(CHARACTER_CLIPS[featured.champion.id],{profile,reduced:reducedAnimation(),label:featured.champion.name+' revealed'});}if(screen==='summon'&&token===summonToken)openModal('Summon Results',summonResults(result),'summon-results');}
async function openPortal(count=1){
 if(screen!=='summon'||summoning)return;let result;try{result=summonBatch(profile,roster,randomUnit,count);}catch(error){toast(error.message);return;}if(result.error){toast(result.error);return;}
 profile=result.profile;persist(PROFILE_KEY,profile);const portraitPreload=new Image();portraitPreload.decoding='async';portraitPreload.src='./'+result.champion.portrait;summoning=true;portalReveal=null;ritualResult=result;const token=++summonToken;renderShell('summon');openModal('The portal awakens',ritualHTML(result,'activating'),'ritual');
 const reduced=reducedAnimation();await new Promise(resolve=>setTimeout(resolve,reduced?0:RITUAL_TIMING.activating));if(token!==summonToken||screen!=='summon')return;
 if(reduced){finishRitual();return;}openModal('A soul crosses the threshold',ritualHTML(result,'arriving'),'ritual');await new Promise(resolve=>setTimeout(resolve,RITUAL_TIMING.arriving));if(token!==summonToken||screen!=='summon')return;finishRitual();
}
modal.addEventListener('cancel',event=>{if(modal.dataset.view==='result'){event.preventDefault();return;}if(modal.dataset.view==='ritual'){event.preventDefault();finishRitual(true);}});
function restartJourney(){const oldProfile=storage.getItem(PROFILE_KEY),oldBattle=storage.getItem(BATTLE_KEY),fresh=defaultProfile();try{storage.setItem(PROFILE_KEY,JSON.stringify(fresh));storage.removeItem(BATTLE_KEY);}catch{try{if(oldProfile===null)storage.removeItem(PROFILE_KEY);else storage.setItem(PROFILE_KEY,oldProfile);if(oldBattle!==null)storage.setItem(BATTLE_KEY,oldBattle);}catch{}toast('Restart failed. Your saved progress is still available.');return;}profile=fresh;battle=null;displayedBattle=null;byId=new Map(battleRoster(profile,roster).map(c=>[c.id,c]));go('splash');toast('A new journey begins.');}
window.addEventListener('hashchange',handleHashNavigation);
document.addEventListener('keydown',event=>{if(screen==='splash'&&event.key==='Enter'&&!event.repeat){event.preventDefault();go('home');}});
document.addEventListener('change',async event=>{
 if(event.target.matches('[data-exchange-currency]')){const key=event.target.dataset.exchangeCurrency;exchangeChoices[key]=event.target.value;const offers=event.target.closest('.exchange-offers');offers.innerHTML=Shell.exchangeOffers(profile,exchangeChoices);offers.querySelector(`[data-exchange-currency="${key}"]`).focus();return;}

 const id=event.target.id;
 if(['collection-color','collection-rarity','collection-sort','collection-faction','collection-direction'].includes(id)){collectionFilters[id.replace('collection-','')]=event.target.value;if(id==='collection-sort'){collectionFilters.direction=event.target.value==='rarity'?'desc':'asc';renderCollectionPage();}else renderLibrary();}
 if(id==='open-roster'){const oldTeam=profile.team.join('|');profile=setOpenRoster(profile,event.target.checked);persist(PROFILE_KEY,profile);if(screen==='roster')renderCollectionPage();if(oldTeam!==profile.team.join('|'))toast('Your team now uses collected champions. You can adjust it in Codex → Teams.');}

});
async function boot(){try{
  const responses=await Promise.all([fetch('./data/champions.json?v=0.46.0'),fetch('./data/effects.json?v=0.46.0')]);if(responses.some(r=>!r.ok))throw Error('Roster files could not be loaded.');[roster,effects]=await Promise.all(responses.map(r=>r.json()));byId=new Map(roster.map(c=>[c.id,c]));profile=loadProfile(storage,roster);byId=new Map(battleRoster(profile,roster).map(c=>[c.id,c]));battle=null;clearBattleSave(storage);if(profile.eventEntry)profile={...profile,eventEntry:null};persist(PROFILE_KEY,profile);renderRoute();
}catch(error){app.innerHTML=`<main class="loading"><h1>The Runes Could Not Awaken.</h1><p>${esc(error.message)}</p><p>Run this game through its local server or static hosting, rather than opening index.html as a file.</p><button class="button gold" onclick="location.reload()">Try again</button></main>`;}}
boot();

function syncEnergy(){
 if(!profile)return;const updated=refreshEnergy(profile);if(updated!==profile){profile=updated;persist(PROFILE_KEY,profile);}
 const e=energyStatus(profile),label=app.querySelector('.energy-amount');if(label){label.textContent=`${e.current}/${e.max}`;label.setAttribute('aria-label',`${e.current} of ${e.max} Energy`);}
}
setInterval(syncEnergy,15000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncEnergy();});
