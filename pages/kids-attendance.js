// pages/kids-attendance.js
import React from 'react';
import { Container, Typography, Button, CircularProgress, Box, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useKidsAttendance } from '../hooks/useKidsAttendance';
import LeaderInfoCard from '../components/kids-attendance/LeaderInfoCard';
import StatsCards from '../components/kids-attendance/StatsCards';
import AgeDistributionChart from '../components/kids-attendance/AgeDistributionChart';
import AttendanceCharts from '../components/kids-attendance/AttendanceCharts';
import SatsangForm from '../components/kids-attendance/SatsangForm';
import UpcomingEvents from '../components/kids-attendance/UpcomingEvents';
import KidsListTable from '../components/kids-attendance/KidsListTable';
import GenderDistributionChart from '../components/kids-attendance/GenderDistributionChart'; // New import
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
        balMandalClass,
        satsangClass,
        kirtanClass,
        instrumentClass,
        danceClass,
        satsangCount,
        kidsList,
        upcomingAllEvents,
        isEditing,
        open,
        openEvents,
        ageDistributionData,
        genderDistributionData, // New data prop
        marks,
        formattedToday,
        lastDate,
        setIsEditing,
        handleChangeBMC,
        handleChangeSC,
        handleChangeKC,
        handleChangeIC,
        handleChangeDC,
        handleInputChangeLeaderInfo,
        handleInputChangeEvents,
        handleEventsDateBlur,
        handleInputChangeSatsangCount,
        handleDateBlur,
        handleSubmitLeaderInfo,
        handleSubmitSatsangCount,
        handleAnotherSubmitSatsangCount,
        handleAnotherSubmitEvents,
        handleSubmitEvents,
        compareDates,
        handleRefreshPage,
        dateError,
        eventsDateError,
    } = useKidsAttendance(isAuthenticated);

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

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Button onClick={() => router.push('/dashboard')} variant="contained" color="primary" sx={{ mb: 2 }}>
                    Back to Dashboard
                </Button>
                <br />
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

                <StatsCards averageKids={averageKids} tier={tier} />

                <Grid container spacing={4}> {/* Add spacing between charts */}
                    <Grid item xs={12} md={6}>
                        <AgeDistributionChart data={ageDistributionData} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GenderDistributionChart data={genderDistributionData} />
                    </Grid>
                </Grid>

                <AttendanceCharts
                    data={data}
                    isLoading={isLoading}
                    error={error}
                    activities={activities}
                    kidsList={kidsList}
                />
                
                <br />

                <SatsangForm
                    satsangCount={satsangCount}
                    handleInputChangeSatsangCount={handleInputChangeSatsangCount}
                    handleDateBlur={handleDateBlur}
                    handleSubmitSatsangCount={handleSubmitSatsangCount}
                    handleAnotherSubmitSatsangCount={handleAnotherSubmitSatsangCount}
                    handleRefreshPage={handleRefreshPage}
                    balMandalClass={balMandalClass}
                    satsangClass={satsangClass}
                    kirtanClass={kirtanClass}
                    instrumentClass={instrumentClass}
                    danceClass={danceClass}
                    handleChangeBMC={handleChangeBMC}
                    handleChangeSC={handleChangeSC}
                    handleChangeKC={handleChangeKC}
                    handleChangeIC={handleChangeIC}
                    handleChangeDC={handleChangeDC}
                    open={open}
                    formattedToday={formattedToday}
                    lastDate={lastDate}
                    compareDates={compareDates}
                    marks={marks}
                    dateError={dateError}
                />

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
            </Container>
        </Layout>
    );
}
