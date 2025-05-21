import { quarters } from '../data/defaultData';

/**
 * Calcule les projections financières complètes sur 3 ans
 * @param {Object} inputs Les paramètres d'entrée du modèle
 * @returns {Object} Les projections financières complètes
 */
export const calculateProjections = (inputs) => {
  // Initialisation des structures de données pour les projections
  const projections = {
    quarters: [...quarters],
    clients: {
      smallAssociations: Array(12).fill(0),
      largeAssociations: Array(12).fill(0),
      localAuthorities: {
        pack10: Array(12).fill(0),
        pack20: Array(12).fill(0),
        pack50: Array(12).fill(0),
        pack100: Array(12).fill(0),
        total: Array(12).fill(0),
      },
      total: Array(12).fill(0),
    },
    revenue: {
      smallAssociations: Array(12).fill(0),
      largeAssociations: Array(12).fill(0),
      localAuthorities: Array(12).fill(0),
      upsell: Array(12).fill(0),
      total: Array(12).fill(0),
    },
    expenses: {
      salaries: Array(12).fill(0),
      technical: Array(12).fill(0),
      marketing: Array(12).fill(0),
      total: Array(12).fill(0),
    },
    cashFlow: {
      monthly: Array(36).fill(0),
      cumulative: Array(36).fill(0),
    },
    metrics: {
      arpu: Array(12).fill(0),
      cac: Array(12).fill(0),
      cacPayback: Array(12).fill(0),
      ltv: Array(12).fill(0),
      ltvCacRatio: Array(12).fill(0),
      churnRate: {
        smallAssociations: Array(12).fill(0),
        largeAssociations: Array(12).fill(0),
        localAuthorities: Array(12).fill(0),
        average: Array(12).fill(0),
      },
      nrr: Array(12).fill(0),
      revenuePerEmployee: Array(12).fill(0),
      ruleOf40: Array(12).fill(0),
      operatingMargin: Array(12).fill(0),
    },
    profitLoss: Array(12).fill(0),
    targetComparison: Array(12).fill(0),
    upsellBreakdown: {
      tempo: Array(12).fill(0),
      mutualization: Array(12).fill(0),
      aiAssistant: Array(12).fill(0),
      communication: Array(12).fill(0),
      subsidies: Array(12).fill(0),
    },
    staffing: {
      founder: Array(12).fill(1),
      development: Array(12).fill(1),
      sales: Array(12).fill(1),
      total: Array(12).fill(3),
    },
  };

  // Initialiser les clients au début de la première année
  projections.clients.smallAssociations[0] = inputs.initialDistribution.smallAssociations;
  projections.clients.largeAssociations[0] = inputs.initialDistribution.largeAssociations;
  projections.clients.localAuthorities.pack10[0] = inputs.initialDistribution.localAuthorities.pack10;
  projections.clients.localAuthorities.pack20[0] = inputs.initialDistribution.localAuthorities.pack20;
  projections.clients.localAuthorities.pack50[0] = inputs.initialDistribution.localAuthorities.pack50;
  projections.clients.localAuthorities.pack100[0] = inputs.initialDistribution.localAuthorities.pack100;
  
  // Calculer le nombre total de clients par collectivité et le total global
  projections.clients.localAuthorities.total[0] = 
    inputs.initialDistribution.localAuthorities.pack10 * 10 +
    inputs.initialDistribution.localAuthorities.pack20 * 20 +
    inputs.initialDistribution.localAuthorities.pack50 * 50 +
    inputs.initialDistribution.localAuthorities.pack100 * 100;
  
  projections.clients.total[0] = 
    projections.clients.smallAssociations[0] + 
    projections.clients.largeAssociations[0] + 
    projections.clients.localAuthorities.total[0];
  
  // Calcul des revenus pour le premier trimestre
  const yearlySmallPrice = inputs.pricing.smallAssociation.monthlyPrice * 12 * (1 - inputs.pricing.smallAssociation.yearlyDiscount);
  const yearlyLargePrice = inputs.pricing.largeAssociation.monthlyPrice * 12 * (1 - inputs.pricing.largeAssociation.yearlyDiscount);
  
  // Revenus initiaux pour le premier trimestre
  projections.revenue.smallAssociations[0] = calculateSegmentRevenue(
    projections.clients.smallAssociations[0],
    inputs.pricing.smallAssociation.monthlyPrice,
    yearlySmallPrice,
    inputs.annualPaymentRate.smallAssociations
  ) / 4; // Diviser par 4 pour obtenir le revenu trimestriel
  
  projections.revenue.largeAssociations[0] = calculateSegmentRevenue(
    projections.clients.largeAssociations[0],
    inputs.pricing.largeAssociation.monthlyPrice,
    yearlyLargePrice,
    inputs.annualPaymentRate.largeAssociations
  ) / 4;
  
  projections.revenue.localAuthorities[0] = (
    inputs.initialDistribution.localAuthorities.pack10 * inputs.pricing.localAuthority.pack10.price +
    inputs.initialDistribution.localAuthorities.pack20 * inputs.pricing.localAuthority.pack20.price +
    inputs.initialDistribution.localAuthorities.pack50 * inputs.pricing.localAuthority.pack50.price +
    inputs.initialDistribution.localAuthorities.pack100 * inputs.pricing.localAuthority.pack100.price
  ) / 4;
  
  // Calcul des dépenses pour le premier trimestre
  projections.expenses.salaries[0] = (
    inputs.costs.salaries.founder.annual +
    inputs.costs.salaries.development.annual +
    inputs.costs.salaries.sales.annual
  ) / 4;
  
  projections.expenses.technical[0] = (
    inputs.costs.technical.hosting +
    inputs.costs.technical.domain +
    inputs.costs.technical.internalTools +
    inputs.costs.technical.security
  ) / 4;
  
  projections.expenses.marketing[0] = (
    inputs.growth.acquisition.emailCost * 3 + // 3 mois par trimestre
    inputs.growth.acquisition.forumsCost +
    inputs.growth.acquisition.partnersCost * 3
  );
  
  projections.expenses.total[0] = 
    projections.expenses.salaries[0] + 
    projections.expenses.technical[0] + 
    projections.expenses.marketing[0];
  
  // Calculer les revenus totaux et le profit/perte pour le premier trimestre
  projections.revenue.total[0] = 
    projections.revenue.smallAssociations[0] + 
    projections.revenue.largeAssociations[0] + 
    projections.revenue.localAuthorities[0];
  
  projections.profitLoss[0] = projections.revenue.total[0] - projections.expenses.total[0];
  
  // Comparer au revenu cible
  projections.targetComparison[0] = projections.revenue.total[0] - (inputs.targetRevenue / 12);
  
  // Calculer les métriques SaaS pour le premier trimestre
  projections.metrics.arpu[0] = projections.revenue.total[0] * 4 / projections.clients.total[0]; // Annualisé
  
  // Définir les taux de churn initiaux
  projections.metrics.churnRate.smallAssociations[0] = inputs.churn.monthly.smallAssociations;
  projections.metrics.churnRate.largeAssociations[0] = inputs.churn.monthly.largeAssociations;
  projections.metrics.churnRate.localAuthorities[0] = inputs.churn.monthly.localAuthorities;
  
  // Churn moyen pondéré
  projections.metrics.churnRate.average[0] = calculateWeightedChurnRate(
    projections.clients.smallAssociations[0],
    projections.clients.largeAssociations[0],
    projections.clients.localAuthorities.total[0],
    projections.metrics.churnRate.smallAssociations[0],
    projections.metrics.churnRate.largeAssociations[0],
    projections.metrics.churnRate.localAuthorities[0]
  );
  
  // CAC, LTV et ratio LTV/CAC
  projections.metrics.cac[0] = inputs.acquisition.cacPerClient;
  projections.metrics.ltv[0] = projections.metrics.arpu[0] / (projections.metrics.churnRate.average[0] * 12);
  projections.metrics.ltvCacRatio[0] = projections.metrics.ltv[0] / projections.metrics.cac[0];
  projections.metrics.cacPayback[0] = projections.metrics.cac[0] / (projections.metrics.arpu[0] / 12);
  
  // Marge opérationnelle et règle des 40
  projections.metrics.operatingMargin[0] = projections.profitLoss[0] / projections.revenue.total[0];
  projections.metrics.ruleOf40[0] = 0 + projections.metrics.operatingMargin[0] * 100; // Pas de croissance au premier trimestre
  
  // Initialiser le cash flow pour les 3 premiers mois
  let monthlyCashFlow = calculateMonthlyCashFlow(
    projections.revenue.total[0] * 4, // Revenus annuels
    projections.expenses.total[0] * 4, // Dépenses annuelles
    inputs.annualPaymentRate, // Taux de paiement annuel
    projections.clients.smallAssociations[0],
    projections.clients.largeAssociations[0]
  );
  
  projections.cashFlow.monthly.splice(0, 3, ...monthlyCashFlow);
  projections.cashFlow.cumulative[0] = monthlyCashFlow[0];
  projections.cashFlow.cumulative[1] = projections.cashFlow.cumulative[0] + monthlyCashFlow[1];
  projections.cashFlow.cumulative[2] = projections.cashFlow.cumulative[1] + monthlyCashFlow[2];
  
  // Progression trimestrielle
  for (let q = 1; q < 12; q++) {
    // Évolution du churn au fil du temps (amélioration progressive)
    const churnProgressFactor = Math.min(1, q / 8); // Progression sur 8 trimestres
    
    projections.metrics.churnRate.smallAssociations[q] = interpolateValue(
      inputs.churn.monthly.smallAssociations,
      inputs.churn.evolution.smallAssociations,
      churnProgressFactor
    );
    
    projections.metrics.churnRate.largeAssociations[q] = interpolateValue(
      inputs.churn.monthly.largeAssociations,
      inputs.churn.evolution.largeAssociations,
      churnProgressFactor
    );
    
    projections.metrics.churnRate.localAuthorities[q] = interpolateValue(
      inputs.churn.monthly.localAuthorities,
      inputs.churn.evolution.localAuthorities,
      churnProgressFactor
    );
    
    // Calculer la croissance du trimestre
    const quarterlyOrganicGrowth = Math.pow(1 + inputs.growth.organic.annual, 1/4) - 1;
    
    // Calculer le nombre de nouveaux clients acquis et le churn
    const smallChurnedClients = projections.clients.smallAssociations[q-1] * projections.metrics.churnRate.smallAssociations[q] * 3; // 3 mois par trimestre
    const largeChurnedClients = projections.clients.largeAssociations[q-1] * projections.metrics.churnRate.largeAssociations[q] * 3;
    const localAuthoritiesChurnedClients = {
      pack10: projections.clients.localAuthorities.pack10[q-1] * projections.metrics.churnRate.localAuthorities[q] * 3,
      pack20: projections.clients.localAuthorities.pack20[q-1] * projections.metrics.churnRate.localAuthorities[q] * 3,
      pack50: projections.clients.localAuthorities.pack50[q-1] * projections.metrics.churnRate.localAuthorities[q] * 3,
      pack100: projections.clients.localAuthorities.pack100[q-1] * projections.metrics.churnRate.localAuthorities[q] * 3,
    };
    
    // Nouveaux clients par croissance organique
    const smallOrganicGrowth = projections.clients.smallAssociations[q-1] * quarterlyOrganicGrowth;
    const largeOrganicGrowth = projections.clients.largeAssociations[q-1] * quarterlyOrganicGrowth;
    const localAuthoritiesOrganicGrowth = {
      pack10: projections.clients.localAuthorities.pack10[q-1] * quarterlyOrganicGrowth,
      pack20: projections.clients.localAuthorities.pack20[q-1] * quarterlyOrganicGrowth,
      pack50: projections.clients.localAuthorities.pack50[q-1] * quarterlyOrganicGrowth,
      pack100: projections.clients.localAuthorities.pack100[q-1] * quarterlyOrganicGrowth,
    };
    
    // Acquisition de nouveaux clients (distribution proportionnelle à l'existant)
    const totalSalesTime = projections.staffing.sales[q-1] * inputs.acquisition.meetings.perWeek * 13; // 13 semaines par trimestre
    const totalNewClients = calculateNewClientsAcquired(totalSalesTime, inputs.acquisition);
    
    const currentClientShare = {
      smallAssociations: projections.clients.smallAssociations[q-1] / projections.clients.total[q-1],
      largeAssociations: projections.clients.largeAssociations[q-1] / projections.clients.total[q-1],
      localAuthorities: projections.clients.localAuthorities.total[q-1] / projections.clients.total[q-1],
    };
    
    const smallNewAcquisitions = totalNewClients * currentClientShare.smallAssociations;
    const largeNewAcquisitions = totalNewClients * currentClientShare.largeAssociations;
    const localAuthoritiesNewAcquisitions = totalNewClients * currentClientShare.localAuthorities;
    
    // Distribution des nouvelles collectivités entre les différents packs
    const localAuthoritiesPackDistribution = {
      pack10: projections.clients.localAuthorities.pack10[q-1] / Math.max(1, projections.clients.localAuthorities.pack10[q-1] + projections.clients.localAuthorities.pack20[q-1] + projections.clients.localAuthorities.pack50[q-1] + projections.clients.localAuthorities.pack100[q-1]),
      pack20: projections.clients.localAuthorities.pack20[q-1] / Math.max(1, projections.clients.localAuthorities.pack10[q-1] + projections.clients.localAuthorities.pack20[q-1] + projections.clients.localAuthorities.pack50[q-1] + projections.clients.localAuthorities.pack100[q-1]),
      pack50: projections.clients.localAuthorities.pack50[q-1] / Math.max(1, projections.clients.localAuthorities.pack10[q-1] + projections.clients.localAuthorities.pack20[q-1] + projections.clients.localAuthorities.pack50[q-1] + projections.clients.localAuthorities.pack100[q-1]),
      pack100: projections.clients.localAuthorities.pack100[q-1] / Math.max(1, projections.clients.localAuthorities.pack10[q-1] + projections.clients.localAuthorities.pack20[q-1] + projections.clients.localAuthorities.pack50[q-1] + projections.clients.localAuthorities.pack100[q-1]),
    };
    
    const localAuthoritiesPackNewAcquisitions = {
      pack10: localAuthoritiesNewAcquisitions * localAuthoritiesPackDistribution.pack10,
      pack20: localAuthoritiesNewAcquisitions * localAuthoritiesPackDistribution.pack20,
      pack50: localAuthoritiesNewAcquisitions * localAuthoritiesPackDistribution.pack50,
      pack100: localAuthoritiesNewAcquisitions * localAuthoritiesPackDistribution.pack100,
    };
    
    // Mettre à jour les clients pour ce trimestre
    projections.clients.smallAssociations[q] = Math.max(0, 
      projections.clients.smallAssociations[q-1] + smallOrganicGrowth + smallNewAcquisitions - smallChurnedClients
    );
    
    projections.clients.largeAssociations[q] = Math.max(0, 
      projections.clients.largeAssociations[q-1] + largeOrganicGrowth + largeNewAcquisitions - largeChurnedClients
    );
    
    projections.clients.localAuthorities.pack10[q] = Math.max(0, 
      projections.clients.localAuthorities.pack10[q-1] + 
      localAuthoritiesOrganicGrowth.pack10 + 
      localAuthoritiesPackNewAcquisitions.pack10 - 
      localAuthoritiesChurnedClients.pack10
    );
    
    projections.clients.localAuthorities.pack20[q] = Math.max(0, 
      projections.clients.localAuthorities.pack20[q-1] + 
      localAuthoritiesOrganicGrowth.pack20 + 
      localAuthoritiesPackNewAcquisitions.pack20 - 
      localAuthoritiesChurnedClients.pack20
    );
    
    projections.clients.localAuthorities.pack50[q] = Math.max(0, 
      projections.clients.localAuthorities.pack50[q-1] + 
      localAuthoritiesOrganicGrowth.pack50 + 
      localAuthoritiesPackNewAcquisitions.pack50 - 
      localAuthoritiesChurnedClients.pack50
    );
    
    projections.clients.localAuthorities.pack100[q] = Math.max(0, 
      projections.clients.localAuthorities.pack100[q-1] + 
      localAuthoritiesOrganicGrowth.pack100 + 
      localAuthoritiesPackNewAcquisitions.pack100 - 
      localAuthoritiesChurnedClients.pack100
    );
    
    // Calculer le total pour les collectivités
    projections.clients.localAuthorities.total[q] = 
      projections.clients.localAuthorities.pack10[q] * 10 +
      projections.clients.localAuthorities.pack20[q] * 20 +
      projections.clients.localAuthorities.pack50[q] * 50 +
      projections.clients.localAuthorities.pack100[q] * 100;
    
    // Calculer le total global de clients
    projections.clients.total[q] = 
      projections.clients.smallAssociations[q] + 
      projections.clients.largeAssociations[q] + 
      projections.clients.localAuthorities.total[q];
    
    // Calculer les revenus de base pour ce trimestre
    projections.revenue.smallAssociations[q] = calculateSegmentRevenue(
      projections.clients.smallAssociations[q],
      inputs.pricing.smallAssociation.monthlyPrice,
      yearlySmallPrice,
      inputs.annualPaymentRate.smallAssociations
    ) / 4;
    
    projections.revenue.largeAssociations[q] = calculateSegmentRevenue(
      projections.clients.largeAssociations[q],
      inputs.pricing.largeAssociation.monthlyPrice,
      yearlyLargePrice,
      inputs.annualPaymentRate.largeAssociations
    ) / 4;
    
    projections.revenue.localAuthorities[q] = (
      projections.clients.localAuthorities.pack10[q] * inputs.pricing.localAuthority.pack10.price +
      projections.clients.localAuthorities.pack20[q] * inputs.pricing.localAuthority.pack20.price +
      projections.clients.localAuthorities.pack50[q] * inputs.pricing.localAuthority.pack50.price +
      projections.clients.localAuthorities.pack100[q] * inputs.pricing.localAuthority.pack100.price
    ) / 4;
    
    // Calcul des revenus d'upsell
    projections.upsellBreakdown.tempo[q] = inputs.upsells.tempo.trimester <= q + 1 ? 0 : 0; // Inclus dans l'abonnement
    
    // Mutualisation (collectivités uniquement)
    projections.upsellBreakdown.mutualization[q] = inputs.upsells.mutualization.trimester <= q + 1 ? 
      (projections.clients.localAuthorities.total[q] * inputs.upsells.mutualization.adoptionRate.localAuthorities * inputs.upsells.mutualization.pricePerYear) / 4 : 0;
    
    // Assistant IA (petites et grandes assos)
    projections.upsellBreakdown.aiAssistant[q] = inputs.upsells.aiAssistant.trimester <= q + 1 ? 
      ((projections.clients.smallAssociations[q] * inputs.upsells.aiAssistant.adoptionRate.smallAssociations + 
        projections.clients.largeAssociations[q] * inputs.upsells.aiAssistant.adoptionRate.largeAssociations) * 
        inputs.upsells.aiAssistant.pricePerMonth * 3) : 0; // 3 mois par trimestre
    
    // Communication (petites et grandes assos)
    projections.upsellBreakdown.communication[q] = inputs.upsells.communication.trimester <= q + 1 ? 
      ((projections.clients.smallAssociations[q] * inputs.upsells.communication.adoptionRate.smallAssociations + 
        projections.clients.largeAssociations[q] * inputs.upsells.communication.adoptionRate.largeAssociations) * 
        inputs.upsells.communication.pricePerMonth * 3) : 0;
    
    // Subventions (petites et grandes assos)
    projections.upsellBreakdown.subsidies[q] = inputs.upsells.subsidies.trimester <= q + 1 ? 
      ((projections.clients.smallAssociations[q] * inputs.upsells.subsidies.adoptionRate.smallAssociations + 
        projections.clients.largeAssociations[q] * inputs.upsells.subsidies.adoptionRate.largeAssociations) * 
        inputs.upsells.subsidies.pricePerYear) / 4 : 0;
    
    // Total des revenus d'upsell
    projections.revenue.upsell[q] = 
      projections.upsellBreakdown.tempo[q] + 
      projections.upsellBreakdown.mutualization[q] + 
      projections.upsellBreakdown.aiAssistant[q] + 
      projections.upsellBreakdown.communication[q] + 
      projections.upsellBreakdown.subsidies[q];
    
    // Ajuster les ressources humaines en fonction du nombre de clients
    const totalClients = projections.clients.total[q];
    projections.staffing.development[q] = 1 + Math.floor(totalClients / inputs.costs.salaries.development.addPerClients);
    projections.staffing.sales[q] = 1 + Math.floor(totalClients / inputs.costs.salaries.sales.addPerClients);
    projections.staffing.total[q] = projections.staffing.founder[q] + projections.staffing.development[q] + projections.staffing.sales[q];
    
    // Calculer les dépenses pour ce trimestre
    projections.expenses.salaries[q] = (
      inputs.costs.salaries.founder.annual +
      inputs.costs.salaries.development.annual * projections.staffing.development[q] +
      inputs.costs.salaries.sales.annual * projections.staffing.sales[q]
    ) / 4;
    
    projections.expenses.technical[q] = (
      inputs.costs.technical.hosting * (1 + 0.1 * Math.floor(q / 4)) + // Augmentation de 10% par an
      inputs.costs.technical.domain +
      inputs.costs.technical.internalTools * (1 + 0.05 * Math.floor(q / 4)) + // Augmentation de 5% par an
      inputs.costs.technical.security * (1 + 0.05 * Math.floor(q / 4)) // Augmentation de 5% par an
    ) / 4;
    
    projections.expenses.marketing[q] = (
      inputs.growth.acquisition.emailCost * 3 + // 3 mois par trimestre
      inputs.growth.acquisition.forumsCost +
      inputs.growth.acquisition.partnersCost * 3
    );
    
    projections.expenses.total[q] = 
      projections.expenses.salaries[q] + 
      projections.expenses.technical[q] + 
      projections.expenses.marketing[q];
    
    // Calculer les revenus totaux et le profit/perte pour ce trimestre
    projections.revenue.total[q] = 
      projections.revenue.smallAssociations[q] + 
      projections.revenue.largeAssociations[q] + 
      projections.revenue.localAuthorities[q] + 
      projections.revenue.upsell[q];
    
    projections.profitLoss[q] = projections.revenue.total[q] - projections.expenses.total[q];
    
    // Comparer au revenu cible (projeté linéairement sur 3 ans)
    const targetRevenueForQuarter = (inputs.targetRevenue * (1 + q/12)) / 4;
    projections.targetComparison[q] = projections.revenue.total[q] - targetRevenueForQuarter;
    
    // Calculer les métriques SaaS pour ce trimestre
    projections.metrics.arpu[q] = projections.revenue.total[q] * 4 / projections.clients.total[q]; // Annualisé
    
    // Churn moyen pondéré
    projections.metrics.churnRate.average[q] = calculateWeightedChurnRate(
      projections.clients.smallAssociations[q],
      projections.clients.largeAssociations[q],
      projections.clients.localAuthorities.total[q],
      projections.metrics.churnRate.smallAssociations[q],
      projections.metrics.churnRate.largeAssociations[q],
      projections.metrics.churnRate.localAuthorities[q]
    );
    
    // NRR (Net Revenue Retention)
    const baseRevenueWithoutUpsell = 
      projections.revenue.smallAssociations[q] + 
      projections.revenue.largeAssociations[q] + 
      projections.revenue.localAuthorities[q];
    
    const previousBaseRevenue = 
      projections.revenue.smallAssociations[Math.max(0, q-1)] + 
      projections.revenue.largeAssociations[Math.max(0, q-1)] + 
      projections.revenue.localAuthorities[Math.max(0, q-1)];
    
    projections.metrics.nrr[q] = (baseRevenueWithoutUpsell + projections.revenue.upsell[q]) / previousBaseRevenue;
    
    // CAC, LTV et ratio LTV/CAC
    projections.metrics.cac[q] = inputs.acquisition.cacPerClient * (1 + 0.03 * Math.floor(q / 4)); // Augmentation de 3% par an
    projections.metrics.ltv[q] = projections.metrics.arpu[q] / (projections.metrics.churnRate.average[q] * 12);
    projections.metrics.ltvCacRatio[q] = projections.metrics.ltv[q] / projections.metrics.cac[q];
    projections.metrics.cacPayback[q] = projections.metrics.cac[q] / (projections.metrics.arpu[q] / 12);
    
    // Revenu par employé et marge opérationnelle
    projections.metrics.revenuePerEmployee[q] = (projections.revenue.total[q] * 4) / projections.staffing.total[q]; // Annualisé
    projections.metrics.operatingMargin[q] = projections.profitLoss[q] / projections.revenue.total[q];
    
    // Règle des 40 (Croissance + Marge opérationnelle en %)
    const quarterlyGrowthRate = q > 0 ? (projections.revenue.total[q] / projections.revenue.total[q-1]) - 1 : 0;
    const annualizedGrowthRate = Math.pow(1 + quarterlyGrowthRate, 4) - 1;
    projections.metrics.ruleOf40[q] = (annualizedGrowthRate * 100) + (projections.metrics.operatingMargin[q] * 100);
    
    // Calculer le cash flow pour les 3 mois du trimestre
    monthlyCashFlow = calculateMonthlyCashFlow(
      projections.revenue.total[q] * 4, // Revenus annuels
      projections.expenses.total[q] * 4, // Dépenses annuelles
      inputs.annualPaymentRate, // Taux de paiement annuel
      projections.clients.smallAssociations[q],
      projections.clients.largeAssociations[q]
    );
    
    const monthIndex = q * 3;
    projections.cashFlow.monthly.splice(monthIndex, 3, ...monthlyCashFlow);
    
    for (let m = 0; m < 3; m++) {
      const currentMonthIndex = monthIndex + m;
      if (currentMonthIndex > 0) {
        projections.cashFlow.cumulative[currentMonthIndex] = 
          projections.cashFlow.cumulative[currentMonthIndex - 1] + 
          projections.cashFlow.monthly[currentMonthIndex];
      } else {
        projections.cashFlow.cumulative[currentMonthIndex] = projections.cashFlow.monthly[currentMonthIndex];
      }
    }
  }
  
  return projections;
};

