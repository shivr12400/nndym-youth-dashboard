import React, { useState, useRef } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    TextField, 
    Button, 
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Layout from '../components/Layout';

export default function Chatbot({ isAuthenticated }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Jai Shri Swaminarayan, how can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userMessage.text }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();
            
            setMessages((prev) => [...prev, { 
                role: 'assistant', 
                text: data.reply || "Sorry, I couldn't process that request." 
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [...prev, { 
                role: 'assistant', 
                text: 'Error: Could not connect to the assistant. Please try again later.' 
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
            <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', height: '80vh' }}>
                <Typography variant="h1" component="h1" gutterBottom color="primary">
                    NNDYM AI Assistant
                </Typography>
                
                <Paper 
                    sx={{ 
                        flexGrow: 1, 
                        p: 2, 
                        mb: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        overflowY: 'auto',
                        backgroundColor: 'background.default'
                    }}
                >
                    {messages.map((msg, index) => (
                        <Box 
                            key={index} 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                mb: 2 
                            }}
                        >
                            <Paper 
                                elevation={1}
                                sx={{ 
                                    p: 2, 
                                    maxWidth: '75%', 
                                    backgroundColor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                                    color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                    borderRadius: 2
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', pt: 0.5 }}>
                                        {msg.text}
                                    </Typography>
                                    {msg.role === 'assistant' && (
                                        <Tooltip title="Copy response">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => navigator.clipboard.writeText(msg.text)}
                                                sx={{ ml: 2, mt: -0.5, mr: -1, color: 'text.secondary' }}
                                            >
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                    ))}
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                            <Paper sx={{ p: 2, borderRadius: 2 }}>
                                <CircularProgress size={24} />
                            </Paper>
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Paper>

                <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        disabled={isLoading || !input.trim()}
                        sx={{ minWidth: '100px' }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                    </Button>
                </Box>
            </Container>
        </Layout>
    );
}