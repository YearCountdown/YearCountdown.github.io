import { Link } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';
import { BRAND_TEXT, getBrandAsset } from '../lib/brand';

const BrandLockup = ({
  to = '/',
  className = '',
  textClassName = '',
  compact = false,
  iconOnly = false,
  ariaLabel = 'Go to home page',
  onClick,
}) => {
  const { theme } = useTheme();
  const iconSrc = getBrandAsset(theme, 'icon');
  const markWrapperClassName = compact ? 'h-8 w-8' : 'h-11 w-11';

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex min-w-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40 ${className}`}
    >
      <span className={`relative inline-flex shrink-0 items-center justify-center overflow-visible ${markWrapperClassName}`}>
        <img
          src={iconSrc}
          alt=""
          className="absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </span>

      {iconOnly ? null : (
        <span
          className={`min-w-0 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-black/72 dark:text-white/72 sm:text-[0.68rem] ${textClassName}`}
        >
          {BRAND_TEXT}
        </span>
      )}
    </Link>
  );
};

export default BrandLockup;
