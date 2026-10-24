import {manaLevels} from './engine.js';
// Presentation only. Neither the effect planner nor its renderer changes battle state.
export function planSpecialEffects(previous,current,frame){
 const units=[...current.heroes,...current.enemies],oldUnits=[...previous.heroes,...previous.enemies],actor=units.find(u=>u.uid===frame.actor),beforeActor=oldUnits.find(u=>u.uid===frame.actor);
 if(!actor)return null;
 const special=['skill','mechanic','passive'].includes(frame.kind)||(frame.kind==='enemy'&&beforeActor?.mana>=beforeActor?.manaMax&&actor.mana<beforeActor.mana);
 const targets=[];
 for(const unit of units){const before=oldUnits.find(u=>u.uid===unit.uid);if(!before)continue;
  const newEffects=Object.keys(unit.effects).filter(id=>JSON.stringify(unit.effects[id])!==JSON.stringify(before.effects[id]));
  const removed=Object.keys(before.effects).some(id=>!unit.effects[id]);
  if(unit.hp<before.hp)targets.push({uid:unit.uid,kind:'strike'});
  else if(unit.hp>before.hp)targets.push({uid:unit.uid,kind:'heal'});
  else if(unit.shield>before.shield||newEffects.length||removed)targets.push({uid:unit.uid,kind:unit.side===actor.side?'ward':'curse'});
 }
 if(!targets.length&&frame.target)targets.push({uid:frame.target,kind:'ward'});
 const spec=manaLevels(actor).find(l=>l.level===(frame.level||manaLevels(actor).at(-1).level));
 return {actor:actor.uid,color:actor.color,name:frame.name||actor.special.name,special,level:spec?.level||1,targets,rarity:actor.rarity,portrait:actor.portrait,champion:actor.name,side:actor.side,cinematic:special&&actor.rarity==='mythical'&&['skill','enemy'].includes(frame.kind)};
}
export function battlePressure(state){
 if(!state||state.phase!=='playing'||!state.heroes.length)return {intensity:0,critical:false};
 const total=state.heroes.reduce((n,u)=>n+u.maxHp,0),health=state.heroes.reduce((n,u)=>n+Math.max(0,u.hp),0)/Math.max(1,total),living=state.heroes.filter(u=>u.hp>0).length;
 return {intensity:Math.min(.85,Math.min(.34,state.moves*.014)+(1-health)*.55+(1-living/state.heroes.length)*.12),critical:health<=.3||living<=2};
}
export function planImpactFeedback(previous,current,frame={}){
 const before=new Map([...previous.heroes,...previous.enemies].map(u=>[u.uid,u]));
 return [...current.heroes,...current.enemies].flatMap(unit=>{
  const old=before.get(unit.uid);if(!old||old.hp<=0)return [];
  const damage=Math.max(0,old.hp-unit.hp),absorbed=['enemy','skill','match','passive'].includes(frame.kind)?Math.max(0,old.shield-unit.shield):0;
  if(!damage&&!absorbed)return [];
  return [{uid:unit.uid,side:unit.side,color:unit.color,damage,absorbed,fraction:damage/Math.max(1,unit.maxHp),knockout:unit.hp<=0}];
 });
}
let generation=0;const timers=new Set(),animations=new Set();
function motion(node,keyframes,options){
 if(!node?.isConnected)return;
 const a=node.animate(keyframes,options);animations.add(a);a.finished.then(()=>animations.delete(a),()=>animations.delete(a));return a;
}
function later(fn,ms){const key=generation;const id=setTimeout(()=>{timers.delete(id);if(generation===key)fn();},ms);timers.add(id);}
export function clearBattleEffects(){generation++;for(const t of timers)clearTimeout(t);timers.clear();for(const a of animations)a.cancel();animations.clear();document.querySelector('#effects-layer')?.replaceChildren();}
function spawn(className,x,y,duration,html=''){const node=document.createElement('span');node.className=className;node.style.left=x+'px';node.style.top=y+'px';node.innerHTML=html;document.querySelector('#effects-layer').append(node);later(()=>node.remove(),duration);return node;}
const center=(node,y=.5)=>{const r=node?.getBoundingClientRect();return r?{x:r.left+r.width/2,y:r.top+r.height*y}:null;};
export function animateLaneShots(frame,state,root,{speed=1,reduced=false}={}){
 const duration=560/speed;
 for(const [i,shot]of(frame.shots||[]).entries()){
  if(!state.heroes.some(u=>u.color===shot.color&&u.hp>0))continue;
  const tile=root.querySelector(`[data-index="${shot.index}"]`),start=center(tile),enemy=root.querySelector(`[data-unit="${shot.target}"]`),end=shot.target?center(enemy,.6):center(root.querySelector('.battle-sky'),.07);if(!start||!end)continue;
  const lane=root.querySelector(`[data-lane="${shot.index%7}"]`);lane?.classList.add('lane-firing',shot.color);
  if(reduced)continue;
  const delay=Math.min(i*12,140)/speed;
  later(()=>{const bolt=spawn(`lane-bolt ${shot.color} ${shot.ghost?'ghost-bolt':''}`,start.x,start.y,duration+80,`<img src="./assets/runes/${shot.color}.svg" alt="">`);bolt.style.setProperty('--dy',(end.y-start.y)+'px');bolt.style.setProperty('--duration',duration+'ms');if(shot.target)later(()=>{const pos=center(enemy,.6);if(pos&&enemy.isConnected)spawn(`lane-hit ${shot.color}`,start.x,pos.y,280/speed);},duration*.8);},delay);
 }
}
export function animateSpecial(previous,current,frame,root,{speed=1,reduced=false}={}){
 const plan=planSpecialEffects(previous,current,frame);if(!plan)return;const source=root.querySelector(`[data-unit="${plan.actor}"]`),start=center(source);if(!start)return;
 source.classList.add(plan.special?'special-caster':'basic-attacker');
 if(plan.special&&plan.cinematic&&!reduced)mythicCinematic(plan,speed);
 else if(plan.special){const banner=document.createElement('div');banner.className=`special-announcement ${plan.color}`;const image=document.createElement('img');image.src=current.heroes.concat(current.enemies).find(u=>u.uid===plan.actor).portrait;image.alt='';const text=document.createElement('strong');text.textContent=plan.name;banner.append(image,text);root.querySelector('.battle-center').append(banner);later(()=>banner.remove(),(reduced?180:1050)/speed);}
 for(const target of plan.targets){const node=root.querySelector(`[data-unit="${target.uid}"]`),end=center(node,.42);if(!end)continue;const delay=reduced?0:(plan.special?220:70)/speed;
  if(!reduced&&plan.special&&target.uid!==plan.actor){const mote=spawn(`special-orb ${plan.color} orb-${target.kind}`,start.x,start.y,600/speed);motion(mote,[{transform:'translate(-50%,-50%) scale(.4)'},{transform:`translate(calc(-50% + ${(end.x-start.x)*.45}px),calc(-50% + ${(end.y-start.y)*.5-35}px)) scale(1.2)`,offset:.5},{transform:`translate(calc(-50% + ${end.x-start.x}px),calc(-50% + ${end.y-start.y}px)) scale(.4)`}],{duration:450/speed,easing:'cubic-bezier(.2,.55,.55,1)',fill:'forwards'});}
  later(()=>{if(!node.isConnected)return;node.classList.add('special-hit-'+target.kind);spawn(`special-impact ${plan.color} fx-${target.kind} ${reduced?'still-impact':''}`,end.x,end.y,(reduced?170:700)/speed,`${Array.from({length:reduced?0:8},(_,i)=>`<i style="--angle:${i*45}deg"></i>`).join('')}<b>${target.kind==='heal'?'+':target.kind==='ward'?'◇':target.kind==='curse'?'✧':''}</b>`);},delay);
 }
}

