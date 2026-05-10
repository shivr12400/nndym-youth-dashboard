import Link from 'next/link';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const links = [
    { label: 'Home',         href: '/' },
    { label: 'Tiers & Info', href: '/information' },
    { label: 'Register',     href: '/register' },
    { label: 'Log Satsang',  href: '/submit-satsang' },
    { label: 'Feedback',     href: '/feedback' },
];

const social = [
    { icon: <InstagramIcon sx={{ fontSize: 16 }} />, href: 'https://www.instagram.com/officialnndym/', label: 'Instagram' },
    { icon: <FacebookIcon  sx={{ fontSize: 16 }} />, href: 'https://www.facebook.com/officialnndym',  label: 'Facebook' },
    { icon: <YouTubeIcon   sx={{ fontSize: 16 }} />, href: 'https://youtube.com/nndym',               label: 'YouTube' },
];

function NLogo({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
            <circle cx="16" cy="16" r="14" fill="currentColor" />
            <path d="M11 10v12M11 10l10 12M21 10v12" stroke="#F9F5EE" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="yd-footer">
            <div className="yd-footer__inner">
                {/* Brand */}
                <div>
                    <div className="yd-footer__brand">
                        <span style={{ color: 'var(--ink)' }}><NLogo size={24} /></span>
                        <span className="yd-footer__name">NNDYM</span>
                    </div>
                    <p className="yd-footer__tagline">
                        Nar Narayan Dev Yuvak Mandal — fostering spiritual growth, cultural values, and community service among youth.
                    </p>
                    <div className="yd-footer__social">
                        {social.map(({ icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="yd-footer__socbtn"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick links */}
                <div>
                    <p className="yd-footer__col-label">Quick Links</p>
                    {links.map(({ label, href }) => (
                        <Link key={href} href={href} className="yd-footer__link">
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Contact */}
                <div>
                    <p className="yd-footer__col-label">Contact</p>
                    <a href="mailto:nndym.usa@gmail.com" className="yd-footer__link">nndym.usa@gmail.com</a>
                    <a href="https://www.nndym.org" target="_blank" rel="noopener noreferrer" className="yd-footer__link">www.nndym.org</a>
                </div>
            </div>
            <div className="yd-footer__bottom">
                © {new Date().getFullYear()} Nar Narayan Dev Yuvak Mandal. All rights reserved.
            </div>
        </footer>
    );
}
