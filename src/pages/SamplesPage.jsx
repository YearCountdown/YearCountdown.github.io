import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import BrandLockup from '../components/BrandLockup';
import CopyEmbedAction from '../components/CopyEmbedAction';
import ViewSettingsGear from '../components/ViewSettingsGear';
import AllView from '../components/views/AllView';
import CountdownView from '../components/views/CountdownView';
import DotsView from '../components/views/DotsView';
import PieView from '../components/views/PieView';
import ProgressView from '../components/views/ProgressView';
import { useTheme } from '../context/ThemeContext';
import {
  VIEW_SETTINGS_CONFIG,
  ALL_DEFAULT_SETTINGS,
  COUNTDOWN_DEFAULT_SETTINGS,
  DOTS_DEFAULT_SETTINGS,
  PIE_DEFAULT_SETTINGS,
  PROGRESS_DEFAULT_SETTINGS,
  VIEW_SPACING_SETTINGS,
  getSharedViewUrl,
  normalizeAllSettingValueWithTheme,
  normalizeCountdownSettingValue,
  normalizeDotsSettingValueWithTheme,
  normalizePieSettingValueWithTheme,
  normalizeProgressSettingValueWithTheme,
} from '../lib/viewSettings';
import { getSampleById, SAMPLE_CATEGORY_ORDER, SAMPLE_ITEMS } from '../lib/samples';
import {
  VIEW_BRAND_TONE_MODES,
  getThemeFromBackgroundColor,
  getToneColor,
  resolveViewBrandIconTone,
  resolveViewTextTone,
  resolveViewColors,
} from '../lib/viewColors';
import { getWallpaperUrl } from '../lib/wallpaper';

const CATEGORY_LABELS = {
  countdown: 'Countdown',
  dots: 'Dots',
  pie: 'Pie',
  progress: 'Progress',
  all: 'All',
};

const SearchClearButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Clear search"
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-black/56 transition-colors duration-200 hover:text-black/84 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:text-white/56 dark:hover:text-white/84 dark:focus-visible:ring-white/20"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
        <path d="M6 6l12 12M18 6 6 18" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </button>
  );
};


const ResizeHandleIcon = () => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
      <path d="M8 7 3 12l5 5M16 7l5 5-5 5M10.5 5v14M13.5 5v14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const MenuToggleButton = ({ open, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close samples menu' : 'Open samples menu'}
      aria-expanded={open}
      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-black/82 transition-opacity duration-200 hover:opacity-65 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:text-white/82 dark:focus-visible:ring-white/40 lg:hidden"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 overflow-visible fill-none stroke-current">
        <path
          d="M4 7h16"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`origin-center transition-transform duration-300 ease-out ${open ? 'translate-y-[5px] rotate-45' : ''}`}
        />
        <path
          d="M4 12h16"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`origin-center transition-all duration-300 ease-out ${open ? 'opacity-0' : 'opacity-100'}`}
        />
        <path
          d="M4 17h16"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`origin-center transition-transform duration-300 ease-out ${open ? '-translate-y-[5px] -rotate-45' : ''}`}
        />
      </svg>
    </button>
  );
};

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

const cloneSampleState = (sample) => {
  return {
    ...sample.viewState,
    primary: sample.viewState.primary,
    alternate: sample.viewState.alternate,
  };
};

const DEFAULTS_BY_VIEW = {
  countdown: COUNTDOWN_DEFAULT_SETTINGS,
  dots: DOTS_DEFAULT_SETTINGS,
  pie: PIE_DEFAULT_SETTINGS,
  progress: PROGRESS_DEFAULT_SETTINGS,
  all: ALL_DEFAULT_SETTINGS,
};

const NORMALIZE_BY_VIEW = {
  countdown: normalizeCountdownSettingValue,
  dots: normalizeDotsSettingValueWithTheme,
  pie: normalizePieSettingValueWithTheme,
  progress: normalizeProgressSettingValueWithTheme,
  all: normalizeAllSettingValueWithTheme,
};

