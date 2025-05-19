/**
 * SaasFinancialDashboard.js
 * Dashboard principal pour le modèle financier SaaS
 */
import React, { useState, useEffect } from 'react';
import SaasFinancialModel from './models/SaasFinancialModel';
import SummaryTab from './components/SummaryTab';
import CustomersTab from './components/CustomersTab';
import CostsTab from './components/CostsTab';
import HeadcountTab from './components/HeadcountTab';
import MetricsTab from './components/MetricsTab';
import GrowthTab from './components/GrowthTab';
import AssumptionsTab from './components/AssumptionsTab';
import PipelineCommercialTab from './components/PipelineCommercialTab';
import { generateRecommendations } from './utils/utils';

const SaasFinancialDashboard = () => {
  // État pour le CA cible et les hypothèses
  const [targetRevenue, setTargetRevenue] = useState(1000000);
  const [results, setResults] = useState({
    customers: {
      total: 500,
      byTier: {
        basic: 300,
        pro: 150,
        enterprise: 50
      },
      monthlyARPU: 167,
      annualARPU: 2000
    },
    costs: {
      acquisition: {
        marketingBudget: 250000,
        organicCustomers: 150,
        paidCustomers: 350,
        effectiveCAC: 714,
        percentageOfRevenue: 25
      },
      operational: {
        monthly: { 
          infrastructure: 1000, 
          support: 1500, 
          total: 2500 
        },
        annual: { 
          infrastructure: 12000, 
          support: 18000, 
          total: 30000 
        },
        percentageOfRevenue: 3
      },
      overhead: {
        annual: 150000,
        percentageOfRevenue: 15
      }
    },
    headcount: {
      byTeam: {
        development: {
          employees: 2,
          salaryCost: 130000
        },
        marketing: {
          employees: 2,
          salaryCost: 110000
        },
        sales: {
          employees: 3,
          salaryCost: 180000
        },
        support: {
          employees: 4,
          salaryCost: 180000
        },
        management: {
          employees: 1,
          salaryCost: 85000
        }
      },
      total: 12,
      totalSalaryCost: 685000,
      percentageOfRevenue: 68.5
    },
    profitability: {
      revenue: 1000000,
      totalCosts: 850000,
      grossProfit: 970000,
      grossMargin: 0.97,
      operatingProfit: 150000,
      profitMargin: 0.15,
      targetMarginDelta: -0.05
    },
    metrics: {
      customerLTV: 3333,
      averageCAC: 714,
      ltvCacRatio: 4.67,
      cacPaybackPeriod: 4.3,
      averageCustomerLifetimeMonths: 33.3,
      churnRate: 3,
      annualChurnRate: 30.6,
      ruleOf40Score: 45,
      ruleOf40Pass: true
    },
    growthProjection: [
      {
        year: 1,
        revenue: 1000000,
        customers: 500,
        employees: 12
      },
      {
        year: 2,
        revenue: 1800000,
        customers: 900,
        employees: 18
      },
      {
        year: 3,
        revenue: 2700000,
        customers: 1350,
        employees: 24
      },
      {
        year: 4,
        revenue: 3510000,
        customers: 1755,
        employees: 29
      },
      {
        year: 5,
        revenue: 4387500,
        customers: 2194,
        employees: 35
      }
    ],
    assumptions: {
      infrastructureCostPerUser: 2,
      supportCostPerUser: 3,
      overheadPercentage: 0.15,
      targetProfitMargin: 0.2,
      monthlyUpsellRate: 0.02,
      netRevenueRetention: 1.05,
      teams: {
        development: {
          clientsPerEmployee: 250,
          averageSalary: 65000
        },
        marketing: {
          clientsPerEmployee: 400,
          averageSalary: 55000
        },
        sales: {
          clientsPerEmployee: 200,
          averageSalary: 60000
        },
        support: {
          clientsPerEmployee: 150,
          averageSalary: 45000
        },
        management: {
          clientsPerEmployee: 500,
          averageSalary: 85000
        }
      }
    }
  });
  const [activeTab, setActiveTab] = useState('summary');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État pour les hypothèses modifiables
  const [assumptions, setAssumptions] = useState({
    pricing: {
      basic: 20,
      pro: 50,
      enterprise: 200
    },
    distribution: {
      basic: 60,
      pro: 30,
      enterprise: 10
    },
    annualBilling: 40,
    annualDiscount: 15,
    churnRate: 3,
    marketingBudget: 25,
    organicAcquisition: 30,
    salesEfficiency: {
      development: 250,
      marketing: 400,
      sales: 200,
      support: 150,
      management: 500
    },
    salaries: {
      development: 65000,
      marketing: 55000,
      sales: 60000,
      support: 45000,
      management: 85000
    }
  });
  
  // Calculer le modèle lorsque le CA cible ou les hypothèses changent
  useEffect(() => {
    calculateModel();
  }, [targetRevenue, assumptions]);
  
  // Fonction pour calculer le modèle
  const calculateModel = () => {
    setLoading(true);
    
    // Utiliser setTimeout pour rendre l'interface réactive
    setTimeout(() => {
      try {
        const model = new SaasFinancialModel(targetRevenue);
        
        // Mettre à jour les hypothèses du modèle
        model.setAssumption('averageRevenuePerUser', 'basic', assumptions.pricing.basic);
        model.setAssumption('averageRevenuePerUser', 'pro', assumptions.pricing.pro);
        model.setAssumption('averageRevenuePerUser', 'enterprise', assumptions.pricing.enterprise);
        
        model.setAssumption('customerDistribution', 'basic', assumptions.distribution.basic / 100);
        model.setAssumption('customerDistribution', 'pro', assumptions.distribution.pro / 100);
        model.setAssumption('customerDistribution', 'enterprise', assumptions.distribution.enterprise / 100);
        
        model.setAssumption('annualBillingPercentage', null, assumptions.annualBilling / 100);
        model.setAssumption('annualBillingDiscount', null, assumptions.annualDiscount / 100);
        model.setAssumption('monthlyChurnRate', null, assumptions.churnRate / 100);
        model.setAssumption('marketingBudgetPercentage', null, assumptions.marketingBudget / 100);
        model.setAssumption('organicAcquisitionPercentage', null, assumptions.organicAcquisition / 100);
        model.setAssumption('paidAcquisitionPercentage', null, (100 - assumptions.organicAcquisition) / 100);
        
        // Mise à jour des valeurs d'efficacité de l'équipe
        for (const team in assumptions.salesEfficiency) {
          model.setAssumption(`teams.${team}`, 'clientsPerEmployee', assumptions.salesEfficiency[team]);
        }
        
        // Mise à jour des salaires
        for (const team in assumptions.salaries) {
          model.setAssumption(`teams.${team}`, 'averageSalary', assumptions.salaries[team]);
        }
        
        // Calculer le modèle
        model.calculateFromTargetRevenue();
        
        // Générer le rapport
        const modelReport = model.generateReport();
        
        // Générer des recommandations
        const newRecommendations = generateRecommendations(modelReport);
        
        // Fusionner les nouveaux résultats avec les anciens pour conserver toute la structure
        setResults(prevResults => {
          // Fusion profonde des objets
          return {
            ...prevResults,                // Garder toutes les propriétés existantes
            ...modelReport,                // Ajouter/remplacer les propriétés calculées
            assumptions: {
              ...prevResults.assumptions,  // Garder les propriétés d'hypothèses existantes
              ...modelReport.assumptions   // Ajouter/remplacer les nouvelles hypothèses calculées
            },
            customers: {
              ...prevResults.customers,    // Conserver toutes les propriétés clients existantes
              ...modelReport.customers     // Ajouter/remplacer les nouvelles propriétés clients
            },
            metrics: {
              ...prevResults.metrics,      // Conserver les métriques existantes
              ...modelReport.metrics       // Ajouter/remplacer les nouvelles métriques
            }
          };
        });
        setRecommendations(newRecommendations);
      } catch (error) {
        console.error("Erreur lors du calcul du modèle:", error);
        // En cas d'erreur, on évite de mettre à jour les résultats 
        // pour ne pas perdre les valeurs précédentes
      } finally {
        setLoading(false);
      }
    }, 100);
  };
  
  // Fonction pour mettre à jour les hypothèses
  const handleAssumptionChange = (category, key, value) => {
    setAssumptions(prev => {
      const newAssumptions = {...prev};
      if (key) {
        newAssumptions[category] = {...newAssumptions[category], [key]: value};
      } else {
        newAssumptions[category] = value;
      }
      return newAssumptions;
    });
  };
  
  // Afficher un spinner de chargement pendant le calcul
  if (loading && !results) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Modèle Financier SaaS</h1>
        
        {/* Paramètres principaux */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                CA annuel cible (€)
              </label>
              <input
                type="number"
                value={targetRevenue}
                onChange={(e) => setTargetRevenue(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                min="100000"
                step="100000"
              />
            </div>
            <div className="flex-1">
              <button
                onClick={calculateModel}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
              >
                Recalculer le modèle
              </button>
            </div>
          </div>
        </div>
        
        {/* Recommandations */}
        {recommendations && recommendations.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-2 text-yellow-800">Recommandations d'optimisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                  <h3 className="text-md font-medium mb-1 text-gray-800">{rec.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <ul className="text-xs text-gray-700 list-disc pl-4">
                    {rec.actions && rec.actions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Onglets */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'summary' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('summary')}
            >
              Synthèse
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'customers' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('customers')}
            >
              Clients
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'costs' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('costs')}
            >
              Coûts
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'headcount' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('headcount')}
            >
              Effectifs
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'metrics' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('metrics')}
            >
              Métriques SaaS
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'growth' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('growth')}
            >
              Projection
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'assumptions' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('assumptions')}
            >
              Hypothèses
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'pipeline' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('pipeline')}
            >
              Pipeline commercial
            </button>
          </div>
          
          <div className="p-4 relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {/* Contenu des onglets */}
            {activeTab === 'summary' && <SummaryTab results={results} />}
            {activeTab === 'customers' && <CustomersTab results={results} />}
            {activeTab === 'costs' && <CostsTab results={results} />}
            {activeTab === 'headcount' && <HeadcountTab results={results} />}
            {activeTab === 'metrics' && <MetricsTab results={results} />}
            {activeTab === 'growth' && <GrowthTab results={results} />}
            {activeTab === 'assumptions' && (
              <AssumptionsTab 
                results={results} 
                assumptions={assumptions} 
                onAssumptionChange={handleAssumptionChange} 
              />
            )}
            {activeTab === 'pipeline' && <PipelineCommercialTab />}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-6 text-center">
          Ce modèle financier est fourni à titre indicatif uniquement. Les résultats réels peuvent varier en fonction de nombreux facteurs propres à votre entreprise.
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-center space-x-4 mb-6">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Exporter en Excel
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Imprimer le rapport
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Sauvegarder les hypothèses
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaasFinancialDashboard;