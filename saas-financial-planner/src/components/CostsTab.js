/**
 * CostsTab.js
 * Onglet coûts du tableau de bord SaaS
 */
import React from 'react';
import { 
  PieChart, Pie, BarChart, Bar, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { formatNumber, formatCurrency, formatPercent, CHART_COLORS } from '../utils/utils';

const CostsTab = ({ results }) => {
  // Préparation des données pour les graphiques
  const costBreakdownData = [
    { name: 'Marketing', value: results.costs.acquisition.marketingBudget },
    { name: 'Infrastructure', value: results.costs.operational.annual.infrastructure },
    { name: 'Support', value: results.costs.operational.annual.support },
    { name: 'Salaires', value: results.headcount.totalSalaryCost },
    { name: 'Frais généraux', value: results.costs.overhead.annual }
  ];
  
  const costPercentageData = costBreakdownData.map(item => ({
    name: item.name,
    value: item.value,
    percentage: item.value / results.profitability.totalCosts
  }));
  
  // Couleurs pour les graphiques
  const COLORS = CHART_COLORS.primary;
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Coûts totaux</h3>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.profitability.totalCosts)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Marge brute</h3>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(results.profitability.grossProfit)}
            <span className="text-sm ml-1 font-normal text-gray-500">
              ({formatPercent(results.profitability.grossMargin)})
            </span>
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Ratio Coûts/CA</h3>
          <p className="text-2xl font-bold text-gray-800">
            {formatPercent(results.profitability.totalCosts / results.profitability.revenue)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-700">Répartition des coûts</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-700">Coûts par catégorie</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={costPercentageData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="value" name="Montant" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">Détails des coûts par catégorie</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût annuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% des coûts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% du CA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût par client</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costPercentageData.map((category, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(category.value)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPercent(category.percentage)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPercent(category.value / results.profitability.revenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(category.value / results.customers.total, 0)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(results.profitability.totalCosts)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">100%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatPercent(results.profitability.totalCosts / results.profitability.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(results.profitability.totalCosts / results.customers.total, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Coûts d'acquisition</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Budget marketing</h4>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(results.costs.acquisition.marketingBudget)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">% du CA</h4>
              <p className="text-lg font-bold text-gray-800">
                {formatPercent(results.costs.acquisition.marketingBudget / results.profitability.revenue)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">CAC</h4>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(results.costs.acquisition.effectiveCAC)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Clients payants acquis</h4>
              <p className="text-lg font-bold text-gray-800">{formatNumber(results.costs.acquisition.paidCustomers)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Coûts opérationnels</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Coûts d'infrastructure</h4>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(results.costs.operational.annual.infrastructure)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Coûts de support</h4>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(results.costs.operational.annual.support)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Coût par client/mois</h4>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(results.costs.operational.monthly.total / results.customers.total, 2)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">% du total des coûts</h4>
              <p className="text-lg font-bold text-gray-800">
                {formatPercent(results.costs.operational.annual.total / results.profitability.totalCosts)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostsTab;