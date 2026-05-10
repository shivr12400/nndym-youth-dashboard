import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getUserEmail } from '../utils/auth';
import { mandirs } from '../utils/mandirs';

function normalize(str) {
    return str.toLowerCase().replace(/[\s-]/g, '');
}

function getMandirPath(email) {
    if (!email) return '/kids-attendance';
    const prefix = email.split('@')[0];
    if (prefix === 'admin') return '/kids-attendance';
    const match = mandirs.find(m => normalize(m.mandirName) === normalize(prefix));
    return match ? `/kids-attendance?mandirName=${encodeURIComponent(match.mandirName)}` : '/kids-attendance';
}

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [mandirPath, setMandirPath] = useState('/kids-attendance');
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width: 860px)');

    useEffect(() => {
        getUserEmail().then(email => setMandirPath(getMandirPath(email)));
    }, []);

    const navItems = [
        { label: 'Home',         path: '/' },
        { label: 'My Mandir',    path: mandirPath },
        { label: 'Log Satsang',  path: '/submit-satsang' },
        { label: 'Register',     path: '/register' },
        { label: 'Tiers & Info', path: '/information' },
        { label: 'Feedback',     path: '/feedback' },
        { label: 'AI Assistant', path: '/chatbot' },
    ];

    const isActive = (path) =>
        path === '/' ? router.pathname === '/' : router.pathname.startsWith(path.split('?')[0]);

    const isLoginPage = router.pathname === '/login';

    return (
        <header className="yd-nav">
            <div className="yd-nav__inner">
                {/* Brand */}
                <Link href="/" className="yd-nav__brand" style={{ textDecoration: 'none' }}>
                    <Image
                        src="/blacknndym.png"
                        alt="NNDYM logo"
                        width={100}
                        height={32}
                        style={{ objectFit: 'contain', display: 'block' }}
                        priority
                    />
                </Link>

                {/* Desktop nav links */}
                {!isMobile && !isLoginPage && (
                    <nav className="yd-nav__links">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`yd-nav__link ${isActive(item.path) ? 'is-active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}

                {(isMobile || isLoginPage) && <div style={{ flex: 1 }} />}

                {/* Right side */}
                {!isLoginPage && (
                    <div className="yd-nav__right">
                        <div
                            className="yd-avatar yd-avatar--coral"
                            style={{ width: 36, height: 36, fontSize: 14 }}
                        >
                            ML
                        </div>
                        {isMobile && (
                            <IconButton
                                onClick={() => setOpen(true)}
                                aria-label="open menu"
                                sx={{
                                    color: 'var(--ink)',
                                    border: '1px solid var(--line)',
                                    borderRadius: '999px',
                                    width: 40, height: 40,
                                    background: 'var(--surface)',
                                }}
                            >
                                <MenuIcon fontSize="small" />
                            </IconButton>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        width: 260,
                        bgcolor: 'var(--surface)',
                        color: 'var(--ink)',
                        pt: 1,
                        borderLeft: '1px solid var(--line)',
                    },
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid var(--line)' }}>
                    <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>
                        Menu
                    </span>
                    <IconButton onClick={() => setOpen(false)} sx={{ color: 'var(--ink-3)' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <List sx={{ pt: 0.5, px: 0.75 }}>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }} onClick={() => setOpen(false)}>
                                <ListItem
                                    sx={{
                                        borderRadius: '999px',
                                        mb: 0.25,
                                        px: 1.5,
                                        bgcolor: active ? 'var(--ink)' : 'transparent',
                                        '&:hover': { bgcolor: active ? 'var(--ink)' : 'var(--cream-2)' },
                                        cursor: 'pointer',
                                    }}
                                >
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontFamily: '"DM Sans", sans-serif',
                                            fontSize: '0.92rem',
                                            fontWeight: active ? 600 : 500,
                                            color: active ? 'var(--cream)' : 'var(--ink-2)',
                                        }}
                                    />
                                </ListItem>
                            </Link>
                        );
                    })}
                </List>
            </Drawer>
        </header>
    );
}
