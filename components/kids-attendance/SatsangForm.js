import { Card, CardContent, Typography, Button, TextField, Box, Slider, Checkbox, FormControlLabel, FormGroup, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function SatsangForm({
    satsangCount,
    handleInputChangeSatsangCount,
    handleDateBlur,
    handleSubmitSatsangCount,
    handleAnotherSubmitSatsangCount,
    handleRefreshPage,
    balMandalClass,
    satsangClass,
    kirtanClass,
    instrumentClass,
    danceClass,
    handleChangeBMC,
    handleChangeSC,
    handleChangeKC,
    handleChangeIC,
    handleChangeDC,
    open,
    formattedToday,
    lastDate,
    compareDates,
    marks,
    dateError
}) {
    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Submit Weekly Satsang Count
                </Typography>
                {compareDates(formattedToday, lastDate) ? (
                    <Alert severity="error">Your satsang count is behind schedule. Last submission was {lastDate} please submit</Alert>
                ) : (
                    <Alert severity="info">Your next count is due by this Sunday</Alert>
                )}
                <Box component="form" onSubmit={handleSubmitSatsangCount} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="date"
                        label="Date (MM/DD/YYYY)"
                        name="date"
                        value={satsangCount.date}
                        onChange={handleInputChangeSatsangCount}
                        onBlur={handleDateBlur}
                        error={!!dateError}
                        helperText={dateError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Reporter"
                        name="reporter"
                        value={satsangCount.reporter}
                        onChange={handleInputChangeSatsangCount}
                    />
                    <br></br>
                    <br></br>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox name="balMandalClass" checked={balMandalClass} onChange={handleChangeBMC} />} label="Bal Mandal Class" />
                        <FormControlLabel control={<Checkbox name="satsangClass" checked={satsangClass} onChange={handleChangeSC} />} label="Satsang Class" />
                        <FormControlLabel control={<Checkbox name="kirtanClass" checked={kirtanClass} onChange={handleChangeKC} />} label="Kirtan Class" />
                        <FormControlLabel control={<Checkbox name="instrumentClass" checked={instrumentClass} onChange={handleChangeIC} />} label="Instrument Class" />
                        <FormControlLabel control={<Checkbox name="danceClass" checked={danceClass} onChange={handleChangeDC} />} label="Dance Class" />
                    </FormGroup>
                    <br></br>
                    <Typography variant="h6" gutterBottom>
                        Kids 1 - 8 years old
                    </Typography>
                    <Slider
                        defaultValue={10}
                        shiftStep={10}
                        step={1}
                        marks={marks}
                        min={0}
                        max={40}
                        valueLabelDisplay="auto"
                        name="numberKidsFirstLevel"
                        value={satsangCount.numberKidsFirstLevel}
                        onChange={handleInputChangeSatsangCount}
                    />
                    <Typography variant="h6" gutterBottom>
                        Kids 9 - 13 years old
                    </Typography>
                    <Slider
                        defaultValue={10}
                        shiftStep={10}
                        step={1}
                        marks={marks}
                        min={0}
                        max={40}
                        valueLabelDisplay="auto"
                        name="numberKidsSecondLevel"
                        value={satsangCount.numberKidsSecondLevel}
                        onChange={handleInputChangeSatsangCount}
                    />
                    <Typography variant="h6" gutterBottom>
                        Kids 14 - 18 years old
                    </Typography>
                    <Slider
                        defaultValue={10}
                        shiftStep={10}
                        step={1}
                        marks={marks}
                        min={0}
                        max={40}
                        valueLabelDisplay="auto"
                        name="numberKidsThirdLevel"
                        value={satsangCount.numberKidsThirdLevel}
                        onChange={handleInputChangeSatsangCount}
                    />
                    <Typography variant="h6" gutterBottom>
                        Kids 19 - 25 years old
                    </Typography>
                    <Slider
                        defaultValue={10}
                        shiftStep={10}
                        step={1}
                        marks={marks}
                        min={0}
                        max={40}
                        valueLabelDisplay="auto"
                        name="numberKidsFourthLevel"
                        value={satsangCount.numberKidsFourthLevel}
                        onChange={handleInputChangeSatsangCount}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                        Submit
                    </Button>
                    <br></br>
                    {open ?
                        <>
                            <Button onClick={handleAnotherSubmitSatsangCount} variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                                Submit Another
                            </Button>
                            <Button onClick={handleRefreshPage} variant="outlined" startIcon={<RefreshIcon />} sx={{ mt: 2, mr: 1 }}>
                                Refresh Charts
                            </Button>
                        </> : <></>}
                    <br></br>
                    <br></br>
                    {open ?
                        <Alert severity="success" sx={{ width: '100%' }}>
                            Successfully submitted!
                        </Alert> : <></>}

                </Box>
            </CardContent>
        </Card>
    );
}
