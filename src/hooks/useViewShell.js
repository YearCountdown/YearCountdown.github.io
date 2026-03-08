import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';
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
  const { theme: contextTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryTheme = searchParams.get('theme');
    const theme =
      queryTheme === 'light' || queryTheme === 'dark'
        ? queryTheme
        : resolveTheme(themeOverride ?? contextTheme);
    const viewConfig = getViewConfigFromPathname(location.pathname);
    const themeDefaults = getDefaultViewColors(theme);
    const countdown = getCountdownSettingsFromSearchParams(searchParams, theme);
    const dots = getDotsSettingsFromSearchParams(searchParams, theme);
    const pie = getPieSettingsFromSearchParams(searchParams, theme);
    const progress = getProgressSettingsFromSearchParams(searchParams, theme);

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
        if (viewId === 'countdown') {
          const countdownDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : COUNTDOWN_DEFAULT_SETTINGS[key];

          updateSearchParam(key, normalizeCountdownSettingValue(key, value, theme), countdownDefaultValue);
          return;
        }

        if (viewId === 'dots') {
          const dotsDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : DOTS_DEFAULT_SETTINGS[key];

          updateSearchParam(key, normalizeDotsSettingValueWithTheme(key, value, theme), dotsDefaultValue);
          return;
        }

        if (viewId === 'pie') {
          const pieDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : PIE_DEFAULT_SETTINGS[key];

          updateSearchParam(key, normalizePieSettingValueWithTheme(key, value, theme), pieDefaultValue);
          return;
        }

        if (viewId === 'progress') {
          const progressDefaultValue =
            key === VIEW_COLOR_SETTINGS.primary || key === VIEW_COLOR_SETTINGS.alternate
              ? themeDefaults[key]
              : PROGRESS_DEFAULT_SETTINGS[key];

          updateSearchParam(
            key,
            normalizeProgressSettingValueWithTheme(key, value, theme),
            progressDefaultValue,
          );
        }
      },
      sharedUrl: getSharedViewUrl({
        pathname: location.pathname,
        search: location.search,
        origin: window.location.origin,
        theme,
      }),
    };
  }, [contextTheme, location.pathname, location.search, navigate, themeOverride]);
};

export default useViewShell;
