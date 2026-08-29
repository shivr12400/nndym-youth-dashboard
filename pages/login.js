import React, { useState } from 'react';
import Image from 'next/image';
import { Container, TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { loginUser, adoptSession } from '../utils/auth';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const CARD = {
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
    borderRadius: 2,
    bgcolor: 'background.paper',
};

export default function Login({ setIsAuthenticated, setUserEmail }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [pendingCognitoUser, setPendingCognitoUser] = useState(null);
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Sign-in leaves isLoggingIn true on purpose: _app owns the redirect to /
    // and swaps this page out, so the button keeps spinning until it does.

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            // loginUser hands back the email straight off the id token it just
            // received — asking Cognito for it again cost a whole extra round
            // trip while the user watched the button spin.
            const { token, email: resolvedEmail } = await loginUser(email, password);
            if (token) {
                setUserEmail(resolvedEmail);
                setIsAuthenticated(true);
            }
        } catch (err) {
            setIsLoggingIn(false);
            if (err.code === 'NewPasswordRequired') {
                setPendingCognitoUser(err.cognitoUser);
                setError('');
                return;
            }
            setError(err.message || 'Invalid email or password');
        }
    };

    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        pendingCognitoUser.completeNewPasswordChallenge(newPassword, {}, {
            onSuccess: (session) => {
                // Seed the shared session cache here too, otherwise the first
                // load after a password reset had no stored user and every
                // caller fell through to a fresh Cognito lookup.
                const { email: resolvedEmail } = adoptSession(session);
                setUserEmail(resolvedEmail);
                setIsAuthenticated(true);
            },
            onFailure: (err) => {
                setIsLoggingIn(false);
                setError(err.message || 'Failed to set new password');
            }
        });
    };

    const cardContent = pendingCognitoUser ? (
        <>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                Set New Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your account requires a new password before signing in.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleNewPasswordSubmit} noValidate>
                <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoggingIn}
                    size="small"
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, py: 1.25, textTransform: 'none', borderRadius: 1.5, fontWeight: 600, fontSize: '0.9rem' }}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? <CircularProgress size={22} color="inherit" /> : 'Set Password & Sign In'}
                </Button>
            </Box>
        </>
    ) : (
        <>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoggingIn}
                    size="small"
                    autoComplete="email"
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoggingIn}
                    size="small"
                    autoComplete="current-password"
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, py: 1.25, textTransform: 'none', borderRadius: 1.5, fontWeight: 600, fontSize: '0.9rem' }}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
                </Button>
            </Box>
        </>
    );

    return (
        <Layout>
            <Container maxWidth="xs" sx={{ py: 4, width: '100%' }}>
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <Box sx={{ ...CARD, overflow: 'hidden' }}>
                        {/* Gradient header */}
                        <Box sx={{
                            background: 'var(--ink)',
                            px: 4,
                            pt: 4,
                            pb: 3.5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                right: -40, top: -40,
                                width: 160, height: 160,
                                borderRadius: '50%',
                                background: 'var(--coral)',
                                opacity: 0.18,
                                pointerEvents: 'none',
                            },
                        }}>
                            <Image src="/nndym.png" alt="NNDYM" width={40} height={52} style={{ objectFit: 'contain' }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'rgba(255,255,255,0.9)', letterSpacing: 0.5 }}>
                                NNDYM Dashboard
                            </Typography>
                        </Box>

                        {/* Form */}
                        <Box sx={{ px: 3, py: 3 }}>
                            {cardContent}
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Layout>
    );
}
