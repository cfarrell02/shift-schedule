import React from 'react';
import { Grid } from '@mui/material';
import MonthSchedule from '../month-grid';

// Always laid out 3 across: this is rendered at a fixed width for exporting and scaled down on small screens
const ScheduleGrid = ({ months, typesById, today }) => (
  <Grid container spacing={4}>
    {months.map((month) => (
      <Grid item xs={4} key={month.name}>
        <MonthSchedule month={month} typesById={typesById} today={today} />
      </Grid>
    ))}
  </Grid>
);

export default ScheduleGrid;
