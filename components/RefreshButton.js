import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Refresh from '@mui/icons-material/Refresh';
import { keyframes } from '@mui/material';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RefreshButton = ({ onClick, tooltipTitle = "Refresh" }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    setIsSpinning(true);
    onClick();
    setTimeout(() => setIsSpinning(false), 1000); // Reset after 1 second
  };

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        onClick={handleClick}
        sx={{
          animation: isSpinning ? `${spin} 1s linear` : 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Refresh />
      </IconButton>
    </Tooltip>
  );
};

export default RefreshButton;