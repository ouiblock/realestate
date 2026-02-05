import { calculateImmoPrice } from '../calculation/calculatePrice';
import type { PropertyData, Sources, Ponderations, Ajustements } from '../types';

// Exemple d'utilisation du moteur d'estimation hybride

const propertyData: PropertyData = {
  estimationName: 'T3 Lyon 3e',
  date: '2026-02-05',
  typeBien: 'Appartement',
  adresse: '15 rue de la République',
  ville: 'Lyon',
  codePostal: '69003',
  surface: 65,
  pieces: 3,
  chambres: 2,
  etage: 3,
  ascenseur: true,
  anneeConstruction: 1985
};

const sources: Sources = {
  dvf: [
    { id: '1', prix: 260000, surface: 62, date: '2025-06-15', adresse: '10 rue Duquesne', commentaire: 'T3 similaire même quartier' },
    { id: '2', prix: 275000, surface: 68, date: '2025-09-20', adresse: '22 rue Vendôme', commentaire: 'T3 rénové' },
  ],
  annonces: [
    { id: '3', prix: 285000, surface: 64, pieces: 3, lien: 'https://leboncoin.fr/xxx', source: 'Leboncoin', commentaire: 'En vente actuellement' },
    { id: '4', prix: 270000, surface: 66, pieces: 3, lien: 'https://seloger.com/xxx', source: 'SeLoger', commentaire: 'Bon état' },
  ],
  estimations: [
    { id: '5', prixMin: 255000, prixMax: 290000, source: 'Meilleurs Agents', date: '2026-01-15', commentaire: 'Estimation en ligne' },
  ]
};

const ponderations: Ponderations = {
  dvf: 50,
  annonces: 30,
  estimations: 20
};

const ajustements: Ajustements = {
  etatGeneral: 'Bon',
  dpe: 'C',
  exposition: 'Sud',
  balcon: true,
  terrasse: false,
  jardin: false,
  parking: true,
  cave: false,
  vueDegagee: true,
  calme: false,
  proximiteTransports: true,
  proximiteCommerce: false,
  travauxRecents: false,
  coproprieteEntretenue: true
};

// --- Exécution ---

const result = calculateImmoPrice(propertyData, sources, ponderations, ajustements);

console.log('=== RÉSULTAT ESTIMATION HYBRIDE ===\n');
console.log(`Prix de base (pondéré)  : ${result.prixBase.toLocaleString('fr-FR')} €`);
console.log(`Prix final (ajusté)     : ${result.prixFinal.toLocaleString('fr-FR')} €`);
console.log(`Prix au m²              : ${result.prixM2.toLocaleString('fr-FR')} €/m²`);
console.log(`Fourchette              : ${result.fourchetteBasse.toLocaleString('fr-FR')} € — ${result.fourchetteHaute.toLocaleString('fr-FR')} €`);
console.log(`Score de confiance      : ${result.scoreConfiance}/100`);
console.log(`Position marché         : ${result.positionMarche}`);

console.log('\n--- Détail des sources ---');
console.log(`DVF         : moy. ${result.detailsSources.dvf.moyenne.toLocaleString('fr-FR')} € (poids ${result.detailsSources.dvf.poids.toFixed(0)}%)`);
console.log(`Annonces    : moy. ${result.detailsSources.annonces.moyenne.toLocaleString('fr-FR')} € (poids ${result.detailsSources.annonces.poids.toFixed(0)}%)`);
console.log(`Estimations : moy. ${result.detailsSources.estimations.moyenne.toLocaleString('fr-FR')} € (poids ${result.detailsSources.estimations.poids.toFixed(0)}%)`);

console.log('\n--- Ajustements appliqués ---');
for (const a of result.ajustementsAppliques) {
  const signe = a.valeur >= 0 ? '+' : '';
  console.log(`  ${a.nom} : ${signe}${a.valeur.toFixed(1)}% (${signe}${Math.round(a.impact).toLocaleString('fr-FR')} €)`);
}

// --- Vérifications basiques ---

console.log('\n--- Vérifications ---');
const checks = [
  { label: 'Prix final > 0', ok: result.prixFinal > 0 },
  { label: 'Fourchette basse < prix final', ok: result.fourchetteBasse < result.prixFinal },
  { label: 'Fourchette haute > prix final', ok: result.fourchetteHaute > result.prixFinal },
  { label: 'Score confiance 0-100', ok: result.scoreConfiance >= 0 && result.scoreConfiance <= 100 },
  { label: 'Ajustement total ≤ +30%', ok: result.prixFinal <= result.prixBase * 1.301 },
  { label: 'Ajustement total ≥ -30%', ok: result.prixFinal >= result.prixBase * 0.699 },
];

let allPassed = true;
for (const c of checks) {
  console.log(`  ${c.ok ? '✅' : '❌'} ${c.label}`);
  if (!c.ok) allPassed = false;
}

console.log(allPassed ? '\n✅ Tous les tests passent.' : '\n❌ Certains tests échouent.');
process.exit(allPassed ? 0 : 1);
