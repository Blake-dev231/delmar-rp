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
const profileAvatar = document.querySelector('#profile-avatar');
const profileAvatarInput = document.querySelector('#profile-avatar-input');
const profileTheme = document.querySelector('#profile-theme');
const adminPanel = document.querySelector('#admin-panel');
const accountList = document.querySelector('#account-list');
const accountForm = document.querySelector('#account-form');
const newAccount = document.querySelector('#new-account');

const roleOptions = ['Owner', 'Server Manager', 'Executive', 'Bussiness Owner', 'Department Administrator', 'Member', 'Moderator', 'Public Safety', 'Medical Services', 'Business', 'Admin', 'Exploring the city', 'Local business', 'Independent civilian'];
const privilegedRoles = new Set(['owner', 'server manager', 'executive', 'admin']);
const defaultAccounts = [{ id: 'owner', name: 'Delmar Owner', role: 'Owner' }, { id: 'alex', name: 'Alex Rivera', role: 'Public Safety' }, { id: 'jordan', name: 'Jordan Lee', role: 'Member' }];
let accounts = JSON.parse(localStorage.getItem('delmar-accounts') || 'null') || defaultAccounts;
let pendingAvatar = '';

const savedProfile = JSON.parse(localStorage.getItem('delmar-profile') || 'null');
if (savedProfile) {
  profileName.value = savedProfile.name || '';
  profileTheme.value = savedProfile.theme || profileTheme.value;
  pendingAvatar = savedProfile.avatar || '';
}

const currentAccount = () => accounts.find((account) => account.id === 'owner');
const applyTheme = (theme) => { document.body.dataset.theme = theme || 'coast'; };
const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const renderAvatar = (avatar, name) => { profileAvatar.textContent = avatar ? '' : (name || 'D').charAt(0).toUpperCase(); profileAvatar.style.backgroundImage = avatar ? `url(${avatar})` : ''; profileAvatar.classList.toggle('has-image', Boolean(avatar)); };
const renderAdminPanel = () => { const isPrivileged = privilegedRoles.has(currentAccount()?.role?.toLowerCase()); adminPanel.hidden = !isPrivileged; if (!isPrivileged) return; accountList.innerHTML = accounts.map((account) => { const safeName = escapeHtml(account.name); const options = roleOptions.includes(account.role) ? roleOptions : [account.role, ...roleOptions]; return `<div class="account-row"><div><strong>${safeName}</strong><small>${account.id === 'owner' ? 'You' : 'Community account'}</small></div><select data-account-id="${account.id}" aria-label="Role for ${safeName}">${options.map((role) => `<option ${role === account.role ? 'selected' : ''}>${role}</option>`).join('')}</select></div>`; }).join(''); };
applyTheme(savedProfile?.theme);
renderAvatar(pendingAvatar, savedProfile?.name);
profileRole.textContent = currentAccount()?.role || 'Member';
renderAdminPanel();

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
  const profile = { name: profileName.value.trim(), theme: profileTheme.value, avatar: pendingAvatar };
  localStorage.setItem('delmar-profile', JSON.stringify(profile));
  applyTheme(profile.theme);
  renderAvatar(profile.avatar, profile.name);
  profileSummary.textContent = profile.name ? `${profile.name} · ${currentAccount().role}` : currentAccount().role;
  setProfileOpen(false);
  toast.textContent = 'Profile saved';
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
});

profileAvatarInput?.addEventListener('change', () => { const file = profileAvatarInput.files?.[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener('load', () => { pendingAvatar = reader.result; renderAvatar(pendingAvatar, profileName.value); }); reader.readAsDataURL(file); });
accountList?.addEventListener('change', (event) => { if (!event.target.matches('[data-account-id]')) return; const account = accounts.find((item) => item.id === event.target.dataset.accountId); if (!account) return; account.role = event.target.value; localStorage.setItem('delmar-accounts', JSON.stringify(accounts)); profileRole.textContent = currentAccount().role; profileSummary.textContent = profileName.value ? `${profileName.value} · ${currentAccount().role}` : currentAccount().role; renderAdminPanel(); toast.textContent = `${account.name} is now ${account.role}`; toast.classList.add('show'); window.setTimeout(() => toast.classList.remove('show'), 2200); });
accountForm?.addEventListener('submit', (event) => { event.preventDefault(); const name = newAccount.value.trim(); if (!name) return; const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`; accounts.push({ id, name, role: 'Member' }); localStorage.setItem('delmar-accounts', JSON.stringify(accounts)); newAccount.value = ''; renderAdminPanel(); });

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
