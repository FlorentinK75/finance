/**
 * GrowthTab.js
 * Onglet projections de croissance du tableau de bord SaaS
 */
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { formatNumber, formatCurrency, formatPercent, CHART_COLORS } from '../utils/utils';

const GrowthTab = ({ results }) => {
  // Vérification de la présence des données de projection
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
  
  // Préparation des données pour les graphiques
  const growthData = results.growthProjection.map(year => ({
    ...year,
    revenue: year.revenue,
    customers: year.customers,
    employees: year.employees,
    yearLabel: `Année ${year.year}`
  }));
  
  // Calcul des taux de croissance entre les années
  const growthRateData = growthData.map((year, index) => {
    if (index === 0) {
      return {
        yearLabel: year.yearLabel,
        revenueGrowth: 0,
        customerGrowth: 0,
        employeeGrowth: 0
      };
    }
    
    const prevYear = growthData[index - 1];
    return {
      yearLabel: year.yearLabel,
      revenueGrowth: (year.revenue - prevYear.revenue) / prevYear.revenue,
      customerGrowth: (year.customers - prevYear.customers) / prevYear.customers,
      employeeGrowth: (year.employees - prevYear.employees) / prevYear.employees
    };
  }).slice(1); // Suppression de la première année qui n'a pas de taux de croissance
  
  // Calcul des métriques pour chaque année
  const metricsProjection = growthData.map(year => {
    const totalCosts = year.revenue * (1 - results.profitability.profitMargin);
    const arpu = year.revenue / year.customers / 12; // ARPU mensuel
    
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
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">CA année 5</h3>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(growthData[growthData.length - 1].revenue)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatPercent((growthData[growthData.length - 1].revenue / growthData[0].revenue - 1))} sur 5 ans
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Clients année 5</h3>
          <p className="text-2xl font-bold text-gray-800">
            {formatNumber(growthData[growthData.length - 1].customers)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatPercent((growthData[growthData.length - 1].customers / growthData[0].customers - 1))} sur 5 ans
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Effectifs année 5</h3>
          <p className="text-2xl font-bold text-gray-800">
            {growthData[growthData.length - 1].employees}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatPercent((growthData[growthData.length - 1].employees / growthData[0].employees - 1))} sur 5 ans
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">Projection de croissance sur 5 ans</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="yearLabel" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'revenue') return formatCurrency(value);
                  return formatNumber(value);
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Chiffre d'affaires"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="customers"
                name="Clients"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Taux de croissance annuels</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={growthRateData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="yearLabel" />
                <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Tooltip
                  formatter={(value) => `${(value * 100).toFixed(1)}%`}
                />
                <Legend />
                <Bar
                  dataKey="revenueGrowth"
                  name="Croissance CA"
                  fill="#8884d8"
                />
                <Bar
                  dataKey="customerGrowth"
                  name="Croissance clients"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Évolution des effectifs</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={growthData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="yearLabel" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="employees"
                  name="Employés"
                  fill="#8884d8"
                  stroke="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">Évolution des métriques clés</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employés</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ARPU mensuel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marge</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metricsProjection.map((year, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{year.yearLabel}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(year.revenue)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(growthData[index].customers)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(growthData[index].employees)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(year.arpu, 2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(year.profit)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatPercent(year.profitMargin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Revenus par employé</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={metricsProjection}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="yearLabel" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenuePerEmployee"
                  name="CA par employé"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
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
                <tr className="bg-white">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Année 1 → 2</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">80%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Année 2 → 3</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">50%</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Année 3 → 4</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">30%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Année 4 → 5</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">25%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Ces taux de croissance sont typiques pour des entreprises SaaS en phase de scale-up, avec une croissance
            rapide dans les premières années qui se stabilise à mesure que l'entreprise mûrit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrowthTab;