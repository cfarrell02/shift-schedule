import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FourShiftSchedule from '../../components/four-shift-schedule';

const MainPage = () => (
  <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 3, md: 4 } }}>
      <Box
        aria-hidden
        sx={{
          width: 52,
          height: 52,
          flexShrink: 0,
          borderRadius: 3,
          display: 'grid',
          placeItems: 'center',
          color: '#fff',
          background: 'linear-gradient(135deg, #3f51b5, #2196f3)',
          boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)',
        }}
      >
        <CalendarMonthIcon fontSize="large" />
      </Box>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' } }}>
          Shift Schedule Generator
        </Typography>
        <Typography color="text.secondary">
          Build your rota, see the whole year, then print it or add it to your calendar.
        </Typography>
      </Box>
    </Box>
    <FourShiftSchedule />
  </Container>
);

export default MainPage;
