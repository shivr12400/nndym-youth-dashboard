import { Card, CardContent, Typography, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material';

export default function KidsListTable({ kidsList }) {
    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Yuvaks/Yuvatis
                </Typography>
                {kidsList.length === 0 ? (
                    <Typography>No Kids</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowX: 'auto' }}>
                        <Table stickyHeader aria-label="kids information table" sx={{ minWidth: 480 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {kidsList.map((kid) => (
                                    <TableRow key={kid.id}>
                                        <TableCell>{kid.name}</TableCell>
                                        <TableCell>
                                            <a href={`tel:${kid.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {kid.phone}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <a href={`mailto:${kid.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {kid.email}
                                            </a>
                                        </TableCell>
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
