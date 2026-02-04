function PatientForm(patientId = null) {
  const patient = patientId ? findPatient(patientId) : null;
  const isEdit = patient !== null;

  const budget36 = patient ? BUDGET_36_BY_PFLEGEGRAD[patient.pflegegrad] : 0;

  return `
    <div class="patient-form">
      <div class="form-header">
        <h2>${isEdit ? 'Patient bearbeiten' : 'Neuer Patient'}</h2>
        <button class="btn-icon" onclick="closeModal()">✕</button>
      </div>
      <form id="patient-form" onsubmit="handlePatientSubmit(event, ${patientId})">

        <div class="form-section">
          <h3 class="section-title">Persönliche Daten</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname *</label>
              <input type="text" name="vorname" class="form-control" value="${patient?.vorname || ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Nachname *</label>
              <input type="text" name="nachname" class="form-control" value="${patient?.nachname || ''}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Geburtsdatum *</label>
              <input type="date" name="geburtsdatum" class="form-control" value="${patient?.geburtsdatum || ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Pflegegrad *</label>
              <select name="pflegegrad" class="form-control" required onchange="updateBudget36Display(this.value)">
                <option value="">Bitte wählen...</option>
                <option value="PG1" ${patient?.pflegegrad === 'PG1' ? 'selected' : ''}>Pflegegrad 1</option>
                <option value="PG2" ${patient?.pflegegrad === 'PG2' ? 'selected' : ''}>Pflegegrad 2</option>
                <option value="PG3" ${patient?.pflegegrad === 'PG3' ? 'selected' : ''}>Pflegegrad 3</option>
                <option value="PG4" ${patient?.pflegegrad === 'PG4' ? 'selected' : ''}>Pflegegrad 4</option>
                <option value="PG5" ${patient?.pflegegrad === 'PG5' ? 'selected' : ''}>Pflegegrad 5</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Adresse</h3>
          <div class="form-group">
            <label class="form-label">Straße *</label>
            <input type="text" name="strasse" class="form-control" value="${patient?.strasse || ''}" required>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex: 0 0 30%;">
              <label class="form-label">PLZ *</label>
              <input type="text" name="plz" class="form-control" value="${patient?.plz || ''}" required pattern="[0-9]{5}">
            </div>
            <div class="form-group">
              <label class="form-label">Stadt *</label>
              <input type="text" name="stadt" class="form-control" value="${patient?.stadt || ''}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Telefon</label>
            <input type="tel" name="telefon" class="form-control" value="${patient?.telefon || ''}">
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Versicherung</h3>
          <div class="form-group">
            <label class="form-label">Versichertennummer *</label>
            <input type="text" name="versichertennummer" class="form-control" value="${patient?.versichertennummer || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Krankenkasse *</label>
            <select name="iknr" class="form-control" required onchange="updateKassenname(this)">
              <option value="">Bitte wählen...</option>
              ${KRANKENKASSEN.map(kk => `
                <option value="${kk.iknr}" data-name="${kk.name}" ${patient?.iknr === kk.iknr ? 'selected' : ''}>
                  ${kk.name} (${kk.iknr})
                </option>
              `).join('')}
            </select>
            <input type="hidden" name="kassenname" id="kassenname" value="${patient?.kassenname || ''}">
          </div>
        </div>

        <div class="form-section" style="background: #FEF3C7; padding: 16px; border-radius: 8px;">
          <h3 class="section-title">💶 Individuelle Stundensätze</h3>
          <small style="color: #92400E; display: block; margin-bottom: 12px;">
            Standard: ${formatCurrency(GLOBAL_STUNDENSATZ)} (Normal) / ${formatCurrency(GLOBAL_STUNDENSATZ + GLOBAL_ZUSCHLAG_NACHT)} (Nacht/WE/Feiertag)
          </small>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Stundensatz Normal</label>
              <input type="number" name="stundensatzNormal" class="form-control" 
                     value="${patient?.stundensatzNormal || GLOBAL_STUNDENSATZ}" 
                     step="0.50" min="0" required>
            </div>
            <div class="form-group">
              <label class="form-label">Stundensatz Nacht/WE/Feiertag</label>
              <input type="number" name="stundensatzNacht" class="form-control" 
                     value="${patient?.stundensatzNacht || (GLOBAL_STUNDENSATZ + GLOBAL_ZUSCHLAG_NACHT)}" 
                     step="0.50" min="0" required>
            </div>
          </div>
        </div>

        <div class="form-section" style="background: #EFF6FF; padding: 16px; border-radius: 8px;">
          <h3 class="section-title">📋 Abrechnungsgrundlagen (SGB XI)</h3>

          <div class="form-group">
            <label class="form-label">§ 45b Entlastungsbetrag/Monat</label>
            <input type="number" name="entlastungsbetrag" class="form-control" value="${patient?.entlastungsbetrag || 131.00}" step="0.01" min="0" readonly>
            <small style="color: #1E40AF; font-size: 0.875rem;">
              ✓ Standard: 131€/Monat (ab 2025)
            </small>
          </div>

          <div style="background: #DBEAFE; padding: 12px; border-radius: 6px; margin: 12px 0;">
            <h4 style="margin: 0 0 12px 0; color: #1E40AF;">💰 Angespartes Budget (Optional)</h4>
            <small style="color: #1E40AF; display: block; margin-bottom: 12px;">
              Falls bereits Budget angespart wurde (max. 18 Monate bis 30.06. Folgejahr)
            </small>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Angespartes Budget</label>
                <input type="number" name="angespartBetrag" class="form-control" 
                       value="${patient?.angespartBetrag || 0}" 
                       step="0.01" min="0" placeholder="z.B. 550.00">
              </div>
              <div class="form-group">
                <label class="form-label">Gültig bis</label>
                <input type="date" name="angespartGueltigBis" class="form-control" 
                       value="${patient?.angespartGueltigBis || ''}">
              </div>
            </div>
            <small style="color: #1E40AF; font-size: 0.75rem;">
              💡 System verbraucht erst angespartes Budget, dann monatliche 131€
            </small>
          </div>

          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" name="sachleistung40" value="true" ${patient?.sachleistung40 ? 'checked' : ''} 
                     onchange="toggleSachleistung40Display(this.checked)">
              <span>§ 36 Umwandlungsanspruch (40%) nutzen</span>
            </label>
            <small style="color: #6B7280; font-size: 0.875rem;">
              40% der Pflegesachleistungen können für Betreuung genutzt werden
            </small>
          </div>

          <div id="budget36-display" style="display: ${patient?.sachleistung40 ? 'block' : 'none'}; margin-top: 12px; padding: 12px; background: #DBEAFE; border-radius: 6px;">
            <div style="font-weight: 600; color: #1E40AF;">
              § 36 Budget ${patient?.pflegegrad || 'PG2'}: <span id="budget36-value">${formatCurrency(budget36)}</span>/Monat
            </div>
            <small style="color: #1E40AF;">⚠️ Verfällt am Monatsende!</small>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn--secondary" onclick="closeModal()">Abbrechen</button>
          <button type="submit" class="btn btn--primary">${isEdit ? 'Speichern' : 'Patient anlegen'}</button>
        </div>
      </form>
    </div>
  `;
}

