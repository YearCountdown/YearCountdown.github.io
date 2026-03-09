import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  THEMES,
  applyFaviconForTheme,
  applyThemeToDocument,
  readThemeCookie,
  resolveTheme,
  writeThemeCookie,
} from '../lib/theme';
import {
  readViewBrandToneCookie,
  readViewColorsCookie,
  readViewTextToneCookie,
  resolveViewColors,
  normalizeViewBrandToneMode,
  writeViewBrandToneCookie,
  writeViewColorsCookie,
  writeViewTextToneCookie,
} from '../lib/viewColors';

const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return readThemeCookie();
  });
  const [viewColors, setViewColors] = useState(() => {
    const initialTheme = readThemeCookie();
    return readViewColorsCookie(initialTheme);
  });
  const [viewBrandToneMode, setViewBrandToneMode] = useState(() => {
    return readViewBrandToneCookie();
  });
  const [viewTextToneMode, setViewTextToneMode] = useState(() => {
    return readViewTextToneCookie();
  });

  useEffect(() => {
    applyThemeToDocument(theme);
    applyFaviconForTheme(theme);
    writeThemeCookie(theme);
    writeViewColorsCookie(viewColors, theme);
    writeViewBrandToneCookie(viewBrandToneMode);
    writeViewTextToneCookie(viewTextToneMode);
  }, [theme, viewBrandToneMode, viewColors, viewTextToneMode]);

  const value = useMemo(() => {
    const setThemeValue = (nextTheme) => {
      setTheme(resolveTheme(nextTheme));
    };

    const setViewColorsValue = (nextColors) => {
      setViewColors((currentColors) => {
        return resolveViewColors({
          theme,
          primary: nextColors?.primary ?? currentColors.primary,
          alternate: nextColors?.alternate ?? currentColors.alternate,
        });
      });
    };

    const setViewBrandToneModeValue = (nextMode) => {
      setViewBrandToneMode(normalizeViewBrandToneMode(nextMode));
    };

    const setViewTextToneModeValue = (nextMode) => {
      setViewTextToneMode(normalizeViewBrandToneMode(nextMode));
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
      viewColors,
      setViewColors: setViewColorsValue,
      viewBrandToneMode,
      setViewBrandToneMode: setViewBrandToneModeValue,
      viewTextToneMode,
      setViewTextToneMode: setViewTextToneModeValue,
    };
  }, [theme, viewBrandToneMode, viewColors, viewTextToneMode]);

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
