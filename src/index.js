import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import MainPage from './pages/mainPage';
import reportWebVitals from './reportWebVitals';
import { Navigate } from 'react-router-dom';
import Header from './components/header';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/shift-schedule" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/shift-schedule" replace />} />
        {/* Add more Route components for other paths */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
