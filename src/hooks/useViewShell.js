import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';
import useDeviceProfile from './useDeviceProfile';
import { readViewPreferencesCookie, writeViewPreferencesCookie } from '../lib/viewPreferences';
import {
  VIEW_BRAND_TONE_MODES,
  normalizeViewBrandToneMode,
  resolveViewBrandIconTone,
  resolveViewTextTone,
  resolveViewColors,
} from '../lib/viewColors';
import { getViewportWallpaperSize, getWallpaperUrl } from '../lib/wallpaper';
import {
  ALL_DEFAULT_SETTINGS,
  COUNTDOWN_DEFAULT_SETTINGS,
  DOTS_DEFAULT_SETTINGS,
  PIE_DEFAULT_SETTINGS,
  PROGRESS_DEFAULT_SETTINGS,
  VIEW_COLOR_SETTINGS,
  VIEW_SPACING_SETTINGS,
  getAllSettingsFromSearchParams,
  getDefaultViewColors,
  getCountdownSettingsFromSearchParams,
  getDotsSettingsFromSearchParams,
  getPieSettingsFromSearchParams,
  getProgressSettingsFromSearchParams,
  getSharedViewUrl,
  getViewConfigFromPathname,
  getViewIdFromPathname,
  getViewLinkMeta,
  isEmbedMode,
  normalizeCountdownSettingValue,
  normalizeDotsSettingValueWithTheme,
  normalizeAllSettingValueWithTheme,
  normalizePieSettingValueWithTheme,
  normalizeProgressSettingValueWithTheme,
} from '../lib/viewSettings';
import { resolveTheme } from '../lib/theme';

const parseSpacingHelperInput = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed === '--') {
    return null;
  }

  const parsed = Number.parseFloat(trimmed);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
};

const SPACING_QUERY_KEYS = ['spaceTop', 'spaceRight', 'spaceBottom', 'spaceLeft', 'inset', 'outerX', 'outerY'];

const hasExplicitSpacingPreference = (searchParams, persistedSettings = {}) =>
  SPACING_QUERY_KEYS.some(
    (key) => searchParams.has(key) || Object.prototype.hasOwnProperty.call(persistedSettings, key),
  );

const applyRecommendedSpacing = ({ settings, searchParams, persistedSettings, deviceProfile }) => {
  if (!deviceProfile?.isIPhone || !deviceProfile.recommendedSpacing) {
    return settings;
  }

  if (hasExplicitSpacingPreference(searchParams, persistedSettings)) {
    return settings;
  }

  return {
    ...settings,
    ...deviceProfile.recommendedSpacing,
  };
};

