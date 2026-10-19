import {EFFECTS} from './effects.js';
const paths={
 sword:'M5 19 18 6l2-3-4 2L3 18m1-5 7 7m-8 1 3-3',shield:'M12 3 3 6v6c0 5 9 9 9 9s9-4 9-9V6Z',
 fist:'m5 17-1-7c0-2 3-2 3 0V5c0-2 3-2 3 0V4c0-2 3-2 3 0v1c0-2 3-2 3 0v3c0-2 3-2 3 0v7l-4 6H8Z',
 barrier:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Zm0 5-5 3v3l5 5 5-5v-3Z',
 ward:'m12 2 9 6-3 11H6L3 8Zm-4 9 3 3 6-7',broken:'m12 2 9 6-3 11H6L3 8Zm1 3-3 6 4 1-3 7',
 heart:'M12 20 3 11C-2 3 9-1 12 7c3-8 14-4 9 4Z',
 mana:'m12 2 7 10-7 10-7-10Z',seal:'M6 10V7a6 6 0 0 1 12 0v3M4 10h16v12H4Zm8 4v4',
 'ward-star':'M12 2 3 6v7l9 9 9-9V6Zm0 4 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z',
 taunt:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Zm0 5v7m0 3v1',
 counter:'M4 7h10a7 7 0 0 1 0 14M4 7l5-5M4 7l5 5m10-9-9 14',
 revive:'M4 10a9 9 0 1 1 1 9M4 10V4m0 6h6m2 1v7m-4-3h8',
 poison:'M8 2h8M10 2v6L4 19q-1 3 3 3h10q4 0 3-3L14 8V2M7 15h10m-8 3h1m4 1h1',
 flame:'M13 2c1 6 7 7 7 13a8 8 0 1 1-16 0c0-4 4-8 5-9 0 4 1 5 3 6 2-3 2-6 1-10Z',
 snow:'M12 2v20M3 7l18 10M3 17 21 7M8 4l4 4 4-4M8 20l4-4 4 4M3 11l5-1-1-5m14 8-5 1 1 5',
 drop:'M12 2c3 6 8 9 8 14a8 8 0 0 1-16 0c0-5 5-8 8-14Zm-5 14c0 3 2 4 4 4',
 cleanse:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Zm6 0v5m-2-3h5',
 dispel:'M5 5a10 10 0 1 1-2 12M5 5v6m0-6h6M5 21 21 5m-4 0h4v4',
 area:'M2 2h7v7H2Zm13 0h7v7h-7ZM2 15h7v7H2Zm13 0h7v7h-7Z',
 pierce:'m3 21 18-18m-9 0h9v9M4 4h8M4 4v8m8 8h8v-8',
};
export function effectIcon(id){const icon=EFFECTS[id]?.icon||id;let key=icon,extra='';
 if(icon.startsWith('sword-'))key='sword';if(icon.startsWith('shield-'))key='shield';if(icon.startsWith('mana-'))key='mana';
 if(icon.endsWith('-up'))extra='<path d="m17 9 3-4 3 4m-3-4v9"/>';
 if(icon.endsWith('-down'))extra='<path d="m17 12 3 4 3-4m-3-6v10"/>';
 if(icon==='mana-lock')extra='<path d="m3 21 18-18"/>';
 if(icon==='mana-gift')extra='<path d="M16 3v6m-3-3h6"/>';
 if(icon==='element-down'){key='shield';extra='<path d="M12 7v9m-3-3 3 3 3-3"/>';}
 return `<svg class="effect-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[key]||paths.ward}"/>${extra}</svg>`;
}
