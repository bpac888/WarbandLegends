// Billboards face the viewer's position, while the art faces its projected travel.
// Turning the camera alone must never reverse a pedestrian's apparent stride.
export function walkerFacing(position,viewer,direction,previous=1){
 const yaw=Math.atan2(viewer.x-position.x,viewer.z-position.z),travel=Math.cos(yaw)*direction;
 return {yaw,flip:Math.abs(travel)>.12?Math.sign(travel):previous};
}
export function walkerPosition(seconds,reverse=false){const phase=((seconds%40)+40)%40/40;return {x:(-12+phase*24)*(reverse?-1:1),frame:Math.floor(phase*40*4.4)%4};}
export function advanceWalker(seconds,delta,reverse,z,viewer){
 const position=walkerPosition(seconds,reverse),direction=reverse?-1:1,dx=viewer.x-position.x;
 // Yield to someone in the lane rather than sliding sideways around the camera.
 if(dx*direction>0&&dx*direction<1.15&&Math.abs(viewer.z-z)<.85)return seconds;
 return seconds+Math.max(0,Math.min(.06,delta));
}
// Small, local ambient effects. All motion is paused by the viewer with menus/visibility.
export async function courtyardLife(THREE,scene,load){
 // A tiny hand-drawn leaf texture is geometry decoration, not an edit to any artwork.
 const leafCanvas=document.createElement('canvas');leafCanvas.width=64;leafCanvas.height=32;const lc=leafCanvas.getContext('2d');lc.fillStyle='#c19c4d';lc.beginPath();lc.moveTo(2,16);lc.bezierCurveTo(18,-2,47,0,62,16);lc.bezierCurveTo(42,34,18,32,2,16);lc.fill();lc.strokeStyle='#695027';lc.lineWidth=1.4;lc.beginPath();lc.moveTo(4,16);lc.lineTo(61,16);for(let i=18;i<55;i+=12){lc.moveTo(i,16);lc.lineTo(i+6,7);lc.moveTo(i,16);lc.lineTo(i+5,25);}lc.stroke();const leafTexture=new THREE.CanvasTexture(leafCanvas),leafGeometry=new THREE.PlaneGeometry(.19,.095),leaves=[];
 for(let i=0;i<8;i++){const leaf=new THREE.Mesh(leafGeometry,new THREE.MeshBasicMaterial({map:leafTexture,transparent:true,alphaTest:.1,side:THREE.DoubleSide,color:i%3===0?0xb5c275:0xffffff}));scene.add(leaf);leaves.push(leaf);}
 const wingShape=new THREE.Shape();wingShape.moveTo(0,0);wingShape.bezierCurveTo(.13,.08,.3,.09,.55,-.08);wingShape.bezierCurveTo(.28,-.015,.18,-.04,0,-.03);wingShape.closePath();const wingGeometry=new THREE.ShapeGeometry(wingShape),birdMaterial=new THREE.MeshBasicMaterial({color:0x293a36,side:THREE.DoubleSide}),birds=[];
 for(let i=0;i<2;i++){const bird=new THREE.Group(),left=new THREE.Mesh(wingGeometry,birdMaterial),right=new THREE.Mesh(wingGeometry,birdMaterial);left.scale.x=-1;bird.add(left,right);bird.position.y=8;scene.add(bird);birds.push({bird,left,right});}
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;const sc=shadowCanvas.getContext('2d'),gradient=sc.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'rgba(32,26,17,.42)');gradient.addColorStop(.4,'rgba(32,26,17,.25)');gradient.addColorStop(1,'rgba(32,26,17,0)');sc.fillStyle=gradient;sc.fillRect(0,0,64,64);const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
 const people=[];let previousTime=null;
 for(const [name,z,offset,reverse]of [['villager-woman.webp',-2.2,8,false],['villager-man.webp',-5.2,22,true]]){
  const texture=await load(new URL('../assets/courtyard/'+name,import.meta.url).href);texture.repeat.set(.25,1);
  const height=1.85,material=new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.06,depthWrite:false,toneMapped:false,side:THREE.DoubleSide}),person=new THREE.Mesh(new THREE.PlaneGeometry(height*texture.image.width/4/texture.image.height,height),material);
  person.position.set(0,height/2-.025,z);person.name=name.replace('.webp','');scene.add(person);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(1.15,.54),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,toneMapped:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.012;shadow.name='pedestrian-contact-shadow';scene.add(shadow);
  people.push({person,shadow,texture,z,seconds:offset,reverse});
 }
 return {animate(s,time,reduced){
  const delta=previousTime===null?0:time-previousTime;previousTime=time;
  const gust=(time%26)-5;for(let i=0;i<leaves.length;i++){const leaf=leaves[i],p=(gust-i*.27)/6;leaf.visible=!reduced&&p>=0&&p<=1;if(!leaf.visible)continue;leaf.position.set(-6.5+p*14,1.1+Math.sin(p*Math.PI)*1.3+Math.sin(time*1.4+i)*.1,-2+(i%4)*.9);leaf.rotation.set(time*.65+i,time*.35,Math.sin(time*.8+i));}
  for(let i=0;i<birds.length;i++){const {bird,left,right}=birds[i],t=((time+i*1.7)%42)/15;bird.visible=!reduced&&t<1;if(!bird.visible)continue;bird.position.set(-18+t*36,7.5+i*.8+Math.sin(t*Math.PI)*1.2,-17-i*1.5);const flap=Math.sin(time*4.6+i)*.48;left.rotation.x=flap;right.rotation.x=-flap;bird.rotation.y=-.1;}
  for(const p of people){
   if(!reduced)p.seconds=advanceWalker(p.seconds,delta,p.reverse,p.z,s);
   const pose=walkerPosition(p.seconds,p.reverse);p.person.position.x=pose.x;
   const facing=walkerFacing(p.person.position,s,p.reverse?-1:1,p.person.scale.x);p.person.rotation.y=facing.yaw;p.person.scale.x=facing.flip;
   p.texture.offset.x=(reduced?0:pose.frame)*.25;
   const fade=Math.max(0,Math.min(1,(12-Math.abs(pose.x))/2));p.person.material.opacity=fade;
   p.shadow.position.set(pose.x+.12,.012,p.z+.07);p.shadow.material.opacity=fade;
  }
 },dispose(){leafTexture.dispose();shadowTexture.dispose();}};
}
