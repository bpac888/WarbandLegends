import test from 'node:test';import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {COURTYARD_SCENERY,SCENERY_RADIUS,sceneryPoint,sceneryWeight,createCourtyardScenery} from '../src/courtyard-scenery.js';
import {COURTYARD_PLACES} from '../src/courtyard.js';
test('the Altar and its adjacent views are on one opaque inward-facing surface from every walkable viewpoint',async()=>{
 const before=globalThis.document;globalThis.document={baseURI:'https://legends.local/index.html'};
 try{const scenery=await createCourtyardScenery(THREE,async()=>new THREE.Texture());scenery.updateMatrixWorld(true);assert.equal(scenery.material.transparent,false);assert.equal(scenery.material.side,THREE.BackSide);assert.equal(scenery.frustumCulled,false);
  for(const [x,z]of [[0,1.2],[5.5,-3],[-5.5,-3],[0,6.1]])for(const u of [.12,.14,.16,.18,.20,.22,.24,.26,.28,.30]){const target=sceneryPoint(u,7.4),origin=new THREE.Vector3(x,1.65,z),direction=new THREE.Vector3(target.x,target.y,target.z).sub(origin).normalize(),ray=new THREE.Raycaster(origin,direction),hits=ray.intersectObject(scenery);assert.ok(hits.length>0,`${x},${z} at ${u}`);assert.ok(Math.abs(hits[0].distance-origin.distanceTo(new THREE.Vector3(target.x,target.y,target.z)))<.02);}
  scenery.geometry.dispose();scenery.material.dispose();
 }finally{if(before===undefined)delete globalThis.document;else globalThis.document=before;}
});
test('scenery blends continuously across the wrap between Shop and Adventure',()=>{
 const approach=COURTYARD_SCENERY.find(p=>p.id==='market-adventure');assert.equal(sceneryWeight(.86,approach),1);
 for(let n=0;n<=3600;n++){const u=n/3600;assert.ok(COURTYARD_SCENERY.every(p=>sceneryWeight(u,p)>=0&&sceneryWeight(u,p)<=1));for(const p of COURTYARD_SCENERY)assert.ok(Math.abs(sceneryWeight(u+.00001,p)-sceneryWeight(u,p))<.002);}
 assert.ok(sceneryWeight(.995,COURTYARD_SCENERY.find(p=>p.id==='market-adventure'))>.9);assert.ok(sceneryWeight(.005,COURTYARD_SCENERY.find(p=>p.id==='market-adventure'))>.9);
});
test('only the courtyard Altar uses the new distant painting; destinations remain reachable',()=>{
 const altar=COURTYARD_PLACES.find(p=>p.id==='summon');assert.equal(altar.art,'./assets/courtyard/altar-skyline.webp');assert.ok(SCENERY_RADIUS>Math.hypot(altar.x,altar.z));assert.equal(COURTYARD_PLACES.find(p=>p.id==='world').art,'./assets/courtyard/adventure-skyline.webp');
});
test('the fading outer edges of Shop and Codex sit behind the foreground Tavern',()=>{
 const facade=new THREE.Mesh(new THREE.PlaneGeometry(18,12),new THREE.MeshBasicMaterial());facade.position.set(0,5.85,9.05);facade.rotation.y=Math.PI;facade.updateMatrixWorld();
 for(const id of ['roster']){const p=COURTYARD_SCENERY.find(p=>p.id===id),left=id==='shop',span=left?p.leftWidth:p.rightWidth;
  for(const [x,z]of [[0,1.2],[6.5,-2],[-6.5,-2],[0,-7],[0,6.1]])for(const f of [.01,.04,.08]){
   const u=p.u+(left?-1:1)*span*(1-f*2),target=sceneryPoint(u,1.65),origin=new THREE.Vector3(x,1.65,z),point=new THREE.Vector3(target.x,target.y,target.z),hits=new THREE.Raycaster(origin,point.clone().sub(origin).normalize()).intersectObject(facade);
   assert.ok(hits.length&&hits[0].distance<origin.distanceTo(point),`${id} backdrop join is hidden at ${x},${z}`);
  }
 }
 facade.geometry.dispose();facade.material.dispose();
});
