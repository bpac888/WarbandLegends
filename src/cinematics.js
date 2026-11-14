import {RELEASE_VERSION} from './release-version.js?v=0.50.0';
// Small on-demand clips cut from the owner's trailer. Static art is always the fallback.
export const CHARACTER_CLIPS={neon_singularity_reaper:'zero-singularity',the_king:'the-king',alkyron_starbreaker:'alkyron-starbreaker',abyss_lord:'malzhur-abyss',magic_iseldra:'iseldra',bronze_juggernaut:'juggernaut',elixir_apotheon:'vex',qingluo_jade_tempest:'jade-dragon',azhar_rosetted_sun:'sun-omen',asterox_labyrinth_moon:'moonward',pit_grunt:'burning-gate',blood_paladin:'last-escort',yshmir_worldwound:'worldwound',gorgythe_prism_gaze:'prism-gaze',goblins_brondak:'ironhorn-rider',sin_archon:'sin-archon',crimson_praetor:'crimson-praetor',inko_plasma_skirmisher:'plasma-skirmisher'};
export const cinematicSource=id=>'./assets/cinematics/'+id+'.mp4?v='+RELEASE_VERSION+(id==='alkyron-starbreaker'?'-framing2':'');
export const motionAllowed=(p,reduced=false)=>p.cinematicsEnabled!==false&&!reduced;
export function detailMotionHTML(id){const clip=CHARACTER_CLIPS[id.split('~')[0]];return clip?`<video class="detail-motion" data-clip="${clip}"${clip==='alkyron-starbreaker'?' style="object-position:center top"':''} muted playsinline preload="none" aria-hidden="true"></video>`:'';}
export function mountDetailMotion(root,p,reduced=false){
 const video=root.querySelector('.detail-motion');
 if(!video||!motionAllowed(p,reduced))return;
 video.muted=true;video.defaultMuted=true;video.playsInline=true;video.autoplay=true;video.setAttribute('muted','');
 const stop=()=>{video.classList.remove('playing');video.pause();video.removeAttribute('src');video.load();};
 const play=()=>{video.src=cinematicSource(video.dataset.clip);video.play().catch(stop);};
 video.addEventListener('playing',()=>video.classList.add('playing'));
 video.addEventListener('ended',stop);video.addEventListener('error',stop);
 // A short portrait scene can otherwise finish before its artwork enters view.
 if(typeof IntersectionObserver==='undefined'){play();return;}
 const observer=new IntersectionObserver(entries=>{if(!video.isConnected){observer.disconnect();return;}if(entries.some(e=>e.isIntersecting)){observer.disconnect();play();}},{threshold:.25});
 observer.observe(video);
}

let active=null;
export function stopCinematic(){active?.();if(typeof document!=='undefined')for(const v of document.querySelectorAll('.detail-motion')){v.classList.remove('playing');v.pause();v.removeAttribute('src');v.load();}}
export function playCinematic(clip,{profile={},reduced=false,label='Character cinematic',duration=null}={}){
 if(!motionAllowed(profile,reduced))return Promise.resolve(false);stopCinematic();
 return new Promise(resolve=>{const layer=document.createElement('div');layer.className='cinematic-overlay';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label',label);layer.innerHTML=`<video muted playsinline preload="none" aria-hidden="true"></video><button class="button outline cinematic-skip">Skip</button>`;const prior=document.activeElement;document.body.append(layer);const v=layer.querySelector('video'),button=layer.querySelector('button');let timer,played=false;const key=e=>{if(e.key==='Escape'){e.preventDefault();finish();}else if(e.key==='Tab'){e.preventDefault();button.focus();}};const hidden=()=>{if(document.hidden)finish();};let finished=false;const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);v.pause();v.removeAttribute('src');v.load();layer.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',hidden);active=null;if(prior?.isConnected)prior.focus({preventScroll:true});resolve(played);};active=finish;button.onclick=finish;v.onended=finish;v.onerror=finish;document.addEventListener('keydown',key);document.addEventListener('visibilitychange',hidden);button.focus({preventScroll:true});v.muted=true;v.src=cinematicSource(clip);timer=setTimeout(finish,(duration??8000)+2500);v.onplaying=()=>{played=true;clearTimeout(timer);timer=setTimeout(finish,duration??(Number.isFinite(v.duration)?v.duration*1000+150:8000));};v.play().catch(finish);});
}
export function playIntro(p,reduced){return playCinematic('intro-realm',{profile:p,reduced,label:'Warband Legends introduction',duration:2000}).then(played=>{if(played){introOnce.seen=true;try{sessionStorage.setItem('warband-intro-seen','1');}catch{}}return played;});}
export function introOnce(p,reduced){let seen=false;try{seen=sessionStorage.getItem('warband-intro-seen')==='1';}catch{seen=introOnce.seen===true;}return seen||!motionAllowed(p,reduced)?Promise.resolve(false):playIntro(p,reduced);}
if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCinematic();});
if(typeof window!=='undefined')window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{if(event.matches)stopCinematic();});
