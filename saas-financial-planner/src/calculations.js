// Calculations.js - Contient toutes les fonctions de calcul financier

// Calcul du CA initial basé sur les offres
export const calculateInitialCA = (offerTypes) => {
  let ca = 0;
  
  Object.values(offerTypes).forEach(offer => {
    ca += offer.totalPrice * offer.count;
  });
  
  return ca;
};

// Équilibre automatique des clients pour atteindre un CA cible
export const balanceClientsForTargetCA = (targetCA, offerTypes) => {
  // Proportions relatives: 40% petites, 40% grandes, 20% collectivités
  const totalCA = targetCA;
  
  // Distribution des collectivités (sur les 20% de leur part)
  const collectivityPart = totalCA * 0.2;
  const updatedOfferTypes = { ...offerTypes };
  
  // Distribution approximative entre les packs
  updatedOfferTypes.collectivity10.count = Math.round(collectivityPart * 0.3 / updatedOfferTypes.collectivity10.totalPrice);
  updatedOfferTypes.collectivity20.count = Math.round(collectivityPart * 0.3 / updatedOfferTypes.collectivity20.totalPrice);
  updatedOfferTypes.collectivity50.count = Math.round(collectivityPart * 0.3 / updatedOfferTypes.collectivity50.totalPrice);
  updatedOfferTypes.collectivity100.count = Math.round(collectivityPart * 0.1 / updatedOfferTypes.collectivity100.totalPrice);
  
  // Partage entre petites et grandes assos (40% chacun)
  const smallAssocPart = totalCA * 0.4;
  const largeAssocPart = totalCA * 0.4;
  
  updatedOfferTypes.smallAssoc.count = Math.round(smallAssocPart / updatedOfferTypes.smallAssoc.totalPrice);
  updatedOfferTypes.largeAssoc.count = Math.round(largeAssocPart / updatedOfferTypes.largeAssoc.totalPrice);
  
  return updatedOfferTypes;
};

// Fonction de calcul du churn pour un trimestre donné (interpolation linéaire)
export const calculateChurnForQuarter = (segment, quarterIndex, totalQuarters, offerTypes) => {
  const initialChurn = offerTypes[segment].initialChurn / 100; // Conversion en décimal
  const finalChurn = offerTypes[segment].finalChurn / 100;
  
  // Interpolation linéaire
  return initialChurn - (initialChurn - finalChurn) * (quarterIndex / totalQuarters);
};

// Calcul des nouveaux clients pour un trimestre
export const calculateNewClientsForQuarter = (segment, quarterIndex, previousClients, growthRates) => {
  // Croissance organique (taux annuel divisé par 4 pour le trimestre)
  const organicGrowthRate = growthRates.organic / 100 / 4;
  
  // Nouveaux clients organiques
  const organicNewClients = Math.round(previousClients * organicGrowthRate);
  
  // Nouveaux clients par actions marketing (distribution simple)
  let marketingNewClients = 0;
  
  if (segment === 'smallAssoc') {
    // 60% des leads d'emailing et 70% des contacts de forums pour petites assos
    marketingNewClients = Math.round((growthRates.emailLeads * 3 * 0.6 * 0.05) + (growthRates.forumContacts * 0.7 * 0.2));
  } else if (segment === 'largeAssoc') {
    // 30% des leads d'emailing et 20% des contacts de forums pour grandes assos
    marketingNewClients = Math.round((growthRates.emailLeads * 3 * 0.3 * 0.05) + (growthRates.forumContacts * 0.2 * 0.2));
  } else {
    // 10% des leads d'emailing et 10% des contacts de forums répartis sur les collectivités
    const collectivityShare = {
      collectivity10: 0.4,
      collectivity20: 0.3,
      collectivity50: 0.2,
      collectivity100: 0.1
    };
    
    marketingNewClients = Math.round((growthRates.emailLeads * 3 * 0.1 * 0.05 * collectivityShare[segment]) + 
                                     (growthRates.forumContacts * 0.1 * 0.2 * collectivityShare[segment]));
  }
  
  return organicNewClients + marketingNewClients;
};

