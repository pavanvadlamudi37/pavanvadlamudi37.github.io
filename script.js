const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.nav-toggle');
const menu = document.querySelector('.site-nav');

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 100);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', event => {
    if (glow) glow.style.transform = `translate(${event.clientX - 210}px, ${event.clientY - 210}px)`;
  });

  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .08}px, ${(event.clientY - rect.top - rect.height / 2) * .12}px)`;
    });
    button.addEventListener('pointerleave', () => button.style.transform = '');
  });
}

const countdown = document.querySelector('[data-countdown]');
const tick = () => {
  if (!countdown) return;
  const now = new Date();
  const remaining = 86400 - (now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds());
  const hours = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');
  countdown.textContent = `${hours}:${minutes}:${seconds}`;
};
tick();
setInterval(tick, 1000);
