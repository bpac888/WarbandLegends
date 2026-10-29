// One opaque curved background keeps adjacent views stable through a full turn.
// Each painting is blended in world angles, rather than sorted as an overlapping plane.
export const SCENERY_RADIUS=17.55;
export const SCENERY_BOTTOM=-1.5335,SCENERY_HEIGHT=16.667;
export const COURTYARD_SCENERY=Object.freeze([
 {id:'market-approach',u:.86,halfWidth:.11,art:'./assets/courtyard/market-approach.webp'},
 {id:'world',u:0,halfWidth:.10,art:'./assets/courtyard/adventure-path.webp'},
 {id:'shop',u:.72,halfWidth:.10,art:'./assets/courtyard/market-path.webp'},
 {id:'summon',u:.16,halfWidth:.10,art:'./assets/courtyard/altar-path.webp'},
 {id:'roster',u:.28,halfWidth:.10,art:'./assets/courtyard/muster-path.webp'},
]);
const tau=Math.PI*2;
export function sceneryPoint(u,y=1.65){return {x:Math.sin(u*tau)*SCENERY_RADIUS,y,z:-Math.cos(u*tau)*SCENERY_RADIUS};}
export function sceneryWeight(u,layer){const d=Math.atan2(Math.sin((u-layer.u)*tau),Math.cos((u-layer.u)*tau))/tau,x=d/(layer.halfWidth*2)+.5;const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};return smooth(x/.14)*smooth((1-x)/.14);}
export async function createCourtyardScenery(THREE,load){
 const uniforms={village:{value:await load(new URL('../assets/courtyard/panorama.webp',import.meta.url).href)}};
 const layouts=[];
 for(let i=0;i<COURTYARD_SCENERY.length;i++){const texture=await load(new URL(COURTYARD_SCENERY[i].art,document.baseURI).href);uniforms['painting'+i]={value:texture};const aspect=texture.image?.width&&texture.image?.height?texture.image.width/texture.image.height:1.5,height=25/aspect;layouts.push({height,bottom:6.8-height/2});}
 const fragment=`
 varying vec3 worldPoint;
 varying float circumference;
 uniform sampler2D village;
 ${COURTYARD_SCENERY.map((_,i)=>`uniform sampler2D painting${i};`).join('\n')}
 const float TAU=6.28318530718;
 vec3 paintView(vec3 below,sampler2D painting,float angle,float center,float halfWidth,float bottom,float height){
  float delta=angle-center;
  if(delta>3.14159265359)delta-=TAU;
  if(delta< -3.14159265359)delta+=TAU;
  vec2 uv=vec2(delta/(halfWidth*2.0)+0.5,(worldPoint.y-bottom)/height);
  if(uv.x<=0.0||uv.x>=1.0||uv.y<=0.0||uv.y>=1.0)return below;
  float feather=smoothstep(0.0,0.14,uv.x)*smoothstep(0.0,0.14,1.0-uv.x);
  feather*=smoothstep(0.0,0.015,uv.y)*smoothstep(0.0,0.025,1.0-uv.y);
  return mix(below,texture2D(painting,uv).rgb,feather);
 }
 void main(){
  float angle=3.14159265359-circumference*TAU;
  vec2 villageUV=vec2(fract(angle/TAU+1.0),clamp((worldPoint.y+9.0)/20.0,0.0,1.0));
  vec3 sky=mix(vec3(0.30,0.40,0.48),vec3(0.08,0.23,0.46),smoothstep(5.0,16.0,worldPoint.y));
  vec3 color=mix(texture2D(village,villageUV).rgb,sky,smoothstep(7.5,13.0,worldPoint.y));
  ${COURTYARD_SCENERY.map((p,i)=>`color=paintView(color,painting${i},angle,${(p.u*tau).toFixed(8)},${(p.halfWidth*tau).toFixed(8)},${layouts[i].bottom.toFixed(7)},${layouts[i].height.toFixed(7)});`).join('\n')}
  gl_FragColor=vec4(color,1.0);
  #include <colorspace_fragment>
 }`;
 const geometry=new THREE.CylinderGeometry(SCENERY_RADIUS,SCENERY_RADIUS,24,160,1,true),material=new THREE.ShaderMaterial({uniforms,side:THREE.BackSide,transparent:false,depthWrite:true,toneMapped:false,vertexShader:'varying vec3 worldPoint;varying float circumference;void main(){vec4 p=modelMatrix*vec4(position,1.0);worldPoint=p.xyz;circumference=uv.x;gl_Position=projectionMatrix*viewMatrix*p;}',fragmentShader:fragment});
 const mesh=new THREE.Mesh(geometry,material);mesh.position.y=6.8;mesh.renderOrder=-2;mesh.frustumCulled=false;mesh.name='continuous-courtyard-scenery';return mesh;
}
