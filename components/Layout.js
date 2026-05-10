import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const { pathname } = useRouter();
    const isLoginPage = pathname === '/login';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--cream)', overflowX: 'hidden' }}>
            <Navbar />
            <main style={{ flexGrow: 1 }}>
                {children}
            </main>
            {!isLoginPage && <Footer />}
        </div>
    );
}
