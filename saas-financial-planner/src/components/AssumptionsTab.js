import React from 'react';
import { formatNumber, formatCurrency } from '../utils/utils';
import { LabeledInput, FormSection, InputGrid } from '../components/StandardUI';

const AssumptionsTab = ({ results, assumptions, onAssumptionChange }) => {
  if (!assumptions || !assumptions.pricing || !assumptions.distribution) {
    return <div className="p-4 text-red-600">Chargement des hypothèses en cours...</div>;
  }

  const pricing = assumptions.pricing || { basic: 0, pro: 0, enterprise: 0 };
  const distribution = assumptions.distribution || { basic: 0, pro: 0, enterprise: 0 };
  const salesEfficiency = assumptions.salesEfficiency || {};
  const salaries = assumptions.salaries || {};

  const handleChange = (category, key, value) => {
    onAssumptionChange?.(category, key, value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormSection title="Structure de revenus">
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Prix mensuels par niveau</h4>
          <InputGrid columns={3}>
            {['basic', 'pro', 'enterprise'].map((level) => (
              <LabeledInput
                key={level}
                label={`${level.charAt(0).toUpperCase() + level.slice(1)} (€)`}
                value={pricing[level]}
                onChange={(e) => handleChange('pricing', level, Number(e.target.value))}
              />
            ))}
          </InputGrid>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Distribution des clients (%)</h4>
          <InputGrid columns={3}>
            {['basic', 'pro', 'enterprise'].map((level) => (
              <LabeledInput
                key={level}
                label={level.charAt(0).toUpperCase() + level.slice(1)}
                value={distribution[level]}
                onChange={(e) => handleChange('distribution', level, Number(e.target.value))}
              />
            ))}
          </InputGrid>
          {distribution.basic + distribution.pro + distribution.enterprise !== 100 && (
            <p className="text-red-500 text-xs mt-2">La somme des pourcentages doit être égale à 100%</p>
          )}
        </div>

        <InputGrid>
          <LabeledInput
            label="Clients avec facturation annuelle (%)"
            value={assumptions.annualBilling}
            onChange={(e) => handleChange('annualBilling', null, Number(e.target.value))}
            min="0"
            max="100"
          />
          <LabeledInput
            label="Remise facturation annuelle (%)"
            value={assumptions.annualDiscount}
            onChange={(e) => handleChange('annualDiscount', null, Number(e.target.value))}
            min="0"
            max="100"
          />
        </InputGrid>
      </FormSection>

      <FormSection title="Rétention et acquisition">
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Métriques de rétention</h4>
          <InputGrid>
            <LabeledInput
              label="Taux de churn mensuel (%)"
              value={assumptions.churnRate}
              onChange={(e) => handleChange('churnRate', null, Number(e.target.value))}
              min="0"
              max="100"
              step="0.1"
            />
            <LabeledInput
              label="Durée de vie moyenne (mois)"
              value={formatNumber(100 / assumptions.churnRate, 1)}
              readOnly
              type="text"
            />
          </InputGrid>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Acquisition clients</h4>
          <InputGrid>
            <LabeledInput
              label="Budget marketing (% du CA)"
              value={assumptions.marketingBudget}
              onChange={(e) => handleChange('marketingBudget', null, Number(e.target.value))}
              min="0"
              max="100"
            />
            <LabeledInput
              label="Acquisition organique (%)"
              value={assumptions.organicAcquisition}
              onChange={(e) => handleChange('organicAcquisition', null, Number(e.target.value))}
              min="0"
              max="100"
            />
          </InputGrid>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Résultats calculés</h4>
          <InputGrid>
            <LabeledInput label="LTV Client" value={formatCurrency(results.metrics.customerLTV)} readOnly type="text" />
            <LabeledInput label="CAC" value={formatCurrency(results.metrics.averageCAC)} readOnly type="text" />
            <LabeledInput label="LTV/CAC" value={`${results.metrics.ltvCacRatio.toFixed(2)}x`} readOnly type="text" />
            <LabeledInput label="CAC Payback Period" value={`${formatNumber(results.metrics.cacPaybackPeriod, 1)} mois`} readOnly type="text" />
          </InputGrid>
        </div>
      </FormSection>

      <FormSection title="Efficacité opérationnelle">
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Clients par employé</h4>
          <InputGrid columns={3}>
            {['development', 'marketing', 'sales', 'support', 'management'].map((role) => (
              <LabeledInput
                key={role}
                label={role.charAt(0).toUpperCase() + role.slice(1)}
                value={salesEfficiency[role] || ''}
                onChange={(e) => handleChange('salesEfficiency', role, Number(e.target.value))}
                min="1"
              />
            ))}
          </InputGrid>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Salaires annuels moyens (€)</h4>
          <InputGrid columns={3}>
            {['development', 'marketing', 'sales', 'support', 'management'].map((role) => (
              <LabeledInput
                key={role}
                label={role.charAt(0).toUpperCase() + role.slice(1)}
                value={salaries[role] || ''}
                onChange={(e) => handleChange('salaries', role, Number(e.target.value))}
                min="0"
                step="1000"
              />
            ))}
          </InputGrid>
        </div>
      </FormSection>

      <FormSection title="Coûts opérationnels">
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Coûts d'infrastructure</h4>
          <InputGrid>
            <LabeledInput
              label="Coût infrastructure par client/mois (€)"
              value={results.assumptions.infrastructureCostPerUser || 0}
              onChange={(e) => handleChange('infrastructureCostPerUser', null, Number(e.target.value))}
              min="0"
              step="0.1"
            />
            <LabeledInput
              label="Coût support par client/mois (€)"
              value={results.assumptions.supportCostPerUser || 0}
              onChange={(e) => handleChange('supportCostPerUser', null, Number(e.target.value))}
              min="0"
              step="0.1"
            />
          </InputGrid>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Frais généraux</h4>
          <InputGrid>
            <LabeledInput
              label="Frais généraux (% du CA)"
              value={(results.assumptions.overheadPercentage || 0) * 100}
              onChange={(e) => handleChange('overheadPercentage', null, Number(e.target.value) / 100)}
              min="0"
              max="100"
              step="1"
            />
            <LabeledInput
              label="Marge nette cible (%)"
              value={(results.assumptions.targetProfitMargin || 0) * 100}
              onChange={(e) => handleChange('targetProfitMargin', null, Number(e.target.value) / 100)}
              min="-100"
              max="100"
              step="1"
            />
          </InputGrid>
        </div>
      </FormSection>
    </div>
  );
};

export default AssumptionsTab;