/**
 * Calcule le revenu pour un segment de clients (petites/grandes assos)
 * @param {number} clients Nombre de clients
 * @param {number} monthlyPrice Prix mensuel
 * @param {number} yearlyPrice Prix annuel
 * @param {number} annualPaymentRate Taux de paiement annuel
 * @returns {number} Revenu annuel pour ce segment
 */
const calculateSegmentRevenue = (clients, monthlyPrice, yearlyPrice, annualPaymentRate) => {
  const annualClients = clients * annualPaymentRate;
  const monthlyClients = clients * (1 - annualPaymentRate);
  
  return (annualClients * yearlyPrice) + (monthlyClients * monthlyPrice * 12);
};

/**
 * Calcule le taux de churn moyen pondéré
 * @param {number} smallClients Nombre de petites associations
 * @param {number} largeClients Nombre de grandes associations
 * @param {number} localAuthoritiesClients Nombre de clients via collectivités
 * @param {number} smallChurn Taux de churn des petites associations
 * @param {number} largeChurn Taux de churn des grandes associations
 * @param {number} localAuthoritiesChurn Taux de churn des collectivités
 * @returns {number} Taux de churn moyen pondéré
 */
const calculateWeightedChurnRate = (
  smallClients, 
  largeClients, 
  localAuthoritiesClients,
  smallChurn,
  largeChurn,
  localAuthoritiesChurn
) => {
  const totalClients = smallClients + largeClients + localAuthoritiesClients;
  
  if (totalClients === 0) return 0;
  
  return (
    (smallClients * smallChurn) +
    (largeClients * largeChurn) +
    (localAuthoritiesClients * localAuthoritiesChurn)
  ) / totalClients;
};

