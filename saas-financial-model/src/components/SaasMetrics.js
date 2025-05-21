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
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const SaasMetrics = ({ projections, inputs }) => {
  // Préparation des données pour les graphiques
  const arpuData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'ARPU': Number(projections.metrics.arpu[index].toFixed(0)),
  }));

  const churnData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'Petites Assos': Number((projections.metrics.churnRate.smallAssociations[index] * 100).toFixed(2)),
    'Grandes Assos': Number((projections.metrics.churnRate.largeAssociations[index] * 100).toFixed(2)),
    'Collectivités': Number((projections.metrics.churnRate.localAuthorities[index] * 100).toFixed(2)),
    'Moyen': Number((projections.metrics.churnRate.average[index] * 100).toFixed(2)),
  }));

  const cacLtvData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'CAC': Number(projections.metrics.cac[index].toFixed(0)),
    'LTV': Number(projections.metrics.ltv[index].toFixed(0)),
    'LTV/CAC': Number(projections.metrics.ltvCacRatio[index].toFixed(2)),
    'CAC Payback (mois)': Number(projections.metrics.cacPayback[index].toFixed(1)),
  }));

  const nrrData = projections.quarters.map((quarter, index) => ({
    name: quarter,
    'NRR': Number((projections.metrics.nrr[index] * 100).toFixed(1)),
  }));

  // Créer les données pour le RadarChart (métriques de la dernière période)
  const lastIndex = projections.quarters.length - 1;
  const radarData = [
    {
      subject: 'LTV/CAC',
      A: Math.min(5, projections.metrics.ltvCacRatio[lastIndex]), // Plafonné à 5 pour la lisibilité
      fullMark: 5,
    },
    {
      subject: 'NRR (annualisé)',
      A: projections.metrics.nrr[lastIndex],
      fullMark: 1.5,
    },
    {
      subject: 'Rule of 40',
      A: Math.max(0, Math.min(projections.metrics.ruleOf40[lastIndex] / 40, 1)), // Normalisé [0-1]
      fullMark: 1,
    },
    {
      subject: 'Rétention',
      A: 1 - projections.metrics.churnRate.average[lastIndex],
      fullMark: 1,
    },
    {
      subject: 'Marge',
      A: Math.max(0, Math.min(projections.metrics.operatingMargin[lastIndex], 0.5)), // Normalisé [0-0.5]
      fullMark: 0.5,
    },
  ];

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
                  entry.name === 'ARPU' || entry.name === 'CAC' || entry.name === 'LTV'
                    ? formatEuro(entry.value)
                    : entry.name.includes('%') || entry.name === 'NRR'
                      ? `${entry.value}%`
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

  // Calculer les moyennes sur l'année 3
  const year3Start = 8; // Index de départ pour l'année 3 (T1 année 3)
  const calculateYear3Average = (metricsArray) => {
    return metricsArray.slice(year3Start).reduce((a, b) => a + b, 0) / 4;
  };

  const averageArpu = calculateYear3Average(projections.metrics.arpu);
  const averageChurn = calculateYear3Average(projections.metrics.churnRate.average) * 100;
  const averageLtvCacRatio = calculateYear3Average(projections.metrics.ltvCacRatio);
  const averageNrr = calculateYear3Average(projections.metrics.nrr) * 100;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Indicateurs SaaS clés (moyenne année 3)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
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
                  ARPU
                </Typography>
                <Typography variant="h5">
                  {formatEuro(averageArpu)}
                </Typography>
                <Typography variant="caption">
                  par an
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
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
                  Churn
                </Typography>
                <Typography variant="h5">
                  {averageChurn.toFixed(1)}%
                </Typography>
                <Typography variant="caption">
                  mensuel
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: averageLtvCacRatio >= 3 ? 'success.light' : 'warning.light', 
                  color: 'white'
                }}
              >
                <Typography variant="subtitle2">
                  LTV/CAC
                </Typography>
                <Typography variant="h5">
                  {averageLtvCacRatio.toFixed(1)}x
                </Typography>
                <Typography variant="caption">
                  {averageLtvCacRatio >= 3 ? 'Excellent' : 'À améliorer'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: averageNrr >= 100 ? 'success.light' : 'warning.light', 
                  color: 'white'
                }}
              >
                <Typography variant="subtitle2">
                  NRR
                </Typography>
                <Typography variant="h5">
                  {averageNrr.toFixed(1)}%
                </Typography>
                <Typography variant="caption">
                  {averageNrr >= 100 ? 'Croissance' : 'Contraction'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Acquisition et rétention clients
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Évolution du churn par segment
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={churnData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis domain={[0, 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Petites Assos" 
                    stroke="#1976d2" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Grandes Assos" 
                    stroke="#388e3c" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Collectivités" 
                    stroke="#f57c00" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Moyen" 
                    stroke="#000000" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Net Revenue Retention (NRR)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={nrrData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis domain={[80, 120]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine y={100} stroke="red" strokeDasharray="3 3" />
                  <Area 
                    type="monotone" 
                    dataKey="NRR" 
                    stroke="#8884d8" 
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Santé SaaS globale
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={130} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 1]} tickCount={6} />
              <Radar
                name="Métriques actuelles"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  const metric = props.payload.subject;
                  if (metric === 'LTV/CAC') {
                    return [projections.metrics.ltvCacRatio[lastIndex].toFixed(1) + 'x', metric];
                  } else if (metric === 'NRR (annualisé)') {
                    return [(projections.metrics.nrr[lastIndex] * 100).toFixed(1) + '%', metric];
                  } else if (metric === 'Rule of 40') {
                    return [projections.metrics.ruleOf40[lastIndex].toFixed(1), metric];
                  } else if (metric === 'Rétention') {
                    return [((1 - projections.metrics.churnRate.average[lastIndex]) * 100).toFixed(1) + '%', metric];
                  } else if (metric === 'Marge') {
                    return [(projections.metrics.operatingMargin[lastIndex] * 100).toFixed(1) + '%', metric];
                  }
                  return [value, name];
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            ARPU (Average Revenue Per User)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={arpuData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `${Math.round(value)}€`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="ARPU" 
                stroke="#2196f3" 
                fill="#bbdefb"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            CAC, LTV et CAC Payback
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={cacLtvData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis yAxisId="left" tickFormatter={(value) => `${Math.round(value / 100) / 10}k€`} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="CAC" fill="#f44336" />
              <Bar yAxisId="left" dataKey="LTV" fill="#4caf50" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="LTV/CAC" 
                stroke="#9c27b0" 
                strokeWidth={2}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="CAC Payback (mois)" 
                stroke="#ff9800" 
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

// Composant ComposedChart n'a pas été importé, ajoutons-le
const { ComposedChart } = require('recharts');

export default SaasMetrics;