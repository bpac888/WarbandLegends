// Shared faction rules for combat, team composition and the Guide.
// Counts are locked from the five starting slots; fallen members do not remove a tier.
export const FACTION_BONUSES={
 astral_concord:{name:'Astral Concord',tiers:{2:{tileMana:.15,text:'+15% mana from matching runes.'},3:{tileMana:.25,text:'+25% mana from matching runes.'}}},
 bloodcourt:{name:'Bloodcourt',tiers:{2:{regen:.03,text:'Recover 3% max HP each turn.'},3:{regen:.06,text:'Recover 6% max HP each turn.'}}},
 chymera:{name:'Chymera',tiers:{2:{extendChance:.5,text:'50% chance for each Special ailment applied to an enemy to last 1 extra turn.'},3:{extendChance:1,text:'Special ailments applied to enemies last 1 extra turn.'}}},
 dragondynasty:{name:'Dragon Dynasty',tiers:{2:{atk:.05,text:'+5% ATK.'},3:{atk:.05,def:.05,text:'+5% ATK and DEF.'}}},
 duneriders:{name:'Dune Riders',tiers:{2:{def:.05,text:'+5% DEF.'},3:{def:.10,text:'+10% DEF.'}}},
 frost:{name:'Frost',tiers:{2:{immune:['burn'],text:'Immune to Burn.'},3:{immune:['burn','poison'],text:'Immune to Burn and Poison.'}}},
 ironclad:{name:'Ironclad',tiers:{2:{hp:.05,text:'+5% max HP.'},3:{hp:.10,text:'+10% max HP.'}}},
 neon_syndicate:{name:'Neon Syndicate',tiers:{2:{hp:.03,atk:.03,text:'+3% max HP and ATK.'},3:{hp:.04,atk:.04,def:.04,text:'+4% max HP, ATK and DEF.'}}},
 nether:{name:'Nether',tiers:{2:{openingChance:.5,openingMana:.10,text:'At battle start: each member has a 50% chance to gain 10% of their own maximum mana.'},3:{openingChance:1,openingMana:.15,text:'At battle start: each member gains 15% of their own maximum mana.'}}},
 umbra:{name:'Umbra',tiers:{2:{growthChance:.10,text:'Each member rolls separately each turn: 10% chance to gain 2% ATK, DEF and max HP. Stacks.'},3:{growthChance:.15,text:'Each member rolls separately each turn: 15% chance to gain 2% ATK, DEF and max HP. Stacks.'}}},
 veldtborn:{name:'Veldtborn',tiers:{2:{tileMana:.10,text:'+10% mana from matching runes.'},3:{tileMana:.30,text:'+30% mana from matching runes.'}}},
 wildgrove:{name:'Wildgrove',tiers:{2:{regen:.02,text:'Recover 2% max HP each turn.'},3:{regen:.04,hp:.05,text:'Recover 4% max HP each turn; start with +5% max HP.'}}},
};
const empty=Object.freeze({});
export function factionGroups(team){
 const counts=new Map();for(const unit of team)if(unit&&FACTION_BONUSES[unit.faction])counts.set(unit.faction,(counts.get(unit.faction)||0)+1);
 return [...counts].filter(([,count])=>count>=2).map(([faction,count])=>({faction,count,tier:Math.min(3,count),...FACTION_BONUSES[faction]}));
}
export const factionRule=unit=>unit.side==='hero'?FACTION_BONUSES[unit.faction]?.tiers[unit.factionTier]||empty:empty;
export function initializeFactionBonuses(state,{roll,log,gainMana}){
 state.factionRules=1;
 const groups=factionGroups(state.heroes),tiers=new Map(groups.map(g=>[g.faction,g.tier]));
 for(const hero of state.heroes){
  hero.factionTier=tiers.get(hero.faction)||0;hero.factionLastTurn=0;const rule=factionRule(hero);
  if(rule.atk)hero.atk=Math.round(hero.atk*(1+rule.atk));if(rule.def)hero.def=Math.round(hero.def*(1+rule.def));
  if(rule.hp){hero.maxHp=Math.round(hero.maxHp*(1+rule.hp));hero.hp=hero.maxHp;}
  if(rule.growthChance){hero.factionBase={atk:hero.atk,def:hero.def,maxHp:hero.maxHp};hero.factionStacks=0;}
 }
 for(const group of groups){
  log(`${group.name} · ${group.tier}-member faction bonus active.`,'buff');
  const rule=group.tiers[group.tier];if(!rule.openingChance)continue;
  for(const hero of state.heroes.filter(h=>h.faction===group.faction)){
   if(rule.openingChance<1&&roll()>=rule.openingChance){log(`${hero.name}: Nether opening surge did not activate.`,'neutral',hero.uid);continue;}
   const gained=gainMana(hero,hero.manaMax*rule.openingMana,{flat:true});log(`${hero.name}: +${Number(gained.toFixed(2))} tile charge · Nether opening surge.`,'mana',hero.uid);
  }
 }
}
export function factionUpkeep(state,unit,{roll,heal,log}){
 if(unit.side!=='hero'||unit.hp<=0||!unit.factionTier||state.moves<1||unit.factionLastTurn>=state.moves)return;
 unit.factionLastTurn=state.moves;const rule=factionRule(unit);
 if(rule.growthChance&&roll()<rule.growthChance){
  unit.factionStacks++;const ratio=1+unit.factionStacks*.02,base=unit.factionBase,oldMax=unit.maxHp;
  unit.atk=Math.round(base.atk*ratio);unit.def=Math.round(base.def*ratio);unit.maxHp=Math.round(base.maxHp*ratio);unit.hp=Math.min(unit.maxHp,unit.hp+Math.max(0,unit.maxHp-oldMax));
  log(`${unit.name}: Umbral growth ×${unit.factionStacks} · +${unit.factionStacks*2}% ATK, DEF and max HP.`,'buff',unit.uid);
 }
 if(rule.regen)heal(unit,unit.maxHp*rule.regen,FACTION_BONUSES[unit.faction].name);
}
export function validFactionState(state,roster){
 if(state.factionRules===undefined)return [...state.heroes,...state.enemies].every(u=>u.factionTier===undefined&&u.factionStacks===undefined&&u.factionBase===undefined&&u.factionLastTurn===undefined);
 if(state.factionRules!==1)return false;
 const tiers=new Map(factionGroups(state.heroes).map(g=>[g.faction,g.tier]));
 if(state.enemies.some(u=>u.factionTier!==undefined||u.factionStacks!==undefined||u.factionBase!==undefined||u.factionLastTurn!==undefined))return false;
 return state.heroes.every(u=>{
  if(u.faction!==roster.find(c=>c.id===u.id)?.faction||u.factionTier!==(tiers.get(u.faction)||0)||!Number.isSafeInteger(u.factionLastTurn)||u.factionLastTurn<0||u.factionLastTurn>state.moves)return false;
  if(factionRule(u).growthChance)return Number.isSafeInteger(u.factionStacks)&&u.factionStacks>=0&&u.factionStacks<=state.moves&&u.factionBase&&['atk','def','maxHp'].every(k=>Number.isFinite(u.factionBase[k])&&u.factionBase[k]>0);
  return u.factionStacks===undefined&&u.factionBase===undefined;
 });
}
