const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const links = [...document.querySelectorAll('.nav a[href^="#"]')];

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close' : 'Menu';
});

links.forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = 'Menu';
}));

const sections = [...document.querySelectorAll('main section[id]')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach((section) => observer.observe(section));

document.querySelector('#year').textContent = new Date().getFullYear();

const heroReel = document.querySelector('.hero-reel-video');
if (heroReel && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroReel.removeAttribute('autoplay');
  heroReel.pause();
}

const researchOrbit = document.querySelector('.research-orbit');
if (researchOrbit) {
  const stage = researchOrbit.querySelector('.orbit-stage');
  const nodes = [...researchOrbit.querySelectorAll('.orbit-node')];
  const coreTitle = researchOrbit.querySelector('.orbit-core-title');
  const coreLabel = researchOrbit.querySelector('.orbit-core-label');
  const noteQuestion = researchOrbit.querySelector('.orbit-note-question');
  const noteEvidence = researchOrbit.querySelector('.orbit-note-evidence');
  const noteLink = researchOrbit.querySelector('.orbit-note-link');

  const activateThread = (node) => {
    nodes.forEach((item) => {
      const selected = item === node;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    coreTitle.textContent = node.dataset.title;
    coreLabel.textContent = node.dataset.label;
    noteQuestion.textContent = node.dataset.question;
    noteEvidence.textContent = node.dataset.evidence;
    noteLink.textContent = `${node.dataset.link} →`;
    noteLink.href = node.dataset.href;
  };

  nodes.forEach((node) => {
    node.addEventListener('pointerenter', () => activateThread(node));
    node.addEventListener('focus', () => activateThread(node));
    node.addEventListener('click', () => activateThread(node));
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stage.addEventListener('pointermove', (event) => {
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      stage.style.setProperty('--orbit-x', x.toFixed(3));
      stage.style.setProperty('--orbit-y', y.toFixed(3));
      researchOrbit.style.setProperty('--glow-x', `${((x + 0.5) * 100).toFixed(1)}%`);
      researchOrbit.style.setProperty('--glow-y', `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    stage.addEventListener('pointerleave', () => {
      stage.style.setProperty('--orbit-x', '0');
      stage.style.setProperty('--orbit-y', '0');
      researchOrbit.style.setProperty('--glow-x', '50%');
      researchOrbit.style.setProperty('--glow-y', '50%');
    });
  }
}
