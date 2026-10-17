import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import MainPage from './pages/mainPage';
import reportWebVitals from './reportWebVitals';
import Footer from './components/footer';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/shift-schedule" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/shift-schedule" replace />} />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);

reportWebVitals();
