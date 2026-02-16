// pages/_app.js
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRouter } from 'next/router';
import theme from '../styles/theme';
import { verifyToken } from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const isValid = await verifyToken(token);
        setIsAuthenticated(isValid);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && router.pathname === '/') {
        router.push('/dashboard');
      } else if (!isAuthenticated && router.pathname !== '/') { 
        // FIX: Added "&& router.pathname !== '/'"
        // This prevents the app from trying to push to '/' when you are already there,
        // which can confuse mobile browsers.
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    // Basic loader while checking auth token on first load
    return <div></div>; 
  }

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </ThemeProvider>
  );
}

export default MyApp;