/**
 * Interpole entre deux valeurs
 * @param {number} start Valeur de départ
 * @param {number} end Valeur d'arrivée
 * @param {number} factor Facteur d'interpolation (0-1)
 * @returns {number} Valeur interpolée
 */
const interpolateValue = (start, end, factor) => {
  return start + (end - start) * factor;
};

/**
 * Calcule le nombre de nouveaux clients acquis en fonction du temps commercial disponible
 * @param {number} totalSalesTime Temps commercial total disponible (en minutes)
 * @param {Object} acquisitionParams Paramètres d'acquisition
 * @returns {number} Nombre de nouveaux clients acquis
 */
const calculateNewClientsAcquired = (totalSalesTime, acquisitionParams) => {
  // Répartition du temps entre webinaire et visio
  const webinarTimeShare = 0.3; // 30% du temps en webinaire
  const videoCallTimeShare = 0.7; // 70% du temps en visio
  
  const webinarTime = totalSalesTime * webinarTimeShare;
  const videoCallTime = totalSalesTime * videoCallTimeShare;
  
  // Nombre de prospects pouvant être traités
  const webinarProspects = webinarTime / acquisitionParams.conversion.webinar.timePerClient;
  const videoCallProspects = videoCallTime / acquisitionParams.conversion.videoCall.timePerClient;
  
  // Conversion des prospects en clients
  const webinarClients = webinarProspects * 
    acquisitionParams.conversion.webinar.meeting1ToMeeting2Rate * 
    acquisitionParams.conversion.webinar.meeting2ToClientRate;
  
  const videoCallClients = videoCallProspects * 
    acquisitionParams.conversion.videoCall.meeting1ToMeeting2Rate * 
    acquisitionParams.conversion.videoCall.meeting2ToClientRate;
  
  return webinarClients + videoCallClients;
};

