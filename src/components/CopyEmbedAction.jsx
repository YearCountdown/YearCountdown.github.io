import { useEffect, useRef, useState } from 'react';

import { withAlpha } from '../lib/viewColors';

const CopyIcon = ({ copied, className = 'h-4 w-4' }) => {
  if (copied) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-none stroke-current`}>
        <path d="m5 12 4.2 4.2L19 6.5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-none stroke-current`}>
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

const CopyEmbedAction = ({
  sharedUrl,
  variant = 'panel',
  className = '',
  label = 'Copy embed link',
  copiedLabel = 'Copied embed link',
  backgroundColor = '#ffffff',
  toneColor = '#111111',
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  if (!sharedUrl) {
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

  if (variant === 'floating') {
    return (
      <button
        type="button"
        onClick={handleCopyLink}
        className={`group inline-flex cursor-pointer items-center justify-start gap-3 rounded-full px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40 ${className}`}
        style={{
          backgroundColor: withAlpha(backgroundColor, 0.62),
          border: `1px solid ${withAlpha(toneColor, 0.12)}`,
          color: withAlpha(toneColor, 0.88),
        }}
      >
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
            isCopied ? 'scale-110' : 'group-hover:scale-105'
          }`}
        >
          <CopyIcon copied={isCopied} className={`h-4 w-4 transition-transform duration-200 ${isCopied ? 'scale-110' : ''}`} />
        </span>
        <span
          className={`overflow-hidden rounded-full px-0 py-0 text-left text-xs uppercase tracking-[0.22em] backdrop-blur-xl transition-all duration-200 ${
            isCopied ? 'max-w-[15rem] px-4 py-2' : 'max-w-0 group-hover:max-w-[15rem] group-hover:px-4 group-hover:py-2'
          }`}
          style={{
            backgroundColor: withAlpha(backgroundColor, 0.78),
            border: `1px solid ${isCopied ? withAlpha(toneColor, 0.1) : 'transparent'}`,
            color: withAlpha(toneColor, 0.8),
          }}
        >
          <span className={`block whitespace-nowrap transition-transform duration-200 ${isCopied ? 'translate-x-0' : 'translate-x-1 group-hover:translate-x-0'}`}>
            {isCopied ? copiedLabel : label}
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopyLink}
      className={`flex w-full cursor-pointer items-center justify-between rounded-2xl bg-black/6 px-4 py-3 text-left text-sm text-black transition-colors hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:bg-white/6 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white/20 ${className}`}
    >
      <span>{isCopied ? copiedLabel : label}</span>
      <span className={`transition-transform duration-200 ${isCopied ? 'scale-110' : ''}`}>
        <CopyIcon copied={isCopied} />
      </span>
    </button>
  );
};

export default CopyEmbedAction;
