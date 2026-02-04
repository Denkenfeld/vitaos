function renderBesuche() {
  document.getElementById('page-title').textContent = 'Besuche';
  const meineBesuche = currentUser.role === 'admin' ? besuchsData : besuchsData.filter(b => b.pflegerId === currentUser.id);

  document.getElementById('content-area').innerHTML = `
    <div class="besuche-view">
      <div class="besuche-liste">
        ${meineBesuche.map(renderBesuchCard).join('')}
      </div>
    </div>
  `;
}

function showBesuchDetails(besuchId) {
  const besuch = besuchsData.find(b => b.id === besuchId);
  showModal(`
    <div class="modal-header">
      <h2>Besuch Details</h2>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <h3>Patient</h3>
      <p><strong>${besuch.patient.vorname} ${besuch.patient.nachname}</strong><br>
      ${besuch.patient.strasse}, ${besuch.patient.plz} ${besuch.patient.stadt}</p>

      <h3>Datum & Zeit</h3>
      <p>${formatDateShort(besuch.datum)} · ${formatTime(besuch.startZeit)} - ${formatTime(besuch.endZeit)}</p>

      <h3>Leistungen</h3>
      <table class="detail-table">
        <tbody>
          ${besuch.leistungen.map(l => `
            <tr>
              <td>${l.bezeichnung}</td>
              <td class="text-right">${formatCurrency(l.betrag)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td><strong>Gesamt</strong></td>
            <td class="text-right"><strong>${formatCurrency(besuch.gesamtBetrag)}</strong></td>
          </tr>
        </tbody>
      </table>

      ${!besuch.unterschrift ? `
        <button class="btn btn--primary btn--full-width" onclick="closeModal(); openSignaturePad(${besuch.id})">
          ✍️ Unterschrift erfassen
        </button>
      ` : '<p class="text-center">✓ Unterschrift vorhanden</p>'}
    </div>
  `, { size: 'large' });
}