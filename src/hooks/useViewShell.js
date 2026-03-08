import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import {
  getSharedViewUrl,
  getViewConfigFromPathname,
  getViewIdFromPathname,
  getViewLinkMeta,
  isEmbedMode,
} from '../lib/viewSettings';

const useViewShell = (theme) => {
  const location = useLocation();

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const viewConfig = getViewConfigFromPathname(location.pathname);

    return {
      pathname: location.pathname,
      search: location.search,
      searchParams,
      queryTheme: searchParams.get('theme'),
      isEmbed: isEmbedMode(searchParams),
      viewId: getViewIdFromPathname(location.pathname),
      viewConfig,
      viewLinkMeta: getViewLinkMeta(location.pathname),
      sharedUrl: getSharedViewUrl({
        pathname: location.pathname,
        search: location.search,
        origin: window.location.origin,
        theme,
      }),
    };
  }, [location.pathname, location.search, theme]);
};

export default useViewShell;
