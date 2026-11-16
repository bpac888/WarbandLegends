// Supabase owns password hashing and identity uniqueness. Tokens never enter browser JS.
const COOKIE='warband_session', MAX_BODY=1000000;
class AccountError extends Error { constructor(status,message){super(message);this.status=status;} }
export function createAccountHandler({env=process.env,fetcher=fetch}={}){
 return async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const secure=env.NODE_ENV==='production';
  const cookie=(session,remember=false)=>`${COOKIE}=${session?Buffer.from(JSON.stringify(session)).toString('base64url'):''}; Path=/; HttpOnly; SameSite=Lax${secure?'; Secure':''}${session?(remember?'; Max-Age=2592000':''):'; Max-Age=0'}`;
  const send=(status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body));};
  try{
   if(!['GET','POST'].includes(req.method))throw new AccountError(405,'Method not allowed.');
   if(req.method==='POST'){
    const origin=req.headers.origin,host=req.headers.host;
    if(!origin||new URL(origin).host!==host||(secure&&new URL(origin).protocol!=='https:')||req.headers['sec-fetch-site']==='cross-site')throw new AccountError(403,'Please submit from the game.');
    if(!req.headers['content-type']?.startsWith('application/json'))throw new AccountError(415,'Expected JSON.');
   }
   if(!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY)throw new AccountError(503,'Player accounts are not available yet. Please try again later.');
   const url=new URL(req.url,'http://localhost'),action=url.searchParams.get('action')||'session';
   if(req.method==='GET'&&action!=='session')throw new AccountError(405,'Method not allowed.');
   let input={};
   if(req.method==='POST'){
    if(req.body!==undefined){input=typeof req.body==='string'?JSON.parse(req.body):req.body;if(Buffer.byteLength(JSON.stringify(input))>MAX_BODY)throw new AccountError(413,'Save is too large.');}
    else{let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>MAX_BODY)throw new AccountError(413,'Save is too large.');}input=JSON.parse(raw||'{}');}
    if(!input||typeof input!=='object'||Array.isArray(input))throw new AccountError(400,'Invalid request.');
   }
   const upstream=async(path,{token,method='GET',body}={})=>{
    const response=await fetcher(env.SUPABASE_URL.replace(/\/$/,'')+path,{method,headers:{apikey:env.SUPABASE_ANON_KEY,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
    const data=await response.json().catch(()=>null);return {ok:response.ok,status:response.status,data};
   };
   let session=null;
   try{session=JSON.parse(Buffer.from((req.headers.cookie||'').split(';').map(c=>c.trim()).find(c=>c.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)||'','base64url').toString());}catch{}
   if(action==='login'||action==='register'){
    const email=typeof input.email==='string'?input.email.trim().toLowerCase():'',password=input.password;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)throw new AccountError(400,'Enter a valid email address.');
    if(typeof password!=='string'||password.length<8||password.length>128)throw new AccountError(400,'Use a password with 8–128 characters.');
    const result=await upstream(action==='register'?'/auth/v1/signup':'/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
    if(!result.ok){if(result.status===429)throw new AccountError(429,'Too many attempts. Please wait and try again.');throw new AccountError(400,action==='login'?'Email or password is incorrect.':(result.data?.code==='user_already_exists'?'This email already has an account. Choose Login.':'Registration failed. Try logging in if you already have an account.'));}
    if(!result.data?.access_token){send(200,{confirmationRequired:true,message:'Check your email to confirm your account, then return here and choose Login.'});return;}
    session={access:result.data.access_token,refresh:result.data.refresh_token,remember:input.remember===true};
    res.setHeader('Set-Cookie',cookie(session,session.remember));send(200,{user:{id:result.data.user.id,email:result.data.user.email}});return;
   }
   if(action==='logout'){
    if(session?.access){const result=await upstream('/auth/v1/logout?scope=local',{method:'POST',token:session.access});if(!result.ok&&result.status!==401&&result.status!==403)throw new AccountError(503,'Could not log out. Please try again.');}
    res.setHeader('Set-Cookie',cookie(null));send(200,{ok:true});return;
   }
   if(!session?.access){if(action==='session'){send(200,{user:null});return;}throw new AccountError(401,'Please log in again.');}
   let identity=await upstream('/auth/v1/user',{token:session.access});
   if(identity.status===401||identity.status===403){
    const refreshed=await upstream('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh}});
    if(!refreshed.ok){if(refreshed.status>=500||refreshed.status===429)throw new AccountError(503,'Accounts are temporarily unavailable. Please try again.');res.setHeader('Set-Cookie',cookie(null));throw new AccountError(401,'Your session expired. Please log in again.');}
    session={access:refreshed.data.access_token,refresh:refreshed.data.refresh_token,remember:session.remember===true};
    res.setHeader('Set-Cookie',cookie(session,session.remember));identity=await upstream('/auth/v1/user',{token:session.access});
   }
   if(!identity.ok)throw new AccountError(identity.status>=500?503:401,'Could not verify your session. Please try again.');
   const user={id:identity.data.id,email:identity.data.email};
   if(action==='session'){
    const result=await upstream(`/rest/v1/player_saves?user_id=eq.${encodeURIComponent(user.id)}&select=profile,revision`,{token:session.access});
    if(!result.ok)throw new AccountError(503,'Could not load your saved progress. Please try again.');
    send(200,{user,save:result.data[0]||null});return;
   }
   if(action==='save'){
    if(input.userId!==user.id)throw new AccountError(409,'The signed-in account changed in another tab. Reload before continuing.');
    if(!input.profile||typeof input.profile!=='object'||!input.profile.collection||!Array.isArray(input.profile.team)||input.profile.team.length!==5||!Number.isSafeInteger(input.revision)||input.revision<0)throw new AccountError(400,'Invalid save.');
    const result=await upstream('/rest/v1/rpc/save_player_progress',{token:session.access,method:'POST',body:{new_profile:input.profile,expected_revision:input.revision}});
    if(!result.ok)throw new AccountError(result.data?.code==='P0001'?409:503,result.data?.code==='P0001'?'Progress changed in another tab or device. Reload before continuing.':'Could not save progress. Please try again.');
    send(200,{revision:result.data});return;
   }
   throw new AccountError(404,'Unknown account action.');
  }catch(error){send(error.status||(error instanceof SyntaxError?400:503),{error:error.status?error.message:(error instanceof SyntaxError?'Invalid request.':'Accounts are temporarily unavailable. Please try again.')});}
 };
}
export default createAccountHandler();
