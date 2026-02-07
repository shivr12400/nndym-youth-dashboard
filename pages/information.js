// pages/index.js
import { Button, Grid, Container, Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import CustomButton from '../components/information/CustomButton';

  // Custom theme with your colors
  const theme = createTheme({
    palette: {
      primary: {
        main: '#094D92',
      },
      secondary: {
        main: '#1C1018',
      },
      text: {
        primary: '#EFEFEF',
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