// Instrument only test-served app.js responses. Production builds never include this
// fixture adapter: battles there stay solely in memory and cannot be restored.
// Existing combat suites can stage engine fixtures and inspect the live battle
// through their original Storage calls without making the game persist encounters.
export function battleFixtureResponse(file,body){
 if(!file.endsWith('/src/app.js'))return body;
 let source=body.toString();
 const marker="  if(page!=='battle'&&battle)abandonBattle();";
 if(!source.includes(marker))throw new Error('Battle fixture route marker not found');
 source=source.replace(marker,`  if(page==='battle'){
    const staged=__fixtureRead.call(localStorage,'legends.test.battle-fixture');
    if(staged){__fixtureRemove.call(localStorage,'legends.test.battle-fixture');battle=JSON.parse(staged);settleVictory();persist(PROFILE_KEY,profile);}
  }\n${marker}`);
 source=source.replace('persist(PROFILE_KEY,profile);renderRoute();',`
const terminal=__fixtureRead.call(localStorage,'legends.test.battle-fixture');
if(terminal&&JSON.parse(terminal).phase!=='playing'&&!location.hash.endsWith('/battle')){
 __fixtureRemove.call(localStorage,'legends.test.battle-fixture');battle=JSON.parse(terminal);settleVictory();battle=null;
}
persist(PROFILE_KEY,profile);renderRoute();`);
 const adapter=`
const __fixtureRead=Storage.prototype.getItem,__fixtureWrite=Storage.prototype.setItem,__fixtureRemove=Storage.prototype.removeItem;
Storage.prototype.getItem=function(key){
 if(this===localStorage&&key===BATTLE_KEY)return battle?JSON.stringify(battle):null;
 return __fixtureRead.call(this,key);
};
Storage.prototype.setItem=function(key,value){
 if(this===localStorage&&key===BATTLE_KEY)return __fixtureWrite.call(this,'legends.test.battle-fixture',value);
 return __fixtureWrite.call(this,key,value);
};
`;
 return Buffer.from(source.replace('\nboot();',adapter+'\nboot();'));
}
