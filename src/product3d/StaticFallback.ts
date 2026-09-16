export class StaticFallback {
 constructor(private host:HTMLElement){}
 show(reason:string){this.host.dataset.state='static';this.host.dataset.reason=reason;this.host.querySelector('canvas')?.setAttribute('hidden','');}
 ready(){this.host.dataset.state='ready';this.host.querySelector('canvas')?.removeAttribute('hidden');}
}
