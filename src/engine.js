import {awakenedStats,normalLevelCap,ASCENSION_CAPS} from './ascension.js';
import {specialPlan,describeSpecial,specialTargeting,enemyTargetLabel} from './special-plan.js';
import {SCENARIOS,validScenario} from './chapter.js';
// Pure, deterministic combat. No network, UI, original-game API, or shared saves.
import {EFFECTS,BUFFS,DEBUFFS,DOTS,OPPOSITES,effectName} from './effects.js';
import {statsAtLevel,levelCap} from './development.js';
import {CAMPAIGN_STAGES,getEncounter,encounterAppearance,enemyLanes} from './encounters.js';
export {effectName} from './effects.js';
export const VERSION = 3;
export const COLS = 7, ROWS = 5, SIZE = COLS * ROWS;
export const COLORS = ['red', 'green', 'blue', 'yellow', 'purple'];
export const ELEMENTS = {
  red: {name:'Ember',symbol:'✦',beats:'green'}, green:{name:'Verdant',symbol:'❧',beats:'blue'},
  blue:{name:'Frost',symbol:'❄',beats:'red'}, yellow:{name:'Radiant',symbol:'☀',beats:'purple'},
  purple:{name:'Umbral',symbol:'☾',beats:'yellow'},
};
export const MANA_SPEEDS = {
  very_fast:{label:'Very Fast',tiles:6.5},fast:{label:'Fast',tiles:8},
  average:{label:'Average',tiles:10},slow:{label:'Slow',tiles:12},very_slow:{label:'Very Slow',tiles:13.5},
};
export function manaLevels(unit){return unit.special?.levels||[];}
export function readyLevel(unit){if(unit.hp<=0)return 0;return manaLevels(unit).filter(l=>unit.mana>=l.tiles).at(-1)?.level||0;}
export function manaLabel(unit){return unit.special?.charging?'Charging':MANA_SPEEDS[unit.manaSpeed]?.label||'Average';}
export function chargeText(amount){return Number(Number(amount).toFixed(2)).toString();}
function gainMana(unit,amount,{flat=false}={}){if(has(unit,'mana_block'))return 0;const rate=flat?1:(has(unit,'mana_surge')?1.2:1)*(has(unit,'mana_slow')?.85:1);const before=unit.mana;unit.mana=Math.min(unit.manaMax,Math.round((unit.mana+amount*rate)*100)/100);return Math.round((unit.mana-before)*100)/100;}

