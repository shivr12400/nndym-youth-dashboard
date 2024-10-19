import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
        main: '#70A9A1',
      },
      navText: {
        main: '#F0F7F4',
      },
      navHover: {
        main: '#B3BFB8',
      },
      navHoverText: {
        main: '#3C493F',
      },
      cardButton: {
        background: '#3C493F',
        text: '#F0F7F4',
      },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

export default theme;