import { useEffect, useRef, useState } from 'react';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
const CURSOR_MESSAGE_TYPE = 'yc-cursor-sync';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(FINE_POINTER_QUERY);
    const searchParams = new URLSearchParams(window.location.search);
    const isEmbeddedFrame = window.self !== window.top;
    const isEmbedView = searchParams.get('embed') === 'true';

    const applyEnabledState = (enabled) => {
      const shouldEnable = enabled && !isEmbeddedFrame && !isEmbedView;
      const shouldHideNativeCursor = enabled && isEmbeddedFrame;

      setIsEnabled(shouldEnable);
      document.documentElement.classList.toggle('has-custom-cursor', shouldEnable || shouldHideNativeCursor);
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
    if (typeof window === 'undefined' || window.self === window.top) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      window.parent.postMessage(
        {
          type: CURSOR_MESSAGE_TYPE,
          action: 'move',
          x: event.clientX,
          y: event.clientY,
        },
        '*',
      );
    };

    const handlePointerDown = () => {
      window.parent.postMessage({ type: CURSOR_MESSAGE_TYPE, action: 'down' }, '*');
    };

    const handlePointerUp = () => {
      window.parent.postMessage({ type: CURSOR_MESSAGE_TYPE, action: 'up' }, '*');
    };

    const handlePointerLeave = () => {
      window.parent.postMessage({ type: CURSOR_MESSAGE_TYPE, action: 'leave' }, '*');
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

    const setCursorPosition = (x, y) => {
      if (!isVisible) {
        cursorElement.style.opacity = '1';
        isVisible = true;
      }

      cursorElement.style.setProperty('--cursor-x', `${x}px`);
      cursorElement.style.setProperty('--cursor-y', `${y}px`);
    };

    const handlePointerMove = (event) => {
      setCursorPosition(event.clientX, event.clientY);
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

    const handleMessage = (event) => {
      const data = event.data;

      if (!data || data.type !== CURSOR_MESSAGE_TYPE) {
        return;
      }

      if (data.action === 'leave') {
        handlePointerLeave();
        return;
      }

      if (data.action === 'down') {
        handlePointerDown();
        return;
      }

      if (data.action === 'up') {
        handlePointerUp();
        return;
      }

      if (data.action !== 'move') {
        return;
      }

      const iframe = Array.from(document.querySelectorAll('iframe')).find((candidate) => candidate.contentWindow === event.source);

      if (!iframe) {
        return;
      }

      const rect = iframe.getBoundingClientRect();
      setCursorPosition(rect.left + data.x, rect.top + data.y);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('message', handleMessage);
    window.addEventListener('blur', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('message', handleMessage);
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
