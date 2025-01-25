import React from 'react';
import { Card, Container, Divider, Grid, Typography } from '@mui/material';
import FourShiftSchedule from '../../components/four-shift-schedule';

const MainPage = () => {
  const isScreenBigEnough = window.innerWidth > 1000;

  return (
    <Card sx={{ width: '90%', padding: '20px' ,margin: 'auto', marginTop: '50px', minHeight: '80vh' }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Shift Schedule Generator
          </Typography>
          {isScreenBigEnough ? (
          <FourShiftSchedule />
          ) : (
            <Container>
              <Divider sx={{ margin: '20px 0' }} />
              <Typography variant="body1" align="center">
                This app is not designed for small screens. Please use a device with a larger screen to use this app.
              </Typography>
            </Container>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default MainPage;
