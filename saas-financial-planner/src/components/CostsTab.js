import React from 'react';
import { 
  PieCostChart, BarCostChart, CostTable 
} from '../components/StandardUI';
import { InfoGridSection, ChartBlock } from '../components/StandardUI';

import { formatCurrency, formatPercent, formatNumber } from '../utils/utils';

const CostsTab = ({ results }) => {
  const costBreakdownData = [
    { name: 'Marketing', value: results.costs.acquisition.marketingBudget },
    { name: 'Infrastructure', value: results.costs.operational.annual.infrastructure },
    { name: 'Support', value: results.costs.operational.annual.support },
    { name: 'Salaires', value: results.headcount.totalSalaryCost },
    { name: 'Frais généraux', value: results.costs.overhead.annual }
  ];

  const costPercentageData = costBreakdownData.map(item => ({
    ...item,
    percentage: item.value / results.profitability.totalCosts
  }));

  const topCards = [
    {
      title: 'Coûts totaux',
      value: formatCurrency(results.profitability.totalCosts)
    },
    {
      title: 'Marge brute',
      value: formatCurrency(results.profitability.grossProfit),
      subtitle: formatPercent(results.profitability.grossMargin)
    },
    {
      title: 'Ratio Coûts/CA',
      value: formatPercent(results.profitability.totalCosts / results.profitability.revenue)
    }
  ];

  const acquisitionItems = [
    {
      title: 'Budget marketing',
      value: formatCurrency(results.costs.acquisition.marketingBudget)
    },
    {
      title: '% du CA',
      value: formatPercent(results.costs.acquisition.marketingBudget / results.profitability.revenue)
    },
    {
      title: 'CAC',
      value: formatCurrency(results.costs.acquisition.effectiveCAC)
    },
    {
      title: 'Clients payants acquis',
      value: formatNumber(results.costs.acquisition.paidCustomers)
    }
  ];

  const operationalItems = [
    {
      title: 'Coûts d\'infrastructure',
      value: formatCurrency(results.costs.operational.annual.infrastructure)
    },
    {
      title: 'Coûts de support',
      value: formatCurrency(results.costs.operational.annual.support)
    },
    {
      title: 'Coût par client/mois',
      value: formatCurrency(results.costs.operational.monthly.total / results.customers.total, 2)
    },
    {
      title: '% du total des coûts',
      value: formatPercent(results.costs.operational.annual.total / results.profitability.totalCosts)
    }
  ];

  return (
    <div>
      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {topCards.map((item, idx) => (
          <InfoGridSection key={idx} items={[item]} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartBlock title="Répartition des coûts">
          <PieCostChart data={costBreakdownData} />
        </ChartBlock>
        <ChartBlock title="Coûts par catégorie">
          <BarCostChart data={costPercentageData} />
        </ChartBlock>
      </div>

      {/* Tableau */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">Détails des coûts par catégorie</h3>
        <div className="overflow-x-auto">
          <CostTable 
            data={costPercentageData}
            totalCosts={results.profitability.totalCosts}
            revenue={results.profitability.revenue}
            customers={results.customers.total}
          />
        </div>
      </div>

      {/* Sections spécifiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoGridSection title="Coûts d'acquisition" items={acquisitionItems} />
        <InfoGridSection title="Coûts opérationnels" items={operationalItems} />
      </div>
    </div>
  );
};

export default CostsTab;
