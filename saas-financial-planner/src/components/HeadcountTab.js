/**
 * HeadcountTab.js
 * Onglet effectifs du tableau de bord SaaS
 */
import React from 'react';
import { 
  PieChart, Pie, BarChart, Bar, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { formatNumber, formatCurrency, formatPercent, CHART_COLORS } from '../utils/utils';

const HeadcountTab = ({ results }) => {
  // Préparation des données pour les graphiques
  const headcountData = Object.entries(results.headcount.byTeam).map(([team, data]) => ({
    name: team.charAt(0).toUpperCase() + team.slice(1),
    employees: data.employees,
    salaryCost: data.salaryCost,
    costPerEmployee: Math.round(data.salaryCost / data.employees)
  }));
  
  // Traduction des noms d'équipes
  const teamTranslations = {
    'development': 'Développement',
    'marketing': 'Marketing',
    'sales': 'Ventes',
    'support': 'Support',
    'management': 'Direction'
  };
  
  const headcountTranslatedData = headcountData.map(item => ({
    ...item,
    name: teamTranslations[item.name.toLowerCase()] || item.name
  }));
  
  // Couleurs pour les graphiques
  const COLORS = CHART_COLORS.primary;
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Effectif total</h3>
          <p className="text-2xl font-bold text-gray-800">{results.headcount.total} employés</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Masse salariale</h3>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.headcount.totalSalaryCost)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Revenu par employé</h3>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(results.profitability.revenue / results.headcount.total)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-700">Répartition des effectifs</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={headcountTranslatedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="employees"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {headcountTranslatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-700">Coûts salariaux par département</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={headcountTranslatedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="salaryCost" name="Coût salarial" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">Détails des effectifs par département</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employés</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% du total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire moyen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients par employé</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {headcountTranslatedData.map((team, index) => {
                const originalTeamName = Object.keys(teamTranslations).find(
                  key => teamTranslations[key] === team.name
                ) || team.name.toLowerCase();
                const clientsPerEmployee = results.assumptions.teams[originalTeamName]?.clientsPerEmployee || 0;
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.employees}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPercent(team.employees / results.headcount.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(team.costPerEmployee)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(team.salaryCost)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(clientsPerEmployee)}</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{results.headcount.total}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">100%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(results.headcount.totalSalaryCost / results.headcount.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(results.headcount.totalSalaryCost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatNumber(results.customers.total / results.headcount.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Indicateurs d'efficacité</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">CA par employé</h4>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(results.profitability.revenue / results.headcount.total)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Profit par employé</h4>
              <p className="text-lg font-bold text-gray-800">
                {formatCurrency(results.profitability.operatingProfit / results.headcount.total)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Clients par employé</h4>
              <p className="text-lg font-bold text-gray-800">{formatNumber(results.customers.total / results.headcount.total, 1)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Masse salariale/CA</h4>
              <p className="text-lg font-bold text-gray-800">
                {formatPercent(results.headcount.totalSalaryCost / results.profitability.revenue)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Recrutement prévisionnel</h3>
          <p className="mb-4 text-sm text-gray-600">
            Basé sur les projections de croissance, voici le nombre d'employés supplémentaires nécessaires par année :
          </p>
          
          {results.growthProjection && results.growthProjection.length > 1 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectif total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nouveaux postes</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA prévu</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.growthProjection.map((year, index) => {
                    const previousYear = index > 0 ? results.growthProjection[index - 1].employees : 0;
                    const newPositions = index > 0 ? year.employees - previousYear : year.employees;
                    
                    return (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Année {year.year}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{year.employees}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {index > 0 ? `+${newPositions}` : year.employees}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(year.revenue)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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