import {
  COUNTDOWN_DEFAULT_SETTINGS,
  DOTS_DEFAULT_SETTINGS,
  PIE_DEFAULT_SETTINGS,
  PROGRESS_DEFAULT_SETTINGS,
} from './viewSettings';
import { THEMES, resolveTheme } from './theme';
import { VIEW_BRAND_TONE_MODES, normalizeViewBrandToneMode, resolveViewColors } from './viewColors';

export const WALLPAPER_BASE_URL = 'https://theyearcountdown.vercel.app';
export const WALLPAPER_DIMENSION_MIN = 128;
export const WALLPAPER_DIMENSION_MAX = 4096;
export const WALLPAPER_DEFAULT_SIZE = {
  width: 1080,
  height: 1920,
};

export const clampWallpaperDimension = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(WALLPAPER_DIMENSION_MAX, Math.max(WALLPAPER_DIMENSION_MIN, parsed));
};

export const getViewportWallpaperSize = () => {
  if (typeof window === 'undefined') {
    return WALLPAPER_DEFAULT_SIZE;
  }

  const width = window.visualViewport?.width ?? window.innerWidth;
  const height = window.visualViewport?.height ?? window.innerHeight;

  return {
    width: clampWallpaperDimension(Math.round(width), WALLPAPER_DEFAULT_SIZE.width),
    height: clampWallpaperDimension(Math.round(height), WALLPAPER_DEFAULT_SIZE.height),
  };
};

export const getWallpaperUrl = ({
  viewId,
  theme,
  viewState,
  colors,
  textToneMode,
  width,
  height,
}) => {
  if (!viewId || !viewState) {
    return '';
  }

  const currentTheme = resolveTheme(theme);
  const resolvedColors = resolveViewColors({
    theme: currentTheme,
    primary: colors?.primary ?? viewState.primary,
    alternate: colors?.alternate ?? viewState.alternate,
  });
  const params = new URLSearchParams();

  if (viewId === 'countdown') {
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

  if (viewId === 'dots') {
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

  if (viewId === 'pie') {
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

  if (viewId === 'progress') {
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

  params.set('theme', currentTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT);
  params.set('primary', resolvedColors.primary);
  params.set('alternate', resolvedColors.alternate);
  params.set('width', String(clampWallpaperDimension(width, WALLPAPER_DEFAULT_SIZE.width)));
  params.set('height', String(clampWallpaperDimension(height, WALLPAPER_DEFAULT_SIZE.height)));

  if (normalizeViewBrandToneMode(textToneMode) !== VIEW_BRAND_TONE_MODES.AUTO) {
    params.set('textTone', normalizeViewBrandToneMode(textToneMode));
  }

  return `${WALLPAPER_BASE_URL}/api/wallpaper/${viewId}.png?${params.toString()}`;
};
