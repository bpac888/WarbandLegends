// Reuse retired illustrations only while battle portraits are genuinely loading.
const ART=['ruined-gardens','fallen-sanctuary','timekeeper'];
export function mountBattleLoading(root){
 if(!root)return;
 const images=[...root.querySelectorAll('.hero-main>img,.enemy-target>img')];
 if(images.every(img=>img.complete&&img.naturalWidth))return;
 let overlay,timer,timeout;
 const done=()=>{clearTimeout(timer);clearTimeout(timeout);overlay?.remove();};
 timer=setTimeout(()=>{if(!root.isConnected)return;let index=0;try{index=Math.abs(Math.trunc(Number(sessionStorage.getItem('warband-loading-art'))||0))%ART.length;sessionStorage.setItem('warband-loading-art',String((index+1)%ART.length));}catch{}overlay=document.createElement('div');overlay.className='battle-load-art';overlay.setAttribute('role','status');overlay.innerHTML='<img src="./assets/scenes/loading/'+ART[index%ART.length]+'.webp" alt=""><span>Preparing battle…</span>';root.append(overlay);timeout=setTimeout(done,4000);},150);
 Promise.allSettled(images.map(img=>img.decode())).then(done);
}
