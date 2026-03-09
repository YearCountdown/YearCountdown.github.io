import { useEffect } from 'react';

import BrandLockup from '../../components/BrandLockup';
import { useTheme } from '../../context/ThemeContext';
import useViewShell from '../../hooks/useViewShell';
import Header from '../GuestLayout/Header';
import ViewSettingsGear from '../../components/ViewSettingsGear';

const ViewLayout = ({ children, mainClassName = '', fullBleed = false }) => {
  const {
    theme,
    setTheme,
    viewColors,
    setViewColors,
    viewBrandToneMode,
    setViewBrandToneMode,
    viewTextToneMode,
    setViewTextToneMode,
  } = useTheme();
  const {
    isEmbed,
    queryTheme,
    appearanceBrandToneMode,
    appearanceTextToneMode,
    resolvedBrandIconTone,
    resolvedTextTone,
    viewConfig,
    viewId,
    viewLinkMeta,
    viewState,
    updateAppearanceColors,
    updateAppearanceBrandToneMode,
    updateAppearanceTextToneMode,
    updateViewSetting,
    sharedUrl,
  } = useViewShell(theme);

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

  useEffect(() => {
    if (!viewId || !viewState?.[viewId]) {
      return;
    }

    const activeColors = {
      primary: viewState[viewId].primary,
      alternate: viewState[viewId].alternate,
    };

    if (activeColors.primary !== viewColors.primary || activeColors.alternate !== viewColors.alternate) {
      setViewColors(activeColors);
    }
  }, [setViewColors, viewColors.alternate, viewColors.primary, viewId, viewState]);

  useEffect(() => {
    if (appearanceBrandToneMode !== viewBrandToneMode) {
      setViewBrandToneMode(appearanceBrandToneMode);
    }
  }, [appearanceBrandToneMode, setViewBrandToneMode, viewBrandToneMode]);

  useEffect(() => {
    if (appearanceTextToneMode !== viewTextToneMode) {
      setViewTextToneMode(appearanceTextToneMode);
    }
  }, [appearanceTextToneMode, setViewTextToneMode, viewTextToneMode]);

  const viewTitle = viewConfig?.title ?? viewLinkMeta?.title ?? 'View';

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-stone-100 text-black dark:bg-zinc-950 dark:text-white">
      {!isEmbed ? <Header variant="view" /> : null}
      <main
        className={`flex h-screen min-h-screen items-center justify-center overflow-hidden ${mainClassName}`}
      >
        {children}
      </main>
      {isEmbed ? (
        <div className="pointer-events-none fixed left-2 top-2 z-30 opacity-50 sm:left-3 sm:top-3">
          <BrandLockup
            iconOnly
            compact
            colorMode="color"
            iconToneMode={resolvedBrandIconTone}
            className="pointer-events-auto"
            textClassName="hidden"
          />
        </div>
      ) : null}
      <ViewSettingsGear
        viewId={viewId}
        viewTitle={viewTitle}
        sharedUrl={sharedUrl}
        isHidden={isEmbed}
        controls={viewConfig?.controls ?? []}
        viewState={viewState}
        updateViewSetting={updateViewSetting}
        appearanceColors={
          viewState?.[viewId]
            ? {
                primary: viewState[viewId].primary,
                alternate: viewState[viewId].alternate,
              }
            : viewColors
        }
        brandToneMode={appearanceBrandToneMode}
        textToneMode={appearanceTextToneMode}
        gearIconTone={resolvedBrandIconTone}
        resolvedTextTone={resolvedTextTone}
        onBrandToneModeChange={updateAppearanceBrandToneMode}
        onTextToneModeChange={updateAppearanceTextToneMode}
        onColorsChange={updateAppearanceColors}
      />
    </div>
  );
};

export default ViewLayout;
