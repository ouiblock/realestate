// Types pour le vertical Immobilier - MonPrixJuste

export type TypeBien = 'Appartement' | 'Maison' | 'Terrain' | 'Immeuble' | 'Local commercial' | 'Parking/Garage';
export type EtatGeneral = 'Neuf / récent' | 'Bon' | 'À rafraîchir' | 'À rénover';
export type ClasseDPE = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'Non renseigné';
export type Exposition = 'Nord' | 'Sud' | 'Est' | 'Ouest' | 'Double' | 'Triple';

// Données du bien
export interface PropertyData {
  estimationName: string;
  date: string;
  typeBien: TypeBien;
  adresse: string;
  ville: string;
  codePostal: string;
  surface: number; // m²
  pieces: number;
  chambres: number;
  etage: number;
  ascenseur: boolean;
  anneeConstruction: number;
}

// Sources de comparables
export interface DVFTransaction {
  id: string;
  prix: number;
  surface: number;
  date: string;
  adresse: string;
  commentaire: string;
}

export interface AnnoncePAP {
  id: string;
  prix: number;
  surface: number;
  pieces: number;
  lien: string;
  source: string; // "PAP", "Leboncoin", "SeLoger"
  commentaire: string;
}

export interface EstimationAgence {
  id: string;
  prixMin: number;
  prixMax: number;
  source: string; // "Meilleurs Agents", "Yanport", "Agence locale"
  date: string;
  commentaire: string;
}

export interface Sources {
  dvf: DVFTransaction[];
  annonces: AnnoncePAP[];
  estimations: EstimationAgence[];
}

// Pondération des sources
export interface Ponderations {
  dvf: number; // %
  annonces: number; // %
  estimations: number; // %
}

// Ajustements qualitatifs
export interface Ajustements {
  // État & caractéristiques
  etatGeneral: EtatGeneral;
  dpe: ClasseDPE;
  exposition: Exposition;
  
  // Confort & équipements
  balcon: boolean; // +5%
  terrasse: boolean; // +8%
  jardin: boolean; // +12%
  parking: boolean; // +8%
  cave: boolean; // +3%
  
  // Vue & environnement
  vueDegagee: boolean; // +8%
  calme: boolean; // +5%
  proximiteTransports: boolean; // +6%
  proximiteCommerce: boolean; // +4%
  
  // Autres
  travauxRecents: boolean; // +10%
  coproprieteEntretenue: boolean; // +5%
}

// Résultat du calcul
export interface CalculationResult {
  prixBase: number; // Prix pondéré avant ajustements
  prixFinal: number; // Prix final après ajustements
  prixM2: number; // Prix au m²
  fourchetteBasse: number;
  fourchetteHaute: number;
  scoreConfiance: number; // 0-100
  
  // Détails du calcul
  detailsSources: {
    dvf: { moyenne: number; poids: number; contribution: number };
    annonces: { moyenne: number; poids: number; contribution: number };
    estimations: { moyenne: number; poids: number; contribution: number };
  };
  
  ajustementsAppliques: {
    nom: string;
    valeur: number; // % ou montant
    impact: number; // montant en €
  }[];
  
  // Positionnement marché
  positionMarche: 'Très compétitif' | 'Compétitif' | 'Dans la moyenne' | 'Au-dessus' | 'Élevé';
}

// État complet du store
export interface ImmoEstimationState {
  propertyData: PropertyData;
  sources: Sources;
  ponderations: Ponderations;
  ajustements: Ajustements;
  calculationResult: CalculationResult | null;
  
  // Actions
  setPropertyData: (data: Partial<PropertyData>) => void;
  
  // Sources DVF
  addDVF: (dvf: Omit<DVFTransaction, 'id'>) => void;
  updateDVF: (id: string, dvf: Partial<DVFTransaction>) => void;
  removeDVF: (id: string) => void;
  
  // Annonces
  addAnnonce: (annonce: Omit<AnnoncePAP, 'id'>) => void;
  updateAnnonce: (id: string, annonce: Partial<AnnoncePAP>) => void;
  removeAnnonce: (id: string) => void;
  
  // Estimations
  addEstimation: (estimation: Omit<EstimationAgence, 'id'>) => void;
  updateEstimation: (id: string, estimation: Partial<EstimationAgence>) => void;
  removeEstimation: (id: string) => void;
  
  // Pondérations
  setPonderations: (ponderations: Partial<Ponderations>) => void;
  
  // Ajustements
  setAjustements: (ajustements: Partial<Ajustements>) => void;
  
  // Calcul
  calculate: () => void;
  
  // Reset
  reset: () => void;
}

// Export pour l'historique unifié
export interface ImmoEstimationExport {
  id: string;
  vertical: 'immobilier';
  name: string;
  date: string;
  finalPrice: number;
  metadata: {
    typeBien: TypeBien;
    ville: string;
    surface: number;
    pieces: number;
  };
}
