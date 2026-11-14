import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';import {PROFILE_KEY} from '../src/storage.js';import {ASCENSION_CAPS} from '../src/ascension.js';
const root=new URL('../',import.meta.url).pathname,{chromium}=createRequire(import.meta.url)('playwright'),roster=JSON.parse(await fs.readFile(root+'data/champions.json'));
for(const clip of ['zero-singularity','the-king','alkyron-starbreaker','malzhur-abyss']){
 const info=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_name,level,pix_fmt','-of','json',root+'assets/cinematics/'+clip+'.mp4']));
 assert.equal(info.streams.length,1);assert.equal(info.streams[0].codec_name,'h264');assert.ok(info.streams[0].level<=31,clip+' must support mobile H.264 Level 3.1');assert.equal(info.streams[0].pix_fmt,'yuv420p');
}
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[],videos=[];
 await fs.mkdir(root+'artifacts',{recursive:true});
 await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.pathname.endsWith('.mp4'))videos.push(u.pathname);try{const f=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await r.fulfill({body:await fs.readFile(f),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.mp4':'video/mp4','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(f)]});}catch{errors.push('Missing '+u.pathname);await r.abort();}});


 const p={...defaultProfile(),onboardingDismissed:true,helpSeen:true,cinematicsEnabled:true};
 await context.addInitScript(({p,key})=>{localStorage.setItem(key,JSON.stringify(p));sessionStorage.setItem('warband-intro-seen','1');},{p,key:PROFILE_KEY});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'no-preference'});
 for(const id of ['neon_singularity_reaper','the_king','alkyron_starbreaker','abyss_lord']){
 await page.goto('http://upgrade.local/#/champion/'+id);
 const v=page.locator('.detail-motion');await v.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>{const v=document.querySelector('.detail-motion');return v?.classList.contains('playing')&&v.currentTime>0;});
 assert.ok(await v.evaluate(v=>v.muted&&v.playsInline));
 await page.screenshot({path:root+'artifacts/detail-'+id+'.png'});
 await page.waitForFunction(()=>!document.querySelector('.detail-motion')?.classList.contains('playing'));
 }
 assert.equal(videos.length,4);assert.deepEqual(errors,[]);console.log('PASS: all four full clips autoplay muted inline and return to still artwork.');
}finally{await browser.close();}