const useViewShell = (themeOverride) => {
  const {
    theme: contextTheme,
    viewColors,
    setViewColors,
    viewBrandToneMode,
    setViewBrandToneMode,
    viewTextToneMode,
    setViewTextToneMode,
  } =
    useTheme();
  const deviceProfile = useDeviceProfile();
  const location = useLocation();
  const navigate = useNavigate();

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryTheme = searchParams.get('theme');
    const theme =
      queryTheme === 'light' || queryTheme === 'dark'
        ? queryTheme
        : resolveTheme(themeOverride ?? contextTheme);
    const persistedPreferences = readViewPreferencesCookie();
    const viewConfig = getViewConfigFromPathname(location.pathname);
    const themeDefaults = viewColors ?? getDefaultViewColors(theme);
    const countdown = applyRecommendedSpacing({
      settings: getCountdownSettingsFromSearchParams(
        searchParams,
        theme,
        persistedPreferences.countdown,
        themeDefaults,
      ),
      searchParams,
      persistedSettings: persistedPreferences.countdown,
      deviceProfile,
    });
    const dots = applyRecommendedSpacing({
      settings: getDotsSettingsFromSearchParams(searchParams, theme, persistedPreferences.dots, themeDefaults),
      searchParams,
      persistedSettings: persistedPreferences.dots,
      deviceProfile,
    });
    const pie = applyRecommendedSpacing({
      settings: getPieSettingsFromSearchParams(searchParams, theme, persistedPreferences.pie, themeDefaults),
      searchParams,
      persistedSettings: persistedPreferences.pie,
      deviceProfile,
    });
    const progress = applyRecommendedSpacing({
      settings: getProgressSettingsFromSearchParams(
        searchParams,
        theme,
        persistedPreferences.progress,
        themeDefaults,
      ),
      searchParams,
      persistedSettings: persistedPreferences.progress,
      deviceProfile,
    });
    const all = applyRecommendedSpacing({
      settings: getAllSettingsFromSearchParams(searchParams, theme, persistedPreferences.all, themeDefaults),
      searchParams,
      persistedSettings: persistedPreferences.all,
      deviceProfile,
    });
    const activeViewId = getViewIdFromPathname(location.pathname);
    const activeViewState = {
      countdown,
      dots,
      pie,
      progress,
      all,
    }[activeViewId];
    const appearanceBrandToneMode = normalizeViewBrandToneMode(
      searchParams.get('iconTone') ?? viewBrandToneMode,
    );
    const appearanceTextToneMode = normalizeViewBrandToneMode(
      searchParams.get('textTone') ?? viewTextToneMode,
    );
    const resolvedBrandIconTone = resolveViewBrandIconTone({
      mode: appearanceBrandToneMode,
      backgroundColor: activeViewState?.alternate ?? themeDefaults.alternate,
    });
    const resolvedTextTone = resolveViewTextTone({
      mode: appearanceTextToneMode,
      backgroundColor: activeViewState?.alternate ?? themeDefaults.alternate,
    });
    const viewportWallpaperSize = getViewportWallpaperSize(deviceProfile);

    const updateSearchParams = (entries) => {
      const nextParams = new URLSearchParams(location.search);

      entries.forEach(({ key, value, defaultValue, alwaysSet = false }) => {
        if (!alwaysSet && value === defaultValue) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(value));
        }
      });

      const nextSearch = nextParams.toString();

      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : '',
        },
        { replace: true },
      );
    };

    const updateSearchParam = (key, value, defaultValue, alwaysSet = false) => {
      updateSearchParams([{ key, value, defaultValue, alwaysSet }]);
    };

    const updateSpacingSettings = ({ nextPreferences, preferenceKey, defaults, normalizeValue, changes }) => {
      const currentSpacing = nextPreferences[preferenceKey] ?? {};
      const normalizedChanges = Object.fromEntries(
        Object.entries(changes).map(([key, value]) => [key, normalizeValue(key, value)]),
      );

      nextPreferences[preferenceKey] = {
        ...currentSpacing,
        ...normalizedChanges,
      };
      writeViewPreferencesCookie(nextPreferences);
      updateSearchParams(
        Object.entries(normalizedChanges).map(([key, value]) => ({
          key,
          value,
          defaultValue: defaults[key],
        })),
      );
    };

    const updateAppearanceColors = (nextColors) => {
      const resolvedColors = resolveViewColors({
        theme,
        primary: nextColors?.primary ?? activeViewState?.primary ?? themeDefaults.primary,
        alternate: nextColors?.alternate ?? activeViewState?.alternate ?? themeDefaults.alternate,
      });

      setViewColors(resolvedColors);
      updateSearchParams([
        { key: 'primary', value: resolvedColors.primary, defaultValue: '', alwaysSet: true },
        { key: 'alternate', value: resolvedColors.alternate, defaultValue: '', alwaysSet: true },
      ]);
    };

    const updateAppearanceBrandToneMode = (nextMode) => {
      const normalizedMode = normalizeViewBrandToneMode(nextMode);
      setViewBrandToneMode(normalizedMode);
      updateSearchParam('iconTone', normalizedMode, VIEW_BRAND_TONE_MODES.AUTO);
    };

    const updateAppearanceTextToneMode = (nextMode) => {
      const normalizedMode = normalizeViewBrandToneMode(nextMode);
      setViewTextToneMode(normalizedMode);
      updateSearchParam('textTone', normalizedMode, VIEW_BRAND_TONE_MODES.AUTO);
    };

    return {
      pathname: location.pathname,
      search: location.search,
      searchParams,
      queryTheme,
      theme,
      isEmbed: isEmbedMode(searchParams),
      viewId: activeViewId,
      viewConfig,
      viewLinkMeta: getViewLinkMeta(location.pathname),
      appearanceBrandToneMode,
      appearanceTextToneMode,
      resolvedBrandIconTone,
      resolvedTextTone,
      viewState: {
        countdown,
        dots,
        pie,
        progress,
        all,
      },
      updateAppearanceColors,
      updateAppearanceBrandToneMode,
      updateAppearanceTextToneMode,
      updateViewSetting: (viewId, key, value) => {
        const nextPreferences = {
          ...persistedPreferences,
        };

        if (viewId === 'countdown') {
          const countdownDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : COUNTDOWN_DEFAULT_SETTINGS[key];

          const normalizeValue = (targetKey, targetValue) =>
            normalizeCountdownSettingValue(targetKey, targetValue, theme);

          if (key === 'spaceAll' || key === 'spaceX' || key === 'spaceY') {
            const parsedValue = parseSpacingHelperInput(value);

            if (parsedValue === null) {
              return;
            }

            const changes =
              key === 'spaceAll'
                ? {
                    [VIEW_SPACING_SETTINGS.top]: parsedValue,
                    [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    [VIEW_SPACING_SETTINGS.left]: parsedValue,
                  }
                : key === 'spaceX'
                  ? {
                      [VIEW_SPACING_SETTINGS.left]: parsedValue,
                      [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    }
                  : {
                      [VIEW_SPACING_SETTINGS.top]: parsedValue,
                      [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    };

            updateSpacingSettings({
              nextPreferences,
              preferenceKey: 'countdown',
              defaults: COUNTDOWN_DEFAULT_SETTINGS,
              normalizeValue,
              changes,
            });
            return;
          }

          const normalizedValue = normalizeValue(key, value);
          nextPreferences.countdown = {
            ...(persistedPreferences.countdown ?? {}),
            [key]: normalizedValue,
          };
          writeViewPreferencesCookie(nextPreferences);
          updateSearchParam(key, normalizedValue, countdownDefaultValue);
          return;
        }

        if (viewId === 'dots') {
          const dotsDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : DOTS_DEFAULT_SETTINGS[key];

          const normalizeValue = (targetKey, targetValue) =>
            normalizeDotsSettingValueWithTheme(targetKey, targetValue, theme);

          if (key === 'spaceAll' || key === 'spaceX' || key === 'spaceY') {
            const parsedValue = parseSpacingHelperInput(value);

            if (parsedValue === null) {
              return;
            }

            const changes =
              key === 'spaceAll'
                ? {
                    [VIEW_SPACING_SETTINGS.top]: parsedValue,
                    [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    [VIEW_SPACING_SETTINGS.left]: parsedValue,
                  }
                : key === 'spaceX'
                  ? {
                      [VIEW_SPACING_SETTINGS.left]: parsedValue,
                      [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    }
                  : {
                      [VIEW_SPACING_SETTINGS.top]: parsedValue,
                      [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    };

            updateSpacingSettings({
              nextPreferences,
              preferenceKey: 'dots',
              defaults: DOTS_DEFAULT_SETTINGS,
              normalizeValue,
              changes,
            });
            return;
          }

          const normalizedValue = normalizeValue(key, value);
          nextPreferences.dots = {
            ...(persistedPreferences.dots ?? {}),
            [key]: normalizedValue,
          };
          writeViewPreferencesCookie(nextPreferences);
          updateSearchParam(key, normalizedValue, dotsDefaultValue);
          return;
        }

        if (viewId === 'pie') {
          const pieDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : PIE_DEFAULT_SETTINGS[key];

          const normalizeValue = (targetKey, targetValue) =>
            normalizePieSettingValueWithTheme(targetKey, targetValue, theme);

          if (key === 'spaceAll' || key === 'spaceX' || key === 'spaceY') {
            const parsedValue = parseSpacingHelperInput(value);

            if (parsedValue === null) {
              return;
            }

            const changes =
              key === 'spaceAll'
                ? {
                    [VIEW_SPACING_SETTINGS.top]: parsedValue,
                    [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    [VIEW_SPACING_SETTINGS.left]: parsedValue,
                  }
                : key === 'spaceX'
                  ? {
                      [VIEW_SPACING_SETTINGS.left]: parsedValue,
                      [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    }
                  : {
                      [VIEW_SPACING_SETTINGS.top]: parsedValue,
                      [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    };

            updateSpacingSettings({
              nextPreferences,
              preferenceKey: 'pie',
              defaults: PIE_DEFAULT_SETTINGS,
              normalizeValue,
              changes,
            });
            return;
          }

          const normalizedValue = normalizeValue(key, value);
          nextPreferences.pie = {
            ...(persistedPreferences.pie ?? {}),
            [key]: normalizedValue,
          };
          writeViewPreferencesCookie(nextPreferences);
          updateSearchParam(key, normalizedValue, pieDefaultValue);
          return;
        }

        if (viewId === 'progress') {
          const progressDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : PROGRESS_DEFAULT_SETTINGS[key];

          const normalizeValue = (targetKey, targetValue) =>
            normalizeProgressSettingValueWithTheme(targetKey, targetValue, theme);

          if (key === 'spaceAll' || key === 'spaceX' || key === 'spaceY') {
            const parsedValue = parseSpacingHelperInput(value);

            if (parsedValue === null) {
              return;
            }

            const changes =
              key === 'spaceAll'
                ? {
                    [VIEW_SPACING_SETTINGS.top]: parsedValue,
                    [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    [VIEW_SPACING_SETTINGS.left]: parsedValue,
                  }
                : key === 'spaceX'
                  ? {
                      [VIEW_SPACING_SETTINGS.left]: parsedValue,
                      [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    }
                  : {
                      [VIEW_SPACING_SETTINGS.top]: parsedValue,
                      [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    };

            updateSpacingSettings({
              nextPreferences,
              preferenceKey: 'progress',
              defaults: PROGRESS_DEFAULT_SETTINGS,
              normalizeValue,
              changes,
            });
            return;
          }

          const normalizedValue = normalizeValue(key, value);
          nextPreferences.progress = {
            ...(persistedPreferences.progress ?? {}),
            [key]: normalizedValue,
          };
          writeViewPreferencesCookie(nextPreferences);
          updateSearchParam(key, normalizedValue, progressDefaultValue);
          return;
        }

        if (viewId === 'all') {
          const allDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : ALL_DEFAULT_SETTINGS[key];

          const normalizeValue = (targetKey, targetValue) =>
            normalizeAllSettingValueWithTheme(targetKey, targetValue, theme);

          if (key === 'spaceAll' || key === 'spaceX' || key === 'spaceY') {
            const parsedValue = parseSpacingHelperInput(value);

            if (parsedValue === null) {
              return;
            }

            const changes =
              key === 'spaceAll'
                ? {
                    [VIEW_SPACING_SETTINGS.top]: parsedValue,
                    [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    [VIEW_SPACING_SETTINGS.left]: parsedValue,
                  }
                : key === 'spaceX'
                  ? {
                      [VIEW_SPACING_SETTINGS.left]: parsedValue,
                      [VIEW_SPACING_SETTINGS.right]: parsedValue,
                    }
                  : {
                      [VIEW_SPACING_SETTINGS.top]: parsedValue,
                      [VIEW_SPACING_SETTINGS.bottom]: parsedValue,
                    };

            updateSpacingSettings({
              nextPreferences,
              preferenceKey: 'all',
              defaults: ALL_DEFAULT_SETTINGS,
              normalizeValue,
              changes,
            });
            return;
          }

          const normalizedValue = normalizeValue(key, value);
          nextPreferences.all = {
            ...(persistedPreferences.all ?? {}),
            [key]: normalizedValue,
          };
          writeViewPreferencesCookie(nextPreferences);
          updateSearchParam(key, normalizedValue, allDefaultValue);
        }
      },
      sharedUrl: getSharedViewUrl({
        pathname: location.pathname,
        origin: window.location.origin,
        theme,
        viewId: activeViewId,
        viewState: activeViewState,
        colors: {
          ...activeViewState,
          brandToneMode: appearanceBrandToneMode,
          textToneMode: appearanceTextToneMode,
        },
      }),
      wallpaperUrl: getWallpaperUrl({
        viewId: activeViewId,
        theme,
        viewState: activeViewState,
        colors: activeViewState,
        textToneMode: appearanceTextToneMode,
        width: viewportWallpaperSize.width,
        height: viewportWallpaperSize.height,
      }),
      buildWallpaperUrl: ({ width, height }) =>
        getWallpaperUrl({
          viewId: activeViewId,
          theme,
          viewState: activeViewState,
          colors: activeViewState,
          textToneMode: appearanceTextToneMode,
          width,
          height,
        }),
    };
  }, [
    contextTheme,
    location.pathname,
    location.search,
    navigate,
    setViewBrandToneMode,
    setViewTextToneMode,
    setViewColors,
    themeOverride,
    viewBrandToneMode,
    viewTextToneMode,
    viewColors,
    deviceProfile,
  ]);
};

export default useViewShell;
