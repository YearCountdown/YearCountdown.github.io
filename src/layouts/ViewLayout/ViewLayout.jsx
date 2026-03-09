import { useEffect } from 'react';

import BrandLockup from '../../components/BrandLockup';
import CopyEmbedAction from '../../components/CopyEmbedAction';
import { useTheme } from '../../context/ThemeContext';
import useDeviceProfile from '../../hooks/useDeviceProfile';
import useViewShell from '../../hooks/useViewShell';
import { getThemeFromBackgroundColor, getToneColor, withAlpha } from '../../lib/viewColors';
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
    isEmbedLogoVisible,
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
    wallpaperUrl,
    buildWallpaperUrl,
  } = useViewShell(theme);
  const deviceProfile = useDeviceProfile();

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, []);

  useEffect(() => {
    const activeAlternateColor =
      viewState?.[viewId]?.alternate ?? viewColors.alternate;
    const nextTheme =
      queryTheme === 'light' || queryTheme === 'dark'
        ? queryTheme
        : getThemeFromBackgroundColor(activeAlternateColor);

    if (theme !== nextTheme) {
      setTheme(nextTheme);
    }
  }, [queryTheme, setTheme, theme, viewColors.alternate, viewId, viewState]);

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
  const activeAlternateColor = viewState?.[viewId]?.alternate ?? viewColors.alternate;
  const activeTextToneColor = getToneColor(resolvedTextTone);
  const activeSpacing = viewState?.[viewId] ?? {};
  const minViewportDimension = deviceProfile.viewport.minDimension || 0;
  const embedLogoOffsetLeft =
    8 +
    deviceProfile.safeAreaInsets.left +
    (minViewportDimension * (activeSpacing.spaceLeft ?? 0)) / 100;
  const embedLogoOffsetTop =
    8 +
    deviceProfile.safeAreaInsets.top +
    (minViewportDimension * (activeSpacing.spaceTop ?? 0)) / 100;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-stone-100 text-black dark:bg-zinc-950 dark:text-white">
      {!isEmbed ? <Header variant="view" /> : null}
      <main
        className={`flex h-screen min-h-screen items-center justify-center overflow-hidden ${mainClassName}`}
      >
        {children}
      </main>
      {isEmbed && isEmbedLogoVisible ? (
        <div
          className="pointer-events-none fixed z-30"
          style={{
            left: `${embedLogoOffsetLeft}px`,
            top: `${embedLogoOffsetTop}px`,
          }}
        >
          <BrandLockup
            iconOnly
            compact
            colorMode="color"
            iconToneMode={resolvedBrandIconTone}
            className="pointer-events-auto rounded-full p-2 shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            style={{
              backgroundColor: withAlpha(activeAlternateColor, 0.62),
              border: `1px solid ${withAlpha(activeTextToneColor, 0.12)}`,
            }}
            textClassName="hidden"
          />
        </div>
      ) : null}
      {!isEmbed ? (
        <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
          <CopyEmbedAction
            sharedUrl={sharedUrl}
            variant="floating"
            backgroundColor={activeAlternateColor}
            toneColor={activeTextToneColor}
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
        wallpaperUrl={wallpaperUrl}
        buildWallpaperUrl={buildWallpaperUrl}
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
