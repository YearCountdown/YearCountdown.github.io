import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { useTheme } from '../../context/ThemeContext';
import { getBrandAssetForTheme } from '../../lib/brand';

const HOME_LOADER_SESSION_KEY = 'yc_home_loader_seen';

const HomeIntroLoader = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return !window.sessionStorage.getItem(HOME_LOADER_SESSION_KEY);
  });
  const overlayRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !overlayRef.current || !logoRef.current) {
      return undefined;
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(HOME_LOADER_SESSION_KEY, 'true');
    }

    const timeline = gsap.timeline({
      onComplete: () => setIsVisible(false),
    });

    timeline
      .fromTo(
        logoRef.current,
        { autoAlpha: 0, scale: 0.92, y: 8 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'power2.out' },
      )
      .to(logoRef.current, { autoAlpha: 0, scale: 1.03, y: -6, duration: 0.32, ease: 'power2.in' }, '+=0.36')
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.28, ease: 'power2.out' }, '-=0.1');

    return () => {
      timeline.kill();
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-100 dark:bg-zinc-950"
    >
      <img ref={logoRef} src={getBrandAssetForTheme(theme, 'logo')} alt="" className="h-auto w-32 sm:w-40" />
    </div>
  );
};

export default HomeIntroLoader;
