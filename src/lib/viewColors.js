import { THEMES } from './theme';

const WHITE = '#ffffff';
const BLACK = '#000000';
const VIEW_COLOR_MODE_COOKIE_KEY = 'yc_view_color_mode';
const VIEW_COLOR_MODE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const VIEW_COLOR_MODES = {
  BLACK_PRIMARY: 'black-primary',
  WHITE_PRIMARY: 'white-primary',
};

export const DEFAULT_VIEW_COLORS = {
  [THEMES.DARK]: {
    primary: WHITE,
    alternate: BLACK,
  },
  [THEMES.LIGHT]: {
    primary: BLACK,
    alternate: WHITE,
  },
};

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const normalizeHexColor = (value, fallback) => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();

  if (!HEX_COLOR_PATTERN.test(trimmed)) {
    return fallback;
  }

  if (trimmed.length === 4) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return trimmed.toLowerCase();
};

export const getDefaultViewColors = (theme) => {
  return DEFAULT_VIEW_COLORS[theme] ?? DEFAULT_VIEW_COLORS[THEMES.LIGHT];
};

export const getViewColorsFromMode = (mode, theme) => {
  const resolvedMode =
    mode === VIEW_COLOR_MODES.BLACK_PRIMARY || mode === VIEW_COLOR_MODES.WHITE_PRIMARY
      ? mode
      : theme === THEMES.DARK
        ? VIEW_COLOR_MODES.WHITE_PRIMARY
        : VIEW_COLOR_MODES.BLACK_PRIMARY;

  return resolvedMode === VIEW_COLOR_MODES.WHITE_PRIMARY
    ? { primary: WHITE, alternate: BLACK }
    : { primary: BLACK, alternate: WHITE };
};

export const readViewColorModeCookie = (theme) => {
  if (typeof document === 'undefined') {
    return theme === THEMES.DARK ? VIEW_COLOR_MODES.WHITE_PRIMARY : VIEW_COLOR_MODES.BLACK_PRIMARY;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${VIEW_COLOR_MODE_COOKIE_KEY}=([^;]*)`),
  );
  const fallback = theme === THEMES.DARK ? VIEW_COLOR_MODES.WHITE_PRIMARY : VIEW_COLOR_MODES.BLACK_PRIMARY;

  if (!match) {
    return fallback;
  }

  try {
    const value = decodeURIComponent(match[1]);
    return value === VIEW_COLOR_MODES.BLACK_PRIMARY || value === VIEW_COLOR_MODES.WHITE_PRIMARY
      ? value
      : fallback;
  } catch {
    return fallback;
  }
};

export const writeViewColorModeCookie = (mode, theme) => {
  if (typeof document === 'undefined') {
    return;
  }

  const resolvedMode =
    mode === VIEW_COLOR_MODES.BLACK_PRIMARY || mode === VIEW_COLOR_MODES.WHITE_PRIMARY
      ? mode
      : theme === THEMES.DARK
        ? VIEW_COLOR_MODES.WHITE_PRIMARY
        : VIEW_COLOR_MODES.BLACK_PRIMARY;

  document.cookie = `${VIEW_COLOR_MODE_COOKIE_KEY}=${encodeURIComponent(resolvedMode)}; Max-Age=${VIEW_COLOR_MODE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
};

export const resolveViewColors = ({ theme, colorMode, primary, alternate }) => {
  const normalizedPrimary = normalizeHexColor(primary, '');
  const normalizedAlternate = normalizeHexColor(alternate, '');

  if (isBlackWhitePair(normalizedPrimary, normalizedAlternate)) {
    return {
      primary: normalizedPrimary,
      alternate: normalizedAlternate,
    };
  }

  return getViewColorsFromMode(colorMode, theme);
};

export const isBlackWhitePair = (primary, alternate) => {
  const normalizedPrimary = normalizeHexColor(primary, '');
  const normalizedAlternate = normalizeHexColor(alternate, '');

  return (
    (normalizedPrimary === BLACK && normalizedAlternate === WHITE) ||
    (normalizedPrimary === WHITE && normalizedAlternate === BLACK)
  );
};

export const withAlpha = (color, alpha) => {
  const normalized = normalizeHexColor(color, BLACK).slice(1);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getViewSurfacePalette = (primary, alternate) => {
  const monochrome = isBlackWhitePair(primary, alternate);

  return {
    monochrome,
    primary,
    secondaryText: monochrome ? withAlpha(primary, 0.62) : alternate,
    mutedSurface: monochrome ? withAlpha(primary, 0.05) : alternate,
    subtleSurface: monochrome ? withAlpha(primary, 0.03) : alternate,
    outlineTrack: monochrome ? withAlpha(primary, 0.05) : `color-mix(in srgb, ${alternate} 28%, transparent)`,
    textOnElapsed: getContrastingTextColor(primary),
    textOnRemaining: monochrome ? primary : getContrastingTextColor(alternate),
  };
};

export const getContrastingTextColor = (color) => {
  const normalized = normalizeHexColor(color, '#111111').slice(1);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return luminance > 0.52 ? '#111111' : '#ffffff';
};
