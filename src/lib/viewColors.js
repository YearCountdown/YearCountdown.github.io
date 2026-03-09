import { THEMES } from './theme';

const WHITE = '#ffffff';
const BLACK = '#000000';
const VIEW_PRIMARY_COOKIE_KEY = 'yc_view_primary';
const VIEW_ALTERNATE_COOKIE_KEY = 'yc_view_alternate';
const VIEW_BRAND_TONE_COOKIE_KEY = 'yc_view_brand_tone';
const VIEW_TEXT_TONE_COOKIE_KEY = 'yc_view_text_tone';
const VIEW_COLORS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const VIEW_BRAND_TONE_MODES = {
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark',
};

export const VIEW_COLOR_PRESETS = [
  { id: 'black-white', label: 'Black / White', primary: '#000000', alternate: '#ffffff' },
  { id: 'white-black', label: 'White / Black', primary: '#ffffff', alternate: '#000000' },
  { id: 'blue-white', label: 'Blue / White', primary: '#2563eb', alternate: '#ffffff' },
  { id: 'orange-white', label: 'Orange / White', primary: '#ea580c', alternate: '#ffffff' },
  { id: 'gold-black', label: 'Gold / Black', primary: '#d4a017', alternate: '#000000' },
  { id: 'mint-black', label: 'Mint / Black', primary: '#34d399', alternate: '#000000' },
];

export const DEFAULT_VIEW_COLORS = {
  [THEMES.DARK]: {
    primary: '#ffffff',
    alternate: '#000000',
  },
  [THEMES.LIGHT]: {
    primary: '#000000',
    alternate: '#ffffff',
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

export const readViewColorsCookie = (theme) => {
  if (typeof document === 'undefined') {
    return getDefaultViewColors(theme);
  }

  const defaults = getDefaultViewColors(theme);
  const primaryMatch = document.cookie.match(new RegExp(`(?:^|; )${VIEW_PRIMARY_COOKIE_KEY}=([^;]*)`));
  const alternateMatch = document.cookie.match(new RegExp(`(?:^|; )${VIEW_ALTERNATE_COOKIE_KEY}=([^;]*)`));

  return {
    primary: normalizeHexColor(primaryMatch ? decodeURIComponent(primaryMatch[1]) : '', defaults.primary),
    alternate: normalizeHexColor(alternateMatch ? decodeURIComponent(alternateMatch[1]) : '', defaults.alternate),
  };
};

export const writeViewColorsCookie = ({ primary, alternate }, theme) => {
  if (typeof document === 'undefined') {
    return;
  }

  const defaults = getDefaultViewColors(theme);
  const normalizedPrimary = normalizeHexColor(primary, defaults.primary);
  const normalizedAlternate = normalizeHexColor(alternate, defaults.alternate);

  document.cookie = `${VIEW_PRIMARY_COOKIE_KEY}=${encodeURIComponent(normalizedPrimary)}; Max-Age=${VIEW_COLORS_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
  document.cookie = `${VIEW_ALTERNATE_COOKIE_KEY}=${encodeURIComponent(normalizedAlternate)}; Max-Age=${VIEW_COLORS_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
};

export const resolveViewColors = ({ theme, primary, alternate }) => {
  const defaults = getDefaultViewColors(theme);

  return {
    primary: normalizeHexColor(primary, defaults.primary),
    alternate: normalizeHexColor(alternate, defaults.alternate),
  };
};

export const withAlpha = (color, alpha) => {
  const normalized = normalizeHexColor(color, BLACK).slice(1);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getColorLuminance = (color) => {
  const normalized = normalizeHexColor(color, BLACK).slice(1);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

export const getColorTone = (color) => {
  return getColorLuminance(color) > 0.52 ? THEMES.DARK : THEMES.LIGHT;
};

export const getThemeFromBackgroundColor = (color) => {
  return getColorLuminance(color) > 0.52 ? THEMES.LIGHT : THEMES.DARK;
};

export const normalizeViewBrandToneMode = (value) => {
  return Object.values(VIEW_BRAND_TONE_MODES).includes(value) ? value : VIEW_BRAND_TONE_MODES.AUTO;
};

export const readViewBrandToneCookie = () => {
  if (typeof document === 'undefined') {
    return VIEW_BRAND_TONE_MODES.AUTO;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${VIEW_BRAND_TONE_COOKIE_KEY}=([^;]*)`));

  if (!match) {
    return VIEW_BRAND_TONE_MODES.AUTO;
  }

  try {
    return normalizeViewBrandToneMode(decodeURIComponent(match[1]));
  } catch {
    return VIEW_BRAND_TONE_MODES.AUTO;
  }
};

export const writeViewBrandToneCookie = (value) => {
  if (typeof document === 'undefined') {
    return;
  }

  const normalizedValue = normalizeViewBrandToneMode(value);
  document.cookie = `${VIEW_BRAND_TONE_COOKIE_KEY}=${encodeURIComponent(normalizedValue)}; Max-Age=${VIEW_COLORS_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
};

export const readViewTextToneCookie = () => {
  if (typeof document === 'undefined') {
    return VIEW_BRAND_TONE_MODES.AUTO;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${VIEW_TEXT_TONE_COOKIE_KEY}=([^;]*)`));

  if (!match) {
    return VIEW_BRAND_TONE_MODES.AUTO;
  }

  try {
    return normalizeViewBrandToneMode(decodeURIComponent(match[1]));
  } catch {
    return VIEW_BRAND_TONE_MODES.AUTO;
  }
};

export const writeViewTextToneCookie = (value) => {
  if (typeof document === 'undefined') {
    return;
  }

  const normalizedValue = normalizeViewBrandToneMode(value);
  document.cookie = `${VIEW_TEXT_TONE_COOKIE_KEY}=${encodeURIComponent(normalizedValue)}; Max-Age=${VIEW_COLORS_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
};

export const resolveViewBrandIconTone = ({ mode, backgroundColor }) => {
  const normalizedMode = normalizeViewBrandToneMode(mode);

  if (normalizedMode === VIEW_BRAND_TONE_MODES.LIGHT || normalizedMode === VIEW_BRAND_TONE_MODES.DARK) {
    return normalizedMode;
  }

  return getColorLuminance(backgroundColor) > 0.52 ? VIEW_BRAND_TONE_MODES.DARK : VIEW_BRAND_TONE_MODES.LIGHT;
};

export const resolveViewTextTone = ({ mode, backgroundColor }) => {
  const normalizedMode = normalizeViewBrandToneMode(mode);

  if (normalizedMode === VIEW_BRAND_TONE_MODES.LIGHT || normalizedMode === VIEW_BRAND_TONE_MODES.DARK) {
    return normalizedMode;
  }

  return getColorLuminance(backgroundColor) > 0.52 ? VIEW_BRAND_TONE_MODES.DARK : VIEW_BRAND_TONE_MODES.LIGHT;
};

export const getToneColor = (tone) => {
  return tone === VIEW_BRAND_TONE_MODES.LIGHT ? '#ffffff' : '#111111';
};

export const getViewSurfacePalette = (primary, alternate) => {
  return {
    primary,
    secondaryText: alternate,
    mutedSurface: alternate,
    subtleSurface: alternate,
    outlineTrack: `color-mix(in srgb, ${alternate} 34%, transparent)`,
    textOnElapsed: getContrastingTextColor(primary),
    textOnRemaining: getContrastingTextColor(alternate),
  };
};

export const getContrastingTextColor = (color) => {
  return getColorLuminance(color) > 0.52 ? '#111111' : '#ffffff';
};
