import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Grid
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ScenarioManager = ({ scenarios, currentScenario, onSave, onLoad }) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [selectedScenario, setSelectedScenario] = useState("");

  const handleSaveClick = () => {
    setSaveDialogOpen(true);
    setScenarioName(currentScenario);
  };

  const handleLoadClick = () => {
    setLoadDialogOpen(true);
    setSelectedScenario(currentScenario);
  };

  const handleSaveConfirm = () => {
    if (scenarioName.trim()) {
      onSave(scenarioName.trim());
      setSaveDialogOpen(false);
    }
  };

  const handleLoadConfirm = () => {
    if (selectedScenario) {
      onLoad(selectedScenario);
      setLoadDialogOpen(false);
    }
  };

  const handleClose = () => {
    setSaveDialogOpen(false);
    setLoadDialogOpen(false);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 3, 
        bgcolor: 'primary.light', 
        color: 'primary.contrastText'
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="div">
            Scénario actuel: {currentScenario}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
            >
              Enregistrer
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FolderOpenIcon />}
              onClick={handleLoadClick}
            >
              Charger
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Dialogue de sauvegarde */}
      <Dialog open={saveDialogOpen} onClose={handleClose}>
        <DialogTitle>Enregistrer le scénario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Donnez un nom à votre scénario pour l'enregistrer. 
            Si un scénario avec ce nom existe déjà, il sera écrasé.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du scénario"
            type="text"
            fullWidth
            variant="outlined"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button 
            onClick={handleSaveConfirm} 
            color="primary"
            variant="contained"
            disabled={!scenarioName.trim()}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de chargement */}
      <Dialog open={loadDialogOpen} onClose={handleClose}>
        <DialogTitle>Charger un scénario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sélectionnez un scénario à charger.
          </DialogContentText>
          <FormControl fullWidth margin="dense">
            <InputLabel id="scenario-select-label">Scénario</InputLabel>
            <Select
              labelId="scenario-select-label"
              value={selectedScenario}
              label="Scénario"
              onChange={(e) => setSelectedScenario(e.target.value)}
            >
              {scenarios.map((scenario, index) => (
                <MenuItem key={index} value={scenario.name}>
                  {scenario.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button 
            onClick={handleLoadConfirm} 
            color="primary"
            variant="contained"
            disabled={!selectedScenario}
          >
            Charger
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ScenarioManager;