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
} from '@mui/material';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { useState, useMemo } from 'react';
import { styled } from '@mui/system';
import { apiInfo } from '../api';

export default function Register({ isAuthenticated, setIsAuthenticated }) {

    const [mandirName, setMandirName] = useState('');
    const [open, setOpen] = useState(false);
    const [sports, setSports] = React.useState(false);
    const [singing, setSinging] = React.useState(false);
    const [instrument, setInstrument] = React.useState(false);
    const [artsCrafts, setArtsCrafts] = React.useState(false);
    const [dancing, setDancing] = React.useState(false);
    const [videoGames, setVideoGames] = React.useState(false);

    const [kidInfo, setKidInfo] = useState({
        name: '',
        birthday: '',
        email: '',
        phone: '',
        address: '',
        mandir: '',
        sportsInterest: sports,
        singingInterest: singing,
        instrumentInterest: instrument,
        artsCraftsInterest: artsCrafts,
        dancingInterest: dancing,
        videoGamesInterest: videoGames,

    });

    const handleChangeMandirName = (event) => {
        setMandirName(event.target.value);
    };
    const handleChangeSports = (event) => {
        setSports(event.target.checked);
    };
    const handleChangeSinging = (event) => {
        setSinging(event.target.checked);
    };
    const handleChangeInstrument = (event) => {
        setInstrument(event.target.checked);
    };
    const handleChangeArtsCrafts = (event) => {
        setArtsCrafts(event.target.checked);
    };
    const handleChangeDancing = (event) => {
        setDancing(event.target.checked);
    };
    const handleChangeVideoGames = (event) => {
        setVideoGames(event.target.checked);
    };

    const handleRegisterKids = (e) => {
        const { name, value } = e.target;
        setKidInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleAnotherRegister = () => {
        setOpen(false)
        setSports(false)
        setSinging(false)
        setInstrument(false)
        setArtsCrafts(false)
        setDancing(false)
        setVideoGames(false)
        setKidInfo({
            name: '',
            birthday: '',
            email: '',
            phone: '',
            address: '',
            mandir: '',
            sportsInterest: sports,
            singingInterest: singing,
            instrumentInterest: instrument,
            artsCraftsInterest: artsCrafts,
            dancingInterest: dancing,
            videoGamesInterest: videoGames,

        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiInfo.kids_list.post, {
                method: 'POST',
                body: JSON.stringify(kidInfo),
            });
            if (!response.ok) {
                throw new Error('Failed to update leader info');
            }
            setOpen(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const Title = styled(Typography)(({ theme }) => ({
        marginBottom: "40px"
    }));

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Title variant="h3" marginTop={"4"}>
                    Register Kids
                </Title>
                {/* Form Card */}
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="birthday"
                                label="birthday"
                                name="birthday"
                                value={kidInfo.birthday}
                                onChange={handleRegisterKids}
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
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="address"
                                label="address"
                                name="address"
                                value={kidInfo.address}
                                onChange={handleRegisterKids}
                            />
                            <br></br>
                            <br></br>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">mandir</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={mandirName}
                                    label="mandir"
                                    onChange={handleChangeMandirName}
                                >
                                    <MenuItem value={"Colonia"}>Colonia</MenuItem>
                                    <MenuItem value={"PSP"}>PSP</MenuItem>
                                    <MenuItem value={"Weehawken"}>Wee</MenuItem>
                                </Select>
                            </FormControl>
                            <br></br>
                            <br></br>
                            <Typography variant="h6" gutterBottom>
                                Interests
                            </Typography>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={sports} onChange={handleChangeSports} />} label="Sports" />
                                <FormControlLabel control={<Checkbox checked={singing} onChange={handleChangeSinging} />} label="Singing" />
                                <FormControlLabel control={<Checkbox checked={instrument} onChange={handleChangeInstrument} />} label="Instruments" />
                                <FormControlLabel control={<Checkbox checked={artsCrafts} onChange={handleChangeArtsCrafts} />} label="Arts and Crafts" />
                                <FormControlLabel control={<Checkbox checked={dancing} onChange={handleChangeDancing} />} label="Dancing" />
                                <FormControlLabel control={<Checkbox checked={videoGames} onChange={handleChangeVideoGames} />} label="Video Games" />
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
            </Container>
            <Footer />
        </Layout>
    );
}
