function renderStatistiken() {
  document.getElementById('page-title').textContent = 'Statistiken';

  const gesamtUmsatz = besuchsData.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
  const durchschnitt = besuchsData.length > 0 ? gesamtUmsatz / besuchsData.length : 0;
  const mitUnterschrift = besuchsData.filter(b => b.unterschrift).length;
  const ohneUnterschrift = besuchsData.length - mitUnterschrift;

  const byPfleger = groupBy(besuchsData, 'pflegerId');

  document.getElementById('content-area').innerHTML = `
    <div class="statistiken-view">
      <div class="section">
        <h2>Gesamt-Statistiken</h2>

        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">💶</div>
            <div class="stat-content">
              <div class="stat-value">${formatCurrency(gesamtUmsatz)}</div>
              <div class="stat-label">Gesamtumsatz</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <div class="stat-value">${besuchsData.length}</div>
              <div class="stat-label">Besuche gesamt</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-value">${PATIENTEN.length}</div>
              <div class="stat-label">Patienten</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-value">${formatCurrency(durchschnitt)}</div>
              <div class="stat-label">Ø pro Besuch</div>
            </div>
          </div>
        </div>

        <h3>Unterschriften-Status</h3>
        <div class="stats-row">
          <div class="stat-item success">
            <div class="stat-label">Mit Unterschrift</div>
            <div class="stat-value">${mitUnterschrift}</div>
          </div>
          <div class="stat-item warning">
            <div class="stat-label">Ohne Unterschrift</div>
            <div class="stat-value">${ohneUnterschrift}</div>
          </div>
        </div>

        <h3>Nach Pflegekraft</h3>
        <div class="pfleger-stats">
          ${Object.entries(byPfleger).map(([pflegerId, besuche]) => {
            const pfleger = DEMO_USERS.find(u => u.id === parseInt(pflegerId));
            const umsatz = besuche.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
            return `
              <div class="pfleger-stat-card">
                <div class="pfleger-info">
                  <div class="patient-avatar">${pfleger.name[0]}</div>
                  <div>
                    <div class="pfleger-name">${pfleger.name}</div>
                    <div class="pfleger-meta">${besuche.length} Besuche</div>
                  </div>
                </div>
                <div class="pfleger-umsatz">${formatCurrency(umsatz)}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}