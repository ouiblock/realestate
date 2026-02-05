import type { Sources, Ponderations, Ajustements, CalculationResult, PropertyData, EtatGeneral, ClasseDPE } from '../types';

// Calcul du multiplicateur d'état général
function getEtatGeneralMultiplier(etat: EtatGeneral): number {
  switch (etat) {
    case 'Neuf / récent': return 1.10;
    case 'Bon': return 1.0;
    case 'À rafraîchir': return 0.92;
    case 'À rénover': return 0.80;
    default: return 1.0;
  }
}

// Calcul du bonus/malus DPE
function getDPEBonus(dpe: ClasseDPE): number {
  switch (dpe) {
    case 'A': return 12;
    case 'B': return 8;
    case 'C': return 4;
    case 'D': return 0;
    case 'E': return -5;
    case 'F': return -12;
    case 'G': return -20;
    case 'Non renseigné': return 0;
    default: return 0;
  }
}

// Calcul du bonus exposition
function getExpositionBonus(exposition: string): number {
  switch (exposition) {
    case 'Sud': return 8;
    case 'Double': return 6;
    case 'Triple': return 10;
    case 'Est': return 3;
    case 'Ouest': return 2;
    case 'Nord': return -3;
    default: return 0;
  }
}

// Calcul du prix moyen d'une catégorie de sources
function calculateCategoryAverage(prices: number[]): number {
  if (prices.length === 0) return 0;
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
}

// Coefficient de pondération dégressif pour éviter des ajustements cumulés trop importants
function getCoefficientPonderation(nombreAjustements: number): number {
  // Jusqu'à 3 ajustements : 100% de l'impact
  if (nombreAjustements <= 3) return 1.0;
  // 4-6 ajustements : réduction progressive (90% → 75%)
  if (nombreAjustements <= 6) return 1.0 - (nombreAjustements - 3) * 0.05;
  // 7-10 ajustements : réduction progressive (70% → 55%)
  if (nombreAjustements <= 10) return 0.75 - (nombreAjustements - 6) * 0.05;
  // 11+ ajustements : plafond à 45%
  return 0.45;
}

// Plafond global des ajustements en % du prix de base
const PLAFOND_AJUSTEMENT_HAUT = 0.30; // +30% max
const PLAFOND_AJUSTEMENT_BAS = -0.30; // -30% max

