/**
 * utils.js
 * Fonctions utilitaires pour le modèle financier SaaS
 */

/**
 * Formate un nombre avec séparateurs de milliers
 * @param {number} num - Nombre à formater
 * @param {number} decimals - Nombre de décimales (défaut: 0)
 * @returns {string} Nombre formaté
 */
export const formatNumber = (num, decimals = 0) => {
    return new Intl.NumberFormat('fr-FR', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    }).format(num);
  };
  
  /**
   * Formate un montant en euros
   * @param {number} amount - Montant à formater
   * @param {number} decimals - Nombre de décimales (défaut: 0)
   * @returns {string} Montant formaté avec symbole €
   */
  export const formatCurrency = (amount, decimals = 0) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    }).format(amount);
  };
  
  /**
   * Formate un pourcentage
   * @param {number} value - Valeur à formater (0.1 = 10%)
   * @param {number} decimals - Nombre de décimales (défaut: 1)
   * @returns {string} Pourcentage formaté
   */
  export const formatPercent = (value, decimals = 1) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'percent', 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    }).format(value);
  };
  
  /**
   * Crée un tableau de données pour les graphiques à partir des résultats
   * @param {object} results - Résultats du modèle
   * @returns {object} Données formatées pour les graphiques
   */
  export const prepareChartData = (results) => {
    // Répartition des coûts
    const costBreakdownData = [
      { name: 'Marketing', value: results.costs.acquisition.marketingBudget },
      { name: 'Infrastructure', value: results.costs.operational.annual.infrastructure },
      { name: 'Support', value: results.costs.operational.annual.support },
      { name: 'Salaires', value: results.headcount.totalSalaryCost },
      { name: 'Frais généraux', value: results.costs.overhead.annual }
    ];
    
    // Répartition des effectifs
    const headcountData = Object.entries(results.headcount.byTeam).map(([team, data]) => ({
      name: team.charAt(0).toUpperCase() + team.slice(1),
      employees: data.employees,
      cost: data.salaryCost
    }));
    
    // Répartition des clients
    const customerDistributionData = Object.entries(results.customers.byTier).map(([tier, count]) => ({
      name: tier.charAt(0).toUpperCase() + tier.slice(1),
      value: count
    }));
    
    // Conversion des projections de croissance
    const growthProjectionData = results.growthProjection || [];
    
    return {
      costBreakdownData,
      headcountData,
      customerDistributionData,
      growthProjectionData
    };
  };
  
  /**
   * Liste des palettes de couleurs pour les graphiques
   */
  export const CHART_COLORS = {
    primary: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'],
    blue: ['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'],
    green: ['#606c38', '#283618', '#dda15e', '#bc6c25', '#4f772d', '#31572c', '#132a13', '#ecf39e'],
    pastel: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff']
  };
  
  /**
   * Détermine la santé financière globale du modèle SaaS
   * @param {object} metrics - Métriques SaaS calculées
   * @returns {object} Évaluation de la santé financière
   */
  export const evaluateFinancialHealth = (metrics) => {
    const evaluations = {
      ltvCacRatio: {
        value: metrics.ltvCacRatio,
        status: metrics.ltvCacRatio >= 3 ? 'excellent' : metrics.ltvCacRatio >= 2 ? 'bon' : 'critique',
        message: metrics.ltvCacRatio >= 3 
          ? 'Excellent ratio LTV/CAC' 
          : metrics.ltvCacRatio >= 2 
            ? 'Ratio LTV/CAC acceptable mais à améliorer' 
            : 'Ratio LTV/CAC insuffisant'
      },
      cacPaybackPeriod: {
        value: metrics.cacPaybackPeriod,
        status: metrics.cacPaybackPeriod <= 12 ? 'excellent' : metrics.cacPaybackPeriod <= 18 ? 'bon' : 'critique',
        message: metrics.cacPaybackPeriod <= 12 
          ? 'Payback period optimal' 
          : metrics.cacPaybackPeriod <= 18 
            ? 'Payback period acceptable' 
            : 'Payback period trop long'
      },
      churnRate: {
        value: metrics.churnRate / 100,
        status: metrics.churnRate <= 2 ? 'excellent' : metrics.churnRate <= 5 ? 'bon' : 'critique',
        message: metrics.churnRate <= 2 
          ? 'Excellent taux de churn' 
          : metrics.churnRate <= 5 
            ? 'Taux de churn acceptable' 
            : 'Taux de churn élevé'
      },
      ruleOf40: {
        value: metrics.ruleOf40Score,
        status: metrics.ruleOf40Score >= 40 ? 'excellent' : metrics.ruleOf40Score >= 30 ? 'bon' : 'critique',
        message: metrics.ruleOf40Score >= 40 
          ? 'Rule of 40 atteinte' 
          : metrics.ruleOf40Score >= 30 
            ? 'Rule of 40 proche' 
            : 'Rule of 40 non atteinte'
      }
    };
    
    // Calcul du score global
    let globalScore = 0;
    const weights = {
      ltvCacRatio: 0.4,
      cacPaybackPeriod: 0.2,
      churnRate: 0.3,
      ruleOf40: 0.1
    };
    
    for (const metric in evaluations) {
      const { status } = evaluations[metric];
      const score = status === 'excellent' ? 1 : status === 'bon' ? 0.5 : 0;
      globalScore += score * weights[metric];
    }
    
    const globalStatus = globalScore >= 0.8 ? 'excellent' : globalScore >= 0.5 ? 'bon' : 'à risque';
    
    return {
      metrics: evaluations,
      globalScore,
      globalStatus
    };
  };
  
  /**
   * Génère des recommandations d'optimisation basées sur les résultats
   * @param {object} results - Résultats du modèle
   * @returns {Array} Liste de recommandations
   */
  export const generateRecommendations = (results) => {
    const recommendations = [];
    
    // Vérification du ratio LTV/CAC
    if (results.metrics.ltvCacRatio < 3) {
      recommendations.push({
        category: 'acquisition',
        title: 'Améliorer le ratio LTV/CAC',
        description: 'Le ratio LTV/CAC est inférieur à 3, ce qui indique un déséquilibre entre la valeur générée et le coût d\'acquisition.',
        actions: [
          'Augmenter les prix des abonnements',
          'Optimiser les campagnes marketing pour réduire le CAC',
          'Améliorer la rétention pour augmenter la LTV'
        ]
      });
    }
    
    // Vérification du taux de churn
    if (results.metrics.churnRate > 3) {
      recommendations.push({
        category: 'retention',
        title: 'Réduire le taux de churn',
        description: 'Le taux de churn mensuel est élevé, ce qui réduit la durée de vie moyenne des clients.',
        actions: [
          'Mettre en place un programme d\'onboarding amélioré',
          'Développer des fonctionnalités d\'engagement',
          'Établir un processus de feedback client régulier'
        ]
      });
    }
    
    // Vérification de la marge opérationnelle
    if (results.profitability.profitMargin < 0.2) {
      recommendations.push({
        category: 'profitability',
        title: 'Améliorer la marge opérationnelle',
        description: 'La marge opérationnelle est inférieure à 20%, ce qui limite la capacité d\'investissement.',
        actions: [
          'Optimiser la structure des coûts',
          'Augmenter les prix ou introduire des paliers premium',
          'Automatiser certains processus pour réduire les coûts opérationnels'
        ]
      });
    }
    
    // Vérification de l'efficacité du personnel
    const revPerEmployee = results.profitability.revenue / results.headcount.total;
    if (revPerEmployee < 150000) {
      recommendations.push({
        category: 'headcount',
        title: 'Améliorer l\'efficacité des équipes',
        description: 'Le revenu par employé est inférieur à 150 000€, ce qui indique une possible inefficacité.',
        actions: [
          'Revoir les ratios clients/employé par département',
          'Investir dans l\'automatisation et les outils',
          'Former les équipes pour améliorer la productivité'
        ]
      });
    }
    
    return recommendations;
  };
  
  const utils = {
    formatNumber,
    formatCurrency,
    formatPercent,
    prepareChartData,
    CHART_COLORS,
    evaluateFinancialHealth,
    generateRecommendations
  };