const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const toast = document.querySelector('.toast');
const sellOverlay = document.querySelector('#sell-overlay');
const openSellModal = () => {
  if (sellOverlay) sellOverlay.hidden = false;
};

document.addEventListener('click', (event) => {
  const sellTrigger = event.target.closest('[data-sell-trigger]');
  if (!sellTrigger) return;
  event.preventDefault();
  openSellModal();
});

const profileButton = document.querySelector('.nav-profile');
const adminButton = document.querySelector('.nav-admin');
const pendingSellsButton = document.querySelector('.nav-pending');
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
const accountSearch = document.querySelector('#account-search');
const authGate = document.querySelector('#auth-gate');
const authIntro = document.querySelector('#auth-intro');
const createTab = document.querySelector('#create-tab');
const loginTab = document.querySelector('#login-tab');
const createAccountForm = document.querySelector('#create-account-form');
const loginForm = document.querySelector('#login-form');
const authMessage = document.querySelector('#auth-message');
const logoutButton = document.querySelector('#logout-button');
const authDiscordId = document.querySelector('#auth-discord-id');
const authDiscordName = document.querySelector('#auth-discord-name');
const authDisplayName = document.querySelector('#auth-display-name');
const loginDiscordId = document.querySelector('#login-discord-id');
const loginDiscordName = document.querySelector('#login-discord-name');

const roleOptions = ['Owner', 'Marketplace Manager', 'Executive', 'Seller Partner', 'Catalog Administrator', 'Buyer', 'Moderator', 'Verified Seller', 'Customer Support', 'Business Seller', 'Bussiness Owner', 'Admin', 'Exploring the marketplace', 'Local seller', 'Independent buyer'];
const ownerDiscordId = '1249163994116259840';
const defaultAccounts = [{ id: 'owner', name: 'FlipVault Owner', discordId: ownerDiscordId, discordName: 'FlipVault Owner', roles: ['Owner', 'Admin'] }];
const normalizeIdentity = (value) => value.trim().toLowerCase();
const hadStoredAccounts = Boolean(localStorage.getItem('delmar-accounts'));
let accounts = JSON.parse(localStorage.getItem('delmar-accounts') || 'null') || defaultAccounts;
accounts = accounts.filter((account) => !['alex', 'jordan'].includes(account.id));
accounts = accounts.map((account) => { const roles = Array.isArray(account.roles) ? account.roles : [account.role || 'Buyer']; const isOwner = account.id === 'owner' || account.discordId === ownerDiscordId; if (isOwner && !roles.some((role) => role.toLowerCase() === 'owner')) roles.push('Owner'); if (isOwner && !roles.some((role) => role.toLowerCase() === 'admin')) roles.push('Admin'); return { ...account, id: isOwner ? 'owner' : account.id, name: isOwner ? (account.name || 'Owner') : (account.name || account.displayName || 'Unnamed account'), discordId: isOwner ? ownerDiscordId : (account.discordId || account.id), discordName: account.discordName || account.name || 'Unknown', discordIdKey: normalizeIdentity(isOwner ? ownerDiscordId : (account.discordId || account.id)), discordNameKey: normalizeIdentity(account.discordName || account.name || 'Unknown'), roles }; });
localStorage.setItem('delmar-accounts', JSON.stringify(accounts));
const savedSession = JSON.parse(localStorage.getItem('delmar-session') || 'null');
let activeAccountId = localStorage.getItem('delmar-active-account') || savedSession?.accountId;
if (accounts.some((account) => account.id === activeAccountId && account.discordId === ownerDiscordId)) activeAccountId = 'owner';
const accountRoles = (account) => account?.roles || ['Buyer'];
const hasRole = (account, role) => accountRoles(account).some((accountRole) => accountRole.toLowerCase() === role.toLowerCase());
const roleSummary = (account) => accountRoles(account).join(' · ') || 'No role assigned';
const currentAccount = () => accounts.find((account) => account.id === activeAccountId);
const rememberAccount = (account) => { activeAccountId = account.id; localStorage.setItem('delmar-active-account', account.id); localStorage.setItem('delmar-session', JSON.stringify({ accountId: account.id, discordId: account.discordId, discordName: account.discordName })); };
if (!currentAccount() && savedSession?.discordId) { const recoveredAccount = accounts.find((account) => account.discordIdKey === normalizeIdentity(savedSession.discordId)); if (recoveredAccount) rememberAccount(recoveredAccount); }
let pendingAvatar = '';

