const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const toast = document.querySelector('.toast');
const profileButton = document.querySelector('.nav-profile');
const adminButton = document.querySelector('.nav-admin');
const profilePanel = document.querySelector('.profile-panel');
const adminDrawer = document.querySelector('.admin-drawer');
const profileBackdrop = document.querySelector('.profile-backdrop');
const profileClose = document.querySelector('.profile-close');
const adminClose = document.querySelector('.admin-close');
const profileForm = document.querySelector('.profile-form');
const profileName = document.querySelector('#profile-name');
const profileRole = document.querySelector('#profile-role');
const profileSummary = document.querySelector('#profile-summary');
const profileAvatar = document.querySelector('#profile-avatar');
const profileAvatarInput = document.querySelector('#profile-avatar-input');
const profileTheme = document.querySelector('#profile-theme');
const accountList = document.querySelector('#account-list');
const accountForm = document.querySelector('#account-form');
const newAccount = document.querySelector('#new-account');

const roleOptions = ['Owner', 'Server Manager', 'Executive', 'Bussiness Owner', 'Department Administrator', 'Member', 'Moderator', 'Public Safety', 'Medical Services', 'Business', 'Admin', 'Exploring the city', 'Local business', 'Independent civilian'];
const defaultAccounts = [{ id: 'owner', name: 'Delmar Owner', roles: ['Owner', 'Admin'] }, { id: 'alex', name: 'Alex Rivera', roles: ['Public Safety'] }, { id: 'jordan', name: 'Jordan Lee', roles: ['Member'] }];
let accounts = JSON.parse(localStorage.getItem('delmar-accounts') || 'null') || defaultAccounts;
accounts = accounts.map((account) => { const roles = Array.isArray(account.roles) ? account.roles : [account.role || 'Member']; if (account.id === 'owner' && !roles.some((role) => role.toLowerCase() === 'admin')) roles.push('Admin'); return { ...account, roles }; });
localStorage.setItem('delmar-accounts', JSON.stringify(accounts));
const accountRoles = (account) => account?.roles || ['Member'];
const hasRole = (account, role) => accountRoles(account).some((accountRole) => accountRole.toLowerCase() === role.toLowerCase());
const roleSummary = (account) => accountRoles(account).join(' · ') || 'No role assigned';
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
const renderAdminPanel = () => { const isAdmin = hasRole(currentAccount(), 'Admin'); adminButton.hidden = !isAdmin; if (!isAdmin) { adminDrawer.hidden = true; return; } accountList.innerHTML = accounts.map((account) => { const safeName = escapeHtml(account.name); const roles = accountRoles(account); return `<div class="account-row"><div><strong>${safeName}</strong><small>${account.id === 'owner' ? 'You' : roleSummary(account)}</small></div><div class="role-picker" aria-label="Roles for ${safeName}">${roleOptions.map((role) => `<label><input type="checkbox" data-account-id="${account.id}" data-role="${role}" ${roles.some((accountRole) => accountRole.toLowerCase() === role.toLowerCase()) ? 'checked' : ''} />${role}</label>`).join('')}</div></div>`; }).join(''); };
applyTheme(savedProfile?.theme);
renderAvatar(pendingAvatar, savedProfile?.name);
profileRole.textContent = roleSummary(currentAccount());
renderAdminPanel();

const setProfileOpen = (isOpen) => {
  profilePanel.hidden = !isOpen;
  if (isOpen) { adminDrawer.hidden = true; adminButton.setAttribute('aria-expanded', 'false'); }
  profileBackdrop.hidden = !isOpen;
  profileButton.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) profileName.focus();
};

profileButton?.addEventListener('click', () => setProfileOpen(true));
profileClose?.addEventListener('click', () => setProfileOpen(false));
const setAdminOpen = (isOpen) => { adminDrawer.hidden = !isOpen; if (isOpen) { profilePanel.hidden = true; profileButton.setAttribute('aria-expanded', 'false'); } profileBackdrop.hidden = !isOpen; adminButton.setAttribute('aria-expanded', String(isOpen)); if (isOpen) accountList.querySelector('select')?.focus(); };
adminButton?.addEventListener('click', () => setAdminOpen(true));
adminClose?.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); setAdminOpen(false); });
document.addEventListener('click', (event) => { if (event.target.closest('.admin-close')) { event.preventDefault(); setAdminOpen(false); } });
profileBackdrop?.addEventListener('click', () => { setProfileOpen(false); setAdminOpen(false); });
profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const profile = { name: profileName.value.trim(), theme: profileTheme.value, avatar: pendingAvatar };
  localStorage.setItem('delmar-profile', JSON.stringify(profile));
  applyTheme(profile.theme);
  renderAvatar(profile.avatar, profile.name);
  profileSummary.textContent = profile.name ? `${profile.name} · ${roleSummary(currentAccount())}` : roleSummary(currentAccount());
  setProfileOpen(false);
  toast.textContent = 'Profile saved';
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
});

profileAvatarInput?.addEventListener('change', () => { const file = profileAvatarInput.files?.[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener('load', () => { pendingAvatar = reader.result; renderAvatar(pendingAvatar, profileName.value); }); reader.readAsDataURL(file); });
accountList?.addEventListener('change', (event) => { if (!event.target.matches('[data-account-id][data-role]')) return; const account = accounts.find((item) => item.id === event.target.dataset.accountId); if (!account) return; account.roles = accountRoles(account).filter((role) => role.toLowerCase() !== event.target.dataset.role.toLowerCase()); if (event.target.checked) account.roles.push(event.target.dataset.role); localStorage.setItem('delmar-accounts', JSON.stringify(accounts)); profileRole.textContent = roleSummary(currentAccount()); profileSummary.textContent = profileName.value ? `${profileName.value} · ${roleSummary(currentAccount())}` : roleSummary(currentAccount()); renderAdminPanel(); toast.textContent = `${account.name} roles updated`; toast.classList.add('show'); window.setTimeout(() => toast.classList.remove('show'), 2200); });
accountForm?.addEventListener('submit', (event) => { event.preventDefault(); const name = newAccount.value.trim(); if (!name) return; const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`; accounts.push({ id, name, roles: ['Member'] }); localStorage.setItem('delmar-accounts', JSON.stringify(accounts)); newAccount.value = ''; renderAdminPanel(); });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !profilePanel.hidden) setProfileOpen(false);
  if (event.key === 'Escape' && !adminDrawer.hidden) setAdminOpen(false);
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
