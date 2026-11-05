import test from 'node:test';
import assert from 'node:assert/strict';
import {DOOR_POSTER,projectDoorPoster,projectCourtyardPoint} from '../src/courtyard.js';
test('poster corners stay on the door plane across walking, turning and looking',()=>{
 const p=DOOR_POSTER;
 for(const [width,height,fov] of [[390,720,76],[1440,900,65]])for(const state of [{x:0,z:1.2,yaw:Math.PI,pitch:0},{x:.8,z:4,yaw:2.9,pitch:.18},{x:-1.2,z:5.5,yaw:-2.8,pitch:-.1}]){
  const projected=projectDoorPoster(state,width,height,fov);assert.ok(projected);
  for(const [i,[u,v]]of [[0,0],[p.width,0],[p.width,p.height],[0,p.height]].entries()){
   const expected=projectCourtyardPoint({x:p.x+(p.width/2-u)*p.unitsPerPixel,y:p.y+(p.height/2-v)*p.unitsPerPixel,z:p.z},state,width,height,fov);
   assert.ok(Math.abs(expected.x-projected.corners[i].x)<1e-7);assert.ok(Math.abs(expected.y-projected.corners[i].y)<1e-7);
  }
 }
});
test('paper has a constant size relative to the door at different distances',()=>{
 const p=DOOR_POSTER;let ratio;
 for(const z of [1.2,3,6.1]){const state={x:0,z,yaw:Math.PI,pitch:0},q=projectDoorPoster(state,390,720,76),left=projectCourtyardPoint({x:1.2,y:p.y,z:p.z},state,390,720,76),right=projectCourtyardPoint({x:-1.2,y:p.y,z:p.z},state,390,720,76),value=(q.corners[1].x-q.corners[0].x)/(right.x-left.x);if(ratio!==undefined)assert.ok(Math.abs(value-ratio)<1e-9);ratio=value;}
});
test('poster is hidden behind the camera and flat fallback stays attached to the backdrop',()=>{
 assert.equal(projectDoorPoster({x:0,z:1.2,yaw:0,pitch:0},390,720,76),null);
 const a=projectDoorPoster({x:0,z:1.2,yaw:Math.PI,pitch:.1},390,720,76,{flat:true}),b=projectDoorPoster({x:2,z:5,yaw:2.8,pitch:.1},390,720,76,{flat:true});assert.deepEqual(a,b);
});
