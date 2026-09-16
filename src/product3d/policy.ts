import type {Quality} from './config';
export function selectQuality(c:{reducedMotion:boolean;saveData:boolean;width:number;memory:number;cores:number;slowNetwork:boolean}):Quality {
 if(c.reducedMotion||c.saveData||c.slowNetwork||c.width<600||c.memory<=2||c.cores<=2)return 'static';
 if(c.width<1100||c.memory<=4||c.cores<=4)return 'reduced';
 return 'full';
}
export function shouldRender(c:{visible:boolean;hidden:boolean;paused:boolean;disposed:boolean}):boolean{return c.visible&&!c.hidden&&!c.paused&&!c.disposed;}
export const clamp=(v:number,min=0,max=1)=>Math.max(min,Math.min(max,v));
export const smooth=(v:number)=>{const x=clamp(v);return x*x*(3-2*x);};
