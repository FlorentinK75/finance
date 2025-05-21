import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';

const CashFlow = ({ projections }) => {
  // Préparation des données pour les graphiques
  const monthlyData = Array(36).fill().map((_, index) => {
    const year = Math.floor(index / 12) + 1;
    const month = index % 12 + 1;
    return {
      name: `M${month}-A${year}`,
      'Flux mensuel': Number(projections.cashFlow.monthly[index].toFixed(0)),
      'Trésorerie cumulée': Number(projections.cashFlow.cumulative[index].toFixed(0)),
    };
  });

  // Regrouper par trimestre pour la visualisation
  const quarterlyData = projections.quarters.map((quarter, index) => {
    const startMonth = index * 3;
    const monthlySum = projections.cashFlow.monthly.slice(startMonth, startMonth + 3).reduce((a, b) => a + b, 0);
    return {
      name: quarter,
      'Flux trimestriel': Number(monthlySum.toFixed(0)),
      'Trésorerie fin de période': Number(projections.cashFlow.cumulative[startMonth + 2].toFixed(0)),
    };
  });

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

  // Statistiques sur la trésorerie
  const lowestCashPoint = Math.min(...projections.cashFlow.cumulative);
  const highestCashPoint = Math.max(...projections.cashFlow.cumulative);
  const finalCashPosition = projections.cashFlow.cumulative[projections.cashFlow.cumulative.length - 1];
  const lowestMonth = projections.cashFlow.cumulative.indexOf(lowestCashPoint);
  const highestMonth = projections.cashFlow.cumulative.indexOf(highestCashPoint);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Points clés de trésorerie
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: finalCashPosition >= 0 ? 'success.light' : 'error.dark', 
                  color: 'white'
                }}
              >
                <Typography variant="subtitle2">
                  Position finale
                </Typography>
                <Typography variant="h5">
                  {formatEuro(finalCashPosition)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: lowestCashPoint >= 0 ? 'info.light' : 'error.light', 
                  color: 'white'
                }}
              >
                <Typography variant="subtitle2">
                  Point le plus bas
                </Typography>
                <Typography variant="h5">
                  {formatEuro(lowestCashPoint)}
                </Typography>
                <Typography variant="caption">
                  {monthlyData[lowestMonth]?.name}
                </Typography>
              </Paper>
            </Grid>
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
                  Point le plus haut
                </Typography>
                <Typography variant="h5">
                  {formatEuro(highestCashPoint)}
                </Typography>
                <Typography variant="caption">
                  {monthlyData[highestMonth]?.name}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: 'secondary.light', 
                  color: 'white'
                }}
              >
                <Typography variant="subtitle2">
                  Variation moyenne mensuelle
                </Typography>
                <Typography variant="h5">
                  {formatEuro(finalCashPosition / 36)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Évolution de la trésorerie (36 mois)
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60} 
                interval={2}
              />
              <YAxis 
                tickFormatter={(value) => `${Math.round(value / 1000)}k€`} 
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
              <Area 
                type="monotone" 
                dataKey="Trésorerie cumulée" 
                stroke="#2196f3" 
                fill="#bbdefb" 
                fillOpacity={0.8}
              />
              <Line 
                type="monotone" 
                dataKey="Flux mensuel" 
                stroke="#ff5722" 
                dot={false}
                strokeWidth={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Flux de trésorerie trimestriels
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={quarterlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
              <Bar 
                dataKey="Flux trimestriel" 
                fill="#2196f3"
                shape={(props) => {
                  return (
                    <rect
                      {...props}
                      fill={props.y >= 0 ? '#4caf50' : '#f44336'}
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Position de trésorerie à la fin de chaque trimestre
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={quarterlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="Trésorerie fin de période" 
                stroke="#9c27b0" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tableau détaillé des flux de trésorerie
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Mois</th>
                  <th style={{ padding: 10, textAlign: 'right', borderBottom: '1px solid #ddd' }}>Flux mensuel</th>
                  <th style={{ padding: 10, textAlign: 'right', borderBottom: '1px solid #ddd' }}>Trésorerie cumulée</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((month, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: 10, borderBottom: '1px solid #ddd' }}>{month.name}</td>
                    <td style={{ 
                      padding: 10, 
                      textAlign: 'right', 
                      borderBottom: '1px solid #ddd',
                      color: month['Flux mensuel'] >= 0 ? 'green' : 'red'
                    }}>
                      {formatEuro(month['Flux mensuel'])}
                    </td>
                    <td style={{ 
                      padding: 10, 
                      textAlign: 'right', 
                      borderBottom: '1px solid #ddd',
                      fontWeight: 'bold',
                      color: month['Trésorerie cumulée'] >= 0 ? 'green' : 'red'
                    }}>
                      {formatEuro(month['Trésorerie cumulée'])}
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

export default CashFlow;