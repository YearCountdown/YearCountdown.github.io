import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { FEATURE_NAV_LINKS } from './lib/navigation';
import CountdownPage from './pages/views/CountdownPage';
import FeaturePage from './pages/FeaturePage';
import Home from './pages/Home/Home.jsx';
import NotFound from './pages/errors/NotFound';

import './index.css';

const featureRoutes = FEATURE_NAV_LINKS.filter((link) => link.to !== '/view/countdown');

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view/countdown" element={<CountdownPage />} />
        {featureRoutes.map((link) => (
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
