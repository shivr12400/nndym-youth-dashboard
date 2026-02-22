import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { 
    Container, 
    Typography, 
    Button, 
    Box, 
    Paper, 
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
    Grid
} from '@mui/material';
import Layout from '../components/Layout';
import { useKidsAttendance } from '../hooks/useKidsAttendance';
import { mandirs } from '../utils/mandirs';

export default function SubmitSatsang() {
    const router = useRouter();

    const {
        satsangCount,
        handleInputChangeSatsangCount,
        handleSubmitSatsangCount,
        handleAnotherSubmitSatsangCount,
        handleChangeBMC,
        handleChangeSC,
        handleChangeKC,
        handleChangeIC,
        handleChangeDC,
        balMandalClass,
        satsangClass,
        kirtanClass,
        instrumentClass,
        danceClass,
        error,
        open,
        dateError
    } = useKidsAttendance(true);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLocalSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await handleSubmitSatsangCount(e);
        setIsSubmitting(false);
    };

    const totalCount = useMemo(() => {
        const sc = satsangCount || {};
        return (Number(sc.numberKidsFirstLevel) || 0) + 
               (Number(sc.numberKidsSecondLevel) || 0) + 
               (Number(sc.numberKidsThirdLevel) || 0) + 
               (Number(sc.numberKidsFourthLevel) || 0);
    }, [satsangCount]);

    const handleSliderChange = (name) => (event, newValue) => {
        const syntheticEvent = {
            target: {
                name: name,
                value: newValue
            }
        };
        handleInputChangeSatsangCount(syntheticEvent);
    };

    const groupFields = [
        { label: 'Yuvaks/Yuvatis 1-8', name: 'numberKidsFirstLevel' },
        { label: 'Yuvaks/Yuvatis 9-13', name: 'numberKidsSecondLevel' },
        { label: 'Yuvaks/Yuvatis 14-18', name: 'numberKidsThirdLevel' },
        { label: 'Yuvaks/Yuvatis 19-25', name: 'numberKidsFourthLevel' },
    ];

    return (
        <Layout>
            <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
                <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h1" component="h1" gutterBottom align="center" color="primary">
                        Submit Satsang Count
                    </Typography>
                    
                    {!open ? (
                        <Box component="form" onSubmit={handleLocalSubmit} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            
                            <FormControl fullWidth required>
                                <InputLabel id="mandir-select-label">Mandir Name</InputLabel>
                                <Select
                                    labelId="mandir-select-label"
                                    name="mandirName"
                                    value={satsangCount.mandirName || ''}
                                    label="Mandir Name"
                                    onChange={handleInputChangeSatsangCount}
                                >
                                    {mandirs.map((mandir, index) => (
                                        <MenuItem key={`${mandir.id}-${index}`} value={mandir.mandirName}>
                                            {mandir.mandirName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Reporter Name */}
                            <TextField
                                required
                                fullWidth
                                label="Reporter Name"
                                name="reporter"
                                value={satsangCount.reporter}
                                onChange={handleInputChangeSatsangCount}
                                variant="outlined"
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
                            />

                            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Attendance by Age Group:
                                </Typography>
                                
                                {groupFields.map((field, index) => (
                                    <Box key={field.name} sx={{ mb: 2 }}>
                                        <Typography id={`slider-label-${index}`} gutterBottom>
                                            {field.label}
                                        </Typography>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs>
                                                <Slider
                                                    value={Number(satsangCount[field.name]) || 0}
                                                    onChange={handleSliderChange(field.name)}
                                                    aria-labelledby={`slider-label-${index}`}
                                                    valueLabelDisplay="auto"
                                                    max={50}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    name={field.name}
                                                    value={satsangCount[field.name]}
                                                    size="small"
                                                    onChange={handleInputChangeSatsangCount}
                                                    inputProps={{
                                                        step: 1,
                                                        min: 0,
                                                        max: 100,
                                                        type: 'number',
                                                        'aria-labelledby': `slider-label-${index}`,
                                                    }}
                                                    sx={{ width: 70 }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                
                                <Typography variant="h6" align="right" color="primary" sx={{ mt: 1 }}>
                                    Total Count: {totalCount}
                                </Typography>
                            </Box>

                            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Classes Held:
                                </Typography>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={balMandalClass} onChange={handleChangeBMC} name="balMandalClass" />}
                                        label="Bal Mandal"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={satsangClass} onChange={handleChangeSC} name="satsangClass" />}
                                        label="Satsang"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={kirtanClass} onChange={handleChangeKC} name="kirtanClass" />}
                                        label="Kirtan"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={instrumentClass} onChange={handleChangeIC} name="instrumentClass" />}
                                        label="Instrument"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={danceClass} onChange={handleChangeDC} name="danceClass" />}
                                        label="Dance"
                                    />
                                </FormGroup>
                            </Box>

                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                size="large"
                                disabled={isSubmitting} 
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>

                            {error && <Alert severity="error">{error}</Alert>}
                        </Box>
                    ) : (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Attendance submitted successfully for {satsangCount.mandirName}!
                            </Alert>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="large" 
                                    onClick={() => router.push(`/kids-attendance?mandirName=${encodeURIComponent(satsangCount.mandirName)}`)}
                                >
                                    See updated charts
                                </Button>
                                
                                <Button 
                                    variant="outlined" 
                                    size="medium"
                                    onClick={handleAnotherSubmitSatsangCount}
                                >
                                    Submit Another Entry
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Layout>
    );
}