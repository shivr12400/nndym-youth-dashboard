import React from 'react';
import { Box } from '@mui/material';
import Navbar from './NavBar';
import Footer from './Footer';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { pathname } = useRouter();
  const isLoginPage = pathname === '/login';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflowX: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(isLoginPage && {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }),
        }}
      >
        {children}
      </Box>

      {!isLoginPage && <Footer />}
    </Box>
  );
}