import { useEffect, useRef, useState } from 'react';

import { useTheme } from '../context/ThemeContext';
import { VIEW_COLOR_MODES } from '../lib/viewColors';

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

const CopyIcon = ({ copied }) => {
  if (copied) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
        <path d="m5 12 4.2 4.2L19 6.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
      <path
        d="M9 9.75A1.75 1.75 0 0 1 10.75 8h7.5A1.75 1.75 0 0 1 20 9.75v8.5A1.75 1.75 0 0 1 18.25 20h-7.5A1.75 1.75 0 0 1 9 18.25Zm-5-4A1.75 1.75 0 0 1 5.75 4h7.5A1.75 1.75 0 0 1 15 5.75V6.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const copyText = async (value) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'absolute';
  input.style.left = '-9999px';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
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
        step={control.step}
        value={value}
        onChange={(event) => updateViewSetting(viewId, control.key, event.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black/25 dark:border-white/10 dark:text-white dark:focus:border-white/25"
      />
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

  return null;
};

const ColorModeButton = ({ active, label, primary, alternate, onClick }) => {
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

const ViewSettingsGear = ({
  viewId,
  viewTitle,
  sharedUrl,
  isHidden,
  controls = [],
  viewState,
  updateViewSetting,
  appearanceOnly = false,
}) => {
  const { theme, setTheme, colorMode, setColorMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(appearanceOnly ? 'appearance' : 'view');
  const containerRef = useRef(null);
  const copiedTimeoutRef = useRef(null);
  const hasViewTab = !appearanceOnly;

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
    return () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

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

  if (isHidden) {
    return null;
  }

  const handleCopyLink = async () => {
    try {
      await copyText(sharedUrl);
      setIsCopied(true);

      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }

      copiedTimeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
      }, 1400);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="absolute bottom-14 right-0 w-[min(22rem,calc(100vw-2rem))] rounded-[1.6rem] border border-black/10 bg-white/78 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/76 dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
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

          <div className="space-y-4">
            {activeTab === 'appearance' ? (
              <>
                <div>
                  <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                    Theme
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
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
                      onClick={() => setTheme('dark')}
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

                <div>
                  <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                    Colors
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <ColorModeButton
                      active={colorMode === VIEW_COLOR_MODES.BLACK_PRIMARY}
                      label="Black Primary"
                      primary="#000000"
                      alternate="#ffffff"
                      onClick={() => setColorMode(VIEW_COLOR_MODES.BLACK_PRIMARY)}
                    />
                    <ColorModeButton
                      active={colorMode === VIEW_COLOR_MODES.WHITE_PRIMARY}
                      label="White Primary"
                      primary="#ffffff"
                      alternate="#000000"
                      onClick={() => setColorMode(VIEW_COLOR_MODES.WHITE_PRIMARY)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {renderControls({ controls, viewId, viewState, updateViewSetting })}

                {sharedUrl ? (
                  <div>
                    <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                      Share
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-black/6 px-4 py-3 text-left text-sm text-black transition-colors hover:bg-black/10 dark:bg-white/6 dark:text-white dark:hover:bg-white/10"
                    >
                      <span>{isCopied ? 'Copied embed link' : 'Copy embed link'}</span>
                      <CopyIcon copied={isCopied} />
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close settings panel' : 'Open settings panel'}
        aria-expanded={isOpen}
        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-black/82 transition-opacity duration-200 hover:opacity-65 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:text-white/82 dark:focus-visible:ring-white/40"
      >
        <GearIcon />
      </button>
    </div>
  );
};

export default ViewSettingsGear;
