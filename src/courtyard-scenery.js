// The background, paving and sky share world-space projection and lighting.
export const SCENERY_RADIUS=17.55;
export const SCENERY_BOTTOM=-1.5335,SCENERY_HEIGHT=16.667;
export const COURTYARD_SCENERY=Object.freeze([
 {id:'market-approach',u:.86,halfWidth:.11,art:'./assets/courtyard/market-approach-skyline.webp'},
 {id:'world',u:0,halfWidth:.10,art:'./assets/courtyard/adventure-skyline.webp'},
 {id:'shop',u:.72,halfWidth:.10,leftWidth:.16,art:'./assets/courtyard/market-skyline.webp'},
 {id:'summon',u:.16,halfWidth:.10,art:'./assets/courtyard/altar-skyline.webp'},
 {id:'roster',u:.28,halfWidth:.10,rightWidth:.16,art:'./assets/courtyard/muster-skyline.webp'},
]);
const tau=Math.PI*2;
export function sceneryPoint(u,y=1.65){return {x:Math.sin(u*tau)*SCENERY_RADIUS,y,z:-Math.cos(u*tau)*SCENERY_RADIUS};}
export function sceneryWeight(u,layer){const d=Math.atan2(Math.sin((u-layer.u)*tau),Math.cos((u-layer.u)*tau))/tau,x=d/((d<0?(layer.leftWidth||layer.halfWidth):(layer.rightWidth||layer.halfWidth))*2)+.5;const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};return smooth(x/.09)*smooth((1-x)/.09);}

// Complete crowns stay opaque. The upper transition follows sky colors rather
// than fading a horizontal band through both sky and foliage.
const atmosphere=`
 uniform float atmosphereTime;
 uniform sampler2D skyMap;
 float grain(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float softNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(grain(i),grain(i+vec2(1.,0.)),f.x),mix(grain(i+vec2(0.,1.)),grain(i+1.),f.x),f.y);}
 vec3 courtyardSky(vec3 direction){
  vec3 d=normalize(direction);
  vec2 uv=vec2(fract(atan(d.x,-d.z)/6.28318530718+.5+atmosphereTime*.00018),.20+asin(clamp(d.y,0.0,1.0))*.48);
  return texture2D(skyMap,uv).rgb;
 }
`;
const vertex='varying vec3 worldPoint;varying float circumference;void main(){vec4 p=modelMatrix*vec4(position,1.0);worldPoint=p.xyz;circumference=uv.x;gl_Position=projectionMatrix*viewMatrix*p;}';

export async function createCourtyardScenery(THREE,load,stone=null){
 const sky=await load(new URL('../assets/courtyard/afternoon-sky.webp',import.meta.url).href);sky.wrapS=THREE.RepeatWrapping;
 const uniforms={skyMap:{value:sky},paving:{value:stone},atmosphereTime:{value:0},village:{value:await load(new URL('../assets/courtyard/garden-perimeter.webp',import.meta.url).href)}};
 const layouts=[];
 for(let i=0;i<COURTYARD_SCENERY.length;i++){
  const texture=await load(new URL(COURTYARD_SCENERY[i].art,document.baseURI).href);uniforms['painting'+i]={value:texture};
  const aspect=texture.image?.width&&texture.image?.height?texture.image.width/texture.image.height:1.5,height=25/aspect;layouts.push({height,bottom:6.8-height/2});
 }
 const paintingShader=`
 uniform sampler2D village;
 uniform sampler2D paving;
 ${COURTYARD_SCENERY.map((_,i)=>`uniform sampler2D painting${i};`).join('\n')}
 const float TAU=6.28318530718;
 vec3 pavingColor(vec2 p){
  vec3 stone=texture2D(paving,p/4.5).rgb;
  stone*=mix(.93,1.055,softNoise(p*.16));
  float canopy=smoothstep(.52,.78,softNoise(p*.68+vec2(sin(atmosphereTime*.16)*.07,0.0)));
  return stone*(1.0-canopy*smoothstep(2.0,8.0,abs(p.x))*.16);
 }
 float skyMask(vec3 ink){
  float blue=smoothstep(.04,.14,ink.b-max(ink.r,ink.g*.88));
  float high=min(ink.r,min(ink.g,ink.b)),chroma=max(ink.r,max(ink.g,ink.b))-high;
  return max(blue,smoothstep(.5,.85,high)*(1.0-smoothstep(.08,.3,chroma)));
 }
 vec3 paintView(vec3 below,sampler2D painting,float angle,float y,float center,float leftWidth,float rightWidth,float bottom,float height){
  float delta=angle-center;
  if(delta>3.14159265359)delta-=TAU;
  if(delta< -3.14159265359)delta+=TAU;
  vec2 uv=vec2(delta/((delta<0.0?leftWidth:rightWidth)*2.0)+0.5,(y-bottom)/height);
  if(uv.x<=0.0||uv.x>=1.0||uv.y<=0.0||uv.y>=1.0)return below;
  float feather=smoothstep(0.0,0.09,uv.x)*smoothstep(0.0,0.09,1.0-uv.x);
  vec3 ink=texture2D(painting,uv).rgb;
  float skyEdge=mix(smoothstep(0.0,.007,1.0-uv.y),smoothstep(0.0,.18,1.0-uv.y),skyMask(ink));
  feather*=smoothstep(-.5,1.2,y)*smoothstep(0.0,.025,uv.y)*skyEdge;
  return mix(below,ink,feather);
 }
 vec3 courtyardPainting(float angle,float y,vec3 floorColor){
  vec2 villageUV=vec2(fract(angle/TAU+1.0),clamp((y+9.0)/20.0,.006,.994));
  if(y<=-.5)return floorColor;
  vec3 garden=texture2D(village,villageUV).rgb;
  vec3 color=mix(floorColor,garden,smoothstep(-.5,1.2,y));
  if(y>6.0){vec3 sky=courtyardSky(vec3(sin(angle)*17.55,y,-cos(angle)*17.55)-cameraPosition);float skyBlend=max(smoothstep(10.3,11.0,y),smoothstep(6.0,10.5,y)*skyMask(garden));color=mix(color,sky,skyBlend);}
  ${COURTYARD_SCENERY.map((p,i)=>`color=paintView(color,painting${i},angle,y,${(p.u*tau).toFixed(8)},${((p.leftWidth||p.halfWidth)*tau).toFixed(8)},${((p.rightWidth||p.halfWidth)*tau).toFixed(8)},${layouts[i].bottom.toFixed(7)},${layouts[i].height.toFixed(7)});`).join('\n')}
  return color;
 }
 `;
 const fragment=`varying vec3 worldPoint;varying float circumference;${atmosphere}${paintingShader}
 void main(){
  float angle=3.14159265359-circumference*TAU;
  // Project the paving onto the viewing ray, never vertically stretch a texel row.
  vec3 ray=worldPoint-cameraPosition;
  float groundDistance=-cameraPosition.y/min(ray.y,-.001);
  vec3 floorColor=pavingColor(cameraPosition.xz+ray.xz*groundDistance);
  vec3 color=courtyardPainting(angle,worldPoint.y,floorColor);
  gl_FragColor=vec4(color,1.0);
  #include <colorspace_fragment>
 }`;
 const geometry=new THREE.CylinderGeometry(SCENERY_RADIUS,SCENERY_RADIUS,24,160,1,true),material=new THREE.ShaderMaterial({uniforms,side:THREE.BackSide,transparent:false,depthWrite:true,toneMapped:false,vertexShader:vertex,fragmentShader:fragment});
 const mesh=new THREE.Mesh(geometry,material);mesh.position.y=6.8;mesh.renderOrder=-2;mesh.frustumCulled=false;mesh.name='continuous-courtyard-scenery';mesh.userData.paintingShader=paintingShader;return mesh;
}

