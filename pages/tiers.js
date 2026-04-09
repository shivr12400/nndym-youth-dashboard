import React from 'react';
import {
    Box, Container, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    useTheme, useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const columns = [
    { id: 'category', label: 'Requirement', minWidth: 200, align: 'left', bgColor: '#f4f6f8', color: '#333' },
    { id: 'platinum', label: 'Platinum', minWidth: 120, align: 'center', bgColor: '#E5E4E2', color: '#000' },
    { id: 'gold', label: 'Gold', minWidth: 120, align: 'center', bgColor: '#FFD700', color: '#000' },
    { id: 'silver', label: 'Silver', minWidth: 120, align: 'center', bgColor: '#C0C0C0', color: '#000' },
    { id: 'bronze', label: 'Bronze', minWidth: 120, align: 'center', bgColor: '#CD7F32', color: '#fff' },
    { id: 'standard', label: 'Standard', minWidth: 120, align: 'center', bgColor: '#094D92', color: '#fff' },
];

const rows = [
    { category: 'ACTIVE Mandir Leaders', platinum: '3', gold: '3', silver: '2', bronze: '1', standard: '1' },
    { category: 'Average Kids', platinum: '75', gold: '50', silver: '45', bronze: '35', standard: '30' },
    { category: 'Classes each week', platinum: '5', gold: '4', silver: '3', bronze: '2', standard: '1' },
    { category: 'Monthly Events', platinum: '2 Every Month', gold: '2 Every Month', silver: '1 Every Month', bronze: '1 Every Other Month', standard: '1 Every Two Months' },
    { category: 'Regional/National Event Signups', platinum: '50', gold: '45', silver: '35', bronze: '30', standard: '25 or less' },
];

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.32 } },
};

export default function MandirTiers() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ pt: 5, pb: 8 }}>
                <motion.div variants={stagger} initial="initial" animate="animate">

                    <motion.div variants={fadeUp}>
                        <Box sx={{ mb: 5 }}>
                            <Typography variant="h1" color="primary" sx={{ mb: 0.5 }}>
                                Mandir Tiers
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Compare goals and requirements across all levels.
                            </Typography>
                        </Box>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <Box sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}>
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader aria-label="tiers table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((col) => (
                                                <TableCell
                                                    key={col.id}
                                                    align={col.align}
                                                    style={{ minWidth: col.minWidth }}
                                                    sx={{
                                                        backgroundColor: col.bgColor,
                                                        color: col.color,
                                                        fontWeight: 700,
                                                        fontSize: '0.75rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.8,
                                                        borderBottom: '1px solid',
                                                        borderColor: 'divider',
                                                    }}
                                                >
                                                    {col.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow
                                                hover
                                                key={index}
                                                sx={{
                                                    '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                                                    '&:last-child td': { border: 0 },
                                                }}
                                            >
                                                {columns.map((col) => (
                                                    <TableCell
                                                        key={col.id}
                                                        align={col.align}
                                                        sx={{
                                                            color: 'text.primary',
                                                            py: 2,
                                                            ...(col.id === 'category' && {
                                                                fontWeight: 600,
                                                                color: 'primary.main',
                                                                borderRight: '1px solid',
                                                                borderColor: 'divider',
                                                            }),
                                                        }}
                                                    >
                                                        {row[col.id]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {isMobile && (
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: 'text.disabled', fontStyle: 'italic' }}>
                                Scroll right to view all tiers →
                            </Typography>
                        )}
                    </motion.div>

                </motion.div>
            </Container>
        </Layout>
    );
}
