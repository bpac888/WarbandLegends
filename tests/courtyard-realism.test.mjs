import test from 'node:test';import assert from 'node:assert/strict';
import * as THREE from '../src/vendor/three.module.js';
import {walkerFacing,walkerPosition,advanceWalker} from '../src/courtyard-life.js';
import {projectGroundToScenery,SCENERY_RADIUS} from '../src/courtyard-scenery.js';

test('pedestrians face their projected travel from either side and throughout a full circle',()=>{
 const position={x:2,z:-2};
 for(const reverse of [false,true])for(let degrees=0;degrees<360;degrees+=5){
  const angle=degrees*Math.PI/180,viewer={x:position.x+6*Math.sin(angle),z:position.z+6*Math.cos(angle)},direction=reverse?-1:1;
  const facing=walkerFacing(position,viewer,direction),camera=new THREE.PerspectiveCamera(70,1,.1,50);
  camera.position.set(viewer.x,1.65,viewer.z);camera.lookAt(position.x,1.65,position.z);camera.updateMatrixWorld();
  const current=new THREE.Vector3(position.x,1.65,position.z).project(camera),next=new THREE.Vector3(position.x+direction*.01,1.65,position.z).project(camera);
  if(Math.abs(Math.cos(angle))>.13)assert.equal(Math.sign(next.x-current.x),facing.flip,'nose follows visible travel at '+degrees);
  // Looking elsewhere changes camera yaw, not the person's actual orientation.
  assert.deepEqual(walkerFacing(position,{...viewer,yaw:Math.PI},direction),facing);
 }
});
test('walking stops beside a player in the lane without lateral skating or advancing the gait',()=>{
 for(const reverse of [false,true]){const seconds=18,position=walkerPosition(seconds,reverse),direction=reverse?-1:1;
  assert.equal(advanceWalker(seconds,.033,reverse,-2,{x:position.x+direction*.7,z:-2}),seconds);
  assert.ok(advanceWalker(seconds,.033,reverse,-2,{x:position.x-direction*.7,z:-2})>seconds);
  assert.ok(advanceWalker(seconds,.033,reverse,-2,{x:position.x+direction*.7,z:0})>seconds);
  const next=walkerPosition(seconds+.06,reverse);assert.equal(Math.sign(next.x-position.x),direction);assert.ok(Math.abs(next.x-position.x)<.04);
 }
});
test('ground projections align with the scenery from the center and every walkable side',()=>{
 for(const [x,z]of [[0,1.2],[6,-2],[-6,-2],[0,6.1],[0,-7]])for(let angle=0;angle<Math.PI*2;angle+=.17){
  const camera={x,y:1.65,z},target={x:Math.sin(angle)*SCENERY_RADIUS,y:0,z:-Math.cos(angle)*SCENERY_RADIUS};
  const hit=projectGroundToScenery(target,camera);assert.ok(Math.abs(hit.y)<1e-9);assert.ok(Math.hypot(hit.x-target.x,hit.z-target.z)<1e-9);
  const ground={x:Math.sin(angle)*10,y:0,z:-Math.cos(angle)*10},extension=projectGroundToScenery(ground,camera);
  assert.ok(Math.abs(Math.hypot(extension.x,extension.z)-SCENERY_RADIUS)<1e-9);
  const a=new THREE.Vector3(ground.x-x,-1.65,ground.z-z).normalize(),b=new THREE.Vector3(extension.x-x,extension.y-1.65,extension.z-z).normalize();assert.ok(a.distanceTo(b)<1e-9);
 }
});
