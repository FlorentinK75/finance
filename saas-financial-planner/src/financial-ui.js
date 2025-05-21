// FinancialUI.js - Composants d'interface utilisateur pour le modèle financier

import { useState } from 'react';
import { formatEuro, roundToTwo } from './calculations';

// Composant pour un champ de saisie numérique avec libellé
export const NumberInput = ({ label, value, onChange, min, max, step, suffix = '', className = '' }) => {
  return (
    <div className={`flex items-center mb-2 ${className}`}>
      <label className="w-48 mr-2 text-sm">{label}</label>
      <div className="flex-1 flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step || 1}
          className="w-24 px-2 py-1 border rounded"
        />
        {suffix && <span className="ml-2 text-sm text-gray-600">{suffix}</span>}
      </div>
    </div>
  );
};

// Composant pour une section dépliable
export const CollapsibleSection = ({ title, isExpanded, onToggle, children }) => {
  return (
    <div className="mb-4 border rounded">
      <div 
        className="flex justify-between items-center p-3 cursor-pointer bg-gray-100 hover:bg-gray-200"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <span>{isExpanded ? '▼' : '►'}</span>
      </div>
      {isExpanded && (
        <div className="p-3">
          {children}
        </div>
      )}
    </div>
  );
};

// Composant pour afficher une table de résultats trimestriels
export const QuarterlyResultsTable = ({ results, showDetails = false }) => {
  if (!results || results.length === 0) {
    return <p>Aucun résultat à afficher.</p>;
  }
  
  // Grouper par année
  const resultsByYear = {};
  results.forEach(quarter => {
    if (!resultsByYear[quarter.year]) {
      resultsByYear[quarter.year] = [];
    }
    resultsByYear[quarter.year].push(quarter);
  });
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Année</th>
            <th className="border p-2">Trimestre</th>
            <th className="border p-2">CA Base</th>
            <th className="border p-2">CA Upsell</th>
            <th className="border p-2">CA Total</th>
            <th className="border p-2">Coûts</th>
            <th className="border p-2">Marge</th>
            {showDetails && (
              <>
                <th className="border p-2">Clients Début</th>
                <th className="border p-2">Nouveaux</th>
                <th className="border p-2">Churn</th>
                <th className="border p-2">Clients Fin</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {Object.keys(resultsByYear).map(year => (
            resultsByYear[year].map((quarter, idx) => (
              <tr key={`${year}-${quarter.quarter}`} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {idx === 0 && (
                  <td className="border p-2" rowSpan={resultsByYear[year].length}>
                    {year}
                  </td>
                )}
                <td className="border p-2">T{quarter.quarter - (year - 1) * 4}</td>
                <td className="border p-2">{formatEuro(quarter.revenue.base)}</td>
                <td className="border p-2">{formatEuro(quarter.revenue.upsell)}</td>
                <td className="border p-2 font-semibold">{formatEuro(quarter.revenue.total)}</td>
                <td className="border p-2">{formatEuro(quarter.costs.total)}</td>
                <td className={`border p-2 ${quarter.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatEuro(quarter.margin)}
                </td>
                {showDetails && (
                  <>
                    <td className="border p-2">
                      {Object.values(quarter.clients).reduce((acc, client) => acc + client.start, 0)}
                    </td>
                    <td className="border p-2 text-green-600">
                      +{Object.values(quarter.clients).reduce((acc, client) => acc + client.new, 0)}
                    </td>
                    <td className="border p-2 text-red-600">
                      -{Object.values(quarter.clients).reduce((acc, client) => acc + client.churn, 0)}
                    </td>
                    <td className="border p-2">
                      {Object.values(quarter.clients).reduce((acc, client) => acc + client.end, 0)}
                    </td>
                  </>
                )}
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Composant pour afficher les graphiques des résultats financiers
export const FinancialCharts = ({ results, cumulativeResults }) => {
  const [chartType, setChartType] = useState('quarterly');
  
  if (!results || results.length === 0 || !cumulativeResults) {
    return <p>Données insuffisantes pour afficher les graphiques.</p>;
  }
  
  // Préparation des données pour les graphiques
  const quarterlyData = results.map(q => ({
    name: `A${q.year} T${q.quarter - (q.year - 1) * 4}`,
    ca: roundToTwo(q.revenue.total),
    costs: roundToTwo(q.costs.total),
    margin: roundToTwo(q.margin)
  }));
  
  const cumulativeData = results.map((q, index) => ({
    name: `A${q.year} T${q.quarter - (q.year - 1) * 4}`,
    ca: roundToTwo(cumulativeResults.ca[index]),
    costs: roundToTwo(cumulativeResults.costs[index]),
    margin: roundToTwo(cumulativeResults.margin[index]),
    cash: roundToTwo(cumulativeResults.cash[index])
  }));
  
  return (
    <div>
      <div className="mb-4">
        <button
          className={`mr-2 px-3 py-1 rounded ${chartType === 'quarterly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setChartType('quarterly')}
        >
          Résultats trimestriels
        </button>
        <button
          className={`px-3 py-1 rounded ${chartType === 'cumulative' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setChartType('cumulative')}
        >
          Résultats cumulés
        </button>
      </div>
      
      {/* Graphique des résultats */}
      <div className="flex h-64 border rounded mt-2 overflow-hidden">
        {chartType === 'quarterly' ? (
          <div className="flex-1 relative">
            <div className="absolute inset-0 p-4">
              <div className="h-full w-full relative">
                {quarterlyData.map((item, index) => {
                  const maxValue = Math.max(...quarterlyData.map(d => Math.max(d.ca, Math.abs(d.margin))));
                  const scale = maxValue > 0 ? 0.8 / maxValue : 1;
                  const barWidth = 100 / quarterlyData.length;
                  
                  const caHeight = item.ca * scale * 100;
                  const costHeight = item.costs * scale * 100;
                  const marginHeight = Math.abs(item.margin) * scale * 100;
                  const isMarginPositive = item.margin >= 0;
                  
                  return (
                    <div 
                      key={index}
                      className="absolute bottom-0 flex flex-col items-center"
                      style={{ 
                        left: `${index * barWidth}%`, 
                        width: `${barWidth}%` 
                      }}
                    >
                      <div 
                        className="w-4/5 bg-blue-500" 
                        style={{ height: `${caHeight}%` }}
                        title={`CA: ${formatEuro(item.ca)}`}
                      ></div>
                      <div 
                        className="w-4/5 bg-red-400" 
                        style={{ height: `${costHeight}%`, marginTop: '1px' }}
                        title={`Coûts: ${formatEuro(item.costs)}`}
                      ></div>
                      <div 
                        className={`w-4/5 ${isMarginPositive ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ 
                          height: `${marginHeight}%`, 
                          marginTop: '1px' 
                        }}
                        title={`Marge: ${formatEuro(item.margin)}`}
                      ></div>
                      <div className="text-xs mt-1 transform -rotate-45 origin-top-left">
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative">
            <div className="absolute inset-0 p-4">
              <div className="h-full w-full relative">
                {cumulativeData.map((item, index) => {
                  const maxValue = Math.max(...cumulativeData.map(d => Math.max(d.ca, Math.abs(d.cash))));
                  const scale = maxValue > 0 ? 0.8 / maxValue : 1;
                  
                  return (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        left: `${(index / (cumulativeData.length - 1)) * 100}%`,
                        bottom: '0',
                        height: '100%',
                        width: '2px'
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full bg-blue-500 absolute"
                        style={{ 
                          bottom: `${item.ca * scale * 100}%`,
                          transform: 'translate(-50%, 50%)'
                        }}
                        title={`CA Cumulé: ${formatEuro(item.ca)}`}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-red-500 absolute"
                        style={{ 
                          bottom: `${item.costs * scale * 100}%`,
                          transform: 'translate(-50%, 50%)'
                        }}
                        title={`Coûts Cumulés: ${formatEuro(item.costs)}`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full ${item.cash >= 0 ? 'bg-green-500' : 'bg-red-500'} absolute`}
                        style={{ 
                          bottom: `${Math.abs(item.cash) * scale * 100 * (item.cash >= 0 ? 1 : -1)}%`,
                          transform: 'translate(-50%, 50%)'
                        }}
                        title={`Cash: ${formatEuro(item.cash)}`}
                      ></div>
                      {index % 2 === 0 && (
                        <div className="text-xs absolute" style={{ bottom: '-20px', transform: 'translateX(-50%)' }}>
                          {item.name}
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Lignes pour représenter les séries */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
                <div className="absolute bottom-0 top-0 left-0 w-px bg-gray-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex mt-2 text-sm">
        <div className="mr-4 flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>CA</span>
        </div>
        <div className="mr-4 flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
          <span>Coûts</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Marge</span>
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher les KPIs
export const KPIsDisplay = ({ kpis, offerTypes }) => {
  if (!kpis) return null;
  
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">Acquisition</h3>
        <p><span className="font-medium">CAC:</span> {formatEuro(kpis.cac)}</p>
        <p><span className="font-medium">CAC Payback:</span> {roundToTwo(kpis.cacPayback)} mois</p>
      </div>
      
      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">Rétention</h3>
        <p><span className="font-medium">NRR:</span> {roundToTwo(kpis.nrr)}%</p>
      </div>
      
      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">LTV par segment</h3>
        {Object.keys(kpis.ltv).map(segment => (
          <p key={segment}>
            <span className="font-medium">{offerTypes[segment].name}:</span> {formatEuro(kpis.ltv[segment])}
          </p>
        ))}
      </div>
      
      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">ARPU par segment</h3>
        {Object.keys(kpis.arpu).map(segment => (
          <p key={segment}>
            <span className="font-medium">{offerTypes[segment].name}:</span> {formatEuro(kpis.arpu[segment])}/mois
          </p>
        ))}
      </div>
      
      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">Performance globale</h3>
        <p><span className="font-medium">Rule of 40:</span> {roundToTwo(kpis.ruleOf40)}%</p>
        <p><span className="font-medium">Marge opérationnelle:</span> {roundToTwo(kpis.operatingMargin)}%</p>
        <p><span className="font-medium">Revenu par employé:</span> {formatEuro(kpis.revenuePerEmployee)}/an</p>
      </div>
      
      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">LTV/CAC</h3>
        {Object.keys(kpis.ltvCacRatio).map(segment => (
          <p key={segment}>
            <span className="font-medium">{offerTypes[segment].name}:</span> {roundToTwo(kpis.ltvCacRatio[segment])}x
          </p>
        ))}
      </div>
    </div>
  );
};

// Composant pour le tableau des offres
export const OffersTable = ({ offerTypes, setOfferTypes }) => {
  const handleCountChange = (key, value) => {
    setOfferTypes(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        count: value
      }
    }));
  };

  const handleMonthlyPriceChange = (key, value) => {
    setOfferTypes(prev => {
      const reduction = prev[key].reduction || 0;
      const yearlyPrice = value * 12 * (1 - reduction / 100);
      return {
        ...prev,
        [key]: {
          ...prev[key],
          monthlyPrice: value,
          yearlyPrice: yearlyPrice
        }
      };
    });
  };

  const handleReductionChange = (key, value) => {
    setOfferTypes(prev => {
      const monthlyPrice = prev[key].monthlyPrice || 0;
      const yearlyPrice = monthlyPrice * 12 * (1 - value / 100);
      return {
        ...prev,
        [key]: {
          ...prev[key],
          reduction: value,
          yearlyPrice: yearlyPrice
        }
      };
    });
  };

  const handleYearlyPriceChange = (key, value) => {
    setOfferTypes(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        yearlyPrice: value
      }
    }));
  };

  const handlePayMonthlyChange = (key, value) => {
    setOfferTypes(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        payMonthlyPercentage: value
      }
    }));
  };

  const handleChurnChange = (key, value) => {
    setOfferTypes(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        churn: value
      }
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Segment</th>
            <th className="border p-2">Prix mensuel</th>
            <th className="border p-2">Réduction pour abonnement annuel (%)</th>
            <th className="border p-2">Prix annuel</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">% paiement mensuel</th>
            <th className="border p-2">Churn (%)</th>
            <th className="border p-2">CA annuel</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(offerTypes).map(key => {
            const offer = offerTypes[key];
            const annualRevenue = (offer.yearlyPrice || 0) * (offer.count || 0);
            return (
              <tr key={key}>
                <td className="border p-2">{offer.name}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={offer.monthlyPrice || 0}
                    onChange={e => handleMonthlyPriceChange(key, parseFloat(e.target.value) || 0)}
                    min={0}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={offer.reduction || 0}
                    onChange={e => handleReductionChange(key, parseFloat(e.target.value) || 0)}
                    min={0}
                    max={100}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={offer.yearlyPrice || 0}
                    onChange={e => handleYearlyPriceChange(key, parseFloat(e.target.value) || 0)}
                    min={0}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={offer.count || 0}
                    onChange={e => handleCountChange(key, parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={offer.payMonthlyPercentage || 0}
                    onChange={e => handlePayMonthlyChange(key, parseFloat(e.target.value) || 0)}
                    min={0}
                    max={100}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={offer.churn || 0}
                    onChange={e => handleChurnChange(key, parseFloat(e.target.value) || 0)}
                    min={0}
                    max={100}
                    step={0.1}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="border p-2 font-semibold">{formatEuro(annualRevenue)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Composant pour afficher et modifier les modules d'upsell
export const UpsellModulesTable = ({ upsellModules, setUpsellModules }) => {
  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...upsellModules];
    updatedModules[index] = {
      ...updatedModules[index],
      [field]: value
    };
    setUpsellModules(updatedModules);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Module</th>
            <th className="border p-2">Trimestre</th>
            <th className="border p-2">Prix</th>
            <th className="border p-2">Adoption petites assos (%)</th>
            <th className="border p-2">Adoption grandes assos (%)</th>
            <th className="border p-2">Adoption collectivités (%)</th>
          </tr>
        </thead>
        <tbody>
          {upsellModules.map((module, index) => (
            <tr key={index}>
              <td className="border p-2">{module.name}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={module.quarter}
                  onChange={(e) => handleModuleChange(index, 'quarter', parseInt(e.target.value) || 1)}
                  min={1}
                  max={12}
                  className="w-16 px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={module.price}
                  onChange={(e) => handleModuleChange(index, 'price', parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-20 px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={module.adoptionRateSmall}
                  onChange={(e) => handleModuleChange(index, 'adoptionRateSmall', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  className="w-20 px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={module.adoptionRateLarge}
                  onChange={(e) => handleModuleChange(index, 'adoptionRateLarge', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  className="w-20 px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={module.adoptionRateCollectivity}
                  onChange={(e) => handleModuleChange(index, 'adoptionRateCollectivity', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  className="w-20 px-2 py-1 border rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
