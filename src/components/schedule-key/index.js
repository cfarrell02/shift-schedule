import React from 'react';
import { Typography, Box } from '@mui/material';
import { shiftBackground } from '../../lib/colors';

const ColorKey = ({ shiftTypes }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
    {shiftTypes.map((type) => (
      <Box
        key={type.id}
        sx={{
          flex: '1 1 0',
          minWidth: 160,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(0, 0, 0, 0.25)',
          borderRadius: '8px',
          ...shiftBackground(type),
        }}
      >
        <Typography variant="body1">
          {type.label}
          {type.code && <strong> ({type.code})</strong>}
        </Typography>
      </Box>
    ))}
  </Box>
);

export default ColorKey;