// Extending the viewing ray keeps the ground join aligned after walking sideways.
export function projectGroundToScenery(point,camera){
 const dx=point.x-camera.x,dz=point.z-camera.z,a=dx*dx+dz*dz;
 if(a<1e-9)return null;
 const b=camera.x*dx+camera.z*dz,c=camera.x*camera.x+camera.z*camera.z-SCENERY_RADIUS*SCENERY_RADIUS,t=(-b+Math.sqrt(b*b-a*c))/a;
 return {x:camera.x+dx*t,y:camera.y+(point.y-camera.y)*t,z:camera.z+dz*t};
}

export function createCourtyardGround(THREE,scenery,stone){
 stone.wrapS=stone.wrapT=THREE.RepeatWrapping;
 const material=new THREE.ShaderMaterial({uniforms:{...scenery.material.uniforms,paving:{value:stone}},toneMapped:false,vertexShader:vertex,fragmentShader:`
 varying vec3 worldPoint;${atmosphere}${scenery.userData.paintingShader}
 void main(){
  vec2 p=worldPoint.xz;
  vec3 stone=pavingColor(p);
  float blend=smoothstep(7.3,17.4,length(p)+(softNoise(p*.8)-.5)*.7);
  if(blend>0.0){
   vec3 ray=worldPoint-cameraPosition;
   float a=dot(ray.xz,ray.xz),b=dot(cameraPosition.xz,ray.xz),c=dot(cameraPosition.xz,cameraPosition.xz)-${(SCENERY_RADIUS**2).toFixed(8)};
   float t=(-b+sqrt(max(0.0,b*b-a*c)))/max(a,.00001);
   vec3 hit=cameraPosition+ray*t;
   stone=mix(stone,courtyardPainting(atan(hit.x,-hit.z),hit.y,stone),blend);
  }
  gl_FragColor=vec4(stone,1.0);
  #include <colorspace_fragment>
 }`});
 const ground=new THREE.Mesh(new THREE.CircleGeometry(SCENERY_RADIUS+.02,160),material);ground.rotation.x=-Math.PI/2;ground.name='blended-courtyard-paving';return ground;
}

export function createCourtyardSky(THREE,sharedUniforms){
 const material=new THREE.ShaderMaterial({uniforms:{atmosphereTime:sharedUniforms.atmosphereTime,skyMap:sharedUniforms.skyMap},side:THREE.BackSide,depthWrite:false,toneMapped:false,vertexShader:vertex,fragmentShader:`varying vec3 worldPoint;${atmosphere}void main(){gl_FragColor=vec4(courtyardSky(worldPoint-cameraPosition),1.0);\n#include <colorspace_fragment>\n}`});
 const sky=new THREE.Mesh(new THREE.SphereGeometry(39,48,24),material);sky.position.y=1.65;sky.renderOrder=-3;sky.name='courtyard-sky';return sky;
}
