export const TUTORIAL_FLAGS=['special','match4','match5','fed','shop','tokens','premium','inventory','team','guide','celebrated'];
export const tutorialState=p=>Object.fromEntries(TUTORIAL_FLAGS.map(k=>[k,p?.tutorial?.[k]===true]));
export const TUTORIAL_QUESTS=[
 {id:'tutorial-combat',name:'Your First Battle Lesson',requires:null,metric:'combat',text:'In one free practice battle: make a normal match, cast a Special, then create and manually activate both a four-match Blast Rune and a five-match Prismatic Rune.',page:'battle',gold:100,gems:50},
 {id:'tutorial-feeding',name:'A Stronger Champion',requires:'first-summon',metric:'fed',text:'Raise a champion by at least one level using feeding.',page:'champion',gold:150,gems:25},
 {id:'tutorial-shop',name:'Know Your Supplies',requires:'tutorial-feeding',metric:'shop',text:'Visit the main Shop tab. No purchase is needed.',page:'shop',gold:100,gems:25},
 {id:'tutorial-resources',name:'Explore Your Resources',requires:'tutorial-shop',metric:'resources',text:'Visit Token Exchange, Premium and Inventory. No purchases or activations are needed.',page:'shop',gold:100,gems:25},
 {id:'tutorial-team',name:'Shape Your Warband',requires:'tutorial-resources',metric:'team',text:'Save a change to your team: replace or reorder a champion.',page:'roster',gold:100,gems:25},
 {id:'tutorial-guide',name:'Knowledge for the Road',requires:'tutorial-team',metric:'guide',text:'Open the Guide to learn more about your adventure.',page:'guide',gold:100,gems:25},
];
export function tutorialQuestAvailable(p,id){const q=TUTORIAL_QUESTS.find(q=>q.id===id);return !q||!q.requires||p.claimed.includes(q.requires);}
export function tutorialProgress(p,id){const q=TUTORIAL_QUESTS.find(q=>q.id===id);if(!q||!tutorialQuestAvailable(p,id))return 0;const t=tutorialState(p);return q.metric==='combat'?['special','match4','match5'].filter(k=>t[k]).length:q.metric==='resources'?['tokens','premium','inventory'].filter(k=>t[k]).length:Number(t[q.metric]);}
export function recordTutorial(p,event){const gates={special:null,match4:null,match5:null,fed:'first-summon',shop:'tutorial-feeding',tokens:'tutorial-shop',premium:'tutorial-shop',inventory:'tutorial-shop',team:'tutorial-resources',guide:'tutorial-team'};if(p.openRoster||!(event in gates)||(gates[event]&&!p.claimed.includes(gates[event]))||p.tutorial?.[event])return p;return {...p,tutorial:{...tutorialState(p),[event]:true}};}
export const tutorialFinished=p=>p.claimed.includes('tutorial-guide');
