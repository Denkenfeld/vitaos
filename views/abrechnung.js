function renderAbrechnung() {
  document.getElementById('page-title').textContent = 'Abrechnung';

  const heute = new Date();
  const thisMonth = heute.getMonth();
  const thisYear = heute.getFullYear();

  const besucheMonat = besuchsData.filter(b => {
    const d = new Date(b.datum);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const gesamtUmsatz = besucheMonat.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
  const byPatient = groupBy(besucheMonat, 'patientId');

  const besuche45b = besucheMonat.filter(b => b.abrechnungsart === '§ 45b');
  const besuche36 = besucheMonat.filter(b => b.abrechnungsart === '§ 36');
  const umsatz45b = besuche45b.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
  const umsatz36 = besuche36.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);

  document.getElementById('content-area').innerHTML = `
    <div class="abrechnung-view">
      <div class="section">
        <div class="section-header">
          <h2>Abrechnung ${MONATE[thisMonth]} ${thisYear}</h2>
          <button class="btn btn--primary" onclick="exportAbrechnungPDF()">📄 PDF Export</button>
        </div>

        <div class="info-box" style="background: #EFF6FF; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <h4 style="margin-bottom: 12px;">📋 Abrechnungsgrundlagen SGB XI</h4>
          <div style="display: grid; gap: 8px; font-size: 0.9rem;">
            <div><strong>§ 45a SGB XI:</strong> Anerkanntes Angebot zur Unterstützung im Alltag</div>
            <div><strong>§ 45b SGB XI:</strong> Entlastungsbetrag 131€/Monat (für alle Pflegegrade)</div>
            <div><strong>§ 36 SGB XI:</strong> 40% Umwandlungsanspruch aus Pflegesachleistungen</div>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-label">Besuche gesamt</div>
            <div class="stat-value">${besucheMonat.length}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Patienten</div>
            <div class="stat-value">${Object.keys(byPatient).length}</div>
          </div>
          <div class="stat-item primary">
            <div class="stat-label">Gesamtumsatz</div>
            <div class="stat-value">${formatCurrency(gesamtUmsatz)}</div>
          </div>
        </div>

        <div class="stats-row" style="margin-top: 16px;">
          <div class="stat-item" style="background: #D1FAE5;">
            <div class="stat-label">§ 45b SGB XI</div>
            <div class="stat-value">${formatCurrency(umsatz45b)}</div>
            <div style="font-size: 0.75rem; color: #6B7280; margin-top: 4px;">${besuche45b.length} Besuche</div>
          </div>
          <div class="stat-item" style="background: #DBEAFE;">
            <div class="stat-label">§ 36 SGB XI (40%)</div>
            <div class="stat-value">${formatCurrency(umsatz36)}</div>
            <div style="font-size: 0.75rem; color: #6B7280; margin-top: 4px;">${besuche36.length} Besuche</div>
          </div>
        </div>

        <h3>Übersicht nach Patient</h3>
        ${Object.keys(byPatient).length > 0 ? `
          <div class="abrechnung-liste">
            ${Object.entries(byPatient).map(([patientId, besuche]) => {
              const patient = besuche[0].patient;
              const summe = besuche.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
              const summe45b = besuche.filter(b => b.abrechnungsart === '§ 45b').reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
              const summe36 = besuche.filter(b => b.abrechnungsart === '§ 36').reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
              const tacho = calculateKundentacho(patient.id);
              const entlastungRest = tacho.budget45b.frei;

              return `
                <div class="abrechnung-card">
                  <div class="abrechnung-patient">
                    <div class="patient-avatar">${patient.vorname[0]}${patient.nachname[0]}</div>
                    <div style="flex: 1;">
                      <div class="patient-name">${patient.vorname} ${patient.nachname}</div>
                      <div class="patient-meta">${patient.kassenname} · ${patient.pflegegrad}</div>
                      <div style="font-size: 0.75rem; color: #6B7280; margin-top: 4px;">
                        § 45b: ${formatCurrency(summe45b)} (Rest: ${formatCurrency(entlastungRest)})
                        ${summe36 > 0 ? ` | § 36: ${formatCurrency(summe36)}` : ''}
                      </div>
                    </div>
                  </div>
                  <div class="abrechnung-stats">
                    <div style="font-size: 0.875rem; color: #6B7280;">${besuche.length} Besuche</div>
                    <div class="abrechnung-betrag">${formatCurrency(summe)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : '<p class="text-muted">Keine Besuche in diesem Monat</p>'}
      </div>
    </div>
  `;
}

function exportAbrechnungPDF() {
  const heute = new Date();
  const thisMonth = heute.getMonth();
  const thisYear = heute.getFullYear();

  const besucheMonat = besuchsData.filter(b => {
    const d = new Date(b.datum);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const gesamtUmsatz = besucheMonat.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
  const byPatient = groupBy(besucheMonat, 'patientId');

  const besuche45b = besucheMonat.filter(b => b.abrechnungsart === '§ 45b');
  const besuche36 = besucheMonat.filter(b => b.abrechnungsart === '§ 36');
  const umsatz45b = besuche45b.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
  const umsatz36 = besuche36.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);

  // Erstelle HTML für PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Abrechnung ${MONATE[thisMonth]} ${thisYear}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #00A499; border-bottom: 3px solid #00A499; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 20px 0; }
        .stat-box { background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-label { font-size: 14px; color: #6B7280; margin-bottom: 8px; }
        .stat-value { font-size: 28px; font-weight: bold; color: #00A499; }
        .patient-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .patient-table th { background: #00A499; color: white; padding: 12px; text-align: left; }
        .patient-table td { padding: 12px; border-bottom: 1px solid #E5E7EB; }
        .patient-table tr:hover { background: #F9FAFB; }
        .total-row { font-weight: bold; background: #F3F4F6; }
        .info-box { background: #EFF6FF; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; font-size: 12px; color: #6B7280; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>Abrechnung ${MONATE[thisMonth]} ${thisYear}</h1>
          <p>Erstellt am ${formatDate(heute)}</p>
        </div>
        <div style="text-align: right;">
          <strong>Vita Kreis</strong><br>
          Alltagsbegleitung SGB XI
        </div>
      </div>

      <div class="info-box">
        <h3>📋 Abrechnungsgrundlagen SGB XI</h3>
        <p><strong>§ 45a SGB XI:</strong> Anerkanntes Angebot zur Unterstützung im Alltag</p>
        <p><strong>§ 45b SGB XI:</strong> Entlastungsbetrag 131€/Monat (für alle Pflegegrade)</p>
        <p><strong>§ 36 SGB XI:</strong> 40% Umwandlungsanspruch aus Pflegesachleistungen</p>
      </div>

      <div class="stats">
        <div class="stat-box">
          <div class="stat-label">Besuche gesamt</div>
          <div class="stat-value">${besucheMonat.length}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Patienten</div>
          <div class="stat-value">${Object.keys(byPatient).length}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Gesamtumsatz</div>
          <div class="stat-value">${formatCurrency(gesamtUmsatz)}</div>
        </div>
      </div>

      <div class="stats" style="grid-template-columns: 1fr 1fr;">
        <div class="stat-box" style="background: #D1FAE5;">
          <div class="stat-label">§ 45b SGB XI</div>
          <div class="stat-value">${formatCurrency(umsatz45b)}</div>
          <div style="font-size: 14px; margin-top: 8px;">${besuche45b.length} Besuche</div>
        </div>
        <div class="stat-box" style="background: #DBEAFE;">
          <div class="stat-label">§ 36 SGB XI (40%)</div>
          <div class="stat-value">${formatCurrency(umsatz36)}</div>
          <div style="font-size: 14px; margin-top: 8px;">${besuche36.length} Besuche</div>
        </div>
      </div>

      <h2>Übersicht nach Patient</h2>
      <table class="patient-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Pflegegrad</th>
            <th>Besuche</th>
            <th>§ 45b</th>
            <th>§ 36</th>
            <th>Gesamt</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(byPatient).map(([patientId, besuche]) => {
            const patient = besuche[0].patient;
            const summe = besuche.reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
            const summe45b = besuche.filter(b => b.abrechnungsart === '§ 45b').reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);
            const summe36 = besuche.filter(b => b.abrechnungsart === '§ 36').reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);

            return `
              <tr>
                <td>${patient.vorname} ${patient.nachname}</td>
                <td>${patient.pflegegrad}</td>
                <td>${besuche.length}</td>
                <td>${formatCurrency(summe45b)}</td>
                <td>${formatCurrency(summe36)}</td>
                <td><strong>${formatCurrency(summe)}</strong></td>
              </tr>
            `;
          }).join('')}
          <tr class="total-row">
            <td colspan="2">GESAMT</td>
            <td>${besucheMonat.length}</td>
            <td>${formatCurrency(umsatz45b)}</td>
            <td>${formatCurrency(umsatz36)}</td>
            <td>${formatCurrency(gesamtUmsatz)}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <p>Erstellt mit Vita OS - Alltagsbegleitung Management System</p>
        <p>© ${thisYear} Vita Kreis</p>
      </div>
    </body>
    </html>
  `;

  // Erstelle Blob und Download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Abrechnung_${MONATE[thisMonth]}_${thisYear}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('✓ Abrechnung wurde als HTML exportiert (im Browser als PDF drucken)', 'success', 5000);
}