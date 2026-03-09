const IPHONE_SCREEN_PROFILES = [
  {
    key: 'iphone-se-classic',
    screen: { width: 320, height: 568, dpr: 2 },
    wallpaper: { width: 640, height: 1136 },
    spacing: { spaceTop: 4, spaceRight: 4, spaceBottom: 4, spaceLeft: 4 },
  },
  {
    key: 'iphone-se-modern',
    screen: { width: 375, height: 667, dpr: 2 },
    wallpaper: { width: 750, height: 1334 },
    spacing: { spaceTop: 4, spaceRight: 4, spaceBottom: 4, spaceLeft: 4 },
  },
  {
    key: 'iphone-plus-legacy',
    screen: { width: 414, height: 736, dpr: 3 },
    wallpaper: { width: 1242, height: 2208 },
    spacing: { spaceTop: 4, spaceRight: 4, spaceBottom: 4, spaceLeft: 4 },
  },
  {
    key: 'iphone-x-mini',
    screen: { width: 375, height: 812, dpr: 3 },
    wallpaper: { width: 1125, height: 2436 },
    spacing: { spaceTop: 7, spaceRight: 4, spaceBottom: 5, spaceLeft: 4 },
  },
  {
    key: 'iphone-xr-11',
    screen: { width: 414, height: 896, dpr: 2 },
    wallpaper: { width: 828, height: 1792 },
    spacing: { spaceTop: 6, spaceRight: 4, spaceBottom: 5, spaceLeft: 4 },
  },
  {
    key: 'iphone-xs-11-pro-max',
    screen: { width: 414, height: 896, dpr: 3 },
    wallpaper: { width: 1242, height: 2688 },
    spacing: { spaceTop: 6, spaceRight: 4, spaceBottom: 5, spaceLeft: 4 },
  },
  {
    key: 'iphone-12-14',
    screen: { width: 390, height: 844, dpr: 3 },
    wallpaper: { width: 1170, height: 2532 },
    spacing: { spaceTop: 7, spaceRight: 4, spaceBottom: 5, spaceLeft: 4 },
  },
  {
    key: 'iphone-14-15-pro',
    screen: { width: 393, height: 852, dpr: 3 },
    wallpaper: { width: 1179, height: 2556 },
    spacing: { spaceTop: 8, spaceRight: 4, spaceBottom: 5, spaceLeft: 4 },
  },
  {
    key: 'iphone-16-pro',
    screen: { width: 402, height: 874, dpr: 3 },
    wallpaper: { width: 1206, height: 2622 },
    spacing: { spaceTop: 8, spaceRight: 4, spaceBottom: 5, spaceLeft: 4 },
  },
  {
    key: 'iphone-plus-max',
    screen: { width: 428, height: 926, dpr: 3 },
    wallpaper: { width: 1284, height: 2778 },
    spacing: { spaceTop: 7, spaceRight: 4, spaceBottom: 5, spaceLeft: 4 },
  },
  {
    key: 'iphone-15-16-plus-max',
    screen: { width: 430, height: 932, dpr: 3 },
    wallpaper: { width: 1290, height: 2796 },
    spacing: { spaceTop: 7, spaceRight: 4, spaceBottom: 5, spaceLeft: 4 },
  },
  {
    key: 'iphone-16-pro-max',
    screen: { width: 440, height: 956, dpr: 3 },
    wallpaper: { width: 1320, height: 2868 },
    spacing: { spaceTop: 8, spaceRight: 4, spaceBottom: 5, spaceLeft: 4 },
  },
];

const sortPair = (first, second) => [Math.min(first, second), Math.max(first, second)];

export const isLikelyIPhone = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const ua = window.navigator.userAgent ?? '';
  const platform = window.navigator.platform ?? '';
  const touchPoints = window.navigator.maxTouchPoints ?? 0;

  if (/iPhone/i.test(ua)) {
    return true;
  }

  return /Mac/i.test(platform) && touchPoints > 1 && /Mobile/i.test(ua);
};

