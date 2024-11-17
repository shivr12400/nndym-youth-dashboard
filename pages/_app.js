import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { verifyToken } from '../utils/auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0B2027',
    },
  },
});

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
      } else if (!isAuthenticated) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </ThemeProvider>
  );
}

export default MyApp;