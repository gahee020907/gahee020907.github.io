const orbit = document.querySelector('.research-orbit');

if (orbit) {
  const stage = orbit.querySelector('.orbit-stage');
  const note = orbit.querySelector('.orbit-note');
  const nodes = [...orbit.querySelectorAll('.orbit-node')];
  const defaultNote = note.textContent;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    orbit.addEventListener('pointermove', (event) => {
      const rect = orbit.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      stage.style.setProperty('--orbit-x', x.toFixed(3));
      stage.style.setProperty('--orbit-y', y.toFixed(3));
      orbit.style.setProperty('--glow-x', `${((x + 1) / 2) * 100}%`);
      orbit.style.setProperty('--glow-y', `${((y + 1) / 2) * 100}%`);
    });

    orbit.addEventListener('pointerleave', () => {
      stage.style.setProperty('--orbit-x', 0);
      stage.style.setProperty('--orbit-y', 0);
    });
  }

  nodes.forEach((node) => {
    const showNote = () => {
      nodes.forEach((item) => item.classList.toggle('active', item === node));
      note.textContent = node.dataset.note;
    };
    const resetNote = () => {
      node.classList.remove('active');
      note.textContent = defaultNote;
    };
    node.addEventListener('pointerenter', showNote);
    node.addEventListener('focus', showNote);
    node.addEventListener('pointerleave', resetNote);
    node.addEventListener('blur', resetNote);
  });
}