export const STAGES=CAMPAIGN_STAGES;
export const living = units => units.filter(u=>u.hp>0);
const clone = value => structuredClone(value);
const has = (u,id) => !!u.effects[id];
function roll(state) { let x=state.rng|0; x^=x<<13;x^=x>>>17;x^=x<<5;state.rng=x>>>0;return state.rng/4294967296; }
function tile(state, color) {return {id:state.nextTile++,color:color || COLORS[Math.floor(roll(state)*5)],special:null};}
export function advantage(color,target) {
  if (ELEMENTS[color]?.beats===target) return 2;
  if (['red','green','blue'].includes(color) && ELEMENTS[target]?.beats===color) return .5;
  return 1;
}
export function neighbors(a,b) {return Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&a<SIZE&&b>=0&&b<SIZE&&Math.abs(a%COLS-b%COLS)+Math.abs(Math.floor(a/COLS)-Math.floor(b/COLS))===1;}
export function findMatches(board) {
  const runs=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;){let end=c+1;while(end<COLS&&board[r*COLS+c]&&board[r*COLS+end]?.color===board[r*COLS+c].color)end++;if(end-c>=3)runs.push(Array.from({length:end-c},(_,i)=>r*COLS+c+i));c=end;}
  for(let c=0;c<COLS;c++)for(let r=0;r<ROWS;){let end=r+1;while(end<ROWS&&board[r*COLS+c]&&board[end*COLS+c]?.color===board[r*COLS+c].color)end++;if(end-r>=3)runs.push(Array.from({length:end-r},(_,i)=>(r+i)*COLS+c));r=end;}
  const groups=[];
  for(const run of runs){let merged=new Set(run),again=true;while(again){again=false;for(let i=groups.length-1;i>=0;i--)if([...groups[i]].some(n=>merged.has(n))){for(const n of groups[i])merged.add(n);groups.splice(i,1);again=true;}}groups.push(merged);}
  return groups.map(g=>[...g]);
}
export function validMoves(board) {
  const result=[];
  for(let a=0;a<SIZE;a++)for(const b of [a+1,a+COLS])if(neighbors(a,b)){
    if(board[a]?.special||board[b]?.special){result.push([a,b]);continue;}
    const swapped=board.slice();[swapped[a],swapped[b]]=[swapped[b],swapped[a]];
    if(findMatches(swapped).some(g=>g.includes(a)||g.includes(b)))result.push([a,b]);
  }
  return result;
}
function freshBoard(state) {
  for(let attempt=0;attempt<100;attempt++){
    const board=[];
    for(let i=0;i<SIZE;i++){
      const banned=new Set();
      if(i%COLS>=2&&board[i-1].color===board[i-2].color)banned.add(board[i-1].color);
      if(i>=2*COLS&&board[i-COLS].color===board[i-2*COLS].color)banned.add(board[i-COLS].color);
      const colors=COLORS.filter(c=>!banned.has(c));board.push(tile(state,colors[Math.floor(roll(state)*colors.length)]));
    }
    if(validMoves(board).length)return board;
  }
  throw new Error('Unable to create a playable board');
}
function message(state,text,tone='neutral',unitId=null) {state.log.push({id:++state.eventId,move:state.moves,text,tone,unitId});state.log=state.log.slice(-80);}
function frame(state,frames,kind,extra={}) {frames.push({kind,state:clone(state),...clone(extra)});}
function makeUnit(source,side,index) {
  return {...clone(source),uid:`${side}-${index}`,side,hp:source.hp,maxHp:source.hp,mana:0,manaMax:manaLevels(source).at(-1).tiles,shield:0,effects:{},reviveUsed:false,passiveReviveUsed:false,actions:0};
}
export function createBattle(roster,teamIds,stageId=STAGES[0].id,seed=Date.now(),options={}) {
  if(teamIds.length!==5||new Set(teamIds).size!==5)throw new Error('Choose five different champions.');
  const byId=new Map(roster.map(c=>[c.id,c]));if(teamIds.some(id=>!byId.has(id)))throw new Error('Unknown champion.');
  const stage=getEncounter(stageId);if(!stage)throw new Error('Unknown encounter.');
  const state={version:VERSION,id:`runes-${seed>>>0}-${stage.id}`,stageId,rng:seed>>>0||1,nextTile:1,eventId:0,moves:0,cascades:0,phase:'playing',log:[],heroes:teamIds.map((id,i)=>makeUnit(byId.get(id),'hero',i)),enemies:[]};
  if(options.progression){
    state.progression=true;state.sandbox=options.sandbox===true;
    for(const hero of state.heroes){const source=byId.get(hero.id);hero.level=state.sandbox?normalLevelCap(source):Math.max(1,Math.min(levelCap(source),Math.trunc(options.levels?.[hero.id])||1));const tier=state.sandbox?0:Math.max(0,Math.min(ASCENSION_CAPS[source.rarity].length-1,Math.trunc(options.ascensions?.[hero.id])||0));const rank=!state.sandbox&&source.rarity!=='common'&&tier===ASCENSION_CAPS[source.rarity].length-1&&Number.isInteger(options.awakenings?.[hero.id])?Math.max(0,Math.min(2,options.awakenings[hero.id])):0;if(rank)hero.awakening=rank;Object.assign(hero,awakenedStats(statsAtLevel(source,hero.level),rank,tier));hero.maxHp=hero.hp;}
  }
  const meanHp=state.heroes.reduce((n,u)=>n+u.hp,0)/5,meanAtk=state.heroes.reduce((n,u)=>n+u.atk,0)/5;
  state.enemies=stage.enemyIds.map((id,i)=>{
    if(!byId.has(id))throw new Error(`Missing enemy ${id}`);
    const enemy=makeUnit(byId.get(id),'enemy',i);enemy.hp=enemy.maxHp=Math.round(meanHp*stage.hp*(i===1?1.15:1));enemy.atk=Math.round(meanAtk*stage.atk);enemy.def=Math.round(state.heroes.reduce((n,u)=>n+u.def,0)/5*.75);enemy.lanes=enemyLanes(i,stage.enemyIds.length);enemy.countdown=stage.countdown+(i%2);enemy.baseCountdown=stage.countdown+(i%2);return enemy;
  });
  // Authored campaign strength does not grow when the player's heroes level up.
  if(options.progression||!['ashen-gate','frozen-pass','veil-sanctum'].includes(stage.id)){const stats=stage.stats;for(const [i,enemy]of state.enemies.entries()){enemy.hp=enemy.maxHp=Math.round(stats[0]*(i===1?(stage.bossHp||1.15):['dungeon','event'].includes(stage.mode)?.65:1));enemy.atk=Math.round(stats[1]*(['dungeon','event'].includes(stage.mode)&&i!==1?.75:1));enemy.def=stats[2];}}
  encounterAppearance(state);
  state.board=freshBoard(state);message(state,`${stage.name} · Match runes to awaken your warband.`);
  if(stage.opening){
    for(const [i,enemy] of state.enemies.entries()){
      if(stage.opening.hpMultipliers){enemy.hp=enemy.maxHp=Math.round(stage.stats[0]*stage.opening.hpMultipliers[i]);}
      if(stage.opening.countdowns){enemy.countdown=enemy.baseCountdown=stage.opening.countdowns[i];}
    }
    for(const e of stage.opening.effects||[])applyEffect(state,state.enemies[e.index],state.enemies[e.index],e.id,e.turns);
    if(stage.opening.mana){const {index,amount}=stage.opening.mana;gainMana(state.enemies[index],amount,{flat:true});message(state,`${state.enemies[index].name} begins with ${amount} tile charge.`,'mana',state.enemies[index].uid);}
  }
  if(stage.scenario)state.scenario={id:stage.scenario,triggered:false};
  if(state.progression&&!state.sandbox)for(const hero of state.heroes)if(hero.awakening===2){
    const power={attack:'inc_atk',defense:'inc_def',support:'mana_surge'}[hero.role];
    if(power)applyEffect(state,hero,hero,power,2);
  }
  return state;
}
function effective(unit,stat) {
  let value=unit[stat];if(has(unit,`inc_${stat}`))value*=1.25;if(has(unit,`dec_${stat}`))value*=.75;return value;
}
function revive(state,target) {
  if(target.hp>0)return;
  let ratio=0;
  if(has(target,'revive_on_death')&&!target.reviveUsed){ratio=.3;target.reviveUsed=true;delete target.effects.revive_on_death;}
  else if(target.passive?.kind==='revive_once'&&!target.passiveReviveUsed){ratio=target.passive.value||.35;target.passiveReviveUsed=true;}
  if(ratio){target.hp=Math.max(1,Math.floor(target.maxHp*ratio));message(state,`${target.name} rises with ${target.hp} HP.`,'heal',target.uid);}
  else {target.hp=0;target.mana=0;message(state,`${target.name} has fallen.`,'damage',target.uid);}
}
function heal(state,target,amount,label='Healing') {
  if(target.hp<=0)return;const actual=Math.min(target.maxHp-target.hp,Math.max(0,Math.round(amount)));target.hp+=actual;if(actual)message(state,`${target.name}: +${actual} HP · ${label}`,'heal',target.uid);
}
function hit(state,attacker,target,power,{color=attacker?.color,pierce=false,counter=true,label='Rune strike',crit=false,fixed=false}={}) {
  if(target.hp<=0)return;
  let amount=fixed?power:power*advantage(color,target.color)*500/(500+effective(target,'def')*(has(target,`vulnerable_${color}`)?.75:1)*(pierce?.75:1));
  if(!fixed){if(has(target,'strengthen'))amount*=.85;if(has(target,'weaken'))amount*=1.15;}
  amount=Math.max(1,Math.round(amount*(crit?1.5:1)));
  const absorbed=Math.min(target.shield,amount);target.shield-=absorbed;amount-=absorbed;
  if(absorbed)message(state,`${target.name}: shield absorbs ${absorbed}.`,'shield',target.uid);
  if(!target.shield)delete target.effects.shield;
  if(amount){target.hp=Math.max(0,target.hp-amount);message(state,`${target.name}: −${amount} · ${label}${crit?' · CRITICAL':''}${advantage(color,target.color)>1?' · STRONG':advantage(color,target.color)<1?' · WEAK':''}`,'damage',target.uid);revive(state,target);}
  if(counter&&attacker?.hp>0&&target.hp>0&&has(target,'counterattack'))hit(state,target,attacker,effective(target,'atk')*.5,{counter:false,label:'Counterattack'});
}
function removeEffect(unit,id){delete unit.effects[id];if(id==='shield')unit.shield=0;}
function applyEffect(state,source,target,id,duration) {
  if(target.hp<=0||!EFFECTS[id]?.timed)return;
  const buff=BUFFS.has(id),immune=target.passive?.immune?.includes(id);
  if(immune||(buff&&has(target,'block_buffs')&&target.passive?.kind!=='unblockable_buffs')||(!buff&&has(target,'block_debuffs'))){message(state,`${target.name}: ${effectName(id)} blocked${immune?' by passive immunity':''}.`,'blocked',target.uid);return;}
  const previous=has(target,id),opposite=OPPOSITES[id];if(opposite&&has(target,opposite)){removeEffect(target,opposite);message(state,`${target.name}: ${effectName(opposite)} replaced by ${effectName(id)}.`,'neutral',target.uid);}
  target.effects[id]={turns:Math.max(1,Math.min(3,duration||1)),source:source.uid,appliedMove:state.moves};
  if(id==='shield')target.shield=Math.round(target.maxHp*.2*(target.passive?.kind==='shield_boost'?1+(target.passive.value||.5):1));
  message(state,`${target.name}: ${effectName(id)}${previous?' refreshed':''} · ${target.effects[id].turns} board move${target.effects[id].turns===1?'':'s'}`,buff?'buff':'debuff',target.uid);
}
function startTurn(state,unit) {
  if(unit.hp<=0)return;
  if(has(unit,'heal'))heal(state,unit,unit.maxHp*.1,'Regeneration');
  if(unit.passive?.kind==='regen')heal(state,unit,unit.maxHp*(unit.passive.value||.05),unit.passive.name);
  for(const id of DOTS)if(unit.hp>0&&has(unit,id)){const amount=Math.max(1,Math.round(unit.maxHp*EFFECTS[id].value));unit.hp=Math.max(0,unit.hp-amount);message(state,`${unit.name}: −${amount} · ${effectName(id)}`,'damage',unit.uid);revive(state,unit);}
}
function periodicPassives(state,frames){
 for(const actor of [...state.heroes,...state.enemies]){
  if(finish(state))break;
  const passive=actor.passive;
  if(actor.hp<=0||passive?.kind!=='periodic_max_hp_strike'||state.moves%passive.interval!==0)continue;
  const foes=actor.side==='hero'?state.enemies:state.heroes,targets=living(foes);
  if(!targets.length)break;
  const target=targets[Math.floor(roll(state)*targets.length)];
  message(state,`${actor.name}: ${passive.name} · turn ${state.moves}`,'skill',actor.uid);
  hit(state,actor,target,target.maxHp*passive.value,{fixed:true,color:null,label:passive.name});
  finish(state);frame(state,frames,'passive',{actor:actor.uid,target:target.uid,name:passive.name});
 }
}
function endTurn(state,unit) {
  for(const [id,effect]of Object.entries(unit.effects)){if(effect.appliedMove>=state.moves)continue;if(--effect.turns<=0){removeEffect(unit,id);message(state,`${unit.name}: ${effectName(id)} expired.`,'neutral',unit.uid);}}
}
function finish(state) {
  if(state.phase!=='playing')return true;
  if(!living(state.enemies).length){state.phase='victory';message(state,'VICTORY · The runes fall silent.','victory');}
  else if(!living(state.heroes).length){state.phase='defeat';message(state,'DEFEAT · Your warband will rise again.','damage');}
  return state.phase!=='playing';
}
function protectedTarget(foes,selected){return living(foes).filter(u=>has(u,'guard')).sort((a,b)=>b.effects.guard.appliedMove-a.effects.guard.appliedMove)[0]||selected;}
function resolveSkill(state,actor,selectedTarget,level) {
  const own=actor.side==='hero'?state.heroes:state.enemies,foes=actor.side==='hero'?state.enemies:state.heroes;
  const spec=manaLevels(actor).find(l=>l.level===level);if(!spec)return;
  const ally=selectedTarget?.side===actor.side?selectedTarget:actor;
  const intended=selectedTarget&&selectedTarget.side!==actor.side?selectedTarget:living(foes).sort((a,b)=>a.hp-b.hp)[0];
  const enemy=spec.aoe?intended:protectedTarget(foes,intended);
  if(enemy&&intended&&enemy.uid!==intended.uid)message(state,`${enemy.name}: Taunt redirects ${actor.name}'s Special from ${intended.name}.`,'buff',enemy.uid);
  message(state,`${actor.name} invokes ${actor.special.name}${actor.special.charging?' · Charge '+level:''}.`,'skill',actor.uid);
  const recipients=scope=>scope==='self'?[actor]:scope==='ally'?[ally]:scope==='allies'?living(own):scope==='other_allies'?living(own).filter(u=>u.uid!==actor.uid):scope==='enemies'?living(foes):enemy?[enemy]:[];
  for(const step of specialPlan(spec)){
    const effect=step.effect;
    if(step.kind==='cleanse'||step.kind==='dispel')for(const target of recipients(effect.scope)){
      const eligible=step.kind==='cleanse'?DEBUFFS:BUFFS,removed=Object.keys(target.effects).filter(id=>eligible.has(id));
      for(const id of removed)removeEffect(target,id);
      if(removed.length)message(state,`${target.name}: ${step.kind==='cleanse'?'cleansed':'dispelled'} ${removed.map(effectName).join(', ')}.`,step.kind==='cleanse'?'heal':'dispel',target.uid);
    }
    else if(step.kind==='buff'||step.kind==='debuff')for(const target of recipients(effect.scope))applyEffect(state,actor,target,effect.id,effect.turns);
    else if(step.kind==='heal')for(const target of recipients(step.scope))heal(state,target,target.maxHp*step.amount,actor.special.name);
    else if(step.kind==='mana')for(const target of recipients(effect.scope)){
      const gained=gainMana(target,1.5,{flat:true});message(state,`${target.name}: ${gained?'+'+chargeText(gained)+' tile charge':'Mana Gift blocked or already full'}.`,'mana',target.uid);
    }
    else if(step.kind==='damage')for(const target of step.aoe?living(foes):enemy?[enemy]:[]){
      if(actor.hp<=0)break;
      hit(state,actor,target,effective(actor,'atk')*step.amount,{pierce:step.pierce,label:actor.special.name});
    }
  }
}
export function skillDescription(unit,effects={},level=manaLevels(unit).length) {
  const spec=manaLevels(unit).find(l=>l.level===level);if(!spec)return {name:unit.ability_name||'Special',target:'enemy',aoe:false,text:'No Special configured.',effects:[],steps:[],targeting:''};
  const steps=describeSpecial(spec,effects),parts=[];
  if(spec.healing)parts.push(`Restore ${Math.round(spec.healing*100)}% max HP to ${spec.healScope==='allies'?'all living allies':spec.healScope==='self'?'the caster':'one living ally'}.`);
  if(spec.damage)parts.push(`Deal ${Math.round(spec.damage*100)}% ATK damage to ${spec.aoe?'all living enemies':enemyTargetLabel(spec).toLowerCase()}${spec.pierce?', ignoring 25% of DEF':''}.`);
  if(!parts.length)parts.push('Empower your warband with the effects below.');
  return {name:unit.special.name,target:spec.target,aoe:spec.aoe,level:spec.level,tiles:spec.tiles,text:parts.join(' '),targeting:specialTargeting(spec),steps,effects:steps.filter(s=>s.id)};
}
// A one-time, end-of-action phase. It never interrupts a cascade or steals a Special turn.
function encounterPhase(state,frames){
  const rule=SCENARIOS[state.scenario?.id];
  if(state.phase!=='playing'||!rule||state.scenario.triggered)return;
  const boss=state.enemies[1];if(boss.hp<=0)return;
  const ready=rule.trigger==='half_health'?boss.hp<=boss.maxHp*rule.threshold:state.enemies.every((e,i)=>i===1||e.hp<=0);
  if(!ready)return;
  state.scenario.triggered=true;
  message(state,`${boss.name}: ${rule.name} · ${rule.notice}`,'skill',boss.uid);
  for(const id of rule.effects)applyEffect(state,boss,boss,id,rule.turns);
  boss.countdown=rule.countdownMinimum?Math.max(boss.countdown,rule.countdown):rule.countdown;
  frame(state,frames,'mechanic',{actor:boss.uid,target:boss.uid,name:rule.name});
}

