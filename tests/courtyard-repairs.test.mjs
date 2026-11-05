import test from 'node:test';
import assert from 'node:assert/strict';
import {COURTYARD_REPAIRS,courtyardRepairWeight} from '../src/courtyard-repairs.js';

test('restorations are confined to the two reported joins, with solid centers and soft borders',()=>{
 for(const repair of COURTYARD_REPAIRS){
  const [left,right,bottom,top]=repair.bounds;
  for(const {bounds:[l,r,b,t],feather:[x,y]}of repair.regions){
   assert.ok(l>left&&r<right&&b>bottom&&t<top);
   assert.ok(x>0&&x<(r-l)/2&&y>0&&y<(t-b)/2);
   assert.equal(courtyardRepairWeight((l+r)/2,(b+t)/2,repair),1);
  }
  for(let n=0;n<=1000;n++)for(const height of [-1,0,1,4,8,12,16,18]){
   const u=n/1000,weight=courtyardRepairWeight(u,height,repair);
   assert.ok(weight>=0&&weight<=1);
   if(!repair.regions.some(({bounds:[l,r,b,t]})=>u>l&&u<r&&height>b&&height<t))assert.equal(weight,0);
   assert.ok(Math.abs(weight-courtyardRepairWeight(u+1,height,repair))<1e-10);
  }
 }
});
