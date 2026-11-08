// undefined: still a tap/ambiguous movement; null: swipe points outside the board.
export function swipeTarget(index,dx,dy,{tileSize=48,finish=false}={}){
 const x=Math.abs(dx),y=Math.abs(dy),threshold=Math.max(8,Math.min(12,tileSize*.2));
 if(Math.max(x,y)<threshold||!finish&&Math.max(x,y)<Math.min(x,y)*1.15)return undefined;
 const horizontal=x>y,delta=horizontal?(dx>0?1:-1):(dy>0?7:-7),target=index+delta;
 return target<0||target>=35||horizontal&&Math.floor(target/7)!==Math.floor(index/7)?null:target;
}
