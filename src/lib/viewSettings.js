import { NAV_LINKS } from './navigation';
import { THEMES, resolveTheme } from './theme';

export const VIEW_SETTINGS_CONFIG = {
  countdown: {
    id: 'countdown',
    title: 'Countdown',
    controls: [
      {
        key: 'mode',
        type: 'select',
        label: 'Display',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Days', value: 'days' },
          { label: 'Hours', value: 'hours' },
          { label: 'Minutes', value: 'minutes' },
          { label: 'Seconds', value: 'seconds' },
        ],
      },
      {
        key: 'frame',
        type: 'boolean',
        label: 'Outer Frame',
        trueLabel: 'On',
        falseLabel: 'Off',
      },
      {
        key: 'labels',
        type: 'boolean',
        label: 'Labels',
        trueLabel: 'Show',
        falseLabel: 'Hide',
      },
    ],
  },
  dots: {
    id: 'dots',
    title: 'Dots',
    controls: [
      {
        key: 'shape',
        type: 'select',
        label: 'Shape',
        options: [
          { label: 'Circle', value: 'circle' },
          { label: 'Square', value: 'square' },
          { label: 'Triangle', value: 'triangle' },
        ],
      },
      {
        key: 'triangleMode',
        type: 'select',
        label: 'Triangle',
        showWhen: (state) => state.shape === 'triangle',
        options: [
          { label: 'Up', value: 'upright' },
          { label: 'Down', value: 'inverted' },
          { label: 'Alt', value: 'alternating' },
          { label: 'Angle', value: 'angle' },
        ],
      },
      {
        key: 'triangleAngle',
        type: 'number',
        label: 'Angle',
        min: 0,
        max: 360,
        step: 1,
        suffix: 'deg',
        showWhen: (state) => state.shape === 'triangle' && state.triangleMode === 'angle',
      },
      {
        key: 'gap',
        type: 'number',
        label: 'Gap',
        min: 0,
        max: 8,
        step: 0.1,
        suffix: '%',
      },
      {
        key: 'inset',
        type: 'number',
        label: 'Inset',
        min: 0,
        max: 12,
        step: 0.1,
        suffix: '%',
      },
    ],
  },
  pie: {
    id: 'pie',
    title: 'Pie',
    controls: [],
  },
  progress: {
    id: 'progress',
    title: 'Progress',
    controls: [],
  },
};

export const getViewIdFromPathname = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] !== 'view' || !segments[1]) {
    return null;
  }

  return segments[1];
};

export const getViewConfigFromPathname = (pathname) => {
  const viewId = getViewIdFromPathname(pathname);

  if (!viewId) {
    return null;
  }

  return VIEW_SETTINGS_CONFIG[viewId] ?? null;
};

export const isEmbedMode = (searchParams) => {
  return searchParams.get('embed') === 'true';
};

export const getSharedViewUrl = ({ pathname, search, origin, theme }) => {
  const currentTheme = resolveTheme(theme);
  const params = new URLSearchParams(search);

  params.set('embed', 'true');
  params.set('theme', currentTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT);

  return `${origin}${pathname}?${params.toString()}`;
};

export const COUNTDOWN_DEFAULT_SETTINGS = {
  mode: 'all',
  frame: true,
  labels: true,
};

export const DOTS_DEFAULT_SETTINGS = {
  shape: 'circle',
  triangleMode: 'upright',
  triangleAngle: 0,
  gap: 0.5,
  inset: 0.5,
};

const clampNumber = (value, min, max, fallback) => {
  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
};

export const normalizeDotsSettingValue = (key, value) => {
  switch (key) {
    case 'shape':
      return ['circle', 'square', 'triangle'].includes(value) ? value : DOTS_DEFAULT_SETTINGS.shape;
    case 'triangleMode':
      return ['upright', 'inverted', 'alternating', 'angle'].includes(value)
        ? value
        : DOTS_DEFAULT_SETTINGS.triangleMode;
    case 'triangleAngle':
      return clampNumber(value, 0, 360, DOTS_DEFAULT_SETTINGS.triangleAngle);
    case 'gap':
      return clampNumber(value, 0, 8, DOTS_DEFAULT_SETTINGS.gap);
    case 'inset':
      return clampNumber(value, 0, 12, DOTS_DEFAULT_SETTINGS.inset);
    default:
      return value;
  }
};

export const getCountdownSettingsFromSearchParams = (searchParams) => {
  const mode = searchParams.get('mode');
  const frame = searchParams.get('frame');
  const labels = searchParams.get('labels');

  return {
    mode: ['all', 'days', 'hours', 'minutes', 'seconds'].includes(mode)
      ? mode
      : COUNTDOWN_DEFAULT_SETTINGS.mode,
    frame: frame === 'false' ? false : COUNTDOWN_DEFAULT_SETTINGS.frame,
    labels: labels === 'false' ? false : COUNTDOWN_DEFAULT_SETTINGS.labels,
  };
};

export const getDotsSettingsFromSearchParams = (searchParams) => {
  const shape = searchParams.get('shape');
  const triangleMode = searchParams.get('triangleMode');

  return {
    shape: ['circle', 'square', 'triangle'].includes(shape) ? shape : DOTS_DEFAULT_SETTINGS.shape,
    triangleMode: ['upright', 'inverted', 'alternating', 'angle'].includes(triangleMode)
      ? triangleMode
      : DOTS_DEFAULT_SETTINGS.triangleMode,
    triangleAngle: clampNumber(searchParams.get('triangleAngle'), 0, 360, DOTS_DEFAULT_SETTINGS.triangleAngle),
    gap: clampNumber(searchParams.get('gap'), 0, 8, DOTS_DEFAULT_SETTINGS.gap),
    inset: clampNumber(searchParams.get('inset'), 0, 12, DOTS_DEFAULT_SETTINGS.inset),
  };
};

export const getViewLinkMeta = (pathname) => {
  return NAV_LINKS.find((link) => link.to === pathname) ?? null;
};
