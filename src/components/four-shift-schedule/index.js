import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Grid, styled, Divider, ButtonGroup, CircularProgress } from '@mui/material';
import ScheduleGrid from '../schedule-grid';
import ColorKey from '../schedule-key';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StyledDiv = styled('div')({
  flexGrow: 1,
  margin: '16px',
});

const FourShiftScheduleWithGrid = () => {
  const [firstDayIn, setFirstDayIn] = useState(new Date());
  const [dayShifts, setDayShifts] = useState(2);
  const [nightShifts, setNightShifts] = useState(2);
  const [daysOff, setDaysOff] = useState(4);
  const [scheduleDetails, setScheduleDetails] = useState({});
  const pdfRef = React.createRef();
  const [loading, setLoading] = useState(false);

  //useEffect validation for firstDayIn, dayShifts, nightShifts, and daysOff
  useEffect(() => {
    if (dayShifts<0)
      setDayShifts(0);
    if (nightShifts<0)
      setNightShifts(0);
    if (daysOff<0)
      setDaysOff(0);

    if (firstDayIn) {
      const firstDayInDay = (new Date(firstDayIn)).getDate();
      if (firstDayInDay - 1 < 0 || firstDayInDay - 1 > 7) {
        setFirstDayIn(new Date(firstDayIn).getFullYear() + '-01-01');
      }
    }
  }, [dayShifts, nightShifts, daysOff, firstDayIn]);
    

  const handleGenerateSchedule = async () => {
    setLoading(true);

    // Check if firstDayIn, dayShifts, nightShifts, and daysOff are valid
    if (!firstDayIn || dayShifts < 0 || nightShifts < 0 || daysOff < 0) {
      alert('Please enter valid values');
      return;
    }
  
    const workPattern = [
      ...Array(dayShifts).fill('Day Shift'),
      ...Array(nightShifts).fill('Night Shift'),
      ...Array(daysOff).fill('Off'),
    ];

    console.log(workPattern);
  
    const scheduleDetails = [];
    const year = new Date(firstDayIn).getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInMonth = [
      31,
      isLeapYear ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
  
    let dayCounter = workPattern.length;
    //Modify dayCounter based on firstDayIn
    const firstDayInDay = new Date(firstDayIn).getDate();
    dayCounter -= firstDayInDay - 1;
    for (let month = 0; month < 12; month++) {
      scheduleDetails[month] = [];
      const daysInCurrentMonth = daysInMonth[month];
      for (let day = 1; day <= daysInCurrentMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dayObject = { date: new Date(currentDate), shift: workPattern[dayCounter++%workPattern.length] };

        scheduleDetails[month].push(dayObject);
      }
    }

    console.log(scheduleDetails);
  
    setScheduleDetails(scheduleDetails);

    setLoading(false);
  };

  const downloadSchedulePDF = () => {

    const downloadMargin = 10;
    const pdf = new jsPDF();

    html2canvas(pdfRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdfWidth = pdf.internal.pageSize.getWidth() - downloadMargin * 2;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width - downloadMargin * 2;

      pdf.addImage(imgData, 'PNG', downloadMargin, downloadMargin, pdfWidth, pdfHeight);
      pdf.save(`schedule-${new Date(firstDayIn).getFullYear()}.pdf`);
    });
  };

  const downloadSchedulePNG = () => {

    const downloadMargin = 100
    html2canvas(pdfRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
  
      // Create a new canvas with margins
      const newCanvas = document.createElement('canvas');
      const ctx = newCanvas.getContext('2d');
  
      newCanvas.width = canvas.width + downloadMargin*2 ;
      newCanvas.height = canvas.height + downloadMargin*2 ;
  
      ctx.fillStyle = 'white'; // Set the background color
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
      ctx.drawImage(canvas, downloadMargin, downloadMargin);
  
      // Convert the new canvas to PNG and trigger the download
      const link = document.createElement('a');
      link.download = `schedule-${new Date(firstDayIn).getFullYear()}.png`;
      link.href = newCanvas.toDataURL('image/png');
      link.click();
    });
  };
    
  return (
    <StyledDiv>
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item>
          <Typography variant="h6">Four Shift Schedule Generator</Typography>
        </Grid>
        <Grid item>
          <TextField
            label="Start of first block"
            type="date"
            value={firstDayIn}
            onChange={(e) => setFirstDayIn(e.target.value)}
            sx={{ m: 1, width: '15ch' }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Day Shifts"
            type="number"
            value={dayShifts}
            onChange={(e) => setDayShifts(parseInt(e.target.value))}
            sx={{ m: 1, width: '10ch' }}
          />
          <TextField
            label="Night Shifts"
            type="number"
            value={nightShifts}
            onChange={(e) => setNightShifts(parseInt(e.target.value))}
            sx={{ m: 1, width: '10ch' }}
          />
          <TextField
            label="Days Off"
            type="number"
            value={daysOff}
            onChange={(e) => setDaysOff(parseInt(e.target.value))}
            sx={{ m: 1, width: '10ch' }}
          />
        </Grid>
        <Grid item>
          {scheduleDetails.length > 0 ? (
            <Button variant="contained" onClick={() => setScheduleDetails([])}>
              Clear Schedule
            </Button>
          ):
          <Button variant="contained" onClick={handleGenerateSchedule}>
            Generate Schedule
          </Button>
          }
        </Grid>
        <Divider sx={{ width: '100%', marginTop: '20px'}} />
        <Grid item>
          { scheduleDetails.length > 0 ? (<div style={{textAlign: 'center'}}>
            <div style={{border: '1px solid black', padding: '10px', marginBottom: '20px', width: "1144px", height:"1768px"}} ref={pdfRef}>
            <Typography variant="h3">{new Date(firstDayIn).getFullYear()}</Typography>
            <ColorKey />
            <ScheduleGrid scheduleDetails={scheduleDetails} /> 
            </div>
            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
            <Button onClick={() => downloadSchedulePDF()}>
              Download as PDF
            </Button>
            <Button  onClick={() => downloadSchedulePNG()}>
              Download as PNG
            </Button>
            </ButtonGroup>
            </div>): (loading && <CircularProgress/>) }
        </Grid>
      </Grid>
    </StyledDiv>
  );
};

export default FourShiftScheduleWithGrid;
