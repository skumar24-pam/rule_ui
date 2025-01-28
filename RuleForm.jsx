import React from 'react';
import {
  TextField,
  Grid,
  IconButton,
  Box,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ConditionForm from './ConditionForm';

const RuleForm = ({ rule, onUpdate, onDelete }) => {
  const handleFieldChange = (event) => {
    onUpdate({
      ...rule,
      field: event.target.value
    });
  };

  const addCondition = () => {
    const newCondition = {
      condition: '',
      error_message: {
        code: '',
        error_type: 'warning',
        message: ''
      },
      action: {
        type: '',
        value: ''
      }
    };

    onUpdate({
      ...rule,
      conditions: [...(rule.conditions || []), newCondition]
    });
  };

  const updateCondition = (index, updatedCondition) => {
    const updatedConditions = [...(rule.conditions || [])];
    updatedConditions[index] = updatedCondition;
    onUpdate({
      ...rule,
      conditions: updatedConditions
    });
  };

  const deleteCondition = (index) => {
    const updatedConditions = (rule.conditions || []).filter((_, i) => i !== index);
    onUpdate({
      ...rule,
      conditions: updatedConditions
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <TextField
            fullWidth
            label="Field Name"
            value={rule.field || ''}
            onChange={handleFieldChange}
            placeholder="Enter the field name"
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Grid>

        <Grid item xs={12}>
          {(rule.conditions || []).map((condition, index) => (
            <ConditionForm
              key={index}
              condition={condition}
              onUpdate={(updatedCondition) => updateCondition(index, updatedCondition)}
              onDelete={() => deleteCondition(index)}
            />
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addCondition}
            sx={{ mt: 2 }}
          >
            Add Condition
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RuleForm;
