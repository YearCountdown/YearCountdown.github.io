import { useEffect, useRef, useState } from 'react';

import CopyEmbedAction from './CopyEmbedAction';
import { useTheme } from '../context/ThemeContext';
import useDeviceProfile from '../hooks/useDeviceProfile';
import { VIEW_BRAND_TONE_MODES, VIEW_COLOR_PRESETS, withAlpha } from '../lib/viewColors';
import {
  WALLPAPER_DIMENSION_MAX,
  WALLPAPER_DIMENSION_MIN,
  clampWallpaperDimension,
  getPreferredWallpaperSize,
} from '../lib/wallpaper';

const GearIcon = () => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
      <path
        d="M4 7h9"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 7h3" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 12h9" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12h3" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17h13" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 17h-1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15" cy="7" r="2" strokeWidth="1.7" />
      <circle cx="9" cy="12" r="2" strokeWidth="1.7" />
      <circle cx="19" cy="17" r="2" strokeWidth="1.7" />
    </svg>
  );
};

const renderNumberControl = ({ control, value, viewId, updateViewSetting }) => {
  return (
    <div key={control.key} className="min-w-0 flex-1">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
          {control.label}
        </p>
        <span className="shrink-0 text-xs text-black/45 dark:text-white/45">
          {value}
          {control.suffix ? ` ${control.suffix}` : ''}
        </span>
      </div>
      <input
        type="number"
        min={control.min}
        max={control.max}
        step={control.step ?? 'any'}
        value={value}
        onChange={(event) => updateViewSetting(viewId, control.key, event.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black/25 dark:border-white/10 dark:text-white dark:focus:border-white/25"
      />
    </div>
  );
};

const getSpacingHelperValue = (state, key) => {
  if (!state) {
    return '';
  }

  const top = state.spaceTop;
  const right = state.spaceRight;
  const bottom = state.spaceBottom;
  const left = state.spaceLeft;

  if ([top, right, bottom, left].some((item) => typeof item !== 'number')) {
    return '';
  }

  if (key === 'spaceAll') {
    return top === right && right === bottom && bottom === left ? String(top) : '--';
  }

  if (key === 'spaceX') {
    return left === right ? String(left) : '--';
  }

  if (key === 'spaceY') {
    return top === bottom ? String(top) : '--';
  }

  return '';
};

const SpacingHelperInput = ({ control, value, viewId, updateViewSetting }) => {
  const isMixed = value === '--';
  const [draftValue, setDraftValue] = useState(isMixed ? '' : value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(value === '--' ? '' : value);
    }
  }, [isEditing, value]);

  const commitValue = () => {
    const trimmed = typeof draftValue === 'string' ? draftValue.trim() : '';

    setIsEditing(false);

    if (!trimmed) {
      setDraftValue(value);
      return;
    }

    updateViewSetting(viewId, control.key, trimmed);
  };

  return (
    <input
      type="number"
      inputMode="decimal"
      step="any"
      value={draftValue}
      placeholder={isMixed ? '--' : ''}
      onFocus={() => {
        setIsEditing(true);
      }}
      onChange={(event) => setDraftValue(event.target.value)}
      onBlur={commitValue}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.currentTarget.blur();
        }

        if (event.key === 'Escape') {
          setIsEditing(false);
          setDraftValue(value);
          event.currentTarget.blur();
        }
      }}
      className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black/25 dark:border-white/10 dark:text-white dark:focus:border-white/25"
    />
  );
};

const renderSpacingHelperControl = ({ control, value, viewId, updateViewSetting }) => {
  return (
    <div key={control.key} className="min-w-0 flex-1">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
          {control.label}
        </p>
        <span className="shrink-0 text-xs text-black/45 dark:text-white/45">%</span>
      </div>
      <SpacingHelperInput control={control} value={value} viewId={viewId} updateViewSetting={updateViewSetting} />
    </div>
  );
};

const renderRangeControl = ({ control, value, viewId, updateViewSetting }) => {
  return (
    <div key={control.key} className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
          {control.label}
        </p>
        <span className="shrink-0 text-xs text-black/45 dark:text-white/45">
          {value}
          {control.suffix ? ` ${control.suffix}` : ''}
        </span>
      </div>
      <input
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) => updateViewSetting(viewId, control.key, event.target.value)}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-black outline-none dark:bg-white/10 dark:accent-white"
      />
      <div className="mt-2 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.18em] text-black/30 dark:text-white/30">
        <span>{control.min}</span>
        <span>{control.max}</span>
      </div>
    </div>
  );
};

