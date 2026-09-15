const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('shown'); observer.unobserve(entry.target); }
  }), {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-photo');
  const texture = document.querySelector('.texture-stage');
  const textureImage = document.querySelector('.texture-frame img');
  let pending = false;
  function animateScroll() {
    const h = hero.getBoundingClientRect();
    if (h.bottom > 0) heroImage.style.transform = `translateY(${Math.max(0, -h.top) * .14}px) scale(1.06)`;
    const t = texture.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - t.top) / (innerHeight + t.height)));
    textureImage.style.transform = `scale(${1.17 - progress * .13}) translateY(${(progress-.5)*24}px)`;
    document.querySelectorAll('.scene-backdrop img').forEach(image => {const section=image.closest('article').getBoundingClientRect();const progress=Math.max(-1,Math.min(1,section.top/innerHeight));image.style.transform='scale(1.12) translateY('+(-progress*3)+'%)';});
    pending = false;
  }
  addEventListener('scroll', () => {if (!pending) {pending = true; requestAnimationFrame(animateScroll);}}, {passive:true});
  animateScroll();
}
const dialog = document.querySelector('#product-dialog');
let previousFocus;
function closeDialog() { dialog.close(); document.body.style.overflow = ''; previousFocus?.focus(); }
const products = [{"id":"balm","name":"Tallow","last":"Balm","image":"tallow-balm.jpg","alt":"Supplied SF Tallow Balm artwork at the beach","scent":"Orange & frankincense","badge":"SUPPLIED PRODUCT ARTWORK","note":"Supplied product artwork. Final formula, size, price, and availability are awaiting confirmation."},{"id":"soap","name":"Beef Tallow","last":"Soap","image":"soap-sunset.jpg","alt":"Supplied orange-label SF tallow soap with pink and purple sunset, ocean, and rocks","scent":"Orange essential oil","badge":"SUPPLIED PRODUCT ARTWORK","note":"Supplied orange-label artwork. Final product details, size, price, and availability are awaiting confirmation."},{"id":"lotion","name":"Homemade","last":"Lotion","image":"lotion-citrus-concept.png","alt":"Illustrative lotion packaging in a sunlit citrus grove based on the supplied SF label","scent":"Orange & frankincense","badge":"PACKAGING CONCEPT","note":"Supplied lotion label. Final formula, packaging, size, price, and availability are awaiting confirmation."}];
document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
  const product = products.find(p => p.id === button.dataset.product);
  previousFocus = button;
  document.querySelector('#dialog-title').textContent = product.name + ' ' + product.last;
  document.querySelector('#dialog-scent').textContent = product.scent;
  const photo = document.querySelector('.dialog-image img');
  photo.src = 'assets/' + product.image;
  photo.alt = product.alt;
  document.querySelector('#dialog-artwork').textContent = product.badge === 'PACKAGING CONCEPT' ? 'Illustrative packaging mockup; final packaging pending' : 'Supplied artwork; final details pending';
  dialog.showModal(); document.body.style.overflow = 'hidden';
}));
document.querySelectorAll('.close-dialog,.close-action').forEach(button => button.addEventListener('click', closeDialog));
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('click', event => {if(event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(); }});

if (!reduced) {
 const stage=document.querySelector('.scene-scroll');
 const panels=[...stage.querySelectorAll('article')];
 document.documentElement.classList.add('cinematic');
 let queued=false;
 const updateScenes=()=>{
  const bounds=stage.getBoundingClientRect();
  const timeline=Math.max(0,Math.min(3,-bounds.top/(stage.offsetHeight-innerHeight)*3));
  const progress=timeline<.5?0:timeline<1?(timeline-.5)*2:timeline<1.8?1:timeline<2.3?1+(timeline-1.8)*2:2;
  const active=Math.round(progress);
  panels.forEach((panel,i)=>{
   const entrance=Math.max(0,Math.min(1,progress-(i-1)));
   const eased=entrance*entrance*(3-2*entrance);
   panel.style.opacity=i===0?'1':String(eased);
   panel.style.zIndex=String(i+1);
   panel.inert=i!==active;
   panel.setAttribute('aria-hidden',String(i!==active));
   const contentOpacity=Math.max(0,1-2*Math.abs(progress-i));
   panel.querySelectorAll(':scope > .product-visual,:scope > .product-copy').forEach(el=>{
    el.style.opacity=String(contentOpacity);
    el.style.transform='translateY('+((i-progress)*26)+'px)';
   });
  });queued=false;
 };
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateScenes)}},{passive:true});
 addEventListener('resize',updateScenes);
 updateScenes();
}
