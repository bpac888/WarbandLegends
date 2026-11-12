// Weekly-only combat rules. Engine callbacks preserve normal targeting, effects and RNG.
export const VENOM_REGENT_SPECIAL={name:'Royal Venom',charging:false,levels:[{level:1,tiles:10,speed:'average',target:'self',damage:0,healing:0,aoe:false,pierce:false,effects:[{id:'inc_atk',turns:2,scope:'self'},{id:'inc_def',turns:2,scope:'self'},{id:'poison',turns:2,scope:'enemies'}]}]};
export function weeklyUnitSpecial(state,unit,source){return state.weekly?.rule==='regent'&&state.weekly.round===3&&unit.uid==='enemy-1'?VENOM_REGENT_SPECIAL:source.special;}
const allGoals=w=>(w.round===1?['blast']:w.round===2?['prism']:['blast','prism']).every(k=>w.forged[k]&&w.activated[k]);
const bossActive=w=>w&&w.round===3;
export function initializeWeekly(state,stage,{log,applyEffect}){
 if(stage.mode!=='weekly')return;
 state.weekly={rule:stage.weeklyRule,round:stage.round,forged:{blast:false,prism:false},activated:{blast:false,prism:false},copy:null,twinsBroken:false,stored:[Array(5).fill(0),Array(5).fill(0)],released:[false,false],failed:false,lastSpecialMove:-1};
 const w=state.weekly;
 if(w.rule==='runesmith')log(state,stage.description,'neutral');
 if(w.rule==='volley'){
  state.rng=42+stage.round;for(const h of state.heroes)h.mana=h.manaMax;
  const base=['red','green','blue','yellow','purple'],colors=base.map((_,i)=>base[(i+stage.round-1)%5]);state.board.forEach((t,i)=>{t.color=colors[(i%7+Math.floor(i/7)*2)%5];t.special=null;});
  for(let c=0;c<5;c++)state.board[c].color=colors[0];state.board[2].color=colors[2];state.board[9].color=colors[0];
 }
 if(bossActive(w)&&w.rule==='mirror'){state.enemies[1].name='The Mirror Mage';state.enemies[1].portrait=stage.art;}
 if(bossActive(w)&&w.rule==='twins'){state.enemies[0].name='Dawn Tyrant';state.enemies[2].name='Dusk Tyrant';state.enemies[1].name='The Herald';state.enemies[1].hp=state.enemies[1].maxHp=450;for(const i of [0,2]){state.enemies[i].hp=state.enemies[i].maxHp=1400;state.enemies[i].portrait=stage.art;state.enemies[i].portraitFocus=i===0?'20% center':'80% center';}}
 if(bossActive(w)&&w.rule==='collector'){state.enemies[1].name='The Mana Collector';state.enemies[1].portrait=stage.art;}
 if(bossActive(w)&&w.rule==='collector')for(const i of [0,2]){const e=state.enemies[i];e.name=i===0?'Left Mana Crystal':'Right Mana Crystal';e.hp=e.maxHp=400;e.atk=0;e.passive=null;e.portrait='assets/weekly/mana-crystal.webp';e.countdown=e.baseCountdown=999;}
 if(bossActive(w)&&w.rule==='regent'){const boss=state.enemies[1];boss.name='The Venom Regent';boss.portrait=stage.art;boss.special=structuredClone(VENOM_REGENT_SPECIAL);boss.manaMax=10;boss.mana=10;boss.manaSpeed='average';boss.countdown=boss.baseCountdown=1;applyEffect(state,boss,boss,'shield',3);}
 if(bossActive(w)&&w.rule==='eclipse'){state.enemies[1].name='The Eclipse Beast';state.enemies[1].portrait=stage.art;}
}
export function weeklyRunes(state,created=[],activated=null){const w=state.weekly;if(w?.rule!=='runesmith')return;for(const c of created)w.forged[c.special]=true;if(activated)w.activated[activated]=true;}
export function weeklyDamage(state,target,amount,kind){const w=state.weekly;if(!w||target.side!=='enemy'||target.uid!=='enemy-1')return amount;
 if(bossActive(w)&&w.rule==='eclipse'){const solar=Math.floor(state.moves/2)%2===0,rune=kind==='tile';if(solar&&rune||!solar&&kind==='special')amount=Math.max(1,Math.round(amount*.25));}
 if(w.rule==='runesmith'&&!allGoals(w))amount=Math.min(amount,Math.max(0,target.hp-1)+(kind==='periodic'?0:target.shield));
 return amount;
}
export function weeklyCopy(state,actor,level,log){if(state.weekly)state.weekly.lastSpecialMove=state.moves;if(!bossActive(state.weekly)||state.weekly.rule!=='mirror'||state.enemies[1].hp<=0)return;state.weekly.copy={uid:actor.uid,level};log(state,'Copied: '+actor.special.name+' · replaces the stored Special.','skill','enemy-1');}
export function weeklyMirror(state,enemy){const c=bossActive(state.weekly)&&state.weekly.rule==='mirror'&&enemy.uid==='enemy-1'&&state.weekly.copy;if(!c)return null;const hero=state.heroes.find(h=>h.uid===c.uid),spec=hero?.special.levels.find(s=>s.level===c.level);state.weekly.copy=null;return spec?{spec:structuredClone(spec),name:'Mirror · '+hero.special.name}:null;}
export function weeklyRecover(state,{gainMana,log}){const w=state.weekly;if(!bossActive(w)||w.rule!=='collector')return;for(const [slot,i]of [0,2].entries())if(state.enemies[i].hp<=0&&!w.released[slot]){w.released[slot]=true;for(const [j,amount]of w.stored[slot].entries())if(state.heroes[j].hp>0)gainMana(state.heroes[j],amount,{flat:true});w.stored[slot].fill(0);log(state,'Mana crystal shattered · stored charge returned.','mana',state.enemies[i].uid);}}
export function weeklyBeforeEnemies(state,{gainMana,heal,log}){
 const w=state.weekly;if(!bossActive(w))return;
 if(w.rule==='twins'&&!w.twinsBroken){const twins=[state.enemies[0],state.enemies[2]];if(twins.every(e=>e.hp<=0))w.twinsBroken=true;else if(twins.some(e=>e.hp<=0)){const dead=twins.find(e=>e.hp<=0);dead.hp=Math.round(dead.maxHp*.4);dead.effects={};dead.shield=0;dead.mana=0;dead.countdown=2;log(state,dead.name+' revives at 40% HP. Defeat both before the enemy phase.','heal',dead.uid);}}
 if(w.rule==='collector'&&state.enemies[1].hp>0){
  weeklyRecover(state,{gainMana,log});const slots=[0,2].map((i,slot)=>({i,slot})).filter(x=>state.enemies[x.i].hp>0);
  if(slots.length)for(const [j,h]of state.heroes.entries())if(h.hp>0){const amount=Math.min(1.5,h.mana),slot=slots[j%slots.length].slot;h.mana=Math.max(0,h.mana-amount);w.stored[slot][j]+=amount;}
  if(slots.length)log(state,'The Collector stores stolen charge in its crystals.','mana','enemy-1');
  if(state.moves%3===0){const amount=w.stored.flat().reduce((a,b)=>a+b,0);if(amount){heal(state,state.enemies[1],amount*25,'Consumed mana');w.stored.forEach(a=>a.fill(0));log(state,'The Collector consumes the stored mana.','skill','enemy-1');}}
 }
}
export function weeklyFinish(state,{gainMana,log}){const w=state.weekly;if(!w)return;if(w.rule==='runesmith'&&!allGoals(w)&&state.enemies[1].hp<=0){state.enemies[1].hp=1;state.enemies[1].mana=0;log(state,'The rune seal holds. Forge and activate both runes.','shield','enemy-1');}weeklyRecover(state,{gainMana,log});if(bossActive(w)&&w.rule==='twins'&&[state.enemies[0],state.enemies[2]].every(e=>e.hp<=0))w.twinsBroken=true;}
export function weeklyAfterAction(state,log){if(state.weekly?.rule==='volley'&&state.phase==='playing'&&state.moves>=3){state.weekly.failed=true;state.phase='defeat';log(state,'The Final Volley ends after 3 moves. Retry with the same board and team.','damage');}}
export function weeklyStatus(state){const w=state.weekly;if(!w)return null;let text='';if(w.round<3&&['mirror','twins','collector','eclipse','regent'].includes(w.rule))return {name:'Battle '+w.round+'/3',phase:'active',text:'Defeat the guards. The boss awaits in battle 3.'};
 if(w.rule==='runesmith')text=(w.round===1?['blast']:w.round===2?['prism']:['blast','prism']).map(k=>(k==='blast'?'Blast':'Prismatic')+': '+(w.forged[k]&&w.activated[k]?'complete':w.forged[k]?'activate it':'forge it')).join(' · ');
 if(w.rule==='rares_only')text='Rare champions only.';
 if(w.rule==='borrowed')text='Loaned warband · fixed Lv. 40 · no changes to your collection.';
 if(w.rule==='volley')text=Math.max(0,3-state.moves)+' board moves left · Specials cost no move.';
 if(w.rule==='twofold')text='Featured elements only · both represented.';
 if(bossActive(w)&&w.rule==='mirror'){const h=state.heroes.find(h=>h.uid===w.copy?.uid);text=h?'Stored: '+h.special.name+(h.special.charging?' · Charge '+w.copy.level:'')+' · casts at the Mage’s next attack.':'No stored Special. Your next cast will be copied.';}
 if(w.rule==='twins')text=w.twinsBroken?'The bond is broken. Defeat the remaining enemies.':'Defeat both Tyrants before the enemy phase to stop their revival.';
 if(w.rule==='collector')text='Stored mana: '+w.stored.flat().reduce((a,b)=>a+b,0).toFixed(1)+' · breaks return it; every third move consumes it.';
 if(w.rule==='regent')text='Starts shielded · first action: ATK Up, DEF Up and team Poison (2 turns).';
 if(w.rule==='eclipse')text=Math.floor(state.moves/2)%2===0?'Solar armor · tile damage reduced 75%. Use Specials.':'Lunar armor · Special damage reduced 75%. Match tiles.';
 return {name:'Weekly Challenge',phase:'active',text};
}

