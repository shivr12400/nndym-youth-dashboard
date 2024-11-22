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
    const [sports, setSports] = useState(false);
    const [singing, setSinging] = useState(false);
    const [instrument, setInstrument] = useState(false);
    const [artsCrafts, setArtsCrafts] = useState(false);
    const [dancing, setDancing] = useState(false);
    const [videoGames, setVideoGames] = useState(false);

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
            console.log(err)
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
                                    name='mandir'
                                    value={kidInfo.mandirName}
                                    label="mandir"
                                    onChange={handleRegisterKids}
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
                                <FormControlLabel control={<Checkbox name="sportsInterest" checked={sports} onChange={handleChangeSports} />} label="Sports" />
                                <FormControlLabel control={<Checkbox name="singingInterest" checked={singing} onChange={handleChangeSinging} />} label="Singing" />
                                <FormControlLabel control={<Checkbox name="instrumentInterest" checked={instrument} onChange={handleChangeInstrument} />} label="Instruments" />
                                <FormControlLabel control={<Checkbox name="artsCraftsInterest" checked={artsCrafts} onChange={handleChangeArtsCrafts} />} label="Arts and Crafts" />
                                <FormControlLabel control={<Checkbox name="dancingInterest" checked={dancing} onChange={handleChangeDancing}/>} label="Dancing" />
                                <FormControlLabel control={<Checkbox name="videoGamesInterest" checked={videoGames} onChange={handleChangeVideoGames}/>} label="Video Games" />
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
