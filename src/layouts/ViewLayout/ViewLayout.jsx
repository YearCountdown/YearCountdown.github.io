import { useEffect } from 'react';

import { useTheme } from '../../context/ThemeContext';
import useViewShell from '../../hooks/useViewShell';
import Header from '../GuestLayout/Header';
import ViewSettingsGear from '../../components/ViewSettingsGear';

const ViewLayout = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const { isEmbed, queryTheme, viewConfig, viewId, viewLinkMeta, viewState, updateViewSetting, sharedUrl } =
    useViewShell(theme);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (queryTheme === 'light' || queryTheme === 'dark') {
      setTheme(queryTheme);
    }
  }, [queryTheme, setTheme]);

  const viewTitle = viewConfig?.title ?? viewLinkMeta?.title ?? 'View';

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-stone-100 text-black dark:bg-zinc-950 dark:text-white">
      {!isEmbed ? <Header variant="view" /> : null}
      <main className="flex h-screen min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-10">
        {children}
      </main>
      <ViewSettingsGear
        viewId={viewId}
        viewTitle={viewTitle}
        sharedUrl={sharedUrl}
        isHidden={isEmbed}
        controls={viewConfig?.controls ?? []}
        viewState={viewState}
        updateViewSetting={updateViewSetting}
      />
    </div>
  );
};

export default ViewLayout;
