function renderKundentacho(patientId, options = {}) {
  const tacho = calculateKundentacho(patientId);
  if (!tacho) return '<p>Keine Daten verfügbar</p>';

  const { compact = false } = options;

  if (compact) {
    return renderKundentachoCompact(tacho);
  }

  return renderKundentachoFull(tacho);
}

function renderKundentachoFull(tacho) {
  const { budget45b, budget36, gesamt, patient, stundensatz } = tacho;

  const prozent45b = budget45b.verfuegbar > 0 ? (budget45b.gebucht / budget45b.verfuegbar) * 100 : 0;
  const prozent36 = budget36.verfuegbar > 0 ? (budget36.gebucht / budget36.verfuegbar) * 100 : 0;

  const status45b = budget45b.ueberzogen ? 'danger' : (prozent45b > 80 ? 'warning' : 'success');
  const status36 = budget36.ueberzogen ? 'danger' : (prozent36 > 80 ? 'warning' : 'success');

  const hatAngespart = budget45b.angespart > 0 && budget45b.angespartGueltigBis;
  const angespartAbgelaufen = hatAngespart && new Date(budget45b.angespartGueltigBis) < new Date();

  return `
    <div class="kundentacho">
      <div class="tacho-header">
        <h3>🎯 Kundentacho - ${MONATE[tacho.month]} ${tacho.year}</h3>
        <div class="tacho-stundensatz">Stundensatz: ${formatCurrency(stundensatz)}</div>
      </div>

      <!-- § 45b SGB XI -->
      <div class="tacho-section">
        <div class="tacho-section-header">
          <h4>§ 45b SGB XI - Entlastungsbetrag</h4>
          <span class="tacho-badge badge--${status45b}">${budget45b.ueberzogen ? '⚠️ Überzogen' : '✓ OK'}</span>
        </div>

        ${hatAngespart ? `
          <div class="tacho-anspar-info ${angespartAbgelaufen ? 'abgelaufen' : 'aktiv'}">
            <div class="tacho-anspar-header">
              <span>💰 Angespartes Budget</span>
              ${angespartAbgelaufen ? 
                '<span class="tacho-anspar-badge abgelaufen">Abgelaufen</span>' : 
                '<span class="tacho-anspar-badge aktiv">Aktiv</span>'}
            </div>
            <div class="tacho-anspar-details">
              <div><strong>${formatCurrency(budget45b.angespart)}</strong></div>
              <div style="font-size: 0.875rem; color: #6B7280;">
                Gültig bis ${formatDateShort(new Date(budget45b.angespartGueltigBis))}
              </div>
            </div>
          </div>
        ` : ''}

        <div class="tacho-budget-breakdown">
          <div class="tacho-breakdown-item">
            <span class="tacho-breakdown-label">Monatlich (§ 45b)</span>
            <span class="tacho-breakdown-value">${formatCurrency(budget45b.monatlich)}</span>
          </div>
          ${hatAngespart && !angespartAbgelaufen ? `
            <div class="tacho-breakdown-item">
              <span class="tacho-breakdown-label">+ Angespart</span>
              <span class="tacho-breakdown-value">${formatCurrency(budget45b.angespart)}</span>
            </div>
          ` : ''}
          <div class="tacho-breakdown-item total">
            <span class="tacho-breakdown-label">Verfügbar gesamt</span>
            <span class="tacho-breakdown-value">${formatCurrency(budget45b.verfuegbar)}</span>
          </div>
        </div>

        <div class="tacho-progress">
          <div class="tacho-progress-bar tacho-progress--${status45b}" 
               style="width: ${Math.min(prozent45b, 100)}%">
            ${prozent45b.toFixed(0)}%
          </div>
        </div>

        <div class="tacho-stats">
          <div class="tacho-stat">
            <span class="tacho-stat-label">Verfügbar</span>
            <span class="tacho-stat-value">${formatCurrency(budget45b.verfuegbar)}</span>
            <span class="tacho-stat-sub">${budget45b.stundenVerfuegbar.toFixed(1)}h</span>
          </div>
          <div class="tacho-stat">
            <span class="tacho-stat-label">Gebucht</span>
            <span class="tacho-stat-value">${formatCurrency(budget45b.gebucht)}</span>
            <span class="tacho-stat-sub">${budget45b.stundenGebucht.toFixed(1)}h</span>
          </div>
          <div class="tacho-stat">
            <span class="tacho-stat-label">Frei</span>
            <span class="tacho-stat-value ${budget45b.frei < 0 ? 'text-danger' : ''}">${formatCurrency(budget45b.frei)}</span>
            <span class="tacho-stat-sub">${budget45b.stundenFrei.toFixed(1)}h</span>
          </div>
        </div>

        <div class="tacho-info">
          <small>💡 Ansparmöglichkeit: Max. 18 Monate, Vorjahr bis 30.06. nutzbar</small>
        </div>
      </div>

      ${patient.sachleistung40 ? `
        <!-- § 36 SGB XI (40%) -->
        <div class="tacho-section">
          <div class="tacho-section-header">
            <h4>§ 36 SGB XI - Umwandlung (40%)</h4>
            <span class="tacho-badge badge--${status36}">${budget36.ueberzogen ? '⚠️ Überzogen' : '✓ OK'}</span>
          </div>

          <div class="tacho-progress">
            <div class="tacho-progress-bar tacho-progress--${status36}" 
                 style="width: ${Math.min(prozent36, 100)}%">
              ${prozent36.toFixed(0)}%
            </div>
          </div>

          <div class="tacho-stats">
            <div class="tacho-stat">
              <span class="tacho-stat-label">Verfügbar</span>
              <span class="tacho-stat-value">${formatCurrency(budget36.verfuegbar)}</span>
              <span class="tacho-stat-sub">${budget36.stundenVerfuegbar.toFixed(1)}h</span>
            </div>
            <div class="tacho-stat">
              <span class="tacho-stat-label">Gebucht</span>
              <span class="tacho-stat-value">${formatCurrency(budget36.gebucht)}</span>
              <span class="tacho-stat-sub">${budget36.stundenGebucht.toFixed(1)}h</span>
            </div>
            <div class="tacho-stat">
              <span class="tacho-stat-label">Frei</span>
              <span class="tacho-stat-value ${budget36.frei < 0 ? 'text-danger' : ''}">${formatCurrency(budget36.frei)}</span>
              <span class="tacho-stat-sub">${budget36.stundenFrei.toFixed(1)}h</span>
            </div>
          </div>

          <div class="tacho-warning">
            <small>⚠️ Verfällt am Monatsende!</small>
          </div>
        </div>
      ` : ''}

      <!-- Gesamt -->
      <div class="tacho-gesamt">
        <div class="tacho-gesamt-item">
          <span class="tacho-gesamt-label">Gesamt Verfügbar</span>
          <span class="tacho-gesamt-value">${formatCurrency(gesamt.verfuegbar)}</span>
          <span class="tacho-gesamt-sub">${gesamt.stundenVerfuegbar.toFixed(1)} Stunden</span>
        </div>
        <div class="tacho-gesamt-item">
          <span class="tacho-gesamt-label">Noch Frei</span>
          <span class="tacho-gesamt-value ${gesamt.frei < 0 ? 'text-danger' : 'text-success'}">${formatCurrency(gesamt.frei)}</span>
          <span class="tacho-gesamt-sub">${gesamt.stundenFrei.toFixed(1)} Stunden</span>
        </div>
      </div>
    </div>
  `;
}

