// components/kids-attendance/StatsCards.js
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function StatsCards({ averageKids, tier }) {
    const theme = useTheme();

    return (
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
                <Card sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Average # Yuvaks/Yuvatis
                        </Typography>
                        <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                            {averageKids}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Tier
                        </Typography>
                        <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                            {tier}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
