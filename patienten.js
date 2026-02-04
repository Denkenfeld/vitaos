function renderPatienten() {
  document.getElementById('page-title').textContent = 'Patienten';

  document.getElementById('content-area').innerHTML = `
    <div class="patienten-view">
      <div class="view-header">
        <div class="search-box">
          <input type="text" class="form-control" placeholder="Suchen..." oninput="filterPatienten(this.value)">
        </div>
        <button class="btn btn--primary" onclick="openPatientForm()">➕ Neuer Patient</button>
      </div>
      <div class="patienten-grid">
        ${PATIENTEN.map(renderPatientCard).join('')}
      </div>
    </div>
  `;
}

function renderPatientCard(patient) {
  const besucheCount = besuchsData.filter(b => b.patientId === patient.id).length;
  const alter = calculateAge(patient.geburtsdatum);
  const tacho = calculateKundentacho(patient.id);

  const tachoStatus = tacho.budget45b.ueberzogen || tacho.budget36.ueberzogen ? 'danger' : 
                      (tacho.gesamt.stundenFrei < 5 ? 'warning' : 'success');

  return `
    <div class="patient-card">
      <div class="patient-card-header">
        <div class="patient-avatar large">${patient.vorname[0]}${patient.nachname[0]}</div>
        <div class="patient-card-info">
          <h3 class="patient-card-name">${patient.vorname} ${patient.nachname}</h3>
          <div class="patient-card-meta">${patient.pflegegrad} · ${patient.kassenname}</div>
        </div>
        <div class="patient-card-actions">
          <button class="btn-icon" onclick="showKundentachoModal(${patient.id})" title="Kundentacho">🎯</button>
          <button class="btn-icon" onclick="openPatientForm(${patient.id})" title="Bearbeiten">✏️</button>
          <button class="btn-icon" onclick="confirmDeletePatient(${patient.id})" title="Löschen">🗑️</button>
        </div>
      </div>

      <div class="patient-card-body">
        <div class="patient-detail">
          <span>📍</span> ${patient.strasse}, ${patient.plz} ${patient.stadt}
        </div>
        <div class="patient-detail">
          <span>🎂</span> ${formatDateShort(patient.geburtsdatum)} (${alter} Jahre)
        </div>
        ${patient.telefon ? `<div class="patient-detail"><span>📞</span> ${patient.telefon}</div>` : ''}
        <div class="patient-detail">
          <span>💶</span> ${formatCurrency(patient.stundensatzNormal)}/h 
          ${patient.stundensatzNacht !== patient.stundensatzNormal ? 
            `(Nacht: ${formatCurrency(patient.stundensatzNacht)})` : ''}
        </div>
      </div>

      <!-- MINI TACHO -->
      <div class="patient-tacho-mini" onclick="showKundentachoModal(${patient.id})" style="cursor: pointer;">
        <div class="tacho-mini-header">
          <span>🎯 Budget-Status</span>
          <span class="tacho-badge-mini badge--${tachoStatus}">
            ${tacho.gesamt.stundenFrei < 0 ? '⚠️ Überzogen' : 
              (tacho.gesamt.stundenFrei < 5 ? '⏰ Knapp' : '✓ OK')}
          </span>
        </div>
        <div class="tacho-mini-stats">
          <div class="tacho-mini-stat">
            <div class="tacho-mini-label">Freie Stunden</div>
            <div class="tacho-mini-value ${tacho.gesamt.stundenFrei < 0 ? 'text-danger' : ''}">
              ${tacho.gesamt.stundenFrei.toFixed(1)}h
            </div>
          </div>
          <div class="tacho-mini-stat">
            <div class="tacho-mini-label">Verfügbar</div>
            <div class="tacho-mini-value">${tacho.gesamt.stundenVerfuegbar.toFixed(1)}h</div>
          </div>
        </div>
        ${tacho.budget45b.angespart > 0 ? `
          <div class="tacho-mini-anspar">
            💰 ${formatCurrency(tacho.budget45b.angespart)} angespart
          </div>
        ` : ''}
        <div class="tacho-mini-hint">Klicken für Details →</div>
      </div>

      <div class="patient-card-footer">
        <div class="patient-stat">
          <span class="stat-value">${besucheCount}</span>
          <span class="stat-label">Besuche</span>
        </div>
      </div>
    </div>
  `;
}

function filterPatienten(query) {
  const cards = document.querySelectorAll('.patient-card');
  cards.forEach(card => {
    const visible = card.textContent.toLowerCase().includes(query.toLowerCase());
    card.style.display = visible ? 'block' : 'none';
  });
}

function confirmDeletePatient(id) {
  showConfirm(
    'Patient wirklich löschen? Alle zugehörigen Daten gehen verloren.',
    () => {
      deletePatient(id);
      renderPatienten();
      showToast('Patient wurde gelöscht');
    },
    'Patient löschen'
  );
}