/**
 * Calcule le cash flow mensuel pour un trimestre
 * @param {number} annualRevenue Revenu annuel
 * @param {number} annualExpenses Dépenses annuelles
 * @param {Object} annualPaymentRate Taux de paiement annuel par segment
 * @param {number} smallClients Nombre de petites associations
 * @param {number} largeClients Nombre de grandes associations
 * @returns {Array<number>} Cash flow pour les 3 mois
 */
const calculateMonthlyCashFlow = (
  annualRevenue,
  annualExpenses,
  annualPaymentRate,
  smallClients,
  largeClients
) => {
  const monthlyExpenses = annualExpenses / 12;
  
  // Estimer la proportion de revenus annuels vs mensuels
  const smallAnnualClients = smallClients * annualPaymentRate.smallAssociations;
  const largeAnnualClients = largeClients * annualPaymentRate.largeAssociations;
  
  const smallMonthlyClients = smallClients * (1 - annualPaymentRate.smallAssociations);
  const largeMonthlyClients = largeClients * (1 - annualPaymentRate.largeAssociations);
  
  // Les collectivités sont supposées payer annuellement à 100%
  
  // Répartir les revenus selon le mode de paiement (mensuel vs annuel)
  // Nous supposerons une répartition simplifée:
  // - Mois 1: 50% des paiements annuels + revenus mensuels
  // - Mois 2 et 3: seulement les revenus mensuels
  
  const totalClients = smallClients + largeClients;
  const annualClientsShare = (smallAnnualClients + largeAnnualClients) / Math.max(1, totalClients);
  const monthlyClientsShare = (smallMonthlyClients + largeMonthlyClients) / Math.max(1, totalClients);
  
  const annualRevenueShare = annualRevenue * (annualClientsShare / (annualClientsShare + monthlyClientsShare * 12));
  const monthlyRevenueShare = annualRevenue * (monthlyClientsShare / (annualClientsShare / 12 + monthlyClientsShare));
  
  const month1Revenue = (annualRevenueShare / 2) + (monthlyRevenueShare / 12);
  const month2Revenue = monthlyRevenueShare / 12;
  const month3Revenue = monthlyRevenueShare / 12;
  
  return [
    month1Revenue - monthlyExpenses,
    month2Revenue - monthlyExpenses,
    month3Revenue - monthlyExpenses
  ];
};