function mythicCinematic(plan,speed){
 const node=document.createElement('div');node.className=`special-announcement mythic-cinematic ${plan.color} caster-${plan.side}`;node.setAttribute('aria-hidden','true');node.style.setProperty('--cinematic-time',1100/speed+'ms');
 const stage=document.createElement('div');stage.className='mythic-stage';
 const seal=document.createElement('div');seal.className='mythic-seal';seal.textContent='ᚱ ᛟ ᚨ ᛉ ᛏ';
 const art=document.createElement('img');art.className='mythic-portrait';art.src=plan.portrait;art.alt='';
 const copy=document.createElement('div');copy.className='mythic-copy';
 for(const [tag,text]of [['small','MYTHICAL'],['strong',plan.champion],['span',plan.name]]){const line=document.createElement(tag);line.textContent=text;copy.append(line);}
 stage.append(seal,art,copy);node.append(stage);document.querySelector('#effects-layer')?.append(node);later(()=>node.remove(),1100/speed);
}
export function animateBattleFeedback(previous,current,frame,root,{speed=1,reduced=false}={}){
 const impacts=planImpactFeedback(previous,current,frame);
 const special=planSpecialEffects(previous,current,frame),delay=reduced?0:(frame.kind==='match'?390:special?.special?220:70)/speed;
 if(frame.kind==='match'&&frame.combo>1&&!reduced){
  const board=root.querySelector('.board');motion(board,[{filter:'brightness(1)'},{filter:`brightness(${Math.min(1.35,1+frame.combo*.07)})`,offset:.4},{filter:'brightness(1)'}],{duration:380/speed});
 }
 if(!impacts.length)return;
 later(()=>{
  const allies=impacts.filter(i=>i.side==='hero'),hurt=allies.some(i=>i.damage>0);
  if(allies.length){
   const veil=document.createElement('div');veil.className=`battle-hit-flash ${hurt?'hit-health':'hit-guard'} ${reduced?'still-hit':''}`;veil.setAttribute('aria-hidden','true');document.querySelector('#effects-layer')?.append(veil);later(()=>veil.remove(),(reduced?120:230)/speed);
  }
  if(!reduced&&allies.length){
   const strength=Math.min(6,1.5+Math.max(...allies.map(i=>i.fraction))*16),center=root.querySelector('.battle-center');
   motion(center,[{transform:'translate(0,0)'},{transform:`translate(${-strength}px,${strength*.35}px)`,offset:.2},{transform:`translate(${strength*.65}px,${-strength*.25}px)`,offset:.45},{transform:`translate(${-strength*.3}px,0)`,offset:.7},{transform:'translate(0,0)'}],{duration:(hurt?250:140)/speed,easing:'ease-out'});
  }
  for(const hit of impacts){
   const unit=root.querySelector(`[data-unit="${hit.uid}"]`);if(!unit?.isConnected)continue;
   const portrait=unit.querySelector('.hero-main,.enemy-target'),pos=center(portrait,.45);if(!pos)continue;
   const type=hit.damage?'hurt':'guard',ring=spawn(`combat-contact ${hit.color} contact-${type} ${reduced?'contact-still':''}`,pos.x,pos.y,(reduced?150:420)/speed);ring.setAttribute('aria-hidden','true');
   if(!reduced){
    motion(portrait,[{transform:'translateY(0)',filter:'brightness(1)'},{transform:`translateY(${hit.side==='hero'?4:-4}px) scale(.97)`,filter:'brightness(1.35)',offset:.25},{transform:'translateY(0)',filter:'brightness(1)'}],{duration:240/speed});
    if(hit.knockout){const flare=spawn(`combat-knockout ${hit.color}`,pos.x,pos.y,600/speed,'✦');flare.setAttribute('aria-hidden','true');}
   }
  }
 },delay);
}
