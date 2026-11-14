import {chooseAutoAction} from './auto-battle.js?v=0.49.2';
self.onmessage=({data})=>{try{self.postMessage({id:data.id,action:chooseAutoAction(data.state)});}catch{self.postMessage({id:data.id,error:true});}};
