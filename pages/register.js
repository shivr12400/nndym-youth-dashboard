import React, { useState } from 'react';
import {
    Alert,
    Container,
    Box,
    TextField,
    FormGroup,
    FormControlLabel,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    Button,
    Typography,
    Checkbox,
    Radio,
    RadioGroup,
    FormLabel,
} from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { apiInfo } from '../utils/api';
import { getSessionToken } from '../utils/auth';
import { mandirs } from '../utils/mandirs';

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, mt: 1 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.4, color: 'text.disabled', whiteSpace: 'nowrap' }}>
                {children}
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        </Box>
    );
}

const interests = [
    { name: 'sportsInterest', label: 'Sports' },
    { name: 'singingInterest', label: 'Singing' },
    { name: 'instrumentInterest', label: 'Instruments' },
    { name: 'artsCraftsInterest', label: 'Arts & Crafts' },
    { name: 'dancingInterest', label: 'Dancing' },
    { name: 'videoGamesInterest', label: 'Video Games' },
];

export default function Register({ isAuthenticated }) {
    const [open, setOpen] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [birthdayError, setBirthdayError] = useState('');
    const [emailError, setEmailError] = useState('');

    const [kidInfo, setKidInfo] = useState({
        name: '',
        birthday: '',
        email: '',
        phone: '',
        mandir: '',
        gender: '',
        sportsInterest: false,
        singingInterest: false,
        instrumentInterest: false,
        artsCraftsInterest: false,
        dancingInterest: false,
        videoGamesInterest: false,
    });

    const validateBirthday = (value) => {
        const ok = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(value);
        setBirthdayError(ok ? '' : 'Please use MM/DD/YYYY format');
        return ok;
    };

    const validateEmail = (value) => {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailError(ok ? '' : 'Please enter a valid email address');
        return ok;
    };

    const validatePhone = (value) => {
        const ok = /^\d{10}$/.test(value);
        setPhoneError(ok ? '' : 'Please enter a 10-digit phone number');
        return ok;
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const newVal = type === 'checkbox' ? checked : value;
        setKidInfo((prev) => ({ ...prev, [name]: newVal }));
        if (name === 'birthday') validateBirthday(value);
        else if (name === 'email') validateEmail(value);
        else if (name === 'phone') validatePhone(value);
    };

    const handleAnotherRegister = () => {
        setOpen(false);
        setKidInfo((prev) => ({
            name: '', birthday: '', email: '', phone: '',
            mandir: prev.mandir,
            gender: '',
            sportsInterest: false, singingInterest: false,
            instrumentInterest: false, artsCraftsInterest: false,
            dancingInterest: false, videoGamesInterest: false,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = validateBirthday(kidInfo.birthday) && validateEmail(kidInfo.email) && validatePhone(kidInfo.phone);
        if (!ok) return;

        try {
            const token = await getSessionToken();
            if (!token) throw new Error('Session expired. Please log in again.');

            const response = await fetch(apiInfo.kids_list.post, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(kidInfo),
            });

            if (!response.ok) throw new Error('Failed to register');
            setOpen(true);
        } catch (err) {
            console.error(err);
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
                            Register
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Add a Yuvak or Yuvati to your mandir roster.
                        </Typography>
                    </Box>

                    {open && (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5 }}>
                            Successfully registered!
                        </Alert>
                    )}

                    <Box sx={CARD}>
                        <Box component="form" onSubmit={handleSubmit} noValidate>

                            <SectionLabel>Personal Info</SectionLabel>

                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={kidInfo.name}
                                onChange={handleChange}
                                size="small"
                                sx={{ mb: 1.5 }}
                            />

                            <FormControl component="fieldset" sx={{ mb: 1.5 }}>
                                <FormLabel component="legend" sx={{ fontSize: '0.8rem', mb: 0.5 }}>Gender</FormLabel>
                                <RadioGroup row name="gender" value={kidInfo.gender} onChange={handleChange}>
                                    <FormControlLabel value="Male" control={<Radio size="small" />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio size="small" />} label="Female" />
                                </RadioGroup>
                            </FormControl>

                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                label="Birthday (MM/DD/YYYY)"
                                name="birthday"
                                value={kidInfo.birthday}
                                onChange={handleChange}
                                error={!!birthdayError}
                                helperText={birthdayError}
                                size="small"
                                sx={{ mb: 1.5 }}
                            />
                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                label="Email"
                                name="email"
                                value={kidInfo.email}
                                onChange={handleChange}
                                error={!!emailError}
                                helperText={emailError}
                                size="small"
                                sx={{ mb: 1.5 }}
                            />
                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                label="Phone (10 digits)"
                                name="phone"
                                value={kidInfo.phone}
                                onChange={handleChange}
                                error={!!phoneError}
                                helperText={phoneError}
                                size="small"
                                sx={{ mb: 2 }}
                            />

                            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                                <InputLabel>Mandir</InputLabel>
                                <Select
                                    name="mandir"
                                    value={kidInfo.mandir}
                                    label="Mandir"
                                    onChange={handleChange}
                                >
                                    {mandirs.map((m) => (
                                        <MenuItem key={m.mandirName} value={m.mandirName}>{m.mandirName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <SectionLabel>Interests</SectionLabel>

                            <FormGroup row sx={{ mb: 2 }}>
                                {interests.map(({ name, label }) => (
                                    <FormControlLabel
                                        key={name}
                                        control={
                                            <Checkbox
                                                size="small"
                                                name={name}
                                                checked={kidInfo[name]}
                                                onChange={handleChange}
                                            />
                                        }
                                        label={<Typography variant="body2">{label}</Typography>}
                                        sx={{ width: { xs: '100%', sm: '50%' } }}
                                    />
                                ))}
                            </FormGroup>

                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ textTransform: 'none', borderRadius: 1.5, fontWeight: 600, px: 3 }}
                                >
                                    Submit
                                </Button>
                                {open && (
                                    <Button
                                        variant="outlined"
                                        onClick={handleAnotherRegister}
                                        sx={{ textTransform: 'none', borderRadius: 1.5, fontWeight: 600 }}
                                    >
                                        Register Another
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Layout>
    );
}
