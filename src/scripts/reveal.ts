function init(): void {
  if (typeof window === 'undefined') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (reduced) {
    els.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
  );
  els.forEach((el) => io.observe(el));
}

init();
document.addEventListener('astro:page-load', init);
