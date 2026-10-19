import {validateProfile,normalizeProfile} from './progression.js';
import {validateSave} from './engine.js';
export function makeBackup(profile,battle){return {game:'legends-runes',version:1,profile:structuredClone(profile),battle:battle?structuredClone(battle):null};}
export function parseBackup(text,roster){
 if(typeof text!=='string'||text.length>1000000)throw Error('Choose a Legends save file smaller than 1 MB.');
 let value;try{value=JSON.parse(text);}catch{throw Error('This file is not valid JSON.');}
 if(value?.game!=='legends-runes'||value.version!==1)throw Error('Choose an exported Legends: Runes of War save file.');
 if(!validateProfile(value.profile,roster))throw Error('The profile in this save is incomplete or invalid.');
 if(value.battle!==null&&!validateSave(value.battle,roster))throw Error('The battle in this save does not match the current game rules.');
 return {profile:normalizeProfile(value.profile,roster),battle:structuredClone(value.battle)};
}
