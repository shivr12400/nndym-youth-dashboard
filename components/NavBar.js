import React, { useState } from 'react';
import Image from 'next/image';
import {
  AppBar, Toolbar, Typography, Button, Container,
  IconButton, Drawer, List, ListItem, ListItemText, Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { styled, useTheme } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.navText.main,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
  },
}));

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Submit Satsang Count', path: '/submit-satsang' },
  { label: 'Register Yuvaks/Yuvatis', path: '/register' },
  { label: 'Information', path: '/information' },
  { label: 'Feedback', path: '/feedback' },
  { label: 'AI Assistant', path: '/chatbot' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: theme.palette.primary.main, height: '100%', color: theme.palette.navText.main }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Image src="/nndym.png" alt="NNDYM" width={46} height={60} style={{ objectFit: 'contain' }} />
      </Box>
      <List>
        {navItems.map((item) => (
          <Link key={item.label} href={item.path} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button sx={{ justifyContent: 'center' }}>
              <ListItemText primary={item.label} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <AppBar position="static" color='primary'>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Image src="/nndym.png" alt="NNDYM" width={38} height={50} style={{ objectFit: 'contain' }} />
            </Box>

            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ ml: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  variant="temporary"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                  }}
                >
                  {drawer}
                </Drawer>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                {navItems.map((item) => (
                  <Link key={item.label} href={item.path} passHref>
                    <motion.div style={{ display: 'inline-block' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <NavButton>{item.label}</NavButton>
                    </motion.div>
                  </Link>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;