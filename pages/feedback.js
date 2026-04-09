import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { apiInfo } from '../utils/api';
import { getSessionToken } from '../utils/auth';

const CARD = {
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
    borderRadius: 2,
    bgcolor: 'background.paper',
    p: 3,
};

function SectionLabel({ children }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.4, color: 'text.disabled', whiteSpace: 'nowrap' }}>
                {children}
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        </Box>
    );
}

export default function Feedback() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSubmitted(false);

        try {
            const token = await getSessionToken();
            if (!token) throw new Error('Session expired. Please log in again.');

            const response = await fetch(apiInfo.feedback.post, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, message }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit feedback');
            }

            setName('');
            setMessage('');
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000);

        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 5000);
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
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h1" component="h1" color="primary" sx={{ mb: 0.5 }}>
                            Feedback
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Share suggestions or features you'd like to see — we read everything.
                        </Typography>
                    </Box>

                    {submitted && (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5 }}>
                            Thank you for your feedback!
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={CARD}>
                        <SectionLabel>Your Message</SectionLabel>
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                size="small"
                                autoFocus
                                sx={{ mb: 1.5 }}
                            />
                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                label="Message / Suggestions"
                                multiline
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                size="small"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2.5, textTransform: 'none', borderRadius: 1.5, fontWeight: 600, px: 3 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Feedback'}
                            </Button>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Layout>
    );
}
