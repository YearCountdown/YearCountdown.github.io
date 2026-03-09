import { useEffect, useRef, useState } from 'react';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(FINE_POINTER_QUERY);

    const applyEnabledState = (enabled) => {
      setIsEnabled(enabled);
      document.documentElement.classList.toggle('has-custom-cursor', enabled);
    };

    applyEnabledState(mediaQuery.matches);

    const handleChange = (event) => {
      applyEnabledState(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') {
      return undefined;
    }

    const cursorElement = cursorRef.current;

    if (!cursorElement) {
      return undefined;
    }

    let isVisible = false;

    const handlePointerMove = (event) => {
      if (!isVisible) {
        cursorElement.style.opacity = '1';
        isVisible = true;
      }

      cursorElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursorElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };

    const handlePointerLeave = () => {
      cursorElement.style.opacity = '0';
      isVisible = false;
    };

    const handlePointerDown = () => {
      cursorElement.dataset.active = 'true';
    };

    const handlePointerUp = () => {
      cursorElement.dataset.active = 'false';
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('blur', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-active="false"
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[100] opacity-0"
    >
      <span className="custom-cursor__ring" />
      <span className="custom-cursor__dot" />
    </div>
  );
};

export default CustomCursor;
