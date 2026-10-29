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
 const approach=COURTYARD_SCENERY.find(p=>p.id==='market-approach');assert.equal(sceneryWeight(.86,approach),1);
 for(let n=0;n<=3600;n++){const u=n/3600;assert.ok(COURTYARD_SCENERY.every(p=>sceneryWeight(u,p)>=0&&sceneryWeight(u,p)<=1));for(const p of COURTYARD_SCENERY)assert.ok(Math.abs(sceneryWeight(u+.00001,p)-sceneryWeight(u,p))<.002);}
 assert.ok(sceneryWeight(.995,COURTYARD_SCENERY.find(p=>p.id==='world'))>.9);assert.ok(sceneryWeight(.005,COURTYARD_SCENERY.find(p=>p.id==='world'))>.9);
});
test('only the courtyard Altar uses the new distant painting; destinations remain reachable',()=>{
 const altar=COURTYARD_PLACES.find(p=>p.id==='summon');assert.equal(altar.art,'./assets/courtyard/altar-path.webp');assert.ok(SCENERY_RADIUS>Math.hypot(altar.x,altar.z));assert.equal(COURTYARD_PLACES.find(p=>p.id==='world').art,'./assets/courtyard/adventure-path.webp');
});
