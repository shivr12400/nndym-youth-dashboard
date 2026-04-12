import React from 'react';
import {
    Container, Typography, Button, CircularProgress,
    Box, Grid, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Snackbar, Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useKidsAttendance } from '../hooks/useKidsAttendance';
import LeaderContactSection from '../components/kids-attendance/LeaderContactSection';
import AgeDistributionChart from '../components/kids-attendance/AgeDistributionChart';
import AttendanceCharts from '../components/kids-attendance/AttendanceCharts';
import UpcomingEvents from '../components/kids-attendance/UpcomingEvents';
import KidsListTable from '../components/kids-attendance/KidsListTable';
import GenderDistributionChart from '../components/kids-attendance/GenderDistributionChart';
import KidsOverTimeChart from '../components/kids-attendance/KidsOverTimeChart';
import { activities } from '../utils/activities';
import SectionLabel from '../components/common/SectionLabel';

// ── Design tokens ────────────────────────────────────────────
const TIERS = [
    { label: 'Standard', min: 0,  color: '#78909C' },
    { label: 'Bronze',   min: 30, color: '#CD7F32' },
    { label: 'Silver',   min: 35, color: '#C0C0C0' },
];
const MAX_TRACK = 42;

const CARD = {
    p: 3,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'background.paper',
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

// ── Sub-components ───────────────────────────────────────────

function TierTrack({ averageKids }) {
    const pct = Math.min((averageKids / MAX_TRACK) * 100, 100);
    const currentIdx = TIERS.reduce((acc, t, i) => (averageKids >= t.min ? i : acc), 0);
    const next = TIERS[currentIdx + 1];
    const needed = next ? Math.max(0, next.min - averageKids) : 0;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Tier Progress
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {next
                        ? needed > 0 ? `${needed} more to reach ${next.label}` : `${next.label} reached!`
                        : 'Top tier achieved 🎉'}
                </Typography>
            </Box>

            {/* Track */}
            <Box sx={{ position: 'relative', height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.18)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.1, ease: 'easeOut', delay: 0.5 }}
                    style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 3, background: 'rgba(255,255,255,0.85)' }}
                />
                {TIERS.filter(t => t.min > 0).map(t => (
                    <Box key={t.label} sx={{
                        position: 'absolute',
                        left: `${(t.min / MAX_TRACK) * 100}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 10, height: 10,
                        borderRadius: '50%',
                        bgcolor: averageKids >= t.min ? 'white' : 'rgba(255,255,255,0.3)',
                        border: '2px solid rgba(255,255,255,0.5)',
                    }} />
                ))}
            </Box>

            {/* Labels */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                {TIERS.map((t, i) => (
                    <Typography key={t.label} sx={{
                        fontSize: '0.7rem',
                        color: currentIdx === i ? 'white' : 'rgba(255,255,255,0.45)',
                        fontWeight: currentIdx === i ? 700 : 400,
                    }}>
                        {t.label}{t.min > 0 && <span style={{ opacity: 0.55 }}> ({t.min}+)</span>}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
}

// ── Page ─────────────────────────────────────────────────────

export default function KidsAttendance({ isAuthenticated }) {
    const router = useRouter();
    const {
        mandirName, data, isLoading, error,
        averageKids, tier,
        leaderInfo, leaderInfoTwo, leaderInfoThree,
        upcomingEvents, kidsList, upcomingAllEvents,
        isEditing, isEditingTwo, isEditingThree,
        setIsEditing, setIsEditingTwo, setIsEditingThree,
        openGoalsSnackbar, handleCloseGoalsSnackbar,
        ageDistributionData, genderDistributionData,
        kidsOverTimeData, genderDistributionDataByAgeGroup,
        goals, handleInputChangeGoals, handleSubmitGoals,
        handleInputChangeLeaderInfo, handleSubmitLeaderInfo,
        handleInputChangeLeaderInfoTwo, handleSubmitLeaderInfoTwo,
        handleInputChangeLeaderInfoThree, handleSubmitLeaderInfoThree,
        handleInputChangeEvents, handleEventsDateBlur,
        handleAnotherSubmitEvents, handleSubmitEvents,
        handleDeleteEvent, handleRefreshPage,
        eventsDateError, eventForm, openEvents,
    } = useKidsAttendance(isAuthenticated);

    const getOccurrenceCount = (name) => {
        const src = Array.isArray(kidsOverTimeData) ? kidsOverTimeData : data;
        if (!Array.isArray(src)) return 0;
        const keys = {
            'Bal Mandal': ['balMandal', 'bal_mandal', 'balMandalClass', 'bal_mandal_class'],
            'Satsang':    ['satsang', 'satsang_class', 'satsangClass'],
            'Kirtan':     ['kirtan', 'kirtan_class', 'kirtanClass'],
            'Instrument': ['instrument', 'instrument_class', 'instrumentClass'],
            'Dance':      ['dance', 'dance_class', 'danceClass'],
        }[name] || [];
        return src.filter(row => keys.some(k => {
            const v = row[k];
            return v === true || v === 'true' || (typeof v === 'number' && v > 0);
        })).length;
    };

    if (!isAuthenticated) return <h1>EXPIRED</h1>;

    if (isLoading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    const classRows = ['Bal Mandal', 'Satsang', 'Kirtan', 'Instrument', 'Dance']
        .map(n => ({ name: n, count: getOccurrenceCount(n) }))
        .filter(r => r.count > 0);

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ pt: 4, pb: 10 }}>

                {/* ── Hero ── */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                    <Box sx={{
                        background: 'linear-gradient(145deg, #094D92 0%, #1565c0 65%, #1976d2 100%)',
                        borderRadius: 3,
                        p: { xs: 3, md: 5 },
                        mb: 6,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Decorative shapes */}
                        <Box sx={{ position: 'absolute', right: -80, top: -80, width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                        <Box sx={{ position: 'absolute', right: 50, bottom: -100, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

                        {/* Nav */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                            <Button
                                onClick={() => router.push('/')}
                                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                                sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                            >
                                Home
                            </Button>
                            <Button
                                onClick={() => router.push('/submit-satsang')}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.12)',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.22)', boxShadow: 'none' },
                                    boxShadow: 'none',
                                }}
                            >
                                Submit Satsang Count
                            </Button>
                        </Box>

                        {/* Title */}
                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 3, lineHeight: 1.2 }}>
                            {mandirName} Mandir
                        </Typography>

                        {/* Stat pills */}
                        <Box sx={{ display: 'flex', gap: { xs: 3, sm: 4 }, mb: 4, flexWrap: 'wrap' }}>
                            <Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>
                                    Avg Attendance
                                </Typography>
                                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '2rem', lineHeight: 1 }}>
                                    {averageKids}
                                </Typography>
                            </Box>
                            <Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.15)', display: { xs: 'none', sm: 'block' } }} />
                            <Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>
                                    Current Tier
                                </Typography>
                                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '2rem', lineHeight: 1 }}>
                                    {tier}
                                </Typography>
                            </Box>
                        </Box>

                        <TierTrack averageKids={averageKids} />
                    </Box>
                </motion.div>

                {/* ── Staggered sections ── */}
                <motion.div variants={stagger} initial="hidden" animate="show">

                    <motion.div variants={fadeUp}>
                        <SectionLabel>Leadership</SectionLabel>
                        <Box sx={{ mb: 5 }}>
                            <LeaderContactSection
                                leaders={[
                                    { leaderInfo,      isEditing,      handleInputChange: handleInputChangeLeaderInfo,      handleSubmit: handleSubmitLeaderInfo,      setIsEditing },
                                    { leaderInfo: leaderInfoTwo,   isEditing: isEditingTwo,   handleInputChange: handleInputChangeLeaderInfoTwo,   handleSubmit: handleSubmitLeaderInfoTwo,   setIsEditing: setIsEditingTwo },
                                    { leaderInfo: leaderInfoThree, isEditing: isEditingThree, handleInputChange: handleInputChangeLeaderInfoThree, handleSubmit: handleSubmitLeaderInfoThree, setIsEditing: setIsEditingThree },
                                ]}
                            />
                        </Box>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <SectionLabel>Activity & Goals</SectionLabel>
                        <Grid container spacing={3} sx={{ mb: 5 }}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={CARD}>
                                    <Typography variant="h5" color="primary" sx={{ mb: 2 }}>Class Occurrences</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600, borderBottom: '2px solid', borderColor: 'divider' }}>Activity</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600, borderBottom: '2px solid', borderColor: 'divider' }}>Sessions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {classRows.length > 0 ? classRows.map(row => (
                                                    <TableRow key={row.name} sx={{ '&:last-child td': { border: 0 } }}>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>{row.count}</TableCell>
                                                    </TableRow>
                                                )) : (
                                                    <TableRow>
                                                        <TableCell colSpan={2} align="center" sx={{ fontStyle: 'italic', color: 'text.disabled', py: 4, border: 0 }}>
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
                                <Paper sx={CARD}>
                                    <Typography variant="h5" color="primary" sx={{ mb: 2 }}>Q2 Goals</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1 }}>
                                        {['goal1', 'goal2', 'goal3'].map((name, i) => (
                                            <TextField
                                                key={name}
                                                fullWidth
                                                label={`Goal ${i + 1}`}
                                                name={name}
                                                value={goals?.[name] || ''}
                                                onChange={handleInputChangeGoals}
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ pt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button onClick={handleSubmitGoals} variant="contained" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
                                            Save Goals
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <SectionLabel>Attendance Overview</SectionLabel>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={6}><AgeDistributionChart data={ageDistributionData} /></Grid>
                            <Grid item xs={12} md={6}><GenderDistributionChart data={genderDistributionData} /></Grid>
                        </Grid>
                        <Box sx={{ mb: 4 }}><KidsOverTimeChart data={kidsOverTimeData} /></Box>
                        <Box sx={{ mb: 5 }}>
                            <AttendanceCharts
                                data={kidsOverTimeData}
                                isLoading={isLoading}
                                error={error}
                                activities={activities}
                                kidsList={kidsList}
                                genderDistributionDataByAgeGroup={genderDistributionDataByAgeGroup}
                            />
                        </Box>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <SectionLabel>Schedule</SectionLabel>
                        <Box sx={{ mb: 5 }}>
                            <UpcomingEvents
                                eventForm={eventForm}
                                upcomingEvents={upcomingEvents}
                                upcomingAllEvents={upcomingAllEvents}
                                handleInputChangeEvents={handleInputChangeEvents}
                                handleEventsDateBlur={handleEventsDateBlur}
                                handleSubmitEvents={handleSubmitEvents}
                                handleDeleteEvent={handleDeleteEvent}
                                handleAnotherSubmitEvents={handleAnotherSubmitEvents}
                                handleRefreshPage={handleRefreshPage}
                                openEvents={openEvents}
                                eventsDateError={eventsDateError}
                            />
                        </Box>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <SectionLabel>Roster</SectionLabel>
                        <KidsListTable kidsList={kidsList} />
                    </motion.div>

                </motion.div>

                <Snackbar open={openGoalsSnackbar} autoHideDuration={4000} onClose={handleCloseGoalsSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={handleCloseGoalsSnackbar} severity="success" sx={{ width: '100%' }}>
                        Goals updated successfully!
                    </Alert>
                </Snackbar>
            </Container>
        </Layout>
    );
}
