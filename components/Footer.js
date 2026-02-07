import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.secondary.main,
        color: (theme) => theme.palette.secondary.contrastText,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Nar Narayan Dev Yuvak Mandal
        </Typography>
        <Typography variant="body2" align="center">
          <Link color="inherit" href="mailto:nndym.usa@gmail.com">
            Email
          </Link>
        </Typography>
        <Typography variant="body2" align="center">
          <Link color="inherit" href="https://www.nndym.org">
            Website
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;