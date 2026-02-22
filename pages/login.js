import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { loginUser } from '../utils/auth';
import Layout from '../components/Layout';

export default function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [pendingCognitoUser, setPendingCognitoUser] = useState(null);
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            const token = await loginUser(email, password);

            // token is always a JWT string here — loginUser now rejects (never
            // resolves) for the newPasswordRequired case, so this branch only
            // runs when Cognito has fully authenticated the user and written
            // all session tokens to localStorage.
            if (token) {
                setIsAuthenticated(true);
                router.push('/');
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
            onSuccess: (result) => {
                localStorage.setItem('app_last_auth_user', email);
                setIsAuthenticated(true);
                router.push('/');
            },
            onFailure: (err) => {
                setIsLoggingIn(false);
                setError(err.message || 'Failed to set new password');
            }
        });
    };

    // New password challenge screen
    if (pendingCognitoUser) {
        return (
            <Layout>
            <Container maxWidth="xs">
                <Box sx={{ mt: 10 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h4" component="h1" align="center" gutterBottom>Set New Password</Typography>
                        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
                            Your account requires a new password before signing in.
                        </Typography>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <form onSubmit={handleNewPasswordSubmit}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                margin="normal"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={isLoggingIn}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, height: '45px' }}
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? <CircularProgress size={24} /> : 'Set Password & Sign In'}
                            </Button>
                        </form>
                    </Paper>
                </Box>
            </Container>
            </Layout>
        );
    }

    return (
        <Layout>
        <Container maxWidth="xs">
            <Box sx={{ mt: 10 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>Login</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoggingIn}
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
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, height: '45px' }}
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
        </Layout>
    );
}