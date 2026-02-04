const DEMO_USERS = [
  { id: 1, email: 'chef@vitakreis.de', password: 'admin123', name: 'Max Weber', role: 'admin', beschaeftigungsnummer: '999000111' },
  { id: 2, email: 'sarah@vitakreis.de', password: 'pfleger123', name: 'Sarah Schmidt', role: 'begleiter', beschaeftigungsnummer: '303001010' },
  { id: 3, email: 'thomas@vitakreis.de', password: 'pfleger123', name: 'Thomas Müller', role: 'begleiter', beschaeftigungsnummer: '545435435' }
];

const GLOBAL_STUNDENSATZ = 42.50;
const GLOBAL_ZUSCHLAG_NACHT = 9.00;
const ENTLASTUNGSBETRAG_MONATLICH = 131.00;

const BUDGET_36_BY_PFLEGEGRAD = {
  'PG1': 0,
  'PG2': 318.40,
  'PG3': 598.80,
  'PG4': 743.60,
  'PG5': 919.60
};

let PATIENTEN = [
  { 
    id: 1, 
    vorname: 'Maria', 
    nachname: 'Müller', 
    geburtsdatum: '1945-03-15', 
    pflegegrad: 'PG2',
    entlastungsbetrag: 131.00,
    angespartBetrag: 0,
    angespartGueltigBis: null,
    sachleistung40: false,
    stundensatzNormal: 42.50,
    stundensatzNacht: 51.50,
    versichertennummer: 'P145435243', 
    iknr: '184940005', 
    kassenname: 'BARMER', 
    strasse: 'Hauptstr. 12', 
    plz: '72379', 
    stadt: 'Hechingen', 
    telefon: '+49 7471 123456' 
  },
  { 
    id: 2, 
    vorname: 'Hans', 
    nachname: 'Schmidt', 
    geburtsdatum: '1938-07-22', 
    pflegegrad: 'PG3',
    entlastungsbetrag: 131.00,
    angespartBetrag: 550.00,
    angespartGueltigBis: '2026-01-31',
    sachleistung40: true,
    stundensatzNormal: 42.50,
    stundensatzNacht: 51.50,
    versichertennummer: 'I454654165', 
    iknr: '185830016', 
    kassenname: 'DAK-Gesundheit', 
    strasse: 'Bahnhofstr. 45', 
    plz: '72379', 
    stadt: 'Hechingen', 
    telefon: '+49 7471 234567' 
  },
  { 
    id: 3, 
    vorname: 'Anna', 
    nachname: 'Weber', 
    geburtsdatum: '1950-11-08', 
    pflegegrad: 'PG4',
    entlastungsbetrag: 131.00,
    angespartBetrag: 0,
    angespartGueltigBis: null,
    sachleistung40: true,
    stundensatzNormal: 42.50,
    stundensatzNacht: 51.50,
    versichertennummer: 'A123456780', 
    iknr: '184212505', 
    kassenname: 'AOK', 
    strasse: 'Kirchweg 8', 
    plz: '72379', 
    stadt: 'Hechingen', 
    telefon: '+49 7471 345678' 
  }
];

const KRANKENKASSEN = [
  { iknr: '184940005', name: 'BARMER' },
  { iknr: '185830016', name: 'DAK-Gesundheit' },
  { iknr: '184212505', name: 'AOK Rheinland/Hamburg' },
  { iknr: '188433248', name: 'Siemens Betriebskrankenkasse' }
];

