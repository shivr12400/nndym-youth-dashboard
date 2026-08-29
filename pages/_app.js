// pages/_app.js
import '../styles/global.css';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRouter } from 'next/router';
import theme from '../styles/theme';
import { resolveSession, hasStoredSession } from '../utils/auth';

function Splash() {
  return (
    <div className="yd-splash" role="status" aria-label="Loading">
      <div className="yd-splash__ring" />
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Run the session check once on mount to determine auth state.
  useEffect(() => {
    let cancelled = false;

    // If the browser has nothing stored, the user is definitively signed out.
    // Settling synchronously here is what keeps /login from sitting behind a
    // spinner while we ask Cognito a question we already know the answer to.
    if (!hasStoredSession()) {
      setIsLoading(false);
      return;
    }

    // A single resolveSession() replaces the old verifyToken() + getUserEmail()
    // pair, which issued two concurrent getSession() calls — and therefore two
    // concurrent token refreshes racing each other on a cold load.
    resolveSession().then((session) => {
      if (cancelled) return;
      setIsAuthenticated(!!session);
      setUserEmail(session ? session.email : null);
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  // The redirect only needs to fire when auth state is first determined
  // (isLoading flips to false) or when it changes (login / logout). Route
  // changes are already handled by the guard condition inside the effect —
  // pathname just needs to be READ, not depended upon as a trigger. Depending
  // on it re-ran this on every client-side navigation, and each re-run had a
  // window where isAuthenticated read stale/false and bounced to /login.
  useEffect(() => {
    if (isLoading) return;

    const { pathname } = router;

    // replace() rather than push() so the auth bounce doesn't stack up in
    // history and trap the back button.
    if (isAuthenticated && pathname === '/login') {
      router.replace('/');
    } else if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]); // ← router.pathname intentionally excluded

  const isRedirecting = !isLoading && (
    (isAuthenticated && router.pathname === '/login') ||
    (!isAuthenticated && router.pathname !== '/login')
  );

  // The head stays mounted through the splash so fonts, the title and the
  // favicon start loading during the auth check rather than after it.
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <title>Mandir Portal</title>
      </Head>
      <CssBaseline />
      {isLoading || isRedirecting ? (
        <Splash />
      ) : (
        <Component
          {...pageProps}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          userEmail={userEmail}
          setUserEmail={setUserEmail}
        />
      )}
    </ThemeProvider>
  );
}

export default MyApp;
