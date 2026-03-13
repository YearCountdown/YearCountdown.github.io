import { getSharedViewUrl } from './viewSettings';
import { resolveTheme } from './theme';
import { SYSTEM_TIMEZONE, formatTimezoneOffset } from './timeMath';
import { VIEW_BRAND_TONE_MODES, normalizeViewBrandToneMode, resolveViewColors } from './viewColors';

export const WALLPAPER_BASE_URL = 'https://pageshot.site/v1/screenshot';
export const WALLPAPER_SOURCE_ORIGIN = 'https://yearcountdown.github.io';
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

export const getViewportWallpaperSize = (deviceProfile = null) => {
  return getPreferredWallpaperSize(deviceProfile);
};

export const getPreferredWallpaperSize = (deviceProfile = null) => {
  if (typeof window === 'undefined') {
    return WALLPAPER_DEFAULT_SIZE;
  }

  if (deviceProfile?.wallpaperSize) {
    return {
      width: clampWallpaperDimension(deviceProfile.wallpaperSize.width, WALLPAPER_DEFAULT_SIZE.width),
      height: clampWallpaperDimension(deviceProfile.wallpaperSize.height, WALLPAPER_DEFAULT_SIZE.height),
    };
  }

  const width = window.visualViewport?.width ?? window.innerWidth;
  const height = window.visualViewport?.height ?? window.innerHeight;

  return {
    width: clampWallpaperDimension(Math.round(width), WALLPAPER_DEFAULT_SIZE.width),
    height: clampWallpaperDimension(Math.round(height), WALLPAPER_DEFAULT_SIZE.height),
  };
};

const getCurrentSystemTimezoneForWallpaper = () => {
  return formatTimezoneOffset(-new Date().getTimezoneOffset());
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
  const wallpaperViewState = {
    ...viewState,
    timezone:
      viewState.timezone && viewState.timezone !== SYSTEM_TIMEZONE
        ? viewState.timezone
        : getCurrentSystemTimezoneForWallpaper(),
  };
  const embedUrl = getSharedViewUrl({
    pathname: `/view/${viewId}`,
    origin: WALLPAPER_SOURCE_ORIGIN,
    theme: currentTheme,
    viewId,
    viewState: wallpaperViewState,
    colors: {
      primary: resolvedColors.primary,
      alternate: resolvedColors.alternate,
      brandToneMode: VIEW_BRAND_TONE_MODES.AUTO,
      textToneMode: normalizeViewBrandToneMode(textToneMode),
    },
  });
  const params = new URLSearchParams();

  params.set('url', embedUrl);
  params.set('width', String(clampWallpaperDimension(width, WALLPAPER_DEFAULT_SIZE.width)));
  params.set('height', String(clampWallpaperDimension(height, WALLPAPER_DEFAULT_SIZE.height)));
  params.set('format', 'png');

  return `${WALLPAPER_BASE_URL}?${params.toString()}`;
};
