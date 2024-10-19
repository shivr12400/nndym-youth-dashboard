import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" color="text.secondary" align="center">
          © {new Date().getFullYear()} Nar Narayan Dev Yuvak Mandal
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link color="inherit" href="mailto:nndym.usa@gmail.com">
            Email
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link color="inherit" href="https://www.nndym.org">
            Website
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;