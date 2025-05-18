import React from 'react';
import {
  PieChart, Pie, BarChart, Bar,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import {
  CostCard,
  ChartBlock,
  SimpleTable
} from '../components/StandardUI';

import {
  formatNumber,
  formatCurrency,
  formatPercent,
  CHART_COLORS
} from '../utils/utils';

const HeadcountTab = ({ results }) => {
  const headcountData = Object.entries(results.headcount.byTeam).map(([team, data]) => ({
    name: team.charAt(0).toUpperCase() + team.slice(1),
    employees: data.employees,
    salaryCost: data.salaryCost,
    costPerEmployee: Math.round(data.salaryCost / data.employees)
  }));

  const teamTranslations = {
    development: 'Développement',
    marketing: 'Marketing',
    sales: 'Ventes',
    support: 'Support',
    management: 'Direction'
  };

  const translatedData = headcountData.map(item => ({
    ...item,
    name: teamTranslations[item.name.toLowerCase()] || item.name
  }));

  const COLORS = CHART_COLORS.primary;

  const summaryCards = [
    {
      title: 'Effectif total',
      value: `${results.headcount.total} employés`,
      className: 'bg-blue-50'
    },
    {
      title: 'Masse salariale',
      value: formatCurrency(results.headcount.totalSalaryCost),
      className: 'bg-green-50'
    },
    {
      title: 'Revenu par employé',
      value: formatCurrency(results.profitability.revenue / results.headcount.total),
      className: 'bg-yellow-50'
    }
  ];

  const tableHeaders = [
    'Département', 'Employés', '% du total', 'Salaire moyen', 'Coût total', 'Clients par employé'
  ];

  const tableRows = translatedData.map((team, index) => {
    const originalName = Object.keys(teamTranslations).find(
      key => teamTranslations[key] === team.name
    ) || team.name.toLowerCase();

    const clientsPerEmployee = results.assumptions.teams[originalName]?.clientsPerEmployee || 0;

    return (
      <tr key={index}>
        <td className="px-6 py-4 text-sm font-medium text-gray-900">{team.name}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{team.employees}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{formatPercent(team.employees / results.headcount.total)}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(team.costPerEmployee)}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(team.salaryCost)}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{formatNumber(clientsPerEmployee)}</td>
      </tr>
    );
  });

  const tableTotal = (
    <tr className="bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{results.headcount.total}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">100%</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {formatCurrency(results.headcount.totalSalaryCost / results.headcount.total)}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {formatCurrency(results.headcount.totalSalaryCost)}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {formatNumber(results.customers.total / results.headcount.total)}
      </td>
    </tr>
  );

  return (
    <div>
      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {summaryCards.map((card, i) => (
          <CostCard key={i} {...card} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartBlock title="Répartition des effectifs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={translatedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="employees"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {translatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value} />
            </PieChart>
          </ResponsiveContainer>
        </ChartBlock>

        <ChartBlock title="Coûts salariaux par département">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={translatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="salaryCost" name="Coût salarial" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBlock>
      </div>

      {/* Tableau */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">Détails des effectifs par département</h3>
        <div className="overflow-x-auto">
          <SimpleTable headers={tableHeaders} rows={tableRows} total={tableTotal} />
        </div>
      </div>

      {/* Indicateurs + recrutement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Indicateurs */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Indicateurs d'efficacité</h3>
          <div className="grid grid-cols-2 gap-4">
            <CostCard title="CA par employé" value={formatCurrency(results.profitability.revenue / results.headcount.total)} />
            <CostCard title="Profit par employé" value={formatCurrency(results.profitability.operatingProfit / results.headcount.total)} />
            <CostCard title="Clients par employé" value={formatNumber(results.customers.total / results.headcount.total, 1)} />
            <CostCard title="Masse salariale/CA" value={formatPercent(results.headcount.totalSalaryCost / results.profitability.revenue)} />
          </div>
        </div>

        {/* Recrutement */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Recrutement prévisionnel</h3>
          <p className="mb-4 text-sm text-gray-600">
            Basé sur les projections de croissance, voici le nombre d'employés supplémentaires nécessaires par année :
          </p>

          {results.growthProjection?.length > 1 ? (
            <div className="overflow-x-auto">
              <SimpleTable
                headers={['Année', 'Effectif total', 'Nouveaux postes', 'CA prévu']}
                rows={results.growthProjection.map((year, index) => {
                  const prev = index > 0 ? results.growthProjection[index - 1].employees : 0;
                  const newHires = index > 0 ? year.employees - prev : year.employees;
                  return (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">Année {year.year}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{year.employees}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{index > 0 ? `+${newHires}` : newHires}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(year.revenue)}</td>
                    </tr>
                  );
                })}
                total={null}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Les données de projection ne sont pas disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadcountTab;