function toggleSachleistung40Display(checked) {
  document.getElementById('budget36-display').style.display = checked ? 'block' : 'none';
}

function updateBudget36Display(pflegegrad) {
  const budget = BUDGET_36_BY_PFLEGEGRAD[pflegegrad] || 0;
  const display = document.getElementById('budget36-value');
  if (display) {
    display.textContent = formatCurrency(budget);
    document.getElementById('budget36-display').querySelector('div').innerHTML = 
      `§ 36 Budget ${pflegegrad}: <span id="budget36-value">${formatCurrency(budget)}</span>/Monat`;
  }
}

function updateKassenname(select) {
  const option = select.options[select.selectedIndex];
  document.getElementById('kassenname').value = option.getAttribute('data-name') || '';
}

function handlePatientSubmit(event, patientId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const patientData = {};

  formData.forEach((value, key) => { 
    if (key === 'sachleistung40') {
      patientData[key] = true;
    } else if (['entlastungsbetrag', 'angespartBetrag', 'stundensatzNormal', 'stundensatzNacht'].includes(key)) {
      patientData[key] = parseFloat(value) || 0;
    } else if (key === 'angespartGueltigBis' && value) {
      patientData[key] = value;
    } else if (key === 'angespartGueltigBis' && !value) {
      patientData[key] = null;
    } else {
      patientData[key] = value;
    }
  });

  if (!patientData.sachleistung40) {
    patientData.sachleistung40 = false;
  }

  if (patientId) {
    updatePatient(patientId, patientData);
    showToast('✓ Patient wurde aktualisiert');
  } else {
    PATIENTEN.push({ id: generateId(), ...patientData });
    showToast('✓ Neuer Patient wurde angelegt');
  }

  closeModal();
  if (currentRoute === 'patienten') renderPatienten();
}

function openPatientForm(patientId = null) {
  showModal(PatientForm(patientId), { size: 'large' });
}