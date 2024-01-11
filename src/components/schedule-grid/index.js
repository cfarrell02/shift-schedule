import React from 'react';
import { Grid } from '@mui/material';
import MonthSchedule from '../month-grid';

const ScheduleGrid = ({ scheduleDetails }) => {
  return (
    <Grid container spacing={4} >
      {scheduleDetails.map((monthData, index) => (
        index >= 12 ? null : // Dont do any month after 12 months
        <Grid item xs={4} key={index}>
          <MonthSchedule monthData={monthData} nextMonthData={scheduleDetails[index+1]} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ScheduleGrid;
