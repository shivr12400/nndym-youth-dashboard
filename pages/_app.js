// pages/_app.js
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import theme from '../styles/theme';
import { verifyToken, getUserEmail } from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Run the token check once on mount to determine auth state.
  useEffect(() => {
    const checkAuth = async () => {
      // Small defer to let Cognito SDK finish flushing its localStorage
      // writes after a login redirect before we try to read the session.
      await new Promise((resolve) => setTimeout(resolve, 0));
      const [isValid, email] = await Promise.all([verifyToken(), getUserEmail()]);
      setIsAuthenticated(isValid);
      setUserEmail(email);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // BUG FIX: router.pathname was previously in the dependency array, which caused
  // this effect to re-run on EVERY client-side navigation (e.g. clicking a mandir
  // card). On each re-run there was a brief window where isAuthenticated could be
  // stale/false, immediately redirecting the user back to /login.
  //
  // The redirect logic only needs to fire when auth state is first determined
  // (isLoading flips to false) or when it changes (login / logout). Route changes
  // are already handled by the guard condition inside the effect — pathname just
  // needs to be READ, not depended upon as a trigger.
  useEffect(() => {
    if (isLoading) return;

    const { pathname } = router;

    if (isAuthenticated && pathname === '/login') {
      router.push('/');
    } else if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]); // ← router.pathname intentionally excluded

  const isRedirecting = 
    (isAuthenticated && router.pathname === '/login') || 
    (!isAuthenticated && router.pathname !== '/login');

  if (isLoading || isRedirecting) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <title>Mandir Portal</title>
      </Head>
      <CssBaseline />
      <Component
        {...pageProps}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
      />
    </ThemeProvider>
  );
}

export default MyApp;