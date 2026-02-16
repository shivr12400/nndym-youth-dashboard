import React from 'react';
import { 
  Box, Typography, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

// Columns remain the same...
const columns = [
  { id: 'category', label: 'Requirement', minWidth: 200, align: 'left', bgColor: '#f4f6f8', color: '#333' },
  { id: 'platinum', label: 'Platinum', minWidth: 120, align: 'center', bgColor: '#E5E4E2', color: '#333' },
  { id: 'gold', label: 'Gold', minWidth: 120, align: 'center', bgColor: '#FFD700', color: '#333' },
  { id: 'silver', label: 'Silver', minWidth: 120, align: 'center', bgColor: '#C0C0C0', color: '#333' },
  { id: 'bronze', label: 'Bronze', minWidth: 120, align: 'center', bgColor: '#CD7F32', color: '#fff' },
  { id: 'standard', label: 'Standard', minWidth: 120, align: 'center', bgColor: '#1976d2', color: '#fff' },
];

const rows = [
  { category: 'ACTIVE Mandir Leaders', platinum: '3', gold: '3', silver: '2', bronze: '1', standard: '1' },
  { category: 'Average Kids', platinum: '75', gold: '50', silver: '45', bronze: '35', standard: '30' },
  { category: 'Classes each week', platinum: '5', gold: '4', silver: '3', bronze: '2', standard: '1' },
  { category: 'Monthly Events', platinum: '2 Every Month', gold: '2 Every Month', silver: '1 Every Month', bronze: '1 Every Other Month', standard: '1 Every Two Months' },
  { category: 'Regional/National Event Signups', platinum: '50', gold: '45', silver: '35', bronze: '30', standard: '25 or less' },
];

export default function MandirTiers() {
  return (
    <Layout>
      <Box sx={{ py: 4, px: 2 }}> {/* Reduced padding for mobile */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* Responsive Font Size */}
            <Typography component="h1" variant="h3" color="text.primary" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              Mandir Progress Tiers
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
              Compare goals and requirements across all levels.
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {/* UPDATED: Added overflowX: 'auto' to ensure scrolling on mobile */}
          <Paper elevation={4} sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
            <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        sx={{
                          backgroundColor: column.bgColor,
                          color: column.color,
                          fontWeight: 'bold',
                          fontSize: '1.05rem',
                          borderBottom: '2px solid rgba(224, 224, 224, 1)'
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => {
                    return (
                      <TableRow 
                        hover 
                        role="checkbox" 
                        tabIndex={-1} 
                        key={index}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                          '&:hover': { backgroundColor: '#f0f7ff !important' },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell 
                              key={column.id} 
                              align={column.align}
                              sx={{ 
                                fontWeight: column.id === 'category' ? 'bold' : 'normal',
                                color: column.id === 'category' ? '#444' : 'text.primary',
                                py: 2.5 
                              }}
                            >
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {/* Hint for mobile users */}
          <Typography variant="caption" sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mt: 1, color: 'text.secondary' }}>
            Scroll right to view all tiers →
          </Typography>
        </motion.div>
      </Box>
    </Layout>
  );
}