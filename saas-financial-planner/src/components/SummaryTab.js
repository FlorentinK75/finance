/**
 * SummaryTab.js
 * Onglet synthèse du tableau de bord SaaS
 */
import React from 'react';
import { 
  PieChart, Pie, LineChart, Line, BarChart, Bar, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { formatNumber, formatCurrency, formatPercent, CHART_COLORS } from '../utils/utils';

const SummaryTab = ({ results }) => {
  // Préparation des données pour les graphiques
  const costBreakdownData = [
    { name: 'Marketing', value: results.costs.acquisition.marketingBudget },
    { name: 'Infrastructure', value: results.costs.operational.annual.infrastructure },
    { name: 'Support', value: results.costs.operational.annual.support },
    { name: 'Salaires', value: results.headcount.totalSalaryCost },
    { name: 'Frais généraux', value: results.costs.overhead.annual }
  ];
  
  // Couleurs pour les graphiques
  const COLORS = CHART_COLORS.primary;
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Chiffre d'affaires</h3>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.profitability.revenue)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Résultat d'exploitation</h3>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(results.profitability.operatingProfit)}
            <span className="text-sm ml-1 font-normal text-gray-500">
              ({formatPercent(results.profitability.profitMargin)})
            </span>
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">LTV/CAC</h3>
          <p className="text-2xl font-bold text-gray-800">
            {results.metrics.ltvCacRatio.toFixed(1)}x
            <span className={`text-sm ml-2 ${results.metrics.ltvCacRatio >= 3 ? 'text-green-500' : 'text-yellow-500'}`}>
              {results.metrics.ltvCacRatio >= 3 ? 'Excellent' : 'À améliorer'}
            </span>
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
          <h3 className="text-md font-semibold mb-3 text-gray-700">Chiffres clés</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Clients totaux</h4>
              <p className="text-lg font-bold text-gray-800">{formatNumber(results.customers.total)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">ARPU mensuel</h4>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(results.customers.monthlyARPU, 2)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Effectif total</h4>
              <p className="text-lg font-bold text-gray-800">{results.headcount.total}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Coût d'acquisition</h4>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(results.metrics.averageCAC)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Churn mensuel</h4>
              <p className="text-lg font-bold text-gray-800">{formatPercent(results.metrics.churnRate/100)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Rule of 40</h4>
              <p className="text-lg font-bold text-gray-800">{results.metrics.ruleOf40Score.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold mb-3 text-gray-700">Projection de croissance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={results.growthProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                if (name === 'revenue') return formatCurrency(value);
                return formatNumber(value);
              }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="CA" stroke="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="customers" name="Clients" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;