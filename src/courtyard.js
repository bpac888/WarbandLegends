// The courtyard is presentation state only: moving never spends Energy or changes a save.
export const COURTYARD_START=Object.freeze({x:0,z:1.2,yaw:0,pitch:0});
export const EYE_HEIGHT=1.65,STEP_LENGTH=1.45,COURTYARD_RADIUS=7.1;
const tau=Math.PI*2;
export const wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
export const pointOnPath=(u,r=9)=>({x:Math.sin(u*tau)*r,z:-Math.cos(u*tau)*r});
export const COURTYARD_PLACES=Object.freeze([
 {id:'world',name:'Adventure',...pointOnPath(0),y:1.7,range:5,art:'./assets/courtyard/adventure-path.webp',color:0xe4c48a,u:0},
 {id:'summon',name:'The Altar',...pointOnPath(.16),y:1.7,range:4.8,art:'./assets/altar/portal-wide.webp',color:0xbb8aef,u:.16},
 {id:'roster',name:'Codex',...pointOnPath(.28),y:1.7,range:4.8,art:'./assets/courtyard/muster-path.webp',color:0x93c8a8,u:.28},
 {id:'shop',name:'Shop',...pointOnPath(.72),y:1.7,range:4.8,art:'./assets/courtyard/market-path.webp',color:0xedba72,u:.72},
 {id:'profile',name:'Wanted Poster',x:.42,z:8.65,y:2.15,range:4.3},
 {id:'tavern',name:'Enter Tavern',x:0,z:8.65,y:.65,range:4.7},
 {id:'daily',name:'Daily Gift',x:-3.1,z:.2,y:.48,range:2.5},
]);
export const distanceTo=(state,place)=>Math.hypot(state.x-place.x,state.z-place.z);
export function constrainPosition(x,z){const r=Math.hypot(x,z);if(r>COURTYARD_RADIUS){x*=COURTYARD_RADIUS/r;z*=COURTYARD_RADIUS/r;}if(x>5.7&&z<1.5)x=5.7;return {x,z:Math.min(z,6.1)};}
export function stepCourtyard(state,direction,amount=STEP_LENGTH){const vectors={forward:[0,-1],back:[0,1],left:[-1,0],right:[1,0]},v=vectors[direction];if(!v)return {...state};const [dx,dz]=v,c=Math.cos(state.yaw),s=Math.sin(state.yaw);return {...state,...constrainPosition(state.x+(dx*c+dz*s)*amount,state.z+(-dx*s+dz*c)*amount)};}
export function approachPlace(state,place){const dx=place.x-state.x,dz=place.z-state.z,d=Math.hypot(dx,dz),walk=Math.max(0,d-place.range+.45);return {...state,...constrainPosition(state.x+dx/(d||1)*walk,state.z+dz/(d||1)*walk),yaw:Math.atan2(-dx,-dz),pitch:place.id==='daily'?-.22:place.id==='profile'?.18:0};}
export function projectCourtyardPoint(point,state,width,height,fov=70){
 const dx=point.x-state.x,dy=(point.y??1.65)-EYE_HEIGHT,dz=point.z-state.z,c=Math.cos(state.yaw),s=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch);
 const right=c*dx-s*dz,depth=-s*cp*dx+sp*dy-c*cp*dz,up=s*sp*dx+cp*dy+c*sp*dz;
 if(depth<=.12)return null;const focal=height/(2*Math.tan(fov*Math.PI/360));return {x:width/2+right/depth*focal,y:height/2-up/depth*focal,depth,focal};
}