// Calcul principal
export function calculateImmoPrice(
  propertyData: PropertyData,
  sources: Sources,
  ponderations: Ponderations,
  ajustements: Ajustements
): CalculationResult {
  // 1. Calcul des moyennes par catégorie (au m²)
  const dvfAvg = calculateCategoryAverage(
    sources.dvf.map(d => d.prix / d.surface)
  ) * propertyData.surface;
  
  const annoncesAvg = calculateCategoryAverage(
    sources.annonces.map(a => a.prix / a.surface)
  ) * propertyData.surface;
  
  const estimationsAvg = calculateCategoryAverage(
    sources.estimations.map(e => (e.prixMin + e.prixMax) / 2)
  );
  
  // 2. Calcul du prix de base pondéré
  const totalSources = sources.dvf.length + sources.annonces.length + sources.estimations.length;
  
  if (totalSources === 0) {
    throw new Error('Au moins une source de prix est requise');
  }
  
  // Normaliser les pondérations
  const totalPonderation = ponderations.dvf + ponderations.annonces + ponderations.estimations;
  
  const normDVF = ponderations.dvf / totalPonderation;
  const normAnnonces = ponderations.annonces / totalPonderation;
  const normEstimations = ponderations.estimations / totalPonderation;
  
  // Contributions pondérées
  const contribDVF = sources.dvf.length > 0 ? dvfAvg * normDVF : 0;
  const contribAnnonces = sources.annonces.length > 0 ? annoncesAvg * normAnnonces : 0;
  const contribEstimations = sources.estimations.length > 0 ? estimationsAvg * normEstimations : 0;
  
  // Recalculer la pondération effective
  const effectivePonderation = 
    (sources.dvf.length > 0 ? normDVF : 0) +
    (sources.annonces.length > 0 ? normAnnonces : 0) +
    (sources.estimations.length > 0 ? normEstimations : 0);
  
  const prixBase = (contribDVF + contribAnnonces + contribEstimations) / effectivePonderation;
  
  // 3. Application des ajustements qualitatifs (méthode ADDITIVE)
  // Tous les ajustements sont calculés en % du prix de base, puis sommés
  const ajustementsAppliques: { nom: string; valeur: number; impact: number }[] = [];
  let totalPourcentageAjustements = 0;
  
  // État général (multiplicateur converti en %)
  const etatMultiplier = getEtatGeneralMultiplier(ajustements.etatGeneral);
  if (etatMultiplier !== 1.0) {
    const pct = (etatMultiplier - 1) * 100;
    ajustementsAppliques.push({
      nom: `État général: ${ajustements.etatGeneral}`,
      valeur: pct,
      impact: prixBase * (pct / 100)
    });
    totalPourcentageAjustements += pct;
  }
  
  // DPE
  const dpeBonus = getDPEBonus(ajustements.dpe);
  if (dpeBonus !== 0) {
    ajustementsAppliques.push({
      nom: `DPE: ${ajustements.dpe}`,
      valeur: dpeBonus,
      impact: prixBase * (dpeBonus / 100)
    });
    totalPourcentageAjustements += dpeBonus;
  }
  
  // Exposition
  const expositionBonus = getExpositionBonus(ajustements.exposition);
  if (expositionBonus !== 0) {
    ajustementsAppliques.push({
      nom: `Exposition: ${ajustements.exposition}`,
      valeur: expositionBonus,
      impact: prixBase * (expositionBonus / 100)
    });
    totalPourcentageAjustements += expositionBonus;
  }
  
  // Équipements (% réduits et réalistes)
  const equipements: { condition: boolean; nom: string; pct: number }[] = [
    { condition: ajustements.balcon, nom: 'Balcon', pct: 4 },
    { condition: ajustements.terrasse, nom: 'Terrasse', pct: 6 },
    { condition: ajustements.jardin, nom: 'Jardin', pct: 8 },
    { condition: ajustements.parking, nom: 'Parking', pct: 5 },
    { condition: ajustements.cave, nom: 'Cave', pct: 2 },
  ];
  
  for (const eq of equipements) {
    if (eq.condition) {
      ajustementsAppliques.push({ nom: eq.nom, valeur: eq.pct, impact: prixBase * (eq.pct / 100) });
      totalPourcentageAjustements += eq.pct;
    }
  }
  
  // Vue & environnement
  const environnement: { condition: boolean; nom: string; pct: number }[] = [
    { condition: ajustements.vueDegagee, nom: 'Vue dégagée', pct: 5 },
    { condition: ajustements.calme, nom: 'Calme', pct: 3 },
    { condition: ajustements.proximiteTransports, nom: 'Proximité transports', pct: 4 },
    { condition: ajustements.proximiteCommerce, nom: 'Proximité commerces', pct: 3 },
  ];
  
  for (const env of environnement) {
    if (env.condition) {
      ajustementsAppliques.push({ nom: env.nom, valeur: env.pct, impact: prixBase * (env.pct / 100) });
      totalPourcentageAjustements += env.pct;
    }
  }
  
  // Autres
  const autres: { condition: boolean; nom: string; pct: number }[] = [
    { condition: ajustements.travauxRecents, nom: 'Travaux récents', pct: 7 },
    { condition: ajustements.coproprieteEntretenue, nom: 'Copropriété entretenue', pct: 3 },
  ];
  
  for (const a of autres) {
    if (a.condition) {
      ajustementsAppliques.push({ nom: a.nom, valeur: a.pct, impact: prixBase * (a.pct / 100) });
      totalPourcentageAjustements += a.pct;
    }
  }
  
  // Application du coefficient de pondération si beaucoup d'ajustements
  const nombreAjustements = ajustementsAppliques.length;
  const coeffPonderation = getCoefficientPonderation(nombreAjustements);
  
  let ajustementFinalPct = totalPourcentageAjustements * coeffPonderation;
  
  if (coeffPonderation < 1.0) {
    const reduction = totalPourcentageAjustements - ajustementFinalPct;
    ajustementsAppliques.push({
      nom: `⚖️ Pondération (${nombreAjustements} ajustements, coeff. ${(coeffPonderation * 100).toFixed(0)}%)`,
      valeur: -reduction,
      impact: prixBase * (-reduction / 100)
    });
  }
  
  // Plafonnement global à ±30%
  const ajustementAvantPlafond = ajustementFinalPct;
  if (ajustementFinalPct > PLAFOND_AJUSTEMENT_HAUT * 100) {
    ajustementFinalPct = PLAFOND_AJUSTEMENT_HAUT * 100;
  } else if (ajustementFinalPct < PLAFOND_AJUSTEMENT_BAS * 100) {
    ajustementFinalPct = PLAFOND_AJUSTEMENT_BAS * 100;
  }
  
  if (ajustementFinalPct !== ajustementAvantPlafond) {
    const ecretement = ajustementFinalPct - ajustementAvantPlafond;
    ajustementsAppliques.push({
      nom: `🔒 Plafond ±30% appliqué`,
      valeur: ecretement,
      impact: prixBase * (ecretement / 100)
    });
  }
  
  const prixAjuste = prixBase * (1 + ajustementFinalPct / 100);
  
  const prixFinal = Math.round(prixAjuste);
  const prixM2 = Math.round(prixFinal / propertyData.surface);
  
  // 4. Calcul de la fourchette
  const allPrices = [
    ...sources.dvf.map(d => d.prix),
    ...sources.annonces.map(a => a.prix),
    ...sources.estimations.map(e => (e.prixMin + e.prixMax) / 2)
  ];
  
  const ecartType = calculateStandardDeviation(allPrices);
  const coefficientVariation = ecartType / prixBase;
  
  let fourchettePercent = 0.08;
  if (totalSources < 3) fourchettePercent = 0.15;
  else if (totalSources < 5) fourchettePercent = 0.12;
  else if (coefficientVariation > 0.15) fourchettePercent = 0.12;
  
  const fourchetteBasse = Math.round(prixFinal * (1 - fourchettePercent));
  const fourchetteHaute = Math.round(prixFinal * (1 + fourchettePercent));
  
  // 5. Score de confiance
  const scoreConfiance = calculateConfidenceScore(
    totalSources,
    coefficientVariation,
    ajustementsAppliques.length
  );
  
  // 6. Positionnement marché
  const positionMarche = calculateMarketPosition(prixFinal, prixBase);
  
  return {
    prixBase: Math.round(prixBase),
    prixFinal,
    prixM2,
    fourchetteBasse,
    fourchetteHaute,
    scoreConfiance,
    detailsSources: {
      dvf: {
        moyenne: Math.round(dvfAvg),
        poids: normDVF * 100,
        contribution: Math.round(contribDVF / effectivePonderation)
      },
      annonces: {
        moyenne: Math.round(annoncesAvg),
        poids: normAnnonces * 100,
        contribution: Math.round(contribAnnonces / effectivePonderation)
      },
      estimations: {
        moyenne: Math.round(estimationsAvg),
        poids: normEstimations * 100,
        contribution: Math.round(contribEstimations / effectivePonderation)
      }
    },
    ajustementsAppliques,
    positionMarche
  };
}

// Calcul de l'écart-type
function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
}

// Calcul du score de confiance
function calculateConfidenceScore(
  nbSources: number,
  coefficientVariation: number,
  nbAjustements: number
): number {
  let score = 40;
  
  score += Math.min(nbSources * 6, 30);
  
  if (coefficientVariation < 0.05) score += 15;
  else if (coefficientVariation < 0.10) score += 10;
  else if (coefficientVariation < 0.15) score += 5;
  
  score += Math.min(nbAjustements * 2, 10);
  
  return Math.min(Math.round(score), 100);
}

// Positionnement marché
function calculateMarketPosition(
  prixFinal: number,
  prixBase: number
): 'Très compétitif' | 'Compétitif' | 'Dans la moyenne' | 'Au-dessus' | 'Élevé' {
  const ratio = prixFinal / prixBase;
  
  if (ratio < 0.90) return 'Très compétitif';
  if (ratio < 0.97) return 'Compétitif';
  if (ratio <= 1.03) return 'Dans la moyenne';
  if (ratio <= 1.10) return 'Au-dessus';
  return 'Élevé';
}
