import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { FEATURE_NAV_LINKS } from './lib/navigation';
import CountdownPage from './pages/views/CountdownPage';
import DotsPage from './pages/views/DotsPage';
import FeaturePage from './pages/FeaturePage';
import Home from './pages/Home/Home.jsx';
import NotFound from './pages/errors/NotFound';

import './index.css';

const featureRoutes = FEATURE_NAV_LINKS.filter((link) => {
  return link.to !== '/view/countdown' && link.to !== '/view/dots';
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view/countdown" element={<CountdownPage />} />
        <Route path="/view/dots" element={<DotsPage />} />
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
