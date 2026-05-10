import React, { useState } from 'react';
import { Container } from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { apiInfo } from '../utils/api';
import { getSessionToken } from '../utils/auth';
import { mandirs } from '../utils/mandirs';
import Icon from '../components/common/Icon';

const INTERESTS = [
    { name: 'sportsInterest',    label: 'Sports' },
    { name: 'singingInterest',   label: 'Singing' },
    { name: 'instrumentInterest', label: 'Instruments' },
    { name: 'artsCraftsInterest', label: 'Arts & Crafts' },
    { name: 'dancingInterest',   label: 'Dancing' },
    { name: 'videoGamesInterest', label: 'Video Games' },
];

export default function Register({ isAuthenticated }) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [birthdayError, setBirthdayError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const [kidInfo, setKidInfo] = useState({
        name: '', birthday: '', email: '', phone: '',
        mandir: '', gender: '',
        sportsInterest: false, singingInterest: false,
        instrumentInterest: false, artsCraftsInterest: false,
        dancingInterest: false, videoGamesInterest: false,
    });

    const validateBirthday = v => { const ok = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(v); setBirthdayError(ok ? '' : 'Use MM/DD/YYYY'); return ok; };
    const validateEmail    = v => { const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); setEmailError(ok ? '' : 'Invalid email'); return ok; };
    const validatePhone    = v => { const ok = /^\d{10}$/.test(v); setPhoneError(ok ? '' : '10 digits required'); return ok; };

    const handleChange = e => {
        const { name, value, checked, type } = e.target;
        setKidInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (name === 'birthday') validateBirthday(value);
        else if (name === 'email') validateEmail(value);
        else if (name === 'phone') validatePhone(value);
    };

    const toggleInterest = name => setKidInfo(prev => ({ ...prev, [name]: !prev[name] }));

    const handleSubmit = async e => {
        e.preventDefault();
        const ok = validateBirthday(kidInfo.birthday) && validateEmail(kidInfo.email) && validatePhone(kidInfo.phone);
        if (!ok) return;
        setLoading(true);
        setError('');

        try {
            const token = await getSessionToken();
            if (!token) throw new Error('Session expired. Please log in again.');

            const response = await fetch(apiInfo.kids_list.post, {
                method: 'POST',
                headers: { 'Authorization': `${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(kidInfo),
            });

            if (!response.ok) throw new Error('Failed to register');
            setSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAnother = () => {
        setSubmitted(false);
        setKidInfo(prev => ({
            name: '', birthday: '', email: '', phone: '',
            mandir: prev.mandir, gender: '',
            sportsInterest: false, singingInterest: false,
            instrumentInterest: false, artsCraftsInterest: false,
            dancingInterest: false, videoGamesInterest: false,
        }));
    };

    const valid = kidInfo.name && kidInfo.birthday && !birthdayError && kidInfo.email && !emailError && kidInfo.phone && !phoneError;

    return (
        <Layout>
            <Container maxWidth="sm" sx={{ pt: 5, pb: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <div className="yd-page yd-page--narrow">

                        <div className="yd-card yd-submit">
                            {submitted ? (
                                <div className="yd-success">
                                    <div className="yd-success__check">
                                        <Icon name="check" size={36} stroke={3} />
                                    </div>
                                    <h2>{kidInfo.name || 'Kid'} registered!</h2>
                                    <p>Added to {kidInfo.mandir || 'your mandir'}'s roster.</p>
                                    <div className="yd-submit__actions" style={{ justifyContent: 'center' }}>
                                        <button className="yd-btn yd-btn--ghost" onClick={handleAnother}>Register another</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="yd-submit__eyebrow">Register a kid</div>
                                    <h1 className="yd-submit__title">Add to your sangat</h1>
                                    <p className="yd-submit__sub">A few details to add this yuvak/yuvati to your mandir.</p>

                                    <form onSubmit={handleSubmit} noValidate>

                                        <div className="yd-submit__field">
                                            <label htmlFor="reg-name">Full name</label>
                                            <input
                                                id="reg-name"
                                                className="yd-input"
                                                name="name"
                                                value={kidInfo.name}
                                                onChange={handleChange}
                                                placeholder="e.g. Aarav Patel"
                                                required
                                            />
                                        </div>

                                        <div className="yd-submit__row2">
                                            <div className="yd-submit__field" style={{ marginBottom: 0 }}>
                                                <label htmlFor="reg-bday">Birthday</label>
                                                <input
                                                    id="reg-bday"
                                                    className={`yd-input${birthdayError ? ' yd-input--error' : ''}`}
                                                    name="birthday"
                                                    value={kidInfo.birthday}
                                                    onChange={handleChange}
                                                    placeholder="MM/DD/YYYY"
                                                    required
                                                />
                                                {birthdayError && <p className="yd-input__hint">{birthdayError}</p>}
                                            </div>
                                            <div className="yd-submit__field" style={{ marginBottom: 0 }}>
                                                <label>Gender</label>
                                                <div className="yd-pills">
                                                    {['Male', 'Female'].map(g => (
                                                        <button
                                                            key={g} type="button"
                                                            className={`yd-pill${kidInfo.gender === g ? ' is-active' : ''}`}
                                                            onClick={() => setKidInfo(p => ({ ...p, gender: g }))}
                                                        >
                                                            {g}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }} />

                                        <div className="yd-submit__row2">
                                            <div className="yd-submit__field" style={{ marginBottom: 0 }}>
                                                <label htmlFor="reg-email">Email</label>
                                                <input
                                                    id="reg-email"
                                                    className={`yd-input${emailError ? ' yd-input--error' : ''}`}
                                                    name="email"
                                                    type="email"
                                                    value={kidInfo.email}
                                                    onChange={handleChange}
                                                    placeholder="name@email.com"
                                                    required
                                                />
                                                {emailError && <p className="yd-input__hint">{emailError}</p>}
                                            </div>
                                            <div className="yd-submit__field" style={{ marginBottom: 0 }}>
                                                <label htmlFor="reg-phone">Phone</label>
                                                <input
                                                    id="reg-phone"
                                                    className={`yd-input${phoneError ? ' yd-input--error' : ''}`}
                                                    name="phone"
                                                    value={kidInfo.phone}
                                                    onChange={handleChange}
                                                    placeholder="10 digits"
                                                    required
                                                />
                                                {phoneError && <p className="yd-input__hint">{phoneError}</p>}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }} />

                                        <div className="yd-submit__field">
                                            <label htmlFor="reg-mandir">Mandir</label>
                                            <select
                                                id="reg-mandir"
                                                className="yd-input"
                                                name="mandir"
                                                value={kidInfo.mandir}
                                                onChange={handleChange}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <option value="">Select mandir…</option>
                                                {mandirs.map(m => (
                                                    <option key={m.mandirName} value={m.mandirName}>{m.mandirName}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="yd-submit__field">
                                            <label>Interests</label>
                                            <div className="yd-checks">
                                                {INTERESTS.map(({ name, label }) => (
                                                    <button
                                                        key={name} type="button"
                                                        className={`yd-check${kidInfo[name] ? ' is-on' : ''}`}
                                                        onClick={() => toggleInterest(name)}
                                                    >
                                                        <span className="yd-check__box">
                                                            {kidInfo[name] && <Icon name="check" size={12} stroke={3} />}
                                                        </span>
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {error && (
                                            <p style={{ color: 'oklch(0.55 0.15 20)', fontSize: '0.88rem', margin: '0 0 1rem', textAlign: 'right' }}>{error}</p>
                                        )}

                                        <div className="yd-submit__actions">
                                            <button
                                                type="submit"
                                                className="yd-btn yd-btn--primary"
                                                disabled={loading || !valid}
                                            >
                                                <Icon name="plus" size={16} />
                                                <span>{loading ? 'Registering…' : 'Register'}</span>
                                            </button>
                                        </div>
                                        {!valid && (
                                            <p className="yd-submit__hint">Fill in all required fields to register.</p>
                                        )}
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </Container>
        </Layout>
    );
}
