import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import './index.css';
import theme from './theme';
import MainPage from './pages/mainPage';
import reportWebVitals from './reportWebVitals';
import Footer from './components/footer';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/shift-schedule" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/shift-schedule" replace />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
