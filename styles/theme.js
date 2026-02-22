import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#094D92' },
    secondary: { main: '#1C1018' },
    error: { main: '#D32F2F' },
    warning: { main: '#FBC02D' },
    info: { main: '#2196F3' },
    success: { main: '#4CAF50' },
    background: {
      default: '#f4f6f8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1018',
      secondary: '#094D92',
    },
    divider: '#E0E0E0',
    navText: { main: '#FFFFFF' },
    navHover: { main: '#7986CB' },
    navHoverText: { main: '#FFFFFF' },
    cardButton: {
      background: '#094D92',
      text: '#EFEFEF',
    },
    tier: {
      platinum: '#E5E4E2',
      gold: '#FFD700',
      silver: '#C0C0C0',
      bronze: '#CD7F32',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.75rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    caption: { fontSize: '0.75rem', fontWeight: 400 },
    button: { fontSize: '0.875rem', fontWeight: 500 },
  },
});

export default theme;