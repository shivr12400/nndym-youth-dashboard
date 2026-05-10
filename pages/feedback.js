import React, { useState } from 'react';
import { Container } from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { apiInfo } from '../utils/api';
import { getSessionToken } from '../utils/auth';
import Icon from '../components/common/Icon';

export default function Feedback() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setLoading(true);
        setError('');

        try {
            const token = await getSessionToken();
            if (!token) throw new Error('Session expired. Please log in again.');

            const response = await fetch(apiInfo.feedback.post, {
                method: 'POST',
                headers: { 'Authorization': `${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to submit feedback');
            }

            setName('');
            setMessage('');
            setSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                                    <h2>Thanks for the feedback!</h2>
                                    <p>We read every note. The team will get back to you if needed.</p>
                                    <div className="yd-submit__actions" style={{ justifyContent: 'center' }}>
                                        <button className="yd-btn yd-btn--primary" onClick={() => setSubmitted(false)}>
                                            Send another
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="yd-submit__eyebrow">Feedback</div>
                                    <h1 className="yd-submit__title">Tell us what&apos;s up</h1>
                                    <p className="yd-submit__sub">Bugs, ideas, things we should fix — all welcome.</p>

                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="yd-submit__field">
                                            <label htmlFor="fb-name">Your name</label>
                                            <input
                                                id="fb-name"
                                                className="yd-input"
                                                type="text"
                                                placeholder="Optional"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="yd-submit__field">
                                            <label htmlFor="fb-msg">Message</label>
                                            <textarea
                                                id="fb-msg"
                                                className="yd-input yd-textarea"
                                                rows={6}
                                                placeholder="What's on your mind?"
                                                value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {error && (
                                            <p style={{ color: 'oklch(0.55 0.15 20)', fontSize: '0.88rem', margin: '0 0 1rem' }}>{error}</p>
                                        )}

                                        <div className="yd-submit__actions">
                                            <button type="submit" className="yd-btn yd-btn--primary" disabled={loading || !message.trim()}>
                                                <Icon name="send" size={16} />
                                                <span>{loading ? 'Sending…' : 'Send'}</span>
                                            </button>
                                        </div>
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
