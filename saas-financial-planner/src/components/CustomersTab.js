/**
 * CustomersTab.js
 * Onglet clients du tableau de bord SaaS
 */
import React from 'react';
import { 
  PieChart, Pie, BarChart, Bar, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { formatNumber, formatCurrency, formatPercent, CHART_COLORS } from '../utils/utils';

const CustomersTab = ({ results }) => {
  // Vérification immédiate
  if (!results) {
    return <div>Chargement des données...</div>;
  }

  // Extraction avec vérification préalable des objets potentiellement undefined
  // Utilisation de l'opérateur OR pour garantir des objets valides
  const customersByTier = (results.customers && results.customers.byTier) || { basic: 0, pro: 0, enterprise: 0 };
  const averageRevenuePerUser = (results.assumptions && results.assumptions.averageRevenuePerUser) || { basic: 0, pro: 0, enterprise: 0 };
  
  // Créer une version stable des données qui préserve la structure même si certaines propriétés manquent
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
      revenue: results.profitability?.revenue || 1 // Éviter la division par zéro
    }
  };
  
  // Préparation des données pour les graphiques en utilisant safeResults au lieu de results
  const customerDistributionData = Object.entries(safeResults.customers.byTier).map(([tier, count]) => ({
    name: tier.charAt(0).toUpperCase() + tier.slice(1),
    value: count
  }));
  
  const customerRevenueData = Object.entries(safeResults.customers.byTier).map(([tier, count]) => {
    // Sécurité supplémentaire ici pour s'assurer que averageRevenuePerUser[tier] existe
    const arpu = safeResults.assumptions.averageRevenuePerUser[tier] || 0;
    const monthlyRevenue = count * arpu;
    
    return {
      name: tier.charAt(0).toUpperCase() + tier.slice(1),
      customers: count,
      revenue: monthlyRevenue * 12,
      arpu: arpu
    };
  });
  
  // Couleurs pour les graphiques
  const COLORS = CHART_COLORS.primary;
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Clients totaux</h3>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(safeResults.customers.total)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">ARPU mensuel</h3>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(safeResults.customers.monthlyARPU, 2)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-1">LTV client</h3>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(safeResults.metrics.customerLTV)}</p>
        </div>
      </div>
      
      {/* Le reste du code reste inchangé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-700">Répartition des clients par niveau</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {customerDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-700">Revenus par niveau d'abonnement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" name="Revenu annuel" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">Détails des clients par niveau</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de clients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix mensuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenu mensuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenu annuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% du total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customerRevenueData.map((tier, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(tier.customers)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(tier.arpu, 2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(tier.revenue / 12)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(tier.revenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPercent(tier.revenue / safeResults.profitability.revenue)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatNumber(safeResults.customers.total)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(safeResults.customers.monthlyARPU, 2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(safeResults.profitability.revenue / 12)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(safeResults.profitability.revenue)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Métriques de rétention</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Taux de churn mensuel</h4>
              <p className="text-lg font-bold text-gray-800">{formatPercent(safeResults.metrics.churnRate/100)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Taux de churn annuel</h4>
              <p className="text-lg font-bold text-gray-800">{formatPercent(safeResults.metrics.annualChurnRate/100)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Durée de vie moyenne (mois)</h4>
              <p className="text-lg font-bold text-gray-800">{formatNumber(safeResults.metrics.averageCustomerLifetimeMonths, 1)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Taux d'upsell mensuel</h4>
              <p className="text-lg font-bold text-gray-800">{formatPercent(safeResults.assumptions.monthlyUpsellRate)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Acquisition clients</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">CAC moyen</h4>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(safeResults.metrics.averageCAC)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Durée de remboursement CAC</h4>
              <p className="text-lg font-bold text-gray-800">{formatNumber(safeResults.metrics.cacPaybackPeriod, 1)} mois</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Acquisition organique</h4>
              <p className="text-lg font-bold text-gray-800">{formatNumber(safeResults.costs.acquisition.organicCustomers)} clients</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Acquisition payante</h4>
              <p className="text-lg font-bold text-gray-800">{formatNumber(safeResults.costs.acquisition.paidCustomers)} clients</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersTab;