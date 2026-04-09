import React, { useState } from 'react';
import Image from 'next/image';
import {
    AppBar, Toolbar, Box, Container, IconButton,
    Drawer, List, ListItem, ListItemText, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { label: 'Home',                    path: '/' },
    { label: 'Submit Satsang',          path: '/submit-satsang' },
    { label: 'Register',                path: '/register' },
    { label: 'Information',             path: '/information' },
    { label: 'Feedback',                path: '/feedback' },
    { label: 'AI Assistant',            path: '/chatbot' },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();

    const isActive = (path) =>
        path === '/' ? router.pathname === '/' : router.pathname.startsWith(path);

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                top: 0,
                zIndex: 1200,
                background: 'rgba(9, 77, 146, 0.96)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ minHeight: 64 }}>

                    {/* Logo */}
                    <Link href="/" passHref style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <Image src="/nndym.png" alt="NNDYM" width={32} height={42} style={{ objectFit: 'contain' }} />
                    </Link>

                    <Box sx={{ flex: 1 }} />

                    {/* Desktop nav */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {navItems.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link key={item.path} href={item.path} passHref style={{ textDecoration: 'none' }}>
                                        <Box
                                            component="span"
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                px: 1.5,
                                                py: 0.75,
                                                borderRadius: 1.5,
                                                fontSize: '0.8rem',
                                                fontWeight: active ? 600 : 400,
                                                color: active ? 'white' : 'rgba(255,255,255,0.68)',
                                                bgcolor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'color 0.18s, background 0.18s',
                                                '&:hover': {
                                                    color: 'white',
                                                    bgcolor: 'rgba(255,255,255,0.09)',
                                                },
                                            }}
                                        >
                                            {item.label}
                                        </Box>
                                    </Link>
                                );
                            })}
                        </Box>
                    )}

                    {/* Mobile menu button */}
                    {isMobile && (
                        <IconButton
                            onClick={() => setOpen(true)}
                            sx={{ color: 'white', ml: 1 }}
                            aria-label="open menu"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </Container>

            {/* Mobile drawer */}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        width: { xs: 240, sm: 260 },
                        bgcolor: '#094D92',
                        color: 'white',
                        pt: 2,
                    },
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Image src="/nndym.png" alt="NNDYM" width={28} height={36} style={{ objectFit: 'contain' }} />
                    <IconButton onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                        >
                            <List sx={{ pt: 1 }}>
                                {navItems.map((item) => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link key={item.path} href={item.path} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <ListItem
                                                onClick={() => setOpen(false)}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    mx: 1,
                                                    px: 2,
                                                    mb: 0.5,
                                                    bgcolor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <ListItemText
                                                    primary={item.label}
                                                    primaryTypographyProps={{
                                                        fontSize: '0.9rem',
                                                        fontWeight: active ? 600 : 400,
                                                        color: active ? 'white' : 'rgba(255,255,255,0.72)',
                                                    }}
                                                />
                                            </ListItem>
                                        </Link>
                                    );
                                })}
                            </List>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Drawer>
        </AppBar>
    );
}
