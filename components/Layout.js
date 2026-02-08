import { Container, Box } from '@mui/material';
import Navbar from './NavBar';
import Footer from './Footer'; // Import Footer

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;