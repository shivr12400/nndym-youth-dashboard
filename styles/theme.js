import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:    { main: '#231A11', light: '#3D2C1E', dark: '#0F0A06', contrastText: '#F9F5EE' },
    secondary:  { main: '#D96B3F', light: '#F0916A', dark: '#B24B20', contrastText: '#fff' },
    error:      { main: '#D32F2F' },
    warning:    { main: '#E8C23A' },
    info:       { main: '#2BAF8C' },
    success:    { main: '#2BAF8C' },
    background: { default: '#F9F5EE', paper: '#ffffff' },
    text:       { primary: '#231A11', secondary: '#5A4A3A' },
    divider:    '#E8E1D6',
  },
  typography: {
    fontFamily: [
      'DM Sans',
      'Space Grotesk',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontSize: '2rem',    fontWeight: 700, letterSpacing: '-0.015em' },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.015em' },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.5rem',  fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.012em' },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.1rem',  fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontSize: '1rem',    fontWeight: 600 },
    body1: { fontSize: '1rem',    fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    button:{ fontSize: '0.9rem',  fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, textTransform: 'none', fontWeight: 600, minHeight: 44 },
        containedPrimary: { backgroundColor: '#231A11', color: '#F9F5EE', '&:hover': { backgroundColor: '#3D2C1E' } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 18, boxShadow: '0 1px 2px rgba(28,16,24,0.04)', border: '1px solid #E8E1D6' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 14 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F3EDE3',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D96B3F' },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 18 } },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F9F5EE' },
      },
    },
  },
});

export default theme;
