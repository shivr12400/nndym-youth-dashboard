import { Grid, Card, CardContent, Typography } from '@mui/material';

const TIER_COLOR = { Silver: '#9E9E9E', Bronze: '#CD7F32', Standard: '#78909C' };

export default function StatsCards({ averageKids, tier }) {
    const tierColor = TIER_COLOR[tier] || TIER_COLOR.Standard;

    return (
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
                <Card sx={{
                    borderRadius: 2,
                    boxShadow: 1,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                }}>
                    <CardContent sx={{ py: 2.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                            Avg Yuvaks / Yuvatis
                        </Typography>
                        <Typography variant="h2" sx={{ mt: 0.5, color: 'primary.main', fontWeight: 700 }}>
                            {averageKids}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card sx={{
                    borderRadius: 2,
                    boxShadow: 1,
                    borderLeft: '4px solid',
                    borderColor: tierColor,
                }}>
                    <CardContent sx={{ py: 2.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                            Tier
                        </Typography>
                        <Typography variant="h2" sx={{ mt: 0.5, color: tierColor, fontWeight: 700 }}>
                            {tier}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
