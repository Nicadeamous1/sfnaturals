export class InteractionController {
 x=0;y=0;private abort=new AbortController();
 constructor(host:HTMLElement,change:()=>void){host.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=host.getBoundingClientRect();this.x=(e.clientX-r.left)/r.width-.5;this.y=(e.clientY-r.top)/r.height-.5;change();},{signal:this.abort.signal});host.addEventListener('pointerleave',()=>{this.x=0;this.y=0;change();},{signal:this.abort.signal});}
 dispose(){this.abort.abort();}
}
