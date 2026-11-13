export const TUTORIAL_FLAGS=['special','match4','match5','fed','feedingCollection','feedingChampion','shop','tokens','premium','inventory','team','guide','celebrated'];
export const tutorialState=p=>Object.fromEntries(TUTORIAL_FLAGS.map(k=>[k,p?.tutorial?.[k]===true]));
export const TUTORIAL_QUESTS=[
 {id:'tutorial-combat',name:'Your First Battle Lesson',requires:null,metric:'combat',text:'Make a match, cast a Special, then create and activate Blast and Prismatic Runes.',page:'battle',gold:100,gems:50},
 {id:'tutorial-feeding',name:'A Stronger Champion',requires:'first-summon',metric:'fed',text:'Raise a champion by at least one level using feeding.',page:'champion',gold:150,gems:25},
 {id:'tutorial-shop',name:'Know Your Supplies',requires:'tutorial-feeding',metric:'market',text:'Visit Shop, Token Exchange, Premium and Inventory.',page:'shop',gold:100,gems:25},
 {id:'tutorial-team',name:'Shape Your Warband',requires:'tutorial-shop',metric:'team',text:'Save a change to your team: replace or reorder a champion.',page:'roster',gold:100,gems:25},
 {id:'tutorial-guide',name:'Knowledge for the Road',requires:'tutorial-team',metric:'guide',text:'Open the Guide.',page:'guide',gold:100,gems:25},
];
export function tutorialQuestAvailable(p,id){const q=TUTORIAL_QUESTS.find(q=>q.id===id);return !q||!q.requires||p.claimed.includes(q.requires);}
export function tutorialProgress(p,id){const q=TUTORIAL_QUESTS.find(q=>q.id===id);if(!q||!tutorialQuestAvailable(p,id))return 0;const t=tutorialState(p);return q.metric==='combat'?['special','match4','match5'].filter(k=>t[k]).length:q.metric==='market'?['shop','tokens','premium','inventory'].filter(k=>t[k]).length:Number(t[q.metric]);}
export function recordTutorial(p,event){const gates={special:null,match4:null,match5:null,fed:'first-summon',feedingCollection:'first-summon',feedingChampion:'first-summon',shop:'tutorial-feeding',tokens:'tutorial-feeding',premium:'tutorial-feeding',inventory:'tutorial-feeding',team:'tutorial-shop',guide:'tutorial-team'};if(p.openRoster||!(event in gates)||(gates[event]&&!p.claimed.includes(gates[event]))||p.tutorial?.[event])return p;return {...p,tutorial:{...tutorialState(p),[event]:true}};}
export const tutorialFinished=p=>p.claimed.includes('tutorial-guide');
