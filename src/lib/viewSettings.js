import { NAV_LINKS } from './navigation';
import { THEMES, resolveTheme } from './theme';

export const VIEW_SETTINGS_CONFIG = {
  countdown: {
    id: 'countdown',
    title: 'Countdown',
    controls: [],
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

export const getViewLinkMeta = (pathname) => {
  return NAV_LINKS.find((link) => link.to === pathname) ?? null;
};
