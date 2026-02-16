import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Alert, CircularProgress } from '@mui/material'; // Import CircularProgress
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Login({ isAuthenticated, setIsAuthenticated }) {
  const [templeName, setTempleName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // If user visits the login page but is already logged in, redirect them
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
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
        // Force immediate redirect to prevent lingering on login page
        router.push('/dashboard'); 
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  // FIX: Instead of returning null (white screen), show a loading spinner
  if (isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
              sx={{ '& .MuiInputBase-input': { fontSize: '16px' } }} // Prevents iOS zoom
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
              sx={{ '& .MuiInputBase-input': { fontSize: '16px' } }} // Prevents iOS zoom
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
}