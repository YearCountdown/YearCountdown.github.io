import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CustomCursor from './components/CustomCursor';
import { ThemeProvider } from './context/ThemeContext';
import { FEATURE_NAV_LINKS } from './lib/navigation';
import AllPage from './pages/views/AllPage';
import CountdownPage from './pages/views/CountdownPage';
import DotsPage from './pages/views/DotsPage';
import PiePage from './pages/views/PiePage';
import ProgressPage from './pages/views/ProgressPage';
import FeaturePage from './pages/FeaturePage';
import Home from './pages/Home/Home.jsx';
import NotFound from './pages/errors/NotFound';

import './index.css';

const featureRoutes = FEATURE_NAV_LINKS.filter((link) => {
  return (
    link.to !== '/view/countdown' &&
    link.to !== '/view/dots' &&
    link.to !== '/view/pie' &&
    link.to !== '/view/progress' &&
    link.to !== '/view/all'
  );
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <CustomCursor />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view/countdown" element={<CountdownPage />} />
        <Route path="/view/dots" element={<DotsPage />} />
        <Route path="/view/pie" element={<PiePage />} />
        <Route path="/view/progress" element={<ProgressPage />} />
        <Route path="/view/all" element={<AllPage />} />
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
