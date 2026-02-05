# Estimation Hybride Immobilière

**Moteur de calcul d'estimation immobilière hybride** développé par MonPrixJuste, isolé pour intégration dans la plateforme **Je Partage Immo**.

## Principe

Le moteur croise **3 familles de sources** pondérées par l'utilisateur, puis applique des **ajustements qualitatifs** avec triple garde-fou anti-cumul (coefficient dégressif + plafond ±30%).

## Structure

```
estimation-hybride-immo/
├── src/
│   ├── index.ts                    ← Point d'entrée (exports)
│   ├── types/
│   │   └── index.ts                ← Contrats de données TypeScript
│   ├── calculation/
│   │   └── calculatePrice.ts       ← Moteur de calcul (fonction pure, 0 dépendance)
│   └── __tests__/
│       └── example.test.ts         ← Exemple d'utilisation + tests basiques
├── SPEC.md                         ← Spécification technique complète
├── package.json
└── tsconfig.json
```

## Utilisation rapide

### 1. Installer les dépendances de dev

```bash
npm install
```

### 2. Lancer l'exemple

```bash
npx tsx src/__tests__/example.test.ts
```

### 3. Compiler

```bash
npm run build
```

Les fichiers compilés seront dans `dist/`.

### 4. Intégrer dans votre projet

```typescript
import { calculateImmoPrice } from './calculation/calculatePrice';
import type { PropertyData, Sources, Ponderations, Ajustements } from './types';

const result = calculateImmoPrice(propertyData, sources, ponderations, ajustements);

console.log(result.prixFinal);       // 335231
console.log(result.prixM2);          // 5157
console.log(result.scoreConfiance);  // 82
console.log(result.positionMarche);  // "Au-dessus"
```

## Fonction principale

```typescript
function calculateImmoPrice(
  propertyData: PropertyData,   // Données du bien (surface, type, ville...)
  sources: Sources,             // DVF + Annonces + Estimations pro
  ponderations: Ponderations,   // Poids de chaque famille (% ajustables)
  ajustements: Ajustements      // État, DPE, exposition, équipements...
): CalculationResult            // Prix final, fourchette, score, détails
```

**C'est une fonction pure** : pas d'effet de bord, pas de state, pas de dépendance externe.  
Elle peut être appelée côté serveur (Node.js, Deno, Bun) ou côté client.

## Sources de prix

| Source | Description | Pondération recommandée |
|---|---|---|
| **DVF** | Transactions réelles (données État) | 50% |
| **Annonces** | Prix du marché (Leboncoin, SeLoger, PAP) | 30% |
| **Estimations** | Avis d'experts (Meilleurs Agents, agences) | 20% |

## Garde-fous anti-cumul

1. **Méthode additive** : chaque ajustement = % du prix de base (pas d'effet composé)
2. **Coefficient dégressif** : ≤3 ajustements → 100%, 4-6 → 85-75%, 7-10 → 70-55%, 11+ → 45%
3. **Plafond dur ±30%** : le prix final ne peut jamais s'écarter de plus de 30% du prix de base

## Documentation complète

Voir **[SPEC.md](./SPEC.md)** pour :
- Architecture des données détaillée
- Algorithme pas à pas (8 étapes)
- Barème complet des ajustements
- Exemple chiffré
- Options d'intégration (TypeScript direct, API REST, portage)
- Diagramme de flux
