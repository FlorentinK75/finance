/**
 * AssumptionsTab.js
 * Onglet hypothèses du tableau de bord SaaS
 */
import React from 'react';
import { formatNumber, formatCurrency, formatPercent } from '../utils/utils';

const AssumptionsTab = ({ results, assumptions, onAssumptionChange }) => {
  // Fonction pour gérer les modifications d'hypothèses
  const handleChange = (category, key, value) => {
    if (onAssumptionChange) {
      onAssumptionChange(category, key, value);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Structure de revenus</h3>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Prix mensuels par niveau</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Basic (€)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.pricing.basic}
                onChange={(e) => handleChange('pricing', 'basic', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Pro (€)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.pricing.pro}
                onChange={(e) => handleChange('pricing', 'pro', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Enterprise (€)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.pricing.enterprise}
                onChange={(e) => handleChange('pricing', 'enterprise', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Distribution des clients (%)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Basic</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.distribution.basic}
                onChange={(e) => handleChange('distribution', 'basic', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Pro</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.distribution.pro}
                onChange={(e) => handleChange('distribution', 'pro', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Enterprise</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.distribution.enterprise}
                onChange={(e) => handleChange('distribution', 'enterprise', Number(e.target.value))}
              />
            </div>
          </div>
          {assumptions.distribution.basic + assumptions.distribution.pro + assumptions.distribution.enterprise !== 100 && (
            <p className="text-red-500 text-xs mt-2">
              La somme des pourcentages doit être égale à 100%
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Clients avec facturation annuelle (%)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={assumptions.annualBilling}
              onChange={(e) => handleChange('annualBilling', null, Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Remise facturation annuelle (%)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={assumptions.annualDiscount}
              onChange={(e) => handleChange('annualDiscount', null, Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Rétention et acquisition</h3>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Métriques de rétention</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Taux de churn mensuel (%)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.churnRate}
                onChange={(e) => handleChange('churnRate', null, Number(e.target.value))}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Durée de vie moyenne (mois)
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-gray-100"
                value={formatNumber(100 / assumptions.churnRate, 1)}
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Acquisition clients</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Budget marketing (% du CA)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.marketingBudget}
                onChange={(e) => handleChange('marketingBudget', null, Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Acquisition organique (%)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.organicAcquisition}
                onChange={(e) => handleChange('organicAcquisition', null, Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Résultats calculés</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                LTV Client
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-gray-100"
                value={formatCurrency(results.metrics.customerLTV)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                CAC
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-gray-100"
                value={formatCurrency(results.metrics.averageCAC)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                LTV/CAC
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-gray-100"
                value={results.metrics.ltvCacRatio.toFixed(2) + 'x'}
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                CAC Payback Period
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-gray-100"
                value={formatNumber(results.metrics.cacPaybackPeriod, 1) + ' mois'}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Efficacité opérationnelle</h3>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Clients par employé</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Développement
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salesEfficiency.development}
                onChange={(e) => handleChange('salesEfficiency', 'development', Number(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Marketing
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salesEfficiency.marketing}
                onChange={(e) => handleChange('salesEfficiency', 'marketing', Number(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Ventes
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salesEfficiency.sales}
                onChange={(e) => handleChange('salesEfficiency', 'sales', Number(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Support
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salesEfficiency.support}
                onChange={(e) => handleChange('salesEfficiency', 'support', Number(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Direction
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salesEfficiency.management}
                onChange={(e) => handleChange('salesEfficiency', 'management', Number(e.target.value))}
                min="1"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Salaires annuels moyens (€)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Développement
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salaries.development}
                onChange={(e) => handleChange('salaries', 'development', Number(e.target.value))}
                min="0"
                step="1000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Marketing
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salaries.marketing}
                onChange={(e) => handleChange('salaries', 'marketing', Number(e.target.value))}
                min="0"
                step="1000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Ventes
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salaries.sales}
                onChange={(e) => handleChange('salaries', 'sales', Number(e.target.value))}
                min="0"
                step="1000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Support
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salaries.support}
                onChange={(e) => handleChange('salaries', 'support', Number(e.target.value))}
                min="0"
                step="1000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Direction
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={assumptions.salaries.management}
                onChange={(e) => handleChange('salaries', 'management', Number(e.target.value))}
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Coûts opérationnels</h3>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Coûts d'infrastructure</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Coût infrastructure par client/mois (€)
              </label>
              <input
  type="number"
  className="w-full p-2 border rounded-md"
  value={results?.assumptions?.infrastructureCostPerUser || 0}
  onChange={(e) => handleChange('infrastructureCostPerUser', null, Number(e.target.value))}
  min="0"
  step="0.1"
/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Coût support par client/mois (€)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={results.assumptions.supportCostPerUser}
                onChange={(e) => handleChange('supportCostPerUser', null, Number(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Frais généraux</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Frais généraux (% du CA)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={results.assumptions.overheadPercentage * 100}
                onChange={(e) => handleChange('overheadPercentage', null, Number(e.target.value) / 100)}
                min="0"
                max="100"
                step="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Marge nette cible (%)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={results.assumptions.targetProfitMargin * 100}
                onChange={(e) => handleChange('targetProfitMargin', null, Number(e.target.value) / 100)}
                min="-100"
                max="100"
                step="1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssumptionsTab;