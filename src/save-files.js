import {battleRoster} from './hero-copies.js';
import {validateProfile,normalizeProfile} from './progression.js';
import {validateSave} from './engine.js';
export function makeBackup(profile,battle){return {game:'legends-runes',version:1,profile:structuredClone(profile),battle:battle?structuredClone(battle):null};}
export function parseBackup(text,roster){
 if(typeof text!=='string'||text.length>1000000)throw Error('Choose a Legends save file smaller than 1 MB.');
 let value;try{value=JSON.parse(text);}catch{throw Error('This file is not valid JSON.');}
 if(value?.game!=='legends-runes'||value.version!==1)throw Error('Choose an exported Legends: Runes of War save file.');
 const legacy=[9,10].includes(value.profile?.profileVersion);
 if(legacy&&(!value.profile.collection||!Array.isArray(value.profile.team)||value.profile.team.length!==5||!Number.isSafeInteger(value.profile.gems)||value.profile.gems<0||Object.values(value.profile.collection).some(n=>!Number.isSafeInteger(n)||n<1||n>99999)))throw Error('The older profile is incomplete or invalid.');
 const profile=legacy?normalizeProfile(value.profile,roster):value.profile;
 if(!validateProfile(profile,roster))throw Error('The profile in this save is incomplete or invalid.');
 if(value.battle!==null&&!validateSave(value.battle,battleRoster(profile,roster)))throw Error('The battle in this save does not match the current game rules.');
 return {profile:normalizeProfile(profile,roster),battle:structuredClone(value.battle)};
}
