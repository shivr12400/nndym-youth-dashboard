// pages/index.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Login({ isAuthenticated, setIsAuthenticated }) {
  const [templeName, setTempleName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New local loading state
  const router = useRouter();

  // REMOVED: The conflicting useEffect redirect. 
  // We will let handleLogin (immediate) and _app.js (global) handle navigation.

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true); // Start button spinner

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templeName, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        router.push('/dashboard'); 
        // Note: We do NOT set isLoggingIn(false) here. 
        // We want the button to keep spinning until the page actually changes.
      } else {
        setError(data.message || 'Login failed');
        setIsLoggingIn(false); // Stop spinner on error
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoggingIn(false); // Stop spinner on error
    }
  };

  // REMOVED: The "if (isAuthenticated) return <Spinner>" block.
  // This was causing the "stuck" screen. We now show the login form 
  // until the router actually moves the user away.

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2, 
          }}
        >
          <Box
            component="img"
            alt="NNDYM logo"
            src="/logo.svg"
            sx={{ maxWidth: 160, height: 'auto', mb: 2 }}
          />
          <Typography component="h1" variant="h5">
            Dashboard Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="templeName"
              label="Mandir Name"
              name="templeName"
              autoFocus
              value={templeName}
              onChange={(e) => setTempleName(e.target.value)}
              disabled={isLoggingIn} // Disable input while loading
              sx={{ '& .MuiInputBase-input': { fontSize: '16px' } }} 
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoggingIn} // Disable input while loading
              sx={{ '& .MuiInputBase-input': { fontSize: '16px' } }} 
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoggingIn} // Disable button while loading
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', height: '50px' }}
            >
              {/* Show Spinner inside button if logging in */}
              {isLoggingIn ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
}