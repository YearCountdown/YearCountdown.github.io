import { useEffect, useMemo, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const useProgressLayout = ({
  mode,
  fullScreen,
  spaceTopPercent,
  spaceRightPercent,
  spaceBottomPercent,
  spaceLeftPercent,
}) => {
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
    const topPx = (minDimension * spaceTopPercent) / 100;
    const rightPx = (minDimension * spaceRightPercent) / 100;
    const bottomPx = (minDimension * spaceBottomPercent) / 100;
    const leftPx = (minDimension * spaceLeftPercent) / 100;
    const drawWidth = Math.max(0, width - leftPx - rightPx);
    const drawHeight = Math.max(0, height - topPx - bottomPx);
    const boxWidth = fullScreen ? drawWidth : drawWidth * (mode === 'field' ? 0.8 : 0.74);
    const boxHeight = fullScreen ? drawHeight : drawHeight * (mode === 'field' ? 0.68 : 0.5);
    const boxLeft = leftPx + (drawWidth - boxWidth) / 2;
    const boxTop = topPx + (drawHeight - boxHeight) / 2;
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
  }, [
    fullScreen,
    mode,
    size.height,
    size.width,
    spaceBottomPercent,
    spaceLeftPercent,
    spaceRightPercent,
    spaceTopPercent,
  ]);

  return {
    containerRef,
    layout,
  };
};

export default useProgressLayout;
