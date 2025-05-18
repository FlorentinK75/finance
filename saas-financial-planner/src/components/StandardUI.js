// components/StandardUI.js
import React from 'react';
import {
  PieChart, Pie, BarChart, Bar,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatPercent, formatNumber, CHART_COLORS } from '../utils/utils';

// 1. Tuile de coût simple
export const CostCard = ({ title, value, subtitle, className = "" }) => (
    <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">
        {value}
        {subtitle && <span className="text-sm ml-1 font-normal text-gray-500">({subtitle})</span>}
      </p>
    </div>
  );
  

// 2. Graphe circulaire
export const PieCostChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => formatCurrency(value)} />
    </PieChart>
  </ResponsiveContainer>
);

// 3. Graphe barres verticales
export const BarCostChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={100} />
      <Tooltip formatter={(value) => formatCurrency(value)} />
      <Legend />
      <Bar dataKey="value" name="Montant" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

// 4. Tableau récapitulatif
export const CostTable = ({ data, totalCosts, revenue, customers }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        {['Catégorie', 'Coût annuel', '% des coûts', '% du CA', 'Coût par client'].map((label, idx) => (
          <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item, index) => (
        <tr key={index}>
          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
          <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(item.value)}</td>
          <td className="px-6 py-4 text-sm text-gray-500">{formatPercent(item.percentage)}</td>
          <td className="px-6 py-4 text-sm text-gray-500">{formatPercent(item.value / revenue)}</td>
          <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(item.value / customers, 0)}</td>
        </tr>
      ))}
      <tr className="bg-gray-50">
        <td className="px-6 py-4 font-medium text-sm text-gray-900">Total</td>
        <td className="px-6 py-4 font-medium text-sm text-gray-900">{formatCurrency(totalCosts)}</td>
        <td className="px-6 py-4 font-medium text-sm text-gray-900">100%</td>
        <td className="px-6 py-4 font-medium text-sm text-gray-900">{formatPercent(totalCosts / revenue)}</td>
        <td className="px-6 py-4 font-medium text-sm text-gray-900">{formatCurrency(totalCosts / customers, 0)}</td>
      </tr>
    </tbody>
  </table>
);

export const InfoGridSection = ({ title, items }) => (
    <div className="bg-white p-4 rounded-lg shadow">
      {title && <h3 className="text-md font-semibold mb-3 text-gray-700">{title}</h3>}
      <div className="grid grid-cols-2 gap-4">
        {items.map(({ title, value, subtitle }, index) => (
          <CostCard key={index} title={title} value={value} subtitle={subtitle} />
        ))}
      </div>
    </div>
  );

  export const ChartBlock = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow">
      {title && <h3 className="text-md font-semibold mb-3 text-gray-700">{title}</h3>}
      <div className="h-64">{children}</div>
    </div>
  );

// 5. Champ input avec label
export const LabeledInput = ({
    label,
    value,
    onChange,
    readOnly = false,
    type = "number",
    step,
    min,
    max,
    className = ""
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        className={`w-full p-2 border rounded-md ${readOnly ? 'bg-gray-100' : ''} ${className}`}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        step={step}
        min={min}
        max={max}
      />
    </div>
  );
  
  // 6. Section de formulaire avec titre
  export const FormSection = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      {children}
    </div>
  );
  
  // 7. Grille responsive d'inputs
  export const InputGrid = ({ columns = 2, children }) => {
    const colClass =
      columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : columns === 2
        ? "grid-cols-2"
        : "grid-cols-1";
  
    return <div className={`grid ${colClass} gap-4`}>{children}</div>;
  };

  // StandardUI.js (ajoute à la fin)
export const SimpleTable = ({ headers, rows, total }) => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, i) => (
            <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {rows}
        {total}
      </tbody>
    </table>
  );

// Bloc standard pour une métrique
export const MetricBlock = ({ title, value, subtitle, statusClass, statusLabel }) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        {statusLabel && (
          <div className={`text-xs px-2 py-1 rounded mt-2 inline-block ${statusClass}`}>
            {statusLabel}
          </div>
        )}
      </div>
    </div>
  );

  export const StatGrid = ({ items }) => (
    <div className="grid grid-cols-2 gap-4">
      {items.map(({ title, value }, idx) => (
        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-xs font-medium text-gray-500 mb-1">{title}</h4>
          <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  );
  
  
  

  
  

  