export function validWeeklyState(state){const w=state.weekly;if(!w||typeof w!=='object'||Array.isArray(w))return false;const bool=x=>typeof x==='boolean';if(!Number.isInteger(w.round)||w.round<1||w.round>3)return false;if(!['runesmith','rares_only','borrowed','volley','twofold','mirror','twins','collector','eclipse','regent'].includes(w.rule)||!bool(w.twinsBroken)||!bool(w.failed)||!['blast','prism'].every(k=>bool(w.forged?.[k])&&bool(w.activated?.[k])))return false;if(!Array.isArray(w.stored)||w.stored.length!==2||w.stored.some(a=>!Array.isArray(a)||a.length!==5||a.some(n=>!Number.isFinite(n)||n<0||n>1000))||!Array.isArray(w.released)||w.released.length!==2||w.released.some(x=>!bool(x)))return false;if(!Number.isInteger(w.lastSpecialMove)||w.lastSpecialMove< -1||w.lastSpecialMove>state.moves)return false;if(w.copy!==null&&(!w.copy||!state.heroes?.some(h=>h.uid===w.copy.uid&&h.special.levels.some(s=>s.level===w.copy.level))))return false;if(w.failed&&(w.rule!=='volley'||state.moves<3||state.phase!=='defeat'))return false;if(state.phase==='victory'&&(w.rule==='runesmith'&&!allGoals(w)||w.rule==='volley'&&state.moves>3))return false;return true;}
