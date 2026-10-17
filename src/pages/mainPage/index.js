import React from 'react';
import { Card, Typography } from '@mui/material';
import FourShiftSchedule from '../../components/four-shift-schedule';

const MainPage = () => (
  <Card
    sx={{
      width: { xs: 'auto', md: '90%' },
      mx: { xs: 1, md: 'auto' },
      mt: { xs: 1, md: 6 },
      p: { xs: 2, md: 3 },
      minHeight: '80vh',
    }}
  >
    <Typography variant="h4" component="h1" align="center" gutterBottom>
      Shift Schedule Generator
    </Typography>
    <FourShiftSchedule />
  </Card>
);

export default MainPage;
