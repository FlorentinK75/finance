import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  TextField, 
  Slider, 
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EuroIcon from '@mui/icons-material/Euro';
import PeopleIcon from '@mui/icons-material/People';
import PercentIcon from '@mui/icons-material/Percent';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CostInputs from './costInputs';

const InputsForm = ({ inputs, onChange }) => {
  const [expanded, setExpanded] = useState('clients');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleNumberChange = (path, value) => {
    const newValue = Number(value);
    if (!isNaN(newValue)) {
      const pathArray = path.split('.');
      let newInputs = { ...inputs };
      let current = newInputs;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }
      
      current[pathArray[pathArray.length - 1]] = newValue;
      onChange(newInputs);
    }
  };
  
  const handleSliderChange = (path, value) => {
    const pathArray = path.split('.');
    let newInputs = { ...inputs };
    let current = newInputs;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) {
        current[pathArray[i]] = {};
      }
      current = current[pathArray[i]];
    }
    
    current[pathArray[pathArray.length - 1]] = value;
    onChange(newInputs);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Paramètres du modèle financier
        </Typography>
        <TextField
          fullWidth
          label="Objectif de CA annuel"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
          value={inputs.targetRevenue}
          onChange={(e) => handleNumberChange('targetRevenue', e.target.value)}
          margin="normal"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Accordion 
          expanded={expanded === 'clients'} 
          onChange={handleAccordionChange('clients')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Répartition initiale des clients
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Petites associations</Typography>
                  <TextField
                    fullWidth
                    label="Nombre initial"
                    type="number"
                    value={inputs.initialDistribution.smallAssociations}
                    onChange={(e) => handleNumberChange('initialDistribution.smallAssociations', e.target.value)}
                    margin="normal"
                  />
                  <Typography gutterBottom>
                    Taux de paiement annuel: {inputs.annualPaymentRate.smallAssociations * 100}%
                  </Typography>
                  <Slider
                    value={inputs.annualPaymentRate.smallAssociations}
                    onChange={(e, newValue) => handleSliderChange('annualPaymentRate.smallAssociations', newValue)}
                    step={0.01}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Grandes associations</Typography>
                  <TextField
                    fullWidth
                    label="Nombre initial"
                    type="number"
                    value={inputs.initialDistribution.largeAssociations}
                    onChange={(e) => handleNumberChange('initialDistribution.largeAssociations', e.target.value)}
                    margin="normal"
                  />
                  <Typography gutterBottom>
                    Taux de paiement annuel: {inputs.annualPaymentRate.largeAssociations * 100}%
                  </Typography>
                  <Slider
                    value={inputs.annualPaymentRate.largeAssociations}
                    onChange={(e, newValue) => handleSliderChange('annualPaymentRate.largeAssociations', newValue)}
                    step={0.01}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Collectivités (packs)</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Pack 10"
                        type="number"
                        value={inputs.initialDistribution.localAuthorities.pack10}
                        onChange={(e) => handleNumberChange('initialDistribution.localAuthorities.pack10', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Pack 20"
                        type="number"
                        value={inputs.initialDistribution.localAuthorities.pack20}
                        onChange={(e) => handleNumberChange('initialDistribution.localAuthorities.pack20', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Pack 50"
                        type="number"
                        value={inputs.initialDistribution.localAuthorities.pack50}
                        onChange={(e) => handleNumberChange('initialDistribution.localAuthorities.pack50', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Pack 100"
                        type="number"
                        value={inputs.initialDistribution.localAuthorities.pack100}
                        onChange={(e) => handleNumberChange('initialDistribution.localAuthorities.pack100', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      
      <Grid item xs={12}>
        <Accordion 
          expanded={expanded === 'pricing'} 
          onChange={handleAccordionChange('pricing')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              <EuroIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Tarification
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Petites associations</Typography>
                  <TextField
                    fullWidth
                    label="Prix mensuel"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.pricing.smallAssociation.monthlyPrice}
                    onChange={(e) => handleNumberChange('pricing.smallAssociation.monthlyPrice', e.target.value)}
                    margin="normal"
                  />
                  <Typography gutterBottom>
                    Réduction annuelle: {inputs.pricing.smallAssociation.yearlyDiscount * 100}%
                  </Typography>
                  <Slider
                    value={inputs.pricing.smallAssociation.yearlyDiscount}
                    onChange={(e, newValue) => handleSliderChange('pricing.smallAssociation.yearlyDiscount', newValue)}
                    step={0.01}
                    min={0}
                    max={0.3}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Grandes associations</Typography>
                  <TextField
                    fullWidth
                    label="Prix mensuel"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.pricing.largeAssociation.monthlyPrice}
                    onChange={(e) => handleNumberChange('pricing.largeAssociation.monthlyPrice', e.target.value)}
                    margin="normal"
                  />
                  <Typography gutterBottom>
                    Réduction annuelle: {inputs.pricing.largeAssociation.yearlyDiscount * 100}%
                  </Typography>
                  <Slider
                    value={inputs.pricing.largeAssociation.yearlyDiscount}
                    onChange={(e, newValue) => handleSliderChange('pricing.largeAssociation.yearlyDiscount', newValue)}
                    step={0.01}
                    min={0}
                    max={0.3}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Collectivités (packs)</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Prix Pack 10"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        value={inputs.pricing.localAuthority.pack10.price}
                        onChange={(e) => handleNumberChange('pricing.localAuthority.pack10.price', e.target.value)}
                        margin="normal"
                      />
                      <Typography variant="caption">
                        Remise: {inputs.pricing.localAuthority.pack10.discount * 100}%
                      </Typography>
                      <Slider
                        value={inputs.pricing.localAuthority.pack10.discount}
                        onChange={(e, newValue) => handleSliderChange('pricing.localAuthority.pack10.discount', newValue)}
                        step={0.01}
                        min={0}
                        max={0.3}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Prix Pack 20"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        value={inputs.pricing.localAuthority.pack20.price}
                        onChange={(e) => handleNumberChange('pricing.localAuthority.pack20.price', e.target.value)}
                        margin="normal"
                      />
                      <Typography variant="caption">
                        Remise: {inputs.pricing.localAuthority.pack20.discount * 100}%
                      </Typography>
                      <Slider
                        value={inputs.pricing.localAuthority.pack20.discount}
                        onChange={(e, newValue) => handleSliderChange('pricing.localAuthority.pack20.discount', newValue)}
                        step={0.01}
                        min={0}
                        max={0.3}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Prix Pack 50"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        value={inputs.pricing.localAuthority.pack50.price}
                        onChange={(e) => handleNumberChange('pricing.localAuthority.pack50.price', e.target.value)}
                        margin="normal"
                      />
                      <Typography variant="caption">
                        Remise: {inputs.pricing.localAuthority.pack50.discount * 100}%
                      </Typography>
                      <Slider
                        value={inputs.pricing.localAuthority.pack50.discount}
                        onChange={(e, newValue) => handleSliderChange('pricing.localAuthority.pack50.discount', newValue)}
                        step={0.01}
                        min={0}
                        max={0.3}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Prix Pack 100"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        value={inputs.pricing.localAuthority.pack100.price}
                        onChange={(e) => handleNumberChange('pricing.localAuthority.pack100.price', e.target.value)}
                        margin="normal"
                      />
                      <Typography variant="caption">
                        Remise: {inputs.pricing.localAuthority.pack100.discount * 100}%
                      </Typography>
                      <Slider
                        value={inputs.pricing.localAuthority.pack100.discount}
                        onChange={(e, newValue) => handleSliderChange('pricing.localAuthority.pack100.discount', newValue)}
                        step={0.01}
                        min={0}
                        max={0.3}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      
      <Grid item xs={12}>
        <Accordion 
          expanded={expanded === 'upsell'} 
          onChange={handleAccordionChange('upsell')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              <PercentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Modules d'Upsell
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Mutualisation</Typography>
                  <TextField
                    fullWidth
                    label="Prix annuel"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.upsells.mutualization.pricePerYear}
                    onChange={(e) => handleNumberChange('upsells.mutualization.pricePerYear', e.target.value)}
                    margin="normal"
                  />
                  <Typography gutterBottom>
                    Taux d'adoption (collectivités): {inputs.upsells.mutualization.adoptionRate.localAuthorities * 100}%
                  </Typography>
                  <Slider
                    value={inputs.upsells.mutualization.adoptionRate.localAuthorities}
                    onChange={(e, newValue) => handleSliderChange('upsells.mutualization.adoptionRate.localAuthorities', newValue)}
                    step={0.01}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6} lg={4}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Assistant IA</Typography>
                  <TextField
                    fullWidth
                    label="Prix mensuel"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.upsells.aiAssistant.pricePerMonth}
                    onChange={(e) => handleNumberChange('upsells.aiAssistant.pricePerMonth', e.target.value)}
                    margin="normal"
                  />
                  <Typography gutterBottom>
                    Taux d'adoption (petites & grandes): 
                  </Typography>
                  <Slider
                    value={inputs.upsells.aiAssistant.adoptionRate.smallAssociations}
                    onChange={(e, newValue) => {
                      const newInputs = { ...inputs };
                      newInputs.upsells.aiAssistant.adoptionRate.smallAssociations = newValue;
                      newInputs.upsells.aiAssistant.adoptionRate.largeAssociations = newValue;
                      onChange(newInputs);
                    }}
                    step={0.01}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6} lg={4}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Communication</Typography>
                  <TextField
                    fullWidth
                    label="Prix mensuel"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.upsells.communication.pricePerMonth}
                    onChange={(e) => handleNumberChange('upsells.communication.pricePerMonth', e.target.value)}
                    margin="normal"
                  />
                  <Typography gutterBottom>
                    Taux d'adoption (petites & grandes): 
                  </Typography>
                  <Slider
                    value={inputs.upsells.communication.adoptionRate.smallAssociations}
                    onChange={(e, newValue) => {
                      const newInputs = { ...inputs };
                      newInputs.upsells.communication.adoptionRate.smallAssociations = newValue;
                      newInputs.upsells.communication.adoptionRate.largeAssociations = newValue;
                      onChange(newInputs);
                    }}
                    step={0.01}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6} lg={4}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Subventions</Typography>
                  <TextField
                    fullWidth
                    label="Prix annuel"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.upsells.subsidies.pricePerYear}
                    onChange={(e) => handleNumberChange('upsells.subsidies.pricePerYear', e.target.value)}
                    margin="normal"
                  />
                  <Typography gutterBottom>
                    Taux d'adoption (petites & grandes): 
                  </Typography>
                  <Slider
                    value={inputs.upsells.subsidies.adoptionRate.smallAssociations}
                    onChange={(e, newValue) => {
                      const newInputs = { ...inputs };
                      newInputs.upsells.subsidies.adoptionRate.smallAssociations = newValue;
                      newInputs.upsells.subsidies.adoptionRate.largeAssociations = newValue;
                      onChange(newInputs);
                    }}
                    step={0.01}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                  />
                </Paper>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default InputsForm;