const savedProfile = JSON.parse(localStorage.getItem('delmar-profile') || 'null');
if (savedProfile) {
  profileName.value = savedProfile.name || '';
  profileTheme.value = savedProfile.theme || profileTheme.value;
  pendingAvatar = savedProfile.avatar || '';
}

const applyTheme = (theme) => { document.body.dataset.theme = theme || 'coast'; };
const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const renderAvatar = (avatar, name) => { profileAvatar.textContent = avatar ? '' : (name || 'D').charAt(0).toUpperCase(); profileAvatar.style.backgroundImage = avatar ? `url(${avatar})` : ''; profileAvatar.classList.toggle('has-image', Boolean(avatar)); };
const renderAdminPanel = () => { const isAdmin = hasRole(currentAccount(), 'Admin'); adminButton.hidden = !isAdmin; pendingSellsButton.hidden = !hasRole(currentAccount(), 'Bussiness Owner'); if (!isAdmin) { adminDrawer.hidden = true; return; } const query = accountSearch.value.trim().toLowerCase(); const visibleAccounts = accounts.filter((account) => [account.name, account.discordName, account.discordId].some((value) => value?.toLowerCase().includes(query))); accountList.innerHTML = visibleAccounts.length ? visibleAccounts.map((account) => { const safeName = escapeHtml(account.name); const roles = accountRoles(account); const deleteButton = account.id === activeAccountId ? '' : `<button class="delete-account" type="button" data-delete-account="${account.id}" aria-label="Delete ${safeName}">Delete</button>`; return `<div class="account-row"><div><strong>${safeName}</strong><small>${account.id === activeAccountId ? 'You' : roleSummary(account)}</small></div><div class="account-actions"><div class="role-picker" aria-label="Roles for ${safeName}">${roleOptions.map((role) => `<label><input type="checkbox" data-account-id="${account.id}" data-role="${role}" ${roles.some((accountRole) => accountRole.toLowerCase() === role.toLowerCase()) ? 'checked' : ''} />${role}</label>`).join('')}</div>${deleteButton}</div></div>`; }).join('') : '<p class="no-results">No profiles found.</p>'; };
applyTheme(savedProfile?.theme);
renderAvatar(pendingAvatar, savedProfile?.name);
profileRole.textContent = roleSummary(currentAccount());
renderAdminPanel();

