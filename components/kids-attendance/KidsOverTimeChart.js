import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useTheme } from '@mui/material/styles';

export default function KidsOverTimeChart({ data }) {
    const theme = useTheme();

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    Kids Over Time (All Age Groups)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="totalKids" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
