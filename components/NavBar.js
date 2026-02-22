import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.navText.main,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
  },
}));

const Navbar = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <AppBar position="static" color='primary'>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: 'navText.main' }}>
              NNDYM Mandir Dashboard
            </Typography>
            <Link href="/" passHref>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <NavButton>Home</NavButton>
              </motion.div>
            </Link>
            <Link href="/submit-satsang" passHref>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <NavButton>Submit</NavButton>
              </motion.div>
            </Link>
            <Link href="/register" passHref>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <NavButton>Register</NavButton>
              </motion.div>
            </Link>
            <Link href="/information" passHref>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <NavButton>Information</NavButton>
              </motion.div>
            </Link>
            <Link href="/feedback" passHref>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <NavButton>Feedback</NavButton>
              </motion.div>
            </Link>
            <Link href="/chatbot" passHref>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <NavButton>AI Assistant</NavButton>
              </motion.div>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;