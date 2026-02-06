import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
        main: '#3F51B5', // A modern blue for primary actions
      },
      secondary: {
        main: '#FF4081', // A vibrant pink for secondary actions
      },
      error: {
        main: '#D32F2F', // Standard error red
      },
      warning: {
        main: '#FBC02D', // Standard warning yellow
      },
      info: {
        main: '#2196F3', // Standard info blue
      },
      success: {
        main: '#4CAF50', // Standard success green
      },
      background: {
        default: '#F4F6F8', // Light gray for general background
        paper: '#FFFFFF', // White for card-like surfaces
      },
      text: {
        primary: '#212121', // Dark grey for primary text
        secondary: '#757575', // Medium grey for secondary text
      },
      navText: {
        main: '#FFFFFF', // White for navigation text
      },
      navHover: {
        main: '#7986CB', // Lighter blue for navigation hover
      },
      navHoverText: {
        main: '#FFFFFF', // White for navigation hover text
      },
      cardButton: {
        background: '#3F51B5', // Primary color for card buttons
        text: '#FFFFFF', // White text for card buttons
      },
  },
  typography: {
    fontFamily: [
      'Inter', // Modern sans-serif font
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export default theme;