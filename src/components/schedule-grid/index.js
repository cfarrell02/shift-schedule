import React from 'react';
import { Grid } from '@mui/material';
import MonthSchedule from '../month-grid';

const ScheduleGrid = ({ scheduleDetails }) => {
  return (
    <Grid container spacing={4} >
      {scheduleDetails.map((monthData, index) => (
        <Grid item xs={4} key={index}>
          <MonthSchedule monthData={monthData} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ScheduleGrid;
