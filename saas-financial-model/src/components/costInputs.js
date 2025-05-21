import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  TextField, 
  Slider, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PercentIcon from '@mui/icons-material/Percent';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const CostInputs = ({ inputs, onChange, expanded, handleAccordionChange }) => {
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
    <>
      <Grid item xs={12}>
        <Accordion 
          expanded={expanded === 'churn'} 
          onChange={handleAccordionChange('churn')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              <PercentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Taux de Churn
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Salaires annuels</Typography>
                  <TextField
                    fullWidth
                    label="Fondateur"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.costs.salaries.founder.annual}
                    onChange={(e) => handleNumberChange('costs.salaries.founder.annual', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Développement & SAV"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.costs.salaries.development.annual}
                    onChange={(e) => handleNumberChange('costs.salaries.development.annual', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Commercial"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.costs.salaries.sales.annual}
                    onChange={(e) => handleNumberChange('costs.salaries.sales.annual', e.target.value)}
                    margin="normal"
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Seuils de recrutement</Typography>
                  <TextField
                    fullWidth
                    label="Dev+SAV (1 par X clients)"
                    type="number"
                    value={inputs.costs.salaries.development.addPerClients}
                    onChange={(e) => handleNumberChange('costs.salaries.development.addPerClients', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Commercial (1 par X clients)"
                    type="number"
                    value={inputs.costs.salaries.sales.addPerClients}
                    onChange={(e) => handleNumberChange('costs.salaries.sales.addPerClients', e.target.value)}
                    margin="normal"
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Coûts techniques annuels</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Hébergement & BDD"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        value={inputs.costs.technical.hosting}
                        onChange={(e) => handleNumberChange('costs.technical.hosting', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Nom de domaine + SSL"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        value={inputs.costs.technical.domain}
                        onChange={(e) => handleNumberChange('costs.technical.domain', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="SaaS outils internes"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        value={inputs.costs.technical.internalTools}
                        onChange={(e) => handleNumberChange('costs.technical.internalTools', e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="RGPD/Sécurité/DPO"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        value={inputs.costs.technical.security}
                        onChange={(e) => handleNumberChange('costs.technical.security', e.target.value)}
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
          expanded={expanded === 'growth'} 
          onChange={handleAccordionChange('growth')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Croissance et acquisition
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Croissance organique</Typography>
                  <Typography gutterBottom>
                    Taux annuel: {inputs.growth.organic.annual * 100}%
                  </Typography>
                  <Slider
                    value={inputs.growth.organic.annual}
                    onChange={(e, newValue) => handleSliderChange('growth.organic.annual', newValue)}
                    step={0.01}
                    min={0}
                    max={0.5}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Méthodes d'acquisition</Typography>
                  <TextField
                    fullWidth
                    label="Coût emailings (€/mois)"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.growth.acquisition.emailCost}
                    onChange={(e) => handleNumberChange('growth.acquisition.emailCost', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Leads générés par email/mois"
                    type="number"
                    value={inputs.growth.acquisition.emailLeads}
                    onChange={(e) => handleNumberChange('growth.acquisition.emailLeads', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Coût forums (€/trimestre)"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    value={inputs.growth.acquisition.forumsCost}
                    onChange={(e) => handleNumberChange('growth.acquisition.forumsCost', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Contacts qualifiés forums/trimestre"
                    type="number"
                    value={inputs.growth.acquisition.forumsContacts}
                    onChange={(e) => handleNumberChange('growth.acquisition.forumsContacts', e.target.value)}
                    margin="normal"
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Conversion commerciale</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography gutterBottom>
                        Webinaire : Taux RDV1 → RDV2 ({inputs.acquisition.conversion.webinar.meeting1ToMeeting2Rate * 100}%)
                      </Typography>
                      <Slider
                        value={inputs.acquisition.conversion.webinar.meeting1ToMeeting2Rate}
                        onChange={(e, newValue) => handleSliderChange('acquisition.conversion.webinar.meeting1ToMeeting2Rate', newValue)}
                        step={0.01}
                        min={0}
                        max={1}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                      />
                      <Typography gutterBottom>
                        Webinaire : Taux RDV2 → Client ({inputs.acquisition.conversion.webinar.meeting2ToClientRate * 100}%)
                      </Typography>
                      <Slider
                        value={inputs.acquisition.conversion.webinar.meeting2ToClientRate}
                        onChange={(e, newValue) => handleSliderChange('acquisition.conversion.webinar.meeting2ToClientRate', newValue)}
                        step={0.01}
                        min={0}
                        max={1}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography gutterBottom>
                        Visio : Taux RDV1 → RDV2 ({inputs.acquisition.conversion.videoCall.meeting1ToMeeting2Rate * 100}%)
                      </Typography>
                      <Slider
                        value={inputs.acquisition.conversion.videoCall.meeting1ToMeeting2Rate}
                        onChange={(e, newValue) => handleSliderChange('acquisition.conversion.videoCall.meeting1ToMeeting2Rate', newValue)}
                        step={0.01}
                        min={0}
                        max={1}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                      />
                      <Typography gutterBottom>
                        Visio : Taux RDV2 → Client ({inputs.acquisition.conversion.videoCall.meeting2ToClientRate * 100}%)
                      </Typography>
                      <Slider
                        value={inputs.acquisition.conversion.videoCall.meeting2ToClientRate}
                        onChange={(e, newValue) => handleSliderChange('acquisition.conversion.videoCall.meeting2ToClientRate', newValue)}
                        step={0.01}
                        min={0}
                        max={1}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(x) => `${(x * 100).toFixed(0)}%`}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Rendez-vous par semaine par commercial"
                        type="number"
                        value={inputs.acquisition.meetings.perWeek}
                        onChange={(e) => handleNumberChange('acquisition.meetings.perWeek', e.target.value)}
                        margin="normal"
                      />
                      <TextField
                        fullWidth
                        label="CAC moyen par client (€)"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                        value={inputs.acquisition.cacPerClient}
                        onChange={(e) => handleNumberChange('acquisition.cacPerClient', e.target.value)}
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
    </>
  );
};

export default CostInputs;