let kalenderAnsicht = 'monat'; // 'tag', 'woche', 'monat'
let kalenderDatum = new Date();

function renderKalenderView() {
  document.getElementById('page-title').textContent = 'Kalender';

  document.getElementById('content-area').innerHTML = `
    <div class="kalender-view">
      <div class="kalender-toolbar">
        <div class="kalender-nav">
          <button class="btn-icon" onclick="kalenderNavigate(-1)">‹</button>
          <button class="btn btn--secondary" onclick="kalenderHeute()">Heute</button>
          <button class="btn-icon" onclick="kalenderNavigate(1)">›</button>
        </div>

        <h2 id="kalender-titel">${getKalenderTitel()}</h2>

        <div class="kalender-view-switcher">
          <button class="kalender-view-btn ${kalenderAnsicht === 'tag' ? 'active' : ''}" onclick="setKalenderAnsicht('tag')">Tag</button>
          <button class="kalender-view-btn ${kalenderAnsicht === 'woche' ? 'active' : ''}" onclick="setKalenderAnsicht('woche')">Woche</button>
          <button class="kalender-view-btn ${kalenderAnsicht === 'monat' ? 'active' : ''}" onclick="setKalenderAnsicht('monat')">Monat</button>
        </div>
      </div>

      <div id="kalender-content" class="kalender-content">
        ${renderKalenderContent()}
      </div>
    </div>
  `;
}

function renderKalenderContent() {
  switch(kalenderAnsicht) {
    case 'tag': return renderTagesansicht();
    case 'woche': return renderWochenansicht();
    case 'monat': return renderMonatsansicht();
    default: return renderMonatsansicht();
  }
}

