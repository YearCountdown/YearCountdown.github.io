import { ImageResponse } from '@vercel/og';

import { renderWallpaperView } from '../../src/lib/wallpaperRenderers';
import { clampWallpaperDimension, WALLPAPER_DEFAULT_SIZE } from '../../src/lib/wallpaper';
import {
  getCountdownSettingsFromSearchParams,
  getDefaultViewColors,
  getDotsSettingsFromSearchParams,
  getPieSettingsFromSearchParams,
  getProgressSettingsFromSearchParams,
} from '../../src/lib/viewSettings';
import { normalizeViewBrandToneMode } from '../../src/lib/viewColors';
import { resolveTheme } from '../../src/lib/theme';

const getWallpaperViewState = (viewId, searchParams, theme) => {
  const fallbackColors = getDefaultViewColors(theme);

  if (viewId === 'countdown') {
    return getCountdownSettingsFromSearchParams(searchParams, theme, {}, fallbackColors);
  }

  if (viewId === 'dots') {
    return getDotsSettingsFromSearchParams(searchParams, theme, {}, fallbackColors);
  }

  if (viewId === 'pie') {
    return getPieSettingsFromSearchParams(searchParams, theme, {}, fallbackColors);
  }

  return getProgressSettingsFromSearchParams(searchParams, theme, {}, fallbackColors);
};

export const createWallpaperHandler = (viewId) => {
  return async function handler(request) {
    const url = new URL(request.url);
    const theme = resolveTheme(url.searchParams.get('theme'));
    const width = clampWallpaperDimension(url.searchParams.get('width'), WALLPAPER_DEFAULT_SIZE.width);
    const height = clampWallpaperDimension(url.searchParams.get('height'), WALLPAPER_DEFAULT_SIZE.height);
    const viewState = getWallpaperViewState(viewId, url.searchParams, theme);
    const textToneMode = normalizeViewBrandToneMode(url.searchParams.get('textTone'));

    return new ImageResponse(
      renderWallpaperView({
        viewId,
        width,
        height,
        theme,
        viewState,
        textToneMode,
      }),
      {
        width,
        height,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  };
};
