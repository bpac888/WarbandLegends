import {runChampionshipRequest} from './championship-service.js';
const MAX_BODY=1000000;
const fail=(status,message)=>{const error=Error(message);error.status=status;throw error;};
const secureRandomInt=(min,max)=>{const range=max-min,limit=Math.floor(0x100000000/range)*range,buffer=new Uint32Array(1);do{crypto.getRandomValues(buffer);}while(buffer[0]>=limit);return min+buffer[0]%range;};
async function readBody(request){
 if(!request.headers.get('content-type')?.startsWith('application/json'))fail(415,'Expected JSON.');
 if(!request.body)return {};const reader=request.body.getReader(),decoder=new TextDecoder();let size=0,text='';
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BODY){await reader.cancel();fail(413,'Save is too large.');}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}finally{reader.releaseLock();}
 const input=JSON.parse(text||'{}');if(!input||typeof input!=='object'||Array.isArray(input))fail(400,'Invalid request.');return input;
}
// Web-standard handler shared by the deployed Deno function and integration tests.
export function createSupabaseEdgeHandler({env,roster,fetcher=(...args)=>fetch(...args)}={}){
 const allowed=new Set((env.ALLOWED_ORIGINS||'https://bpac888.github.io').split(',').map(s=>s.trim()).filter(Boolean));
 return async request=>{
  const origin=request.headers.get('origin'),url=new URL(request.url),action=url.searchParams.get('action')||'session';
  const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(allowed.has(origin)?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Max-Age':'600'}:{})};
  const send=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
  try{
   if(action==='health'&&request.method==='GET')return send({service:'warband',ready:!!(env.SUPABASE_URL&&env.SUPABASE_ANON_KEY&&env.SUPABASE_SERVICE_ROLE_KEY)});
   if(!origin||!allowed.has(origin))fail(403,'Please open the game at its official address.');
   if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
   if(!['GET','POST'].includes(request.method))fail(405,'Method not allowed.');
   if(request.method==='GET'&&!['session','championship-dashboard'].includes(action))fail(405,'Method not allowed.');
   if(!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY)fail(503,'Player accounts are not available yet. Please try again later.');
   const input=request.method==='POST'?await readBody(request):{};
   const upstream=async(path,{token,admin=false,method='GET',body}={})=>{
    const key=admin?env.SUPABASE_SERVICE_ROLE_KEY:env.SUPABASE_ANON_KEY;
    const response=await fetcher(env.SUPABASE_URL.replace(/\/$/,'')+path,{method,headers:{apikey:key,'Content-Type':'application/json',...((token||admin)?{Authorization:'Bearer '+(admin?key:token)}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
    return {ok:response.ok,status:response.status,data:await response.json().catch(()=>null)};
   };
   if(action==='login'||action==='register'){
    const email=typeof input.email==='string'?input.email.trim().toLowerCase():'',password=input.password;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)fail(400,'Enter a valid email address.');
    if(typeof password!=='string'||password.length<8||password.length>128)fail(400,'Use a password with 8–128 characters.');
    const result=await upstream(action==='register'?'/auth/v1/signup':'/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
    if(!result.ok){if(result.status===429)fail(429,'Too many attempts. Please wait and try again.');fail(400,action==='login'?'Email or password is incorrect.':result.data?.code==='user_already_exists'?'This email already has an account. Choose Login.':'Registration failed. Try logging in if you already have an account.');}
    if(!result.data?.access_token)return send({confirmationRequired:true,message:'Check your email to confirm your account, then return here and choose Login.'});
    const data=result.data,user={id:data.user.id,email:data.user.email};return send({user,session:{access_token:data.access_token,refresh_token:data.refresh_token,expires_at:data.expires_at,expires_in:data.expires_in,user}});
   }
   if(action==='refresh'){
    if(typeof input.refreshToken!=='string'||input.refreshToken.length<1||input.refreshToken.length>4096)fail(400,'Please log in again.');
    const result=await upstream('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:input.refreshToken}});
    if(!result.ok)fail(result.status===429?429:result.status>=500?503:401,'Could not refresh your session. Please log in again.');
    const data=result.data,user={id:data.user.id,email:data.user.email};return send({session:{access_token:data.access_token,refresh_token:data.refresh_token,expires_at:data.expires_at,expires_in:data.expires_in,user}});
   }
   const token=request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
   if(!token){if(action==='session')return send({user:null});fail(401,'Please log in again.');}
   const identity=await upstream('/auth/v1/user',{token});
   if(!identity.ok)fail([401,403].includes(identity.status)?401:503,'Your session expired or could not be verified. Please log in again.');
   const user={id:identity.data.id,email:identity.data.email};
   if(action==='logout'){
    if(input.userId&&input.userId!==user.id)fail(409,'The signed-in account changed. Reload before logging out.');
    const result=await upstream('/auth/v1/logout?scope=local',{method:'POST',token});if(!result.ok&&![401,403].includes(result.status))fail(503,'Could not log out. Please try again.');return send({ok:true});
   }
   if(action==='session'){
    const result=await upstream(`/rest/v1/player_saves?user_id=eq.${encodeURIComponent(user.id)}&select=profile,revision`,{token});
    if(!result.ok)fail(503,'Could not load your saved progress. Please try again.');return send({user,save:result.data[0]||null});
   }
   if(action==='save'){
    if(input.userId!==user.id)fail(409,'The signed-in account changed in another tab. Reload before continuing.');
    if(!input.profile||typeof input.profile!=='object'||!input.profile.collection||!Array.isArray(input.profile.team)||input.profile.team.length!==5||!Number.isSafeInteger(input.revision)||input.revision<0)fail(400,'Invalid save.');
    const result=await upstream('/rest/v1/rpc/save_player_progress',{token,method:'POST',body:{new_profile:input.profile,expected_revision:input.revision}});
    if(!result.ok)fail(result.data?.code==='P0001'?409:503,result.data?.code==='P0001'?'Progress changed in another tab or device. Reload before continuing.':'Could not save progress. Please try again.');return send({revision:result.data});
   }
   if(action.startsWith('championship-'))return send(await runChampionshipRequest({action,input,user,upstream,configured:!!env.SUPABASE_SERVICE_ROLE_KEY,roster,randomUUID:()=>crypto.randomUUID(),randomInt:secureRandomInt}));
   fail(404,'Unknown account action.');
  }catch(error){return send({error:error.status?error.message:error instanceof SyntaxError?'Invalid request.':'Accounts are temporarily unavailable. Please try again.'},error.status||(error instanceof SyntaxError?400:503));}
 };
}
