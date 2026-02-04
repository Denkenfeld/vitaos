function renderBottomNav() {
  const navItems = getNavItems();
  document.getElementById('bottom-nav').innerHTML = navItems.map(item => `
    <button class="nav-item ${currentRoute === item.route ? 'active' : ''}" 
            onclick="navigate('${item.route}')"
            ${item.adminOnly && currentUser.role !== 'admin' ? 'style="display:none"' : ''}>
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    </button>
  `).join('');
}

function renderDesktopSidebar() {
  const navItems = getNavItems();
  document.getElementById('desktop-sidebar').innerHTML = `
    <div class="sidebar-header">
      <h1 class="sidebar-logo">Vita OS</h1>
      <p class="sidebar-user">${currentUser.name}</p>
    </div>
    <nav class="sidebar-nav">
      ${navItems.map(item => `
        <button class="sidebar-item ${currentRoute === item.route ? 'active' : ''}" 
                onclick="navigate('${item.route}')"
                ${item.adminOnly && currentUser.role !== 'admin' ? 'style="display:none"' : ''}>
          <span class="sidebar-icon">${item.icon}</span>
          <span class="sidebar-label">${item.label}</span>
        </button>
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      <button class="sidebar-item" onclick="handleLogout()">
        <span class="sidebar-icon">🚪</span>
        <span class="sidebar-label">Abmelden</span>
      </button>
    </div>
  `;
}

function getNavItems() {
  const items = [
    { route: 'home', label: 'Home', icon: '🏠' },
    { route: 'besuche', label: 'Besuche', icon: '📋' },
    { route: 'patienten', label: 'Patienten', icon: '👥' },
    { route: 'kalender', label: 'Kalender', icon: '📅' }
  ];
  if (currentUser.role === 'admin') {
    items.push(
      { route: 'abrechnung', label: 'Abrechnung', icon: '💶', adminOnly: true },
      { route: 'statistiken', label: 'Statistik', icon: '📊', adminOnly: true }
    );
  }
  items.push({ route: 'profil', label: 'Profil', icon: '⚙️' });
  return items;
}