function renderTagesansicht() {
  const datum = kalenderDatum.toISOString().split('T')[0];
  const meineBesuche = currentUser.role === 'admin' ? besuchsData : besuchsData.filter(b => b.pflegerId === currentUser.id);
  const besucheTag = meineBesuche.filter(b => b.datum === datum).sort((a, b) => a.startZeit.localeCompare(b.startZeit));

  return `
    <div class="tagesansicht">
      <div class="tagesansicht-datum">
        ${WOCHENTAGE[kalenderDatum.getDay()]}, ${kalenderDatum.getDate()}. ${MONATE[kalenderDatum.getMonth()]} ${kalenderDatum.getFullYear()}
      </div>
      ${besucheTag.length > 0 ? `
        <div class="besuche-timeline">
          ${besucheTag.map(b => `
            <div class="timeline-item" onclick="showBesuchDetails(${b.id})">
              <div class="timeline-time">${b.startZeit} - ${b.endZeit}</div>
              <div class="timeline-card">
                <div class="timeline-patient">
                  <div class="patient-avatar small">${b.patient.vorname[0]}${b.patient.nachname[0]}</div>
                  <div>
                    <div class="timeline-patient-name">${b.patient.vorname} ${b.patient.nachname}</div>
                    <div class="timeline-adresse">${b.patient.strasse}, ${b.patient.stadt}</div>
                  </div>
                </div>
                <div class="timeline-meta">
                  <span class="timeline-badge badge--${b.status === 'abgeschlossen' ? 'success' : 'warning'}">
                    ${b.status === 'abgeschlossen' ? '✓ Abgeschlossen' : '⏰ Geplant'}
                  </span>
                  <span class="timeline-betrag">${formatCurrency(b.gesamtBetrag)}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : '<p class="text-muted text-center" style="padding: 40px;">Keine Besuche an diesem Tag</p>'}
    </div>
  `;
}

function renderWochenansicht() {
  const wochenstart = getWochenstart(kalenderDatum);
  const tage = [];

  for (let i = 0; i < 7; i++) {
    const tag = new Date(wochenstart);
    tag.setDate(wochenstart.getDate() + i);
    tage.push(tag);
  }

  const meineBesuche = currentUser.role === 'admin' ? besuchsData : besuchsData.filter(b => b.pflegerId === currentUser.id);

  return `
    <div class="wochenansicht">
      <div class="wochen-grid">
        ${tage.map(tag => {
          const datum = tag.toISOString().split('T')[0];
          const besucheTag = meineBesuche.filter(b => b.datum === datum);
          const isHeute = datum === new Date().toISOString().split('T')[0];

          return `
            <div class="wochen-tag ${isHeute ? 'heute' : ''}" onclick="kalenderDatum = new Date('${datum}'); setKalenderAnsicht('tag')">
              <div class="wochen-tag-header">
                <div class="wochen-wochentag">${WOCHENTAGE_KURZ[tag.getDay()]}</div>
                <div class="wochen-datum">${tag.getDate()}</div>
              </div>
              <div class="wochen-besuche">
                ${besucheTag.length > 0 ? `
                  <div class="wochen-count">${besucheTag.length} Besuch${besucheTag.length !== 1 ? 'e' : ''}</div>
                  ${besucheTag.slice(0, 3).map(b => `
                    <div class="wochen-besuch-mini" onclick="event.stopPropagation(); showBesuchDetails(${b.id})">
                      <span>${b.startZeit}</span>
                      <span>${b.patient.nachname}</span>
                    </div>
                  `).join('')}
                  ${besucheTag.length > 3 ? `<div class="wochen-mehr">+${besucheTag.length - 3} weitere</div>` : ''}
                ` : '<div class="wochen-leer">Keine Besuche</div>'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderMonatsansicht() {
  const monat = kalenderDatum.getMonth();
  const jahr = kalenderDatum.getFullYear();

  const meineBesuche = currentUser.role === 'admin' ? besuchsData : besuchsData.filter(b => b.pflegerId === currentUser.id);
  const besucheMonat = meineBesuche.filter(b => {
    const d = new Date(b.datum);
    return d.getMonth() === monat && d.getFullYear() === jahr;
  });

  const byDate = groupBy(besucheMonat, 'datum');

  return `
    <div class="monatsansicht">
      ${Object.keys(byDate).length > 0 ? `
        <div class="kalender-liste">
          ${Object.entries(byDate)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([datum, besuche]) => `
              <div class="kalender-tag-block">
                <div class="kalender-tag-header">
                  <h3>${formatDate(new Date(datum), true)}</h3>
                  <span class="badge">${besuche.length} Besuch${besuche.length !== 1 ? 'e' : ''}</span>
                </div>
                <div class="besuche-liste">
                  ${besuche.map(renderBesuchCard).join('')}
                </div>
              </div>
            `).join('')}
        </div>
      ` : '<p class="text-muted text-center" style="padding: 40px;">Keine Besuche in diesem Monat</p>'}
    </div>
  `;
}

function setKalenderAnsicht(ansicht) {
  kalenderAnsicht = ansicht;
  renderKalenderView();
}

function kalenderNavigate(richtung) {
  switch(kalenderAnsicht) {
    case 'tag':
      kalenderDatum.setDate(kalenderDatum.getDate() + richtung);
      break;
    case 'woche':
      kalenderDatum.setDate(kalenderDatum.getDate() + (richtung * 7));
      break;
    case 'monat':
      kalenderDatum.setMonth(kalenderDatum.getMonth() + richtung);
      break;
  }
  renderKalenderView();
}

function kalenderHeute() {
  kalenderDatum = new Date();
  renderKalenderView();
}

function getKalenderTitel() {
  switch(kalenderAnsicht) {
    case 'tag':
      return `${kalenderDatum.getDate()}. ${MONATE[kalenderDatum.getMonth()]} ${kalenderDatum.getFullYear()}`;
    case 'woche':
      const wochenstart = getWochenstart(kalenderDatum);
      const wochenende = new Date(wochenstart);
      wochenende.setDate(wochenende.getDate() + 6);
      return `KW ${getKW(kalenderDatum)} - ${wochenstart.getDate()}. - ${wochenende.getDate()}. ${MONATE[kalenderDatum.getMonth()]} ${kalenderDatum.getFullYear()}`;
    case 'monat':
      return `${MONATE[kalenderDatum.getMonth()]} ${kalenderDatum.getFullYear()}`;
  }
}

function getWochenstart(datum) {
  const d = new Date(datum);
  const tag = d.getDay();
  const diff = d.getDate() - tag + (tag === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getKW(datum) {
  const d = new Date(Date.UTC(datum.getFullYear(), datum.getMonth(), datum.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}