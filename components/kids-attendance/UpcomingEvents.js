// components/kids-attendance/UpcomingEvents.js
import { Card, CardContent, Typography, Button, TextField, Box, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function UpcomingEvents({
    upcomingEvents,
    upcomingAllEvents,
    handleInputChangeEvents,
    handleSubmitEvents,
    handleAnotherSubmitEvents,
    handleRefreshPage,
    openEvents
}) {
    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Upcoming events
                </Typography>
                <br></br>
                {upcomingEvents.length === 0 ? (
                    <Typography>No Upcoming Events</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowX: 'auto' }}>
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
                        label="Date (MM/DD/YYYY)"
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
                        <>
                            <Button onClick={handleAnotherSubmitEvents} variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                                Submit Another
                            </Button>
                            <Button onClick={handleRefreshPage} variant="outlined" startIcon={<RefreshIcon />} sx={{ mt: 2, mr: 1 }}>
                                Refresh Charts
                            </Button>
                        </> : <></>}
                    <br></br>
                    <br></br>
                    {openEvents ?
                        <Alert severity="success" sx={{ width: '100%' }}>
                            Successfully submitted!
                        </Alert> : <></>}
                </Box>
            </CardContent>
        </Card>
    );
}
