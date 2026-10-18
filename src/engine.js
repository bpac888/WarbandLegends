// Pure, deterministic combat. No network, UI, original-game API, or shared saves.
export const VERSION = 1;
export const COLS = 7, ROWS = 5, SIZE = COLS * ROWS;
export const COLORS = ['red', 'green', 'blue', 'yellow', 'purple'];
export const ELEMENTS = {
  red: {name:'Ember',symbol:'✦',beats:'green'}, green:{name:'Verdant',symbol:'❧',beats:'blue'},
  blue:{name:'Frost',symbol:'❄',beats:'red'}, yellow:{name:'Radiant',symbol:'☀',beats:'purple'},
  purple:{name:'Umbral',symbol:'☾',beats:'yellow'},
};
export const STAGES = [
  {id:'ashen-gate',name:'The Ashen Gate',region:'Emberfall',description:'A restless warband guards the broken crossing.',enemyIds:['redknife_tavin','shellback_brukk','rimebow_tessa'],hp:.7,atk:.65,countdown:3},
  {id:'frozen-pass',name:'The Frozen Pass',region:'Frostwake',description:'Break the icebound guard before their shields close.',enemyIds:['berserker_ulf','shieldmaiden_runa','ice_shaman_sigrid'],hp:1,atk:.9,countdown:3},
  {id:'veil-sanctum',name:'The Veil Sanctum',region:'Umbra',description:'The shadow court has been expecting you.',enemyIds:['demon_witchblade','shade_prince','umbral_hierarch'],hp:1.2,atk:.9,countdown:2},
];
const BUFFS = new Set(['inc_atk','inc_def','inc_spd','shield','strengthen','heal','block_debuffs','counterattack','revive_on_death']);
const DEBUFFS = new Set(['dec_atk','dec_def','dec_spd','weaken','block_buffs','taunt','poison','burn']);
const NAMES = {inc_atk:'ATK up',inc_def:'DEF up',inc_spd:'Quickened',shield:'Shield',strengthen:'Strengthen',heal:'Regeneration',block_debuffs:'Debuff ward',counterattack:'Counterattack',revive_on_death:'Death ward',dec_atk:'ATK down',dec_def:'DEF down',dec_spd:'Slowed',weaken:'Weaken',block_buffs:'Buff seal',taunt:'Taunt',poison:'Poison',burn:'Burn',remove_debuffs:'Cleanse',aoe:'All enemies',ignore_def:'Pierce'};
export const effectName = id => NAMES[id] || id;
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
  return {...clone(source),uid:`${side}-${index}`,side,hp:source.hp,maxHp:source.hp,mana:0,manaMax:100,shield:0,effects:{},reviveUsed:false,passiveReviveUsed:false,actions:0};
}
export function createBattle(roster,teamIds,stageId=STAGES[0].id,seed=Date.now()) {
  if(teamIds.length!==5||new Set(teamIds).size!==5)throw new Error('Choose five different champions.');
  const byId=new Map(roster.map(c=>[c.id,c]));if(teamIds.some(id=>!byId.has(id)))throw new Error('Unknown champion.');
  const stage=STAGES.find(s=>s.id===stageId);if(!stage)throw new Error('Unknown encounter.');
  const state={version:VERSION,id:`runes-${seed>>>0}-${stage.id}`,stageId,rng:seed>>>0||1,nextTile:1,eventId:0,moves:0,cascades:0,phase:'playing',log:[],heroes:teamIds.map((id,i)=>makeUnit(byId.get(id),'hero',i)),enemies:[]};
  const meanHp=state.heroes.reduce((n,u)=>n+u.hp,0)/5,meanAtk=state.heroes.reduce((n,u)=>n+u.atk,0)/5;
  state.enemies=stage.enemyIds.map((id,i)=>{
    if(!byId.has(id))throw new Error(`Missing enemy ${id}`);
    const enemy=makeUnit(byId.get(id),'enemy',i);enemy.hp=enemy.maxHp=Math.round(meanHp*stage.hp*(i===1?1.15:1));enemy.atk=Math.round(meanAtk*stage.atk);enemy.def=Math.round(state.heroes.reduce((n,u)=>n+u.def,0)/5*.75);enemy.lanes=i===0?[0,1]:i===1?[2,3,4]:[5,6];enemy.countdown=stage.countdown+(i%2);enemy.baseCountdown=stage.countdown+(i%2);return enemy;
  });
  state.board=freshBoard(state);message(state,`${stage.name} · Match runes to awaken your warband.`);return state;
}
function effective(unit,stat) {
  let value=unit[stat];if(has(unit,`inc_${stat}`))value*=stat==='spd'?1.2:1.25;if(has(unit,`dec_${stat}`))value*=stat==='spd'?.85:.75;return value;
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
function hit(state,attacker,target,power,{color=attacker?.color,pierce=false,counter=true,label='Rune strike',crit=false}={}) {
  if(target.hp<=0)return;
  let amount=power*advantage(color,target.color)*130/(130+effective(target,'def')*(pierce?.375:.5));
  if(has(target,'strengthen'))amount*=.85;if(has(target,'weaken'))amount*=1.15;
  amount=Math.max(1,Math.round(amount*(crit?1.5:1)));
  const absorbed=Math.min(target.shield,amount);target.shield-=absorbed;amount-=absorbed;
  if(absorbed)message(state,`${target.name}: shield absorbs ${absorbed}.`,'shield',target.uid);
  if(!target.shield)delete target.effects.shield;
  if(amount){target.hp=Math.max(0,target.hp-amount);message(state,`${target.name}: −${amount} · ${label}${crit?' · CRITICAL':''}${advantage(color,target.color)>1?' · STRONG':advantage(color,target.color)<1?' · WEAK':''}`,'damage',target.uid);revive(state,target);}
  if(counter&&attacker?.hp>0&&target.hp>0&&has(target,'counterattack'))hit(state,target,attacker,effective(target,'atk')*.5,{counter:false,label:'Counterattack'});
}
function applyEffect(state,source,target,id,duration) {
  if(target.hp<=0)return;
  const buff=BUFFS.has(id);if(!buff&&!DEBUFFS.has(id))return;
  const immune=target.passive?.immune?.includes(id);
  if(immune||(buff&&has(target,'block_buffs')&&target.passive?.kind!=='unblockable_buffs')||(!buff&&has(target,'block_debuffs'))){message(state,`${target.name}: ${effectName(id)} blocked${immune?' by passive immunity':''}.`,'blocked',target.uid);return;}
  target.effects[id]={turns:Math.max(1,Math.min(3,duration||1)),source:source.uid,appliedMove:state.moves};
  if(id==='shield')target.shield=Math.max(target.shield,Math.round(target.maxHp*.2*(target.passive?.kind==='shield_boost'?1+(target.passive.value||.5):1)));
  message(state,`${target.name}: ${effectName(id)} · ${target.effects[id].turns} turn${duration===1?'':'s'}` ,buff?'buff':'debuff',target.uid);
}
function startTurn(state,unit) {
  if(unit.hp<=0)return;
  if(has(unit,'heal'))heal(state,unit,unit.maxHp*.1,'Regeneration');
  if(unit.passive?.kind==='regen')heal(state,unit,unit.maxHp*(unit.passive.value||.05),unit.passive.name);
  for(const id of ['poison','burn'])if(unit.hp>0&&has(unit,id)){const amount=Math.max(1,Math.round(unit.maxHp*.05));unit.hp=Math.max(0,unit.hp-amount);message(state,`${unit.name}: −${amount} · ${effectName(id)}`,'damage',unit.uid);revive(state,unit);}
}
function endTurn(state,unit) {
  for(const [id,effect]of Object.entries(unit.effects)){if(effect.appliedMove>=state.moves)continue;if(--effect.turns<=0){delete unit.effects[id];if(id==='shield')unit.shield=0;message(state,`${unit.name}: ${effectName(id)} expired.`,'neutral',unit.uid);}}
}
function finish(state) {
  if(state.phase!=='playing')return true;
  if(!living(state.enemies).length){state.phase='victory';message(state,'VICTORY · The runes fall silent.','victory');}
  else if(!living(state.heroes).length){state.phase='defeat';message(state,'DEFEAT · Your warband will rise again.','damage');}
  return state.phase!=='playing';
}
function forcedTarget(state,actor,foes) {const id=actor.effects.taunt?.source;return living(foes).find(u=>u.uid===id)||null;}
function resolveSkill(state,actor,selectedTarget) {
  const own=actor.side==='hero'?state.heroes:state.enemies,foes=actor.side==='hero'?state.enemies:state.heroes;
  const entries=actor.kit?.a3||[];const ids=entries.map(e=>e[0]);
  const support=actor.role==='support';
  const target=selectedTarget||living(support?own:foes).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
  message(state,`${actor.name} invokes ${actor.ability_name}.`,'skill',actor.uid);
  if(support&&target)heal(state,target,effective(actor,'atk')*.65+target.maxHp*.12,actor.ability_name);
  if(ids.includes('remove_debuffs'))for(const ally of living(own)){
    const removed=Object.keys(ally.effects).filter(e=>DEBUFFS.has(e));for(const id of removed)delete ally.effects[id];
    if(removed.length)message(state,`${ally.name}: cleansed ${removed.map(effectName).join(', ')}.`,'heal',ally.uid);
  }
  for(const [id,duration]of entries)if(BUFFS.has(id)){
    const teamBuff=support||(actor.role==='defense'&&id==='shield'&&['legendary','mythical'].includes(actor.rarity));
    for(const ally of teamBuff?living(own):[actor])applyEffect(state,actor,ally,id,duration);
  }
  const attackTarget=support?living(foes).sort((a,b)=>a.hp-b.hp)[0]:target;
  const targets=ids.includes('aoe')?living(foes):attackTarget?[attackTarget]:[];
  for(const enemy of targets){
    if(actor.hp<=0)break;
    for(const [id,duration]of entries)if(DEBUFFS.has(id))applyEffect(state,actor,enemy,id,duration);
    hit(state,actor,enemy,effective(actor,'atk')*(support?.45:2.4),{pierce:ids.includes('ignore_def'),label:actor.ability_name});
  }
}
export function skillDescription(unit,effects={}) {
  const support=unit.role==='support',entries=unit.kit?.a3||[],aoe=entries.some(e=>e[0]==='aoe');
  const base=support?`Heal one living ally for 65% ATK + 12% of their max HP, then strike ${aoe?'all living enemies':'the weakest enemy'} at 45% ATK.`:`Strike ${aoe?'all living enemies':'one enemy'} at 240% ATK before defense and elemental modifiers.`;
  return {name:unit.ability_name,target:support?'ally':'enemy',aoe,text:base,effects:entries.map(([id,duration])=>({id,name:effectName(id),duration,description:id==='counterattack'?'Counter a direct attack with 50% ATK. Rune strikes do not trigger counters.':id==='taunt'?'Enemies use basic attacks against the living caster. Champions cannot cast signatures while taunted; rune attacks still follow columns.':id==='revive_on_death'?'Revive once at 30% max HP if defeated while this ward is active.':id==='inc_spd'?'Mana gained from runes increases 20%; enemy attack countdowns recover faster.':id==='dec_spd'?'Mana gained from runes decreases 15%; enemy attack countdowns recover more slowly.':effects[id]?.desc||'',scope:id==='remove_debuffs'?'All living allies':BUFFS.has(id)?(support||(unit.role==='defense'&&id==='shield'&&['legendary','mythical'].includes(unit.rarity))?'All living allies':'Self'):aoe?'All enemies':'One enemy'}))};
}
function enemyPhase(state,frames) {
  for(const enemy of state.enemies){
    if(finish(state))break;
    if(enemy.hp<=0)continue;
    enemy.countdown--;
    if(enemy.countdown>0)continue;
    startTurn(state,enemy);if(enemy.hp<=0){frame(state,frames,'upkeep');continue;}
    enemy.actions++;
    const forced=forcedTarget(state,enemy,state.heroes),targets=living(state.heroes);
    const target=forced||targets[Math.floor(roll(state)*targets.length)];if(!target)break;
    if(enemy.actions%3===0&&!forced)resolveSkill(state,enemy);
    else hit(state,enemy,target,effective(enemy,'atk'),{label:'Enemy attack',crit:roll(state)<.08});
    enemy.countdown=Math.max(1,enemy.baseCountdown+(has(enemy,'dec_spd')?1:0)-(has(enemy,'inc_spd')?1:0));
    endTurn(state,enemy);finish(state);frame(state,frames,'enemy',{actor:enemy.uid,target:target.uid});
  }
  for(const hero of state.heroes)if(hero.hp>0)endTurn(state,hero);
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
        for(const hero of attackers){const rate=(has(hero,'inc_spd')?1.2:1)*(has(hero,'dec_spd')?.85:1);hero.mana=Math.min(hero.manaMax,hero.mana+Math.round(10*(target?1:2)*rate));}
        if(target){const power=attackers.reduce((n,u)=>n+effective(u,'atk')*(u.role==='attack'?1.1:1),0)*.24*(1+(combo-1)*.2);hit(state,null,target,power,{color:t.color,counter:false,label:`${ELEMENTS[t.color].name} rune${combo>1?` · ${combo}× combo`:''}`});}
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
  next.moves++;for(const hero of next.heroes)startTurn(next,hero);
  if(finish(next)){frame(next,frames,'result');return {state:next,frames};}
  frame(next,frames,'swap',{a,b});
  const activation=specialIndex===null?null:{indices:[specialIndex],color:next.board[specialIndex===a?b:a].color};
  resolveBoard(next,frames,groups,b,activation);
  if(next.phase==='playing')enemyPhase(next,frames);
  frame(next,frames,'settled');return {state:next,frames};
}
export function activate(state,index) {
  if(!Number.isInteger(index)||index<0||index>=SIZE||!state.board[index]?.special)return {state,frames:[],error:'Select a special rune.'};
  if(state.phase!=='playing')return {state,frames:[],error:'This encounter is finished.'};
  const next=clone(state),frames=[];next.moves++;for(const hero of next.heroes)startTurn(next,hero);
  if(!finish(next)){resolveBoard(next,frames,[],index,{indices:[index],color:next.board[index].color});if(next.phase==='playing')enemyPhase(next,frames);}
  frame(next,frames,'settled');return {state:next,frames};
}
export function cast(state,heroUid,targetUid) {
  if(state.phase!=='playing')return {state,frames:[],error:'This encounter is finished.'};
  const actor=state.heroes.find(u=>u.uid===heroUid);
  if(!actor||actor.hp<=0||actor.mana<actor.manaMax)return {state,frames:[],error:'This champion needs a full mana bar.'};
  if(forcedTarget(state,actor,state.enemies))return {state,frames:[],error:'Taunt prevents this champion from casting until it expires.'};
  const side=actor.role==='support'?state.heroes:state.enemies;
  const target=side.find(u=>u.uid===targetUid&&u.hp>0);if(!target)return {state,frames:[],error:`Choose a living ${actor.role==='support'?'ally':'enemy'}.`};
  const next=clone(state),frames=[];const nextActor=next.heroes.find(u=>u.uid===heroUid);nextActor.mana=0;
  resolveSkill(next,nextActor,[...next.heroes,...next.enemies].find(u=>u.uid===targetUid));finish(next);
  frame(next,frames,'skill',{actor:heroUid,target:targetUid});return {state:next,frames};
}
export function validateSave(value,roster) {
  const integer=(n,min=0)=>Number.isSafeInteger(n)&&n>=min;
  if(!value||value.version!==VERSION||!STAGES.some(s=>s.id===value.stageId)||!integer(value.rng,1)||value.rng>0xffffffff||!integer(value.nextTile,1)||!integer(value.moves)||!integer(value.cascades)||!integer(value.eventId)||typeof value.id!=='string'||value.id.length>120)return false;
  if(!Array.isArray(value.log)||value.log.length>80||value.log.some(l=>!l||typeof l.text!=='string'||typeof l.tone!=='string'||!integer(l.move)))return false;
  if(!['playing','victory','defeat'].includes(value.phase)||!Array.isArray(value.board)||value.board.length!==SIZE||value.board.some(t=>!t||!COLORS.includes(t.color)||!integer(t.id,1)||t.id>=value.nextTile||!([null,'blast','prism'].includes(t.special))))return false;
  const ids=new Set(roster.map(c=>c.id));
  if(!Array.isArray(value.heroes)||value.heroes.length!==5||!Array.isArray(value.enemies)||value.enemies.length!==3)return false;
  if(new Set(value.board.map(t=>t.id)).size!==SIZE||new Set(value.heroes.map(u=>u.id)).size!==5)return false;
  const units=[...value.heroes,...value.enemies];
  if(units.some(u=>!u||!ids.has(u.id)||!COLORS.includes(u.color)||!u.effects||Array.isArray(u.effects)||typeof u.effects!=='object'||!['attack','defense','support'].includes(u.role)||!Number.isFinite(u.hp)||!Number.isFinite(u.maxHp)||u.maxHp<=0||u.hp<0||u.hp>u.maxHp||!Number.isFinite(u.atk)||u.atk<0||!Number.isFinite(u.def)||u.def<0||!Number.isFinite(u.mana)||u.mana<0||u.mana>100||u.manaMax!==100||!Number.isFinite(u.shield)||u.shield<0||!integer(u.actions)))return false;
  if(units.some(u=>Object.entries(u.effects).some(([id,e])=>!BUFFS.has(id)&&!DEBUFFS.has(id)||!e||!integer(e.turns,1)||e.turns>3||!integer(e.appliedMove)||e.appliedMove>value.moves||!units.some(t=>t.uid===e.source))))return false;
  if(value.heroes.some((u,i)=>u.uid!==`hero-${i}`||u.side!=='hero')||value.enemies.some((u,i)=>u.uid!==`enemy-${i}`||u.side!=='enemy'||!integer(u.countdown)||!integer(u.baseCountdown,1)||!Array.isArray(u.lanes)||JSON.stringify(u.lanes)!==JSON.stringify(i===0?[0,1]:i===1?[2,3,4]:[5,6])))return false;
  const heroesAlive=living(value.heroes).length>0,enemiesAlive=living(value.enemies).length>0;
  return value.phase==='victory'?!enemiesAlive:value.phase==='defeat'?!heroesAlive&&enemiesAlive:heroesAlive&&enemiesAlive;
}
