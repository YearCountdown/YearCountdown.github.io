import { useEffect, useMemo, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const useProgressLayout = ({ mode, fullScreen, insetPercent, outerXPercent, outerYPercent }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return undefined;
    }

    const updateSize = () => {
      const nextWidth = element.clientWidth;
      const nextHeight = element.clientHeight;

      setSize((current) => {
        if (current.width === nextWidth && current.height === nextHeight) {
          return current;
        }

        return { width: nextWidth, height: nextHeight };
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const layout = useMemo(() => {
    const width = Math.max(size.width, 120);
    const height = Math.max(size.height, 120);
    const minDimension = Math.min(width, height);
    const insetPx = (minDimension * insetPercent) / 100;
    const insetWidth = Math.max(0, width - insetPx * 2);
    const insetHeight = Math.max(0, height - insetPx * 2);
    const outerXPx = (insetWidth * outerXPercent) / 100;
    const outerYPx = (insetHeight * outerYPercent) / 100;
    const drawWidth = Math.max(0, insetWidth - outerXPx * 2);
    const drawHeight = Math.max(0, insetHeight - outerYPx * 2);
    const boxWidth = fullScreen ? drawWidth : drawWidth * (mode === 'field' ? 0.8 : 0.74);
    const boxHeight = fullScreen ? drawHeight : drawHeight * (mode === 'field' ? 0.68 : 0.5);
    const boxLeft = insetPx + outerXPx + (drawWidth - boxWidth) / 2;
    const boxTop = insetPx + outerYPx + (drawHeight - boxHeight) / 2;
    const textBase = Math.min(boxWidth, boxHeight);

    return {
      width,
      height,
      boxLeft,
      boxTop,
      boxWidth,
      boxHeight,
      fullScreenFontSize: clamp(textBase * (mode === 'field' ? 0.13 : 0.11), 16, 64),
      centeredFontSize: clamp(textBase * (mode === 'field' ? 0.16 : 0.14), 20, 84),
    };
  }, [fullScreen, insetPercent, mode, outerXPercent, outerYPercent, size.height, size.width]);

  return {
    containerRef,
    layout,
  };
};

export default useProgressLayout;
