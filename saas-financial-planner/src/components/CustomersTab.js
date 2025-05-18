import React from 'react';
import {
  CostCard,
  ChartBlock,
  PieCostChart,
  BarCostChart,
  SimpleTable
} from '../components/StandardUI';

import { formatNumber, formatCurrency, formatPercent, CHART_COLORS } from '../utils/utils';

const CustomersTab = ({ results }) => {
  if (!results) return <div>Chargement des données...</div>;

  const customersByTier = results.customers?.byTier || { basic: 0, pro: 0, enterprise: 0 };
  const averageRevenuePerUser = results.assumptions?.averageRevenuePerUser || {};

  const safeResults = {
    customers: {
      total: results.customers?.total || 0,
      byTier: customersByTier,
      monthlyARPU: results.customers?.monthlyARPU || 0,
      annualARPU: results.customers?.annualARPU || 0
    },
    assumptions: {
      averageRevenuePerUser: averageRevenuePerUser,
      monthlyUpsellRate: results.assumptions?.monthlyUpsellRate || 0,
      monthlyChurnRate: results.assumptions?.monthlyChurnRate || 0,
      netRevenueRetention: results.assumptions?.netRevenueRetention || 1
    },
    metrics: {
      customerLTV: results.metrics?.customerLTV || 0,
      averageCAC: results.metrics?.averageCAC || 0,
      ltvCacRatio: results.metrics?.ltvCacRatio || 0,
      cacPaybackPeriod: results.metrics?.cacPaybackPeriod || 0,
      averageCustomerLifetimeMonths: results.metrics?.averageCustomerLifetimeMonths || 0,
      churnRate: results.metrics?.churnRate || 0,
      annualChurnRate: results.metrics?.annualChurnRate || 0
    },
    costs: {
      acquisition: {
        marketingBudget: results.costs?.acquisition?.marketingBudget || 0,
        organicCustomers: results.costs?.acquisition?.organicCustomers || 0,
        paidCustomers: results.costs?.acquisition?.paidCustomers || 0,
        effectiveCAC: results.costs?.acquisition?.effectiveCAC || 0,
        percentageOfRevenue: results.costs?.acquisition?.percentageOfRevenue || 0
      }
    },
    profitability: {
      revenue: results.profitability?.revenue || 1
    }
  };

  const customerDistributionData = Object.entries(safeResults.customers.byTier).map(([tier, count]) => ({
    name: tier.charAt(0).toUpperCase() + tier.slice(1),
    value: count
  }));

  const customerRevenueData = Object.entries(safeResults.customers.byTier).map(([tier, count]) => {
    const arpu = safeResults.assumptions.averageRevenuePerUser[tier] || 0;
    const monthlyRevenue = count * arpu;
    return {
      name: tier.charAt(0).toUpperCase() + tier.slice(1),
      customers: count,
      revenue: monthlyRevenue * 12,
      arpu: arpu
    };
  });

  const tableHeaders = [
    'Niveau', 'Nombre de clients', 'Prix mensuel',
    'Revenu mensuel', 'Revenu annuel', '% du total'
  ];

  const tableRows = customerRevenueData.map((tier, index) => (
    <tr key={index}>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{tier.name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{formatNumber(tier.customers)}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(tier.arpu, 2)}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(tier.revenue / 12)}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(tier.revenue)}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatPercent(tier.revenue / safeResults.profitability.revenue)}
      </td>
    </tr>
  ));

  const tableTotal = (
    <tr className="bg-gray-50">
      <td className="px-6 py-4 font-medium text-sm text-gray-900">Total</td>
      <td className="px-6 py-4 font-medium text-sm text-gray-900">{formatNumber(safeResults.customers.total)}</td>
      <td className="px-6 py-4 font-medium text-sm text-gray-900">{formatCurrency(safeResults.customers.monthlyARPU, 2)}</td>
      <td className="px-6 py-4 font-medium text-sm text-gray-900">{formatCurrency(safeResults.profitability.revenue / 12)}</td>
      <td className="px-6 py-4 font-medium text-sm text-gray-900">{formatCurrency(safeResults.profitability.revenue)}</td>
      <td className="px-6 py-4 font-medium text-sm text-gray-900">100%</td>
    </tr>
  );

  const COLORS = CHART_COLORS.primary;

  return (
    <div>
      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CostCard title="Clients totaux" value={formatNumber(safeResults.customers.total)} className="bg-blue-50" />
        <CostCard title="ARPU mensuel" value={formatCurrency(safeResults.customers.monthlyARPU, 2)} className="bg-green-50" />
        <CostCard title="LTV client" value={formatCurrency(safeResults.metrics.customerLTV)} className="bg-yellow-50" />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartBlock title="Répartition des clients par niveau">
          <PieCostChart data={customerDistributionData} />
        </ChartBlock>
        <ChartBlock title="Revenus par niveau d'abonnement">
          <BarCostChart data={customerRevenueData.map(d => ({ ...d, value: d.revenue }))} />
        </ChartBlock>
      </div>

      {/* Tableau */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">Détails des clients par niveau</h3>
        <div className="overflow-x-auto">
          <SimpleTable headers={tableHeaders} rows={tableRows} total={tableTotal} />
        </div>
      </div>

      {/* Sections d’analyse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Métriques de rétention</h3>
          <div className="grid grid-cols-2 gap-4">
            <CostCard title="Taux de churn mensuel" value={formatPercent(safeResults.metrics.churnRate / 100)} />
            <CostCard title="Taux de churn annuel" value={formatPercent(safeResults.metrics.annualChurnRate / 100)} />
            <CostCard title="Durée de vie moyenne (mois)" value={formatNumber(safeResults.metrics.averageCustomerLifetimeMonths, 1)} />
            <CostCard title="Taux d'upsell mensuel" value={formatPercent(safeResults.assumptions.monthlyUpsellRate)} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Acquisition clients</h3>
          <div className="grid grid-cols-2 gap-4">
            <CostCard title="CAC moyen" value={formatCurrency(safeResults.metrics.averageCAC)} />
            <CostCard title="Durée de remboursement CAC" value={`${formatNumber(safeResults.metrics.cacPaybackPeriod, 1)} mois`} />
            <CostCard title="Acquisition organique" value={`${formatNumber(safeResults.costs.acquisition.organicCustomers)} clients`} />
            <CostCard title="Acquisition payante" value={`${formatNumber(safeResults.costs.acquisition.paidCustomers)} clients`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersTab;
