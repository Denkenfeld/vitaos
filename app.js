let currentUser = null;
let currentRoute = 'home';

function initApp() {
  if (!currentUser) { renderLogin(); } 
  else { renderApp(); }
}

function handleLogin(user) {
  currentUser = user;
  renderApp();
  navigate('home');
  showToast(`Willkommen zurück, ${user.name.split(' ')[0]}!`);
}

function handleLogout() {
  currentUser = null;
  renderLogin();
  showToast('Erfolgreich abgemeldet');
}

function renderApp() {
  document.getElementById('app').innerHTML = `
    <div class="app-layout">
      <div class="desktop-sidebar" id="desktop-sidebar"></div>
      <div class="desktop-content">
        <div class="header">
          <h1 id="page-title">Vita OS</h1>
          <div class="header-actions">
            <button class="header-btn" onclick="showNotifications()">🔔</button>
            <button class="header-btn" onclick="handleLogout()">🚪</button>
          </div>
        </div>
        <div class="main-content" id="content-area"></div>
        <nav class="bottom-nav" id="bottom-nav"></nav>
      </div>
    </div>
  `;
  renderNavigation();
}

function renderNavigation() {
  renderBottomNav();
  renderDesktopSidebar();
}

function navigate(route) {
  currentRoute = route;
  const routes = {
    home: currentUser.role === 'admin' ? renderAdminDashboard : renderPflegerHome,
    besuche: renderBesuche,
    patienten: renderPatienten,
    kalender: renderKalenderView,
    abrechnung: renderAbrechnung,
    statistiken: renderStatistiken,
    profil: renderProfil
  };
  (routes[route] || routes.home)();
  renderNavigation();
  window.scrollTo(0, 0);
}

function showNotifications() {
  const offen = besuchsData.filter(b => !b.unterschrift && b.datum <= new Date().toISOString().split('T')[0]).length;
  showModal(`
    <div class="modal-header"><h2>Benachrichtigungen</h2><button onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      ${offen > 0 ? `<p>⚠️ ${offen} Besuche ohne Unterschrift</p>` : '<p class="text-muted">Keine Benachrichtigungen</p>'}
    </div>
  `);
}

document.addEventListener('DOMContentLoaded', initApp);