// components/Navbar.js

import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { styled } from '@mui/system';

const NavButton = styled(Button)(({theme}) => ({
    color: '#F6F1D1',
    '&:hover': {
        backgroundColor: '#40798C',
        color: '#F6F1D1',
    },
  }));

const Navbar = () => {
  return (
    <AppBar position="static" color='primary'>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#F6F1D1' }}>
            NNDYM Mandir Dashboard
          </Typography>
          <Link href="/" passHref>
            <NavButton>Home</NavButton>
          </Link>
          <Link href="/lessonPlans" passHref>
            <NavButton>Lesson Plans</NavButton>
          </Link>
          <Link href="/register" passHref>
            <NavButton>register</NavButton>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;