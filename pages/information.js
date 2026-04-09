import React from 'react';
import {
    Grid, Container, Box, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    useTheme, useMediaQuery,
} from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from 'next/link';

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
    { category: 'Monthly Events', platinum: '2 / Month', gold: '2 / Month', silver: '1 / Month', bronze: '1 / 2 Months', standard: '1 / 2 Months' },
    { category: 'Regional/National Event Signups', platinum: '50', gold: '45', silver: '35', bronze: '30', standard: '≤ 25' },
];

const buttons = [
    { text: 'Lesson Plans', url: 'https://drive.google.com/drive/folders/1kwKNiD0sbrnNf_qE8_ZHCVpq2dpUX6Sl?usp=sharing' },
    { text: 'NNDYM Website', url: 'https://nndym.org' },
    { text: 'Kalupur Website', url: 'https://www.swaminarayan.info/' },
    { text: 'Logos', url: 'https://drive.google.com/drive/folders/10kBv8GkBXxqWRR-B3cWvFh2of8PO8r8m?usp=sharing' },
];

function SectionLabel({ children }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.4, color: 'text.disabled', whiteSpace: 'nowrap' }}>
                {children}
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        </Box>
    );
}

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.32 } },
};

export default function InformationPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ pt: 5, pb: 8 }}>
                <motion.div variants={stagger} initial="initial" animate="animate">

                    {/* Page header */}
                    <motion.div variants={fadeUp}>
                        <Box sx={{ mb: 5 }}>
                            <Typography variant="h1" color="primary" sx={{ mb: 0.5 }}>
                                Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Resources, links, and tier requirements for your mandir.
                            </Typography>
                        </Box>
                    </motion.div>

                    {/* Resources */}
                    <motion.div variants={fadeUp}>
                        <SectionLabel>Resources</SectionLabel>
                        <Grid container spacing={2} sx={{ mb: 6 }}>
                            {buttons.map((btn) => (
                                <Grid item xs={12} sm={6} md={3} key={btn.text}>
                                    <Box
                                        component={Link}
                                        href={btn.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            px: 2,
                                            py: 1.75,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            bgcolor: 'background.paper',
                                            textDecoration: 'none',
                                            color: 'text.primary',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            transition: 'border-color 0.18s, color 0.18s',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                color: 'primary.main',
                                            },
                                        }}
                                    >
                                        {btn.text}
                                        <OpenInNewIcon sx={{ fontSize: 14, ml: 1, opacity: 0.5 }} />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>

                    {/* Tiers table */}
                    <motion.div variants={fadeUp}>
                        <SectionLabel>Mandir Progress Tiers</SectionLabel>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                            Benchmarks for mandir classification and growth.
                        </Typography>

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
