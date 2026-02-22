export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

export const THEME_COOKIE_KEY = 'yc_theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const FAVICON_ID_TO_PATH = {
  'icon-32': 'favicon-32x32.png',
  'icon-16': 'favicon-16x16.png',
  'icon-ico': 'favicon.ico',
  'apple-touch-icon': 'apple-touch-icon.png',
  'site-manifest': 'site.webmanifest',
};

const THEME_COLORS = {
  [THEMES.DARK]: '#111827',
  [THEMES.LIGHT]: '#ffffff',
};

export const resolveTheme = (value) => {
  return value === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
};

export const readThemeCookie = () => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE_KEY}=([^;]*)`));

  if (!match) {
    return THEMES.DARK;
  }

  try {
    return resolveTheme(decodeURIComponent(match[1]));
  } catch {
    return THEMES.DARK;
  }
};

export const writeThemeCookie = (theme) => {
  const normalizedTheme = resolveTheme(theme);
  document.cookie = `${THEME_COOKIE_KEY}=${encodeURIComponent(normalizedTheme)}; Max-Age=${THEME_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
};

export const applyThemeToDocument = (theme) => {
  const normalizedTheme = resolveTheme(theme);
  const root = document.documentElement;

  root.dataset.theme = normalizedTheme;
  root.classList.toggle(THEMES.DARK, normalizedTheme === THEMES.DARK);
};

export const applyFaviconForTheme = (theme) => {
  const normalizedTheme = resolveTheme(theme);
  const basePath = `/favicons/${normalizedTheme}`;

  Object.entries(FAVICON_ID_TO_PATH).forEach(([id, path]) => {
    const element = document.getElementById(id);

    if (element) {
      element.setAttribute('href', `${basePath}/${path}`);
    }
  });

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', THEME_COLORS[normalizedTheme]);
  }
};
