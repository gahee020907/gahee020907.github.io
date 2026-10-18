const tabs = [...document.querySelectorAll('[role="tab"]')];
// Preserve links shared from the previous site.
const legacySections = {'#top':'#about','#research':'#about','#projects':'#work','#socially-visible-sensing':'#work','#see-sense-spark-demo':'#spark-film','#no-time-goodbye-demo':'#goodbye-film','#recognition':'#background'};
function redirectLegacySection() {
  const destination = legacySections[location.hash];
  if (destination) location.replace(destination);
}
window.addEventListener('hashchange', redirectLegacySection);
redirectLegacySection();
function selectThread(tab, focus = false) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectThread(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectThread(tabs[next], true); }
  });
});
function revealPrototype() {
  if (location.hash === '#thinkcap') document.getElementById('thinkcap').open = true;
}
window.addEventListener('hashchange', revealPrototype);
revealPrototype();
const lensBackground = document.getElementById('lens-background');
const lensMotion = document.querySelector('.lens-motion');
const reducedLensMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lensVisible = false;
let lensUserPaused = false;
function syncLensBackground() {
  if (lensVisible && !document.hidden && !lensUserPaused && !reducedLensMotion.matches) {
    lensBackground.play().catch(() => {});
  } else { lensBackground.pause(); }
}
new IntersectionObserver(entries => {
  lensVisible = entries[0].isIntersecting;
  syncLensBackground();
}, {threshold: .2}).observe(lensBackground);
lensMotion.addEventListener('click', () => {
  if (lensBackground.paused) {
    lensUserPaused = false;
    lensBackground.play().catch(() => { lensMotion.textContent = 'Retry playback'; });
  } else { lensUserPaused = true; lensBackground.pause(); }
});
lensBackground.addEventListener('play', () => { lensMotion.textContent = 'Pause'; });
lensBackground.addEventListener('pause', () => { lensMotion.textContent = 'Play'; });
lensBackground.addEventListener('error', () => { lensMotion.textContent = 'Video unavailable'; lensMotion.disabled = true; });
document.addEventListener('visibilitychange', syncLensBackground);
reducedLensMotion.addEventListener('change', syncLensBackground);
// Keep the short clip seekable even on the preview server without byte ranges.
fetch(lensBackground.querySelector('source').src)
  .then(response => { if (!response.ok) throw new Error('Video unavailable'); return response.blob(); })
  .then(blob => {
    const clipURL = URL.createObjectURL(blob);
    lensBackground.src = clipURL;
    lensBackground.load();
    lensBackground.addEventListener('loadeddata', syncLensBackground, {once: true});
    window.addEventListener('pagehide', () => URL.revokeObjectURL(clipURL), {once: true});
  })
  .catch(() => {}); // The original source and poster remain available.
