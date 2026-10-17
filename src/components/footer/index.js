import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => (
  <Box component="footer" sx={{ textAlign: 'center', pb: 5 }}>
    <Typography variant="body2" color="text.secondary">
      <Link
        href="https://github.com/cfarrell02/shift-schedule"
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
      >
        <GitHubIcon fontSize="small" />
        View this project on GitHub
      </Link>
    </Typography>
  </Box>
);

export default Footer;
