import React from 'react';
import { Card, Container, Grid, Typography } from '@mui/material';
import FourShiftSchedule from '../../components/four-shift-schedule';

const MainPage = () => {
  return (
    <Card sx={{ width: '90%', padding: '20px' ,margin: 'auto', marginTop: '50px', minHeight: '80vh' }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Shift Schedule Generator
          </Typography>
          <FourShiftSchedule />
        </Grid>
      </Grid>
    </Card>
  );
};

export default MainPage;
