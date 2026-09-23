'use strict';
const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.card');
const count = document.getElementById('result-count');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let visible = 0;
  cards.forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
    if (!card.hidden) visible += 1;
  });
  count.textContent = filter === 'all' ? 'Showing all ' + cards.length + ' animations' : 'Showing ' + visible + ' ' + (filter === 'bicycle' ? 'bicycle rides' : 'lighthouse stories');
}));
document.querySelectorAll('.restart').forEach(button => button.addEventListener('click', () => {
  const frame = button.closest('.card').querySelector('iframe');
  frame.src = frame.getAttribute('src');
}));

const previews = [...document.querySelectorAll('.preview iframe')];
function requestPreviewSize(frame) {
  if (!frame.closest('.card').hidden) frame.contentWindow.postMessage({type: 'pelican-preview-measure'}, '*');
}
window.addEventListener('message', event => {
  if (event.data?.type !== 'pelican-preview-height') return;
  const height = event.data.height;
  if (!Number.isFinite(height) || height <= 0 || height > 20000) return;
  const frame = previews.find(item => item.contentWindow === event.source);
  if (!frame || frame.closest('.card').hidden) return;
  const next = Math.ceil(height) + 'px';
  if (frame.style.height !== next) frame.style.height = next;
});
previews.forEach(frame => frame.addEventListener('load', () => requestPreviewSize(frame)));
window.addEventListener('resize', () => previews.forEach(requestPreviewSize));
filters.forEach(button => button.addEventListener('click', () => requestAnimationFrame(() => previews.forEach(requestPreviewSize))));
previews.forEach(requestPreviewSize);
