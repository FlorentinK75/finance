import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import theme from './theme';
import InputsForm from './components/InputsForm';
import RevenueProjections from './components/RevenueProjections';
import FinancialDashboard from './components/FinancialDashboard';
import CashFlow from './components/CashFlow';
import SaasMetrics from './components/SaasMetrics';
import ScenarioManager from './components/ScenarioManager';
import { calculateProjections } from './utils/financialCalculations';
import { defaultInputs } from './data/defaultData';

function App() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [projections, setProjections] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [scenarios, setScenarios] = useState([
    { name: 'Scénario de base', inputs: defaultInputs }
  ]);
  const [currentScenario, setCurrentScenario] = useState('Scénario de base');

  useEffect(() => {
    // Calculer les projections à chaque changement d'entrée
    const result = calculateProjections(inputs);
    setProjections(result);
  }, [inputs]);

  const handleInputChange = (newInputs) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      ...newInputs
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const saveScenario = (name) => {
    const newScenario = { name, inputs: { ...inputs } };
    setScenarios(prev => {
      // Vérifier si le scénario existe déjà
      const index = prev.findIndex(s => s.name === name);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = newScenario;
        return updated;
      }
      return [...prev, newScenario];
    });
    setCurrentScenario(name);
  };

  const loadScenario = (name) => {
    const scenario = scenarios.find(s => s.name === name);
    if (scenario) {
      setInputs(scenario.inputs);
      setCurrentScenario(name);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            📊 Modèle Financier SaaS - InfinityHelp
          </Typography>
          
          <ScenarioManager 
            scenarios={scenarios} 
            currentScenario={currentScenario}
            onSave={saveScenario}
            onLoad={loadScenario}
          />

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 3 }}
            >
              <Tab label="Paramètres" />
              <Tab label="Projections de Revenus" />
              <Tab label="Tableaux de Bord" />
              <Tab label="Flux de Trésorerie" />
              <Tab label="Métriques SaaS" />
            </Tabs>

            {tabValue === 0 && (
              <InputsForm 
                inputs={inputs} 
                onChange={handleInputChange} 
              />
            )}
            
            {tabValue === 1 && projections && (
              <RevenueProjections 
                projections={projections}
                inputs={inputs}
              />
            )}
            
            {tabValue === 2 && projections && (
              <FinancialDashboard 
                projections={projections}
                inputs={inputs}
              />
            )}
            
            {tabValue === 3 && projections && (
              <CashFlow 
                projections={projections}
                inputs={inputs}
              />
            )}
            
            {tabValue === 4 && projections && (
              <SaasMetrics 
                projections={projections}
                inputs={inputs}
              />
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;