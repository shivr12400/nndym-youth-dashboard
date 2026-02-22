import React from 'react';
import {
    Alert,
    Container,
    Card,
    CardContent,
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
    Paper,
} from '@mui/material';
import Layout from '../components/Layout';

import { useState, useMemo } from 'react';
import { styled } from '@mui/system';
import { apiInfo } from '../utils/api';
import { getSessionToken } from '../utils/auth';
import { mandirs } from '../utils/mandirs';
import { motion } from 'framer-motion';

export default function Register({ isAuthenticated, setIsAuthenticated }) {

    const [mandirName, setMandirName] = useState('');
    const [open, setOpen] = useState(false);
    const [sports, setSports] = useState(false);
    const [singing, setSinging] = useState(false);
    const [instrument, setInstrument] = useState(false);
    const [artsCrafts, setArtsCrafts] = useState(false);
    const [dancing, setDancing] = useState(false);
    const [videoGames, setVideoGames] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [birthdayError, setBirthdayError] = useState('');
    const [emailError, setEmailError] = useState('');

    const [isBirthdayValid, setIsBirthdayValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const [kidInfo, setKidInfo] = useState({
        name: '',
        birthday: '',
        email: '',
        phone: '',
        mandir: '',
        gender: '',
        sportsInterest: sports,
        singingInterest: singing,
        instrumentInterest: instrument,
        artsCraftsInterest: artsCrafts,
        dancingInterest: dancing,
        videoGamesInterest: videoGames,

    });

    const handleChangeSports = (event) => {
        const { name, checked } = event.target;
        setSports(checked)
        setKidInfo(prev => ({ ...prev, [name]: checked }));
    };
    const handleChangeSinging = (event) => {
        const { name, checked } = event.target;
        setSinging(checked);
        setKidInfo(prev => ({ ...prev, [name]: checked }));
    };
    const handleChangeInstrument = (event) => {
        const { name, checked } = event.target;
        setInstrument(checked);
        setKidInfo(prev => ({ ...prev, [name]: checked }));
    };
    const handleChangeArtsCrafts = (event) => {
        const { name, checked } = event.target;
        setArtsCrafts(checked);
        setKidInfo(prev => ({ ...prev, [name]: checked }));
    };
    const handleChangeDancing = (event) => {
        const { name, checked } = event.target;
        setDancing(checked);
        setKidInfo(prev => ({ ...prev, [name]: checked }));
    };
    const handleChangeVideoGames = (event) => {
        const { name, checked } = event.target;
        setVideoGames(checked);
        setKidInfo(prev => ({ ...prev, [name]: checked }));
    };

    const validateBirthday = (value) => {
        const birthdayRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (!birthdayRegex.test(value)) {
            setBirthdayError('Please use MM/DD/YYYY format');
            setIsBirthdayValid(false);
            return false;
        }
        setBirthdayError('');
        setIsBirthdayValid(true);
        return true;
    };

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError('Please enter a valid email address');
            setIsEmailValid(false);
            return false;
        }
        setEmailError('');
        setIsEmailValid(true);
        return true;
    };

    const validatePhone = (value) => {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
            setPhoneError('Please enter a 10-digit phone number');
            setIsPhoneValid(false);
            return false;
        }
        setPhoneError('');
        setIsPhoneValid(true);
        return true;
    };

    const handleRegisterKids = (e) => {
        const { name, value } = e.target;
        setKidInfo(prev => ({ ...prev, [name]: value }));

        if (name === 'birthday') {
            validateBirthday(value);
        } else if (name === 'email') {
            validateEmail(value);
        } else if (name === 'phone') {
            validatePhone(value);
        }
    };

    const handleAnotherRegister = () => {
        setOpen(false)
        setSports(false)
        setSinging(false)
        setInstrument(false)
        setArtsCrafts(false)
        setDancing(false)
        setVideoGames(false)
        setKidInfo(prev => ({
            name: '',
            birthday: '',
            email: '',
            phone: '',
            mandir: prev.mandir,
            gender: '', // Reset gender here
            sportsInterest: sports, singingInterest: singing,
            instrumentInterest: instrument,
            artsCraftsInterest: artsCrafts,
            dancingInterest: dancing,
            videoGamesInterest: videoGames,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isBdayValid = validateBirthday(kidInfo.birthday);
        const isMailValid = validateEmail(kidInfo.email);
        const isPhnValid = validatePhone(kidInfo.phone);

        if (!isBdayValid || !isMailValid || !isPhnValid) {
            console.log('Validation failed. Please check your inputs.');
            return;
        }

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
            console.log(kidInfo)
            if (!response.ok) {
                throw new Error('Failed to update leader info');
            }
            setOpen(true);
            setIsBirthdayValid(false);
            setIsEmailValid(false);
            setIsPhoneValid(false);
        } catch (err) {
            console.log(err)
        }
    };

    const PageTitle = styled(Typography)(({ theme }) => ({
        marginBottom: theme.spacing(5),
        ...theme.typography.h4,
    }));

    return (
        <Layout>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
                    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h1" component="h1" gutterBottom align="center" color="primary">
                            Register Yuvaks / Yuvatis
                        </Typography>

                        <Card sx={{ mb: 4 }}>
                            <CardContent>
                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label="name"
                                        name="name"
                                        value={kidInfo.name}
                                        onChange={handleRegisterKids}
                                    />
                                    <br></br>
                                    <FormControl component="fieldset" margin="normal" fullWidth>
                                        <FormLabel component="legend">Gender</FormLabel>
                                        <RadioGroup
                                            row
                                            name="gender"
                                            value={kidInfo.gender}
                                            onChange={handleRegisterKids}
                                        >
                                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                        </RadioGroup>
                                    </FormControl>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="birthday"
                                        label="birthday (MM/DD/YYYY)"
                                        name="birthday"
                                        value={kidInfo.birthday}
                                        onChange={handleRegisterKids}
                                        error={!!birthdayError}
                                        helperText={birthdayError}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="email"
                                        name="email"
                                        value={kidInfo.email}
                                        onChange={handleRegisterKids}
                                        error={!!emailError}
                                        helperText={emailError}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="phone"
                                        label="phone"
                                        name="phone"
                                        value={kidInfo.phone}
                                        onChange={handleRegisterKids}
                                        error={!!phoneError}
                                        helperText={phoneError}
                                    />
                                    <br></br>
                                    <br></br>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">mandir</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name='mandir'
                                            value={kidInfo.mandir}
                                            label="mandir"
                                            onChange={handleRegisterKids}
                                        >
                                            {mandirs.map(m => (
                                                <MenuItem key={m.mandirName} value={m.mandirName}>{m.mandirName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <br></br>
                                    <br></br>
                                    <Typography variant="h6" gutterBottom>
                                        Interests
                                    </Typography>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox name="sportsInterest" checked={sports} onChange={handleChangeSports} />} label="Sports" />
                                        <FormControlLabel control={<Checkbox name="singingInterest" checked={singing} onChange={handleChangeSinging} />} label="Singing" />
                                        <FormControlLabel control={<Checkbox name="instrumentInterest" checked={instrument} onChange={handleChangeInstrument} />} label="Instruments" />
                                        <FormControlLabel control={<Checkbox name="artsCraftsInterest" checked={artsCrafts} onChange={handleChangeArtsCrafts} />} label="Arts and Crafts" />
                                        <FormControlLabel control={<Checkbox name="dancingInterest" checked={dancing} onChange={handleChangeDancing} />} label="Dancing" />
                                        <FormControlLabel control={<Checkbox name="videoGamesInterest" checked={videoGames} onChange={handleChangeVideoGames} />} label="Video Games" />
                                    </FormGroup>
                                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                                        Submit
                                    </Button>
                                    <br></br>
                                    {open ?
                                        <Button onClick={handleAnotherRegister} variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                                            Submit Another
                                        </Button> : <></>}
                                    <br></br>
                                    <br></br>
                                    {open ?
                                        <Alert severity="success" sx={{ width: '100%' }}>
                                            Successfully submitted!
                                        </Alert> : <></>}
                                </Box>
                            </CardContent>
                        </Card>
                    </Paper>
                </Container>
            </motion.div>

        </Layout>
    );
}
