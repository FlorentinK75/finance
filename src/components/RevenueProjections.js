import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { segmentColors } from '../data/defaultData';

const RevenueProjections = ({ projections, inputs }) => {
  // Préparation des données pour les graphiques
  const revenueData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'Petites Assos': Number(projections.revenue.smallAssociations[index].toFixed(0)),
    'Grandes Assos': Number(projections.revenue.largeAssociations[index].toFixed(0)),
    'Collectivités': Number(projections.revenue.localAuthorities[index].toFixed(0)),
    'Upsell': Number(projections.revenue.upsell[index].toFixed(0)),
    'Total': Number(projections.revenue.total[index].toFixed(0)),
  }));

  const clientsData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'Petites Assos': Math.round(projections.clients.smallAssociations[index]),
    'Grandes Assos': Math.round(projections.clients.largeAssociations[index]),
    'Collectivités': Math.round(projections.clients.localAuthorities.total[index]),
    'Total': Math.round(projections.clients.total[index]),
  }));

  const upsellData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'Mutualisation': Number(projections.upsellBreakdown.mutualization[index].toFixed(0)),
    'Assistant IA': Number(projections.upsellBreakdown.aiAssistant[index].toFixed(0)),
    'Communication': Number(projections.upsellBreakdown.communication[index].toFixed(0)),
    'Subventions': Number(projections.upsellBreakdown.subsidies[index].toFixed(0)),
    'Total': Number(projections.revenue.upsell[index].toFixed(0)),
  }));

  // Calcul du revenu par segment pour le pieChart (dernière année)
  const lastQuarterIndex = projections.quarters.length - 1;
  const lastYearRevenue = {
    'Petites Assos': projections.revenue.smallAssociations.slice(-4).reduce((a, b) => a + b, 0),
    'Grandes Assos': projections.revenue.largeAssociations.slice(-4).reduce((a, b) => a + b, 0),
    'Collectivités': projections.revenue.localAuthorities.slice(-4).reduce((a, b) => a + b, 0),
    'Upsell': projections.revenue.upsell.slice(-4).reduce((a, b) => a + b, 0),
  };

  const revenueSegmentsPie = Object.entries(lastYearRevenue).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(0)),
  }));

  // Données pour les prévisions vs cible
  const targetData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'Revenu Réel': Number(projections.revenue.total[index].toFixed(0)),
    'Cible': Number((projections.revenue.total[index] - projections.targetComparison[index]).toFixed(0)),
    'Écart': Number(projections.targetComparison[index].toFixed(0)),
  }));

  // Fonction d'aide pour formater les euros
  const formatEuro = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  // Configuration du tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper style={{ padding: 10 }}>
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" mb={0.5}>
              <Box 
                width={12} 
                height={12} 
                bgcolor={entry.color}
                mr={1}
                borderRadius="50%"
              />
              <Typography variant="body2">
                {entry.name}: {formatEuro(entry.value)}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Évolution du chiffre d'affaires par segment
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={revenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Mutualisation" stackId="a" fill="#8884d8" />
              <Bar dataKey="Assistant IA" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Communication" stackId="a" fill="#ffc658" />
              <Bar dataKey="Subventions" stackId="a" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Progression vs objectif de revenu
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={targetData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Revenu Réel" 
                stroke="#2196f3" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Cible" 
                stroke="#ff5722" 
                strokeWidth={2}
                strokeDasharray="5 5"
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tableau détaillé des projections
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Trimestre</th>
                  <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>Petites assos</th>
                  <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>Grandes assos</th>
                  <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>Collectivités</th>
                  <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>Upsell</th>
                  <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>CA Total</th>
                  <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>Dépenses</th>
                  <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>Résultat</th>
                </tr>
              </thead>
              <tbody>
                {projections.quarters.map((quarter, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: 12, borderBottom: '1px solid #ddd' }}>{quarter}</td>
                    <td style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                      {formatEuro(projections.revenue.smallAssociations[index])}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                      {formatEuro(projections.revenue.largeAssociations[index])}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                      {formatEuro(projections.revenue.localAuthorities[index])}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                      {formatEuro(projections.revenue.upsell[index])}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                      {formatEuro(projections.revenue.total[index])}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                      {formatEuro(projections.expenses.total[index])}
                    </td>
                    <td style={{ 
                      padding: 12, 
                      textAlign: 'right', 
                      borderBottom: '1px solid #ddd',
                      color: projections.profitLoss[index] >= 0 ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {formatEuro(projections.profitLoss[index])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RevenueProjections;} />
              <Legend />
              <Bar dataKey="Petites Assos" stackId="a" fill={segmentColors.smallAssociations} />
              <Bar dataKey="Grandes Assos" stackId="a" fill={segmentColors.largeAssociations} />
              <Bar dataKey="Collectivités" stackId="a" fill={segmentColors.localAuthorities} />
              <Bar dataKey="Upsell" stackId="a" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Répartition du CA en Année 3
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={revenueSegmentsPie}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {revenueSegmentsPie.map((entry, index) => {
                  const colors = [
                    segmentColors.smallAssociations,
                    segmentColors.largeAssociations,
                    segmentColors.localAuthorities,
                    '#8884d8'
                  ];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Pie>
              <Tooltip formatter={(value) => formatEuro(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Évolution du nombre de clients
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={clientsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Petites Assos" 
                stroke={segmentColors.smallAssociations} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Grandes Assos" 
                stroke={segmentColors.largeAssociations} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Collectivités" 
                stroke={segmentColors.localAuthorities} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Total" 
                stroke="#000000" 
                activeDot={{ r: 8 }} 
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Détail des revenus d'upsell
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={upsellData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} />
              <Tooltip content={<CustomTooltip />