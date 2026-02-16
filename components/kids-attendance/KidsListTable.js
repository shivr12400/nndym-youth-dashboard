// components/kids-attendance/KidsListTable.js
import { Card, CardContent, Typography, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material';

export default function KidsListTable({ kidsList }) {
    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Yuvaks/Yuvatis
                </Typography>
                <br></br>
                {kidsList.length === 0 ? (
                    <Typography>No Kids</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowX: 'auto' }}>
                        <Table stickyHeader aria-label="kids information table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {kidsList.map((kid) => (
                                    <TableRow key={kid.id}>
                                        <TableCell>{kid.name}</TableCell>
                                        <TableCell>{kid.phone}</TableCell>
                                        <TableCell>{kid.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );
}
