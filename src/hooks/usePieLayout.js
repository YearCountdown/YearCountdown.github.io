import { useEffect, useMemo, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const usePieLayout = ({
  shape,
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
    const showBelowLabel = !fullScreen;
    const belowLabelGap = showBelowLabel ? clamp(minDimension * 0.02, 8, 14) : 0;
    const belowLabelHeight = showBelowLabel ? clamp(minDimension * 0.1, 20, 52) : 0;
    const shapeAreaHeight = Math.max(0, drawHeight - belowLabelGap - belowLabelHeight);

    let boxWidth = drawWidth;
    let boxHeight = shapeAreaHeight;

    if (shape === 'circle' || !fullScreen) {
      const squareSize = Math.max(0, Math.min(drawWidth, shapeAreaHeight));
      boxWidth = squareSize;
      boxHeight = squareSize;
    }

    const boxOffsetLeft = (drawWidth - boxWidth) / 2;
    const boxOffsetTop = (shapeAreaHeight - boxHeight) / 2;
    const shapeMin = Math.max(0, Math.min(boxWidth, boxHeight));
    const fullScreenFontSize = clamp(shapeMin * (shape === 'rectangle' && fullScreen ? 0.15 : 0.2), 60, 100);
    const belowFontSize = clamp(shapeMin * 0.095, 18, 42);

    return {
      width,
      height,
      contentLeft: leftPx,
      contentTop: topPx,
      contentWidth: drawWidth,
      contentHeight: drawHeight,
      boxOffsetLeft,
      boxOffsetTop,
      boxWidth,
      boxHeight,
      shapeMin,
      labelOffsetY: shapeAreaHeight + belowLabelGap,
      labelHeight: belowLabelHeight,
      showBelowLabel,
      fullScreenFontSize,
      belowFontSize,
    };
  }, [
    fullScreen,
    shape,
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

export default usePieLayout;
