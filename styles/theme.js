import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
        main: '#094D92', 
      },
      secondary: {
        main: '#1C1018',
      },
      error: {
        main: '#D32F2F', 
      },
      warning: {
        main: '#FBC02D', 
      },
      info: {
        main: '#2196F3',
      },
      success: {
        main: '#4CAF50',
      },
      background: {
        default: '#EFEFEF', 
        paper: '#FFFFFF', 
      },
      text: {
        primary: '#1C1018',
        secondary: '#094D92',
      },
      navText: {
        main: '#FFFFFF', 
      },
      navHover: {
        main: '#7986CB', 
      },
      navHoverText: {
        main: '#FFFFFF', 
      },
      cardButton: {
        background: '#094D92', 
        text: '#EFEFEF', 
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
  },
});

export default theme;