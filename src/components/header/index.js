import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const Header = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ backgroundColor: '#303f9f' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: '#fff' }}>
            Shift Schedule Generator
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
