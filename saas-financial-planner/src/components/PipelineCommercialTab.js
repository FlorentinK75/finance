import React, { useState } from 'react';

const segments = [
  { key: 'petiteAsso', label: 'Petite asso' },
  { key: 'grandeAsso', label: 'Grande asso' },
  { key: 'collectivite', label: 'Collectivité' },
];

const defaultPrices = {
  petiteAsso: 50,
  grandeAsso: 150,
  collectivite: 400,
};

const defaultConversions = {
  petiteAsso: { contact: 0.2, rdv: 0.5, closing: 0.3 },
  grandeAsso: { contact: 0.25, rdv: 0.55, closing: 0.35 },
  collectivite: { contact: 0.3, rdv: 0.6, closing: 0.4 },
};

const defaultClients = {
  petiteAsso: 0,
  grandeAsso: 0,
  collectivite: 0,
};

const salaireCommercial = 3500; // €/mois
const heuresParRdv = 1;
const rdvParMoisParCommercial = 100;

export default function PipelineCommercialTab() {
  const [caCible, setCaCible] = useState('');
  const [prix, setPrix] = useState(defaultPrices);
  const [clients, setClients] = useState(defaultClients);
  const [conversions, setConversions] = useState(defaultConversions);

  // Calcul du CA atteint
  const caAtteint = segments.reduce(
    (sum, seg) => sum + (prix[seg.key] * clients[seg.key]*12),
    0
  );
  const caOk = caCible && caAtteint >= Number(caCible);

  // Pipeline commercial par segment
  const pipeline = segments.map(seg => {
    const closing = clients[seg.key];
    const rdv = closing / (conversions[seg.key].closing || 1);
    const contact = rdv / (conversions[seg.key].rdv || 1);
    return {
      ...seg,
      contact: Math.ceil(contact),
      rdv: Math.ceil(rdv),
      closing,
    };
  });

  // Total RDV pour tous les segments
  const totalRdv = pipeline.reduce((sum, seg) => sum + seg.rdv, 0);
  const heuresTotales = totalRdv * heuresParRdv;
  const nbCommerciaux = Math.ceil(totalRdv / rdvParMoisParCommercial);
  const coutCommerciaux = nbCommerciaux * salaireCommercial;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Pipeline commercial</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <label className="block font-semibold mb-2">CA cible (€ / mois)</label>
        <input
          type="number"
          className="border rounded px-3 py-2 w-64 mb-2"
          value={caCible}
          onChange={e => setCaCible(e.target.value)}
          min={0}
        />
        <div className="text-gray-500 text-sm mb-2">Saisissez le CA cible pour activer les autres champs.</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {segments.map(seg => (
          <div key={seg.key} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="font-semibold mb-1">{seg.label}</div>
            <label className="text-sm">Prix mensuel (€)</label>
            <input
              type="number"
              className="border rounded px-2 py-1 mb-2"
              value={prix[seg.key]}
              onChange={e => setPrix({ ...prix, [seg.key]: Number(e.target.value) })}
              min={0}
              disabled={!caCible}
            />
            <label className="text-sm">Nombre de clients</label>
            <input
              type="number"
              className="border rounded px-2 py-1 mb-2"
              value={clients[seg.key]}
              onChange={e => setClients({ ...clients, [seg.key]: Number(e.target.value) })}
              min={0}
              disabled={!caCible}
            />
            <div className="text-xs text-gray-500">CA segment : <span className="font-bold">{prix[seg.key] * clients[seg.key]*12} €</span></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-semibold">CA atteint : <span className={caOk ? 'text-green-600' : 'text-red-600'}>{caAtteint} €</span></div>
          {caCible && (
            <div className="text-sm mt-1">{caOk ? 'Objectif atteint !' : `Encore ${Number(caCible) - caAtteint} € à atteindre`}</div>
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">Pipeline commercial par segment</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {pipeline.map(seg => (
          <div key={seg.key} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="font-semibold mb-1">{seg.label}</div>
            <label className="text-sm">Taux de conversion contact → RDV</label>
            <input
              type="number"
              step="0.01"
              className="border rounded px-2 py-1 mb-2"
              value={conversions[seg.key].rdv}
              onChange={e => setConversions({
                ...conversions,
                [seg.key]: { ...conversions[seg.key], rdv: Number(e.target.value) },
              })}
              min={0}
              max={1}
              disabled={!caCible}
            />
            <label className="text-sm">Taux de conversion RDV → Closing</label>
            <input
              type="number"
              step="0.01"
              className="border rounded px-2 py-1 mb-2"
              value={conversions[seg.key].closing}
              onChange={e => setConversions({
                ...conversions,
                [seg.key]: { ...conversions[seg.key], closing: Number(e.target.value) },
              })}
              min={0}
              max={1}
              disabled={!caCible}
            />
            <div className="text-xs text-gray-500">Clients à contacter : <span className="font-bold">{seg.contact}</span></div>
            <div className="text-xs text-gray-500">RDV à obtenir : <span className="font-bold">{seg.rdv}</span></div>
            <div className="text-xs text-gray-500">Closings attendus : <span className="font-bold">{seg.closing}</span></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="font-semibold mb-2">Synthèse commerciale</div>
        <div className="mb-1">Total RDV à réaliser : <span className="font-bold">{totalRdv}</span></div>
        <div className="mb-1">Heures commerciales nécessaires : <span className="font-bold">{heuresTotales}</span></div>
        <div className="mb-1">Nombre de commerciaux nécessaires : <span className="font-bold">{nbCommerciaux}</span></div>
        <div className="mb-1">Coût mensuel des commerciaux : <span className="font-bold">{coutCommerciaux} €</span></div>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 text-gray-400 italic">
        <div>Autres données (brouillon à compléter)</div>
      </div>
    </div>
  );
} 