import React from 'react';
import { 
    Container, Typography, Grid, Card, CardActionArea, 
    CardContent, Box, Chip 
} from '@mui/material';
import { useRouter } from 'next/router';
import { mandirs } from '../utils/mandirs'; 
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

export default function Dashboard({ isAuthenticated }) {
    const router = useRouter();

    const handleMandirSelect = (name) => {
        router.push(`/kids-attendance?mandirName=${encodeURIComponent(name)}`);
    };

    return (
        <Layout>
        <Container maxWidth="lg">
            <Box sx={{ mt: 6, mb: 6, textAlign: 'center' }}>
                <Typography variant="h1" component="h1" sx={{ color: 'primary.main' }}>
                    Mandir Selection
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Select a Mandir to manage attendance
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {mandirs.map((mandir, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card sx={{ borderRadius: 3, '&:hover': { transform: 'scale(1.02)', transition: '0.2s' } }}>
                                <CardActionArea onClick={() => handleMandirSelect(mandir.mandirName)}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6">{mandir.mandirName}</Typography>
                                            <Chip label={mandir.tier} size="small" variant="outlined" />
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Container>
        <br></br>
        <br></br>
        </Layout>
    );
}