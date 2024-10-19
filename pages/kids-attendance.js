// pages/kids-attendance.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, TextField, Box, Card, CardContent, Slider, Checkbox, FormControlLabel, FormGroup, Grid, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, Alert, Snackbar } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Legend } from 'recharts';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { apiInfo } from '../api';
import { activities } from '../activities';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export default function KidsAttendance({ isAuthenticated }) {

    const mandirName = "Colonia"

    const keysToRemove = ["reporter", "kirtanClass", "balMandalClass", "instrumentClass", "satsangClass", "danceClass", "mandirName"];
    function removeKeys(jsonArray, keysToRemove) {
        return jsonArray.map(obj => {
            return Object.fromEntries(
                Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
            );
        });
    }

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const [averageKids, setAverageKids] = useState(0);
    const [tier, setTier] = useState('Bronze');

    // Leader information state
    const [leaderInfo, setLeaderInfo] = useState({
        mandirName: mandirName,
        leaderName: '',
        leaderEmail: '',
        leaderPhone: ''
    });

    const [upcomingEvents, setUpcomingEvents] = useState({
        mandirName: mandirName,
        date: '',
        upcomingEvents: '',
    });

    const [balMandalClass, setBalMandalClass] = React.useState(false);
    const [satsangClass, setSatsangClass] = React.useState(false);
    const [kirtanClass, setKirtanClass] = React.useState(false);
    const [instrumentClass, setInstrumentClass] = React.useState(false);
    const [danceClass, setDanceClass] = React.useState(false);

    const [satsangCount, setSatsangCount] = useState({
        mandirName: mandirName,
        date: '',
        reporter: '',
        numberKidsFirstLevel: 0,
        numberKidsSecondLevel: 0,
        numberKidsThirdLevel: 0,
        numberKidsFourthLevel: 0,
        balMandalClass: balMandalClass,
        satsangClass: satsangClass,
        kirtanClass: kirtanClass,
        instrumentClass: instrumentClass,
        danceClass: danceClass

    });

    const [kidsList, setKidsList] = useState([]);
    const [upcomingAllEvents, setAllUpcomingEvents] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [openEvents, setOpenEvents] = useState(false);

    const handleChangeBMC = (event) => {
        setBalMandalClass(event.target.checked);
    };
    const handleChangeSC = (event) => {
        setSatsangClass(event.target.checked);
    };
    const handleChangeKC = (event) => {
        setKirtanClass(event.target.checked);
    };
    const handleChangeIC = (event) => {
        setInstrumentClass(event.target.checked);
    };
    const handleChangeDC = (event) => {
        setDanceClass(event.target.checked);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        const fetchData = async () => {
            try {
                // Fetch attendance data
                const attendanceResponse = await fetch(apiInfo.kids_attendence.get + "?mandirName=" + mandirName);
                if (!attendanceResponse.ok) {
                    throw new Error('Failed to fetch attendance data');
                }
                const attendanceData = await attendanceResponse.json(); // Fixed: Changed .ok to .json()
                const cleanedArray = removeKeys(attendanceData.satsang_count, keysToRemove);
                setData(cleanedArray);

                // Fetch leader info
                const leaderResponse = await fetch(apiInfo.leader_info.get + "?mandirName=" + mandirName);
                if (!leaderResponse.ok) {
                    throw new Error('Failed to fetch leader info');
                }
                const leaderData = await leaderResponse.json();
                setLeaderInfo(leaderData);

                // Fetch kids info
                const kidsResponse = await fetch(apiInfo.kids_list.get + "?mandirName=" + mandirName);
                if (!kidsResponse.ok) {
                    throw new Error('Failed to fetch leader info');
                }
                const kidsList = await kidsResponse.json();
                setKidsList(kidsList.kids);

                // Fetch kids info
                const upcomingEventsResponse = await fetch(apiInfo.upcoming_events.get + "?mandirName=" + mandirName);
                if (!upcomingEventsResponse.ok) {
                    throw new Error('Failed to fetch leader info');
                }
                const upcomingEventsList = await upcomingEventsResponse.json();
                setAllUpcomingEvents(upcomingEventsList.upcomingEvents);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        setAverageKids(15);
        setTier('Silver');
    }, [isAuthenticated, router]);

    const handleInputChangeLeaderInfo = (e) => {
        const { name, value } = e.target;
        setLeaderInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleInputChangeEvents = (e) => {
        const { name, value } = e.target;
        setUpcomingEvents(prev => ({ ...prev, [name]: value }));
    };

    const handleInputChangeSatsangCount = (e) => {
        const { name, value } = e.target;
        setSatsangCount(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitLeaderInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiInfo.leader_info.post, {
                method: 'POST',
                body: JSON.stringify(leaderInfo),
            });
            if (!response.ok) {
                throw new Error('Failed to update leader info');
            }
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmitSatsangCount = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiInfo.kids_attendence.post, {
                method: 'POST',
                body: JSON.stringify(satsangCount),
            });
            if (!response.ok) {
                throw new Error('Failed to update leader info');
            }
            setOpen(true)
        } catch (err) {
            setError(err.message)
        }
    };

    const handleAnotherSubmitSatsangCount = () => {
        setOpen(false)
        setBalMandalClass(false)
        setSatsangClass(false)
        setKirtanClass(false)
        setInstrumentClass(false)
        setDanceClass(false)
        setSatsangCount({
            mandirName: mandirName,
            date: '',
            reporter: '',
            numberKids: 0,
            balMandalClass: balMandalClass,
            satsangClass: satsangClass,
            kirtanClass: kirtanClass,
            instrumentClass: instrumentClass,
            danceClass: danceClass
        })
    }

    const handleAnotherSubmitEvents = () => {
        setOpenEvents(false)
        setUpcomingEvents({
            date: '',
            upcomingEvents: '',
        })
    }

    const handleSubmitEvents = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiInfo.upcoming_events.post, {
                method: 'POST',
                body: JSON.stringify(upcomingEvents),
            });
            if (!response.ok) {
                throw new Error('Failed to update leader info');
            }
            setOpenEvents(true)
        } catch (err) {
            setError(err.message);
        }
    };

    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 10,
            label: '10',
        },
        {
            value: 20,
            label: '20',
        },
        {
            value: 30,
            label: '30',
        },
        {
            value: 40,
            label: '40',
        },
    ];

    const compareDates = (d1, d2) => {
        let date1 = new Date(d1).getTime();
        let date2 = new Date(d2).getTime() + 604800000;

        if (date1 <= date2) {
            return false;
        } else if (date1 > date2) {
            return true;
        }
    };

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = mm + '/' + dd + '/' + yyyy;
    let lastDate = ""
    for (let i = 0; i < data.length; i++) {
        if (i == data.length - 1) {
            lastDate = data[i].date
        }
    }
    if (!isAuthenticated) {
        return (
            <h1>EXPIRED</h1>
        )
    }

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Button onClick={() => router.push('/dashboard')} variant="contained" color="primary" sx={{ mb: 2 }}>
                    Back to Dashboard
                </Button>
                <br></br>
                <br></br>
                <Typography variant="h4" component="h1" gutterBottom>
                    {mandirName} Mandir
                </Typography>
                <br></br>

                {/* Leader Information Card */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Leader Contact Information
                        </Typography>
                        {isEditing ? (
                            <Box component="form" onSubmit={handleSubmitLeaderInfo} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="leaderName"
                                    label="Name"
                                    name="leaderName"
                                    value={leaderInfo.leaderName}
                                    onChange={handleInputChangeLeaderInfo}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="leaderEmail"
                                    label="Email"
                                    name="leaderEmail"
                                    value={leaderInfo.leaderEmail}
                                    onChange={handleInputChangeLeaderInfo}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="leaderPhone"
                                    label="Phone"
                                    name="leaderPhone"
                                    value={leaderInfo.leaderPhone}
                                    onChange={handleInputChangeLeaderInfo}
                                />
                                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                                    Save
                                </Button>
                                <Button onClick={() => setIsEditing(false)} variant="outlined" sx={{ mt: 2 }}>
                                    Cancel
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Typography>Name: {leaderInfo.leaderName}</Typography>
                                <Typography>Email: {leaderInfo.leaderEmail}</Typography>
                                <Typography>Phone: {leaderInfo.leaderPhone}</Typography>
                                <Button onClick={() => setIsEditing(true)} variant="contained" color="primary" sx={{ mt: 2 }}>
                                    Edit
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
                <br></br>

                {/* Card Information */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Average Kids
                                </Typography>
                                <Typography variant="h3">
                                    {averageKids}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Tier
                                </Typography>
                                <Typography variant="h3">
                                    {tier}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <br></br>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography variant="h6" gutterBottom>
                        Kids Ages 1 - 8
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                       {/* Graphs */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h7" gutterBottom>
                            Kids x Time
                        </Typography>
                        {isLoading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <div style={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={data}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="numberKidsFirstLevel" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* Kids Activities Bar Graph */}
                <Card>
                    <CardContent>
                        <Typography variant="h7" gutterBottom>
                            Top kids activities
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={activities(kidsList)}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography variant="h6" gutterBottom>
                        Kids Ages 9 - 13
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* Graphs */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h7" gutterBottom>
                            Kids x Time
                        </Typography>
                        {isLoading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <div style={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={data}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="numberKidsSecondLevel" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* Kids Activities Bar Graph */}
                <Card>
                    <CardContent>
                        <Typography variant="h7" gutterBottom>
                            Top kids activities
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={activities(kidsList)}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography variant="h6" gutterBottom>
                        Kids Ages 14 - 18
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* Graphs */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h7" gutterBottom>
                            Kids x Time
                        </Typography>
                        {isLoading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <div style={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={data}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="numberKidsThirdLevel" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* Kids Activities Bar Graph */}
                <Card>
                    <CardContent>
                        <Typography variant="h7" gutterBottom>
                            Top kids activities
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={activities(kidsList)}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography variant="h6" gutterBottom>
                        Kids Ages 18 - 25
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* Graphs */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h7" gutterBottom>
                            Kids x Time
                        </Typography>
                        {isLoading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <div style={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={data}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="numberKidsFourthLevel" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* Kids Activities Bar Graph */}
                <Card>
                    <CardContent>
                        <Typography variant="h7" gutterBottom>
                            Top kids activities
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={activities(kidsList)}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                    </AccordionDetails>
                </Accordion>
                
                <br></br>

                {/* Weekly Satsang Count Form */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Submit Weekly Satsang Count
                        </Typography>
                        {compareDates(formattedToday, lastDate) ? (
                            <Alert severity="error">Your satsang count is behind schedule. Last submission was {lastDate} please submit</Alert>
                        ) : (
                            <Alert severity="info">Your next count is due by this Sunday</Alert>
                        )}
                        <Box component="form" onSubmit={handleSubmitSatsangCount} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="date"
                                label="Date"
                                name="date"
                                value={satsangCount.date}
                                onChange={handleInputChangeSatsangCount}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Reporter"
                                name="reporter"
                                value={satsangCount.reporter}
                                onChange={handleInputChangeSatsangCount}
                            />
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={balMandalClass} onChange={handleChangeBMC} />} label="Bal Mandal Class" />
                                <FormControlLabel control={<Checkbox checked={satsangClass} onChange={handleChangeSC} />} label="Satsang Class" />
                                <FormControlLabel control={<Checkbox checked={kirtanClass} onChange={handleChangeKC} />} label="Kirtan Class" />
                                <FormControlLabel control={<Checkbox checked={instrumentClass} onChange={handleChangeIC} />} label="Instrument Class" />
                                <FormControlLabel control={<Checkbox checked={danceClass} onChange={handleChangeDC} />} label="Dance Class" />
                            </FormGroup>
                            <Typography variant="h6" gutterBottom>
                                Number of Kids 1 - 8 years old
                            </Typography>
                            <Slider
                                defaultValue={10}
                                shiftStep={10}
                                step={1}
                                marks={marks}
                                min={0}
                                max={40}
                                valueLabelDisplay="auto"
                                name="numberKidsFirstLevel"
                                value={satsangCount.numberKidsFirstLevel}
                                onChange={handleInputChangeSatsangCount}
                            />
                            <Typography variant="h6" gutterBottom>
                                Number of Kids 9 - 13 years old
                            </Typography>
                            <Slider
                                defaultValue={10}
                                shiftStep={10}
                                step={1}
                                marks={marks}
                                min={0}
                                max={40}
                                valueLabelDisplay="auto"
                                name="numberKidsSecondLevel"
                                value={satsangCount.numberKidsSecondLevel}
                                onChange={handleInputChangeSatsangCount}
                            />
                            <Typography variant="h6" gutterBottom>
                                Number of Kids 14 - 18 years old
                            </Typography>
                            <Slider
                                defaultValue={10}
                                shiftStep={10}
                                step={1}
                                marks={marks}
                                min={0}
                                max={40}
                                valueLabelDisplay="auto"
                                name="numberKidsThirdLevel"
                                value={satsangCount.numberKidsThirdLevel}
                                onChange={handleInputChangeSatsangCount}
                            />
                            <Typography variant="h6" gutterBottom>
                                Number of Kids 19 - 25 years old
                            </Typography>
                            <Slider
                                defaultValue={10}
                                shiftStep={10}
                                step={1}
                                marks={marks}
                                min={0}
                                max={40}
                                valueLabelDisplay="auto"
                                name="numberKidsFourthLevel"
                                value={satsangCount.numberKidsFourthLevel}
                                onChange={handleInputChangeSatsangCount}
                            />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                                Submit
                            </Button>
                            <br></br>
                            {open ?
                                <Button onClick={handleAnotherSubmitSatsangCount} variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
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

                {/* Upcoming Events Card */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Upcoming events
                        </Typography>
                        <br></br>
                        {upcomingEvents.length == 0 ? (
                            <Typography>No Upcoming Events</Typography>
                        ) : (
                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                <Table stickyHeader aria-label="kids information table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Event</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {upcomingAllEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>{event.date}</TableCell>
                                                <TableCell>{event.upcomingEvents}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        <br></br>
                        <Typography variant="h6" gutterBottom>
                            Submit Upcoming Events
                        </Typography>
                        <Box component="form" onSubmit={handleSubmitEvents} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                multiline
                                rows={1}
                                required
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                label="Date (MM/DD/YY)"
                                name="date"
                                value={upcomingEvents.date}
                                onChange={handleInputChangeEvents}
                            />
                            <TextField
                                margin="normal"
                                multiline
                                rows={1}
                                required
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                label="Event"
                                name="upcomingEvents"
                                value={upcomingEvents.upcomingEvents}
                                onChange={handleInputChangeEvents}
                            />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                                Submit
                            </Button>
                            <br></br>
                            {openEvents ?
                                <Button onClick={handleAnotherSubmitEvents} variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                                    Submit Another
                                </Button> : <></>}
                            <br></br>
                            <br></br>
                            {openEvents ?
                                <Alert severity="success" sx={{ width: '100%' }}>
                                    Successfully submitted!
                                </Alert> : <></>}
                        </Box>
                    </CardContent>
                </Card>

                {/* Kids List Table */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Kids List
                        </Typography>
                        <br></br>
                        {kidsList.length == 0 ? (
                            <Typography>No Upcoming Events</Typography>
                        ) : (
                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                <Table stickyHeader aria-label="kids information table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Address</TableCell>
                                            <TableCell>Phone Number</TableCell>
                                            <TableCell>Email</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {kidsList.map((kid) => (
                                            <TableRow key={kid.id}>
                                                <TableCell>{kid.name}</TableCell>
                                                <TableCell>{kid.address}</TableCell>
                                                <TableCell>{kid.phone}</TableCell>
                                                <TableCell>{kid.email}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Layout>
    );
}