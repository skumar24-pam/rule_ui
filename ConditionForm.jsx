import React from 'react';
import {
  TextField,
  Box,
  IconButton,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ConditionForm = ({ condition, onUpdate, onDelete }) => {
  const handleErrorMessageChange = (field, value) => {
    const updatedCondition = {
      ...condition,
      error_message: {
        ...condition.error_message,
        [field]: value
      }
    };
    onUpdate(updatedCondition);
  };

  const handleActionChange = (field, value) => {
    const updatedCondition = {
      ...condition,
      action: {
        ...condition.action,
        [field]: value
      }
    };
    onUpdate(updatedCondition);
  };

  return (
    <Box sx={{ border: '1px solid #ddd', p: 2, mb: 2, borderRadius: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <TextField
            label="Condition"
            value={condition.condition || ''}
            onChange={(e) => onUpdate({ ...condition, condition: e.target.value })}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="Error Code"
            value={condition.error_message?.code || ''}
            onChange={(e) => handleErrorMessageChange('code', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel>Error Type</InputLabel>
            <Select
              value={condition.error_message?.error_type || ''}
              label="Error Type"
              onChange={(e) => handleErrorMessageChange('error_type', e.target.value)}
            >
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="fatal">Fatal</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Error Message"
            value={condition.error_message?.message || ''}
            onChange={(e) => handleErrorMessageChange('message', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Action Type</InputLabel>
            <Select
              value={condition.action?.type || ''}
              label="Action Type"
              onChange={(e) => handleActionChange('type', e.target.value)}
              displayEmpty
              renderValue={(selected) => selected || 'None'}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="set">Set</MenuItem>
              <MenuItem value="remove">Remove</MenuItem>
              <MenuItem value="append">Append</MenuItem>
              <MenuItem value="prepend">Prepend</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Action Value"
            value={condition.action?.value || ''}
            onChange={(e) => handleActionChange('value', e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConditionForm;
