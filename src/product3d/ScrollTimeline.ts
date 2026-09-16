import type {ProductConfig} from './config';import {clamp,smooth} from './policy';
export function sampleTimeline(stages:ProductConfig['stages'],progress:number){
 const p=clamp(progress,0,stages.length-1),i=Math.floor(p),a=stages[i],b=stages[Math.min(i+1,stages.length-1)],t=smooth((p-i-.2)/.6);
 return {rotation:a.rotation+(b.rotation-a.rotation)*t,lift:a.lift+(b.lift-a.lift)*t,scale:a.scale+(b.scale-a.scale)*t,ingredients:a.ingredients+(b.ingredients-a.ingredients)*t};
}
export class ScrollTimeline {
 constructor(private steps:HTMLElement[]){}
 progress(){const center=innerHeight*.5;let p=0;for(let i=0;i<this.steps.length-1;i++){const a=this.steps[i].getBoundingClientRect(),b=this.steps[i+1].getBoundingClientRect();const ca=a.top+a.height/2,cb=b.top+b.height/2;if(center>=ca)p=i+clamp((center-ca)/(cb-ca));}return p;}
}
