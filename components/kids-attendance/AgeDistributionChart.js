import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useTheme } from '@mui/material/styles';

export default function AgeDistributionChart({ data }) {
    const theme = useTheme();

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    Age distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={theme.palette.primary.main} name="Kids" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
