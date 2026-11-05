import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
const root=new URL('../',import.meta.url).pathname;
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--enable-unsafe-swiftshader']});
try{
 const errors=[],context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname!=='legends.local'){errors.push('external '+u.hostname);return route.abort();}
  if(u.pathname==='/capture')return route.fulfill({contentType:'text/html',body:'<style>html,body{margin:0}canvas{display:block}</style>'});
  try{const file=path.join(root,u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(file)]});}
  catch{errors.push('missing '+u.pathname);await route.abort();}
 });
 await context.addInitScript(({key,p})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{key:PROFILE_KEY,p:{...defaultProfile(),helpSeen:true}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://legends.local/capture');
 const comparison=await page.evaluate(async()=>{
  const THREE=await import('/src/vendor/three.module.js');
  const {createCourtyardScenery}=await import('/src/courtyard-scenery.js');
  const {COURTYARD_REPAIRS,courtyardRepairWeight}=await import('/src/courtyard-repairs.js');
  const width=2048,height=512,bottom=-.5,top=18;
  const renderer=new THREE.WebGLRenderer({antialias:false,preserveDrawingBuffer:true});renderer.setSize(width,height);renderer.outputColorSpace=THREE.SRGBColorSpace;document.body.append(renderer.domElement);
  const loader=new THREE.TextureLoader(),textures=new Map(),load=async url=>{if(!textures.has(url)){const t=await loader.loadAsync(url);t.colorSpace=THREE.SRGBColorSpace;textures.set(url,t);}return textures.get(url);};
  const stone=await load('/assets/courtyard/limestone-paving.webp');stone.wrapS=stone.wrapT=THREE.RepeatWrapping;
  const scene=new THREE.Scene(),camera=new THREE.Camera();camera.position.set(0,1.65,1.2);
  const captures=[];
  for(const repairs of [[],COURTYARD_REPAIRS]){
   const scenery=await createCourtyardScenery(THREE,load,stone,repairs),base=scenery.material;
   const prefix=base.fragmentShader.slice(0,base.fragmentShader.lastIndexOf('void main(){'));
   const material=new THREE.ShaderMaterial({uniforms:base.uniforms,toneMapped:false,vertexShader:'varying vec2 captureUV;void main(){captureUV=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'varying vec2 captureUV;'+prefix+`void main(){float angle=captureUV.x*6.28318530718;float y=mix(-.5,18.0,captureUV.y);vec3 floorColor=pavingColor(vec2(sin(angle)*17.55,-cos(angle)*17.55));gl_FragColor=vec4(courtyardPainting(angle,y,floorColor),1.);\n#include <colorspace_fragment>\n}`});
   const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);scene.add(mesh);renderer.render(scene,camera);
   const gl=renderer.getContext(),pixels=new Uint8Array(width*height*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);captures.push(pixels);
   scene.remove(mesh);mesh.geometry.dispose();material.dispose();scenery.geometry.dispose();base.dispose();
  }
  let outside=0,outsideChanged=0;const changed=COURTYARD_REPAIRS.map(()=>0);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const u=(x+.5)/width,h=bottom+(y+.5)/height*(top-bottom),i=(y*width+x)*4;
   const weight=COURTYARD_REPAIRS.map(r=>courtyardRepairWeight(u,h,r));
   const different=[0,1,2].some(c=>captures[0][i+c]!==captures[1][i+c]);
   if(weight.every(w=>w===0)){outside++;if(different)outsideChanged++;}
   else if(different)for(let n=0;n<weight.length;n++)if(weight[n]>0)changed[n]++;
  }
  for(const texture of textures.values())texture.dispose();renderer.dispose();renderer.domElement.remove();
  return {outside,outsideChanged,changed,total:width*height};
 });
 assert.equal(comparison.outsideChanged,0,'original pixels outside the localized masks are unchanged');
 assert.ok(comparison.outside>comparison.total*.9);
 assert.ok(comparison.changed.every(n=>n>1000),'both repairs are rendered');
 await page.goto('http://legends.local/#/home');await page.locator('.has-world').waitFor({timeout:30000});
 const saved=await page.evaluate(k=>localStorage.getItem(k),PROFILE_KEY);
 async function reset(){await page.locator('[data-courtyard-reset]').click();await page.waitForFunction(()=>{const p=document.querySelector('.courtyard-scene').dataset;return Math.abs(+p.x)<.01&&Math.abs(+p.z-1.2)<.01&&Math.abs(+p.yaw)<.01;});}
 async function look(degrees){
  const target=-degrees*Math.PI/180,wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
  for(let i=0;i<9;i++){const yaw=+(await page.locator('.courtyard-scene').getAttribute('data-yaw')),delta=wrap(target-yaw);if(Math.abs(delta)<Math.PI/8+.005)break;await page.getByRole('button',{name:delta>0?'Look left':'Look right',exact:true}).click();await page.waitForTimeout(50);}
  const yaw=+(await page.locator('.courtyard-scene').getAttribute('data-yaw')),delta=wrap(target-yaw),b=await page.locator('.courtyard-scene').boundingBox(),x=b.x+b.width/2,y=b.y+50;
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+delta/.0055,y,{steps:6});await page.mouse.up();
  await page.waitForFunction(target=>{const yaw=+document.querySelector('.courtyard-scene').dataset.yaw;return Math.abs(Math.atan2(Math.sin(yaw-target),Math.cos(yaw-target)))<.015;},target);
 }
 for(const [width,height]of [[390,844],[1440,1000]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(80);
  for(const [id,heading]of [['castle-altar',32],['altar-codex',70]]){
   await reset();await look(heading);await page.screenshot({path:root+`artifacts/courtyard-repair-${id}-${width}.png`});
   for(const direction of ['left','right','forward']){
    await reset();await look(heading);for(let n=0;n<2;n++){await page.locator(`[data-courtyard-move="${direction}"]`).click();await page.waitForTimeout(50);}
    await page.screenshot({path:root+`artifacts/courtyard-repair-${id}-${width}-${direction}.png`});
   }
  }
 }
 await reset();await look(65);const altar=page.locator('[data-courtyard-target="summon"]');
 if(await altar.getAttribute('data-near')!=='true'){await altar.click();await page.waitForFunction(()=>document.querySelector('[data-courtyard-target="summon"]').dataset.near==='true');}
 await altar.click();await page.locator('.altar-actions').waitFor();
 assert.equal(await page.evaluate(k=>localStorage.getItem(k),PROFILE_KEY),saved);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:true,comparison,checks:['original pixels outside both repair masks are byte-for-byte unchanged','both restorations render without shader or asset errors','phone and desktop views inspected from center and after walking left, right and forward','Altar navigation and save data unchanged']},null,2));
}finally{await browser.close();}