// Calcul des résultats financiers complets
export const calculateFinancialResults = (
  offerTypes,
  upsellModules,
  costs,
  commercialParams,
  growthRates,
  quarters
) => {
  const quarterlyResults = [];
  const cumulativeResults = {
    ca: Array(quarters).fill(0),
    costs: Array(quarters).fill(0),
    margin: Array(quarters).fill(0),
    cash: Array(quarters).fill(0)
  };
  
  // Structure pour suivre le nombre de clients par segment et par trimestre
  const clientTracking = {
    smallAssoc: Array(quarters + 1).fill(0),
    largeAssoc: Array(quarters + 1).fill(0),
    collectivity10: Array(quarters + 1).fill(0),
    collectivity20: Array(quarters + 1).fill(0),
    collectivity50: Array(quarters + 1).fill(0),
    collectivity100: Array(quarters + 1).fill(0)
  };
  
  // Initialisation avec les clients de départ
  Object.keys(offerTypes).forEach(key => {
    clientTracking[key][0] = offerTypes[key].count;
  });
  
  // Pour chaque trimestre
  for (let q = 0; q < quarters; q++) {
    const quarterData = {
      quarter: q + 1,
      year: Math.floor(q / 4) + 1,
      clients: {},
      revenue: {
        base: 0,
        upsell: 0,
        total: 0
      },
      costs: {
        salaries: 0,
        technical: 0,
        acquisition: 0,
        total: 0
      },
      margin: 0,
      cash: 0
    };
    
    // Calculer les clients après churn et nouveaux clients pour chaque segment
    Object.keys(offerTypes).forEach(segment => {
      const previousClients = clientTracking[segment][q];
      
      // Calcul du churn pour ce trimestre (3 mois)
      const monthlyChurnRate = calculateChurnForQuarter(segment, q, quarters, offerTypes);
      const quarterlyChurnRate = 1 - Math.pow(1 - monthlyChurnRate, 3); // Churn trimestriel
      
      // Clients perdus à cause du churn
      const churnedClients = Math.round(previousClients * quarterlyChurnRate);
      
      // Nouveaux clients pour ce trimestre
      const newClients = calculateNewClientsForQuarter(segment, q, previousClients, growthRates);
      
      // Clients restants à la fin du trimestre
      const remainingClients = previousClients - churnedClients + newClients;
      clientTracking[segment][q + 1] = remainingClients;
      
      // Stocker pour le trimestre actuel
      quarterData.clients[segment] = {
        start: previousClients,
        churn: churnedClients,
        new: newClients,
        end: remainingClients
      };
      
      // Calculer le revenu de base pour ce segment
      // Prendre en compte la répartition mensuel vs annuel
      if (segment === 'smallAssoc' || segment === 'largeAssoc') {
        const monthlyPercent = offerTypes[segment].payMonthlyPercentage / 100;
        const yearlyPercent = 1 - monthlyPercent;
        
        // Revenus mensuels (moyenne sur le trimestre entre début et fin)
        const avgClients = (previousClients + remainingClients) / 2;
        const monthlyRevenue = avgClients * monthlyPercent * offerTypes[segment].monthlyPrice * 3; // 3 mois
        
        // Revenus annuels (proratisés par trimestre)
        // Simplification: on suppose que 1/4 des contrats annuels sont renouvelés chaque trimestre
        const yearlyRevenue = remainingClients * yearlyPercent * offerTypes[segment].yearlyPrice / 4;
        
        quarterData.revenue.base += monthlyRevenue + yearlyRevenue;
      } else {
        // Pour les collectivités, le prix est fixe par pack
        const monthlyPercent = offerTypes[segment].payMonthlyPercentage / 100;
        const yearlyPercent = 1 - monthlyPercent;
        
        // Calcul similaire mais avec le prix total du pack
        const avgClients = (previousClients + remainingClients) / 2;
        
        // Si le paiement est mensuel, on divise le prix total par 12 et on multiplie par 3 mois
        const monthlyRevenue = avgClients * monthlyPercent * (offerTypes[segment].totalPrice / 12) * 3;
        
        // Pour le paiement annuel, on prend 1/4 du total annuel (proratisé par trimestre)
        const yearlyRevenue = remainingClients * yearlyPercent * offerTypes[segment].totalPrice / 4;
        
        quarterData.revenue.base += monthlyRevenue + yearlyRevenue;
      }
    });
    
    // Calculer les revenus d'upsell pour ce trimestre
    upsellModules.forEach(module => {
      // Ne commencer à appliquer l'upsell qu'à partir du trimestre spécifié
      if (q + 1 >= module.quarter) {
        // Pour chaque segment client
        Object.keys(offerTypes).forEach(segment => {
          let adoptionRate = 0;
          
          // Déterminer le taux d'adoption pour ce segment
          if (segment === 'smallAssoc') {
            adoptionRate = module.adoptionRateSmall / 100;
          } else if (segment === 'largeAssoc') {
            adoptionRate = module.adoptionRateLarge / 100;
          } else {
            adoptionRate = module.adoptionRateCollectivity / 100;
          }
          
          // Si le module est payant et que le taux d'adoption est > 0
          if (module.price > 0 && adoptionRate > 0) {
            const clientsAtEnd = quarterData.clients[segment].end;
            
            // Calculer le nombre d'assos concernées
            let numberOfAssos = clientsAtEnd;
            if (segment === 'collectivity10') numberOfAssos *= 10;
            if (segment === 'collectivity20') numberOfAssos *= 20;
            if (segment === 'collectivity50') numberOfAssos *= 50;
            if (segment === 'collectivity100') numberOfAssos *= 100;
            
            // Calculer le revenu d'upsell
            // Si le prix est mensuel, multiplier par 3 pour le trimestre
            const isMonthlyPrice = module.name !== 'Mutualisation' && module.name !== 'Subvention';
            const moduleRevenue = isMonthlyPrice ? 
              numberOfAssos * adoptionRate * module.price * 3 : // prix mensuel * 3 mois
              numberOfAssos * adoptionRate * module.price / 4;  // prix annuel divisé par 4 trimestres
            
            quarterData.revenue.upsell += moduleRevenue;
          }
        });
      }
    });
    
    // Calculer le revenu total pour ce trimestre
    quarterData.revenue.total = quarterData.revenue.base + quarterData.revenue.upsell;
    
    // Calculer les coûts pour ce trimestre
    // Salaires (divisés par 4 pour avoir le coût trimestriel)
    let totalEmployees = 1; // Fondateur
    
    // Calculer le nombre d'employés nécessaires en fonction du seuil
    const totalClients = Object.values(quarterData.clients).reduce((acc, curr) => acc + curr.end, 0);
    
    // Dev/Support
    const devSupportCount = 1 + Math.floor(totalClients / costs.salaries.devSupport.incrementThreshold) * costs.salaries.devSupport.increment;
    totalEmployees += devSupportCount;
    
    // Commercial
    const commercialCount = Math.max(1, Math.floor(totalClients / costs.salaries.commercial.incrementThreshold) * costs.salaries.commercial.increment);
    totalEmployees += commercialCount;
    
    // Calculer les coûts salariaux
    quarterData.costs.salaries = (
      costs.salaries.founder.annual + 
      costs.salaries.devSupport.annual * devSupportCount +
      costs.salaries.commercial.annual * commercialCount
    ) / 4; // Divisé par 4 trimestres
    
    // Coûts techniques (divisés par 4 pour avoir le coût trimestriel)
    quarterData.costs.technical = (
      costs.technical.hosting +
      costs.technical.domain +
      costs.technical.saas +
      costs.technical.security
    ) / 4; // Divisé par 4 trimestres
    
    // Coûts d'acquisition
    quarterData.costs.acquisition = (
      costs.acquisition.emailings / 4 + // Déjà annuel, divisé par 4
      costs.acquisition.forums / 4 +    // Déjà annuel, divisé par 4
      costs.acquisition.partnerships / 4 // Déjà annuel, divisé par 4
    );
    
    // Coût total pour le trimestre
    quarterData.costs.total = quarterData.costs.salaries + quarterData.costs.technical + quarterData.costs.acquisition;
    
    // Marge pour le trimestre
    quarterData.margin = quarterData.revenue.total - quarterData.costs.total;
    
    // Mise à jour des résultats cumulatifs
    cumulativeResults.ca[q] = q > 0 ? cumulativeResults.ca[q-1] + quarterData.revenue.total : quarterData.revenue.total;
    cumulativeResults.costs[q] = q > 0 ? cumulativeResults.costs[q-1] + quarterData.costs.total : quarterData.costs.total;
    cumulativeResults.margin[q] = cumulativeResults.ca[q] - cumulativeResults.costs[q];
    
    // Cashflow (simplification: cash = marge cumulée)
    cumulativeResults.cash[q] = cumulativeResults.margin[q];
    quarterData.cash = quarterData.margin;
    
    // Ajouter ce trimestre aux résultats
    quarterlyResults.push(quarterData);
  }
  
  // Calcul des KPIs
  // CAC moyen
  const totalNewClients = quarterlyResults.reduce((acc, quarter) => {
    const newClientsThisQuarter = Object.values(quarter.clients).reduce((sum, segment) => sum + segment.new, 0);
    return acc + newClientsThisQuarter;
  }, 0);
  
  const totalAcquisitionCosts = quarters * (costs.acquisition.emailings / 4 + costs.acquisition.forums / 4 + costs.acquisition.partnerships / 4);
  const cac = totalNewClients > 0 ? totalAcquisitionCosts / totalNewClients : 0;
  
  // ARPU par segment (au dernier trimestre)
  const lastQuarter = quarterlyResults[quarters - 1];
  const arpu = {};
  
  Object.keys(offerTypes).forEach(segment => {
    const clientsAtEnd = lastQuarter.clients[segment].end;
    if (clientsAtEnd > 0) {
      // Calculer les revenus totaux pour ce segment au dernier trimestre
      let segmentRevenue = 0;
      
      // Revenu de base
      if (segment === 'smallAssoc' || segment === 'largeAssoc') {
        const monthlyPercent = offerTypes[segment].payMonthlyPercentage / 100;
        const yearlyPercent = 1 - monthlyPercent;
        
        const monthlyRevenue = clientsAtEnd * monthlyPercent * offerTypes[segment].monthlyPrice;
        const yearlyRevenue = clientsAtEnd * yearlyPercent * offerTypes[segment].yearlyPrice / 12;
        
        segmentRevenue = monthlyRevenue + yearlyRevenue;
      } else {
        const monthlyPercent = offerTypes[segment].payMonthlyPercentage / 100;
        const yearlyPercent = 1 - monthlyPercent;
        
        const monthlyRevenue = clientsAtEnd * monthlyPercent * (offerTypes[segment].totalPrice / 12);
        const yearlyRevenue = clientsAtEnd * yearlyPercent * offerTypes[segment].totalPrice / 12;
        
        segmentRevenue = monthlyRevenue + yearlyRevenue;
      }
      
      // Ajouter l'upsell (simplifié)
      // Cette partie est une approximation, l'idéal serait de suivre les revenus d'upsell par segment
      
      // ARPU mensuel = revenu mensuel / nombre de clients
      arpu[segment] = segmentRevenue / clientsAtEnd;
    } else {
      arpu[segment] = 0;
    }
  });
  
  // LTV (simplifié: ARPU × 1/churn mensuel)
  const ltv = {};
  const ltvCacRatio = {};
  
  Object.keys(offerTypes).forEach(segment => {
    // Utiliser le churn final pour le calcul du LTV
    const finalMonthlyChurn = offerTypes[segment].finalChurn / 100;
    if (finalMonthlyChurn > 0 && arpu[segment] > 0) {
      ltv[segment] = arpu[segment] / finalMonthlyChurn;
      ltvCacRatio[segment] = ltv[segment] / cac;
    } else {
      ltv[segment] = 0;
      ltvCacRatio[segment] = 0;
    }
  });
  
  // CAC Payback (en mois)
  // Moyenne pondérée des ARPU
  const totalClients = Object.keys(offerTypes).reduce((acc, segment) => acc + lastQuarter.clients[segment].end, 0);
  const weightedArpu = Object.keys(offerTypes).reduce((acc, segment) => {
    return acc + (arpu[segment] * lastQuarter.clients[segment].end / totalClients);
  }, 0);
  
  const cacPayback = weightedArpu > 0 ? cac / weightedArpu : 0;
  
  // Net Revenue Retention (approximation simplifiée)
  // Comparer le revenu du dernier trimestre avec le revenu du même trimestre un an avant
  let nrr = 0;
  if (quarters >= 5) { // Au moins 5 trimestres pour avoir un an d'écart
    const lastQuarterRevenue = quarterlyResults[quarters - 1].revenue.total;
    const quarterOneYearAgo = quarterlyResults[quarters - 5].revenue.total;
    
    if (quarterOneYearAgo > 0) {
      nrr = (lastQuarterRevenue / quarterOneYearAgo) * 100;
    }
  }
  
  // Rule of 40
  // Croissance annuelle (dernier trimestre vs même trimestre un an avant) + marge opérationnelle
  let annualGrowth = 0;
  if (quarters >= 5) {
    const lastQuarterRevenue = quarterlyResults[quarters - 1].revenue.total;
    const quarterOneYearAgo = quarterlyResults[quarters - 5].revenue.total;
    
    if (quarterOneYearAgo > 0) {
      annualGrowth = ((lastQuarterRevenue / quarterOneYearAgo) - 1) * 100;
    }
  }
  
  // Marge opérationnelle (dernier trimestre)
  const operatingMargin = lastQuarter.revenue.total > 0 
    ? (lastQuarter.margin / lastQuarter.revenue.total) * 100 
    : 0;
  
  const ruleOf40 = annualGrowth + operatingMargin;
  
  // Revenu par employé (annualisé)
  const annualizedRevenue = lastQuarter.revenue.total * 4; // Multiplie par 4 pour annualiser
  const totalEmployeesLastQuarter = 1 + // Fondateur
                                   (1 + Math.floor(totalClients / costs.salaries.devSupport.incrementThreshold)) + // Dev/Support
                                   Math.max(1, Math.floor(totalClients / costs.salaries.commercial.incrementThreshold)); // Commercial
  
  const revenuePerEmployee = totalEmployeesLastQuarter > 0 
    ? annualizedRevenue / totalEmployeesLastQuarter 
    : 0;
  
  // Retourner les résultats financiers complets
  return {
    quarterlyResults,
    cumulativeResults,
    kpis: {
      cac,
      cacPayback,
      ltv,
      ltvCacRatio,
      nrr,
      arpu,
      ruleOf40,
      operatingMargin,
      revenuePerEmployee
    }
  };
};

// Fonction d'aide pour formater les nombres en euros
export const formatEuro = (value) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

// Fonction pour arrondir à 2 décimales
export const roundToTwo = (num) => {
  return Math.round(num * 100) / 100;
};
