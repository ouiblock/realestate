# Estimation Hybride Immobilière

**Moteur de calcul + composant React** d'estimation immobilière hybride, développé par MonPrixJuste, isolé pour intégration dans la plateforme **Je Partage Immo**.

## Principe

Le moteur croise **3 familles de sources** pondérées par l'utilisateur, puis applique des **ajustements qualitatifs** avec triple garde-fou anti-cumul (coefficient dégressif + plafond ±30%).

## Structure

```
estimation-hybride-immo/
├── src/
│   ├── index.ts                        ← Point d'entrée (tous les exports)
│   ├── types/
│   │   └── index.ts                    ← Contrats de données TypeScript
│   ├── calculation/
│   │   └── calculatePrice.ts           ← Moteur de calcul (fonction pure, 0 dépendance)
│   ├── store/
│   │   └── immoStore.ts                ← State management Zustand (persisté localStorage)
│   ├── components/
│   │   └── ImmoEstimationApp.tsx       ← Composant React complet (formulaires + résultats)
│   ├── ui/
│   │   ├── Button.tsx                  ← Composant bouton
│   │   ├── Card.tsx                    ← Composant carte
│   │   ├── Input.tsx                   ← Composant input
│   │   └── index.ts                    ← Barrel export UI
│   └── __tests__/
│       └── example.test.ts             ← Exemple d'utilisation + tests basiques
├── SPEC.md                             ← Spécification technique complète
├── package.json
└── tsconfig.json
```

## Ce que contient le package

### 1. Moteur de calcul pur (0 dépendance)
- `calculateImmoPrice()` — fonction pure, portable partout (Node, Deno, navigateur, API)

### 2. Composant React complet
- **Formulaire du bien** — type, surface, adresse, ville, étage, etc.
- **Sources de prix** — ajout/suppression de DVF Etalab, annonces (Leboncoin, SeLoger, PAP, Bien'ici), estimations pro (Meilleurs Agents, Yanport, agences)
- **Ajustements qualitatifs** — état général, DPE, exposition, équipements, environnement
- **Pondérations** — curseurs pour ajuster le poids de chaque famille de sources
- **Résultats** — prix final, fourchette, score de confiance, positionnement marché

### 3. Store Zustand
- Gestion complète de l'état (bien, sources, pondérations, ajustements, résultat)
- Persistance localStorage automatique

## Installation

```bash
npm install
```

## Utilisation

### Option A — Composant React complet

```tsx
import { ImmoEstimationApp } from '@monprixjuste/estimation-hybride-immo';

function App() {
  return <ImmoEstimationApp />;
}
```

> Nécessite React 18+, Tailwind CSS configuré dans votre projet.

### Option B — Moteur de calcul seul (headless)

```typescript
import { calculateImmoPrice } from '@monprixjuste/estimation-hybride-immo';

const result = calculateImmoPrice(propertyData, sources, ponderations, ajustements);

console.log(result.prixFinal);       // 335231
console.log(result.prixM2);          // 5157
console.log(result.scoreConfiance);  // 82
```

### Option C — Store Zustand seul

```typescript
import { useImmoStore } from '@monprixjuste/estimation-hybride-immo';

function MyComponent() {
  const { sources, addDVF, addAnnonce, addEstimation, calculate, calculationResult } = useImmoStore();
  // ...
}
```

## Lancer l'exemple (moteur seul)

```bash
npx tsx src/__tests__/example.test.ts
```

## Dépendances

| Package | Rôle | Requis pour |
|---|---|---|
| **zustand** | State management | Composant React + Store |
| **lucide-react** | Icônes | Composant React |
| **react** (peer) | Framework UI | Composant React |
| **tailwindcss** | Styles | Composant React |

> Le moteur de calcul (`calculatePrice.ts` + `types/index.ts`) n'a **aucune dépendance** et peut être extrait seul.

## Sources de prix

| Source | Description | Pondération recommandée |
|---|---|---|
| **DVF Etalab** | Transactions réelles (données État) | 50% |
| **Annonces** | Leboncoin, SeLoger, PAP, Bien'ici | 30% |
| **Estimations** | Meilleurs Agents, Yanport, agences, notaires | 20% |

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
