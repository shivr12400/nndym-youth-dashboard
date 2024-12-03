// pages/index.js
import { Button, Grid, Container, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

// Create custom styled button
const CustomButton = styled(Button)(() => ({
    padding: theme.spacing(4),
    fontSize: '1.5rem',
    fontWeight: 'bold',
    minHeight: '200px',
    width: '100%',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: 'primary',
    color: '#F6F1D1',
    '&:hover': {
      backgroundColor: '#2f5a68', // Darker shade for hover
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
    { text: "Lesson Plans", url: "https://example.com/1" },
    { text: "NNDYM Website", url: "https://nndym.org" },
    { text: "Kalupur Website", url: "https://www.swaminarayan.info/" },
    { text: "Button 4", url: "https://example.com/4" },
  ];

  return (
    <Layout>
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
      <Title variant="h3" marginTop={"4"}>
              Information
            </Title>
        <Box sx={{ flexGrow: 1, py: 4 }}>
          <Grid container spacing={3}>
            {buttons.map((button, index) => (
              <Grid item xs={6} key={index}>
                <CustomButton
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {button.text}
                </CustomButton>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
    <Footer />
    </Layout>
  );
}