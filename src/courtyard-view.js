import {createCourtyardScenery,COURTYARD_SCENERY} from './courtyard-scenery.js';
import {courtyardLife} from './courtyard-life.js';
import {COURTYARD_START,COURTYARD_PLACES,EYE_HEIGHT,pointOnPath,wrapAngle,stepCourtyard,approachPlace,distanceTo,projectCourtyardPoint} from './courtyard.js';
import {wantedPoster} from './courtyard-ui.js';
import {playerDate} from './keeper.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const artUrl=name=>new URL('../assets/courtyard/'+name,import.meta.url).href;

// A disposable viewer. It never reads storage or owns profile/reward logic.
export function mountCourtyard(root,{profile,onNavigate,onProfile,isPaused=()=>false}){
 const state={...COURTYARD_START},target={...state},abort=new AbortController(),options={signal:abort.signal},buttons=new Map([...root.querySelectorAll('[data-courtyard-target]')].map(b=>[b.dataset.courtyardTarget,b]));
 const canvas=root.querySelector('canvas'),backdrop=root.querySelector('.courtyard-backdrop'),live=root.querySelector('.courtyard-live'),placeName=root.querySelector('.courtyard-place'),compass=root.querySelector('.courtyard-compass i');
 let alive=true,graphics=null,frame=0,lastDraw=0,width=1,height=1,fov=70,drag=null,holdTimer=null,activeKey=null,returnTimer=null,fallbackArt='';
 let reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const resize=()=>{if(!alive)return;const top=root.getBoundingClientRect().top,available=(window.visualViewport?.height||innerHeight)-Math.max(0,top)-8;root.style.height=Math.max(270,available)+'px';width=root.clientWidth;height=root.clientHeight;fov=width<600?76:65;graphics?.resize(width,height,fov);};
 const observer=new ResizeObserver(resize);observer.observe(document.querySelector('.topbar'));window.addEventListener('resize',resize,options);window.visualViewport?.addEventListener('resize',resize,options);resize();
 const dismissHint=()=>root.classList.add('has-looked');
 const stopHold=()=>{clearTimeout(holdTimer);holdTimer=null;activeKey=null;};
 const move=direction=>{if(isPaused())return;Object.assign(target,stepCourtyard(target,direction));dismissHint();};
 const turn=direction=>{if(isPaused())return;target.yaw=wrapAngle(target.yaw-direction*Math.PI/4);target.pitch=0;dismissHint();};
 const reset=()=>{stopHold();root.classList.add('is-returning');Object.assign(target,COURTYARD_START);Object.assign(state,COURTYARD_START);clearTimeout(returnTimer);returnTimer=setTimeout(()=>root.classList.remove('is-returning'),reduce?0:220);live.textContent='Back in the courtyard.';};
 const activate=id=>{if(!alive||isPaused())return;const place=COURTYARD_PLACES.find(p=>p.id===id);if(!place)return;
  if(distanceTo(state,place)>place.range+.12){Object.assign(target,approachPlace(target,place));dismissHint();live.textContent='Approaching '+place.name+'.';return;}
  if(id==='profile')onProfile();else if(id==='tavern')reset();else onNavigate(id);
 };
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.courtyardTarget;if(id){e.stopPropagation();activate(id);}else if(b.hasAttribute('data-courtyard-reset'))reset();else if(b.dataset.courtyardMove&&e.detail===0)move(b.dataset.courtyardMove);else if(b.dataset.courtyardTurn&&e.detail===0)turn(Number(b.dataset.courtyardTurn));},options);
 root.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0||isPaused())return;const button=e.target.closest('button');if(button){const direction=button.dataset.courtyardMove,rotation=button.dataset.courtyardTurn;if(direction||rotation){e.preventDefault();root.focus({preventScroll:true});stopHold();const tick=()=>{if(!alive||isPaused())return;direction?move(direction):turn(Number(rotation));holdTimer=setTimeout(tick,rotation?380:340);};tick();button.setPointerCapture(e.pointerId);}return;}
  root.focus({preventScroll:true});drag={id:e.pointerId,x:e.clientX,y:e.clientY};root.setPointerCapture(e.pointerId);
 },options);
 root.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId||isPaused())return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;target.yaw=wrapAngle(target.yaw+dx*.0055);target.pitch=clamp(target.pitch+dy*.0038,-.55,.5);dismissHint();},options);
 const endPointer=()=>{drag=null;stopHold();};for(const event of ['pointerup','pointercancel','lostpointercapture'])root.addEventListener(event,endPointer,options);
 const keys={w:'forward',s:'back',a:'left',d:'right',ArrowUp:'forward',ArrowDown:'back'};
 root.addEventListener('keydown',e=>{if(isPaused()||e.target.closest('button'))return;const key=e.key.length===1?e.key.toLowerCase():e.key;if(keys[key]){e.preventDefault();if(!e.repeat)move(keys[key]);else if(activeKey!==key){activeKey=key;move(keys[key]);setTimeout(()=>{activeKey=null;},220);}}else if(['ArrowLeft','ArrowRight'].includes(key)){e.preventDefault();if(!e.repeat)turn(key==='ArrowLeft'?-1:1);}else if(key==='Home'){e.preventDefault();reset();}},options);
 root.addEventListener('blur',stopHold,options);window.addEventListener('blur',endPointer,options);document.addEventListener('visibilitychange',()=>{if(document.hidden)endPointer();},options);
 const updateProfile=p=>{profile=p;buttons.get('profile').innerHTML=wantedPoster(p);const pouch=buttons.get('daily'),gift=!p.dailyLastDate||p.dailyLastDate<playerDate();pouch.classList.toggle('gift-ready',gift);pouch.querySelector('.courtyard-target-label').textContent=gift?'Daily Gift':'Today’s Path';};
 function render(now){if(!alive)return;frame=requestAnimationFrame(render);if(document.hidden||isPaused()){stopHold();return;}if(now-lastDraw<30)return;lastDraw=now;
  const ease=reduce?1:.24;for(const axis of ['x','z','pitch'])state[axis]+=(target[axis]-state[axis])*ease;state.yaw=wrapAngle(state.yaw+wrapAngle(target.yaw-state.yaw)*ease);
  root.dataset.x=state.x.toFixed(3);root.dataset.z=state.z.toFixed(3);root.dataset.yaw=state.yaw.toFixed(3);
  if(graphics&&!graphics.lost)graphics.render(state,now,reduce);else{const facing=[...COURTYARD_SCENERY.map(p=>({...p,...pointOnPath(p.u)})),COURTYARD_PLACES.find(p=>p.id==='tavern')].sort((a,b)=>Math.abs(wrapAngle(Math.atan2(-(a.x-state.x),-(a.z-state.z))-state.yaw))-Math.abs(wrapAngle(Math.atan2(-(b.x-state.x),-(b.z-state.z))-state.yaw)))[0];const art=facing?.art||'./assets/courtyard/tavern.webp';if(fallbackArt!==art){fallbackArt=art;backdrop.style.backgroundImage=`url("${new URL(art,document.baseURI).href}")`;}backdrop.style.backgroundSize='cover';backdrop.style.backgroundPosition=`50% ${50+state.pitch*35}%`;}
  compass.style.transform=`rotate(${state.yaw}rad)`;
  let nearest=null,nearestAngle=.6;
  for(const place of COURTYARD_PLACES){const button=buttons.get(place.id),p=projectCourtyardPoint(place,state,width,height,fov),distance=distanceTo(state,place),near=distance<=place.range+.12;
   const visible=!!p&&p.x>12&&p.x<width-12&&p.y>30&&p.y<height-105&&(place.id!=='daily'||distance<7);
   button.hidden=!visible;button.classList.toggle('is-near',near);button.dataset.near=String(near);if(!visible)continue;
   button.style.left=p.x+'px';button.style.top=p.y+'px';
   let scale=1;if(place.id==='profile')scale=clamp(p.focal/(p.depth*110),.62,width<600?1.28:1.55);else if(place.id==='daily')scale=clamp(p.focal/(p.depth*120),.65,1.5);button.style.setProperty('--object-scale',scale);
   if(place.id!=='profile')button.setAttribute('aria-label',(near?(place.id==='tavern'?'Enter Tavern':place.id==='daily'?'Open Daily Gift':'Open '+place.name):'Approach '+place.name));
   const angle=Math.abs(wrapAngle(Math.atan2(-(place.x-state.x),-(place.z-state.z))-state.yaw));if(angle<nearestAngle){nearestAngle=angle;nearest=place;}
  }
  placeName.textContent=nearest&&distanceTo(state,nearest)<7?(nearest.id==='profile'||nearest.id==='tavern'?'The Tavern':nearest.id==='daily'?'The Courtyard':nearest.name+' Path'):'The Courtyard';
 }
 const markReady=()=>{if(!alive)return;root.classList.add('scene-ready');root.querySelector('.courtyard-loading').hidden=true;};
 const image=new Image();image.onload=()=>{if(!graphics)markReady();};image.onerror=markReady;image.src=artUrl('panorama.webp');
 buildGraphics(canvas).then(view=>{if(!alive){view?.destroy();return;}graphics=view;if(view){root.classList.add('has-world');view.resize(width,height,fov);}else root.classList.add('courtyard-flat');markReady();}).catch(()=>{root.classList.add('courtyard-flat');markReady();});
 frame=requestAnimationFrame(render);
 return {getState:()=>({...state}),updateProfile,reset,destroy(){if(!alive)return;alive=false;abort.abort();observer.disconnect();stopHold();clearTimeout(returnTimer);cancelAnimationFrame(frame);graphics?.destroy();image.onload=image.onerror=null;}};
}

