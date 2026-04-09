import React from 'react';
import { Container, Typography, Box, Button, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { mandirs } from '../utils/mandirs';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import LeaderboardSection from '../components/LeaderboardSection';
import { useLeaderboard } from '../hooks/useLeaderboard';

function normalize(str) {
    return str.toLowerCase().replace(/[\s-]/g, '');
}

function isAdmin(userEmail) {
    if (!userEmail) return false;
    return userEmail.split('@')[0] === 'admin';
}

function getUserMandir(userEmail) {
    if (!userEmail) return null;
    const prefix = userEmail.split('@')[0];
    return mandirs.find(m => normalize(m.mandirName) === normalize(prefix)) || null;
}

export default function Dashboard({ isAuthenticated, userEmail }) {
    const router = useRouter();
    const { leaderboardData, isLoading: leaderboardLoading } = useLeaderboard(isAuthenticated);
    const admin = isAdmin(userEmail);
    const userMandir = admin ? null : getUserMandir(userEmail);

    const handleMandirSelect = (name) => {
        router.push(`/kids-attendance?mandirName=${encodeURIComponent(name)}`);
    };

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box sx={{ mt: 6, mb: 6, textAlign: 'center' }}>
                    <Typography variant="h1" component="h1" sx={{ color: 'primary.main' }}>
                        {admin ? 'Mandir Selection' : 'Welcome'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {admin ? 'Select a Mandir to manage attendance' : 'Manage your mandir attendance and events'}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                        {admin ? (
                            mandirs.map((mandir, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => handleMandirSelect(mandir.mandirName)}
                                        sx={{
                                            borderRadius: 3,
                                            px: 4,
                                            py: 1.5,
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            boxShadow: 3,
                                        }}
                                    >
                                        {mandir.mandirName}
                                    </Button>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => userMandir && handleMandirSelect(userMandir.mandirName)}
                                    disabled={!userMandir}
                                    sx={{
                                        borderRadius: 3,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: 3,
                                    }}
                                >
                                    My Mandir
                                </Button>
                            </motion.div>
                        )}
                    </Box>
                </Box>

                <Divider />
                <LeaderboardSection leaderboardData={leaderboardData} isLoading={leaderboardLoading} />
            </Container>
        </Layout>
    );
}
