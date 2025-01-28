import React from 'react';
import RuleBuilder from './components/RuleBuilder';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RuleBuilder />
    </ThemeProvider>
  );
}

export default App;