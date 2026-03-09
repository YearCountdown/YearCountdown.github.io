import { NAV_LINKS } from './navigation';
import { THEMES, resolveTheme } from './theme';
import {
  VIEW_BRAND_TONE_MODES,
  getDefaultViewColors,
  normalizeViewBrandToneMode,
  resolveViewColors,
} from './viewColors';

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
      {
        key: 'fontSize',
        type: 'range',
        label: 'Font Size',
        min: 0.1,
        max: 2.5,
        step: 0.1,
        suffix: 'x',
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
        key: 'inactiveOpacity',
        type: 'range',
        label: 'Inactive Opacity',
        min: 0,
        max: 100,
        step: 1,
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
        type: 'range',
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
        type: 'range',
        label: 'Decimals',
        min: 0,
        max: 10,
        step: 1,
      },
      {
        key: 'fontSize',
        type: 'range',
        label: 'Font Size',
        min: 0.6,
        max: 2.5,
        step: 0.1,
        suffix: 'x',
      },
      {
        key: 'lineWidth',
        type: 'range',
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

export const getSharedViewUrl = ({ pathname, origin, theme, viewId, viewState, colors }) => {
  const currentTheme = resolveTheme(theme);
  const params = new URLSearchParams();
  const resolvedColors = resolveViewColors({
    theme: currentTheme,
    primary: colors?.primary,
    alternate: colors?.alternate,
  });

  if (viewId === 'countdown' && viewState) {
    if (viewState.mode !== COUNTDOWN_DEFAULT_SETTINGS.mode) {
      params.set('mode', viewState.mode);
    }
    if (viewState.frame !== COUNTDOWN_DEFAULT_SETTINGS.frame) {
      params.set('frame', String(viewState.frame));
    }
    if (viewState.labels !== COUNTDOWN_DEFAULT_SETTINGS.labels) {
      params.set('labels', String(viewState.labels));
    }
    if (viewState.fontSize !== COUNTDOWN_DEFAULT_SETTINGS.fontSize) {
      params.set('fontSize', String(viewState.fontSize));
    }
  }

  if (viewId === 'dots' && viewState) {
    if (viewState.shape !== DOTS_DEFAULT_SETTINGS.shape) {
      params.set('shape', viewState.shape);
    }
    if (viewState.triangleMode !== DOTS_DEFAULT_SETTINGS.triangleMode) {
      params.set('triangleMode', viewState.triangleMode);
    }
    if (viewState.triangleAngle !== DOTS_DEFAULT_SETTINGS.triangleAngle) {
      params.set('triangleAngle', String(viewState.triangleAngle));
    }
    if (viewState.gapX !== DOTS_DEFAULT_SETTINGS.gapX) {
      params.set('gapX', String(viewState.gapX));
    }
    if (viewState.gapY !== DOTS_DEFAULT_SETTINGS.gapY) {
      params.set('gapY', String(viewState.gapY));
    }
    if (viewState.inactiveOpacity !== DOTS_DEFAULT_SETTINGS.inactiveOpacity) {
      params.set('inactiveOpacity', String(viewState.inactiveOpacity));
    }
    if (viewState.inset !== DOTS_DEFAULT_SETTINGS.inset) {
      params.set('inset', String(viewState.inset));
    }
    if (viewState.outerX !== DOTS_DEFAULT_SETTINGS.outerX) {
      params.set('outerX', String(viewState.outerX));
    }
    if (viewState.outerY !== DOTS_DEFAULT_SETTINGS.outerY) {
      params.set('outerY', String(viewState.outerY));
    }
  }

  if (viewId === 'pie' && viewState) {
    if (viewState.shape !== PIE_DEFAULT_SETTINGS.shape) {
      params.set('shape', viewState.shape);
    }
    if (viewState.style !== PIE_DEFAULT_SETTINGS.style) {
      params.set('style', viewState.style);
    }
    if (viewState.fullScreen !== PIE_DEFAULT_SETTINGS.fullScreen) {
      params.set('fullScreen', String(viewState.fullScreen));
    }
    if (viewState.decimals !== PIE_DEFAULT_SETTINGS.decimals) {
      params.set('decimals', String(viewState.decimals));
    }
    if (viewState.inset !== PIE_DEFAULT_SETTINGS.inset) {
      params.set('inset', String(viewState.inset));
    }
    if (viewState.outerX !== PIE_DEFAULT_SETTINGS.outerX) {
      params.set('outerX', String(viewState.outerX));
    }
    if (viewState.outerY !== PIE_DEFAULT_SETTINGS.outerY) {
      params.set('outerY', String(viewState.outerY));
    }
  }

  if (viewId === 'progress' && viewState) {
    if (viewState.mode !== PROGRESS_DEFAULT_SETTINGS.mode) {
      params.set('mode', viewState.mode);
    }
    if (viewState.fullScreen !== PROGRESS_DEFAULT_SETTINGS.fullScreen) {
      params.set('fullScreen', String(viewState.fullScreen));
    }
    if (viewState.decimals !== PROGRESS_DEFAULT_SETTINGS.decimals) {
      params.set('decimals', String(viewState.decimals));
    }
    if (viewState.fontSize !== PROGRESS_DEFAULT_SETTINGS.fontSize) {
      params.set('fontSize', String(viewState.fontSize));
    }
    if (viewState.lineWidth !== PROGRESS_DEFAULT_SETTINGS.lineWidth) {
      params.set('lineWidth', String(viewState.lineWidth));
    }
    if (viewState.inset !== PROGRESS_DEFAULT_SETTINGS.inset) {
      params.set('inset', String(viewState.inset));
    }
    if (viewState.outerX !== PROGRESS_DEFAULT_SETTINGS.outerX) {
      params.set('outerX', String(viewState.outerX));
    }
    if (viewState.outerY !== PROGRESS_DEFAULT_SETTINGS.outerY) {
      params.set('outerY', String(viewState.outerY));
    }
  }

  params.set('embed', 'true');
  params.set('theme', currentTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT);
  params.set('primary', resolvedColors.primary);
  params.set('alternate', resolvedColors.alternate);
  if (normalizeViewBrandToneMode(colors?.brandToneMode) !== VIEW_BRAND_TONE_MODES.AUTO) {
    params.set('iconTone', normalizeViewBrandToneMode(colors?.brandToneMode));
  }
  if (normalizeViewBrandToneMode(colors?.textToneMode) !== VIEW_BRAND_TONE_MODES.AUTO) {
    params.set('textTone', normalizeViewBrandToneMode(colors?.textToneMode));
  }

  return `${origin}${pathname}?${params.toString()}`;
};

export const COUNTDOWN_DEFAULT_SETTINGS = {
  mode: 'all',
  frame: false,
  labels: true,
  fontSize: 1,
};

export const DOTS_DEFAULT_SETTINGS = {
  shape: 'circle',
  triangleMode: 'upright',
  triangleAngle: 0,
  gapX: 0.5,
  gapY: 0.5,
  inactiveOpacity: 5,
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

export { getDefaultViewColors };

const clampNumber = (value, min, max, fallback) => {
  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
};

const getResolvedColorSettings = (searchParams, theme, fallbackColors) => {
  return resolveViewColors({
    theme,
    primary: searchParams.get(VIEW_COLOR_SETTINGS.primary) ?? fallbackColors?.primary,
    alternate: searchParams.get(VIEW_COLOR_SETTINGS.alternate) ?? fallbackColors?.alternate,
  });
};

export const normalizeColorSettingValue = (key, value, theme) => {
  const defaults = getDefaultViewColors(theme);

  if (key === VIEW_COLOR_SETTINGS.primary) {
    return resolveViewColors({
      theme,
      primary: value,
      alternate: defaults.alternate,
    }).primary;
  }

  if (key === VIEW_COLOR_SETTINGS.alternate) {
    return resolveViewColors({
      theme,
      primary: defaults.primary,
      alternate: value,
    }).alternate;
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
    case 'fontSize':
      return clampNumber(value, 0.1, 2.5, COUNTDOWN_DEFAULT_SETTINGS.fontSize);
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
    case 'inactiveOpacity':
      return clampNumber(value, 0, 100, DOTS_DEFAULT_SETTINGS.inactiveOpacity);
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

export const getCountdownSettingsFromSearchParams = (searchParams, theme, persistedSettings = {}, fallbackColors) => {
  const mode = searchParams.get('mode') ?? persistedSettings.mode;
  const frame = searchParams.get('frame') ?? persistedSettings.frame;
  const labels = searchParams.get('labels') ?? persistedSettings.labels;
  const colors = getResolvedColorSettings(searchParams, theme, fallbackColors);

  return {
    mode: ['all', 'days', 'hours', 'minutes', 'seconds'].includes(mode)
      ? mode
      : COUNTDOWN_DEFAULT_SETTINGS.mode,
    frame:
      frame === 'true' || frame === true
        ? true
        : frame === 'false' || frame === false
          ? false
          : COUNTDOWN_DEFAULT_SETTINGS.frame,
    labels:
      labels === 'true' || labels === true
        ? true
        : labels === 'false' || labels === false
          ? false
          : COUNTDOWN_DEFAULT_SETTINGS.labels,
    fontSize: clampNumber(
      searchParams.get('fontSize') ?? persistedSettings.fontSize,
      0.1,
      2.5,
      COUNTDOWN_DEFAULT_SETTINGS.fontSize,
    ),
    ...colors,
  };
};

export const getDotsSettingsFromSearchParams = (searchParams, theme, persistedSettings = {}, fallbackColors) => {
  const shape = searchParams.get('shape') ?? persistedSettings.shape;
  const triangleMode = searchParams.get('triangleMode') ?? persistedSettings.triangleMode;
  const legacyGap = searchParams.get('gap');
  const colors = getResolvedColorSettings(searchParams, theme, fallbackColors);

  return {
    shape: ['circle', 'square', 'triangle'].includes(shape) ? shape : DOTS_DEFAULT_SETTINGS.shape,
    triangleMode: ['upright', 'inverted', 'alternating', 'angle'].includes(triangleMode)
      ? triangleMode
      : DOTS_DEFAULT_SETTINGS.triangleMode,
    triangleAngle: clampNumber(
      searchParams.get('triangleAngle') ?? persistedSettings.triangleAngle,
      0,
      360,
      DOTS_DEFAULT_SETTINGS.triangleAngle,
    ),
    gapX: clampNumber(
      searchParams.get('gapX') ?? legacyGap ?? persistedSettings.gapX,
      0,
      8,
      DOTS_DEFAULT_SETTINGS.gapX,
    ),
    gapY: clampNumber(
      searchParams.get('gapY') ?? legacyGap ?? persistedSettings.gapY,
      0,
      8,
      DOTS_DEFAULT_SETTINGS.gapY,
    ),
    inactiveOpacity: clampNumber(
      searchParams.get('inactiveOpacity') ?? persistedSettings.inactiveOpacity,
      0,
      100,
      DOTS_DEFAULT_SETTINGS.inactiveOpacity,
    ),
    inset: clampNumber(searchParams.get('inset') ?? persistedSettings.inset, 0, 12, DOTS_DEFAULT_SETTINGS.inset),
    outerX: clampNumber(searchParams.get('outerX') ?? persistedSettings.outerX, 0, 12, DOTS_DEFAULT_SETTINGS.outerX),
    outerY: clampNumber(searchParams.get('outerY') ?? persistedSettings.outerY, 0, 12, DOTS_DEFAULT_SETTINGS.outerY),
    ...colors,
  };
};

export const getPieSettingsFromSearchParams = (searchParams, theme, persistedSettings = {}, fallbackColors) => {
  const shape = searchParams.get('shape') ?? persistedSettings.shape;
  const style = searchParams.get('style') ?? persistedSettings.style;
  const fullScreen = searchParams.get('fullScreen') ?? persistedSettings.fullScreen;
  const colors = getResolvedColorSettings(searchParams, theme, fallbackColors);

  return {
    shape: ['circle', 'rectangle'].includes(shape) ? shape : PIE_DEFAULT_SETTINGS.shape,
    style: ['filled', 'outline'].includes(style) ? style : PIE_DEFAULT_SETTINGS.style,
    fullScreen:
      fullScreen === 'true' || fullScreen === true
        ? true
        : fullScreen === 'false' || fullScreen === false
          ? false
          : PIE_DEFAULT_SETTINGS.fullScreen,
    decimals: clampNumber(
      searchParams.get('decimals') ?? persistedSettings.decimals,
      0,
      10,
      PIE_DEFAULT_SETTINGS.decimals,
    ),
    inset: clampNumber(searchParams.get('inset') ?? persistedSettings.inset, 0, 12, PIE_DEFAULT_SETTINGS.inset),
    outerX: clampNumber(searchParams.get('outerX') ?? persistedSettings.outerX, 0, 12, PIE_DEFAULT_SETTINGS.outerX),
    outerY: clampNumber(searchParams.get('outerY') ?? persistedSettings.outerY, 0, 12, PIE_DEFAULT_SETTINGS.outerY),
    ...colors,
  };
};

export const getProgressSettingsFromSearchParams = (searchParams, theme, persistedSettings = {}, fallbackColors) => {
  const mode = searchParams.get('mode') ?? persistedSettings.mode;
  const fullScreen = searchParams.get('fullScreen') ?? persistedSettings.fullScreen;
  const colors = getResolvedColorSettings(searchParams, theme, fallbackColors);

  return {
    mode: ['field', 'line'].includes(mode) ? mode : PROGRESS_DEFAULT_SETTINGS.mode,
    fullScreen:
      fullScreen === 'true' || fullScreen === true
        ? true
        : fullScreen === 'false' || fullScreen === false
          ? false
          : PROGRESS_DEFAULT_SETTINGS.fullScreen,
    decimals: clampNumber(
      searchParams.get('decimals') ?? persistedSettings.decimals,
      0,
      10,
      PROGRESS_DEFAULT_SETTINGS.decimals,
    ),
    fontSize: clampNumber(
      searchParams.get('fontSize') ?? persistedSettings.fontSize,
      0.6,
      2.5,
      PROGRESS_DEFAULT_SETTINGS.fontSize,
    ),
    lineWidth: clampNumber(
      searchParams.get('lineWidth') ?? persistedSettings.lineWidth,
      2,
      80,
      PROGRESS_DEFAULT_SETTINGS.lineWidth,
    ),
    inset: clampNumber(searchParams.get('inset') ?? persistedSettings.inset, 0, 12, PROGRESS_DEFAULT_SETTINGS.inset),
    outerX: clampNumber(searchParams.get('outerX') ?? persistedSettings.outerX, 0, 12, PROGRESS_DEFAULT_SETTINGS.outerX),
    outerY: clampNumber(searchParams.get('outerY') ?? persistedSettings.outerY, 0, 12, PROGRESS_DEFAULT_SETTINGS.outerY),
    ...colors,
  };
};

export const getViewLinkMeta = (pathname) => {
  return NAV_LINKS.find((link) => link.to === pathname) ?? null;
};
