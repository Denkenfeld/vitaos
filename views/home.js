function renderPflegerHome() {
  document.getElementById('page-title').textContent = 'Home';
  const meineBesuche = besuchsData.filter(b => b.pflegerId === currentUser.id);
  const heute = new Date().toISOString().split('T')[0];
  const besucheHeute = meineBesuche.filter(b => b.datum === heute);

  document.getElementById('content-area').innerHTML = `
    <div class="dashboard">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">${besucheHeute.length}</div>
            <div class="stat-label">Heute</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✓</div>
          <div class="stat-content">
            <div class="stat-value">${meineBesuche.filter(b => b.unterschrift).length}</div>
            <div class="stat-label">Abgeschlossen</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-value">${new Set(meineBesuche.map(b => b.patientId)).size}</div>
            <div class="stat-label">Patienten</div>
          </div>
        </div>
      </div>
      <div class="section">
        <h2>Besuche heute</h2>
        ${besucheHeute.length > 0 ? `
          <div class="besuche-liste">${besucheHeute.map(renderBesuchCard).join('')}</div>
        ` : '<p class="text-muted">Keine Besuche heute</p>'}
      </div>
    </div>
  `;
}

function renderAdminDashboard() {
  document.getElementById('page-title').textContent = 'Dashboard';
  const heute = new Date();
  const thisMonth = besuchsData.filter(b => new Date(b.datum).getMonth() === heute.getMonth());
  const umsatz = thisMonth.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);

  document.getElementById('content-area').innerHTML = `
    <div class="dashboard">
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">💶</div>
          <div class="stat-content">
            <div class="stat-value">${formatCurrency(umsatz)}</div>
            <div class="stat-label">Umsatz Monat</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-value">${thisMonth.length}</div>
            <div class="stat-label">Besuche</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-value">${PATIENTEN.length}</div>
            <div class="stat-label">Patienten</div>
          </div>
        </div>
      </div>
      <div class="quick-actions">
        <button class="action-card" onclick="navigate('abrechnung')">
          <div class="action-icon">💶</div>
          <div class="action-label">Abrechnung</div>
        </button>
        <button class="action-card" onclick="navigate('patienten')">
          <div class="action-icon">➕</div>
          <div class="action-label">Neuer Patient</div>
        </button>
        <button class="action-card" onclick="navigate('statistiken')">
          <div class="action-icon">📊</div>
          <div class="action-label">Statistiken</div>
        </button>
      </div>
    </div>
  `;
}

function renderBesuchCard(besuch) {
  return `
    <div class="besuch-card" onclick="showBesuchDetails(${besuch.id})">
      <div class="besuch-header">
        <div class="besuch-patient">
          <div class="patient-avatar">${besuch.patient.vorname[0]}${besuch.patient.nachname[0]}</div>
          <div>
            <div class="patient-name">${besuch.patient.vorname} ${besuch.patient.nachname}</div>
            <div class="besuch-meta">${formatDateShort(besuch.datum)} · ${formatTime(besuch.startZeit)}</div>
          </div>
        </div>
        <span class="status ${besuch.unterschrift ? 'status--success' : 'status--warning'}">
          ${besuch.unterschrift ? '✓' : '⏳'}
        </span>
      </div>
      <div class="besuch-betrag">${formatCurrency(besuch.gesamtBetrag)}</div>
    </div>
  `;
}