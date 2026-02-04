function renderProfil() {
  document.getElementById('page-title').textContent = 'Profil';

  document.getElementById('content-area').innerHTML = `
    <div class="profil-view">
      <div class="section">
        <div class="profil-header">
          <div class="patient-avatar large">${currentUser.name[0]}</div>
          <div>
            <h2>${currentUser.name}</h2>
            <p class="text-muted">${currentUser.role === 'admin' ? 'Administrator' : 'Pflegekraft'}</p>
          </div>
        </div>

        <h3>Persönliche Daten</h3>
        <div class="profil-info">
          <div class="info-row">
            <span class="info-label">E-Mail:</span>
            <span class="info-value">${currentUser.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Rolle:</span>
            <span class="info-value">${currentUser.role === 'admin' ? 'Administrator' : 'Pflegekraft'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Beschäftigungsnummer:</span>
            <span class="info-value">${currentUser.beschaeftigungsnummer}</span>
          </div>
        </div>

        <h3>Einstellungen</h3>
        <div class="settings-liste">
          <button class="settings-item" onclick="showToast('Feature kommt bald', 'info')">
            <span>🔔 Benachrichtigungen</span>
            <span>›</span>
          </button>
          <button class="settings-item" onclick="showToast('Feature kommt bald', 'info')">
            <span>🎨 Design</span>
            <span>›</span>
          </button>
          <button class="settings-item" onclick="showToast('Feature kommt bald', 'info')">
            <span>🔒 Passwort ändern</span>
            <span>›</span>
          </button>
        </div>

        <button class="btn btn--danger btn--full-width" onclick="handleLogout()" style="margin-top: 24px;">
          🚪 Abmelden
        </button>
      </div>
    </div>
  `;
}