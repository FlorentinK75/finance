import React from 'react';
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  evaluateFinancialHealth
} from '../utils/utils';

import { MetricBlock } from '../components/StandardUI';

const MetricsTab = ({ results }) => {
  const healthEvaluation = evaluateFinancialHealth(results.metrics);

  const getStatusClass = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'bon': return 'bg-blue-100 text-blue-800';
      case 'critique': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Acquisition + Rétention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Acquisition */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Métriques d'acquisition</h3>
          <MetricBlock
            title="CAC (Coût d'Acquisition Client)"
            value={formatCurrency(results.metrics.averageCAC)}
            subtitle="Coût moyen pour acquérir un nouveau client payant"
          />
          <MetricBlock
            title="CAC Payback Period"
            value={`${formatNumber(results.metrics.cacPaybackPeriod, 1)} mois`}
            subtitle="Temps nécessaire pour rentabiliser l'acquisition"
            statusClass={getStatusClass(healthEvaluation.metrics.cacPaybackPeriod.status)}
            statusLabel={healthEvaluation.metrics.cacPaybackPeriod.message}
          />
          <MetricBlock
            title="Ratio Organique/Payant"
            value={`${formatNumber(results.costs.acquisition.organicCustomers)} / ${formatNumber(results.costs.acquisition.paidCustomers)}`}
            subtitle="Clients acquis organiquement vs canaux payants"
          />
        </div>

        {/* Rétention */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Métriques de rétention</h3>
          <MetricBlock
            title="Taux de churn mensuel"
            value={formatPercent(results.metrics.churnRate / 100)}
            subtitle="Pourcentage de clients perdus chaque mois"
            statusClass={getStatusClass(healthEvaluation.metrics.churnRate.status)}
            statusLabel={healthEvaluation.metrics.churnRate.message}
          />
          <MetricBlock
            title="Durée de vie client (LT)"
            value={`${formatNumber(results.metrics.averageCustomerLifetimeMonths, 1)} mois`}
            subtitle="Durée moyenne d'abonnement client"
          />
          <MetricBlock
            title="Net Revenue Retention (NRR)"
            value={formatPercent(results.assumptions.netRevenueRetention)}
            subtitle="Croissance au sein de la base client existante"
          />
        </div>
      </div>

      {/* Économiques + Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Éco */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Métriques Économiques</h3>
          <MetricBlock
            title="Valeur Vie Client (LTV)"
            value={formatCurrency(results.metrics.customerLTV)}
            subtitle="Valeur totale générée par client"
          />
          <MetricBlock
            title="Ratio LTV/CAC"
            value={`${results.metrics.ltvCacRatio.toFixed(1)}x`}
            subtitle="Rapport entre LTV et CAC"
            statusClass={getStatusClass(healthEvaluation.metrics.ltvCacRatio.status)}
            statusLabel={healthEvaluation.metrics.ltvCacRatio.message}
          />
          <MetricBlock
            title="ARPU Mensuel"
            value={formatCurrency(results.customers.monthlyARPU, 2)}
            subtitle="Revenu mensuel moyen par utilisateur"
          />
        </div>

        {/* Indicateurs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Indicateurs de Performance Générale</h3>
          <MetricBlock
            title="Rule of 40"
            value={results.metrics.ruleOf40Score.toFixed(1)}
            subtitle="Croissance + Marge (objectif ≥ 40)"
            statusClass={getStatusClass(healthEvaluation.metrics.ruleOf40.status)}
            statusLabel={healthEvaluation.metrics.ruleOf40.message}
          />
          <MetricBlock
            title="Marge opérationnelle"
            value={formatPercent(results.profitability.profitMargin)}
            subtitle="% du CA converti en profit"
          />
          <MetricBlock
            title="Revenu par employé"
            value={formatCurrency(results.profitability.revenue / results.headcount.total)}
            subtitle="Efficacité globale"
          />
        </div>
      </div>

      {/* Santé globale */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Santé financière globale</h3>
          <div className={`px-3 py-1.5 rounded-full ${getStatusClass(healthEvaluation.globalStatus)}`}>
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
            />
          </div>
          <p className="text-right text-sm text-gray-600 mt-1">
            {(healthEvaluation.globalScore * 100).toFixed(0)}%
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Évaluation détaillée</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(healthEvaluation.metrics).map(([key, metric]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {{
                      ltvCacRatio: 'LTV/CAC',
                      cacPaybackPeriod: 'CAC Payback',
                      churnRate: 'Churn',
                      ruleOf40: 'Rule of 40'
                    }[key] || key}
                  </p>
                  <p className="text-xs text-gray-500">{metric.message}</p>
                </div>
                <div className={`px-2 py-1 rounded ${getStatusClass(metric.status)}`}>
                  {{
                    ltvCacRatio: `${metric.value.toFixed(1)}x`,
                    cacPaybackPeriod: `${metric.value.toFixed(1)} mois`,
                    churnRate: formatPercent(metric.value),
                    ruleOf40: metric.value.toFixed(1)
                  }[key] || metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Références SaaS */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Références sectorielles SaaS</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Métrique', 'Excellent', 'Bon', 'À améliorer', 'Votre résultat'].map((h, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  label: 'LTV/CAC',
                  excellent: '≥ 3x',
                  bon: '2–3x',
                  critique: '< 2x',
                  value: `${results.metrics.ltvCacRatio.toFixed(1)}x`,
                  score: results.metrics.ltvCacRatio,
                  thresholds: [3, 2]
                },
                {
                  label: 'CAC Payback',
                  excellent: '≤ 12 mois',
                  bon: '12–18 mois',
                  critique: '> 18 mois',
                  value: `${results.metrics.cacPaybackPeriod.toFixed(1)} mois`,
                  score: results.metrics.cacPaybackPeriod,
                  thresholds: [12, 18],
                  reverse: true
                },
                {
                  label: 'Churn mensuel',
                  excellent: '≤ 2%',
                  bon: '2–5%',
                  critique: '> 5%',
                  value: formatPercent(results.metrics.churnRate / 100),
                  score: results.metrics.churnRate,
                  thresholds: [2, 5],
                  reverse: true
                },
                {
                  label: 'Rule of 40',
                  excellent: '≥ 40',
                  bon: '30–40',
                  critique: '< 30',
                  value: results.metrics.ruleOf40Score.toFixed(1),
                  score: results.metrics.ruleOf40Score,
                  thresholds: [40, 30]
                },
                {
                  label: 'NRR',
                  excellent: '≥ 110%',
                  bon: '100–110%',
                  critique: '< 100%',
                  value: formatPercent(results.assumptions.netRevenueRetention),
                  score: results.assumptions.netRevenueRetention,
                  thresholds: [1.1, 1.0]
                }
              ].map(({ label, excellent, bon, critique, value, score, thresholds, reverse }, i) => {
                const color = reverse
                  ? score <= thresholds[0]
                    ? 'text-green-600'
                    : score <= thresholds[1]
                      ? 'text-blue-600'
                      : 'text-red-600'
                  : score >= thresholds[0]
                    ? 'text-green-600'
                    : score >= thresholds[1]
                      ? 'text-blue-600'
                      : 'text-red-600';
                return (
                  <tr key={i}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{label}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{excellent}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{bon}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{critique}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${color}`}>{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsTab;