const LEISTUNGSKATALOG = [
  { id: '45b-001', bezeichnung: 'Betreuung im Haushalt', kategorie: '§ 45b SGB XI', paragraf: '§ 45b', betrag: 42.50, einheit: 'Stunde' },
  { id: '45b-002', bezeichnung: 'Begleitung bei Aktivitäten', kategorie: '§ 45b SGB XI', paragraf: '§ 45b', betrag: 42.50, einheit: 'Stunde' },
  { id: '45b-003', bezeichnung: 'Unterstützung im Haushalt', kategorie: '§ 45b SGB XI', paragraf: '§ 45b', betrag: 42.50, einheit: 'Stunde' },
  { id: '45b-004', bezeichnung: 'Einkaufsbegleitung', kategorie: '§ 45b SGB XI', paragraf: '§ 45b', betrag: 42.50, einheit: 'Stunde' },
  { id: '45b-005', bezeichnung: 'Spaziergang/Mobilität', kategorie: '§ 45b SGB XI', paragraf: '§ 45b', betrag: 42.50, einheit: 'Stunde' },
  { id: '45b-006', bezeichnung: 'Gesellschaft/Gespräch', kategorie: '§ 45b SGB XI', paragraf: '§ 45b', betrag: 42.50, einheit: 'Stunde' },
  { id: '45b-007', bezeichnung: 'Gedächtnistraining', kategorie: '§ 45b SGB XI', paragraf: '§ 45b', betrag: 42.50, einheit: 'Stunde' },
  { id: '45b-008', bezeichnung: 'Vorlesen/Beschäftigung', kategorie: '§ 45b SGB XI', paragraf: '§ 45b', betrag: 42.50, einheit: 'Stunde' },
  { id: '36-001', bezeichnung: 'Betreuung aus § 36 (40%)', kategorie: '§ 36 SGB XI', paragraf: '§ 36', betrag: 42.50, einheit: 'Stunde' },
  { id: 'pause-001', bezeichnung: 'Anfahrtspauschale', kategorie: 'Pauschale', paragraf: 'Pauschale', betrag: 5.00, einheit: 'Besuch' }
];

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const WOCHENTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const WOCHENTAGE_KURZ = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

let besuchsData = [];

function generateDemoBesuche() {
  const besuche = [];
  const heute = new Date();
  const thisMonth = heute.getMonth();
  const thisYear = heute.getFullYear();

  for (let i = 0; i < 40; i++) {
    const tag = Math.floor(Math.random() * 28) + 1;
    const datum = new Date(thisYear, thisMonth, tag);
    const patient = PATIENTEN[Math.floor(Math.random() * PATIENTEN.length)];
    const begleiter = DEMO_USERS.filter(u => u.role === 'begleiter')[Math.floor(Math.random() * 2)];
    const stunde = Math.floor(Math.random() * 8) + 9;

    const leistungen = [];
    leistungen.push({...LEISTUNGSKATALOG[9], menge: 1});

    const hauptleistung = LEISTUNGSKATALOG[Math.floor(Math.random() * 8)];
    const stundenAnzahl = Math.random() > 0.5 ? 2 : 3;
    leistungen.push({...hauptleistung, menge: stundenAnzahl});

    const stundensatz = patient.stundensatzNormal;
    const gesamtBetrag = 5.00 + (stundenAnzahl * stundensatz);
    const abrechnungsart = patient.sachleistung40 && Math.random() > 0.5 ? '§ 36' : '§ 45b';

    besuche.push({
      id: i + 1,
      patientId: patient.id,
      patient: patient,
      pflegerId: begleiter.id,
      pfleger: begleiter,
      datum: datum.toISOString().split('T')[0],
      startZeit: `${String(stunde).padStart(2, '0')}:00`,
      endZeit: `${String(stunde + stundenAnzahl).padStart(2, '0')}:00`,
      status: datum <= heute ? 'abgeschlossen' : 'geplant',
      leistungen: leistungen,
      gesamtBetrag: gesamtBetrag.toFixed(2),
      stundenGesamt: stundenAnzahl,
      unterschrift: datum <= heute && Math.random() > 0.15 ? 'vorhanden' : null,
      abrechnungsart: abrechnungsart
    });
  }

  return besuche.sort((a, b) => new Date(b.datum) - new Date(a.datum));
}

besuchsData = generateDemoBesuche();

