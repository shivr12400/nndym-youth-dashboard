import React, { useState, useRef, useEffect } from 'react';
import { Container } from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Icon from '../components/common/Icon';

const SUGGESTIONS = [
    'How do I get to Silver tier?',
    'Ideas for a Bal Mandal lesson?',
    'What events should we plan this quarter?',
];

export default function Chatbot({ isAuthenticated }) {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Jai Shri Swaminarayan! I\'m your NNDYM assistant. Ask me about lesson plans, tier requirements, or anything mandir related.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bodyRef = useRef(null);

    useEffect(() => {
        bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, isLoading]);

    const sendMessage = async (text) => {
        const q = (text || input).trim();
        if (!q) return;
        setMessages(prev => [...prev, { role: 'user', text: q }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('https://uxso1kh31g.execute-api.us-east-2.amazonaws.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: q }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');
            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'bot',
                text: data.reply || "Sorry, I couldn't process that request.",
            }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'bot',
                text: 'Could not connect to the assistant. Please try again later.',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated === false) return <h1>EXPIRED</h1>;

    return (
        <Layout>
            <Container maxWidth="sm" sx={{ pt: 5, pb: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <div className="yd-page--narrow">

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.015em', marginBottom: '0.3rem' }}>
                                AI Assistant
                            </h1>
                            <p style={{ color: 'var(--ink-2)', margin: 0, fontSize: '0.95rem' }}>
                                Ask about lesson plans, mandir info, or anything NNDYM related.
                            </p>
                        </div>

                        <div className="yd-card yd-chat">
                            <div className="yd-chat__head">
                                <div className="yd-chat__brand">
                                    <span className="yd-chat__chatavatar">
                                        <Icon name="sparkle" size={18} />
                                    </span>
                                    <div>
                                        <div className="yd-chat__name">NNDYM Assistant</div>
                                        <div className="yd-chat__status">
                                            <span className="yd-dot yd-dot--mint" />
                                            Online
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="yd-chat__body" ref={bodyRef}>
                                {messages.map((m, i) => (
                                    <div key={i} className={`yd-chat__msg yd-chat__msg--${m.role}`}>
                                        {m.text}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="yd-chat__thinking">
                                        <span style={{ display: 'inline-flex', gap: '3px' }}>
                                            {[0, 1, 2].map(i => (
                                                <span key={i} style={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    background: 'var(--ink-3)',
                                                    animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`,
                                                }} />
                                            ))}
                                        </span>
                                        Thinking…
                                    </div>
                                )}
                            </div>

                            {messages.length <= 2 && (
                                <div className="yd-chat__suggest">
                                    {SUGGESTIONS.map(s => (
                                        <button
                                            key={s}
                                            className="yd-pill"
                                            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', minHeight: 36 }}
                                            onClick={() => sendMessage(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="yd-chat__inputrow">
                                <input
                                    className="yd-input"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !isLoading && sendMessage()}
                                    placeholder="Ask anything…"
                                    disabled={isLoading}
                                />
                                <button
                                    className="yd-iconbtn yd-iconbtn--send"
                                    onClick={() => sendMessage()}
                                    disabled={isLoading || !input.trim()}
                                    aria-label="Send"
                                >
                                    <Icon name="send" size={18} />
                                </button>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </Container>
        </Layout>
    );
}
