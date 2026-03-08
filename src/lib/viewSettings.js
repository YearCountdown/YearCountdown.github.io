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
    controls: [],
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

export const getViewLinkMeta = (pathname) => {
  return NAV_LINKS.find((link) => link.to === pathname) ?? null;
};
