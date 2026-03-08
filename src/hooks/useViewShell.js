import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  COUNTDOWN_DEFAULT_SETTINGS,
  DOTS_DEFAULT_SETTINGS,
  PIE_DEFAULT_SETTINGS,
  getCountdownSettingsFromSearchParams,
  getDotsSettingsFromSearchParams,
  getPieSettingsFromSearchParams,
  getSharedViewUrl,
  getViewConfigFromPathname,
  getViewIdFromPathname,
  getViewLinkMeta,
  isEmbedMode,
  normalizeDotsSettingValue,
  normalizePieSettingValue,
} from '../lib/viewSettings';

const useViewShell = (theme) => {
  const location = useLocation();
  const navigate = useNavigate();

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const viewConfig = getViewConfigFromPathname(location.pathname);
    const countdown = getCountdownSettingsFromSearchParams(searchParams);
    const dots = getDotsSettingsFromSearchParams(searchParams);
    const pie = getPieSettingsFromSearchParams(searchParams);

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
      queryTheme: searchParams.get('theme'),
      isEmbed: isEmbedMode(searchParams),
      viewId: getViewIdFromPathname(location.pathname),
      viewConfig,
      viewLinkMeta: getViewLinkMeta(location.pathname),
      viewState: {
        countdown,
        dots,
        pie,
      },
      updateViewSetting: (viewId, key, value) => {
        if (viewId === 'countdown') {
          updateSearchParam(key, value, COUNTDOWN_DEFAULT_SETTINGS[key]);
          return;
        }

        if (viewId === 'dots') {
          updateSearchParam(key, normalizeDotsSettingValue(key, value), DOTS_DEFAULT_SETTINGS[key]);
          return;
        }

        if (viewId === 'pie') {
          updateSearchParam(key, normalizePieSettingValue(key, value), PIE_DEFAULT_SETTINGS[key]);
        }
      },
      sharedUrl: getSharedViewUrl({
        pathname: location.pathname,
        search: location.search,
        origin: window.location.origin,
        theme,
      }),
    };
  }, [location.pathname, location.search, navigate, theme]);
};

export default useViewShell;
