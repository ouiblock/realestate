// Point d'entrée du module d'estimation hybride immobilière

// Moteur de calcul (fonction pure, 0 dépendance)
export { calculateImmoPrice } from './calculation/calculatePrice';

// Types
export type {
  PropertyData,
  TypeBien,
  EtatGeneral,
  ClasseDPE,
  Exposition,
  DVFTransaction,
  AnnoncePAP,
  EstimationAgence,
  Sources,
  Ponderations,
  Ajustements,
  CalculationResult,
} from './types';

// Composant React (nécessite react, zustand, lucide-react, tailwindcss)
export { default as ImmoEstimationApp } from './components/ImmoEstimationApp';
export { useImmoStore } from './store/immoStore';

// Composants UI réutilisables
export { Button, Card, Input } from './ui';
