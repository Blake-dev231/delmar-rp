const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const toast = document.querySelector('.toast');
const profileButton = document.querySelector('.nav-profile');
const profilePanel = document.querySelector('.profile-panel');
const profileBackdrop = document.querySelector('.profile-backdrop');
const profileClose = document.querySelector('.profile-close');
const profileForm = document.querySelector('.profile-form');
const profileName = document.querySelector('#profile-name');
const profileRole = document.querySelector('#profile-role');
const profileSummary = document.querySelector('#profile-summary');

const savedProfile = JSON.parse(localStorage.getItem('delmar-profile') || 'null');
if (savedProfile) {
  profileName.value = savedProfile.name || '';
  profileRole.value = savedProfile.role || profileRole.value;
  profileSummary.textContent = savedProfile.name ? `${savedProfile.name} · ${savedProfile.role}` : savedProfile.role;
}

const setProfileOpen = (isOpen) => {
  profilePanel.hidden = !isOpen;
  profileBackdrop.hidden = !isOpen;
  profileButton.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) profileName.focus();
};

profileButton?.addEventListener('click', () => setProfileOpen(true));
profileClose?.addEventListener('click', () => setProfileOpen(false));
profileBackdrop?.addEventListener('click', () => setProfileOpen(false));
profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const profile = { name: profileName.value.trim(), role: profileRole.value };
  localStorage.setItem('delmar-profile', JSON.stringify(profile));
  profileSummary.textContent = profile.name ? `${profile.name} · ${profile.role}` : profile.role;
  setProfileOpen(false);
  toast.textContent = 'Profile saved';
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !profilePanel.hidden) setProfileOpen(false);
});

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
