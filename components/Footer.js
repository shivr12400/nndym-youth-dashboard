import { Box, Container, Typography, Link, IconButton, Divider } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Image from 'next/image';

const links = [
    { label: 'Home',                   href: '/' },
    { label: 'Information',            href: '/information' },
    { label: 'Register',               href: '/register' },
    { label: 'Submit Satsang',         href: '/submit-satsang' },
    { label: 'Feedback',               href: '/feedback' },
];

const social = [
    { icon: <InstagramIcon fontSize="small" />, href: 'https://www.instagram.com/officialnndym/', label: 'Instagram' },
    { icon: <FacebookIcon  fontSize="small" />, href: 'https://www.facebook.com/officialnndym',  label: 'Facebook' },
    { icon: <YouTubeIcon   fontSize="small" />, href: 'https://youtube.com/nndym',               label: 'YouTube' },
];

const LINK_SX = {
    display: 'block',
    mb: 1,
    fontSize: '0.825rem',
    color: 'rgba(255,255,255,0.55)',
    textDecoration: 'none',
    transition: 'color 0.18s',
    '&:hover': { color: 'white' },
};

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#0a3a6e',
                color: 'white',
                borderTop: '1px solid rgba(255,255,255,0.07)',
            }}
        >
            <Container maxWidth="lg">

                {/* Main row */}
                <Box sx={{
                    py: 5,
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr' },
                    gap: 4,
                }}>
                    {/* Brand */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Image src="/nndym.png" alt="NNDYM" width={28} height={36} style={{ objectFit: 'contain' }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>
                                NNDYM
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 300 }}>
                            Nar Narayan Dev Yuvak Mandal — fostering spiritual growth, cultural values, and community service among youth.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 2.5 }}>
                            {social.map(({ icon, href, label }) => (
                                <IconButton
                                    key={label}
                                    aria-label={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    sx={{
                                        color: 'rgba(255,255,255,0.45)',
                                        transition: 'color 0.18s',
                                        '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
                                    }}
                                >
                                    {icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Box>

                    {/* Quick links */}
                    <Box>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)', mb: 2 }}>
                            Quick Links
                        </Typography>
                        {links.map(({ label, href }) => (
                            <Link key={href} href={href} sx={LINK_SX}>
                                {label}
                            </Link>
                        ))}
                    </Box>

                    {/* Contact */}
                    <Box>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)', mb: 2 }}>
                            Contact
                        </Typography>
                        <Link href="mailto:nndym.usa@gmail.com" sx={LINK_SX}>
                            nndym.usa@gmail.com
                        </Link>
                        <Link href="https://www.nndym.org" target="_blank" rel="noopener noreferrer" sx={LINK_SX}>
                            www.nndym.org
                        </Link>
                    </Box>
                </Box>

                {/* Bottom bar */}
                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.07)', py: 2.5, display: 'flex', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                        © {new Date().getFullYear()} Nar Narayan Dev Yuvak Mandal. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
