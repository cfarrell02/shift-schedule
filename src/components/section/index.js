import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

// A titled card grouping one part of the page
const Section = ({ title, subtitle, action, children, sx }) => (
  <Paper variant="outlined" component="section" sx={{ p: { xs: 2, md: 3 }, ...sx }}>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        mb: children ? 2.5 : 0,
      }}
    >
      <Box>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
    {children}
  </Paper>
);

export default Section;
