import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';

const ColorKey = () => {
  const colorCodes = [
    { label: 'Day Shift', color: '#2196f3' }, // Blue for Day Shift
    { label: 'Night Shift', color: '#ffeb3b' }, // Yellow for Night Shift
    { label: 'Off', color: 'transparent' }, // No color for Off
  ];

  return (
    <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
      {colorCodes.map(({ label, color }, index) => (
        <Grid item xs={4} key={index}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: color,
              border: '1px solid black',
              borderRadius: '4px',
            }}
          >
            <Typography variant="body1">{label}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default ColorKey;
