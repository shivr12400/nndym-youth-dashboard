import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

export default function Feedback() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to a backend API
        console.log('Feedback Submitted:', { name, message });
        // For now, just reset the form and show a success message
        setName('');
        setMessage('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000); // Hide success message after 5 seconds
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
                        >
                            Submit Feedback
                        </Button>
                    </Box>
                </Container>
            </motion.div>
        </Layout>
    );
}
