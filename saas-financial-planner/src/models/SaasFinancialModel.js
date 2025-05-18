/**
 * SaasFinancialModel.js
 * Modèle de calcul financier pour entreprises SaaS
 */

class SaasFinancialModel {
    constructor(targetRevenue) {
      // Objectif CA annuel
      this.targetAnnualRevenue = targetRevenue;
      
      // Initialisation des hypothèses par défaut (à personnaliser)
      this.assumptions = {
        // Structure de revenus
        averageRevenuePerUser: {
          basic: 20,      // € par mois
          pro: 50,        // € par mois
          enterprise: 200  // € par mois
        },
        customerDistribution: {
          basic: 0.6,      // 60% des clients
          pro: 0.3,        // 30% des clients
          enterprise: 0.1   // 10% des clients
        },
        annualBillingPercentage: 0.4,  // 40% des clients paient annuellement
        annualBillingDiscount: 0.15,   // 15% de remise pour paiement annuel
        
        // Churn et rétention
        monthlyChurnRate: 0.03,        // 3% de churn mensuel
        monthlyUpsellRate: 0.02,       // 2% d'upsell mensuel
        netRevenueRetention: 1.05,     // 105% (croissance nette malgré le churn)
        
        // Acquisition et coûts marketing
        averageCAC: 500,              // € coût d'acquisition moyen
        marketingBudgetPercentage: 0.25, // 25% du CA en marketing
        organicAcquisitionPercentage: 0.3, // 30% d'acquisition organique
        paidAcquisitionPercentage: 0.7,    // 70% d'acquisition payante
        
        // Coûts opérationnels
        infrastructureCostPerUser: 2,  // € par utilisateur/mois
        supportCostPerUser: 3,         // € par utilisateur/mois
        
        // Ressources humaines
        teams: {
          development: {
            averageSalary: 65000,      // € par an
            clientsPerEmployee: 250     // Nombre de clients par développeur
          },
          marketing: {
            averageSalary: 55000,      // € par an
            clientsPerEmployee: 400     // Nombre de clients par marketeur
          },
          sales: {
            averageSalary: 60000,      // € par an
            clientsPerEmployee: 200     // Nombre de clients par commercial
          },
          support: {
            averageSalary: 45000,      // € par an
            clientsPerEmployee: 150     // Nombre de clients par support
          },
          management: {
            averageSalary: 85000,      // € par an
            clientsPerEmployee: 500     // Nombre de clients par manager
          }
        },
        
        // Frais généraux
        overheadPercentage: 0.15,      // 15% du CA en frais généraux
        
        // Profitabilité cible
        targetProfitMargin: 0.2        // 20% de marge nette cible
      };
      
      // Résultats calculés
      this.results = {
        customers: {},
        revenue: {},
        costs: {},
        headcount: {},
        profitability: {},
        metrics: {}
      };
    }
    
    /**
     * Modifie une hypothèse spécifique
     * @param {string} category - Catégorie de l'hypothèse
     * @param {string} key - Clé de l'hypothèse
     * @param {any} value - Nouvelle valeur
     */
    setAssumption(category, key, value) {
        if (category.includes('.')) {
          const [parentCategory, childCategory] = category.split('.');
          if (this.assumptions[parentCategory] && this.assumptions[parentCategory][childCategory]) {
            this.assumptions[parentCategory][childCategory][key] = value;
          }
        } else if (this.assumptions[category]) {
          if (key === null || key === undefined) {
            // Cas où on veut remplacer directement la valeur de la catégorie
            this.assumptions[category] = value;
          } else {
            // Cas où on veut modifier une propriété d'un objet
            this.assumptions[category][key] = value;
          }
        }
        return this;
      }
    
    /**
     * Calcule tous les indicateurs en partant du CA cible
     */
    calculateFromTargetRevenue() {
      // 1. Calcul du nombre de clients nécessaires
      this._calculateRequiredCustomers();
      
      // 2. Calcul des coûts d'acquisition et marketing
      this._calculateAcquisitionCosts();
      
      // 3. Calcul des coûts d'infrastructure et support
      this._calculateOperationalCosts();
      
      // 4. Calcul des besoins en personnel
      this._calculateHeadcount();
      
      // 5. Calcul des frais généraux
      this._calculateOverhead();
      
      // 6. Calcul de la profitabilité
      this._calculateProfitability();
      
      // 7. Calcul des métriques SaaS
      this._calculateSaasMetrics();
      
      // 8. Calcul des projections de croissance
      this._calculateGrowthProjection();
      
      return this.results;
    }
    
