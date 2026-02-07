import Link from 'next/link'; // Import Next.js's Link for routing
import { Grid, Typography, Container, Alert } from '@mui/material';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { mandirs } from '../utils/mandirs';
import { HoverButton } from '../components/common/HoverButton';
import { styled } from '@mui/system';

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: "40px"
}));

export default function Home() {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* <Alert severity="info" sx={{ mb: 3 }}>
          Retreat 2026 Registrations are out, sign up your kids now! —{' '}
          <Link href="https://nndym.org" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
           Register Here
          </Link>
        </Alert> */}
        <Alert severity="info" sx={{ mb: 3 }}>
          Retreat 2026 Registrations will be out soon!
        </Alert>
        <Title variant="h3" marginTop={"4"}>
          Mandirs
        </Title>
        <Grid container spacing={3} justifyContent="center" padding={3}>
          {mandirs.map((button, index) => (
            <Grid item xs={12} sm={4} md={3} key={index}>
              <Link style={{ textDecoration: 'none' }} href={{ pathname: 'kids-attendance', query: { mandirName: button.mandirName } }} passHref>
                <HoverButton component="a" tier={button.tier}>
                  <Typography
                    variant="h6"
                    color="white"
                    sx={{
                      position: 'relative',
                      zIndex: 2,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: 1.5,
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
                      textDecoration: 'none'
                    }}
                  >
                    {button.mandirName}
                  </Typography>
                </HoverButton>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </Layout>
  );
}
