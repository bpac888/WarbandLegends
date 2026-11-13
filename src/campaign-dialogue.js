import {AVATARS} from './keeper.js?v=0.49.0';
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escapePattern=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const SPEAKER_ART={Runa:'runa',Auroline:'auroline',Hald:'hald',Lucifer:'lucifer',Yshmir:'yshmir'};
export function speakerIllustration(speaker,avatar){return speaker==='Commander'?`./assets/story/speakers/player-${AVATARS.includes(avatar)?avatar:'frost-viking'}.webp`:SPEAKER_ART[speaker]?`./assets/story/speakers/${SPEAKER_ART[speaker]}.webp`:null;}
const terms=[
 ...['Auroline','Hald','Lucifer','Yshmir','Quill','Chispa','Tessa','Rootmother'].map(text=>({text,kind:'person'})),
 ...['Ashen Gate','Iron Crossroads','Obsidian Gate','Ruin Spire','Dragon’s Tooth','Worldwound Edge','citadel','ridge'].map(text=>({text,kind:'place'})),
 ...['binding spell','enchantment','ritual','apparition'].map(text=>({text,kind:'magic',tone:'magic'})),
 ...['free her','bring her home','leave him alive','binding','medicine','seeds','survivors'].map(text=>({text,kind:'goal'})),
 ...['burning','poison','prisoners','slaves','collapse'].map(text=>({text,kind:'danger'}))
];
const tones=[
 {speaker:'Yshmir',text:'Strike',kind:'danger',tone:'anger'},
 {speaker:'Lucifer',text:'knees',kind:'danger',tone:'anger'},
 {speaker:'Runa',text:'I will not',kind:'danger',tone:'anger'},
 {speaker:'Commander',text:'Stop them',kind:'danger',tone:'anger'},
 {speaker:'Yshmir',text:'peace',kind:'magic',tone:'whisper'},
 {speaker:'Runa',text:'I wanted to believe him',kind:'person',tone:'whisper'},
 {speaker:'Hald',text:'I could not',kind:'person',tone:'whisper'}
];
// Original wording is never rewritten. Accents are sparse; tone beats may still
// play after the three informational highlights have been used.
export function dialogueTokens(text,speaker){
 const entries=[...tones.filter(t=>t.speaker===speaker),...terms].sort((a,b)=>b.text.length-a.text.length),lookup=new Map(entries.map(e=>[e.text.toLowerCase(),e])),pattern=new RegExp('\\b('+entries.map(e=>escapePattern(e.text)).join('|')+')\\b','gi');
 const result=[];let position=0,accents=0;for(const m of text.matchAll(pattern)){if(m.index>position)result.push({text:text.slice(position,m.index)});const e=lookup.get(m[0].toLowerCase());if(e.tone||accents<3){result.push({text:m[0],kind:e.kind,...(e.tone?{tone:e.tone}:{})});accents++;}else result.push({text:m[0]});position=m.index+m[0].length;}if(position<text.length)result.push({text:text.slice(position)});return result;
}
const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter(undefined,{granularity:'grapheme'}):null;
const letters=text=>segmenter?[...segmenter.segment(text)].map(s=>s.segment):Array.from(text);
export function dialogueSpeechHTML(text,speaker){return `<span class="dialogue-accessible sr-only">${escapeHTML(text)}</span><span class="dialogue-visual" aria-hidden="true">${dialogueTokens(text,speaker).map(t=>`<span class="story-word${t.kind?' story-key key-'+t.kind:''}${t.tone?' tone-'+t.tone:''}"${t.tone?` data-tone="${t.tone}"`:''}>${letters(t.text).map(c=>`<span class="story-letter">${escapeHTML(c)}</span>`).join('')}</span>`).join('')}</span>`;}

// Opacity reveals preserve the complete layout from the first frame. One RAF,
// bounded to about 3 seconds per scene; no auto-scroll or blocked Continue.
export function mountCampaignDialogue(root,{reduced=false}={}){
 const lists=[...root.querySelectorAll('.story-dialogue')];if(!lists.length)return ()=>{};
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');let stopped=false,raf=0;
 const cleanup=()=>{cancelAnimationFrame(raf);root.removeEventListener('click',skip);root.removeEventListener('keydown',key);preference.removeEventListener?.('change',changed);};
 const reveal=()=>{if(stopped)return;stopped=true;cleanup();for(const list of lists){list.classList.remove('dialogue-typing');list.dataset.typing='complete';}root.querySelectorAll('.dialogue-turn.is-speaking').forEach(n=>n.classList.remove('is-speaking'));};
 const skip=e=>{if(e.target.closest('.dialogue-bubble'))reveal();};
 const key=e=>{if(e.key===' '&&!e.target.closest('button,input,select,textarea,a,summary')){e.preventDefault();reveal();}};
 const changed=e=>{if(e.matches)reveal();};
 if(reduced||preference.matches)return ()=>{};
 const rows=lists.flatMap(list=>[...list.querySelectorAll('.dialogue-turn')]),count=rows.reduce((n,row)=>n+row.querySelectorAll('.story-letter').length,0),rate=Math.min(8,3200/Math.max(1,count));
 let offset=0;const schedule=[];for(const row of rows){for(const char of row.querySelectorAll('.story-letter')){schedule.push({char,row,at:offset});offset+=rate;}offset+=65;}
 for(const list of lists){list.classList.add('dialogue-typing');list.dataset.typing='active';}
 root.addEventListener('click',skip);root.addEventListener('keydown',key);preference.addEventListener?.('change',changed);
 let index=0,current=null;const start=performance.now();
 const tick=now=>{if(stopped)return;if(!root.isConnected){reveal();return;}while(index<schedule.length&&schedule[index].at<=now-start){const {char,row}=schedule[index++];if(current!==row){current?.classList.remove('is-speaking');current=row;row.classList.add('is-speaking');}char.classList.add('letter-visible');const word=char.parentElement;if(char===word.lastElementChild)word.classList.add('is-spoken');}if(index<schedule.length)raf=requestAnimationFrame(tick);else reveal();};
 raf=requestAnimationFrame(tick);return reveal;
}
