export class PerformanceMonitor {
 frames=0;averageMs=0;private samples:number[]=[];private last=0;private start=0;
 constructor(private host:HTMLElement,private degrade:()=>void){}
 sample(now:number){if(!this.start)this.start=now;if(this.last&&now-this.last<250)this.samples.push(now-this.last);this.last=now;this.frames++;if(this.samples.length>120)this.samples.shift();if(this.frames%30===0){this.averageMs=this.samples.reduce((a,b)=>a+b,0)/Math.max(1,this.samples.length);this.host.dataset.frames=String(this.frames);this.host.dataset.frameMs=this.averageMs.toFixed(1);if(now-this.start>5000&&this.samples.length>90&&this.averageMs>45){this.degrade();this.start=now+10000;}}}
 reset(){this.last=0;}
}
