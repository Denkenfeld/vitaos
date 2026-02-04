function renderBesuche() {
  document.getElementById('page-title').textContent = 'Besuche';
  const meineBesuche = currentUser.role === 'admin' ? besuchsData : besuchsData.filter(b => b.pflegerId === currentUser.id);

  document.getElementById('content-area').innerHTML = `
    <div class="besuche-view">
      <div class="view-header">
        <button class="btn btn--primary" onclick="openBesuchForm()">➕ Neuer Besuch</button>
      </div>
      <div class="besuche-liste">
        ${meineBesuche.map(renderBesuchCard).join('')}
      </div>
    </div>
  `;
}

function showBesuchDetails(besuchId) {
  const besuch = besuchsData.find(b => b.id === besuchId);
  if (!besuch) return;

  const tacho = calculateKundentacho(besuch.patientId);

  showModal(`
    <div class="modal-header">
      <h2>Besuch Details</h2>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">

      <!-- PATIENT INFO -->
      <div class="detail-section">
        <h3>👤 Patient</h3>
        <div class="detail-info-box">
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value"><strong>${besuch.patient.vorname} ${besuch.patient.nachname}</strong></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Adresse:</span>
            <span class="detail-value">${besuch.patient.strasse}, ${besuch.patient.plz} ${besuch.patient.stadt}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Pflegegrad:</span>
            <span class="detail-value">${besuch.patient.pflegegrad}</span>
          </div>
        </div>
      </div>

      <!-- DATUM & ZEIT -->
      <div class="detail-section">
        <h3>📅 Datum & Zeit</h3>
        <div class="detail-info-box">
          <div class="detail-row">
            <span class="detail-label">Datum:</span>
            <span class="detail-value">${formatDate(new Date(besuch.datum), true)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Zeit:</span>
            <span class="detail-value">${besuch.startZeit} - ${besuch.endZeit} Uhr</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">
              <span class="status status--${besuch.status === 'abgeschlossen' ? 'success' : 'warning'}">
                ${besuch.status === 'abgeschlossen' ? '✓ Abgeschlossen' : '⏰ Geplant'}
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- LEISTUNGEN & ABRECHNUNG -->
      <div class="detail-section">
        <h3>💶 Leistungen & Abrechnung</h3>

        ${besuch.leistungen.some(l => l.kategorie === 'Pauschale') ? `
          <div class="leistungs-detail-block">
            <h4>🚗 Anfahrtspauschale</h4>
            <div class="leistungs-betrag">
              ${formatCurrency(besuch.leistungen.find(l => l.kategorie === 'Pauschale')?.betrag || 0)}
            </div>
          </div>
        ` : ''}

        ${besuch.stunden45b > 0 ? `
          <div class="leistungs-detail-block section-45b">
            <h4>💚 Betreuung § 45b SGB XI</h4>
            <div class="leistungs-row">
              <span>${besuch.stunden45b} Stunden × ${formatCurrency(besuch.patient.stundensatzNormal)}</span>
              <span class="leistungs-betrag">${formatCurrency(besuch.stunden45b * besuch.patient.stundensatzNormal)}</span>
            </div>
          </div>
        ` : ''}

        ${besuch.stunden36 > 0 ? `
          <div class="leistungs-detail-block section-36">
            <h4>💙 Betreuung § 36 SGB XI (40%)</h4>
            <div class="leistungs-row">
              <span>${besuch.stunden36} Stunden × ${formatCurrency(besuch.patient.stundensatzNormal)}</span>
              <span class="leistungs-betrag">${formatCurrency(besuch.stunden36 * besuch.patient.stundensatzNormal)}</span>
            </div>
          </div>
        ` : ''}

        <div class="detail-gesamt">
          <span class="detail-gesamt-label">Gesamtsumme:</span>
          <span class="detail-gesamt-wert">${formatCurrency(besuch.gesamtBetrag)}</span>
        </div>
      </div>

      <!-- BUDGET-STATUS -->
      <div class="detail-section">
        <h3>🎯 Budget-Status Patient</h3>
        <div class="detail-budget-mini">
          <div class="budget-mini-item">
            <span class="budget-mini-label">Freie Stunden § 45b:</span>
            <span class="budget-mini-value ${tacho.budget45b.stundenFrei < 0 ? 'text-danger' : ''}">
              ${tacho.budget45b.stundenFrei.toFixed(1)}h
            </span>
          </div>
          ${tacho.patient.sachleistung40 ? `
            <div class="budget-mini-item">
              <span class="budget-mini-label">Freie Stunden § 36:</span>
              <span class="budget-mini-value ${tacho.budget36.stundenFrei < 0 ? 'text-danger' : ''}">
                ${tacho.budget36.stundenFrei.toFixed(1)}h
              </span>
            </div>
          ` : ''}
          <button class="btn btn--secondary btn--small" onclick="closeModal(); showKundentachoModal(${besuch.patientId})" style="margin-top: 8px;">
            Vollständiger Tacho →
          </button>
        </div>
      </div>

      <!-- NOTIZEN -->
      ${besuch.notizen ? `
        <div class="detail-section">
          <h3>📝 Notizen</h3>
          <div class="detail-notizen">
            ${besuch.notizen}
          </div>
        </div>
      ` : ''}

      <!-- UNTERSCHRIFT -->
      <div class="detail-section">
        <h3>✍️ Unterschrift</h3>
        ${besuch.unterschrift ? `
          <div class="detail-info-box">
            <p style="color: var(--success); text-align: center; padding: 16px;">
              ✓ Unterschrift vorhanden
            </p>
          </div>
        ` : `
          <button class="btn btn--primary btn--full-width" onclick="closeModal(); openSignaturePad(${besuch.id})">
            ✍️ Unterschrift erfassen
          </button>
        `}
      </div>

      <!-- AKTIONEN -->
      <div class="detail-actions">
        <button class="btn btn--secondary" onclick="closeModal(); openBesuchForm(${besuch.id})">
          ✏️ Bearbeiten
        </button>
        <button class="btn btn--secondary" onclick="closeModal(); duplicateBesuch(${besuch.id})">
          📋 Duplizieren
        </button>
        <button class="btn btn--danger" onclick="confirmDeleteBesuch(${besuch.id})">
          🗑️ Löschen
        </button>
      </div>

    </div>
  `, { size: 'large' });
}

function confirmDeleteBesuch(besuchId) {
  closeModal();
  showConfirm(
    'Besuch wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
    () => {
      const index = besuchsData.findIndex(b => b.id === besuchId);
      if (index !== -1) {
        besuchsData.splice(index, 1);
        showToast('✓ Besuch wurde gelöscht');
        if (currentRoute === 'besuche') renderBesuche();
        if (currentRoute === 'kalender') renderKalenderView();
      }
    },
    'Besuch löschen'
  );
}