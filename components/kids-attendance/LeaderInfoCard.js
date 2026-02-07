// components/kids-attendance/LeaderInfoCard.js
import { Card, CardContent, Typography, Button, TextField, Box } from '@mui/material';

export default function LeaderInfoCard({ leaderInfo, isEditing, handleInputChange, handleSubmit, setIsEditing }) {
    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Leader Contact Information
                </Typography>
                {isEditing ? (
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="leaderName"
                            label="Name"
                            name="leaderName"
                            value={leaderInfo.leaderName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="leaderEmail"
                            label="Email"
                            name="leaderEmail"
                            value={leaderInfo.leaderEmail}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="leaderPhone"
                            label="Phone"
                            name="leaderPhone"
                            value={leaderInfo.leaderPhone}
                            onChange={handleInputChange}
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
    );
}
