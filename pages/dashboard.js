import React from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Button,
    Typography
  } from '@mui/material';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { useState, useMemo } from 'react';
import { styled } from '@mui/system';
import Link from 'next/link';

export default function Dashboard({ isAuthenticated, setIsAuthenticated }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push('/');
    };

    const StyledCard = styled(Card)(({ theme }) => ({
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: theme.spacing(2),
      }));
      
      const CardButton = styled(Button)(({ theme }) => ({
        backgroundColor: "blue",
        color: "white",
        '&:hover': {
          backgroundColor: "blue",
          opacity: 0.9,
        },
      }));

    const [cards] = useState([
        { id: 1, title: 'Colonia, NJ', tier: "Gold Tier", mandirName: 'Colonia', image: '/images/del.jpg' },
        { id: 2, title: 'Parsippany, NJ', tier: "Platinum Tier", mandirName: 'Parsippany', image: '/images/india24.jpg' },
        { id: 3, title: 'Weehawken, NJ', tier: "Gold Tier", mandirName: 'Weehawken', image: '/images/galeway.jpg' },
      ]);

    if (!isAuthenticated) {
        return (
          <h1>NOT AUTHENTICATED</h1>
        )
    }
    const Title = styled(Typography)(({ theme }) => ({
        marginBottom: "40px"
      }));

    return (
        <Layout>
          <Container maxWidth="lg" sx={{ py: 6 }}>
            <Title variant="h3" marginTop={"4"}>
              Mandirs
            </Title>
            <Grid container spacing={6} justifyContent="center">
              {cards.map((card) => (
                <Grid item key={card.id} xs={12} sm={6} md={4}>
                  <StyledCard elevation={3}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={card.image}
                      alt={card.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {card.title}
                      </Typography>
                      <Typography gutterBottom variant="subtitle1" component="div">
                        {card.tier}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Link href={{ pathname: 'kids-attendance', query: { mandirName: card.mandirName }}} passHref>
                        <CardButton size="small" color="primary">
                         Visit Mandir
                        </CardButton>
                      </Link>
                    </CardActions>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Container>
          <Footer />
        </Layout>
      );
}
