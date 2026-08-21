import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // switch to 'dark' for dark mode
    primary: { main: '#6545df' },      // your purple
    secondary: { main: '#20a866' },    // your green (DBMS subject color)
    warning: { main: '#f5aa13' },      // your orange
    error: { main: '#c83232' },        // your red
    info: { main: '#2d91e8' },         // your blue
  },
  shape: { borderRadius: 10 },
});

export default theme;