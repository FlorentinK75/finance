import React from 'react';
import {
  PieCostChart,
  ChartBlock,
  CostCard,
  StatGrid
} from '../components/StandardUI';

import {
  formatCurrency,
  formatPercent,
  formatNumber,
  CHART_COLORS
} from '../utils/utils';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const SummaryTab = ({ results }) => {
  const costBreakdownData = [
    { name: 'Marketing', value: results.costs.acquisition.marketingBudget },
    { name: 'Infrastructure', value: results.costs.operational.annual.infrastructure },
    { name: 'Support', value: results.costs.operational.annual.support },
    { name: 'Salaires', value: results.headcount.totalSalaryCost },
    { name: 'Frais généraux', value: results.costs.overhead.annual }
  ];

  const topSummaryCards = [
    {
      title: "Chiffre d'affaires",
      value: formatCurrency(results.profitability.revenue),
      className: "bg-blue-50"
    },
    {
      title: "Résultat d'exploitation",
      value: formatCurrency(results.profitability.operatingProfit),
      subtitle: formatPercent(results.profitability.profitMargin),
      className: "bg-green-50"
    },
    {
      title: 'LTV/CAC',
      value: `${results.metrics.ltvCacRatio.toFixed(1)}x`,
      subtitle: results.metrics.ltvCacRatio >= 3 ? 'Excellent' : 'À améliorer',
      className: results.metrics.ltvCacRatio >= 3 ? 'bg-purple-50 text-green-500' : 'bg-purple-50 text-yellow-500'
    }
  ];

  const keyStats = [
    { title: 'Clients totaux', value: formatNumber(results.customers.total) },
    { title: 'ARPU mensuel', value: formatCurrency(results.customers.monthlyARPU, 2) },
    { title: 'Effectif total', value: formatNumber(results.headcount.total) },
    { title: "Coût d'acquisition", value: formatCurrency(results.metrics.averageCAC) },
    { title: 'Churn mensuel', value: formatPercent(results.metrics.churnRate / 100) },
    { title: 'Rule of 40', value: results.metrics.ruleOf40Score.toFixed(1) }
  ];

  return (
    <div>
      {/* Cartes résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {topSummaryCards.map((card, idx) => (
          <CostCard
            key={idx}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            className={card.className}
          />
        ))}
      </div>

      {/* Graphiques & Chiffres clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartBlock title="Répartition des coûts">
          <PieCostChart data={costBreakdownData} />
        </ChartBlock>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Chiffres clés</h3>
          <StatGrid items={keyStats} />
        </div>
      </div>

      {/* Courbe de croissance */}
      <ChartBlock title="Projection de croissance">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={results.growthProjection}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) =>
                name === 'revenue' ? formatCurrency(value) : formatNumber(value)
              }
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="CA" stroke="#8884d8" />
            <Line yAxisId="right" type="monotone" dataKey="customers" name="Clients" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </ChartBlock>
    </div>
  );
};

export default SummaryTab;
