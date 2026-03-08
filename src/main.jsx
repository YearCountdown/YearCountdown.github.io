import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { FEATURE_NAV_LINKS } from './lib/navigation';
import FeaturePage from './pages/FeaturePage';
import Home from './pages/Home/Home.jsx';
import NotFound from './pages/errors/NotFound';

import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {FEATURE_NAV_LINKS.map((link) => (
          <Route
            key={link.to}
            path={link.to}
            element={<FeaturePage title={link.title} description={link.description} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
