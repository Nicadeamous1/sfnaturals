/* Animate only water pixels sampled from the supplied photograph. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const panel = document.querySelector('.product-balm');
  const source = panel.querySelector('.product-visual img');
  const surfaces = [panel.querySelector('.product-visual'), panel.querySelector('.scene-backdrop')];
  const canvases = surfaces.map(surface => {
    const canvas = document.createElement('canvas');
    canvas.className = 'ocean-motion'; canvas.width = 768; canvas.height = 768;
    canvas.setAttribute('aria-hidden', 'true'); surface.append(canvas); return canvas;
  });
  const size = 768;
  const buffer = document.createElement('canvas'); buffer.width = buffer.height = size;
  const context = buffer.getContext('2d');
  const mask = document.createElement('canvas'); mask.width = mask.height = size;
  const maskContext = mask.getContext('2d');
  // These two rectangles contain only sea. The central round label, jars,
  // horizon and driftwood are outside the mask, with a generous safety margin.
  const regions = [[0,.145,.26,.335],[.745,.145,1,.335]];
  for(const [left,top,right,bottom] of regions){
    const x=left*size,y=top*size,w=(right-left)*size,h=(bottom-top)*size;
    const vertical=maskContext.createLinearGradient(0,y,0,y+h);
    vertical.addColorStop(0,'transparent');vertical.addColorStop(.16,'white');vertical.addColorStop(.82,'white');vertical.addColorStop(1,'transparent');
    maskContext.fillStyle=vertical;maskContext.fillRect(x,y,w,h);
  }
  // Feather the mask horizontally, especially beside the protected label.
  maskContext.globalCompositeOperation='destination-in';
  const horizontal=maskContext.createLinearGradient(0,0,size,0);
  for(const [stop,alpha] of [[0,0],[.015,1],[.235,1],[.26,0],[.745,0],[.77,1],[.985,1],[1,0]])horizontal.addColorStop(stop,`rgba(255,255,255,${alpha})`);
  maskContext.fillStyle=horizontal;maskContext.fillRect(0,0,size,size);
  let visible=false, frame=0, last=0;
  function draw(time){
    frame=0;
    if(preference.matches || document.hidden || !visible || panel.getAttribute('aria-hidden')==='true') return;
    frame=requestAnimationFrame(draw);
    if(time-last<42 || !source.complete || !source.naturalWidth) return;
    last=time;
    context.clearRect(0,0,size,size);
    const seconds=time/1000;
    for(let y=Math.floor(.145*size);y<.335*size;y+=2){
      const depth=(y/size-.145)/(.335-.145);
      const dx=Math.sin(y*.065-seconds*1.05)*2.3*depth;
      const dy=Math.sin(y*.045-seconds*.8)*1.25*depth;
      context.drawImage(source,0,(y+dy)/size*source.naturalHeight,source.naturalWidth,2/size*source.naturalHeight,dx,y,size,2);
    }
    context.globalCompositeOperation='destination-in';context.drawImage(mask,0,0);context.globalCompositeOperation='source-over';
    canvases.forEach(canvas=>{const target=canvas.getContext('2d');target.clearRect(0,0,size,size);target.drawImage(buffer,0,0);});
    canvases[1].style.transform=surfaces[1].querySelector('img').style.transform;
  }
  function sync(){
    canvases.forEach(canvas=>canvas.hidden=preference.matches);
    if(frame)cancelAnimationFrame(frame); frame=0;
    if(!preference.matches && !document.hidden && visible && panel.getAttribute('aria-hidden')!=='true')frame=requestAnimationFrame(draw);
  }
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(document.querySelector('.scene-pin'));
  preference.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  new MutationObserver(sync).observe(panel,{attributes:true,attributeFilter:['aria-hidden']});
  source.addEventListener('load',sync);sync();
})();
