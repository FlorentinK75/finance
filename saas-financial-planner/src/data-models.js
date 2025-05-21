// DataModels.js - Contient les modèles de données et états initiaux

// État initial des offres
export const initialOfferTypes = {
  smallAssoc: {
    name: 'Petite association',
    monthlyPrice: 20,
    yearlyPrice: 216, // 20 * 12 * 0.9 (10% réduction)
    totalPrice: 240,
    count: 833,
    payMonthlyPercentage: 70, // 70% paient mensuellement, 30% annuellement
    initialChurn: 3.0, // Churn mensuel en %
    finalChurn: 2.2,  // Churn final après 3 ans
  },
  largeAssoc: {
    name: 'Grande association',
    monthlyPrice: 50,
    yearlyPrice: 540, // 50 * 12 * 0.9 (10% réduction)
    totalPrice: 600,
    count: 333,
    payMonthlyPercentage: 50, // 50% paient mensuellement, 50% annuellement
    initialChurn: 2.5, // Churn mensuel en %
    finalChurn: 1.5,  // Churn final après 3 ans
  },
  collectivity10: {
    name: 'Collectivité pack 10',
    totalPrice: 2280, // 228 € par asso
    count: 5,
    payMonthlyPercentage: 20, // 20% paient mensuellement, 80% annuellement
    initialChurn: 1.0, // Churn mensuel en %
    finalChurn: 0.5,  // Churn final après 3 ans
  },
  collectivity20: {
    name: 'Collectivité pack 20',
    totalPrice: 4320, // 216 € par asso
    count: 5,
    payMonthlyPercentage: 20,
    initialChurn: 1.0,
    finalChurn: 0.5,
  },
  collectivity50: {
    name: 'Collectivité pack 50',
    totalPrice: 10200, // 204 € par asso
    count: 5,
    payMonthlyPercentage: 10,
    initialChurn: 1.0,
    finalChurn: 0.5,
  },
  collectivity100: {
    name: 'Collectivité pack 100',
    totalPrice: 19200, // 192 € par asso
    count: 1,
    payMonthlyPercentage: 0, // Toutes paient annuellement
    initialChurn: 1.0,
    finalChurn: 0.5,
  }
};

// État initial des modules Upsell
export const initialUpsellModules = [
  {
    name: 'Tempo',
    quarter: 1, // T1
    price: 0, // Inclus dans abonnements
    adoptionRateSmall: 100, // % d'adoption pour petites assos
    adoptionRateLarge: 100, // % d'adoption pour grandes assos
    adoptionRateCollectivity: 100, // % d'adoption pour collectivités
  },
  {
    name: 'Mutualisation',
    quarter: 2, // T2
    price: 100, // €/an/asso
    adoptionRateSmall: 0,
    adoptionRateLarge: 0,
    adoptionRateCollectivity: 30,
  },
  {
    name: 'Assistant IA',
    quarter: 2, // T2
    price: 10, // €/mois/asso (120€/an)
    adoptionRateSmall: 30,
    adoptionRateLarge: 30,
    adoptionRateCollectivity: 0,
  },
  {
    name: 'Communication',
    quarter: 3, // T3
    price: 10, // €/mois/asso (120€/an)
    adoptionRateSmall: 20,
    adoptionRateLarge: 20,
    adoptionRateCollectivity: 0,
  },
  {
    name: 'Subvention',
    quarter: 3, // T3
    price: 300, // €/an (~1% du budget)
    adoptionRateSmall: 70,
    adoptionRateLarge: 70,
    adoptionRateCollectivity: 0,
  }
];

// État initial des coûts
export const initialCosts = {
  salaries: {
    founder: { annual: 36000, increment: 0, incrementThreshold: 0 },
    devSupport: { annual: 45000, increment: 1, incrementThreshold: 400 },
    commercial: { annual: 28800, increment: 1, incrementThreshold: 150 }
  },
  technical: {
    hosting: 2000,
    domain: 300,
    saas: 1200,
    security: 1500
  },
  acquisition: {
    emailings: 300 * 12, // mensuel
    forums: 2000 * 4,   // trimestriel
    partnerships: 250 * 12  // mensuel en moyenne
  }
};

// État initial des paramètres commerciaux
export const initialCommercialParams = {
  leadGeneration: {
    email: { conversionRate: 1, timePerContact: 0, automatable: true },
    phone: { conversionRate: 5, timePerContact: 5/60, automatable: false }, // 5 min en heures
    linkedin: { conversionRate: 2, timePerContact: 0, automatable: true }
  },
  conversion: {
    webinar: { meeting1ToMeeting2: 20, meeting2ToClient: 40, timePerClient: 15/60 }, // 15 min en heures
    videoCall: { meeting1ToMeeting2: 50, meeting2ToClient: 60, timePerClient: 1 } // 1 heure
  },
  cac: {
    perClient: 60
  },
  meetingsPerWeek: 15
};

// État initial des taux de croissance
export const initialGrowthRates = {
  organic: 17.5, // 15-20% annuel
  emailLeads: 150, // leads par mois
  forumContacts: 50, // contacts qualifiés par trimestre
};

// Structure initiale des résultats financiers
export const initialFinancialResults = {
  initialCA: 0,
  quarterlyResults: [],
  cumulativeResults: {
    ca: [],
    costs: [],
    margin: [],
    cash: []
  },
  kpis: {
    cac: 0,
    cacPayback: 0,
    ltv: {},
    ltvCacRatio: {},
    nrr: 0,
    arpu: {},
    ruleOf40: 0,
    operatingMargin: 0,
    revenuePerEmployee: 0,
  }
};

// État initial des sections dépliées/repliées
export const initialExpandedSections = {
  offers: true,
  upsell: false,
  costs: false,
  commercial: false,
  growth: false,
  results: true
};
