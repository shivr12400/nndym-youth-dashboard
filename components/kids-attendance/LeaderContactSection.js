import { Card, CardContent, Typography, Grid, IconButton, TextField, Box, Stack, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

function LeaderColumn({ leaderInfo, isEditing, handleInputChange, handleSubmit, setIsEditing }) {
    return (
        <Box>
            {isEditing ? (
                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
                    <TextField
                        size="small" fullWidth label="Name"
                        name="leaderName" value={leaderInfo.leaderName}
                        onChange={handleInputChange} sx={{ mb: 1 }}
                    />
                    <TextField
                        size="small" fullWidth label="Email"
                        name="leaderEmail" value={leaderInfo.leaderEmail}
                        onChange={handleInputChange} sx={{ mb: 1 }}
                    />
                    <TextField
                        size="small" fullWidth label="Phone"
                        name="leaderPhone" value={leaderInfo.leaderPhone}
                        onChange={handleInputChange} sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" color="primary" type="submit">
                            <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => setIsEditing(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            ) : (
                <Stack spacing={0.5} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" fontWeight={500}>
                            {leaderInfo.leaderName || '—'}
                        </Typography>
                        <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ p: 0.5 }}>
                            <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>
                    <Typography variant="body2" component="a" href={`mailto:${leaderInfo.leaderEmail}`} color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {leaderInfo.leaderEmail || '—'}
                    </Typography>
                    <Typography variant="body2" component="a" href={`tel:${leaderInfo.leaderPhone}`} color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {leaderInfo.leaderPhone || '—'}
                    </Typography>
                </Stack>
            )}
        </Box>
    );
}

export default function LeaderContactSection({ leaders }) {
    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    Leader Contact Information
                </Typography>
                <Grid container justifyContent="center">
                    {leaders.map((leader, i) => (
                        <Grid item xs={12} sm={4} key={i} sx={{
                            px: 2,
                            borderRight: i < leaders.length - 1 ? { sm: '1px solid', xs: 'none' } : 'none',
                            borderColor: 'divider',
                            pb: { xs: 2, sm: 0 },
                            ...(i > 0 && { borderTop: { xs: '1px solid', sm: 'none' }, borderTopColor: 'divider', pt: { xs: 2, sm: 0 } }),
                        }}>
                            <LeaderColumn {...leader} />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}
