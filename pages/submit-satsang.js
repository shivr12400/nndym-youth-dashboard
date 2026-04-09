import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Container,
    Typography,
    Button,
    Box,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Alert,
    Slider,
    Grid,
} from '@mui/material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useKidsAttendance } from '../hooks/useKidsAttendance';
import { mandirs } from '../utils/mandirs';

const CARD = {
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
    borderRadius: 2,
    bgcolor: 'background.paper',
    p: 3,
};

function SectionLabel({ children }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, mt: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.4, color: 'text.disabled', whiteSpace: 'nowrap' }}>
                {children}
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        </Box>
    );
}

const groupFields = [
    { label: 'Yuvaks/Yuvatis 1–8', name: 'numberKidsFirstLevel' },
    { label: 'Yuvaks/Yuvatis 9–13', name: 'numberKidsSecondLevel' },
    { label: 'Yuvaks/Yuvatis 14–18', name: 'numberKidsThirdLevel' },
    { label: 'Yuvaks/Yuvatis 19–25', name: 'numberKidsFourthLevel' },
];

const classFields = [
    { name: 'balMandalClass', label: 'Bal Mandal' },
    { name: 'satsangClass', label: 'Satsang' },
    { name: 'kirtanClass', label: 'Kirtan' },
    { name: 'instrumentClass', label: 'Instrument' },
    { name: 'danceClass', label: 'Dance' },
];

const classHandlers = ['handleChangeBMC', 'handleChangeSC', 'handleChangeKC', 'handleChangeIC', 'handleChangeDC'];
const classChecked = ['balMandalClass', 'satsangClass', 'kirtanClass', 'instrumentClass', 'danceClass'];

export default function SubmitSatsang() {
    const router = useRouter();

    const hook = useKidsAttendance(true);
    const {
        satsangCount,
        handleInputChangeSatsangCount,
        handleSubmitSatsangCount,
        handleAnotherSubmitSatsangCount,
        handleChangeBMC, handleChangeSC, handleChangeKC, handleChangeIC, handleChangeDC,
        balMandalClass, satsangClass, kirtanClass, instrumentClass, danceClass,
        error,
        open,
        dateError,
    } = hook;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLocalSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await handleSubmitSatsangCount(e);
        setIsSubmitting(false);
    };

    const totalCount = useMemo(() => {
        const sc = satsangCount || {};
        return (Number(sc.numberKidsFirstLevel) || 0)
            + (Number(sc.numberKidsSecondLevel) || 0)
            + (Number(sc.numberKidsThirdLevel) || 0)
            + (Number(sc.numberKidsFourthLevel) || 0);
    }, [satsangCount]);

    const handleSliderChange = (name) => (_, newValue) => {
        handleInputChangeSatsangCount({ target: { name, value: newValue } });
    };

    const checkedValues = [balMandalClass, satsangClass, kirtanClass, instrumentClass, danceClass];
    const handlers = [handleChangeBMC, handleChangeSC, handleChangeKC, handleChangeIC, handleChangeDC];

    return (
        <Layout>
            <Container maxWidth="sm" sx={{ pt: 5, pb: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h1" component="h1" color="primary" sx={{ mb: 0.5 }}>
                            Submit Satsang
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Record attendance and classes for your mandir session.
                        </Typography>
                    </Box>

                    {!open ? (
                        <Box sx={CARD}>
                            <Box component="form" onSubmit={handleLocalSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                                <SectionLabel>Session Details</SectionLabel>

                                <FormControl fullWidth required size="small">
                                    <InputLabel>Mandir Name</InputLabel>
                                    <Select
                                        name="mandirName"
                                        value={satsangCount.mandirName || ''}
                                        label="Mandir Name"
                                        onChange={handleInputChangeSatsangCount}
                                    >
                                        {mandirs.map((m, i) => (
                                            <MenuItem key={`${m.id}-${i}`} value={m.mandirName}>
                                                {m.mandirName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    required
                                    fullWidth
                                    label="Reporter Name"
                                    name="reporter"
                                    value={satsangCount.reporter}
                                    onChange={handleInputChangeSatsangCount}
                                    size="small"
                                />

                                <TextField
                                    required
                                    fullWidth
                                    label="Date (MM/DD/YYYY)"
                                    name="date"
                                    placeholder="MM/DD/YYYY"
                                    value={satsangCount.date}
                                    onChange={handleInputChangeSatsangCount}
                                    error={!!dateError}
                                    helperText={dateError}
                                    size="small"
                                />

                                <SectionLabel>Attendance by Age Group</SectionLabel>

                                {groupFields.map((field, index) => (
                                    <Box key={field.name}>
                                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
                                            {field.label}
                                        </Typography>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs>
                                                <Slider
                                                    value={Number(satsangCount[field.name]) || 0}
                                                    onChange={handleSliderChange(field.name)}
                                                    valueLabelDisplay="auto"
                                                    max={50}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    name={field.name}
                                                    value={satsangCount[field.name]}
                                                    size="small"
                                                    onChange={handleInputChangeSatsangCount}
                                                    inputProps={{ step: 1, min: 0, max: 100, type: 'number' }}
                                                    sx={{ width: 70 }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                                        Total: {totalCount}
                                    </Typography>
                                </Box>

                                <SectionLabel>Classes Held</SectionLabel>

                                <FormGroup row>
                                    {classFields.map(({ name, label }, i) => (
                                        <FormControlLabel
                                            key={name}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={checkedValues[i]}
                                                    onChange={handlers[i]}
                                                    name={name}
                                                />
                                            }
                                            label={<Typography variant="body2">{label}</Typography>}
                                            sx={{ width: '50%' }}
                                        />
                                    ))}
                                </FormGroup>

                                {error && <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{ textTransform: 'none', borderRadius: 1.5, fontWeight: 600, py: 1.1 }}
                                >
                                    {isSubmitting ? 'Submitting…' : 'Submit'}
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={CARD}>
                            <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5 }}>
                                Attendance submitted for <strong>{satsangCount.mandirName}</strong>!
                            </Alert>
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: 'none', borderRadius: 1.5, fontWeight: 600 }}
                                    onClick={() => router.push(`/kids-attendance?mandirName=${encodeURIComponent(satsangCount.mandirName)}`)}
                                >
                                    View Charts
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{ textTransform: 'none', borderRadius: 1.5 }}
                                    onClick={handleAnotherSubmitSatsangCount}
                                >
                                    Submit Another
                                </Button>
                            </Box>
                        </Box>
                    )}
                </motion.div>
            </Container>
        </Layout>
    );
}
