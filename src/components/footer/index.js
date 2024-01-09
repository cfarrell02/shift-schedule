import React from 'react';
import { Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
      <Typography variant="body2">
        View this project on{' '}
        <Link href="https://github.com/cfarrell02/shift-schedule" target="_blank" rel="noopener noreferrer">
          GitHub
        </Link>
      </Typography>
    </footer>
  );
};

export default Footer;
