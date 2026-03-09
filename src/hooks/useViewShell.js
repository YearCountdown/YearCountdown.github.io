import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';
import { readViewPreferencesCookie, writeViewPreferencesCookie } from '../lib/viewPreferences';
import {
  COUNTDOWN_DEFAULT_SETTINGS,
  DOTS_DEFAULT_SETTINGS,
  PIE_DEFAULT_SETTINGS,
  PROGRESS_DEFAULT_SETTINGS,
  VIEW_COLOR_SETTINGS,
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
  normalizePieSettingValueWithTheme,
  normalizeProgressSettingValueWithTheme,
} from '../lib/viewSettings';
import { resolveTheme } from '../lib/theme';

const useViewShell = (themeOverride) => {
  const { theme: contextTheme, viewColors, colorMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryTheme = searchParams.get('theme');
    const theme = resolveTheme(themeOverride ?? contextTheme);
    const persistedPreferences = readViewPreferencesCookie();
    const viewConfig = getViewConfigFromPathname(location.pathname);
    const themeDefaults = viewColors ?? getDefaultViewColors(theme);
    const countdown = getCountdownSettingsFromSearchParams(
      searchParams,
      theme,
      persistedPreferences.countdown,
      themeDefaults,
    );
    const dots = getDotsSettingsFromSearchParams(searchParams, theme, persistedPreferences.dots, themeDefaults);
    const pie = getPieSettingsFromSearchParams(searchParams, theme, persistedPreferences.pie, themeDefaults);
    const progress = getProgressSettingsFromSearchParams(
      searchParams,
      theme,
      persistedPreferences.progress,
      themeDefaults,
    );

    const updateSearchParam = (key, value, defaultValue) => {
      const nextParams = new URLSearchParams(location.search);

      if (value === defaultValue) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }

      const nextSearch = nextParams.toString();

      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : '',
        },
        { replace: true },
      );
    };

    return {
      pathname: location.pathname,
      search: location.search,
      searchParams,
      queryTheme,
      isEmbed: isEmbedMode(searchParams),
      viewId: getViewIdFromPathname(location.pathname),
      viewConfig,
      viewLinkMeta: getViewLinkMeta(location.pathname),
      viewState: {
        countdown,
        dots,
        pie,
        progress,
      },
      updateViewSetting: (viewId, key, value) => {
        const nextPreferences = {
          ...persistedPreferences,
        };

        if (viewId === 'countdown') {
          const countdownDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : COUNTDOWN_DEFAULT_SETTINGS[key];

          const normalizedValue = normalizeCountdownSettingValue(key, value, theme);
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

          const normalizedValue = normalizeDotsSettingValueWithTheme(key, value, theme);
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

          const normalizedValue = normalizePieSettingValueWithTheme(key, value, theme);
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

          const normalizedValue = normalizeProgressSettingValueWithTheme(key, value, theme);
          nextPreferences.progress = {
            ...(persistedPreferences.progress ?? {}),
            [key]: normalizedValue,
          };
          writeViewPreferencesCookie(nextPreferences);
          updateSearchParam(key, normalizedValue, progressDefaultValue);
        }
      },
      sharedUrl: getSharedViewUrl({
        pathname: location.pathname,
        origin: window.location.origin,
        theme,
        colorMode,
        viewId: getViewIdFromPathname(location.pathname),
        viewState: {
          countdown,
          dots,
          pie,
          progress,
        }[getViewIdFromPathname(location.pathname)],
        colors: {
          countdown,
          dots,
          pie,
          progress,
        }[getViewIdFromPathname(location.pathname)],
      }),
    };
  }, [colorMode, contextTheme, location.pathname, location.search, navigate, themeOverride, viewColors]);
};

export default useViewShell;