const renderControls = ({ controls, viewId, viewState, updateViewSetting }) => {
  const state = viewState?.[viewId];
  const renderedControls = [];

  for (let index = 0; index < controls.length; index += 1) {
    const control = controls[index];

    if (typeof control.showWhen === 'function' && !control.showWhen(state)) {
      continue;
    }

    if (control.type === 'number' && control.inlineGroup) {
      const groupControls = [control];

      while (index + 1 < controls.length) {
        const nextControl = controls[index + 1];

        if (nextControl.type !== 'number' || nextControl.inlineGroup !== control.inlineGroup) {
          break;
        }

        if (typeof nextControl.showWhen === 'function' && !nextControl.showWhen(state)) {
          break;
        }

        groupControls.push(nextControl);
        index += 1;
      }

      renderedControls.push(
        <div key={control.inlineGroup} className="grid grid-cols-2 gap-3">
          {groupControls.map((groupControl) =>
            renderNumberControl({
              control: groupControl,
              value: state?.[groupControl.key],
              viewId,
              updateViewSetting,
            }),
          )}
        </div>,
      );
      continue;
    }

    if (control.type === 'spacing-helper' && control.inlineGroup) {
      const groupControls = [control];

      while (index + 1 < controls.length) {
        const nextControl = controls[index + 1];

        if (nextControl.type !== 'spacing-helper' || nextControl.inlineGroup !== control.inlineGroup) {
          break;
        }

        groupControls.push(nextControl);
        index += 1;
      }

      renderedControls.push(
        <div key={control.inlineGroup} className="grid grid-cols-3 gap-3">
          {groupControls.map((groupControl) =>
            renderSpacingHelperControl({
              control: groupControl,
              value: getSpacingHelperValue(state, groupControl.key),
              viewId,
              updateViewSetting,
            }),
          )}
        </div>,
      );
      continue;
    }

    renderedControls.push(renderControl({ control, viewId, viewState, updateViewSetting }));
  }

  return renderedControls;
};

