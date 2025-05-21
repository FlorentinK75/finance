# Modèle Financier SaaS - InfinityHelp

Outil de modélisation financière sur 3 ans avec des projections trimestrielles pour un produit SaaS destiné aux associations et collectivités.

## Fonctionnalités

- **Projections de revenus** sur 3 ans avec subdivision trimestrielle
- **Paramétrage complet** des variables d'entrée (prix, clients, churn, etc.)
- **Visualisation en temps réel** de l'impact des changements sur le CA, les coûts et la rentabilité
- **Gestion des segments clients** (petites associations, grandes associations, collectivités)
- **Modules d'upsell** avec projections de revenus additionnels
- **Tableaux de bord** pour suivre les principaux indicateurs financiers et SaaS
- **Flux de trésorerie** mensuel et trimestriel
- **Sauvegarde et chargement** de différents scénarios

## Installation

1. Clonez ce dépôt
2. Installez les dépendances avec npm ou yarn :

```bash
npm install
# ou
yarn install
```

3. Lancez l'application en mode développement :

```bash
npm start
# ou
yarn start
```

## Structure des fichiers

- **App.js** : Composant principal de l'application
- **theme.js** : Configuration du thème Material-UI
- **defaultData.js** : Données par défaut pour le modèle
- **financialCalculations.js** : Fonctions de calcul des projections
- **components/** : Dossier contenant tous les composants React
  - **InputsForm.js** : Formulaire de paramètres
  - **RevenueProjections.js** : Projections de revenus
  - **FinancialDashboard.js** : Tableau de bord financier
  - **CashFlow.js** : Flux de trésorerie
  - **SaasMetrics.js** : Métriques SaaS
  - **ScenarioManager.js** : Gestion des scénarios

## Utilisation

### Onglet Paramètres

Cet onglet vous permet de modifier toutes les variables d'entrée du modèle :

- **Objectif de CA annuel** pour comparer aux projections
- **Répartition initiale des clients** par segment
- **Tarification** pour chaque segment
- **Modules d'upsell** avec prix et taux d'adoption
- **Taux de churn** par segment et leur évolution

### Onglet Projections de Revenus

Visualisez l'évolution du chiffre d'affaires par segment et les détails des revenus d'upsell.

### Onglet Tableaux de Bord

Consultez les indicateurs financiers clés, les revenus, dépenses et résultats sur 3 ans.

### Onglet Flux de Trésorerie

Suivez les entrées et sorties d'argent mensuelles et la position de trésorerie.

### Onglet Métriques SaaS

Analysez les indicateurs SaaS comme l'ARPU, le churn, le LTV/CAC, et la NRR.

## Gestion des scénarios

Utilisez le gestionnaire de scénarios en haut de l'application pour :

- **Enregistrer** un scénario avec un nom personnalisé
- **Charger** un scénario précédemment enregistré
- **Comparer** différentes stratégies et hypothèses

## Personnalisation avancée

Pour personnaliser davantage le modèle, vous pouvez modifier :

- Les formules de calcul dans `financialCalculations.js`
- Les données par défaut dans `defaultData.js`
- Les visualisations dans chaque composant

## Technologies utilisées

- React.js
- Material-UI pour l'interface utilisateur
- Recharts pour les graphiques et visualisations