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
    pending = false;
  }
  addEventListener('scroll', () => {if (!pending) {pending = true; requestAnimationFrame(animateScroll);}}, {passive:true});
  animateScroll();
}
const dialog = document.querySelector('#product-dialog');
let previousFocus;
function closeDialog() { dialog.close(); document.body.style.overflow = ''; previousFocus?.focus(); }
document.querySelectorAll('[data-details]').forEach(button => button.addEventListener('click', () => {
  previousFocus = button; dialog.showModal(); document.body.style.overflow = 'hidden';
}));
document.querySelectorAll('.close-dialog,.close-action').forEach(button => button.addEventListener('click', closeDialog));
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('click', event => {if(event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(); }});