export const getSafeAreaInsets = () => {
  if (typeof document === 'undefined') {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  }

  const probe = document.createElement('div');
  probe.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    'visibility:hidden',
    'pointer-events:none',
    'padding-top:env(safe-area-inset-top)',
    'padding-right:env(safe-area-inset-right)',
    'padding-bottom:env(safe-area-inset-bottom)',
    'padding-left:env(safe-area-inset-left)',
  ].join(';');

  document.body.appendChild(probe);
  const styles = window.getComputedStyle(probe);
  const insets = {
    top: Number.parseFloat(styles.paddingTop) || 0,
    right: Number.parseFloat(styles.paddingRight) || 0,
    bottom: Number.parseFloat(styles.paddingBottom) || 0,
    left: Number.parseFloat(styles.paddingLeft) || 0,
  };
  document.body.removeChild(probe);

  return insets;
};

const getMatchingIPhoneProfile = ({ screenWidth, screenHeight, dpr }) => {
  const [minScreen, maxScreen] = sortPair(screenWidth, screenHeight);

  return (
    IPHONE_SCREEN_PROFILES.find((profile) => {
      const [profileMin, profileMax] = sortPair(profile.screen.width, profile.screen.height);

      return profileMin === minScreen && profileMax === maxScreen && profile.screen.dpr === dpr;
    }) ?? null
  );
};

const getFallbackIPhoneWallpaperSize = ({ viewportWidth, viewportHeight, dpr }) => ({
  width: Math.round(viewportWidth * dpr),
  height: Math.round(viewportHeight * dpr),
});

const getFallbackIPhoneSpacing = (safeAreaInsets, minDimension) => {
  const sideBase = minDimension <= 375 ? 4 : 3.5;
  const bottomBase = minDimension <= 375 ? 5 : 4.5;
  const topBase = safeAreaInsets.top > 0 ? 7 : 4;

  return {
    spaceTop: topBase,
    spaceRight: sideBase,
    spaceBottom: bottomBase,
    spaceLeft: sideBase,
  };
};

export const getDeviceProfileSnapshot = () => {
  if (typeof window === 'undefined') {
    return {
      isIPhone: false,
      wallpaperSize: null,
      recommendedSpacing: null,
      safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
      viewport: { width: 0, height: 0, minDimension: 0 },
      profileKey: null,
    };
  }

  const viewportWidth = Math.round(window.visualViewport?.width ?? window.innerWidth ?? 0);
  const viewportHeight = Math.round(window.visualViewport?.height ?? window.innerHeight ?? 0);
  const screenWidth = Math.round(window.screen?.width ?? viewportWidth);
  const screenHeight = Math.round(window.screen?.height ?? viewportHeight);
  const dpr = window.devicePixelRatio ?? 1;
  const safeAreaInsets = getSafeAreaInsets();
  const minDimension = Math.min(viewportWidth, viewportHeight);
  const iphone = isLikelyIPhone();

  if (!iphone) {
    return {
      isIPhone: false,
      wallpaperSize: null,
      recommendedSpacing: null,
      safeAreaInsets,
      viewport: {
        width: viewportWidth,
        height: viewportHeight,
        minDimension,
      },
      profileKey: null,
    };
  }

  const matchedProfile = getMatchingIPhoneProfile({
    screenWidth,
    screenHeight,
    dpr,
  });

  return {
    isIPhone: true,
    wallpaperSize:
      matchedProfile?.wallpaper ??
      getFallbackIPhoneWallpaperSize({
        viewportWidth,
        viewportHeight,
        dpr,
      }),
    recommendedSpacing:
      matchedProfile?.spacing ?? getFallbackIPhoneSpacing(safeAreaInsets, minDimension),
    safeAreaInsets,
    viewport: {
      width: viewportWidth,
      height: viewportHeight,
      minDimension,
    },
    profileKey: matchedProfile?.key ?? 'iphone-fallback',
  };
};
