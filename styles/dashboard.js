import { styled } from '@mui/system';
import { Button } from '@mui/material';

// Define button background colors based on tier
export const tierColors = {
  Gold: '#C69C6D',     // Gold color
  Silver: '#C0C0C0',    // Silver color
  Platinum: '#6E4D25',  // Platinum color (light grayish)
};

export const HoverButton = styled(Button)(({ theme, tier }) => ({
  position: 'relative',
  width: '100%',
  height: '150px',
  backgroundColor: tierColors[tier] || theme.palette.grey[900], // Apply tier-based color
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));
