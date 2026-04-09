// components/kids-attendance/UpcomingEvents.js
import { Card, CardContent, Typography, Button, TextField, Box, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, Alert, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UpcomingEvents({
    upcomingEvents = [],
    upcomingAllEvents = [],
    eventForm = {},
    handleInputChangeEvents,
    handleEventsDateBlur,
    handleSubmitEvents,
    handleDeleteEvent,
    handleAnotherSubmitEvents,
    handleRefreshPage,
    openEvents,
    eventsDateError,
}) {
    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Upcoming Events
                </Typography>
                <br />
                {upcomingEvents.length === 0 ? (
                    <Typography>No Upcoming Events</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowX: 'auto' }}>
                        <Table stickyHeader aria-label="upcoming events table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Event</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {upcomingEvents.map((event, i) => (
                                    <TableRow key={event.id ?? i}>
                                        <TableCell>{event.date}</TableCell>
                                        <TableCell>{event.upcomingEvents}</TableCell>
                                        <TableCell align="right" sx={{ py: 0.5 }}>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteEvent(event)}
                                                aria-label="delete event"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <br />
                <Typography variant="h5" gutterBottom>
                    Submit Upcoming Events
                </Typography>
                <Box component="form" onSubmit={handleSubmitEvents} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Date (MM/DD/YYYY)"
                        name="date"
                        value={eventForm.date || ''}
                        onChange={handleInputChangeEvents}
                        onBlur={handleEventsDateBlur}
                        error={!!eventsDateError}
                        helperText={eventsDateError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Event"
                        name="upcomingEvents"
                        value={eventForm.upcomingEvents || ''}
                        onChange={handleInputChangeEvents}
                    />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                        {openEvents && (
                            <>
                                <Button onClick={handleAnotherSubmitEvents} variant="contained" color="primary">
                                    Submit Another
                                </Button>
                                <Button onClick={handleRefreshPage} variant="outlined" startIcon={<RefreshIcon />}>
                                    Refresh Charts
                                </Button>
                            </>
                        )}
                    </Box>
                    {openEvents && (
                        <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                            Successfully submitted!
                        </Alert>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}