const renderControl = ({ control, viewId, viewState, updateViewSetting }) => {
  const state = viewState?.[viewId];
  const value = state?.[control.key];

  if (typeof control.showWhen === 'function' && !control.showWhen(state)) {
    return null;
  }

  if (control.type === 'select') {
    return (
      <div key={control.key}>
        <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
          {control.label}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {control.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateViewSetting(viewId, control.key, option.value)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                value === option.value
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (control.type === 'boolean') {
    return (
      <div key={control.key}>
        <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
          {control.label}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateViewSetting(viewId, control.key, true)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
              value === true
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
            }`}
          >
            {control.trueLabel}
          </button>
          <button
            type="button"
            onClick={() => updateViewSetting(viewId, control.key, false)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
              value === false
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
            }`}
          >
            {control.falseLabel}
          </button>
        </div>
      </div>
    );
  }

  if (control.type === 'number') {
    return renderNumberControl({ control, value, viewId, updateViewSetting });
  }

  if (control.type === 'spacing-helper') {
    return renderSpacingHelperControl({
      control,
      value: getSpacingHelperValue(state, control.key),
      viewId,
      updateViewSetting,
    });
  }

  if (control.type === 'range') {
    return renderRangeControl({ control, value, viewId, updateViewSetting });
  }

  return null;
};

const ColorPresetButton = ({ active, label, primary, alternate, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ${
        active
          ? 'bg-black text-white dark:bg-white dark:text-black'
          : 'bg-black/6 text-black/70 hover:bg-black/10 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/10'
      }`}
    >
      <span>{label}</span>
      <span className="flex items-center gap-1.5">
        <span
          className={`h-4 w-4 rounded-full border ${active ? 'border-current/20' : 'border-black/10 dark:border-white/10'}`}
          style={{ backgroundColor: primary }}
        />
        <span
          className={`h-4 w-4 rounded-full border ${active ? 'border-current/20' : 'border-black/10 dark:border-white/10'}`}
          style={{ backgroundColor: alternate }}
        />
      </span>
    </button>
  );
};

const ColorInput = ({ label, value, onChange }) => {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-black/10 px-4 py-3 dark:border-white/10">
      <span className="text-sm text-black/70 dark:text-white/70">{label}</span>
      <span className="flex items-center gap-3">
        <span className="font-mono text-xs text-black/45 dark:text-white/45">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-8 cursor-pointer rounded-full border-0 bg-transparent p-0"
        />
      </span>
    </label>
  );
};

const WallpaperDimensionInput = ({ label, value, onChange }) => {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
          {label}
        </p>
        <span className="shrink-0 text-xs text-black/45 dark:text-white/45">px</span>
      </div>
      <input
        type="number"
        min={WALLPAPER_DIMENSION_MIN}
        max={WALLPAPER_DIMENSION_MAX}
        step={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black/25 dark:border-white/10 dark:text-white dark:focus:border-white/25"
      />
    </div>
  );
};

const ViewSettingsGear = ({
  viewId,
  viewTitle,
  sharedUrl,
  isHidden,
  controls = [],
  viewState,
  updateViewSetting,
  wallpaperUrl = '',
  buildWallpaperUrl,
  appearanceOnly = false,
  themeOnly = false,
  appearanceColors,
  onThemeChange,
  onColorsChange,
  brandToneMode = VIEW_BRAND_TONE_MODES.AUTO,
  textToneMode = VIEW_BRAND_TONE_MODES.AUTO,
  gearIconTone,
  resolvedTextTone,
  onBrandToneModeChange,
  onTextToneModeChange,
}) => {
  const { theme, setTheme, viewColors, setViewColors } = useTheme();
  const deviceProfile = useDeviceProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(appearanceOnly ? 'appearance' : 'view');
  const [wallpaperSize, setWallpaperSize] = useState(() => {
    const viewport = getPreferredWallpaperSize(deviceProfile);

    return {
      width: String(viewport.width),
      height: String(viewport.height),
    };
  });
  const containerRef = useRef(null);
  const hasViewTab = !appearanceOnly;
  const resolvedColors = appearanceColors ?? viewColors;
  const handleThemeChange = onThemeChange ?? setTheme;
  const handleColorsChange = onColorsChange ?? setViewColors;
  const resolvedGearIconTone = gearIconTone
    ? gearIconTone === VIEW_BRAND_TONE_MODES.LIGHT
      ? VIEW_BRAND_TONE_MODES.LIGHT
      : VIEW_BRAND_TONE_MODES.DARK
    : theme === 'dark'
      ? VIEW_BRAND_TONE_MODES.LIGHT
      : VIEW_BRAND_TONE_MODES.DARK;
  const gearIconColor = resolvedGearIconTone === VIEW_BRAND_TONE_MODES.LIGHT ? 'rgba(255,255,255,0.88)' : 'rgba(17,17,17,0.88)';
  const resolvedTextToneMode = resolvedTextTone === VIEW_BRAND_TONE_MODES.LIGHT ? VIEW_BRAND_TONE_MODES.LIGHT : VIEW_BRAND_TONE_MODES.DARK;
  const useThemeSurface = themeOnly || !appearanceColors;
  const gearSurfaceBaseColor = useThemeSurface ? (theme === 'dark' ? '#000000' : '#ffffff') : resolvedColors.alternate;
  const gearBackgroundColor = withAlpha(gearSurfaceBaseColor, useThemeSurface ? 0.76 : 0.62);
  const gearBorderColor = withAlpha(
    resolvedGearIconTone === VIEW_BRAND_TONE_MODES.LIGHT ? '#ffffff' : '#111111',
    useThemeSurface ? 0.1 : 0.12,
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isHidden) {
      setIsOpen(false);
    }
  }, [isHidden]);

  useEffect(() => {
    if (!hasViewTab) {
      setActiveTab('appearance');
    }
  }, [hasViewTab]);

  useEffect(() => {
    const viewport = getPreferredWallpaperSize(deviceProfile);

    setWallpaperSize({
      width: String(viewport.width),
      height: String(viewport.height),
    });
  }, [deviceProfile, viewId]);

  if (isHidden) {
    return null;
  }

  const preferredWallpaperSize = getPreferredWallpaperSize(deviceProfile);
  const resolvedWallpaperWidth = clampWallpaperDimension(wallpaperSize.width, preferredWallpaperSize.width);
  const resolvedWallpaperHeight = clampWallpaperDimension(wallpaperSize.height, preferredWallpaperSize.height);
  const resolvedWallpaperUrl = buildWallpaperUrl
    ? buildWallpaperUrl({
        width: resolvedWallpaperWidth,
        height: resolvedWallpaperHeight,
      })
    : wallpaperUrl;

  const resetWallpaperSizeToViewport = () => {
    const viewport = getPreferredWallpaperSize(deviceProfile);

    setWallpaperSize({
      width: String(viewport.width),
      height: String(viewport.height),
    });
  };

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="absolute bottom-14 right-0 flex max-h-[min(42rem,calc(100vh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/78 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/76 dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="mb-4">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-black/40 dark:text-white/40">
              Settings
            </p>
            <h2 className="mt-2 text-lg font-light uppercase tracking-[0.08em] text-black dark:text-white">
              {viewTitle}
            </h2>
          </div>

          {hasViewTab ? (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('view')}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                  activeTab === 'view'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                }`}
              >
                View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('appearance')}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                  activeTab === 'appearance'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                }`}
              >
                Appearance
              </button>
            </div>
          ) : null}

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {activeTab === 'appearance' ? (
              <>
                {themeOnly ? (
                  <div>
                    <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                      Theme
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleThemeChange('light')}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                          theme === 'light'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                        }`}
                      >
                        Light
                      </button>
                      <button
                        type="button"
                        onClick={() => handleThemeChange('dark')}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                          theme === 'dark'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                      Colors
                    </p>
                    <p className="mb-3 text-xs leading-5 text-black/50 dark:text-white/50">
                      Theme follows the selected secondary color. Use the header toggle if you want to override it manually.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {VIEW_COLOR_PRESETS.map((preset) => (
                        <ColorPresetButton
                          key={preset.id}
                          active={
                            resolvedColors.primary === preset.primary &&
                            resolvedColors.alternate === preset.alternate
                          }
                          label={preset.label}
                          primary={preset.primary}
                          alternate={preset.alternate}
                          onClick={() =>
                            handleColorsChange({
                              primary: preset.primary,
                              alternate: preset.alternate,
                            })
                          }
                        />
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <ColorInput
                        label="Primary"
                        value={resolvedColors.primary}
                        onChange={(value) => handleColorsChange({ primary: value })}
                      />
                      <ColorInput
                        label="Secondary"
                        value={resolvedColors.alternate}
                        onChange={(value) => handleColorsChange({ alternate: value })}
                      />
                    </div>
                    <div className="mt-4">
                      <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                        Text Tone
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => onTextToneModeChange?.(VIEW_BRAND_TONE_MODES.AUTO)}
                          className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                            textToneMode === VIEW_BRAND_TONE_MODES.AUTO
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                          }`}
                        >
                          Auto
                        </button>
                        <button
                          type="button"
                          onClick={() => onTextToneModeChange?.(VIEW_BRAND_TONE_MODES.LIGHT)}
                          className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                            textToneMode === VIEW_BRAND_TONE_MODES.LIGHT
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                          }`}
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          onClick={() => onTextToneModeChange?.(VIEW_BRAND_TONE_MODES.DARK)}
                          className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                            textToneMode === VIEW_BRAND_TONE_MODES.DARK
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                          }`}
                        >
                          Dark
                        </button>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-black/45 dark:text-white/45">
                        Active: {resolvedTextToneMode === VIEW_BRAND_TONE_MODES.LIGHT ? 'Light' : 'Dark'}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                        Icon Tone
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => onBrandToneModeChange?.(VIEW_BRAND_TONE_MODES.AUTO)}
                          className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                            brandToneMode === VIEW_BRAND_TONE_MODES.AUTO
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                          }`}
                        >
                          Auto
                        </button>
                        <button
                          type="button"
                          onClick={() => onBrandToneModeChange?.(VIEW_BRAND_TONE_MODES.LIGHT)}
                          className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                            brandToneMode === VIEW_BRAND_TONE_MODES.LIGHT
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                          }`}
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          onClick={() => onBrandToneModeChange?.(VIEW_BRAND_TONE_MODES.DARK)}
                          className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                            brandToneMode === VIEW_BRAND_TONE_MODES.DARK
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'bg-black/6 text-black/65 hover:bg-black/10 dark:bg-white/6 dark:text-white/65 dark:hover:bg-white/10'
                          }`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {renderControls({ controls, viewId, viewState, updateViewSetting })}
              </>
            )}

            {sharedUrl ? (
              <div>
                <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                  Share
                </p>
                <CopyEmbedAction sharedUrl={sharedUrl} />
              </div>
            ) : null}

            {resolvedWallpaperUrl ? (
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                    Wallpaper URL
                  </p>
                  <button
                    type="button"
                    onClick={resetWallpaperSizeToViewport}
                    className="cursor-pointer text-[0.65rem] uppercase tracking-[0.2em] text-black/45 transition-colors hover:text-black dark:text-white/45 dark:hover:text-white"
                  >
                    Use viewport
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <WallpaperDimensionInput
                    label="Width"
                    value={wallpaperSize.width}
                    onChange={(value) =>
                      setWallpaperSize((current) => ({
                        ...current,
                        width: value,
                      }))
                    }
                  />
                  <WallpaperDimensionInput
                    label="Height"
                    value={wallpaperSize.height}
                    onChange={(value) =>
                      setWallpaperSize((current) => ({
                        ...current,
                        height: value,
                      }))
                    }
                  />
                </div>
                <div className="mt-3 text-xs leading-5 text-black/45 dark:text-white/45">
                  {resolvedWallpaperWidth} x {resolvedWallpaperHeight}px
                </div>
                <div className="mt-3">
                  <CopyEmbedAction
                    sharedUrl={resolvedWallpaperUrl}
                    label="Copy wallpaper URL"
                    copiedLabel="Copied wallpaper URL"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close settings panel' : 'Open settings panel'}
        aria-expanded={isOpen}
        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-200 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40"
        style={{
          color: gearIconColor,
          backgroundColor: gearBackgroundColor,
          border: `1px solid ${gearBorderColor}`,
        }}
      >
        <GearIcon />
      </button>
    </div>
  );
};

export default ViewSettingsGear;
