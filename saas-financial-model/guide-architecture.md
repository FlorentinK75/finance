# Guide d'architecture technique

Ce document explique l'architecture technique de l'application de modélisation financière SaaS.

## Architecture globale

L'application suit une architecture React moderne avec une gestion d'état centralisée dans le composant parent (`App.js`). Le flux de données est unidirectionnel, descendant des composants parents aux composants enfants via les props.

```
App.js
├── defaultData.js (données initiales)
├── financialCalculations.js (logique métier)
│
├── ScenarioManager.js
├── InputsForm.js
├── RevenueProjections.js
├── FinancialDashboard.js
├── CashFlow.js
└── SaasMetrics.js
```

## Flux de données

1. Les paramètres d'entrée sont stockés dans l'état du composant `App.js`
2. Ces paramètres sont transmis à `financialCalculations.js` qui génère les projections
3. Les projections calculées sont transmises aux composants de visualisation
4. Lorsque l'utilisateur modifie des paramètres, l'état est mis à jour et les calculs sont relancés

## Modèle de données

### Structure des données d'entrée (`inputs`)

```javascript
{
  targetRevenue: 500000,            // Objectif de CA
  pricing: {                        // Prix par segment
    smallAssociation: { ... },
    largeAssociation: { ... },
    localAuthority: { ... }
  },
  initialDistribution: { ... },     // Répartition initiale des clients
  annualPaymentRate: { ... },       // Taux de paiement annuel vs mensuel
  upsells: { ... },                 // Modules d'upsell
  acquisition: { ... },             // Paramètres d'acquisition
  costs: { ... },                   // Structure de coûts
  growth: { ... },                  // Hypothèses de croissance
  churn: { ... }                    // Taux de churn
}
```

### Structure des projections (`projections`)

```javascript
{
  quarters: [...],                  // Liste des trimestres
  clients: {                        // Nombre de clients par segment
    smallAssociations: [...],
    largeAssociations: [...],
    localAuthorities: { ... }
  },
  revenue: {                        // Revenus par segment
    smallAssociations: [...],
    largeAssociations: [...],
    localAuthorities: [...],
    upsell: [...],
    total: [...]
  },
  expenses: { ... },                // Dépenses par catégorie
  cashFlow: { ... },                // Flux de trésorerie
  metrics: { ... },                 // Métriques SaaS
  profitLoss: [...],                // Résultat par trimestre
  targetComparison: [...],          // Comparaison avec l'objectif
  upsellBreakdown: { ... },         // Détail des revenus d'upsell
  staffing: { ... }                 // Évolution de l'équipe
}
```

## Logique de calcul

La logique de calcul est encapsulée dans le fichier `financialCalculations.js`. Voici les principales fonctions :

- `calculateProjections(inputs)` : Fonction principale qui génère toutes les projections
- `calculateSegmentRevenue(...)` : Calcul du revenu pour un segment de clients
- `calculateWeightedChurnRate(...)` : Calcul du taux de churn moyen pondéré
- `interpolateValue(...)` : Interpolation entre deux valeurs pour les évolutions
- `calculateNewClientsAcquired(...)` : Calcul du nombre de nouveaux clients acquis
- `calculateMonthlyCashFlow(...)` : Calcul du cash flow mensuel

## Composants UI

### Composant principal (App.js)

Le composant App.js gère :
- L'état global de l'application
- Les changements d'onglets
- Le calcul des projections
- La gestion des scénarios

### Composants de visualisation

Chaque composant de visualisation reçoit les données calculées via les props :
- `InputsForm` : Permet de modifier les paramètres d'entrée
- `RevenueProjections` : Visualise les projections de revenus
- `FinancialDashboard` : Affiche les tableaux de bord financiers
- `CashFlow` : Montre les flux de trésorerie
- `SaasMetrics` : Présente les métriques SaaS
- `ScenarioManager` : Gère les scénarios

## Gestion des scénarios

Les scénarios sont stockés dans l'état de `App.js` sous forme d'un tableau d'objets :

```javascript
[
  { 
    name: "Scénario de base", 
    inputs: { ... } 
  },
  { 
    name: "Scénario optimiste", 
    inputs: { ... } 
  }
]
```

## Bibliothèques utilisées

- **React** : Framework UI
- **Material-UI** : Composants UI prêts à l'emploi
- **Recharts** : Bibliothèque de graphiques

## Extensions possibles

L'architecture est conçue pour faciliter les extensions suivantes :

1. **Exportation des données** : Ajout d'une fonctionnalité d'export PDF ou Excel
2. **Intégration backend** : Sauvegarde des scénarios sur un serveur
3. **Simulations Monte Carlo** : Analyse de sensibilité sur les paramètres clés
4. **Tableaux de bord personnalisables** : Interface drag-and-drop pour les widgets
5. **Comparaison de scénarios** : Visualisation côte à côte de plusieurs scénarios