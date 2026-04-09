import React, { useState, useRef, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

export default function Chatbot({ isAuthenticated }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Jai Shri Swaminarayan, how can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('https://uxso1kh31g.execute-api.us-east-2.amazonaws.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMessage.text }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();
            setMessages((prev) => [...prev, {
                role: 'assistant',
                text: data.reply || "Sorry, I couldn't process that request.",
            }]);
        } catch {
            setMessages((prev) => [...prev, {
                role: 'assistant',
                text: 'Could not connect to the assistant. Please try again later.',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated === false) {
        return <h1>EXPIRED</h1>;
    }

    return (
        <Layout>
            <Container maxWidth="md" sx={{ pt: 4, pb: 4, display: 'flex', flexDirection: 'column', height: '85vh' }}>
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
                >
                    <Box sx={{ mb: 2.5 }}>
                        <Typography variant="h1" component="h1" color="primary" sx={{ mb: 0.25 }}>
                            AI Assistant
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ask about lesson plans, mandir info, or anything NNDYM related.
                        </Typography>
                    </Box>

                    {/* Messages area */}
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: '#f9fafc',
                        p: 2,
                        mb: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                    }}>
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '75%',
                                        px: 2,
                                        py: 1.25,
                                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                        bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                                        color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                        border: '1px solid',
                                        borderColor: msg.role === 'user' ? 'primary.main' : 'divider',
                                        position: 'relative',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 }}>
                                            {msg.text}
                                        </Typography>
                                        {msg.role === 'assistant' && (
                                            <Tooltip title="Copy">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigator.clipboard.writeText(msg.text)}
                                                    sx={{ ml: 0.5, mt: -0.5, color: 'text.disabled', flexShrink: 0, '&:hover': { color: 'text.secondary' } }}
                                                >
                                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        ))}

                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Box sx={{
                                    px: 2, py: 1.25,
                                    border: '1px solid', borderColor: 'divider',
                                    borderRadius: '16px 16px 16px 4px',
                                    bgcolor: 'background.paper',
                                    display: 'flex', alignItems: 'center', gap: 1,
                                }}>
                                    <CircularProgress size={16} />
                                    <Typography variant="body2" color="text.secondary">Thinking…</Typography>
                                </Box>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input */}
                    <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading || !input.trim()}
                            sx={{ px: 2.5, borderRadius: 2, textTransform: 'none', minWidth: 'auto' }}
                        >
                            <SendIcon fontSize="small" />
                        </Button>
                    </Box>
                </motion.div>
            </Container>
        </Layout>
    );
}
