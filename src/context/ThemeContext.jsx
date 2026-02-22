import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  THEMES,
  applyFaviconForTheme,
  applyThemeToDocument,
  resolveTheme,
  writeThemeCookie,
} from '../lib/theme';

const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const initialTheme = document.documentElement.dataset.theme;
    return resolveTheme(initialTheme);
  });

  useEffect(() => {
    applyThemeToDocument(theme);
    applyFaviconForTheme(theme);
    writeThemeCookie(theme);
  }, [theme]);

  const value = useMemo(() => {
    const setThemeValue = (nextTheme) => {
      setTheme(resolveTheme(nextTheme));
    };

    const toggleTheme = () => {
      setTheme((currentTheme) => {
        return currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      });
    };

    return {
      theme,
      setTheme: setThemeValue,
      toggleTheme,
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};

export { ThemeProvider, useTheme };