const setAuthMode = (mode) => { const isLogin = mode === 'login'; createTab.classList.toggle('active', !isLogin); loginTab.classList.toggle('active', isLogin); createAccountForm.hidden = isLogin; loginForm.hidden = !isLogin; authIntro.textContent = isLogin ? 'Log in to manage your saved finds and listings.' : 'Create an account to save finds and manage your listings.'; authMessage.textContent = ''; (isLogin ? loginDiscordId : authDiscordId).focus(); };
const showAuthGate = (message = '', mode = 'login') => { authGate.hidden = false; setAuthMode(mode); authMessage.textContent = message; };
const hideAuthGate = () => { authGate.hidden = true; };
createTab.addEventListener('click', () => setAuthMode('create'));
loginTab.addEventListener('click', () => setAuthMode('login'));
createAccountForm.addEventListener('submit', (event) => { event.preventDefault(); const discordId = authDiscordId.value.trim(); const discordName = authDiscordName.value.trim(); const displayName = authDisplayName.value.trim(); const discordIdKey = normalizeIdentity(discordId); if (accounts.some((account) => account.discordIdKey === discordIdKey)) { authMessage.textContent = 'An account with that email already exists. Log in instead.'; return; } const account = { id: `account-${Date.now()}`, discordId, discordName, discordIdKey, discordNameKey: normalizeIdentity(discordName), name: displayName, roles: ['Buyer'] }; accounts.push(account); rememberAccount(account); localStorage.setItem('delmar-accounts', JSON.stringify(accounts)); localStorage.setItem('delmar-profile', JSON.stringify({ name: displayName, theme: 'coast', avatar: '' })); profileName.value = displayName; profileRole.textContent = roleSummary(account); profileSummary.textContent = `${displayName} · ${roleSummary(account)}`; renderAvatar('', displayName); renderAdminPanel(); const adminUser = accounts.find((entry) => hasRole(entry, 'Admin')); if (adminUser) setAdminOpen(true); hideAuthGate(); });
loginForm.addEventListener('submit', (event) => { event.preventDefault(); const discordIdKey = normalizeIdentity(loginDiscordId.value); const discordNameKey = normalizeIdentity(loginDiscordName.value); const account = accounts.find((item) => item.discordIdKey === discordIdKey && item.discordNameKey === discordNameKey); if (!account) { authMessage.textContent = 'We could not find an account with those details.'; return; } rememberAccount(account); profileName.value = account.name; profileRole.textContent = roleSummary(account); profileSummary.textContent = `${account.name} · ${roleSummary(account)}`; renderAdminPanel(); hideAuthGate(); });
logoutButton.addEventListener('click', () => { localStorage.removeItem('delmar-active-account'); localStorage.removeItem('delmar-session'); activeAccountId = null; setProfileOpen(false); showAuthGate('Log in to return, or create a new marketplace account.'); });
if (!currentAccount()) showAuthGate('', hadStoredAccounts ? 'login' : 'create');
else hideAuthGate();

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
accountList?.addEventListener('click', (event) => { const deleteButton = event.target.closest('[data-delete-account]'); if (!deleteButton) return; const account = accounts.find((item) => item.id === deleteButton.dataset.deleteAccount); if (!account || !window.confirm(`Delete ${account.name}'s profile?`)) return; accounts = accounts.filter((item) => item.id !== account.id); localStorage.setItem('delmar-accounts', JSON.stringify(accounts)); renderAdminPanel(); toast.textContent = `${account.name}'s profile deleted`; toast.classList.add('show'); window.setTimeout(() => toast.classList.remove('show'), 2200); });
accountSearch?.addEventListener('input', renderAdminPanel);
accountForm?.addEventListener('submit', (event) => { event.preventDefault(); const name = newAccount.value.trim(); if (!name) return; const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`; accounts.push({ id, name, discordId: id, discordName: name, discordIdKey: normalizeIdentity(id), discordNameKey: normalizeIdentity(name), roles: ['Buyer'] }); localStorage.setItem('delmar-accounts', JSON.stringify(accounts)); newAccount.value = ''; renderAdminPanel(); const adminUser = accounts.find((entry) => hasRole(entry, 'Admin')); if (adminUser) setAdminOpen(true); });

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

const catalogTabs = document.querySelectorAll('.category-tab');
const catalogPanels = document.querySelectorAll('.catalog-panel');
const departmentLinks = document.querySelectorAll('[data-open-tab]');
const catalogOverlay = document.querySelector('#catalog');
const catalogCloseButton = document.querySelector('.catalog-close');
const sellCloseButton = document.querySelector('.sell-close');
const sellForm = document.querySelector('#sell-form');
const sellCancelButton = document.querySelector('.sell-cancel');
const pendingSellsOverlay = document.querySelector('#pending-sells-overlay');
const pendingSellsList = document.querySelector('#pending-sells-list');
const pendingSellsCloseButton = document.querySelector('.pending-sells-close');

const setCatalogTitle = (tabName) => {
  const catalogTitle = document.querySelector('#catalog-title');
  const titleMap = { cloth: 'Cloth', shoes: 'Shoes', electronics: 'Electronics' };
  if (catalogTitle) catalogTitle.textContent = titleMap[tabName] || 'Shop the vault';
};

const openCatalogTab = (tabName) => {
  catalogTabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  catalogPanels.forEach((panel) => {
    const isActive = panel.id === `panel-${tabName}`;
    panel.classList.toggle('active', isActive);
    panel.hidden = !isActive;
  });

  setCatalogTitle(tabName);
  if (catalogOverlay) catalogOverlay.hidden = false;
};

const closeCatalogTab = () => {
  if (catalogOverlay) catalogOverlay.hidden = true;
};

catalogTabs.forEach((tab) => {
  tab.addEventListener('click', () => openCatalogTab(tab.dataset.tab));
});

catalogCloseButton?.addEventListener('click', closeCatalogTab);
catalogOverlay?.addEventListener('click', (event) => {
  if (event.target === catalogOverlay) closeCatalogTab();
});

departmentLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetTab = link.dataset.openTab;
    if (!targetTab) return;
    event.preventDefault();
    const isAlreadyOpen = !catalogOverlay?.hidden && document.querySelector('.category-tab.active')?.dataset.tab === targetTab;
    if (isAlreadyOpen) {
      closeCatalogTab();
      return;
    }
    openCatalogTab(targetTab);
  });
});

const closeSellModal = () => {
  if (sellOverlay) sellOverlay.hidden = true;
  if (sellForm) sellForm.reset();
};

const renderPendingSells = () => {
  const savedListings = JSON.parse(localStorage.getItem('flipvault-listings') || '[]');
  if (!pendingSellsList) return;
  pendingSellsList.innerHTML = savedListings.length ? savedListings.map((listing) => `<article class="pending-sell-row"><div><h3>${escapeHtml(String(listing.itemName || 'Untitled item'))}</h3><p>${escapeHtml(String(listing.description || 'No description provided.'))}</p><p>${escapeHtml(String(listing.contactMethod || 'Contact'))}: ${escapeHtml(String(listing.contact || 'No contact provided'))}</p></div><div class="pending-sell-meta"><strong>$${escapeHtml(String(listing.price || '0'))}</strong><br />${escapeHtml(String(listing.category || 'Uncategorized'))}<br />${escapeHtml(String(listing.condition || 'Condition unknown'))}</div></article>`).join('') : '<p class="pending-sell-empty">No pending sells yet.</p>';
};

const openPendingSells = () => {
  if (!hasRole(currentAccount(), 'Bussiness Owner')) return;
  renderPendingSells();
  if (pendingSellsOverlay) pendingSellsOverlay.hidden = false;
};

const closePendingSells = () => {
  if (pendingSellsOverlay) pendingSellsOverlay.hidden = true;
};

pendingSellsButton?.addEventListener('click', openPendingSells);
pendingSellsCloseButton?.addEventListener('click', closePendingSells);
pendingSellsOverlay?.addEventListener('click', (event) => {
  if (event.target === pendingSellsOverlay) closePendingSells();
});

sellCloseButton?.addEventListener('click', closeSellModal);
sellCancelButton?.addEventListener('click', closeSellModal);
sellOverlay?.addEventListener('click', (event) => {
  if (event.target === sellOverlay) closeSellModal();
});

sellForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(sellForm);
  const savedListings = JSON.parse(localStorage.getItem('flipvault-listings') || '[]');
  savedListings.push({
    itemName: formData.get('itemName'),
    category: formData.get('category'),
    price: formData.get('price'),
    condition: formData.get('condition'),
    description: formData.get('description'),
    contact: formData.get('contact'),
    contactMethod: formData.get('contactMethod'),
    shipping: formData.get('shipping'),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem('flipvault-listings', JSON.stringify(savedListings));
  closeSellModal();
  toast.textContent = 'Listing submitted';
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && catalogOverlay && !catalogOverlay.hidden) closeCatalogTab();
  if (event.key === 'Escape' && sellOverlay && !sellOverlay.hidden) closeSellModal();
  if (event.key === 'Escape' && pendingSellsOverlay && !pendingSellsOverlay.hidden) closePendingSells();
});

if (catalogOverlay) {
  catalogOverlay.hidden = true;
}
if (sellOverlay) {
  sellOverlay.hidden = true;
}
