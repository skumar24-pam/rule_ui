import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Button, 
  Typography,
  TextField,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel 
} from '@mui/material';
import RuleForm from './RuleForm';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

const RuleBuilder = () => {
  const [allRuleSets, setAllRuleSets] = useState({});
  const [currentRuleSetName, setCurrentRuleSetName] = useState('');
  const [newRuleSetName, setNewRuleSetName] = useState('');
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewRuleSetInput, setShowNewRuleSetInput] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const validateRule = (rule) => {
    if (!rule.field) {
      return 'Field is required';
    }
    if (!rule.conditions || rule.conditions.length === 0) {
      return 'At least one condition is required';
    }
    return null;
  };

  const validateRuleSet = (rules) => {
    return rules.every(rule => {
      const validationError = validateRule(rule);
      if (validationError) {
        setSnackbar({
          open: true,
          message: `Rule validation error: ${validationError}`,
          severity: 'error'
        });
        return false;
      }
      return true;
    });
  };

  const handleRuleSetChange = (event) => {
    const selectedRuleSet = event.target.value;
    setCurrentRuleSetName(selectedRuleSet);
    setRules(allRuleSets[selectedRuleSet]?.rules || []);
  };

  const addNewRuleSet = () => {
    if (!newRuleSetName.trim()) {
      setSnackbar({
        open: true,
        message: 'Ruleset name cannot be empty',
        severity: 'error'
      });
      return;
    }

    if (allRuleSets[newRuleSetName]) {
      setSnackbar({
        open: true,
        message: 'Ruleset name already exists',
        severity: 'error'
      });
      return;
    }

    setAllRuleSets(prev => ({
      ...prev,
      [newRuleSetName]: { rules: [] }
    }));
    setCurrentRuleSetName('');
    setRules([]);
    setNewRuleSetName('');
    setShowNewRuleSetInput(false);
    
    setSnackbar({
      open: true,
      message: 'New ruleset created successfully',
      severity: 'success'
    });
  };

  const addRule = () => {
    const newRule = {
      field: '',
      conditions: [],
      actionType: ''  // Initialize with empty action type
    };
    setRules(prevRules => [...prevRules, newRule]);
    
    // Update the allRuleSets state
    setAllRuleSets(prev => ({
      ...prev,
      [currentRuleSetName]: { rules: [...rules, newRule] }
    }));
  };

  const updateRule = (index, updatedRule) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    setRules(newRules);
    
    // Update the allRuleSets state
    setAllRuleSets(prev => ({
      ...prev,
      [currentRuleSetName]: { rules: newRules }
    }));
  };

  const deleteRule = (index) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      const newRules = rules.filter((_, i) => i !== index);
      setRules(newRules);
      
      // Update the allRuleSets state
      setAllRuleSets(prev => ({
        ...prev,
        [currentRuleSetName]: { rules: newRules }
      }));

      setSnackbar({
        open: true,
        message: 'Rule deleted successfully',
        severity: 'info'
      });
    }
  };

  const deleteRuleSet = () => {
    if (!currentRuleSetName) return;

    if (window.confirm(`Are you sure you want to delete the ruleset "${currentRuleSetName}"?`)) {
      const newRuleSets = { ...allRuleSets };
      delete newRuleSets[currentRuleSetName];
      
      setAllRuleSets(newRuleSets);
      setCurrentRuleSetName('');
      setRules([]);

      setSnackbar({
        open: true,
        message: 'Ruleset deleted successfully',
        severity: 'info'
      });
    }
  };

  const generateJSON = () => {
    if (!validateRuleSet(rules)) {
      return;
    }

    downloadJSON(allRuleSets);
  };

  const downloadJSON = (data) => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rulesets.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: 'Rules file downloaded successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error downloading file: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const reader = new FileReader();
        const result = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });

        const content = JSON.parse(result);
        
        // Validate the structure of loaded data
        Object.entries(content).forEach(([key, value]) => {
          if (!Array.isArray(value.rules)) {
            throw new Error(`Invalid ruleset structure for "${key}"`);
          }
        });

        setAllRuleSets(content);
        setCurrentRuleSetName('');
        setRules([]);
        
        setSnackbar({
          open: true,
          message: 'Rules file loaded successfully!',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Error loading file: ${error.message}`,
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
        event.target.value = '';
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Validation Rule Builder
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select RuleSet</InputLabel>
          <Select
            value={currentRuleSetName}
            label="Select RuleSet"
            onChange={handleRuleSetChange}
            disabled={Object.keys(allRuleSets).length === 0}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Object.keys(allRuleSets).map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {showNewRuleSetInput ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              label="New RuleSet Name"
              value={newRuleSetName}
              onChange={(e) => setNewRuleSetName(e.target.value)}
              size="small"
            />
            <Button 
              variant="contained" 
              onClick={addNewRuleSet}
              disabled={!newRuleSetName.trim()}
            >
              Add
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => {
                setShowNewRuleSetInput(false);
                setNewRuleSetName('');
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={() => setShowNewRuleSetInput(true)}
            startIcon={<AddIcon />}
          >
            New RuleSet
          </Button>
        )}

        {currentRuleSetName && (
          <Button
            variant="outlined"
            color="error"
            onClick={deleteRuleSet}
          >
            Delete RuleSet
          </Button>
        )}
        
        <input
          accept=".json"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={isLoading ? <CircularProgress size={20} /> : <UploadFileIcon />}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load Rules'}
          </Button>
        </label>
      </Box>
      
      {currentRuleSetName && (
        <>
          {rules.map((rule, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <RuleForm
                rule={rule}
                onUpdate={(updatedRule) => updateRule(index, updatedRule)}
                onDelete={() => deleteRule(index)}
              />
            </Paper>
          ))}

          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={addRule} 
              sx={{ mr: 2 }}
            >
              Add Rule
            </Button>
            
            <Button 
              variant="contained" 
              color="success" 
              onClick={generateJSON}
              disabled={!Object.keys(allRuleSets).length || isLoading}
              startIcon={<SaveIcon />}
            >
              Save Rules
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RuleBuilder;
