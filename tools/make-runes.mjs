// Original vector rune artwork: faceted crystal, engraved metal and raised emblems.
import {mkdir,writeFile} from 'node:fs/promises';
const designs={
 red:{name:'Ember',light:'#ffc791',mid:'#c24926',dark:'#4a111b',rim:'#edb982',points:'78,15 178,15 237,74 237,176 178,237 78,237 19,176 19,74',icon:'<path d="M32 5c5 13 17 17 17 31 0 11-8 19-18 19S13 48 13 37c0-10 7-18 14-25-2 11 1 15 6 17 4-7 2-15-1-24Z"/><path d="M32 34c4 6 8 8 8 13a8 8 0 0 1-16 0c0-5 4-9 8-13Z" fill="#a13220"/>'},
 green:{name:'Verdant',light:'#d1edab',mid:'#3b9a65',dark:'#103c30',rim:'#d6c79c',points:'48,15 208,15 237,48 233,169 207,212 128,243 49,212 23,169 19,48',icon:'<path d="M53 9C54 40 39 57 19 45 2 28 25 10 53 9Z"/><path d="m14 53 30-32M26 39l-2-12m9 5 11 1" fill="none" stroke="#286c4e" stroke-width="3" stroke-linecap="round"/>'},
 blue:{name:'Frost',light:'#d4f3ff',mid:'#3f8dc3',dark:'#112f61',rim:'#b6d1e3',points:'77,15 179,15 236,73 236,179 179,237 77,237 20,179 20,73',icon:'<path d="M32 6v52M9 19l46 26M9 45l46-26M23 10l9 8 9-8M23 54l9-8 9 8M10 28l12-3-1-12M54 36l-12 3 1 12M10 36l12 3-1 12M54 28l-12-3 1-12" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'},
 yellow:{name:'Radiant',light:'#fff5bc',mid:'#d8a337',dark:'#745027',rim:'#ffe4aa',points:'128,10 233,49 225,168 194,215 128,243 62,215 31,168 23,49',icon:'<path d="m32 4 6 16 16-6-6 16 13 5-16 6 6 15-16-6-5 13-6-16-15 6 6-16-13-5 16-6-6-15 16 6Z" transform="translate(1 -2) scale(.95)"/><circle cx="32" cy="32" r="9" fill="#9b702e"/><circle cx="32" cy="32" r="5" fill="#fff1b0"/>'},
 purple:{name:'Umbral',light:'#edcbff',mid:'#9460bf',dark:'#35204f',rim:'#cdb8e0',points:'128,9 243,122 222,154 128,245 34,154 13,122',icon:'<path d="M42 7a24 24 0 1 0 13 37A23 23 0 0 1 42 7Z"/><path d="m46 17 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>'},
};
await mkdir('assets/runes',{recursive:true});
for(const [id,d]of Object.entries(designs)){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${d.name} rune">
 <defs>
 <linearGradient id="metal" x2=".8" y2="1"><stop stop-color="#fbefd4"/><stop offset=".22" stop-color="${d.rim}"/><stop offset=".48" stop-color="#526274"/><stop offset=".7" stop-color="#263345"/><stop offset=".9" stop-color="${d.rim}"/><stop offset="1" stop-color="#8e7c66"/></linearGradient>
 <radialGradient id="crystal" cx=".35" cy=".16" r=".94"><stop stop-color="${d.light}"/><stop offset=".37" stop-color="${d.mid}"/><stop offset="1" stop-color="${d.dark}"/></radialGradient>
 <linearGradient id="gleam" x2=".5" y2="1"><stop stop-color="#fffce9" stop-opacity=".75"/><stop offset=".4" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
 <linearGradient id="crest" x2=".5" y2="1"><stop stop-color="#fffdf2"/><stop offset=".5" stop-color="#f7e8c6"/><stop offset="1" stop-color="#bba17c"/></linearGradient>
 <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="#020a12" flood-opacity=".75"/></filter>
 <clipPath id="cut"><polygon points="${d.points}" transform="translate(128 128) scale(.835) translate(-128 -128)"/></clipPath>
 </defs>
 <polygon points="${d.points}" fill="#071321" stroke="#040a12" stroke-width="9" stroke-linejoin="round" transform="translate(0 4)"/>
 <polygon points="${d.points}" fill="url(#metal)" stroke="#d3c8ae" stroke-opacity=".55" stroke-width="1.6" stroke-linejoin="round"/>
 <polygon points="${d.points}" fill="#152534" stroke="#102130" stroke-width="3" transform="translate(128 128) scale(.9) translate(-128 -128)"/>
 <polygon points="${d.points}" fill="url(#crystal)" stroke="${d.light}" stroke-opacity=".7" stroke-width="2" transform="translate(128 128) scale(.835) translate(-128 -128)"/>
 <g clip-path="url(#cut)">
 <path d="m18 15 110 54 110-54-12 100-57-22-41-24-43 26-66 22Z" fill="url(#gleam)"/>
 <path d="m18 15 67 80-19 74-48 69Zm220 0-69 78 21 76 48 69Z" fill="#fff" opacity=".09"/>
 <path d="m18 238 48-69 62 31 62-31 48 69-110 32Z" fill="#040e25" opacity=".28"/>
 <path d="m18 15 67 80m153-80-69 78M18 238l48-69m172 69-48-69" stroke="${d.light}" stroke-opacity=".35" stroke-width="1.4"/>
 <ellipse cx="113" cy="42" rx="90" ry="29" fill="#fff" opacity=".12"/>
 <path d="m61 76 16-16m5-5 9-9m94 130-12 12" stroke="#fff" opacity=".2" stroke-width="2"/>
 </g>
 <polygon points="${d.points}" fill="none" stroke="${d.light}" stroke-opacity=".26" stroke-width="1.4" transform="translate(128 128) scale(.76) translate(-128 -128)"/>
 <g fill="none" stroke="${d.rim}" stroke-opacity=".7" stroke-width="1.4"><path d="m90 31 13 6-7 4 11 4m59-14-13 6 7 4-11 4M66 205l12-3 2 8 10-1m100-4-12-3-2 8-10-1"/></g>
 <g fill="#fff7d7" opacity=".7"><circle cx="128" cy="24" r="2.4"/><circle cx="128" cy="228" r="2.4"/></g>
 <g transform="translate(64 61) scale(2)" fill="url(#crest)" color="#f7f4e6" filter="url(#shadow)">${d.icon}</g>
 <path d="m66 44 12-3-10 7Z" fill="#fff9e6" opacity=".7"/>
 </svg>`;
 await writeFile(`assets/runes/${id}.svg`,svg);
}
console.log('Created five original resolution-independent rune artworks.');
