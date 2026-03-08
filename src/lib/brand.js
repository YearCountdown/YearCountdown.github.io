import { THEMES } from './theme';

export const BRAND_TEXT = 'Year Countdown';

export const BRAND_ASSETS = {
  icon: {
    [THEMES.DARK]: '/logo/icon-light.svg',
    [THEMES.LIGHT]: '/logo/icon-dark.svg',
  },
  logo: {
    [THEMES.DARK]: '/logo/logo-light.svg',
    [THEMES.LIGHT]: '/logo/logo-dark.svg',
  },
};

export const getBrandAsset = (theme, type = 'icon') => {
  return BRAND_ASSETS[type]?.[theme] ?? BRAND_ASSETS.icon[THEMES.LIGHT];
};
