import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import FourShiftSchedule from '../../components/four-shift-schedule';

const MainPage = () => {
  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Shift Schedule Generator
          </Typography>
          <FourShiftSchedule />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainPage;
