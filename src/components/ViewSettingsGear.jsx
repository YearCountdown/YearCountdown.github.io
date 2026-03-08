import { useEffect, useRef, useState } from 'react';

import { useTheme } from '../context/ThemeContext';

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
    return (
      <div key={control.key}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
            {control.label}
          </p>
          <span className="text-xs text-black/45 dark:text-white/45">
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
  }

  return null;
};

const ViewSettingsGear = ({
  viewId,
  viewTitle,
  sharedUrl,
  isHidden,
  controls = [],
  viewState,
  updateViewSetting,
}) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const containerRef = useRef(null);
  const copiedTimeoutRef = useRef(null);

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

          <div className="space-y-4">
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

            {controls.map((control) => renderControl({ control, viewId, viewState, updateViewSetting }))}

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
