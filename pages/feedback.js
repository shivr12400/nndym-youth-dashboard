import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { apiInfo } from '../utils/api'; // Import apiInfo

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
            const response = await fetch(apiInfo.feedback.post, {
                method: 'POST',
                body: JSON.stringify({ name, message }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit feedback');
            }

            setName('');
            setMessage('');
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000); // Hide success message after 5 seconds

        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 5000); // Hide error message after 5 seconds
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <Container maxWidth="md" sx={{ py: 6 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Feedback
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We'd love to hear your thoughts on how we can improve the site. Please share any suggestions or features you'd like to see!
                    </Typography>

                    {submitted && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Thank you for your feedback! We appreciate your input.
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            Error: {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Your Name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="message"
                            label="Your Message / Improvement Suggestions"
                            name="message"
                            multiline
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
                        </Button>
                    </Box>
                </Container>
            </motion.div>
        </Layout>
    );
}
