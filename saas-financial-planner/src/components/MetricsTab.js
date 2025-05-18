/**
 * MetricsTab.js
 * Onglet métriques SaaS du tableau de bord
 */
import React from 'react';
import { evaluateFinancialHealth, formatNumber, formatCurrency, formatPercent } from '../utils/utils';

const MetricsTab = ({ results }) => {
  // Évaluation de la santé financière
  const healthEvaluation = evaluateFinancialHealth(results.metrics);
  
  // Classe CSS pour l'état de santé
  const getStatusClass = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'bon':
        return 'bg-blue-100 text-blue-800';
      case 'critique':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Métriques d'acquisition</h3>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">CAC (Coût d'Acquisition Client)</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.metrics.averageCAC)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Coût moyen pour acquérir un nouveau client payant
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">CAC Payback Period</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(results.metrics.cacPaybackPeriod, 1)} mois</p>
              <p className="text-sm text-gray-600 mt-1">
                Temps nécessaire pour rentabiliser l'acquisition d'un client
              </p>
              <div className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getStatusClass(healthEvaluation.metrics.cacPaybackPeriod.status)}`}>
                {healthEvaluation.metrics.cacPaybackPeriod.message}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Ratio Organique/Payant</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">
                {formatNumber(results.costs.acquisition.organicCustomers)} / {formatNumber(results.costs.acquisition.paidCustomers)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Proportion de clients acquis organiquement vs par canaux payants
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Métriques de rétention</h3>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Taux de churn mensuel</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{formatPercent(results.metrics.churnRate/100)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Pourcentage de clients perdus chaque mois
              </p>
              <div className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getStatusClass(healthEvaluation.metrics.churnRate.status)}`}>
                {healthEvaluation.metrics.churnRate.message}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Durée de vie client (LT)</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(results.metrics.averageCustomerLifetimeMonths, 1)} mois</p>
              <p className="text-sm text-gray-600 mt-1">
                Durée moyenne pendant laquelle un client reste abonné
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Net Revenue Retention (NRR)</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{formatPercent(results.assumptions.netRevenueRetention)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Croissance des revenus au sein de la base clients existante
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Métriques Économiques</h3>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Valeur Vie Client (LTV)</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.metrics.customerLTV)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Valeur totale générée par un client sur toute sa durée de vie
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Ratio LTV/CAC</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{results.metrics.ltvCacRatio.toFixed(1)}x</p>
              <p className="text-sm text-gray-600 mt-1">
                Rapport entre la valeur vie client et le coût d'acquisition
              </p>
              <div className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getStatusClass(healthEvaluation.metrics.ltvCacRatio.status)}`}>
                {healthEvaluation.metrics.ltvCacRatio.message}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">ARPU Mensuel</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.customers.monthlyARPU, 2)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Revenu moyen par utilisateur et par mois
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Indicateurs de Performance Générale</h3>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Rule of 40</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{results.metrics.ruleOf40Score.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Somme du taux de croissance et de la marge de profit (idéalement ≥ 40)
              </p>
              <div className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getStatusClass(healthEvaluation.metrics.ruleOf40.status)}`}>
                {healthEvaluation.metrics.ruleOf40.message}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Marge opérationnelle</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{formatPercent(results.profitability.profitMargin)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Pourcentage du CA qui se transforme en profit opérationnel
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Revenu par employé</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.profitability.revenue / results.headcount.total)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Efficacité globale de l'entreprise
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Santé financière globale</h3>
          <div className={`px-3 py-1.5 rounded-full ${
            healthEvaluation.globalStatus === 'excellent' ? 'bg-green-100 text-green-800' :
            healthEvaluation.globalStatus === 'bon' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {healthEvaluation.globalStatus.charAt(0).toUpperCase() + healthEvaluation.globalStatus.slice(1)}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Score global</h4>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${
                healthEvaluation.globalScore >= 0.8 ? 'bg-green-500' :
                healthEvaluation.globalScore >= 0.5 ? 'bg-blue-500' :
                'bg-red-500'
              }`}
              style={{ width: `${healthEvaluation.globalScore * 100}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-600 mt-1">{(healthEvaluation.globalScore * 100).toFixed(0)}%</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Évaluation détaillée</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(healthEvaluation.metrics).map(([key, metric]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {key === 'ltvCacRatio' ? 'LTV/CAC' :
                     key === 'cacPaybackPeriod' ? 'CAC Payback' :
                     key === 'churnRate' ? 'Churn' :
                     key === 'ruleOf40' ? 'Rule of 40' : key}
                  </p>
                  <p className="text-xs text-gray-500">{metric.message}</p>
                </div>
                <div className={`px-2 py-1 rounded ${getStatusClass(metric.status)}`}>
                  {key === 'ltvCacRatio' ? `${metric.value.toFixed(1)}x` :
                   key === 'cacPaybackPeriod' ? `${metric.value.toFixed(1)} mois` :
                   key === 'churnRate' ? formatPercent(metric.value) :
                   key === 'ruleOf40' ? metric.value.toFixed(1) : metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Références sectorielles SaaS</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Métrique</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Excellent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">À améliorer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votre résultat</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">LTV/CAC</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">≥ 3x</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2-3x</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">&lt; 2x</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  results.metrics.ltvCacRatio >= 3 ? 'text-green-600' :
                  results.metrics.ltvCacRatio >= 2 ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  {results.metrics.ltvCacRatio.toFixed(1)}x
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CAC Payback</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">≤ 12 mois</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12-18 mois</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">&gt; 18 mois</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  results.metrics.cacPaybackPeriod <= 12 ? 'text-green-600' :
                  results.metrics.cacPaybackPeriod <= 18 ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  {results.metrics.cacPaybackPeriod.toFixed(1)} mois
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Churn mensuel</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">≤ 2%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2-5%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">&gt; 5%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  results.metrics.churnRate <= 2 ? 'text-green-600' :
                  results.metrics.churnRate <= 5 ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  {formatPercent(results.metrics.churnRate/100)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rule of 40</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">≥ 40</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30-40</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">&lt; 30</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  results.metrics.ruleOf40Score >= 40 ? 'text-green-600' :
                  results.metrics.ruleOf40Score >= 30 ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  {results.metrics.ruleOf40Score.toFixed(1)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">NRR</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">≥ 110%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100-110%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">&lt; 100%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  results.assumptions.netRevenueRetention >= 1.1 ? 'text-green-600' :
                  results.assumptions.netRevenueRetention >= 1 ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  {formatPercent(results.assumptions.netRevenueRetention)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsTab;