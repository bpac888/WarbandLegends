// First five crossings: authored tactics, using existing champions and effects.
export const OPENING_CHAPTER={name:'The Broken Road',objective:'Defeat the enemy warband.',stages:[
 {number:1,label:'Open the lanes',story:'Scouts hold the gate. Break a flank and use the empty columns to charge your warband.',tactic:'Runes attack straight up their columns. A cleared tile in an empty lane gives double charge.'},
 {number:2,label:'Break the shieldwall',story:'Runa braces the pass behind a winter ward. The flanks remain exposed.',tactic:'The center starts with Defense Up for 2 board moves. Dispel it, wait it out, or open a flank first.',opening:{effects:[{index:1,id:'inc_def',turns:2}]}},
 {number:3,label:'Interrupt the ritual',story:'The Shade Prince has already begun his coronation. His charge is visible beneath his health.',tactic:'The center starts with 4 tile charge. Mana Slow or Mana Block can delay further charging; defeating him stops the ritual.',opening:{mana:{index:1,amount:4}}},
 {number:4,label:'Turn the ambush',story:'Thornwild raiders spring from the ford while a druid shelters behind them.',tactic:'The flanks have less HP and attack every 2 moves. The central druid attacks every 5. Clear a flank to charge quickly.',enemyIds:['barkskin_bruiser','grove_druid','thornweaver_seraph'],opening:{countdowns:[2,5,2],hpMultipliers:[.72,1.15,.72]}},
 {number:5,label:'Silence the boiler',story:'The Bronze Juggernaut bars the crossroads. Its cracked boiler flares as the armor gives way.',tactic:'Once, after an action leaves the living boss at half HP or below, Overpressure grants a 2-move Barrier and Attack Up. Its next attack is in 1 move. Dispel the buffs or protect your team.',scenario:'iron-overpressure',bossHp:1.35},
]};
export function openingStage(number){return OPENING_CHAPTER.stages.find(s=>s.number===number);}
export const OVERPRESSURE={id:'iron-overpressure',name:'Overpressure',threshold:.5,turns:2};
export function scenarioStatus(state){
 if(state.scenario?.id!==OVERPRESSURE.id)return null;
 const boss=state.enemies[1];
 if(boss.hp<=0)return {name:OVERPRESSURE.name,phase:'ended',text:'The boiler has fallen silent.'};
 return state.scenario.triggered?{name:OVERPRESSURE.name,phase:'triggered',text:'Overpressure triggered. It cannot trigger again. Inspect the boss’s badges for remaining buffs.'}:{name:OVERPRESSURE.name,phase:'waiting',text:'Overpressure waits at half HP. Keep a dispel or protection Special ready.'};
}
export function validScenario(state,stage){
 if(state.scenario===undefined)return true; // Existing saved fights keep their original rules.
 return !!stage.scenario&&state.scenario!==null&&typeof state.scenario==='object'&&!Array.isArray(state.scenario)&&state.scenario.id===stage.scenario&&typeof state.scenario.triggered==='boolean'&&Object.keys(state.scenario).every(k=>['id','triggered'].includes(k));
}
