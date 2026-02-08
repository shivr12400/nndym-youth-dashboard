import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6, // Increased padding
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.dark, // Use a darker primary color for the footer background
        color: (theme) => theme.palette.primary.contrastText, // Ensure text is readable against the background
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="inherit">
              About NNDYM
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ lineHeight: 1.6 }}>
              NNDYM (Nar Narayan Dev Yuvak Mandal) is dedicated to fostering spiritual growth,
              cultural values, and community service among youth, inspired by the teachings
              of Swaminarayan Bhagwan.
            </Typography>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="inherit">
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" variant="body2" display="block" sx={{ '&:hover': { color: (theme) => theme.palette.info.main } }}>
                Home
              </Link>
              <Link href="/information" color="inherit" variant="body2" display="block" sx={{ '&:hover': { color: (theme) => theme.palette.info.main } }}>
                Information
              </Link>
              <Link href="/register" color="inherit" variant="body2" display="block" sx={{ '&:hover': { color: (theme) => theme.palette.info.main } }}>
                Register Kids
              </Link>
              <Link href="/feedback" color="inherit" variant="body2" display="block" sx={{ '&:hover': { color: (theme) => theme.palette.info.main } }}>
                Feedback
              </Link>
            </Box>
          </Grid>

          {/* Contact & Social Media */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="inherit">
              Connect With Us
            </Typography>
            <Typography variant="body2" color="inherit" display="block">
              Email: {' '}
              <Link color="inherit" href="mailto:nndym.usa@gmail.com" sx={{ '&:hover': { color: (theme) => theme.palette.info.main } }}>
                nndym.usa@gmail.com
              </Link>
            </Typography>
            <Typography variant="body2" color="inherit" display="block">
              Website: {' '}
              <Link color="inherit" href="https://www.nndym.org" target="_blank" rel="noopener noreferrer" sx={{ '&:hover': { color: (theme) => theme.palette.info.main } }}>
                www.nndym.org
              </Link>
            </Typography>
            <Box sx={{ mt: 2 }}>
            <IconButton aria-label="Instagram" color="inherit" href="https://www.instagram.com/officialnndym/" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="Facebook" color="inherit" href="https://www.facebook.com/officialnndym" target="_blank" rel="noopener noreferrer">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Youtube" color="inherit" href="https://youtube.com/nndym" target="_blank" rel="noopener noreferrer">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ pt: 4, mt: 4, borderTop: '1px solid', borderColor: (theme) => theme.palette.divider }}>
          <Typography variant="body2" color="inherit" align="center">
            © {new Date().getFullYear()} Nar Narayan Dev Yuvak Mandal. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;