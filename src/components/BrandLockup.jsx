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
  const logoSrc = getBrandAsset(theme, 'logo');
  const markWrapperClassName = iconOnly
    ? compact
      ? 'h-8 w-8'
      : 'h-11 w-11'
    : compact
      ? 'h-8 w-12'
      : 'h-11 w-16';

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group inline-flex min-w-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40 ${className}`}
    >
      <span className={`relative inline-flex shrink-0 items-center justify-center overflow-visible ${markWrapperClassName}`}>
        <img
          src={iconSrc}
          alt=""
          className="absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-200 group-hover:scale-[0.92] group-hover:opacity-0"
        />
        <img
          src={logoSrc}
          alt=""
          className={`absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 scale-[0.96] object-contain opacity-0 transition-all duration-200 ${
            iconOnly ? '' : 'group-hover:scale-100 group-hover:opacity-100'
          }`}
        />
      </span>

      {iconOnly ? null : (
        <span
          className={`min-w-0 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-black/72 transition-colors group-hover:text-black dark:text-white/72 dark:group-hover:text-white sm:text-[0.68rem] ${textClassName}`}
        >
          {BRAND_TEXT}
        </span>
      )}
    </Link>
  );
};

export default BrandLockup;