async function buildGraphics(canvas){
 const THREE=await import('./vendor/three.module.js');
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});}catch{return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.65));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x729bbb);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(70,1,.1,90),textures=[],loader=new THREE.TextureLoader();camera.rotation.order='YXZ';
 const load=async url=>{const t=await loader.loadAsync(url);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.push(t);return t;};
 try{
 const [stone,tavern]=await Promise.all(['cobblestones.webp','tavern.webp'].map(name=>load(artUrl(name))));
 const skyMaterial=new THREE.ShaderMaterial({vertexShader:'varying float skyHeight;void main(){skyHeight=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying float skyHeight;void main(){float t=smoothstep(-.12,.65,skyHeight);vec3 c=mix(vec3(.73,.77,.77),vec3(.28,.55,.78),t);gl_FragColor=vec4(c,1.0);}'});const sphere=new THREE.Mesh(new THREE.SphereGeometry(39,64,32).scale(-1,1,1),skyMaterial);sphere.position.y=EYE_HEIGHT;scene.add(sphere);
 scene.add(await createCourtyardScenery(THREE,load));canvas.dataset.scenery='continuous';
 stone.wrapS=stone.wrapT=THREE.RepeatWrapping;stone.repeat.set(16,16);
 const radial=(size,stops)=>{const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d'),gradient=g.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);for(const [p,color]of stops)gradient.addColorStop(p,color);g.fillStyle=gradient;g.fillRect(0,0,size,size);const t=new THREE.CanvasTexture(c);textures.push(t);return t;};
 const ground=new THREE.Mesh(new THREE.CircleGeometry(36,96),new THREE.MeshBasicMaterial({map:stone,toneMapped:false}));ground.rotation.x=-Math.PI/2;ground.position.y=-.03;scene.add(ground);
 const facade=new THREE.Mesh(new THREE.PlaneGeometry(18,12),new THREE.MeshBasicMaterial({map:tavern,transparent:true,alphaTest:.08,toneMapped:false}));facade.position.set(0,5.85,9.05);facade.rotation.y=Math.PI;scene.add(facade);
 scene.add(new THREE.HemisphereLight(0xfff5dc,0x564b37,2.4));const sun=new THREE.DirectionalLight(0xffe1a8,2);sun.position.set(-7,12,-6);scene.add(sun);
 const life=await courtyardLife(THREE,scene,load);canvas.dataset.ambient='wind leaves birds townspeople';let animationTime=0,previousFrame=null;
 const sparkle=radial(32,[[0,'rgba(255,247,207,1)'],[.15,'rgba(255,224,137,.8)'],[1,'rgba(255,224,137,0)']]);
 const points=new Float32Array(72);for(let i=0;i<24;i++){points[i*3]=Math.sin(i*7.3)*7;points[i*3+1]=.7+(i%7)*.43;points[i*3+2]=Math.cos(i*3.9)*7;}
 const dustGeometry=new THREE.BufferGeometry();dustGeometry.setAttribute('position',new THREE.BufferAttribute(points,3));const dust=new THREE.Points(dustGeometry,new THREE.PointsMaterial({map:sparkle,size:.065,transparent:true,depthWrite:false,opacity:.65,color:0xffe3a0}));scene.add(dust);
 let dead=false,lost=false,lastPose='';canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;canvas.closest('.courtyard-scene')?.classList.remove('has-world');});
 return {get lost(){return lost;},resize(w,h,fov){if(dead)return;lastPose='';camera.aspect=w/h;camera.fov=fov;camera.updateProjectionMatrix();renderer.setSize(w,h,false);},render(s,now,reduced){if(dead||lost)return;const pose=[s.x,s.z,s.pitch,s.yaw].join(',');if(reduced&&pose===lastPose)return;lastPose=pose;camera.position.set(s.x,EYE_HEIGHT,s.z);camera.rotation.set(s.pitch,s.yaw,0,'YXZ');animationTime+=previousFrame===null?0:Math.min((now-previousFrame)/1000,.06);previousFrame=now;if(!reduced){dust.position.y=Math.sin(animationTime*.22)*.13;}life.animate(s,animationTime,reduced);renderer.render(scene,camera);},destroy(){if(dead)return;dead=true;life.dispose();scene.traverse(o=>{o.geometry?.dispose();for(const material of Array.isArray(o.material)?o.material:o.material?[o.material]:[])material.dispose();});textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();}};
 }catch(error){textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();throw error;}
}