const renderSampleView = ({ viewId, viewState, textTone }) => {
  const textToneColor = getToneColor(textTone);

  if (viewId === 'countdown') {
    return (
      <CountdownView
        mode={viewState.mode}
        frame={viewState.frame}
        labels={viewState.labels}
        fontSize={viewState.fontSize}
        spaceTop={viewState.spaceTop}
        spaceRight={viewState.spaceRight}
        spaceBottom={viewState.spaceBottom}
        spaceLeft={viewState.spaceLeft}
        primaryColor={viewState.primary}
        alternateColor={viewState.alternate}
        textToneColor={textToneColor}
      />
    );
  }

  if (viewId === 'dots') {
    return (
      <DotsView
        shape={viewState.shape}
        triangleMode={viewState.triangleMode}
        triangleAngle={viewState.triangleAngle}
        gapX={viewState.gapX}
        gapY={viewState.gapY}
        inactiveOpacity={viewState.inactiveOpacity}
        spaceTop={viewState.spaceTop}
        spaceRight={viewState.spaceRight}
        spaceBottom={viewState.spaceBottom}
        spaceLeft={viewState.spaceLeft}
        primaryColor={viewState.primary}
        alternateColor={viewState.alternate}
      />
    );
  }

  if (viewId === 'pie') {
    return (
      <PieView
        shape={viewState.shape}
        style={viewState.style}
        fullScreen={viewState.fullScreen}
        decimals={viewState.decimals}
        spaceTop={viewState.spaceTop}
        spaceRight={viewState.spaceRight}
        spaceBottom={viewState.spaceBottom}
        spaceLeft={viewState.spaceLeft}
        primaryColor={viewState.primary}
        alternateColor={viewState.alternate}
        textToneColor={textToneColor}
      />
    );
  }

  if (viewId === 'progress') {
    return (
      <ProgressView
        mode={viewState.mode}
        fullScreen={viewState.fullScreen}
        decimals={viewState.decimals}
        fontSize={viewState.fontSize}
        lineWidth={viewState.lineWidth}
        spaceTop={viewState.spaceTop}
        spaceRight={viewState.spaceRight}
        spaceBottom={viewState.spaceBottom}
        spaceLeft={viewState.spaceLeft}
        primaryColor={viewState.primary}
        alternateColor={viewState.alternate}
        textToneColor={textToneColor}
      />
    );
  }

  return (
    <AllView
      dotsMode={viewState.dotsMode}
      dotsCount={viewState.dotsCount}
      showDays={viewState.showDays}
      showPercentBox={viewState.showPercentBox}
      showPerimeter={viewState.showPerimeter}
      shape={viewState.shape}
      triangleMode={viewState.triangleMode}
      triangleAngle={viewState.triangleAngle}
      gapX={viewState.gapX}
      gapY={viewState.gapY}
      inactiveOpacity={viewState.inactiveOpacity}
      daysFontSize={viewState.daysFontSize}
      daysLabel={viewState.daysLabel}
      decimals={viewState.decimals}
      summaryLayout={viewState.summaryLayout}
      summaryHeight={viewState.summaryHeight}
      summaryGap={viewState.summaryGap}
      percentBoxSize={viewState.percentBoxSize}
      percentFontSize={viewState.percentFontSize}
      percentGap={viewState.percentGap}
      progressBarHeight={viewState.progressBarHeight}
      perimeterThickness={viewState.perimeterThickness}
      spaceTop={viewState.spaceTop}
      spaceRight={viewState.spaceRight}
      spaceBottom={viewState.spaceBottom}
      spaceLeft={viewState.spaceLeft}
      primaryColor={viewState.primary}
      alternateColor={viewState.alternate}
      textTone={textTone}
    />
  );
};

const DEFAULT_SIDEBAR_WIDTH = 352;
const MIN_SIDEBAR_WIDTH = 100;
const PREVIEW_MIN_WIDTH = 100;