function renderKundentachoCompact(tacho) {
  const { gesamt, budget45b, budget36 } = tacho;
  const ueberzogen = budget45b.ueberzogen || budget36.ueberzogen;
  const status = ueberzogen ? 'danger' : (gesamt.stundenFrei < 5 ? 'warning' : 'success');

  return `
    <div class="kundentacho-compact">
      <div class="tacho-compact-icon tacho-compact--${status}">
        ${ueberzogen ? '⚠️' : (gesamt.stundenFrei < 5 ? '⏰' : '✓')}
      </div>
      <div class="tacho-compact-info">
        <div class="tacho-compact-label">Freie Stunden</div>
        <div class="tacho-compact-value">${gesamt.stundenFrei.toFixed(1)}h</div>
      </div>
    </div>
  `;
}

function showKundentachoModal(patientId) {
  const tacho = calculateKundentacho(patientId);
  if (!tacho) {
    showToast('Keine Tacho-Daten verfügbar', 'error');
    return;
  }

  showModal(`
    <div class="modal-header">
      <h2>Kundentacho - ${tacho.patient.vorname} ${tacho.patient.nachname}</h2>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      ${renderKundentachoFull(tacho)}
      <div style="margin-top: 24px; text-align: center;">
        <button class="btn btn--secondary" onclick="closeModal(); openPatientForm(${patientId})">
          ✏️ Patient bearbeiten
        </button>
      </div>
    </div>
  `, { size: 'large' });
}