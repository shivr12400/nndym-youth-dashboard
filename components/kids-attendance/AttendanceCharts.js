// components/kids-attendance/AttendanceCharts.js
import { Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardContent, CircularProgress, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import GenderDistributionChart from './GenderDistributionChart';

import { useTheme } from '@mui/material/styles';

export default function AttendanceCharts({ data, isLoading, error, activities, kidsList, genderDistributionDataByAgeGroup }) {
    const theme = useTheme();
    const ageGroups = [
        { title: 'Yuvaks/Yuvatis 1 - 8', dataKey: 'numberKidsFirstLevel', activityKey: '1-8' },
        { title: 'Yuvaks/Yuvatis 9 - 13', dataKey: 'numberKidsSecondLevel', activityKey: '9-13' },
        { title: 'Yuvaks/Yuvatis 14 - 18', dataKey: 'numberKidsThirdLevel', activityKey: '14-18' },
        { title: 'Yuvaks/Yuvatis 19 - 25', dataKey: 'numberKidsFourthLevel', activityKey: '19-25' },
    ];

    return (
        <>
            {ageGroups.map((group, index) => (
                <Accordion key={index}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index + 1}-content`}
                        id={`panel${index + 1}-header`}
                    >
                        <Typography variant="h6" gutterBottom>
                            {group.title}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Card sx={{ mb: 4 }}>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    Kids x Time
                                </Typography>
                                {isLoading ? (
                                    <CircularProgress />
                                ) : error ? (
                                    <Typography color="error">{error}</Typography>
                                ) : (
                                    <div style={{ width: '100%', height: 400 }}>
                                        <ResponsiveContainer>
                                            <LineChart
                                                data={data}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey={group.dataKey} stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Top kids activities
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart
                                                data={activities(kidsList)[group.activityKey]}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="male" fill={theme.palette.primary.main} name="Male" />
                                                <Bar dataKey="female" fill={theme.palette.secondary.main} name="Female" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <GenderDistributionChart data={genderDistributionDataByAgeGroup[group.activityKey] || []} />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
}
