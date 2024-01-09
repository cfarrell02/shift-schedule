import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, styled } from '@mui/material';
import ScheduleGrid from '../schedule-grid';
import ColorKey from '../schedule-key';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StyledDiv = styled('div')({
  flexGrow: 1,
  margin: '16px',
});

const FourShiftScheduleWithGrid = () => {
  const [firstDayIn, setFirstDayIn] = useState('');
  const [dayShifts, setDayShifts] = useState(0);
  const [nightShifts, setNightShifts] = useState(0);
  const [daysOff, setDaysOff] = useState(0);
  const [scheduleDetails, setScheduleDetails] = useState({});
  const pdfRef = React.createRef();

  const handleGenerateSchedule = () => {
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
  
    let dayCounter = 0;
    //Modify dayCounter based on firstDayIn
    const firstDayInDay = new Date(firstDayIn).getDay();
    dayCounter -= firstDayInDay - 1;
    for (let month = 0; month < 12; month++) {
      scheduleDetails[month] = [];
      const daysInCurrentMonth = daysInMonth[month];
      for (let day = 1; day <= daysInCurrentMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dayObject = { date: new Date(currentDate), shift: workPattern[dayCounter++%workPattern.length] || "Off" };

        scheduleDetails[month].push(dayObject);
      }
    }

    console.log(scheduleDetails);
  
    setScheduleDetails(scheduleDetails);
  };

  const downloadSchedulePDF = () => {
    const pdf = new jsPDF();
    const pdfMargin = 10;

    html2canvas(pdfRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdfWidth = pdf.internal.pageSize.getWidth() - pdfMargin * 2;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width - pdfMargin * 2;

      pdf.addImage(imgData, 'PNG', pdfMargin, pdfMargin, pdfWidth, pdfHeight);
      pdf.save('sample.pdf');
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
            label="First Day In"
            type="date"
            value={firstDayIn}
            onChange={(e) => setFirstDayIn(e.target.value)}
            sx={{ m: 1, width: '10ch' }}
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
        <Grid item>
          { scheduleDetails.length > 0 ? (<div style={{textAlign: 'center'}}>
            <div style={{border: '1px solid black', padding: '10px', marginBottom: '20px'}} ref={pdfRef}>
            <ColorKey />
            <ScheduleGrid scheduleDetails={scheduleDetails} /> 
            </div>
            
            <Button variant="contained" onClick={() => downloadSchedulePDF()}>
              Download Schedule
            </Button>
            </div>): null }
        </Grid>
      </Grid>
    </StyledDiv>
  );
};

export default FourShiftScheduleWithGrid;
