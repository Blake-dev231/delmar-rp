const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const copyButton = document.querySelector('.copy-button');
const toast = document.querySelector('.toast');

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

copyButton?.addEventListener('click', async () => {
  const serverAddress = copyButton.dataset.copy;
  try {
    await navigator.clipboard.writeText(serverAddress);
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2200);
  } catch {
    copyButton.querySelector('.copy-label').textContent = serverAddress;
  }
});

const playerCount = document.querySelector('#player-count');
let onlinePlayers = 86;
window.setInterval(() => {
  onlinePlayers += Math.random() > 0.52 ? 1 : -1;
  onlinePlayers = Math.max(70, Math.min(104, onlinePlayers));
  if (playerCount) playerCount.textContent = `${onlinePlayers} / 160`;
}, 7000);