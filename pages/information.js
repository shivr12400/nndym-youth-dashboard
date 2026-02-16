// pages/information.js
import React from 'react';
import { 
  Grid, Container, Box, Typography, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Divider, useMediaQuery
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from '../components/Layout'; 
import { motion } from 'framer-motion';
import CustomButton from '../components/common/CustomButton';

// 1. LIGHT THEME CONFIGURATION
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#094D92' },
    secondary: { main: '#1C1018' },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: { 
      primary: '#333333',
      secondary: '#666666'
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
  },
});

// 2. TABLE DATA & CONFIGURATION
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

export default function InformationPage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const buttons = [
    { text: "Lesson Plans", url: "https://drive.google.com/drive/folders/1kwKNiD0sbrnNf_qE8_ZHCVpq2dpUX6Sl?usp=sharing" },
    { text: "NNDYM Website", url: "https://nndym.org" },
    { text: "Kalupur Website", url: "https://www.swaminarayan.info/" },
    { text: "Logos", url: "https://drive.google.com/drive/folders/10kBv8GkBXxqWRR-B3cWvFh2of8PO8r8m?usp=sharing" },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          
          {/* --- Buttons Section --- */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Box sx={{ flexGrow: 1, mb: 6 }}>
              <Grid container spacing={3} justifyContent="center">
                {buttons.map((button, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Box sx={{ width: '100%' }}>
                         {/* UPDATED: Added sx properties to center text */}
                         <CustomButton 
                            href={button.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            sx={{ 
                              width: '100%', 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              textAlign: 'center' 
                            }}
                         >
                            {button.text}
                         </CustomButton>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          <Divider sx={{ mb: 6 }} />

          {/* --- Tiers Section --- */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Box sx={{ mb: 4, textAlign: isMobile ? 'center' : 'left' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                Mandir Progress Tiers
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Benchmarks for mandir classification and growth.
              </Typography>
            </Box>

            <Paper 
              elevation={2} 
              sx={{ 
                width: '100%', 
                overflow: 'hidden', 
                borderRadius: 2,
                backgroundColor: 'background.paper',
              }}
            >
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="tiers table">
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
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            borderBottom: '1px solid #ddd'
                          }}
                        >
                          {column.label}
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
                          '&:nth-of-type(odd)': { backgroundColor: '#fafafa' }, 
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        {columns.map((column) => (
                          <TableCell 
                            key={column.id} 
                            align={column.align}
                            sx={{ 
                              color: 'text.primary',
                              fontSize: '0.95rem',
                              ...(column.id === 'category' && {
                                fontWeight: 600,
                                color: theme.palette.primary.main,
                                borderRight: '1px solid #f0f0f0' 
                              })
                            }}
                          >
                            {row[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            
            <Typography 
              variant="caption" 
              sx={{ 
                display: { xs: 'block', md: 'none' }, 
                textAlign: 'center', 
                mt: 2, 
                color: 'text.secondary',
                fontStyle: 'italic'
              }}
            >
              Scroll right to view all tiers →
            </Typography>
          </motion.div>
        </Container>
      </ThemeProvider>
    </Layout>
  );
}