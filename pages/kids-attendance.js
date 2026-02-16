// pages/kids-attendance.js
import React, { useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Button, 
    CircularProgress, 
    Box, 
    Grid, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField,
    Snackbar,
    Alert 
} from '@mui/material';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useKidsAttendance } from '../hooks/useKidsAttendance';
import LeaderInfoCard from '../components/kids-attendance/LeaderInfoCard';
import StatsCards from '../components/kids-attendance/StatsCards';
import AgeDistributionChart from '../components/kids-attendance/AgeDistributionChart';
import AttendanceCharts from '../components/kids-attendance/AttendanceCharts';
// SatsangForm import removed
import UpcomingEvents from '../components/kids-attendance/UpcomingEvents';
import KidsListTable from '../components/kids-attendance/KidsListTable';
import GenderDistributionChart from '../components/kids-attendance/GenderDistributionChart';
import KidsOverTimeChart from '../components/kids-attendance/KidsOverTimeChart';
import { activities } from '../utils/activities';

export default function KidsAttendance({ isAuthenticated }) {
    const router = useRouter();
    const {
        mandirName,
        data,
        isLoading,
        error,
        averageKids,
        tier,
        leaderInfo,
        upcomingEvents,
        // Removed destructured form handlers related to SatsangForm
        kidsList,
        upcomingAllEvents,
        isEditing,
        openGoalsSnackbar,
        handleCloseGoalsSnackbar,
        ageDistributionData,
        genderDistributionData,
        kidsOverTimeData,
        genderDistributionDataByAgeGroup,
        goals,
        handleInputChangeGoals,
        handleSubmitGoals,
        setIsEditing,
        handleInputChangeLeaderInfo,
        handleInputChangeEvents,
        handleEventsDateBlur,
        handleSubmitLeaderInfo,
        handleAnotherSubmitEvents,
        handleSubmitEvents,
        handleRefreshPage,
        eventsDateError,
        openEvents,
    } = useKidsAttendance(isAuthenticated);

    useEffect(() => {
        if (data && data.length > 0) {
            console.log("DEBUG: Data Keys found:", Object.keys(data[0]));
        }
    }, [data]);

    const getOccurrenceCount = (activityName) => {
        if (!data || !Array.isArray(data)) return 0;

        const keyMap = {
            'Bal Mandal': ['balMandal', 'bal_mandal', 'balMandalClass', 'bal_mandal_class'],
            'Satsang':    ['satsang', 'satsang_class', 'satsangClass'],
            'Kirtan':     ['kirtan', 'kirtan_class', 'kirtanClass'],
            'Instrument': ['instrument', 'instrument_class', 'instrumentClass'],
            'Dance':      ['dance', 'dance_class', 'danceClass']
        };

        const targetKeys = keyMap[activityName] || [];

        return data.filter(row => {
            return targetKeys.some(key => {
                const val = row[key];
                if (val === true) return true;
                if (typeof val === 'number' && val > 0) return true;
                if (val === 'true') return true; 
                return false;
            });
        }).length;
    };

    if (!isAuthenticated) {
        return <h1>EXPIRED</h1>;
    }

    if (isLoading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    const classRows = [
        { name: 'Bal Mandal', count: getOccurrenceCount('Bal Mandal') },
        { name: 'Satsang', count: getOccurrenceCount('Satsang') },
        { name: 'Kirtan', count: getOccurrenceCount('Kirtan') },
        { name: 'Instrument', count: getOccurrenceCount('Instrument') },
        { name: 'Dance', count: getOccurrenceCount('Dance') }
    ].filter(row => row.count > 0);

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button onClick={() => router.push('/dashboard')} variant="outlined" color="primary">
                        Back to Dashboard
                    </Button>
                    <Button onClick={() => router.push('/submit-satsang')} variant="contained" color="secondary">
                        Submit Satsang Count
                    </Button>
                </Box>
                
                <br />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    {mandirName} Mandir
                </Typography>
                <br />

                <LeaderInfoCard
                    leaderInfo={leaderInfo}
                    isEditing={isEditing}
                    handleInputChange={handleInputChangeLeaderInfo}
                    handleSubmit={handleSubmitLeaderInfo}
                    setIsEditing={setIsEditing}
                />

                <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <Paper 
                            sx={{ 
                                p: 2, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%',
                                borderRadius: 2, 
                                boxShadow: 3 
                            }}
                        >
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Class Occurrences
                            </Typography>
                            <TableContainer sx={{ overflowX: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Activity</strong></TableCell>
                                            <TableCell align="right"><strong>Sessions</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {classRows.length > 0 ? (
                                            classRows.map((row) => (
                                                <TableRow key={row.name}>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell align="right">{row.count}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center" sx={{ fontStyle: 'italic', color: 'text.secondary', py: 2 }}>
                                                    No classes recorded yet
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper 
                            sx={{ 
                                p: 2, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%',
                                borderRadius: 2,
                                boxShadow: 3 
                            }}
                        >
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Q2 Goals
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Goal 1"
                                    name="goal1"
                                    value={goals?.goal1 || ''}
                                    onChange={handleInputChangeGoals}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    label="Goal 2"
                                    name="goal2"
                                    value={goals?.goal2 || ''}
                                    onChange={handleInputChangeGoals}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    label="Goal 3"
                                    name="goal3"
                                    value={goals?.goal3 || ''}
                                    onChange={handleInputChangeGoals}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <Box sx={{ mt: 'auto', pt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button 
                                    onClick={handleSubmitGoals}
                                    variant="contained" 
                                    color="primary" 
                                    size="small"
                                >
                                    Save Goals
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <StatsCards averageKids={averageKids} tier={tier} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <AgeDistributionChart data={ageDistributionData} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GenderDistributionChart data={genderDistributionData} />
                    </Grid>
                </Grid>

                <KidsOverTimeChart data={kidsOverTimeData} />

                <AttendanceCharts
                    data={data}
                    isLoading={isLoading}
                    error={error}
                    activities={activities}
                    kidsList={kidsList}
                    genderDistributionDataByAgeGroup={genderDistributionDataByAgeGroup}
                />
                
                <br />

                {/* SatsangForm was removed here */}

                <UpcomingEvents
                    upcomingEvents={upcomingEvents}
                    upcomingAllEvents={upcomingAllEvents}
                    handleInputChangeEvents={handleInputChangeEvents}
                    handleEventsDateBlur={handleEventsDateBlur}
                    handleSubmitEvents={handleSubmitEvents}
                    handleAnotherSubmitEvents={handleAnotherSubmitEvents}
                    handleRefreshPage={handleRefreshPage}
                    openEvents={openEvents}
                    eventsDateError={eventsDateError}
                />

                <KidsListTable kidsList={kidsList} />

                <Snackbar 
                    open={openGoalsSnackbar} 
                    autoHideDuration={4000} 
                    onClose={handleCloseGoalsSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseGoalsSnackbar} severity="success" sx={{ width: '100%' }}>
                        Goals updated successfully!
                    </Alert>
                </Snackbar>

            </Container>
        </Layout>
    );
}