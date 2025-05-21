// index.js - Fichier principal qui assemble tous les composants

import { useState, useEffect } from 'react';
import {
  initialOfferTypes,
  initialUpsellModules,
  initialCosts,
  initialCommercialParams,
  initialGrowthRates,
  initialFinancialResults,
  initialExpandedSections
} from './data-models';
import {
  calculateInitialCA,
  balanceClientsForTargetCA,
  calculateFinancialResults,
  formatEuro
} from './calculations';
import {
  NumberInput,
  CollapsibleSection,
  QuarterlyResultsTable,
  FinancialCharts,
  KPIsDisplay,
  OffersTable,
  UpsellModulesTable
} from './financial-ui';

// Composant principal
const FinancialProjections = () => {
  // Paramètres globaux
  const [targetCA, setTargetCA] = useState(500000);
  const [years, setYears] = useState(3);
  const [quarters, setQuarters] = useState(years * 4);
  
  // États des modèles de données
  const [offerTypes, setOfferTypes] = useState(initialOfferTypes);
  const [upsellModules, setUpsellModules] = useState(initialUpsellModules);
  const [costs, setCosts] = useState(initialCosts);
  const [commercialParams, setCommercialParams] = useState(initialCommercialParams);
  const [growthRates, setGrowthRates] = useState(initialGrowthRates);
  const [financialResults, setFinancialResults] = useState(initialFinancialResults);
  const [expandedSections, setExpandedSections] = useState(initialExpandedSections);
  
  // Vérification si CA est atteint
  const [isCaReached, setIsCaReached] = useState(false);
  
  // Calcul du CA initial
  useEffect(() => {
    const initialCA = calculateInitialCA(offerTypes);
    setFinancialResults(prev => ({
      ...prev,
      initialCA
    }));
    setIsCaReached(initialCA >= targetCA);
  }, [offerTypes, targetCA]);
  
  // Mise à jour du nombre de trimestres quand le nombre d'années change
  useEffect(() => {
    setQuarters(years * 4);
  }, [years]);
  
  // Calcul des résultats financiers complets
  useEffect(() => {
    const results = calculateFinancialResults(
      offerTypes,
      upsellModules,
      costs,
      commercialParams,
      growthRates,
      quarters
    );
    
    setFinancialResults(prev => ({
      ...prev,
      quarterlyResults: results.quarterlyResults,
      cumulativeResults: results.cumulativeResults,
      kpis: results.kpis
    }));
  }, [offerTypes, upsellModules, costs, commercialParams, growthRates, quarters]);
  
  // Fonction pour basculer l'état d'une section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Fonction pour équilibrer les clients selon le CA cible
  const handleBalanceClients = () => {
    const updatedOfferTypes = balanceClientsForTargetCA(targetCA, offerTypes);
    setOfferTypes(updatedOfferTypes);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Prévisions Financières - InfinityHelp</h1>
      
      {/* Section de configuration de base */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex mb-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Objectif de CA annuel</label>
            <div className="flex items-center">
              <input
                type="number"
                value={targetCA}
                onChange={(e) => setTargetCA(parseFloat(e.target.value) || 0)}
                min={0}
                step={10000}
                className="w-32 px-3 py-2 border rounded mr-2"
              />
              <span className="text-gray-600">€</span>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Période de projection</label>
            <div className="flex items-center">
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value) || 1)}
                min={1}
                max={5}
                className="w-20 px-3 py-2 border rounded mr-2"
              />
              <span className="text-gray-600">années ({quarters} trimestres)</span>
            </div>
          </div>
          
          <div className="flex-1">
            <button
              onClick={handleBalanceClients}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Équilibrer les clients
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-1">
            <div className={`text-lg font-semibold mb-2 ${isCaReached ? 'text-green-600' : 'text-red-600'}`}>
              CA annuel actuel: {formatEuro(financialResults.initialCA)}
            </div>
            <div className="text-sm">
              {isCaReached 
                ? `Objectif atteint (+${formatEuro(financialResults.initialCA - targetCA)})`
                : `Objectif non atteint (-${formatEuro(targetCA - financialResults.initialCA)})`
              }
            </div>
          </div>
        </div>
      </div>
      
      {/* Section des offres */}
      <CollapsibleSection
        title="1. Typologie d'offres et prix"
        isExpanded={expandedSections.offers}
        onToggle={() => toggleSection('offers')}
      >
        <OffersTable 
          offerTypes={offerTypes}
          setOfferTypes={setOfferTypes}
        />
      </CollapsibleSection>
      
      {/* Section des modules d'upsell */}
      <CollapsibleSection
        title="2. Modules d'upsell"
        isExpanded={expandedSections.upsell}
        onToggle={() => toggleSection('upsell')}
      >
        <UpsellModulesTable 
          upsellModules={upsellModules}
          setUpsellModules={setUpsellModules}
        />
      </CollapsibleSection>
      
      {/* Section des coûts */}
      <CollapsibleSection
        title="3. Structure de coûts"
        isExpanded={expandedSections.costs}
        onToggle={() => toggleSection('costs')}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Salaires</h4>
            <NumberInput
              label="Fondateur (annuel)"
              value={costs.salaries.founder.annual}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                salaries: {
                  ...prev.salaries,
                  founder: {
                    ...prev.salaries.founder,
                    annual: value
                  }
                }
              }))}
              min={0}
              step={1000}
              suffix="€"
            />
            <NumberInput
              label="Dév + SAV (annuel)"
              value={costs.salaries.devSupport.annual}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                salaries: {
                  ...prev.salaries,
                  devSupport: {
                    ...prev.salaries.devSupport,
                    annual: value
                  }
                }
              }))}
              min={0}
              step={1000}
              suffix="€"
            />
            <NumberInput
              label="Seuil pour nouveau Dév"
              value={costs.salaries.devSupport.incrementThreshold}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                salaries: {
                  ...prev.salaries,
                  devSupport: {
                    ...prev.salaries.devSupport,
                    incrementThreshold: value
                  }
                }
              }))}
              min={1}
              suffix="clients"
            />
            <NumberInput
              label="Commercial (annuel)"
              value={costs.salaries.commercial.annual}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                salaries: {
                  ...prev.salaries,
                  commercial: {
                    ...prev.salaries.commercial,
                    annual: value
                  }
                }
              }))}
              min={0}
              step={1000}
              suffix="€"
            />
            <NumberInput
              label="Seuil pour nouveau Commercial"
              value={costs.salaries.commercial.incrementThreshold}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                salaries: {
                  ...prev.salaries,
                  commercial: {
                    ...prev.salaries.commercial,
                    incrementThreshold: value
                  }
                }
              }))}
              min={1}
              suffix="clients"
            />
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Coûts techniques (annuels)</h4>
            <NumberInput
              label="Hébergement & BDD"
              value={costs.technical.hosting}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                technical: {
                  ...prev.technical,
                  hosting: value
                }
              }))}
              min={0}
              suffix="€"
            />
            <NumberInput
              label="Nom de domaine + SSL"
              value={costs.technical.domain}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                technical: {
                  ...prev.technical,
                  domain: value
                }
              }))}
              min={0}
              suffix="€"
            />
            <NumberInput
              label="SaaS outils internes"
              value={costs.technical.saas}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                technical: {
                  ...prev.technical,
                  saas: value
                }
              }))}
              min={0}
              suffix="€"
            />
            <NumberInput
              label="RGPD / sécurité / DPO"
              value={costs.technical.security}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                technical: {
                  ...prev.technical,
                  security: value
                }
              }))}
              min={0}
              suffix="€"
            />
            
            <h4 className="font-semibold mt-4 mb-2">Coûts d'acquisition (annuels)</h4>
            <NumberInput
              label="Emailings ciblés"
              value={costs.acquisition.emailings}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                acquisition: {
                  ...prev.acquisition,
                  emailings: value
                }
              }))}
              min={0}
              suffix="€"
            />
            <NumberInput
              label="Forums associatifs"
              value={costs.acquisition.forums}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                acquisition: {
                  ...prev.acquisition,
                  forums: value
                }
              }))}
              min={0}
              suffix="€"
            />
            <NumberInput
              label="Réseaux partenaires"
              value={costs.acquisition.partnerships}
              onChange={(value) => setCosts(prev => ({
                ...prev,
                acquisition: {
                  ...prev.acquisition,
                  partnerships: value
                }
              }))}
              min={0}
              suffix="€"
            />
          </div>
        </div>
      </CollapsibleSection>
      
      {/* Section croissance */}
      <CollapsibleSection
        title="4. Hypothèses de croissance"
        isExpanded={expandedSections.growth}
        onToggle={() => toggleSection('growth')}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Croissance organique</h4>
            <NumberInput
              label="Taux annuel (%)"
              value={growthRates.organic}
              onChange={(value) => setGrowthRates(prev => ({
                ...prev,
                organic: value
              }))}
              min={0}
              max={100}
              step={0.5}
              suffix="%"
            />
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Croissance par acquisition</h4>
            <NumberInput
              label="Leads par mois (emailings)"
              value={growthRates.emailLeads}
              onChange={(value) => setGrowthRates(prev => ({
                ...prev,
                emailLeads: value
              }))}
              min={0}
              suffix="leads/mois"
            />
            <NumberInput
              label="Contacts qualifiés (forums)"
              value={growthRates.forumContacts}
              onChange={(value) => setGrowthRates(prev => ({
                ...prev,
                forumContacts: value
              }))}
              min={0}
              suffix="contacts/trimestre"
            />
          </div>
        </div>
      </CollapsibleSection>
      
      {/* Section résultats */}
      <CollapsibleSection
        title="5. Résultats financiers"
        isExpanded={expandedSections.results}
        onToggle={() => toggleSection('results')}
      >
        {financialResults.quarterlyResults.length > 0 ? (
          <div>
            <h3 className="font-semibold mb-2">Synthèse graphique</h3>
            <FinancialCharts 
              results={financialResults.quarterlyResults}
              cumulativeResults={financialResults.cumulativeResults}
            />
            
            <h3 className="font-semibold mt-6 mb-2">Résultats trimestriels détaillés</h3>
            <QuarterlyResultsTable 
              results={financialResults.quarterlyResults}
              showDetails={true}
            />
            
            <h3 className="font-semibold mt-6 mb-2">Indicateurs SaaS</h3>
            <KPIsDisplay kpis={financialResults.kpis} offerTypes={offerTypes} />
          </div>
        ) : (
          <p>Calculez les projections financières pour voir les résultats.</p>
        )}
      </CollapsibleSection>
    </div>
  );
};

export default FinancialProjections;