function findPatient(id) { return PATIENTEN.find(p => p.id === id); }
function updatePatient(id, data) {
  const index = PATIENTEN.findIndex(p => p.id === id);
  if (index !== -1) PATIENTEN[index] = { ...PATIENTEN[index], ...data };
}
function deletePatient(id) { PATIENTEN = PATIENTEN.filter(p => p.id !== id); }
function generateId() { return Math.max(...PATIENTEN.map(p => p.id), 0) + 1; }
function calculateAge(geburtsdatum) {
  const birthDate = new Date(geburtsdatum);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

// KUNDENTACHO mit Anspar-Logik
function calculateKundentacho(patientId, targetMonth = null, targetYear = null) {
  const patient = findPatient(patientId);
  if (!patient) return null;

  const heute = new Date();
  const month = targetMonth !== null ? targetMonth : heute.getMonth();
  const year = targetYear !== null ? targetYear : heute.getFullYear();
  const aktuellesDatum = new Date(year, month, 1);

  // § 45b Budget berechnen
  let budget45b = ENTLASTUNGSBETRAG_MONATLICH; // Standard 131€

  // Prüfe ob angespartes Budget noch gültig ist
  if (patient.angespartBetrag > 0 && patient.angespartGueltigBis) {
    const gueltigBis = new Date(patient.angespartGueltigBis);
    if (aktuellesDatum <= gueltigBis) {
      budget45b += patient.angespartBetrag;
    }
  }

  // § 36 Budget
  const budget36 = patient.sachleistung40 ? BUDGET_36_BY_PFLEGEGRAD[patient.pflegegrad] || 0 : 0;

  // Gebuchte Besuche im Monat
  const besucheMonat = besuchsData.filter(b => {
    const d = new Date(b.datum);
    return b.patientId === patientId && d.getMonth() === month && d.getFullYear() === year;
  });

  const gebucht45b = besucheMonat
    .filter(b => b.abrechnungsart === '§ 45b')
    .reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);

  const gebucht36 = besucheMonat
    .filter(b => b.abrechnungsart === '§ 36')
    .reduce((sum, b) => sum + parseFloat(b.gesamtBetrag), 0);

  const stundenGebucht45b = besucheMonat
    .filter(b => b.abrechnungsart === '§ 45b')
    .reduce((sum, b) => sum + (b.stundenGesamt || 0), 0);

  const stundenGebucht36 = besucheMonat
    .filter(b => b.abrechnungsart === '§ 36')
    .reduce((sum, b) => sum + (b.stundenGesamt || 0), 0);

  const stundensatz = patient.stundensatzNormal || GLOBAL_STUNDENSATZ;
  const verfuegbareStunden45b = budget45b / stundensatz;
  const verfuegbareStunden36 = budget36 / stundensatz;

  const freieStunden45b = verfuegbareStunden45b - stundenGebucht45b;
  const freieStunden36 = verfuegbareStunden36 - stundenGebucht36;

  return {
    patient: patient,
    month: month,
    year: year,
    stundensatz: stundensatz,

    budget45b: {
      verfuegbar: budget45b,
      monatlich: ENTLASTUNGSBETRAG_MONATLICH,
      angespart: patient.angespartBetrag || 0,
      angespartGueltigBis: patient.angespartGueltigBis,
      gebucht: gebucht45b,
      frei: budget45b - gebucht45b,
      stundenVerfuegbar: verfuegbareStunden45b,
      stundenGebucht: stundenGebucht45b,
      stundenFrei: freieStunden45b,
      ueberzogen: gebucht45b > budget45b
    },

    budget36: {
      verfuegbar: budget36,
      gebucht: gebucht36,
      frei: budget36 - gebucht36,
      stundenVerfuegbar: verfuegbareStunden36,
      stundenGebucht: stundenGebucht36,
      stundenFrei: freieStunden36,
      ueberzogen: gebucht36 > budget36,
      verfaelltMonatsende: true
    },

    gesamt: {
      verfuegbar: budget45b + budget36,
      gebucht: gebucht45b + gebucht36,
      frei: (budget45b - gebucht45b) + (budget36 - gebucht36),
      stundenVerfuegbar: verfuegbareStunden45b + verfuegbareStunden36,
      stundenGebucht: stundenGebucht45b + stundenGebucht36,
      stundenFrei: freieStunden45b + freieStunden36
    }
  };
}