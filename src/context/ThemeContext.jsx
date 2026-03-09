import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  THEMES,
  applyFaviconForTheme,
  applyThemeToDocument,
  resolveTheme,
  writeThemeCookie,
} from '../lib/theme';
import {
  getViewColorsFromMode,
  readViewColorModeCookie,
  writeViewColorModeCookie,
} from '../lib/viewColors';

const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const initialTheme = document.documentElement.dataset.theme;
    return resolveTheme(initialTheme);
  });
  const [colorMode, setColorMode] = useState(() => {
    const initialTheme = resolveTheme(document.documentElement.dataset.theme);
    return readViewColorModeCookie(initialTheme);
  });

  useEffect(() => {
    applyThemeToDocument(theme);
    applyFaviconForTheme(theme);
    writeThemeCookie(theme);
    writeViewColorModeCookie(colorMode, theme);
  }, [colorMode, theme]);

  const value = useMemo(() => {
    const setThemeValue = (nextTheme) => {
      setTheme(resolveTheme(nextTheme));
    };

    const setColorModeValue = (nextMode) => {
      setColorMode(nextMode);
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
      colorMode,
      setColorMode: setColorModeValue,
      viewColors: getViewColorsFromMode(colorMode, theme),
    };
  }, [colorMode, theme]);

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
