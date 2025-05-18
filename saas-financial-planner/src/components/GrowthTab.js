import React from 'react';
import {
  CostCard,
  ChartBlock,
  SimpleTable
} from '../components/StandardUI';

import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { formatNumber, formatCurrency, formatPercent } from '../utils/utils';

const GrowthTab = ({ results }) => {
  if (!results.growthProjection || results.growthProjection.length === 0) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">Données de projection non disponibles</h3>
        <p className="text-yellow-700">
          Les projections de croissance n'ont pas pu être calculées. Veuillez vérifier les hypothèses de votre modèle.
        </p>
      </div>
    );
  }

  const growthData = results.growthProjection.map(year => ({
    ...year,
    yearLabel: `Année ${year.year}`
  }));

  const growthRateData = growthData.slice(1).map((year, index) => {
    const prevYear = growthData[index];
    return {
      yearLabel: year.yearLabel,
      revenueGrowth: (year.revenue - prevYear.revenue) / prevYear.revenue,
      customerGrowth: (year.customers - prevYear.customers) / prevYear.customers,
      employeeGrowth: (year.employees - prevYear.employees) / prevYear.employees
    };
  });

  const metricsProjection = growthData.map(year => {
    const totalCosts = year.revenue * (1 - results.profitability.profitMargin);
    const arpu = year.revenue / year.customers / 12;
    return {
      yearLabel: year.yearLabel,
      revenue: year.revenue,
      costs: totalCosts,
      profit: year.revenue - totalCosts,
      profitMargin: (year.revenue - totalCosts) / year.revenue,
      arpu,
      revenuePerEmployee: year.revenue / year.employees,
      customersPerEmployee: year.customers / year.employees
    };
  });

  const year5 = growthData[growthData.length - 1];
  const year0 = growthData[0];

  const summaryCards = [
    {
      title: 'CA année 5',
      value: formatCurrency(year5.revenue),
      subtitle: formatPercent((year5.revenue / year0.revenue) - 1),
      className: 'bg-blue-50'
    },
    {
      title: 'Clients année 5',
      value: formatNumber(year5.customers),
      subtitle: formatPercent((year5.customers / year0.customers) - 1),
      className: 'bg-green-50'
    },
    {
      title: 'Effectifs année 5',
      value: formatNumber(year5.employees),
      subtitle: formatPercent((year5.employees / year0.employees) - 1),
      className: 'bg-purple-50'
    }
  ];

  return (
    <div>
      {/* Résumé CA/clients/employés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {summaryCards.map((card, i) => (
          <CostCard key={i} {...card} />
        ))}
      </div>

      {/* Courbe CA + Clients */}
      <ChartBlock title="Projection de croissance sur 5 ans">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearLabel" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) =>
                name === 'revenue' ? formatCurrency(value) : formatNumber(value)
              }
            />
            <Legend />
            <Line yAxisId="left" dataKey="revenue" name="Chiffre d'affaires" stroke="#8884d8" />
            <Line yAxisId="right" dataKey="customers" name="Clients" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </ChartBlock>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Barres croissance */}
        <ChartBlock title="Taux de croissance annuels">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="yearLabel" />
              <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="revenueGrowth" name="Croissance CA" fill="#8884d8" />
              <Bar dataKey="customerGrowth" name="Croissance clients" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBlock>

        {/* Effectifs */}
        <ChartBlock title="Évolution des effectifs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="yearLabel" />
              <YAxis />
              <Tooltip formatter={formatNumber} />
              <Legend />
              <Area dataKey="employees" name="Employés" fill="#8884d8" stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBlock>
      </div>

      {/* Tableau métriques */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">Évolution des métriques clés</h3>
        <div className="overflow-x-auto">
          <SimpleTable
            headers={[
              'Année', 'CA', 'Clients', 'Employés',
              'ARPU mensuel', 'Profit', 'Marge'
            ]}
            rows={metricsProjection.map((year, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{year.yearLabel}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(year.revenue)}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{formatNumber(growthData[i].customers)}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{formatNumber(growthData[i].employees)}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(year.arpu, 2)}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(year.profit)}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{formatPercent(year.profitMargin)}</td>
              </tr>
            ))}
            total={null}
          />
        </div>
      </div>

      {/* Autres analyses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CA / employé */}
        <ChartBlock title="Revenus par employé">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metricsProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="yearLabel" />
              <YAxis />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Line dataKey="revenuePerEmployee" name="CA par employé" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </ChartBlock>

        {/* Hypothèses manuelles */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Hypothèses de croissance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de croissance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {['80%', '50%', '30%', '25%'].map((rate, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">Année {i + 1} → {i + 2}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Ces taux de croissance sont typiques pour des entreprises SaaS en phase de scale-up.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrowthTab;
