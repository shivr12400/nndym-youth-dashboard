// components/common/CustomButton.js
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const CustomButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(4),
    fontSize: '1.5rem',
    fontWeight: 'bold',
    minHeight: '200px',
    width: '100%',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '10px',
    '&:hover': {
        backgroundColor: theme.palette.primary.contrastText, // Darker shade for hover
        color: theme.palette.primary.main,
        transform: 'translateY(-4px)',
        //boxShadow: theme.shadows[8],
    },
}));

export default CustomButton;
