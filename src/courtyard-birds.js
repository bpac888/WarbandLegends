// Small articulated swallows: real depth, tapered feather fans and warm bellies.
// Geometry stays light enough for the courtyard's capped mobile frame rate.
export function createCourtyardBird(THREE){
 const bird=new THREE.Group();bird.name='courtyard-swallow';
 const dark=new THREE.MeshStandardMaterial({color:0x263d50,roughness:.72}),feather=new THREE.MeshStandardMaterial({color:0x486174,roughness:.86}),belly=new THREE.MeshStandardMaterial({color:0xc5bdaa,roughness:.9}),black=new THREE.MeshStandardMaterial({color:0x171e22,roughness:.6});
 function oval(parent,material,position,scale){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),material);mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;}
 oval(bird,dark,[0,0,0],[.105,.095,.28]);oval(bird,belly,[0,-.04,-.025],[.086,.065,.21]);oval(bird,dark,[0,.025,-.24],[.09,.083,.1]);
 const beak=new THREE.Mesh(new THREE.ConeGeometry(.035,.12,8),black);beak.rotation.x=-Math.PI/2;beak.position.set(0,.005,-.35);bird.add(beak);
 for(const side of [-1,1])oval(bird,black,[side*.075,.045,-.285],[.012,.012,.013]);
 function flightFeather(parent,x,z,length,width,angle,material=feather){const mesh=oval(parent,material,[x,0,z],[width,.012,length]);mesh.rotation.y=angle;return mesh;}
 const wings=[];
 for(const side of [-1,1]){
  const pivot=new THREE.Group();pivot.position.set(side*.06,.018,-.045);bird.add(pivot);
  const fan=new THREE.Group();fan.scale.x=side;pivot.add(fan);
  oval(fan,dark,[.19,0,.005],[.25,.035,.11]);
  for(let n=0;n<8;n++)flightFeather(fan,.17+n*.052,.035+n*.012,.17-n*.009,.037,-.5-n*.075,n%2?dark:feather);
  wings.push(pivot);
  flightFeather(bird,side*.06,.31,.23,.035,side*-.24,dark);
 }
 return {bird,left:wings[0],right:wings[1]};
}
export function animateCourtyardBird(model,time,index=0){
 const t=((time+index*1.7)%42)/15,{bird,left,right}=model;bird.visible=t<1;if(!bird.visible)return;
 const phase=time*5.8+index,burst=Math.max(0,Math.sin(time*.8+index)),flap=Math.sin(phase)*(.12+burst*.46);
 bird.position.set(-18+t*36,7.5+index*.8+Math.sin(t*Math.PI)*1.2,-14-index*1.5);
 // Nose (-Z) follows the path; both wings move together in world space.
 bird.rotation.set(0,-Math.PI/2,Math.cos(t*Math.PI)*.10);
 left.rotation.z=-flap;right.rotation.z=flap;
}
