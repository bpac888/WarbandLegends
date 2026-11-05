// The courtyard is presentation state only: moving never spends Energy or changes a save.
export const COURTYARD_START=Object.freeze({x:0,z:1.2,yaw:0,pitch:0});
export const EYE_HEIGHT=1.65,STEP_LENGTH=1.45,COURTYARD_RADIUS=7.1;
export const DOOR_POSTER=Object.freeze({x:.42,y:2.15,z:9.02,width:92,height:168,unitsPerPixel:.008});
const tau=Math.PI*2;
export const wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
export const pointOnPath=(u,r=9)=>({x:Math.sin(u*tau)*r,z:-Math.cos(u*tau)*r});
export const COURTYARD_PLACES=Object.freeze([
 {id:'world',name:'Adventure',...pointOnPath(0),y:1.7,range:5,art:'./assets/courtyard/adventure-skyline.webp',color:0xe4c48a,u:0},
 {id:'summon',name:'The Altar',...pointOnPath(.16),y:1.7,range:4.8,art:'./assets/courtyard/altar-skyline.webp',color:0xbb8aef,u:.16},
 {id:'roster',name:'Codex',...pointOnPath(.28),y:1.7,range:4.8,art:'./assets/courtyard/muster-skyline.webp',color:0x93c8a8,u:.28},
 {id:'shop',name:'Shop',...pointOnPath(.72),y:1.7,range:4.8,art:'./assets/courtyard/market-skyline.webp',color:0xedba72,u:.72},
 {id:'profile',name:'Wanted Poster',x:DOOR_POSTER.x,z:DOOR_POSTER.z,y:DOOR_POSTER.y,range:4.3},
 {id:'tavern',name:'Enter Tavern',x:0,z:8.65,y:.65,range:4.7},
 {id:'daily',name:'Daily Gift',x:-3.1,z:.2,y:.48,range:2.5},
]);
export const distanceTo=(state,place)=>Math.hypot(state.x-place.x,state.z-place.z);
export function constrainPosition(x,z){const r=Math.hypot(x,z);if(r>COURTYARD_RADIUS){x*=COURTYARD_RADIUS/r;z*=COURTYARD_RADIUS/r;}return {x,z:Math.min(z,6.1)};}
export function stepCourtyard(state,direction,amount=STEP_LENGTH){const vectors={forward:[0,-1],back:[0,1],left:[-1,0],right:[1,0]},v=vectors[direction];if(!v)return {...state};const [dx,dz]=v,c=Math.cos(state.yaw),s=Math.sin(state.yaw);return {...state,...constrainPosition(state.x+(dx*c+dz*s)*amount,state.z+(-dx*s+dz*c)*amount)};}
export function approachPlace(state,place){const dx=place.x-state.x,dz=place.z-state.z,d=Math.hypot(dx,dz),walk=Math.max(0,d-place.range+.45);return {...state,...constrainPosition(state.x+dx/(d||1)*walk,state.z+dz/(d||1)*walk),yaw:Math.atan2(-dx,-dz),pitch:place.id==='daily'?-.22:place.id==='profile'?.18:0};}
export function projectCourtyardPoint(point,state,width,height,fov=70){
 const dx=point.x-state.x,dy=(point.y??1.65)-EYE_HEIGHT,dz=point.z-state.z,c=Math.cos(state.yaw),s=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch);
 const right=c*dx-s*dz,depth=-s*cp*dx+sp*dy-c*cp*dz,up=s*sp*dx+cp*dy+c*sp*dz;
 if(depth<=.12)return null;const focal=height/(2*Math.tan(fov*Math.PI/360));return {x:width/2+right/depth*focal,y:height/2-up/depth*focal,depth,focal};
}

// Project the entire door-mounted plane, not a camera-facing screen label.
export function projectDoorPoster(state,width,height,fov=70,{flat=false}={}){
 const p=DOOR_POSTER,w=p.width,h=p.height,k=p.unitsPerPixel;
 let a,b,c,d,e,f,g,j;
 if(flat){
  const scale=Math.max(width/1536,height/1024),unit=1536/18*k*scale;
  a=e=unit;b=d=g=j=0;
  c=(width-1536*scale)/2+( .5-p.x/18)*1536*scale-w*unit/2;
  f=(height-1024*scale)*(.5+state.pitch*.35)+(1-(p.y+.15)/12)*1024*scale-h*unit/2;
 }else{
  const x=p.x+w*k/2-state.x,y=p.y+h*k/2-EYE_HEIGHT,z=p.z-state.z;
  const cy=Math.cos(state.yaw),sy=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch),focal=height/(2*Math.tan(fov*Math.PI/360));
  const depth=-sy*cp*x+sp*y-cy*cp*z,right=cy*x-sy*z,up=sy*sp*x+cp*y+cy*sp*z;
  if(depth<=.12)return null;
  g=sy*cp*k/depth;j=-sp*k/depth;
  a=width/2*g-focal*cy*k/depth;b=width/2*j;c=width/2+focal*right/depth;
  d=height/2*g+focal*sy*sp*k/depth;e=height/2*j+focal*cp*k/depth;f=height/2-focal*up/depth;
 }
 const at=(u,v)=>{const depth=g*u+j*v+1;return depth<=0?null:{x:(a*u+b*v+c)/depth,y:(d*u+e*v+f)/depth};};
 const corners=[[0,0],[w,0],[w,h],[0,h]].map(([u,v])=>at(u,v));if(corners.some(p=>!p))return null;
 return {transform:`matrix3d(${[a,d,0,g,b,e,0,j,0,0,1,0,c,f,0,1].join(',')})`,corners,center:at(w/2,h/2)};
}
