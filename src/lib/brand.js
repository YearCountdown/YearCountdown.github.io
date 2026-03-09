import { THEMES } from './theme';
import { resolveViewBrandIconTone } from './viewColors';

export const BRAND_TEXT = 'Year Countdown';

const BRAND_ASSETS = {
  icon: {
    light: '/logo/icon-light.svg',
    dark: '/logo/icon-dark.svg',
  },
  logo: {
    light: '/logo/logo-light.svg',
    dark: '/logo/logo-dark.svg',
  },
};

export const getBrandAssetForIconTone = (iconTone = 'dark', type = 'icon') => {
  const normalizedTone = iconTone === 'light' ? 'light' : 'dark';
  return BRAND_ASSETS[type]?.[normalizedTone] ?? BRAND_ASSETS.icon.dark;
};

export const getBrandAssetForTheme = (theme, type = 'icon') => {
  return getBrandAssetForIconTone(theme === THEMES.DARK ? 'light' : 'dark', type);
};

export const getBrandAssetForBackgroundColor = (backgroundColor, iconToneMode = 'auto', type = 'icon') => {
  return getBrandAssetForIconTone(
    resolveViewBrandIconTone({
      mode: iconToneMode,
      backgroundColor,
    }),
    type,
  );
};