function enemyPhase(state,frames) {
  for(const enemy of state.enemies){
    if(finish(state))break;
    if(enemy.hp<=0)continue;
    enemy.countdown--;
    if(enemy.countdown>0)continue;
    enemy.actions++;gainMana(enemy,4);
    const targets=living(state.heroes);
    const target=protectedTarget(state.heroes,targets[Math.floor(roll(state)*targets.length)]);if(!target)break;
    if(enemy.mana>=enemy.manaMax){enemy.mana=0;resolveSkill(state,enemy,null,manaLevels(enemy).length);}
    else hit(state,enemy,target,effective(enemy,'atk'),{label:'Enemy attack',crit:roll(state)<.08});
    enemy.countdown=Math.max(1,enemy.baseCountdown);
    finish(state);frame(state,frames,'enemy',{actor:enemy.uid,target:target.uid});
  }
  for(const unit of [...state.heroes,...state.enemies])if(unit.hp>0)endTurn(state,unit);
  finish(state);
}
function expandSpecials(state,indices,prismColor=null) {
  const clear=new Set(indices),seen=new Set();let changed=true;
  while(changed){changed=false;for(const index of [...clear]){
    const t=state.board[index];if(!t?.special||seen.has(index))continue;seen.add(index);
    const extra=[];
    if(t.special==='prism'){const color=prismColor||t.color;state.board.forEach((cell,i)=>{if(cell?.color===color)extra.push(i);});}
    else for(let r=Math.max(0,Math.floor(index/COLS)-1);r<=Math.min(ROWS-1,Math.floor(index/COLS)+1);r++)for(let c=Math.max(0,index%COLS-1);c<=Math.min(COLS-1,index%COLS+1);c++)extra.push(r*COLS+c);
    for(const i of extra)if(!clear.has(i)){clear.add(i);changed=true;}
  }}
  return clear;
}
function resolveBoard(state,frames,initialGroups,preferred,activation=null) {
  let groups=initialGroups,combo=0;
  do {
    combo++;state.cascades++;
    const created=[];
    if(!activation)for(const group of groups)if(group.length>=4){const index=group.includes(preferred)?preferred:group[Math.floor(group.length/2)];if(!state.board[index].special)created.push({index,color:state.board[index].color,special:group.length>=5?'prism':'blast'});}
    const clear=expandSpecials(state,activation?.indices||groups.flat(),activation?.color);
    for(const item of created)clear.delete(item.index);
    const shots=[];
    for(const index of clear){
      const t=state.board[index];if(!t)continue;
      const attackers=living(state.heroes).filter(u=>u.color===t.color);
      const target=living(state.enemies).find(e=>e.lanes.includes(index%COLS));
      if(attackers.length){
        for(const hero of attackers)gainMana(hero,target?1:2);
        if(target){const power=attackers.reduce((n,u)=>n+effective(u,'atk')*(u.role==='attack'?1.1:1)*(has(u,'tile_boost')?1.35:1),0)*.24*(1+(combo-1)*.2);hit(state,null,target,power,{color:t.color,counter:false,label:`${ELEMENTS[t.color].name} rune${combo>1?` · ${combo}× combo`:''}`});}
        else message(state,`${ELEMENTS[t.color].name}: empty lane · double mana.`,'mana');
      }
      shots.push({index,color:t.color,target:target?.uid||null,ghost:!target});
    }
    message(state,`${clear.size} runes · ${combo}× cascade${created.length?` · ${created.map(c=>c.special==='prism'?'Prismatic Rune':'Blast Rune').join(', ')} forged`:''}.`,'combo');
    frame(state,frames,'match',{cleared:[...clear],created,shots,combo});
    for(const index of clear)state.board[index]=null;
    for(const item of created)state.board[item.index]={...tile(state,item.color),special:item.special};
    for(let col=0;col<COLS;col++){
      const kept=[];for(let r=ROWS-1;r>=0;r--)if(state.board[r*COLS+col])kept.push(state.board[r*COLS+col]);
      for(let r=ROWS-1;r>=0;r--)state.board[r*COLS+col]=kept[ROWS-1-r]||tile(state);
    }
    frame(state,frames,'fall',{combo});
    if(finish(state))break;
    activation=null;groups=findMatches(state.board);
  }while(groups.length&&combo<60);
  if(findMatches(state.board).length||!validMoves(state.board).length){state.board=freshBoard(state);message(state,'The runes realign · a fresh, playable board.','combo');frame(state,frames,'shuffle');}
}
export function swap(state,a,b) {
  if(state.phase!=='playing')return {state,frames:[],error:'This encounter is finished.'};
  if(!neighbors(a,b))return {state,frames:[],error:'Swap two neighboring runes.'};
  const next=clone(state),frames=[];
  [next.board[a],next.board[b]]=[next.board[b],next.board[a]];
  const specialIndex=next.board[a].special?a:next.board[b].special?b:null;
  const groups=findMatches(next.board);
  if(specialIndex===null&&!groups.some(g=>g.includes(a)||g.includes(b)))return {state,frames:[],error:'That swap makes no match. No turn was used.'};
  next.moves++;const upkeepEvent=next.eventId;for(const unit of [...next.heroes,...next.enemies])startTurn(next,unit);if(next.eventId!==upkeepEvent)frame(next,frames,'upkeep');
  if(!finish(next))periodicPassives(next,frames);
  if(finish(next)){frame(next,frames,'result');return {state:next,frames};}
  frame(next,frames,'swap',{a,b});
  const activation=specialIndex===null?null:{indices:[specialIndex],color:next.board[specialIndex===a?b:a].color};
  resolveBoard(next,frames,groups,b,activation);
  if(next.phase==='playing')enemyPhase(next,frames);
  encounterPhase(next,frames);frame(next,frames,'settled');return {state:next,frames};
}
export function activate(state,index) {
  if(!Number.isInteger(index)||index<0||index>=SIZE||!state.board[index]?.special)return {state,frames:[],error:'Select a special rune.'};
  if(state.phase!=='playing')return {state,frames:[],error:'This encounter is finished.'};
  const next=clone(state),frames=[];next.moves++;const upkeepEvent=next.eventId;for(const unit of [...next.heroes,...next.enemies])startTurn(next,unit);if(next.eventId!==upkeepEvent)frame(next,frames,'upkeep');
  if(!finish(next))periodicPassives(next,frames);
  if(!finish(next)){resolveBoard(next,frames,[],index,{indices:[index],color:next.board[index].color});if(next.phase==='playing')enemyPhase(next,frames);}
  encounterPhase(next,frames);frame(next,frames,'settled');return {state:next,frames};
}
export function cast(state,heroUid,targetUid,level=null) {
  if(state.phase!=='playing')return {state,frames:[],error:'This encounter is finished.'};
  const actor=state.heroes.find(u=>u.uid===heroUid);
  if(!actor||actor.hp<=0)return {state,frames:[],error:'Choose a living champion.'};
  const requested=level??readyLevel(actor),spec=manaLevels(actor).find(l=>l.level===requested);
  if(!spec||actor.mana<spec.tiles)return {state,frames:[],error:'This Special needs more matching tiles.'};
  const side=spec.target==='enemy'?state.enemies:state.heroes;
  const target=spec.target==='self'?actor:side.find(u=>u.uid===targetUid&&u.hp>0);
  if(!target)return {state,frames:[],error:`Choose a living ${spec.target==='enemy'?'enemy':'ally'}.`};
  const next=clone(state),frames=[],nextActor=next.heroes.find(u=>u.uid===heroUid);nextActor.mana=0;
  resolveSkill(next,nextActor,[...next.heroes,...next.enemies].find(u=>u.uid===target.uid),requested);finish(next);
  frame(next,frames,'skill',{actor:heroUid,target:spec.target==='enemy'&&!spec.aoe?protectedTarget(state.enemies,target).uid:target.uid,level:requested});encounterPhase(next,frames);return {state:next,frames};
}
export function validateSave(value,roster) {
  const integer=(n,min=0)=>Number.isSafeInteger(n)&&n>=min;
  if(!value||value.version!==VERSION||!getEncounter(value.stageId)||!integer(value.rng,1)||value.rng>0xffffffff||!integer(value.nextTile,1)||!integer(value.moves)||!integer(value.cascades)||!integer(value.eventId)||typeof value.id!=='string'||value.id.length>120)return false;
  if(!Array.isArray(value.log)||value.log.length>80||value.log.some(l=>!l||typeof l.text!=='string'||typeof l.tone!=='string'||!integer(l.move)))return false;
  if(!['playing','victory','defeat'].includes(value.phase)||!Array.isArray(value.board)||value.board.length!==SIZE||value.board.some(t=>!t||!COLORS.includes(t.color)||!integer(t.id,1)||t.id>=value.nextTile||!([null,'blast','prism'].includes(t.special))))return false;
  if(value.eventWindow!==undefined&&(getEncounter(value.stageId)?.mode!=='event'||typeof value.eventWindow!=='string'||!value.eventWindow.startsWith(getEncounter(value.stageId).eventId+':')||!/^\w+:\d{4}-(0[1-9]|1[0-2])$/.test(value.eventWindow)))return false;
  if(!validScenario(value,getEncounter(value.stageId)))return false;
  const ids=new Set(roster.map(c=>c.id));
  if(!Array.isArray(value.heroes)||value.heroes.length!==5||!Array.isArray(value.enemies)||value.enemies.length!==getEncounter(value.stageId).enemyIds.length)return false;
  if(value.heroes?.some(u=>!u||u.awakening!==undefined&&(!integer(u.awakening,1)||u.awakening>2||u.level<normalLevelCap(roster.find(c=>c.id===u.id)||{rarity:'common'})+(u.awakening-1)*5)))return false;
  if(value.progression!==undefined&&(value.progression!==true||typeof value.sandbox!=='boolean'||value.heroes.some(u=>!u||!ids.has(u.id)||!integer(u.level,1)||u.level>levelCap(roster.find(c=>c.id===u.id)))))return false;
  if(new Set(value.board.map(t=>t.id)).size!==SIZE||new Set(value.heroes.map(u=>u.id)).size!==5)return false;
  const units=[...value.heroes,...value.enemies];
  if(units.some(u=>!u||!ids.has(u.id)||!COLORS.includes(u.color)||!u.effects||Array.isArray(u.effects)||typeof u.effects!=='object'||!['attack','defense','support'].includes(u.role)||!Number.isFinite(u.hp)||!Number.isFinite(u.maxHp)||u.maxHp<=0||u.hp<0||u.hp>u.maxHp||!Number.isFinite(u.atk)||u.atk<0||!Number.isFinite(u.def)||u.def<0||!Number.isFinite(u.mana)||u.mana<0||u.mana>u.manaMax||u.manaMax!==manaLevels(roster.find(c=>c.id===u.id)).at(-1)?.tiles||!Number.isFinite(u.shield)||u.shield<0||!integer(u.actions)))return false;
  if(units.some(u=>JSON.stringify(u.special)!==JSON.stringify(roster.find(c=>c.id===u.id).special)))return false;
  if(units.some(u=>Object.entries(u.effects).some(([id,e])=>!BUFFS.has(id)&&!DEBUFFS.has(id)||!e||!integer(e.turns,1)||e.turns>3||!integer(e.appliedMove)||e.appliedMove>value.moves||!units.some(t=>t.uid===e.source))))return false;
  if(value.heroes.some((u,i)=>u.uid!==`hero-${i}`||u.side!=='hero')||value.enemies.some((u,i)=>u.uid!==`enemy-${i}`||u.side!=='enemy'||!integer(u.countdown)||!integer(u.baseCountdown,1)||!Array.isArray(u.lanes)||JSON.stringify(u.lanes)!==JSON.stringify(enemyLanes(i,value.enemies.length))))return false;
  const heroesAlive=living(value.heroes).length>0,enemiesAlive=living(value.enemies).length>0;
  return value.phase==='victory'?!enemiesAlive:value.phase==='defeat'?!heroesAlive&&enemiesAlive:heroesAlive&&enemiesAlive;
}
