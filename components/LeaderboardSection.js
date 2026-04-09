import { Box, Card, CardContent, Typography, Grid, Skeleton } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { motion } from 'framer-motion';

const PODIUM = [
    { medal: '🥇', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: '2px solid #F59E0B', height: 210 },
    { medal: '🥈', color: '#6B7280', bg: 'rgba(107,114,128,0.08)', border: '2px solid #9CA3AF', height: 175 },
    { medal: '🥉', color: '#B45309', bg: 'rgba(180,83,9,0.08)',   border: '2px solid #D97706', height: 158 },
];

const AVG_COLORS  = ['#1565c0','#1976d2','#1e88e5','#2196f3','#42a5f5','#64b5f6','#90caf9','#bbdefb'];
const REG_COLORS  = ['#00695c','#00796b','#00897b','#009688','#26a69a','#4db6ac','#80cbc4','#b2dfdb'];

function PodiumCard({ entry, podiumIndex, animIndex }) {
    const s = PODIUM[podiumIndex];
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animIndex * 0.12, type: 'spring', stiffness: 180 }}
        >
            <Card sx={{
                border: s.border, background: s.bg, textAlign: 'center',
                height: s.height, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', borderRadius: 3, boxShadow: 3,
            }}>
                <CardContent>
                    <Typography sx={{ fontSize: podiumIndex === 0 ? 46 : 36, lineHeight: 1.2 }}>
                        {s.medal}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" noWrap sx={{ mt: 0.5 }}>
                        {entry.name}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: s.color, mt: 0.5 }}>
                        {entry.avgKids}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                        avg kids / session
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        {entry.sessions} sessions · {entry.registeredKids} registered
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function HBarChart({ data, dataKey, colors, height }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={108} tick={{ fontSize: 13 }} />
                <Tooltip contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey={dataKey} radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                    <LabelList dataKey={dataKey} position="right" style={{ fontSize: 12, fontWeight: 600 }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

function LoadingSkeleton() {
    return (
        <Box sx={{ mt: 6, mb: 4 }}>
            <Skeleton variant="rectangular" height={48} sx={{ mb: 3, borderRadius: 2, width: '35%' }} />
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {[175, 210, 158].map((h, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Skeleton variant="rectangular" height={h} sx={{ borderRadius: 3 }} />
                    </Grid>
                ))}
            </Grid>
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3, mb: 3 }} />
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
        </Box>
    );
}

export default function LeaderboardSection({ leaderboardData, isLoading }) {
    if (isLoading) return <LoadingSkeleton />;
    if (!leaderboardData.length) return null;

    const top3 = leaderboardData.slice(0, 3);
    // Classic podium: 2nd | 1st | 3rd
    const podiumOrder = top3.length >= 3
        ? [{ entry: top3[1], podiumIndex: 1 }, { entry: top3[0], podiumIndex: 0 }, { entry: top3[2], podiumIndex: 2 }]
        : top3.map((entry, i) => ({ entry, podiumIndex: i }));

    const avgData = leaderboardData.map(d => ({ name: d.name, 'Avg Kids': d.avgKids }));
    const regData = [...leaderboardData]
        .sort((a, b) => b.registeredKids - a.registeredKids)
        .map(d => ({ name: d.name, 'Registered': d.registeredKids }));

    const barH = leaderboardData.length * 52 + 16;

    return (
        <Box sx={{ mt: 6, mb: 6 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <EmojiEventsIcon sx={{ color: '#F59E0B', fontSize: 42 }} />
                <Box>
                    <Typography variant="h4" fontWeight="bold">Mandir Leaderboard</Typography>
                    <Typography variant="body2" color="text.secondary">
                        How does your mandir rank?
                    </Typography>
                </Box>
            </Box>

            {/* Podium — 2nd | 1st | 3rd */}
            {top3.length >= 2 && (
                <Grid container spacing={2} sx={{ mb: 4 }} alignItems="flex-end">
                    {podiumOrder.map(({ entry, podiumIndex }, i) => (
                        <Grid item xs={12} sm={4} key={entry.name}>
                            <PodiumCard entry={entry} podiumIndex={podiumIndex} animIndex={i} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Avg Kids Chart */}
            <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmojiEventsIcon sx={{ color: '#1976d2', fontSize: 22 }} />
                        <Typography variant="h6" fontWeight="bold">Average Kids Per Session</Typography>
                    </Box>
                    <HBarChart data={avgData} dataKey="Avg Kids" colors={AVG_COLORS} height={barH} />
                </CardContent>
            </Card>

            {/* Registered Kids Chart */}
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PeopleIcon sx={{ color: '#009688', fontSize: 22 }} />
                        <Typography variant="h6" fontWeight="bold">Total Registered Kids</Typography>
                    </Box>
                    <HBarChart data={regData} dataKey="Registered" colors={REG_COLORS} height={barH} />
                </CardContent>
            </Card>
        </Box>
    );
}