    /**
     * Calcule le nombre de clients requis pour atteindre le CA cible
     */
    _calculateRequiredCustomers() {
      // Calcul du revenu moyen par utilisateur (ARPU)
      const { averageRevenuePerUser, customerDistribution, annualBillingPercentage, annualBillingDiscount } = this.assumptions;
      
      let weightedMonthlyARPU = 0;
      
      // Calcul de l'ARPU pondéré par la distribution des clients
      for (const tier in averageRevenuePerUser) {
        weightedMonthlyARPU += averageRevenuePerUser[tier] * customerDistribution[tier];
      }
      
      // Ajustement pour les remises de facturation annuelle
      const effectiveMonthlyARPU = weightedMonthlyARPU * (
        (1 - annualBillingPercentage) + 
        annualBillingPercentage * (1 - annualBillingDiscount)
      );
      
      // Conversion en ARPU annuel
      const annualARPU = effectiveMonthlyARPU * 12;
      
      // Calcul du nombre total de clients nécessaires
      const requiredCustomers = Math.ceil(this.targetAnnualRevenue / annualARPU);
      
      // Répartition des clients par niveau
      const customersByTier = {};
      for (const tier in customerDistribution) {
        customersByTier[tier] = Math.round(requiredCustomers * customerDistribution[tier]);
      }
      
      // Stockage des résultats
      this.results.customers = {
        total: requiredCustomers,
        byTier: customersByTier,
        monthlyARPU: effectiveMonthlyARPU,
        annualARPU: annualARPU
      };
      
      return this.results.customers;
    }
    
    /**
     * Calcule les coûts d'acquisition et marketing nécessaires
     */
    _calculateAcquisitionCosts() {
      const { averageCAC, marketingBudgetPercentage, organicAcquisitionPercentage, paidAcquisitionPercentage } = this.assumptions;
      const { total: totalCustomers } = this.results.customers;
      
      // Calcul du budget marketing total
      const marketingBudget = this.targetAnnualRevenue * marketingBudgetPercentage;
      
      // Répartition des clients par canal d'acquisition
      const organicCustomers = Math.round(totalCustomers * organicAcquisitionPercentage);
      const paidCustomers = Math.round(totalCustomers * paidAcquisitionPercentage);
      
      // Calcul du CAC effectif (qui devrait être proche de l'hypothèse averageCAC)
      const effectiveCAC = paidCustomers > 0 ? marketingBudget / paidCustomers : 0;
      
      // Stockage des résultats
      this.results.costs.acquisition = {
        marketingBudget,
        organicCustomers,
        paidCustomers,
        effectiveCAC,
        percentageOfRevenue: marketingBudgetPercentage * 100
      };
      
      return this.results.costs.acquisition;
    }
    
    /**
     * Calcule les coûts opérationnels (infrastructure, support)
     */
    _calculateOperationalCosts() {
      const { infrastructureCostPerUser, supportCostPerUser } = this.assumptions;
      const { total: totalCustomers } = this.results.customers;
      
      // Calcul des coûts mensuels
      const monthlyInfrastructureCost = totalCustomers * infrastructureCostPerUser;
      const monthlySupportCost = totalCustomers * supportCostPerUser;
      
      // Conversion en coûts annuels
      const annualInfrastructureCost = monthlyInfrastructureCost * 12;
      const annualSupportCost = monthlySupportCost * 12;
      const totalOperationalCost = annualInfrastructureCost + annualSupportCost;
      
      // Stockage des résultats
      this.results.costs.operational = {
        monthly: {
          infrastructure: monthlyInfrastructureCost,
          support: monthlySupportCost,
          total: monthlyInfrastructureCost + monthlySupportCost
        },
        annual: {
          infrastructure: annualInfrastructureCost,
          support: annualSupportCost,
          total: totalOperationalCost
        },
        percentageOfRevenue: (totalOperationalCost / this.targetAnnualRevenue) * 100
      };
      
      return this.results.costs.operational;
    }
    
    /**
     * Calcule les besoins en personnel
     */
    _calculateHeadcount() {
      const { teams } = this.assumptions;
      const { total: totalCustomers } = this.results.customers;
      
      const headcount = {};
      let totalSalaryCost = 0;
      
      // Calcul du nombre d'employés nécessaires par équipe
      for (const team in teams) {
        const { averageSalary, clientsPerEmployee } = teams[team];
        const requiredEmployees = Math.ceil(totalCustomers / clientsPerEmployee);
        const teamSalaryCost = requiredEmployees * averageSalary;
        
        headcount[team] = {
          employees: requiredEmployees,
          salaryCost: teamSalaryCost
        };
        
        totalSalaryCost += teamSalaryCost;
      }
      
      // Calcul du total
      const totalEmployees = Object.values(headcount).reduce((sum, team) => sum + team.employees, 0);
      
      // Stockage des résultats
      this.results.headcount = {
        byTeam: headcount,
        total: totalEmployees,
        totalSalaryCost,
        percentageOfRevenue: (totalSalaryCost / this.targetAnnualRevenue) * 100
      };
      
      return this.results.headcount;
    }
    
    /**
     * Calcule les frais généraux
     */
    _calculateOverhead() {
      const { overheadPercentage } = this.assumptions;
      
      const overheadCost = this.targetAnnualRevenue * overheadPercentage;
      
      // Stockage des résultats
      this.results.costs.overhead = {
        annual: overheadCost,
        percentageOfRevenue: overheadPercentage * 100
      };
      
      return this.results.costs.overhead;
    }
    
