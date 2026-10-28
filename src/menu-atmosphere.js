// Presentation only. No save access, game-state changes or battle effects.
const app=document.querySelector('#app');
const atmosphere=document.createElement('div');
atmosphere.className='realm-atmosphere';atmosphere.setAttribute('aria-hidden','true');
atmosphere.innerHTML='<i class="aether-light aether-jade"></i><i class="aether-light aether-violet"></i><i class="aether-light aether-gold"></i><i class="aether-stars"></i><i class="aether-tracery"></i>';
document.body.insertBefore(atmosphere,app);
const meta=document.querySelector('meta[name="theme-color"]'),originalTheme=meta?.content||'#292329';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let lastScene=null;
function syncScene(){
 const combat=!!app.querySelector('.battle-shell');
 if(combat&&lastScene==='battle')return;
 const page=app.querySelector('.game-page'),scene=combat?'battle':app.querySelector('.splash-screen')?'splash':app.querySelector('.home-shell')?'home':page?[...page.classList].find(c=>c.startsWith('page-'))?.slice(5)||'home':'loading';
 document.body.classList.toggle('menu-theme',!combat);
 document.body.dataset.menuScene=scene;atmosphere.hidden=combat||scene==='splash';
 if(meta)meta.content=combat?originalTheme:'#112a30';
 if(scene!==lastScene&&!combat&&!reduced.matches){
  const content=page||app.querySelector('.home-shell');
  content?.animate([{transform:'translateY(7px)'},{transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});
 }
 lastScene=scene;
}
new MutationObserver(syncScene).observe(app,{childList:true});
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('menu-motion-paused',document.hidden));
syncScene();
