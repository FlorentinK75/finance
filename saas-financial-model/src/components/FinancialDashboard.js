import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ComposedChart,
  Bar
} from 'recharts';
import { segmentColors } from '../data/defaultData';

const FinancialDashboard = ({ projections, inputs }) => {
  // Préparation des données pour les graphiques
  const profitLossData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'Revenus': Number(projections.revenue.total[index].toFixed(0)),
    'Dépenses': Number(projections.expenses.total[index].toFixed(0)),
    'Résultat': Number(projections.profitLoss[index].toFixed(0)),
  }));

  const expensesData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'Salaires': Number(projections.expenses.salaries[index].toFixed(0)),
    'Technique': Number(projections.expenses.technical[index].toFixed(0)),
    'Marketing': Number(projections.expenses.marketing[index].toFixed(0)),
    'Total': Number(projections.expenses.total[index].toFixed(0)),
  }));

  const staffingData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'Fondateur': projections.staffing.founder[index],
    'Développement': projections.staffing.development[index],
    'Commercial': projections.staffing.sales[index],
    'Total': projections.staffing.total[index],
  }));

  const marginData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'Marge Opérationnelle': Number((projections.metrics.operatingMargin[index] * 100).toFixed(1)),
    'Rule of 40': Number(projections.metrics.ruleOf40[index].toFixed(1)),
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
                {entry.name}: {
                  entry.name.includes('Marge') || entry.name.includes('Rule') 
                    ? `${entry.value}%` 
                    : typeof entry.value === 'number' && !Number.isInteger(entry.value)
                      ? formatEuro(entry.value)
                      : entry.value
                }
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Calcul des indicateurs clés financiers
  const lastQuarterIndex = projections.quarters.length - 1;
  const totalRevenue3Years = projections.revenue.total.reduce((a, b) => a + b, 0);
  const totalExpenses3Years = projections.expenses.total.reduce((a, b) => a + b, 0);
  const totalProfit3Years = projections.profitLoss.reduce((a, b) => a + b, 0);
  const averageMargin = totalProfit3Years / totalRevenue3Years;
  const lastQuarterMargin = projections.profitLoss[lastQuarterIndex] / projections.revenue.total[lastQuarterIndex];
  
  // Calculer le revenu, les dépenses et le profit par année
  const calculateYearlyData = (dataArray) => {
    return [
      dataArray.slice(0, 4).reduce((a, b) => a + b, 0),
      dataArray.slice(4, 8).reduce((a, b) => a + b, 0),
      dataArray.slice(8, 12).reduce((a, b) => a + b, 0),
    ];
  };

  const yearlyRevenue = calculateYearlyData(projections.revenue.total);
  const yearlyExpenses = calculateYearlyData(projections.expenses.total);
  const yearlyProfit = calculateYearlyData(projections.profitLoss);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Récapitulatif financier
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: 'primary.light', 
                  color: 'white'
                }}
              >
                <Typography variant="subtitle2">
                  CA Total (3 ans)
                </Typography>
                <Typography variant="h5">
                  {formatEuro(totalRevenue3Years)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: 'error.light', 
                  color: 'white'
                }}
              >
                <Typography variant="subtitle2">
                  Dépenses (3 ans)
                </Typography>
                <Typography variant="h5">
                  {formatEuro(totalExpenses3Years)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: totalProfit3Years >= 0 ? 'success.light' : 'error.dark', 
                  color: 'white'
                }}
              >
                <Typography variant="subtitle2">
                  Résultat (3 ans)
                </Typography>
                <Typography variant="h5">
                  {formatEuro(totalProfit3Years)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: lastQuarterMargin >= 0 ? 'success.light' : 'error.dark', 
                  color: 'white'
                }}
              >
                <Typography variant="subtitle2">
                  Marge Dernière Période
                </Typography>
                <Typography variant="h5">
                  {(lastQuarterMargin * 100).toFixed(1)}%
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12} lg={8}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Revenus, dépenses et résultat
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={profitLossData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis 
                tickFormatter={(value) => `${Math.round(value / 1000)}k€`} 
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Revenus" fill={segmentColors.smallAssociations} />
              <Bar dataKey="Dépenses" fill={segmentColors.expenses} />
              <Line 
                type="monotone" 
                dataKey="Résultat" 
                stroke={segmentColors.profit} 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} lg={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Résultats annuels
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={[
                { name: 'Année 1', 'Revenus': yearlyRevenue[0], 'Dépenses': yearlyExpenses[0], 'Résultat': yearlyProfit[0] },
                { name: 'Année 2', 'Revenus': yearlyRevenue[1], 'Dépenses': yearlyExpenses[1], 'Résultat': yearlyProfit[1] },
                { name: 'Année 3', 'Revenus': yearlyRevenue[2], 'Dépenses': yearlyExpenses[2], 'Résultat': yearlyProfit[2] },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Revenus" 
                stackId="1"
                stroke={segmentColors.smallAssociations} 
                fill={segmentColors.smallAssociations} 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="Dépenses" 
                stackId="2"
                stroke={segmentColors.expenses} 
                fill={segmentColors.expenses} 
                fillOpacity={0.6}
              />
              <Line 
                type="monotone" 
                dataKey="Résultat" 
                stroke={segmentColors.profit} 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Détail des dépenses
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={expensesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Salaires" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="Technique" 
                stackId="1"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="Marketing" 
                stackId="1"
                stroke="#ffc658" 
                fill="#ffc658" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Équipe et recrutements
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={staffingData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="stepAfter" 
                dataKey="Fondateur" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
              />
              <Area 
                type="stepAfter" 
                dataKey="Développement" 
                stackId="1"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6}
              />
              <Area 
                type="stepAfter" 
                dataKey="Commercial" 
                stackId="1"
                stroke="#ffc658" 
                fill="#ffc658" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Marge opérationnelle et Rule of 40
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={marginData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Marge Opérationnelle" 
                stroke="#2196f3" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Rule of 40" 
                stroke="#ff5722" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
              <CartesianGrid y={40} stroke="#ff5722" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FinancialDashboard;