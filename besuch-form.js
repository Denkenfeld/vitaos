function BesuchForm(besuchId = null, duplicateFrom = null) {
  const besuch = besuchId ? besuchsData.find(b => b.id === besuchId) : null;
  const isEdit = besuch !== null;
  const isDuplicate = duplicateFrom !== null;

  // Bei Duplikat: Daten vom Original übernehmen
  const sourceData = isDuplicate ? duplicateFrom : besuch;

  const heute = new Date().toISOString().split('T')[0];

  return `
    <div class="besuch-form">
      <div class="form-header">
        <h2>${isDuplicate ? 'Besuch duplizieren' : (isEdit ? 'Besuch bearbeiten' : 'Neuer Besuch')}</h2>
        <button class="btn-icon" onclick="closeModal()">✕</button>
      </div>

      <form id="besuch-form" onsubmit="handleBesuchSubmit(event, ${besuchId})">

        <!-- PATIENT AUSWAHL -->
        <div class="form-section">
          <h3 class="section-title">Patient</h3>
          <div class="form-group">
            <label class="form-label">Patient auswählen *</label>
            <select name="patientId" class="form-control" required onchange="updateBesuchBudgets(this.value)">
              <option value="">Bitte wählen...</option>
              ${PATIENTEN.map(p => `
                <option value="${p.id}" ${sourceData?.patientId === p.id ? 'selected' : ''}>
                  ${p.vorname} ${p.nachname} (${p.pflegegrad})
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- DATUM & ZEIT -->
        <div class="form-section">
          <h3 class="section-title">Datum & Zeit</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Datum *</label>
              <input type="date" name="datum" class="form-control" 
                     value="${isDuplicate ? heute : (sourceData?.datum || heute)}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Startzeit *</label>
              <input type="time" name="startZeit" class="form-control" 
                     value="${sourceData?.startZeit || '09:00'}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Endzeit *</label>
              <input type="time" name="endZeit" class="form-control" 
                     value="${sourceData?.endZeit || '11:00'}" required>
            </div>
          </div>
        </div>

        <!-- LEISTUNGEN & ABRECHNUNG -->
        <div class="form-section">
          <h3 class="section-title">Leistungen & Abrechnung</h3>

          <!-- 1. ANFAHRTSPAUSCHALE -->
          <div class="leistungs-block">
            <h4>🚗 Anfahrtspauschale</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Betrag</label>
                <input type="number" name="anfahrt" class="form-control" 
                       value="${sourceData ? (sourceData.leistungen?.find(l => l.kategorie === 'Pauschale')?.betrag || 5.00) : 5.00}" 
                       step="0.50" min="0">
              </div>
            </div>
          </div>

          <!-- 2. § 45b BETREUUNG -->
          <div class="leistungs-block">
            <h4>💚 Betreuung § 45b SGB XI</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Stunden</label>
                <input type="number" name="stunden45b" id="stunden45b" class="form-control" 
                       value="${sourceData?.abrechnungsart === '§ 45b' ? (sourceData?.stundenGesamt || 0) : 0}" 
                       step="0.5" min="0" onchange="updateBesuchBerechnung()">
              </div>
              <div class="form-group">
                <label class="form-label">Stundensatz</label>
                <input type="number" name="satz45b" id="satz45b" class="form-control" 
                       value="${sourceData?.patient?.stundensatzNormal || 42.50}" 
                       step="0.50" readonly>
              </div>
              <div class="form-group">
                <label class="form-label">Summe</label>
                <input type="text" id="summe45b" class="form-control" value="0.00 €" readonly>
              </div>
            </div>
          </div>

          <!-- 3. § 36 BETREUUNG -->
          <div class="leistungs-block" id="block36" style="display: none;">
            <h4>💙 Betreuung § 36 SGB XI (40%)</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Stunden</label>
                <input type="number" name="stunden36" id="stunden36" class="form-control" 
                       value="${sourceData?.abrechnungsart === '§ 36' ? (sourceData?.stundenGesamt || 0) : 0}" 
                       step="0.5" min="0" onchange="updateBesuchBerechnung()">
              </div>
              <div class="form-group">
                <label class="form-label">Stundensatz</label>
                <input type="number" name="satz36" id="satz36" class="form-control" 
                       value="${sourceData?.patient?.stundensatzNormal || 42.50}" 
                       step="0.50" readonly>
              </div>
              <div class="form-group">
                <label class="form-label">Summe</label>
                <input type="text" id="summe36" class="form-control" value="0.00 €" readonly>
              </div>
            </div>
          </div>

          <!-- GESAMTSUMME -->
          <div class="besuch-gesamt">
            <span class="besuch-gesamt-label">Gesamtsumme:</span>
            <span id="gesamtsumme" class="besuch-gesamt-wert">0.00 €</span>
          </div>
        </div>

        <!-- NOTIZEN -->
        <div class="form-section">
          <h3 class="section-title">Notizen</h3>
          <div class="form-group">
            <label class="form-label">Interne Notizen (optional)</label>
            <textarea name="notizen" class="form-control" rows="3" 
                      placeholder="z.B. Besonderheiten, Medikamente, Stimmung...">${sourceData?.notizen || ''}</textarea>
          </div>
        </div>

        <!-- BUTTONS -->
        <div class="form-actions">
          <button type="button" class="btn btn--secondary" onclick="closeModal()">Abbrechen</button>
          <button type="submit" class="btn btn--primary">
            ${isDuplicate ? 'Besuch anlegen' : (isEdit ? 'Speichern' : 'Besuch anlegen')}
          </button>
        </div>
      </form>
    </div>
  `;
}

function updateBesuchBudgets(patientId) {
  const patient = findPatient(parseInt(patientId));
  if (!patient) return;

  // Zeige § 36 Block nur wenn Patient das hat
  const block36 = document.getElementById('block36');
  if (block36) {
    block36.style.display = patient.sachleistung40 ? 'block' : 'none';
  }

  // Update Stundensätze
  const satz45b = document.getElementById('satz45b');
  const satz36 = document.getElementById('satz36');
  if (satz45b) satz45b.value = patient.stundensatzNormal;
  if (satz36) satz36.value = patient.stundensatzNormal;

  updateBesuchBerechnung();
}

function updateBesuchBerechnung() {
  const anfahrt = parseFloat(document.querySelector('[name="anfahrt"]')?.value || 0);
  const stunden45b = parseFloat(document.getElementById('stunden45b')?.value || 0);
  const satz45b = parseFloat(document.getElementById('satz45b')?.value || 0);
  const stunden36 = parseFloat(document.getElementById('stunden36')?.value || 0);
  const satz36 = parseFloat(document.getElementById('satz36')?.value || 0);

  const summe45b = stunden45b * satz45b;
  const summe36 = stunden36 * satz36;
  const gesamt = anfahrt + summe45b + summe36;

  if (document.getElementById('summe45b')) {
    document.getElementById('summe45b').value = formatCurrency(summe45b);
  }
  if (document.getElementById('summe36')) {
    document.getElementById('summe36').value = formatCurrency(summe36);
  }
  if (document.getElementById('gesamtsumme')) {
    document.getElementById('gesamtsumme').textContent = formatCurrency(gesamt);
  }
}

function handleBesuchSubmit(event, besuchId) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const patientId = parseInt(formData.get('patientId'));
  const patient = findPatient(patientId);
  const pfleger = currentUser;

  const anfahrt = parseFloat(formData.get('anfahrt'));
  const stunden45b = parseFloat(formData.get('stunden45b') || 0);
  const stunden36 = parseFloat(formData.get('stunden36') || 0);
  const satz = patient.stundensatzNormal;

  // Leistungen zusammenstellen
  const leistungen = [];
  if (anfahrt > 0) {
    leistungen.push({ ...LEISTUNGSKATALOG[9], betrag: anfahrt, menge: 1 });
  }
  if (stunden45b > 0) {
    leistungen.push({ ...LEISTUNGSKATALOG[0], betrag: satz, menge: stunden45b });
  }
  if (stunden36 > 0) {
    leistungen.push({ ...LEISTUNGSKATALOG[8], betrag: satz, menge: stunden36 });
  }

  const gesamtBetrag = anfahrt + (stunden45b * satz) + (stunden36 * satz);
  const stundenGesamt = stunden45b + stunden36;
  const abrechnungsart = stunden36 > 0 ? '§ 36' : '§ 45b';

  const besuchData = {
    patientId: patientId,
    patient: patient,
    pflegerId: pfleger.id,
    pfleger: pfleger,
    datum: formData.get('datum'),
    startZeit: formData.get('startZeit'),
    endZeit: formData.get('endZeit'),
    status: 'geplant',
    leistungen: leistungen,
    gesamtBetrag: gesamtBetrag.toFixed(2),
    stundenGesamt: stundenGesamt,
    stunden45b: stunden45b,
    stunden36: stunden36,
    abrechnungsart: abrechnungsart,
    notizen: formData.get('notizen') || '',
    unterschrift: null
  };

  if (besuchId) {
    // Bearbeiten
    const index = besuchsData.findIndex(b => b.id === besuchId);
    if (index !== -1) {
      besuchsData[index] = { ...besuchsData[index], ...besuchData };
      showToast('✓ Besuch wurde aktualisiert');
    }
  } else {
    // Neu anlegen
    const newId = Math.max(...besuchsData.map(b => b.id), 0) + 1;
    besuchsData.push({ id: newId, ...besuchData });
    showToast('✓ Neuer Besuch wurde angelegt');
  }

  closeModal();

  // View neu rendern
  if (currentRoute === 'besuche') renderBesuche();
  if (currentRoute === 'kalender') renderKalenderView();
  if (currentRoute === 'home') renderHome();
}

function openBesuchForm(besuchId = null) {
  showModal(BesuchForm(besuchId), { size: 'large' });

  // Initial Berechnung nach kurzem Delay (DOM muss fertig sein)
  setTimeout(() => {
    const patientSelect = document.querySelector('[name="patientId"]');
    if (patientSelect && patientSelect.value) {
      updateBesuchBudgets(patientSelect.value);
    }
  }, 100);
}

function duplicateBesuch(besuchId) {
  const besuch = besuchsData.find(b => b.id === besuchId);
  if (!besuch) return;

  showModal(BesuchForm(null, besuch), { size: 'large' });

  setTimeout(() => {
    const patientSelect = document.querySelector('[name="patientId"]');
    if (patientSelect && patientSelect.value) {
      updateBesuchBudgets(patientSelect.value);
    }
  }, 100);
}