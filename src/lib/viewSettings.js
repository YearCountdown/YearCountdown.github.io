import { NAV_LINKS } from './navigation';
import { THEMES, resolveTheme } from './theme';
import { VIEW_COLOR_PRESETS, getDefaultViewColors, normalizeHexColor, resolveViewColors } from './viewColors';

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
        key: 'gapX',
        type: 'number',
        label: 'H Gap',
        min: 0,
        max: 8,
        step: 0.1,
        suffix: '%',
        inlineGroup: 'dots-gap',
      },
      {
        key: 'gapY',
        type: 'number',
        label: 'V Gap',
        min: 0,
        max: 8,
        step: 0.1,
        suffix: '%',
        inlineGroup: 'dots-gap',
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
      {
        key: 'outerX',
        type: 'number',
        label: 'Outer X',
        min: 0,
        max: 12,
        step: 0.1,
        suffix: '%',
        inlineGroup: 'dots-outer',
      },
      {
        key: 'outerY',
        type: 'number',
        label: 'Outer Y',
        min: 0,
        max: 12,
        step: 0.1,
        suffix: '%',
        inlineGroup: 'dots-outer',
      },
    ],
  },
  pie: {
    id: 'pie',
    title: 'Pie',
    controls: [
      {
        key: 'shape',
        type: 'select',
        label: 'Shape',
        options: [
          { label: 'Circle', value: 'circle' },
          { label: 'Rectangle', value: 'rectangle' },
        ],
      },
      {
        key: 'style',
        type: 'select',
        label: 'Style',
        options: [
          { label: 'Filled', value: 'filled' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        key: 'fullScreen',
        type: 'boolean',
        label: 'Display',
        trueLabel: 'Full Screen',
        falseLabel: 'Centered',
      },
      {
        key: 'decimals',
        type: 'number',
        label: 'Decimals',
        min: 0,
        max: 10,
        step: 1,
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
      {
        key: 'outerX',
        type: 'number',
        label: 'Outer X',
        min: 0,
        max: 12,
        step: 0.1,
        suffix: '%',
        inlineGroup: 'pie-outer',
      },
      {
        key: 'outerY',
        type: 'number',
        label: 'Outer Y',
        min: 0,
        max: 12,
        step: 0.1,
        suffix: '%',
        inlineGroup: 'pie-outer',
      },
    ],
  },
  progress: {
    id: 'progress',
    title: 'Progress',
    controls: [
      {
        key: 'mode',
        type: 'select',
        label: 'Display',
        options: [
          { label: 'Field', value: 'field' },
          { label: 'Line', value: 'line' },
        ],
      },
      {
        key: 'fullScreen',
        type: 'boolean',
        label: 'Mode',
        trueLabel: 'Full Screen',
        falseLabel: 'Centered',
      },
      {
        key: 'decimals',
        type: 'number',
        label: 'Decimals',
        min: 0,
        max: 10,
        step: 1,
      },
      {
        key: 'fontSize',
        type: 'number',
        label: 'Font Size',
        min: 0.6,
        max: 2.5,
        step: 0.1,
        suffix: 'x',
      },
      {
        key: 'lineWidth',
        type: 'number',
        label: 'Line Width',
        min: 2,
        max: 80,
        step: 1,
        suffix: 'px',
        showWhen: (state) => state.mode === 'line',
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
      {
        key: 'outerX',
        type: 'number',
        label: 'Outer X',
        min: 0,
        max: 12,
        step: 0.1,
        suffix: '%',
        inlineGroup: 'progress-outer',
      },
      {
        key: 'outerY',
        type: 'number',
        label: 'Outer Y',
        min: 0,
        max: 12,
        step: 0.1,
        suffix: '%',
        inlineGroup: 'progress-outer',
      },
    ],
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
  const resolvedColors = resolveViewColors({
    theme: currentTheme,
    primary: params.get('primary'),
    alternate: params.get('alternate'),
  });

  params.set('embed', 'true');
  params.set('theme', currentTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT);
  params.set('primary', resolvedColors.primary);
  params.set('alternate', resolvedColors.alternate);

  return `${origin}${pathname}?${params.toString()}`;
};

export const COUNTDOWN_DEFAULT_SETTINGS = {
  mode: 'all',
  frame: false,
  labels: true,
};

export const DOTS_DEFAULT_SETTINGS = {
  shape: 'circle',
  triangleMode: 'upright',
  triangleAngle: 0,
  gapX: 0.5,
  gapY: 0.5,
  inset: 0.5,
  outerX: 0,
  outerY: 0,
};

export const PIE_DEFAULT_SETTINGS = {
  shape: 'circle',
  style: 'filled',
  fullScreen: false,
  decimals: 2,
  inset: 0,
  outerX: 0,
  outerY: 0,
};

export const PROGRESS_DEFAULT_SETTINGS = {
  mode: 'field',
  fullScreen: true,
  decimals: 2,
  fontSize: 1,
  lineWidth: 12,
  inset: 0,
  outerX: 0,
  outerY: 0,
};

export const VIEW_COLOR_SETTINGS = {
  primary: 'primary',
  alternate: 'alternate',
};

export { VIEW_COLOR_PRESETS, getDefaultViewColors };

const clampNumber = (value, min, max, fallback) => {
  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
};

const getResolvedColorSettings = (searchParams, theme) => {
  return resolveViewColors({
    theme,
    primary: searchParams.get(VIEW_COLOR_SETTINGS.primary),
    alternate: searchParams.get(VIEW_COLOR_SETTINGS.alternate),
  });
};

export const normalizeColorSettingValue = (key, value, theme) => {
  const defaults = getDefaultViewColors(theme);

  if (key === VIEW_COLOR_SETTINGS.primary) {
    return normalizeHexColor(value, defaults.primary);
  }

  if (key === VIEW_COLOR_SETTINGS.alternate) {
    return normalizeHexColor(value, defaults.alternate);
  }

  return value;
};

export const normalizeCountdownSettingValue = (key, value, theme) => {
  switch (key) {
    case 'mode':
      return ['all', 'days', 'hours', 'minutes', 'seconds'].includes(value) ? value : COUNTDOWN_DEFAULT_SETTINGS.mode;
    case 'frame':
    case 'labels':
      return value === true || value === 'true';
    case VIEW_COLOR_SETTINGS.primary:
    case VIEW_COLOR_SETTINGS.alternate:
      return normalizeColorSettingValue(key, value, theme);
    default:
      return value;
  }
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
    case 'gapX':
      return clampNumber(value, 0, 8, DOTS_DEFAULT_SETTINGS.gapX);
    case 'gapY':
      return clampNumber(value, 0, 8, DOTS_DEFAULT_SETTINGS.gapY);
    case 'inset':
      return clampNumber(value, 0, 12, DOTS_DEFAULT_SETTINGS.inset);
    case 'outerX':
      return clampNumber(value, 0, 12, DOTS_DEFAULT_SETTINGS.outerX);
    case 'outerY':
      return clampNumber(value, 0, 12, DOTS_DEFAULT_SETTINGS.outerY);
    default:
      return value;
  }
};

export const normalizeDotsSettingValueWithTheme = (key, value, theme) => {
  if (key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate) {
    return normalizeColorSettingValue(key, value, theme);
  }

  return normalizeDotsSettingValue(key, value);
};

export const normalizePieSettingValue = (key, value) => {
  switch (key) {
    case 'shape':
      return ['circle', 'rectangle'].includes(value) ? value : PIE_DEFAULT_SETTINGS.shape;
    case 'style':
      return ['filled', 'outline'].includes(value) ? value : PIE_DEFAULT_SETTINGS.style;
    case 'fullScreen':
      return value === true || value === 'true';
    case 'decimals':
      return clampNumber(value, 0, 10, PIE_DEFAULT_SETTINGS.decimals);
    case 'inset':
      return clampNumber(value, 0, 12, PIE_DEFAULT_SETTINGS.inset);
    case 'outerX':
      return clampNumber(value, 0, 12, PIE_DEFAULT_SETTINGS.outerX);
    case 'outerY':
      return clampNumber(value, 0, 12, PIE_DEFAULT_SETTINGS.outerY);
    default:
      return value;
  }
};

export const normalizePieSettingValueWithTheme = (key, value, theme) => {
  if (key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate) {
    return normalizeColorSettingValue(key, value, theme);
  }

  return normalizePieSettingValue(key, value);
};

export const normalizeProgressSettingValue = (key, value) => {
  switch (key) {
    case 'mode':
      return ['field', 'line'].includes(value) ? value : PROGRESS_DEFAULT_SETTINGS.mode;
    case 'fullScreen':
      return value === true || value === 'true';
    case 'decimals':
      return clampNumber(value, 0, 10, PROGRESS_DEFAULT_SETTINGS.decimals);
    case 'fontSize':
      return clampNumber(value, 0.6, 2.5, PROGRESS_DEFAULT_SETTINGS.fontSize);
    case 'lineWidth':
      return clampNumber(value, 2, 80, PROGRESS_DEFAULT_SETTINGS.lineWidth);
    case 'inset':
      return clampNumber(value, 0, 12, PROGRESS_DEFAULT_SETTINGS.inset);
    case 'outerX':
      return clampNumber(value, 0, 12, PROGRESS_DEFAULT_SETTINGS.outerX);
    case 'outerY':
      return clampNumber(value, 0, 12, PROGRESS_DEFAULT_SETTINGS.outerY);
    default:
      return value;
  }
};

export const normalizeProgressSettingValueWithTheme = (key, value, theme) => {
  if (key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate) {
    return normalizeColorSettingValue(key, value, theme);
  }

  return normalizeProgressSettingValue(key, value);
};

export const getCountdownSettingsFromSearchParams = (searchParams, theme) => {
  const mode = searchParams.get('mode');
  const frame = searchParams.get('frame');
  const labels = searchParams.get('labels');
  const colors = getResolvedColorSettings(searchParams, theme);

  return {
    mode: ['all', 'days', 'hours', 'minutes', 'seconds'].includes(mode)
      ? mode
      : COUNTDOWN_DEFAULT_SETTINGS.mode,
    frame: frame === 'false' ? false : COUNTDOWN_DEFAULT_SETTINGS.frame,
    labels: labels === 'false' ? false : COUNTDOWN_DEFAULT_SETTINGS.labels,
    ...colors,
  };
};

export const getDotsSettingsFromSearchParams = (searchParams, theme) => {
  const shape = searchParams.get('shape');
  const triangleMode = searchParams.get('triangleMode');
  const legacyGap = searchParams.get('gap');
  const colors = getResolvedColorSettings(searchParams, theme);

  return {
    shape: ['circle', 'square', 'triangle'].includes(shape) ? shape : DOTS_DEFAULT_SETTINGS.shape,
    triangleMode: ['upright', 'inverted', 'alternating', 'angle'].includes(triangleMode)
      ? triangleMode
      : DOTS_DEFAULT_SETTINGS.triangleMode,
    triangleAngle: clampNumber(searchParams.get('triangleAngle'), 0, 360, DOTS_DEFAULT_SETTINGS.triangleAngle),
    gapX: clampNumber(searchParams.get('gapX') ?? legacyGap, 0, 8, DOTS_DEFAULT_SETTINGS.gapX),
    gapY: clampNumber(searchParams.get('gapY') ?? legacyGap, 0, 8, DOTS_DEFAULT_SETTINGS.gapY),
    inset: clampNumber(searchParams.get('inset'), 0, 12, DOTS_DEFAULT_SETTINGS.inset),
    outerX: clampNumber(searchParams.get('outerX'), 0, 12, DOTS_DEFAULT_SETTINGS.outerX),
    outerY: clampNumber(searchParams.get('outerY'), 0, 12, DOTS_DEFAULT_SETTINGS.outerY),
    ...colors,
  };
};

export const getPieSettingsFromSearchParams = (searchParams, theme) => {
  const shape = searchParams.get('shape');
  const style = searchParams.get('style');
  const fullScreen = searchParams.get('fullScreen');
  const colors = getResolvedColorSettings(searchParams, theme);

  return {
    shape: ['circle', 'rectangle'].includes(shape) ? shape : PIE_DEFAULT_SETTINGS.shape,
    style: ['filled', 'outline'].includes(style) ? style : PIE_DEFAULT_SETTINGS.style,
    fullScreen: fullScreen === 'true' ? true : PIE_DEFAULT_SETTINGS.fullScreen,
    decimals: clampNumber(searchParams.get('decimals'), 0, 10, PIE_DEFAULT_SETTINGS.decimals),
    inset: clampNumber(searchParams.get('inset'), 0, 12, PIE_DEFAULT_SETTINGS.inset),
    outerX: clampNumber(searchParams.get('outerX'), 0, 12, PIE_DEFAULT_SETTINGS.outerX),
    outerY: clampNumber(searchParams.get('outerY'), 0, 12, PIE_DEFAULT_SETTINGS.outerY),
    ...colors,
  };
};

export const getProgressSettingsFromSearchParams = (searchParams, theme) => {
  const mode = searchParams.get('mode');
  const fullScreen = searchParams.get('fullScreen');
  const colors = getResolvedColorSettings(searchParams, theme);

  return {
    mode: ['field', 'line'].includes(mode) ? mode : PROGRESS_DEFAULT_SETTINGS.mode,
    fullScreen: fullScreen === 'false' ? false : PROGRESS_DEFAULT_SETTINGS.fullScreen,
    decimals: clampNumber(searchParams.get('decimals'), 0, 10, PROGRESS_DEFAULT_SETTINGS.decimals),
    fontSize: clampNumber(searchParams.get('fontSize'), 0.6, 2.5, PROGRESS_DEFAULT_SETTINGS.fontSize),
    lineWidth: clampNumber(searchParams.get('lineWidth'), 2, 80, PROGRESS_DEFAULT_SETTINGS.lineWidth),
    inset: clampNumber(searchParams.get('inset'), 0, 12, PROGRESS_DEFAULT_SETTINGS.inset),
    outerX: clampNumber(searchParams.get('outerX'), 0, 12, PROGRESS_DEFAULT_SETTINGS.outerX),
    outerY: clampNumber(searchParams.get('outerY'), 0, 12, PROGRESS_DEFAULT_SETTINGS.outerY),
    ...colors,
  };
};

export const getViewLinkMeta = (pathname) => {
  return NAV_LINKS.find((link) => link.to === pathname) ?? null;
};
