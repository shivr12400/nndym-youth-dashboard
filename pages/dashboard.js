import Link from 'next/link'; // Import Next.js's Link for routing
import { Grid, Button, Typography, Container } from '@mui/material';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { styled } from '@mui/system';

const mandirs = [
  { id: 1, title: 'Colonia, NJ', tier: "Gold", mandirName: 'Colonia', image: '/images/del.jpg' },
  { id: 2, title: 'Parsippany, NJ', tier: "Silver", mandirName: 'Parsippany', image: '/images/india24.jpg' },
  { id: 3, title: 'Weehawken, NJ', tier: "Gold", mandirName: 'Weehawken', image: '/images/galeway.jpg' },
  { id: 4, title: 'Colonia, NJ', tier: "Gold", mandirName: 'Colonia', image: '/images/del.jpg' },
  { id: 5, title: 'Parsippany, NJ', tier: "Silver", mandirName: 'Parsippany', image: '/images/india24.jpg' },
  { id: 6, title: 'Weehawken, NJ', tier: "Gold", mandirName: 'Weehawken', image: '/images/galeway.jpg' },
  { id: 7, title: 'Colonia, NJ', tier: "Silver", mandirName: 'Colonia', image: '/images/del.jpg' },
  { id: 8, title: 'Parsippany, NJ', tier: "Bronze", mandirName: 'Parsippany', image: '/images/india24.jpg' },
  { id: 9, title: 'Weehawken, NJ', tier: "Gold", mandirName: 'Weehawken', image: '/images/galeway.jpg' },
];

const handleLogout = () => {
  localStorage.removeItem('token');
  setIsAuthenticated(false);
  router.push('/');
};

// Define button background colors based on tier
const tierColors = {
  Gold: '#C69C6D',     // Gold color
  Silver: '#C0C0C0',    // Silver color
  Bronze: '#6E4D25',  // Platinum color (light grayish)
};

const HoverButton = styled(Button)(({ theme, tier }) => ({
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

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: "40px"
}));

export default function Home() {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
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
                    {button.title}
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
