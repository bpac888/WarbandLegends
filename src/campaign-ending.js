// Short, non-blocking visual epilogues for the final victory of each campaign act.
export const ENDING_SCENES={
 normal:[['normal-rescue','Auroline is free.','Runa helps Auroline escape the broken binding beneath the citadel.'],['normal-fire','The valley burns.','The rescued alchemist and Runa see the first fields catch fire.']],
 hard:[['hard-evacuation','Nobody is left behind.','Families and medicine carts climb out of the burning valley.'],['hard-ridge','The people are safe.','The refugees reach the ridge as the distant citadel collapses.']],
 nightmare:[['nightmare-binding','Yshmir is sealed.','Auroline binds Yshmir while Runa brings the freed wardens to safety.'],['nightmare-home','A new beginning.','Survivors plant their saved seeds and begin rebuilding the ruined village.']]
};
export function campaignEndingHTML(stage){const scenes=stage?.mode==='campaign'&&stage.number===25&&ENDING_SCENES[stage.difficulty];return scenes?`<figure class="campaign-ending-montage" aria-label="${stage.difficulty} campaign ending" data-ending-state="first">${scenes.map(([id,caption,alt],i)=>`<div class="ending-slide ${i?'':'is-visible'}"><img src="./assets/story/endings/${id}.webp" alt="${alt}" width="1536" height="1024" decoding="async"><figcaption>${caption}</figcaption></div>`).join('')}</figure>`:'';}
export function mountCampaignEnding(root,{reduced=false}={}){
 const montage=root.querySelector('.campaign-ending-montage');if(!montage)return ()=>{};
 const slides=[...montage.querySelectorAll('.ending-slide')];let timer,stopped=false;const animations=[];
 const finish=()=>{for(const a of animations)a.cancel();slides.forEach((s,i)=>s.classList.toggle('is-visible',i===slides.length-1));montage.dataset.endingState='complete';};
 const hidden=()=>{if(document.hidden){clearTimeout(timer);finish();}};
 if(reduced){finish();return ()=>{};}
 document.addEventListener('visibilitychange',hidden);
 Promise.all(slides.map(s=>s.querySelector('img').decode().catch(()=>{}))).then(()=>{if(stopped||!montage.isConnected)return;if(document.hidden){finish();return;}timer=setTimeout(()=>{if(stopped||!montage.isConnected)return;montage.dataset.endingState='fading';animations.push(slides[0].animate([{opacity:1},{opacity:0}],{duration:650,fill:'forwards'}),slides[1].animate([{opacity:0},{opacity:1}],{duration:650,fill:'forwards'}));timer=setTimeout(finish,2600);},2400);});
 return ()=>{stopped=true;clearTimeout(timer);for(const a of animations)a.cancel();document.removeEventListener('visibilitychange',hidden);};
}
