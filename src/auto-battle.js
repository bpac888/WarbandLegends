import {swap,activate,cast,validMoves,living,manaLevels,readyLevel} from './engine.js';
import {EFFECTS} from './effects.js';

const quiet={frames:false};
export function applyAutoAction(state,action,options=quiet){
 if(action.kind==='cast')return cast(state,action.actor,action.target,action.level,options);
 if(action.kind==='activate')return activate(state,action.index,options);
 return swap(state,action.a,action.b,options);
}
function boardActions(state){return [...validMoves(state.board).map(([a,b])=>({kind:'swap',a,b})),...state.board.flatMap((t,index)=>t.special?[{kind:'activate',index}]:[])];}
function specials(state){return living(state.heroes).flatMap(h=>manaLevels(h).filter(l=>h.mana>=l.tiles).flatMap(l=>(l.target==='self'?[h]:living(l.target==='ally'?state.heroes:state.enemies)).map(t=>({kind:'cast',actor:h.uid,target:t.uid,level:l.level}))));}
// Value survival, finishing threats, usable mana and counters. Simulations resolve
// actual defense, elements, wards, Taunt, healing, passives and guardian phases.
export function autoPositionValue(state){
 if(state.phase==='defeat')return -15000;
 let score=0;
 for(const h of state.heroes){if(h.hp<=0)continue;const hp=h.hp/h.maxHp;
  score+=440+350*hp-110*(1-hp)**3+100*Math.min(h.shield/h.maxHp,.6);
  score+=38*Math.min(h.mana/h.manaMax,1)+(readyLevel(h)?12:0);
  for(const [id,e] of Object.entries(h.effects)){
   const sign=EFFECTS[id]?.cat==='buff'?1:-1;
   const weight=['poison','burn','bleed','frostbite'].includes(id)?20:id==='heal'?24:id==='mana_block'?24:16;
   score+=sign*weight*Math.min(e.turns,3);
  }
 }
 for(const e of state.enemies){if(e.hp<=0)continue;
  const urgent=1/Math.max(1,e.countdown);
  score-=420+240*e.hp/e.maxHp+50*Math.min(e.shield/e.maxHp,.6)+45*urgent+35*e.mana/e.manaMax;
  for(const [id,v] of Object.entries(e.effects))score+=(EFFECTS[id]?.cat==='debuff'?1:-1)*(['poison','burn','bleed','frostbite'].includes(id)?22:16)*Math.min(v.turns,3);
 }
 // A bounded victory bonus avoids chasing a single lucky sampled cascade.
 return score+(state.phase==='victory'?1200:0);
}
// Use independent refill samples, never the live random seed. Auto cannot see
// future runes or enemy random targets that a human cannot see.
function sampled(state,seed){return {...state,rng:seed>>>0||1};}
function seedFor(state,sample){let n=2166136261;for(const t of state.board)n=Math.imul(n^(t.color.charCodeAt(0)+(t.special?13:0)),16777619);return (n^Math.imul(state.moves+1,2654435761)^Math.imul(sample+1,2246822519))>>>0;}
function rankBoards(state,samples=5){return boardActions(state).map(action=>{
 const scores=Array.from({length:samples},(_,i)=>autoPositionValue(applyAutoAction(sampled(state,seedFor(state,i)),action).state));
 const mean=scores.reduce((a,b)=>a+b,0)/scores.length;
 return {action,score:mean*.6+Math.min(...scores)*.4};
 }).sort((a,b)=>b.score-a.score);}
export function chooseAutoAction(state){
 if(!state||state.phase!=='playing')return null;
 const before=autoPositionValue(state),boards=rankBoards(state),bestBoard=boards[0];
 if(!bestBoard)return null;
 let chosen=bestBoard.action;
 // Look ahead one more board move on the strongest candidates. This recognizes
 // setup matches and mana preparation without trusting a single lucky cascade.
 let best=-Infinity;
 for(const candidate of boards.slice(0,3)){
  let outlook=0;
  for(let i=0;i<2;i++){
   const next=applyAutoAction(sampled(state,seedFor(state,i)),candidate.action).state;
   const future=next.phase==='playing'?rankBoards(next,2)[0]?.score??autoPositionValue(next):autoPositionValue(next);
   outlook+=.72*autoPositionValue(next)+.28*future;
  }
  const score=.7*(outlook/2)+.3*candidate.score;
  if(score>best){best=score;chosen=candidate.action;}
 }
 // Specials use no turn: use only a beneficial cast, then reconsider the entire
 // position. Consider every legal charge and target, including support allies.
 const casts=[];
 for(const action of specials(state)){
  const result=applyAutoAction(state,action);if(result.error)continue;
  if(result.state.phase==='victory')return action;
  const gain=autoPositionValue(result.state)-before;
  casts.push({action,state:result.state,gain});
 }
 let bestCast=null,bestGain=0;
 // Check how each promising cast changes the next exchange. Defensive buffs
 // must prevent real incoming damage; setup debuffs can improve rune damage.
 for(const candidate of casts.sort((a,b)=>b.gain-a.gain).slice(0,6)){
  const follow=rankBoards(candidate.state,2)[0]?.score??autoPositionValue(candidate.state);
  const gain=.45*candidate.gain+.55*(follow-bestBoard.score);
  if(gain>bestGain+1){bestGain=gain;bestCast=candidate.action;}
 }
 return bestCast||chosen;
}
