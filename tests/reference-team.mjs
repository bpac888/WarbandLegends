import {defaultProfile as newProfile} from '../src/progression.js';
// Stable combat fixture for tests written around the original rainbow team.
// Player-facing new games use STARTER_TEAM from progression.js instead.
export const REFERENCE_TEAM=['dragonmage','shieldmaiden_runa','steel_oracle','dune_queen_zaya','wraith_archer'];
export function referenceProfile(){return {...newProfile(),team:[...REFERENCE_TEAM],collection:Object.fromEntries(REFERENCE_TEAM.map(id=>[id,1]))};}
