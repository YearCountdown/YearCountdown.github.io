import { THEMES } from './theme';

export const VIEW_COLOR_PRESETS = [
  { id: 'mono-light', label: 'Mono', primary: '#111111', alternate: '#71717a' },
  { id: 'mono-dark', label: 'Night', primary: '#ffffff', alternate: '#a1a1aa' },
  { id: 'ocean', label: 'Ocean', primary: '#0f766e', alternate: '#67e8f9' },
  { id: 'ember', label: 'Ember', primary: '#b91c1c', alternate: '#f59e0b' },
  { id: 'orchid', label: 'Orchid', primary: '#4c1d95', alternate: '#f472b6' },
  { id: 'forest', label: 'Forest', primary: '#166534', alternate: '#86efac' },
];

export const DEFAULT_VIEW_COLORS = {
  [THEMES.DARK]: {
    primary: '#ffffff',
    alternate: '#a1a1aa',
  },
  [THEMES.LIGHT]: {
    primary: '#111111',
    alternate: '#71717a',
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

export const resolveViewColors = ({ theme, primary, alternate }) => {
  const defaults = getDefaultViewColors(theme);

  return {
    primary: normalizeHexColor(primary, defaults.primary),
    alternate: normalizeHexColor(alternate, defaults.alternate),
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