    /**
     * Calcule la profitabilité
     */
    _calculateProfitability() {
      const totalCosts = 
        this.results.costs.acquisition.marketingBudget + 
        this.results.costs.operational.annual.total + 
        this.results.headcount.totalSalaryCost + 
        this.results.costs.overhead.annual;
      
      const grossProfit = this.targetAnnualRevenue - this.results.costs.operational.annual.total;
      const operatingProfit = this.targetAnnualRevenue - totalCosts;
      const profitMargin = operatingProfit / this.targetAnnualRevenue;
      
      // Stockage des résultats
      this.results.profitability = {
        revenue: this.targetAnnualRevenue,
        totalCosts,
        grossProfit,
        grossMargin: grossProfit / this.targetAnnualRevenue,
        operatingProfit,
        profitMargin,
        targetMarginDelta: profitMargin - this.assumptions.targetProfitMargin
      };
      
      return this.results.profitability;
    }
    
    /**
     * Calcule les métriques SaaS
     */
    _calculateSaasMetrics() {
      const { monthlyChurnRate, averageCAC } = this.assumptions;
      const { monthlyARPU } = this.results.customers;
      
      // Durée de vie moyenne d'un client en mois (1/churn)
      const averageCustomerLifetimeMonths = 1 / monthlyChurnRate;
      
      // LTV = ARPU * durée de vie moyenne
      const customerLTV = monthlyARPU * averageCustomerLifetimeMonths;
      
      // Ratio LTV/CAC
      const ltvCacRatio = customerLTV / averageCAC;
      
      // CAC Payback Period (en mois)
      const cacPaybackPeriod = averageCAC / monthlyARPU;
      
      // Rule of 40 (hypothèse de croissance à 30%)
      const growthRate = 0.3; // 30% de croissance annuelle hypothétique
      const ruleOf40Score = (growthRate + this.results.profitability.profitMargin) * 100;
      
      // Stockage des résultats
      this.results.metrics = {
        customerLTV,
        averageCAC,
        ltvCacRatio,
        cacPaybackPeriod,
        averageCustomerLifetimeMonths,
        churnRate: monthlyChurnRate * 100,
        annualChurnRate: (1 - Math.pow(1 - monthlyChurnRate, 12)) * 100,
        ruleOf40Score,
        ruleOf40Pass: ruleOf40Score >= 40
      };
      
      return this.results.metrics;
    }
    
/**
 * Calcule une projection de croissance sur 5 ans
 */
_calculateGrowthProjection() {
    const projectionYears = 5;
    const growthRates = [0.8, 0.5, 0.3, 0.25, 0.2]; // Taux de croissance annuelle (80%, 50%, 30%, 25%, 20%)
    const projection = [];
    
    let currentRevenue = this.targetAnnualRevenue;
    let currentCustomers = this.results.customers.total;
    
    projection.push({
      year: 1,
      revenue: currentRevenue,
      customers: currentCustomers,
      employees: this.results.headcount.total
    });
    
    for (let i = 0; i < projectionYears - 1; i++) {
      currentRevenue = currentRevenue * (1 + growthRates[i]);
      currentCustomers = Math.round(currentCustomers * (1 + growthRates[i]));
      
      // Calcul simple des employés basé sur le ratio actuel, sans créer de modèle récursif
      const estimatedEmployees = Math.round(currentCustomers / (this.results.customers.total / this.results.headcount.total));
      
      projection.push({
        year: i + 2,
        revenue: currentRevenue,
        customers: currentCustomers,
        employees: estimatedEmployees
      });
    }
    
    this.results.growthProjection = projection;
    return projection;
  }
    
    /**
     * Génère un rapport complet
     */
    generateReport() {
      return {
        summary: {
          targetAnnualRevenue: this.targetAnnualRevenue,
          requiredCustomers: this.results.customers.total,
          totalEmployees: this.results.headcount.total,
          profitMargin: this.results.profitability.profitMargin,
          ltvCacRatio: this.results.metrics.ltvCacRatio
        },
        customers: this.results.customers,
        costs: this.results.costs,
        headcount: this.results.headcount,
        profitability: this.results.profitability,
        metrics: this.results.metrics,
        growthProjection: this.results.growthProjection
      };
    }
    
    /**
     * Génère un tableau comparatif de scénarios
     * @param {Array} revenueScenarios - Liste des scénarios de CA à comparer
     */
    compareScenarios(revenueScenarios) {
      const scenarios = {};
      const originalTargetRevenue = this.targetAnnualRevenue;
      
      for (const scenarioRevenue of revenueScenarios) {
        this.targetAnnualRevenue = scenarioRevenue;
        this.calculateFromTargetRevenue();
        scenarios[`${scenarioRevenue}€`] = this.generateReport().summary;
      }
      
      // Restauration du CA initial
      this.targetAnnualRevenue = originalTargetRevenue;
      this.calculateFromTargetRevenue();
      
      return scenarios;
    }
  }
  
  export default SaasFinancialModel;