const clampSidebarWidth = (value, viewportWidth) => {
  const safeViewportWidth = Number.isFinite(viewportWidth) ? viewportWidth : DEFAULT_SIDEBAR_WIDTH + PREVIEW_MIN_WIDTH;
  const maxSidebarWidth = Math.max(MIN_SIDEBAR_WIDTH, safeViewportWidth - PREVIEW_MIN_WIDTH);

  return Math.min(maxSidebarWidth, Math.max(MIN_SIDEBAR_WIDTH, value));
};

const SamplesPage = () => {
  const { theme, setTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_SIDEBAR_WIDTH;
    }

    const storedWidth = window.localStorage.getItem('yearcountdown.samples.sidebarWidth');
    const parsedWidth = Number.parseFloat(storedWidth ?? '');

    if (!Number.isFinite(parsedWidth)) {
      return DEFAULT_SIDEBAR_WIDTH;
    }

    return clampSidebarWidth(parsedWidth, window.innerWidth);
  });
  const resizingRef = useRef(false);
  const requestedSampleId = searchParams.get('sample');
  const selectedSample = getSampleById(requestedSampleId) ?? SAMPLE_ITEMS[0];
  const [previewTheme, setPreviewTheme] = useState(selectedSample.theme);
  const [previewState, setPreviewState] = useState(() => cloneSampleState(selectedSample));
  const [brandToneMode, setBrandToneMode] = useState(VIEW_BRAND_TONE_MODES.AUTO);
  const [textToneMode, setTextToneMode] = useState(VIEW_BRAND_TONE_MODES.AUTO);

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
    setPreviewTheme(selectedSample.theme);
    setTheme(selectedSample.theme);
    setPreviewState(cloneSampleState(selectedSample));
    setBrandToneMode(VIEW_BRAND_TONE_MODES.AUTO);
    setTextToneMode(VIEW_BRAND_TONE_MODES.AUTO);
    setIsSidebarOpen(false);
  }, [selectedSample.id]);

  useEffect(() => {
    if (requestedSampleId && getSampleById(requestedSampleId)) {
      return;
    }

    setSearchParams({ sample: selectedSample.id }, { replace: true });
  }, [requestedSampleId, selectedSample.id, setSearchParams]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('yearcountdown.samples.sidebarWidth', String(sidebarWidth));
  }, [sidebarWidth]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleResize = () => {
      setSidebarWidth((current) => clampSidebarWidth(current, window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!resizingRef.current || window.innerWidth < 1024) {
        return;
      }

      const nextWidth = clampSidebarWidth(event.clientX, window.innerWidth);
      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      if (!resizingRef.current) {
        return;
      }

      resizingRef.current = false;
      setIsResizingSidebar(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      resizingRef.current = false;
      setIsResizingSidebar(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const viewId = selectedSample.viewId;
  const viewConfig = VIEW_SETTINGS_CONFIG[viewId];
  const resolvedBrandIconTone = resolveViewBrandIconTone({
    mode: brandToneMode,
    backgroundColor: previewState.alternate,
  });
  const resolvedTextTone = resolveViewTextTone({
    mode: textToneMode,
    backgroundColor: previewState.alternate,
  });
  const toneColor = getToneColor(resolvedTextTone);
  const wrappedViewState = useMemo(() => ({ [viewId]: previewState }), [viewId, previewState]);
  const filteredSamples = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return SAMPLE_ITEMS;
    }

    return SAMPLE_ITEMS.filter((item) => {
      const haystack = [item.label, item.category, ...(item.tags ?? [])].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [searchValue]);
  const groupedSamples = useMemo(() => {
    return SAMPLE_CATEGORY_ORDER.map((category) => ({
      category,
      items: filteredSamples.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);
  }, [filteredSamples]);

  const updateViewSetting = (_, key, value) => {
    const normalizeValue = NORMALIZE_BY_VIEW[viewId];

    if (key === 'spaceAll' || key === 'spaceX' || key === 'spaceY') {
      const parsedValue = parseSpacingHelperInput(value);

      if (parsedValue === null) {
        return;
      }

      setPreviewState((current) => ({
        ...current,
        ...(key === 'spaceAll'
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
              }),
      }));
      return;
    }

    const normalizedValue = normalizeValue(key, value, previewTheme);

    setPreviewState((current) => ({
      ...current,
      [key]: normalizedValue,
    }));

    if (key === 'alternate') {
      const nextTheme = getThemeFromBackgroundColor(normalizedValue);
      setPreviewTheme(nextTheme);
      setTheme(nextTheme);
    }

    if (key === 'primary' || key === 'alternate') {
      const resolvedColors = resolveViewColors({
        theme: previewTheme,
        primary: key === 'primary' ? normalizedValue : previewState.primary,
        alternate: key === 'alternate' ? normalizedValue : previewState.alternate,
      });

      setPreviewState((current) => ({
        ...current,
        ...resolvedColors,
      }));
    }
  };

  const updateAppearanceColors = (nextColors) => {
    const resolvedColors = resolveViewColors({
      theme: previewTheme,
      primary: nextColors?.primary ?? previewState.primary,
      alternate: nextColors?.alternate ?? previewState.alternate,
    });
    const nextTheme = getThemeFromBackgroundColor(resolvedColors.alternate);

    setPreviewTheme(nextTheme);
    setTheme(nextTheme);
    setPreviewState((current) => ({
      ...current,
      ...resolvedColors,
    }));
  };

  const sharedUrl = typeof window === 'undefined'
    ? ''
    : getSharedViewUrl({
        pathname: `/view/${viewId}`,
        origin: window.location.origin,
        theme: previewTheme,
        viewId,
        viewState: previewState,
        colors: {
          ...previewState,
          brandToneMode,
          textToneMode,
        },
      });

  const buildWallpaperUrl = ({ width, height }) => {
    return getWallpaperUrl({
      viewId,
      theme: previewTheme,
      viewState: previewState,
      colors: previewState,
      textToneMode,
      width,
      height,
    });
  };

  const handleSelectSample = (sampleId) => {
    setSearchParams({ sample: sampleId });
    setIsSidebarOpen(false);
  };

  const handleResizeStart = () => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) {
      return;
    }

    resizingRef.current = true;
    setIsResizingSidebar(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  return (
    <div
      className="relative h-screen overflow-hidden bg-stone-100 text-black dark:bg-zinc-950 dark:text-white"
      style={{ '--samples-sidebar-width': `${sidebarWidth}px` }}
    >
      <div className="pointer-events-none absolute left-4 top-4 z-40 lg:hidden">
        <div className="pointer-events-auto">
          <MenuToggleButton open={isSidebarOpen} onClick={() => setIsSidebarOpen((current) => !current)} />
        </div>
      </div>

      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close samples menu"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 z-30 bg-black/28 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      {isResizingSidebar ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[60] hidden cursor-col-resize lg:block"
        />
      ) : null}

      <aside
        className={`absolute inset-y-0 left-0 z-40 w-[min(22rem,calc(100vw-3rem))] border-r border-black/10 bg-stone-100 transition-transform duration-300 dark:border-white/10 dark:bg-zinc-950 lg:w-[var(--samples-sidebar-width)] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden px-4 py-4 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <BrandLockup iconOnly compact className="shrink-0" />
          </div>

          <div className="mt-6 shrink-0">
            <label className="block">
              <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.28em] text-black/38 dark:text-white/38">Search</span>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search samples"
                  className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 pr-12 text-sm text-black outline-none transition-colors [-webkit-appearance:none] [&::-webkit-search-cancel-button]:hidden focus:border-black/25 dark:border-white/10 dark:text-white dark:focus:border-white/25"
                />
                {searchValue ? (
                  <div className="absolute inset-y-0 right-1 flex items-center">
                    <SearchClearButton
                      onClick={() => {
                        setSearchValue('');
                        searchInputRef.current?.focus();
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </label>
          </div>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-8">
            <div className="space-y-8">
              {groupedSamples.map((group) => (
                <section key={group.category}>
                  <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-black/38 dark:text-white/38">
                    {CATEGORY_LABELS[group.category]}
                  </p>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const active = item.id === selectedSample.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSample(item.id)}
                          className={`flex w-full cursor-pointer items-center justify-between gap-4 py-1.5 text-left transition-opacity duration-200 ${
                            active
                              ? 'text-black dark:text-white'
                              : 'text-black/52 hover:text-black/78 dark:text-white/52 dark:hover:text-white/78'
                          }`}
                        >
                          <span className="min-w-0 truncate text-xs uppercase tracking-[0.24em]">{item.label}</span>
                          <span className={`shrink-0 text-[0.58rem] uppercase tracking-[0.22em] ${active ? 'opacity-70' : 'opacity-35'}`}>
                            {item.frame ?? 'portrait'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}

              {groupedSamples.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-black/12 px-4 py-5 text-sm text-black/55 dark:border-white/12 dark:text-white/55">
                  No samples match your search.
                </div>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            aria-label="Resize samples sidebar"
            data-cursor-mode="resize-x"
            onMouseDown={handleResizeStart}
            className="absolute right-1 top-1/2 z-20 hidden h-44 w-6 -translate-y-1/2 cursor-col-resize items-center justify-center lg:flex"
          >
            <span className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-95 shadow-[0_0_16px_rgba(0,0,0,0.12)]" style={{ backgroundColor: theme === 'dark' ? '#ffffff' : '#000000' }} />
            <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 inline-flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-stone-100/92 text-black/70 shadow-sm backdrop-blur-sm transition-colors duration-200 dark:border-white/10 dark:bg-zinc-950/92 dark:text-white/70">
              <ResizeHandleIcon />
            </span>
          </button>
        </div>
      </aside>

      <section className="relative h-full min-w-0 overflow-hidden lg:pl-[var(--samples-sidebar-width)]" style={{ backgroundColor: previewState.alternate }}>
        <div className="absolute inset-0 lg:left-[var(--samples-sidebar-width)]">
          <div className="h-full w-full" key={selectedSample.id}>
            {renderSampleView({ viewId, viewState: previewState, textTone: resolvedTextTone })}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="pointer-events-auto absolute bottom-4 left-4 z-30 sm:bottom-6 sm:left-6 lg:left-[calc(var(--samples-sidebar-width)+1.5rem)]">
            <CopyEmbedAction
              sharedUrl={sharedUrl}
              variant="floating"
              backgroundColor={previewState.alternate}
              toneColor={toneColor}
            />
          </div>

          <div className="pointer-events-auto absolute bottom-4 right-4 z-30 sm:bottom-6 sm:right-6">
            <ViewSettingsGear
              viewId={viewId}
              viewTitle={selectedSample.label}
              sharedUrl={sharedUrl}
              isHidden={false}
              controls={viewConfig?.controls ?? []}
              viewState={wrappedViewState}
              updateViewSetting={updateViewSetting}
              wallpaperUrl={buildWallpaperUrl({ width: window.innerWidth, height: window.innerHeight })}
              buildWallpaperUrl={buildWallpaperUrl}
              appearanceColors={{
                primary: previewState.primary,
                alternate: previewState.alternate,
              }}
              brandToneMode={brandToneMode}
              textToneMode={textToneMode}
              onBrandToneModeChange={setBrandToneMode}
              onTextToneModeChange={setTextToneMode}
              onColorsChange={updateAppearanceColors}
              gearIconTone={resolvedBrandIconTone}
              resolvedTextTone={resolvedTextTone}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SamplesPage;
