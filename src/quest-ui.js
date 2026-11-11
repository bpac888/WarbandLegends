import {nextFirstStep} from './first-steps.js?v=0.40.2';
import {tutorialQuestAvailable} from './tutorial.js?v=0.40.2';
import {GEM_INTERVAL} from './economy.js?v=0.40.2';
import {GEM_ART} from './currency-art.js?v=0.40.2';
import {QUESTS,questProgress} from './quests.js?v=0.40.2';
import {questRewardMarks} from './gem-ui.js?v=0.40.2';
export const QUEST_ART='./assets/quests/categories.webp';
export function questArtIndex(quest){return quest.metric==='summons'?5:quest.metric==='ascensions'?7:quest.metric==='awakenings'?8:({campaign:0,dungeons:1,arena:2,events:3,collection:4,growth:6}[quest.category]??6);}
const art=index=>`<span class="quest-thumbnail" aria-hidden="true"><img src="${QUEST_ART}" alt="" width="1254" height="1254" style="--quest-x:${index%3};--quest-y:${Math.floor(index/3)}"></span>`;
function campaignVictoryBonus(profile){
 if(profile.openRoster)return '';
 const progress=profile.wins%GEM_INTERVAL;
 return `<section class="campaign-victory-bonus" aria-label="Campaign victory bonus"><img src="${GEM_ART}" alt="" width="40" height="40"><span>50 Gems for every ${GEM_INTERVAL} campaign victories</span><b>${progress} / ${GEM_INTERVAL}</b><div class="quest-progress" role="progressbar" aria-label="Campaign victories toward the next 50 Gems" aria-valuemin="0" aria-valuemax="${GEM_INTERVAL}" aria-valuenow="${progress}"><i style="width:${progress/GEM_INTERVAL*100}%"></i></div></section>`;
}
export function questsPage(profile,{limit=12,state='active'}={}){
 const isClaimed=q=>profile.claimed.includes(q.id),isReady=q=>!isClaimed(q)&&questProgress(profile,q)>=q.goal;
 const catalogue=QUESTS.filter(q=>profile.claimed.includes(q.id)||tutorialQuestAvailable(profile,q.id)),ready=catalogue.filter(isReady),completed=catalogue.filter(isClaimed);
 const tutorialQuest=nextFirstStep({...profile,onboardingDismissed:false})?.quest;
 const rows=catalogue.filter(q=>state==='completed'?isClaimed(q):!isClaimed(q)&&(state!=='ready'||isReady(q))).sort((a,b)=>Number(b.id===tutorialQuest)-Number(a.id===tutorialQuest)||Number(isReady(b))-Number(isReady(a)));
 const totalReady=QUESTS.filter(isReady).length;
 return `<section class="quest-banner">${art(6)}<div><h2>${totalReady} ${totalReady===1?'Reward':'Rewards'} Ready</h2><p>${profile.claimed.length} of ${QUESTS.length} quests completed</p></div></section>${campaignVictoryBonus(profile)}
 <div class="quest-status" role="group" aria-label="Quest status">${[['active','Active',catalogue.length-completed.length],['ready','Ready',ready.length],['completed','Completed',completed.length]].map(([id,name,n])=>`<button data-action="quest-status" data-state="${id}" aria-pressed="${state===id}" class="${state===id?'active':''}">${name} <b>${n}</b></button>`).join('')}</div>
 <section class="chronicle-grid">${rows.length?'':'<div class="empty-state"><h3>No quests here yet</h3><p>Keep adventuring or choose another status.</p></div>'}${rows.slice(0,limit).map(q=>{
 const progress=Math.min(q.goal,questProgress(profile,q)),claimed=isClaimed(q),complete=progress>=q.goal;
 const page=q.tutorialPage||{campaign:'campaign',dungeons:'dungeons',arena:'arena',events:'events',collection:q.metric==='collection'?'roster':'summon',growth:'roster'}[q.category];
 return `<article class="chronicle-card quest-category-${q.category} ${claimed?'claimed':complete?'ready':''}" data-quest="${q.id}"><div class="chronicle-copy"><div class="quest-card-heading">${art(questArtIndex(q))}<div class="quest-heading-copy"><div class="quest-meta"><span>${q.category[0].toUpperCase()+q.category.slice(1)}</span><b>${claimed?'Claimed':complete?'Ready to claim':progress.toLocaleString()+' / '+q.goal.toLocaleString()}</b></div><h2>${q.name}</h2></div></div><p>${q.text}</p><div class="quest-progress" role="progressbar" aria-label="${q.name}" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="${q.goal}"><i style="width:${progress/q.goal*100}%"></i></div><div class="quest-reward-marks">${questRewardMarks(q)}${q.championReward?`<span>+1 ${q.championRewardName}</span>`:''}</div><div class="chronicle-actions"><button class="button ${complete&&!claimed?'gold':'outline'}" data-action="claim-quest" data-id="${q.id}" ${!complete||claimed?'disabled':''}>${claimed?'Claimed':complete?'Claim rewards':'In progress'}</button>${!claimed&&!complete?`<button class="text-button" data-action="${q.metric==='tutorial'?'first-step':'nav'}" data-page="${page}">Continue →</button>`:''}</div></div></article>`;
 }).join('')}</section>${rows.length>limit?`<div class="quest-more"><button class="button outline" data-action="quest-more">Show more quests · ${Math.min(limit,rows.length)} / ${rows.length}</button></div>`:''}`;
}
