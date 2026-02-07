// pages/index.js
import { Button, Grid, Container, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

// Create custom styled button
const CustomButton = styled(Button)(() => ({
    padding: theme.spacing(4),
    fontSize: '1.5rem',
    fontWeight: 'bold',
    minHeight: '200px',
    width: '100%',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: '#3F51B5',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FFFFFF', // Darker shade for hover
      color: '#3F51B5',
      transform: 'translateY(-4px)',
      //boxShadow: theme.shadows[8],
    },
  }));
  
  // Custom theme with your colors
  const theme = createTheme({
    palette: {
      primary: {
        main: '#40798C',
      },
      secondary: {
        main: '#40798C',
      },
      text: {
        primary: '#F6F1D1',
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
        },
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: '#2f5a68',
            },
          },
        },
      },
    },
  });

const Title = styled(Typography)(({ theme }) => ({
    marginBottom: "40px"
  }));

export default function HomePage() {
  const buttons = [
    { text: "Lesson Plans", url: "https://drive.google.com/drive/folders/1kwKNiD0sbrnNf_qE8_ZHCVpq2dpUX6Sl?usp=sharing" },
    { text: "NNDYM Website", url: "https://nndym.org" },
    { text: "Kalupur Website", url: "https://www.swaminarayan.info/" },
    { text: "Logos", url: "https://drive.google.com/drive/folders/10kBv8GkBXxqWRR-B3cWvFh2of8PO8r8m?usp=sharing" },
  ];

  return (
    <Layout>
    <ThemeProvider theme={theme}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
        <Title variant="h3" marginTop={"4"}>
                Information
              </Title>
          <Box sx={{ flexGrow: 1, py: 4 }}>
            <Grid container spacing={3}>
              {buttons.map((button, index) => (
                <Grid item xs={6} key={index}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <CustomButton
                      href={button.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {button.text}
                    </CustomButton>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </motion.div>
    </ThemeProvider>
    <Footer />
    </Layout>
  );
}