import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import gsap from 'gsap';

import { useTheme } from '../../context/ThemeContext';
import { NAV_LINKS } from '../../lib/navigation';
import { THEMES } from '../../lib/theme';

const LOGO_BY_THEME = {
  [THEMES.DARK]: '/logo/icon-light.svg',
  [THEMES.LIGHT]: '/logo/icon-dark.svg',
};

const getNavLinkClassName = ({ isActive }) => {
  const baseClassName =
    'text-sm tracking-[0.24em] uppercase transition-colors duration-200 focus:outline-none focus-visible:underline';

  if (isActive) {
    return `${baseClassName} text-black dark:text-white`;
  }

  return `${baseClassName} text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white`;
};

const ThemeToggleIcon = ({ theme }) => {
  if (theme === THEMES.DARK) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
        <path
          d="M12 3v2.5M12 18.5V21M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M3 12h2.5M18.5 12H21M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8M15.5 12A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M20.742 13.045a8.25 8.25 0 0 1-9.787-9.787 8.99 8.99 0 1 0 9.787 9.787Z" />
    </svg>
  );
};

const ThemeToggleButton = ({ theme, onToggle, className = '' }) => {
  const nextTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} theme`}
      className={`inline-flex h-11 w-11 items-center justify-center text-black/82 transition-opacity duration-200 hover:opacity-65 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:text-white/82 dark:focus-visible:ring-white/40 ${className}`}
    >
      <ThemeToggleIcon theme={theme} />
    </button>
  );
};

const MenuIcon = ({ isOpen }) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 overflow-visible fill-none stroke-current">
      <path
        d="M4 7h16"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={`origin-center transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-[5px] rotate-45' : ''
        }`}
      />
      <path
        d="M4 12h16"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={`origin-center transition-all duration-300 ease-out ${isOpen ? 'opacity-0' : 'opacity-100'}`}
      />
      <path
        d="M4 17h16"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={`origin-center transition-transform duration-300 ease-out ${
          isOpen ? '-translate-y-[5px] -rotate-45' : ''
        }`}
      />
    </svg>
  );
};

const getMobileNavLinkClassName = ({ isActive }) => {
  return `pointer-events-auto relative z-10 block text-2xl uppercase tracking-[0.3em] transition-colors ${
    isActive
      ? 'text-black dark:text-white'
      : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
  }`;
};

const Header = ({ variant = 'home' }) => {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const overlayRef = useRef(null);
  const menuContentRef = useRef(null);
  const menuAnimationRef = useRef(null);
  const previousPathnameRef = useRef(pathname);

  const openMobileMenu = () => {
    if (isMobileMenuMounted) {
      return;
    }

    setIsMobileMenuMounted(true);
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = (skipAnimation = false) => {
    if (!isMobileMenuMounted) {
      return;
    }

    if (skipAnimation) {
      menuAnimationRef.current?.kill();
      setIsMobileMenuOpen(false);
      setIsMobileMenuMounted(false);
      return;
    }

    const overlayElement = overlayRef.current;
    const menuContentElement = menuContentRef.current;
    const menuItems = menuContentElement?.querySelectorAll('[data-menu-item]');

    if (!overlayElement || !menuContentElement) {
      setIsMobileMenuOpen(false);
      setIsMobileMenuMounted(false);
      return;
    }

    menuAnimationRef.current?.kill();

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        setIsMobileMenuOpen(false);
        setIsMobileMenuMounted(false);
      },
    });

    timeline
      .to(
        menuItems,
        {
          y: 8,
          autoAlpha: 0,
          stagger: 0.025,
          duration: 0.12,
        },
        0,
      )
      .to(
        menuContentElement,
        {
          y: 18,
          autoAlpha: 0,
          duration: 0.16,
        },
        0.04,
      )
      .to(
        overlayElement,
        {
          autoAlpha: 0,
          backdropFilter: 'blur(0px)',
          duration: 0.2,
        },
        0.02,
      );

    menuAnimationRef.current = timeline;
  };

  useEffect(() => {
    if (!isMobileMenuMounted) {
      setIsMobileMenuOpen(false);
      return undefined;
    }

    const overlayElement = overlayRef.current;
    const menuContentElement = menuContentRef.current;
    const menuItems = menuContentElement?.querySelectorAll('[data-menu-item]');

    if (!overlayElement || !menuContentElement) {
      return undefined;
    }

    menuAnimationRef.current?.kill();

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.out' },
    });

    gsap.set(overlayElement, { autoAlpha: 0, backdropFilter: 'blur(0px)' });
    gsap.set(menuContentElement, { y: 24, autoAlpha: 0 });
    if (menuItems?.length) {
      gsap.set(menuItems, { y: 12, autoAlpha: 0 });
    }

    timeline
      .to(overlayElement, {
        autoAlpha: 1,
        duration: 0.22,
      })
      .to(
        overlayElement,
        {
          backdropFilter: 'blur(18px)',
          duration: 0.3,
        },
        0,
      )
      .to(
        menuContentElement,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.3,
        },
        0.06,
      );

    if (menuItems?.length) {
      timeline.to(
        menuItems,
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.04,
          duration: 0.2,
        },
        0.14,
      );
    }

    menuAnimationRef.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [isMobileMenuMounted]);

  useEffect(() => {
    if (!isMobileMenuMounted) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuMounted]);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname && isMobileMenuMounted) {
      closeMobileMenu(true);
    }

    previousPathnameRef.current = pathname;
  }, [isMobileMenuMounted, pathname]);

  useEffect(() => {
    return () => {
      menuAnimationRef.current?.kill();
    };
  }, []);

  const logoSrc = LOGO_BY_THEME[theme];
  const isViewLayout = variant === 'view';
  const rightNavLinks = isViewLayout ? NAV_LINKS.filter((link) => link.to !== '/') : NAV_LINKS;

  const handleThemeToggle = () => toggleTheme();

  const handleMenuToggle = () => {
    if (isMobileMenuMounted) {
      closeMobileMenu();
      return;
    }

    openMobileMenu();
  };

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-40">
        <div className={`flex w-full items-center justify-between px-4 py-4 sm:px-6 ${isViewLayout ? 'sm:py-4' : 'sm:py-5'} lg:px-10`}>
          <Link
            to="/"
            aria-label="Go to home page"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40"
          >
            <img src={logoSrc} alt="" className="h-9 w-9 object-contain" />
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <nav aria-label="Primary" className="hidden items-center gap-6 md:flex lg:gap-8">
              {rightNavLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className={getNavLinkClassName}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <ThemeToggleButton theme={theme} onToggle={handleThemeToggle} className="hidden md:inline-flex" />

            <button
              type="button"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={handleMenuToggle}
              className="inline-flex h-11 w-11 items-center justify-center text-black/82 transition-opacity duration-200 hover:opacity-65 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 md:hidden dark:text-white/82 dark:focus-visible:ring-white/40"
            >
              <MenuIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuMounted ? (
        <div
          id="mobile-navigation"
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-white/58 opacity-0 backdrop-blur-none md:hidden dark:bg-black/58"
        >
          <div ref={menuContentRef} className="flex min-h-screen flex-col px-4 py-4 opacity-0 sm:px-6">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                onClick={() => closeMobileMenu(true)}
                aria-label="Go to home page"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40"
              >
                <img src={logoSrc} alt="" className="h-9 w-9 object-contain" />
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
                className="inline-flex h-11 w-11 items-center justify-center text-black/82 transition-opacity duration-200 hover:opacity-65 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:text-white/82 dark:focus-visible:ring-white/40"
              >
                <MenuIcon isOpen />
              </button>
            </div>

            <nav
              aria-label="Mobile primary"
              className="flex flex-1 flex-col items-center justify-center gap-7 text-center pointer-events-auto"
            >
              {rightNavLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  data-menu-item
                  className={getMobileNavLinkClassName}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex justify-center pb-6 pt-4">
              <ThemeToggleButton theme={theme} onToggle={handleThemeToggle} className="" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Header;
