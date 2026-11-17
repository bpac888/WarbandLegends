import {runTitanRequest} from './titan-service.js';
import {randomUUID,randomInt} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {runTournamentRequest} from './tournament-service.js';
import {runChampionshipRequest} from './championship-service.js';
const catalogue=readFile(new URL('../data/champions.json',import.meta.url),'utf8').then(JSON.parse);
export async function handleChampionshipRequest(args){return (args.action.startsWith('titan-')?runTitanRequest:args.action.startsWith('tournament-')?runTournamentRequest:runChampionshipRequest)({...args,roster:await catalogue,randomUUID,randomInt});}
