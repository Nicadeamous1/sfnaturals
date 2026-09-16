/* Environmental layers only: no scanline distortion and no product transforms. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = (a,b,x) => {const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
  function makeMask(w,h,kind) {
    const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');const image=ctx.createImageData(w,h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const u=x/w,v=y/h;let alpha=0;
      if(kind==='water'){
        alpha=smooth(.13,.155,v)*(1-smooth(.365,.395,v));
        const radius=Math.hypot((u-.5)/.216,(v-.312)/.216);
        alpha*=smooth(1,1.015,radius);
      } else if(kind==='cloud') alpha=(1-smooth(.285,.318,v))*smooth(0,.035,u)*(1-smooth(.965,1,u));
      else {
        alpha=smooth(.015,.045,v)*(1-smooth(.225,.275,v));
        // Fruit remains entirely outside the lighting mask, including blurred fruit edges.
        for(const [cx,cy,rx,ry]of [[.03,.42,.15,.22],[.94,.27,.065,.068],[.36,.115,.073,.085],[.627,.13,.07,.081],[.814,.115,.128,.13],[.991,.025,.072,.07]])alpha*=smooth(1,1.2,Math.hypot((u-cx)/rx,(v-cy)/ry));
        const stone=smooth(.54,.62,u)*(1-smooth(.97,1,u))*smooth(.83,.87,v)*(1-smooth(.96,.995,v));
        alpha=Math.max(alpha,stone);
      }
      const i=(y*w+x)*4;image.data[i]=image.data[i+1]=image.data[i+2]=255;image.data[i+3]=Math.round(alpha*255);
    }ctx.putImageData(image,0,0);return c;
  }
  window.SFEnvironment = function({kind,source,surfaces,canvases,button,panel,observe,label}) {
    const w=kind==='cloud'?355:kind==='dapple'?640:768,h=kind==='cloud'?768:w;
    const buffer=document.createElement('canvas');buffer.width=w;buffer.height=h;const ctx=buffer.getContext('2d');const mask=makeMask(w,h,kind);
    canvases.forEach(c=>{c.width=w;c.height=h;});
    let mediaReady=document.readyState==='complete';
    let video,visible=false,paused=false,frame=0,last=0,elapsed=0,lastTick=0,failed=false,disposed=false;
    const constrained=()=>reduce.matches||navigator.connection?.saveData;
    const allowed=()=>!disposed&&!paused&&!constrained()&&!document.hidden&&visible&&panel?.getAttribute('aria-hidden')!=='true';
    function loadVideo(){if(video||kind!=='water'||!allowed()||!mediaReady||!source.complete||!source.naturalWidth)return;video=document.createElement('video');video.muted=true;video.loop=true;video.playsInline=true;video.preload='auto';video.src='assets/motion/coastal-water.v1.mp4';video.addEventListener('error',()=>{failed=true;sync();});video.play().catch(()=>{failed=true;sync();});}
    function render(seconds){
      ctx.clearRect(0,0,w,h);
      if(kind==='water'){
        if(!video||video.readyState<2)return;
        // The recorded wavefront/foam travels as filmed. A single undistorted video plane.
        ctx.filter='brightness(.88) saturate(.85)';ctx.drawImage(video,0,.13*h,w,.265*h);ctx.filter='none';
      } else if(kind==='cloud'){
        // Rigid wind advection. Two offset passes dissolve over a 24-second closed cycle.
        const phase=(seconds%24)/24,blend=smooth(.78,1,phase),drift=phase*26;
        ctx.drawImage(source,-30+drift,-4,w+60,h+8);
        if(blend){ctx.globalAlpha=blend;ctx.drawImage(source,-30+(phase-1)*26,-4,w+60,h+8);ctx.globalAlpha=1;}
      } else {
        // Defocused branch shadows move together under one wind field; image geometry stays fixed.
        const phase=seconds/16*Math.PI*2;
        ctx.filter='blur(5px)';ctx.fillStyle='rgba(31,46,14,.26)';
        for(let branch=0;branch<6;branch++){
          const sway=Math.sin(phase+branch*.24)*.085+Math.sin(phase*2+branch*.4)*.023;
          for(let leaf=0;leaf<7;leaf++){
            const seed=branch*7+leaf;const x=((seed*137.31)%w)+Math.sin(phase+branch*.24)*17;
            const y=((seed*51.37)%(h*.25));
            ctx.save();ctx.translate(x,y);ctx.rotate(-.65+branch*.25+sway);ctx.beginPath();ctx.ellipse(0,0,22+(seed%4)*4,8+(seed%3)*2,0,0,Math.PI*2);ctx.fill();ctx.restore();
          }
        }
        ctx.fillStyle='rgba(40,43,15,.13)';
        for(let leaf=0;leaf<8;leaf++){ctx.save();ctx.translate(w*(.6+leaf*.045)+Math.sin(phase)*7,h*(.88+(leaf%3)*.032));ctx.rotate(-.6+Math.sin(phase)*.08);ctx.beginPath();ctx.ellipse(0,0,28,8,0,0,Math.PI*2);ctx.fill();ctx.restore();}
        ctx.filter='none';
      }
      ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask,0,0);ctx.globalCompositeOperation='source-over';
      canvases.forEach((c,i)=>{const target=c.getContext('2d');target.clearRect(0,0,w,h);target.drawImage(buffer,0,0);c.dataset.frames=String(+(c.dataset.frames||0)+1);c.dataset.time=seconds.toFixed(3);c.dataset.motion=kind;if(i&&surfaces[i])c.style.transform=surfaces[i].querySelector('img').style.transform;});
    }
    function draw(t){frame=0;if(!allowed()||failed)return;frame=requestAnimationFrame(draw);if(t-last<48)return;const delta=lastTick?Math.min(t-lastTick,100):0;lastTick=t;elapsed+=delta/1000;last=t;if(source.complete&&source.naturalWidth)render(elapsed);}
    function sync(){cancelAnimationFrame(frame);frame=0;lastTick=0;const off=constrained()||failed;canvases.forEach(c=>c.hidden=off);button.disabled=off;button.textContent=off?'Still scene':paused?'Play '+label:'Pause '+label;button.setAttribute('aria-label',button.textContent);button.setAttribute('aria-pressed',String(paused));loadVideo();if(allowed()&&!failed){video?.play().catch(()=>{failed=true;sync();});frame=requestAnimationFrame(draw);}else video?.pause();}
    button.addEventListener('click',()=>{paused=!paused;sync();});const intersection=new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();});intersection.observe(observe);
    const mutation=panel?new MutationObserver(sync):null;mutation?.observe(panel,{attributes:true,attributeFilter:['aria-hidden']});reduce.addEventListener('change',sync);navigator.connection?.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);source.addEventListener('load',sync);window.addEventListener('load',()=>{mediaReady=true;sync();},{once:true});
    addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(frame);video?.pause();intersection.disconnect();mutation?.disconnect();},{once:true});
    // Read-only diagnostics plus deterministic renderer, used by the review harness.
    canvases[0].environment={kind,render,mask,video:()=>video,active:allowed};sync();
  };
})();

