import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    background: { default: '#f3f5fa', paper: '#ffffff' },
    text: { primary: '#1d2433', secondary: '#5b6475' },
    divider: '#e3e7ef',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: {
      styleOverrides: { outlined: { borderColor: '#e3e7ef' } },
    },
  },
});

export default theme;
