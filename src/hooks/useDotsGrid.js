import { useEffect, useMemo, useRef, useState } from 'react';

import { getDotsSnapshot } from '../lib/dotsMath';

const useDotsGrid = ({
  gapXPercent,
  gapYPercent,
  spaceTopPercent,
  spaceRightPercent,
  spaceBottomPercent,
  spaceLeftPercent,
  totalDots,
  completedCount,
}) => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return undefined;
    }

    const updateSize = (nextWidth, nextHeight) => {
      setContainerSize({
        width: nextWidth,
        height: nextHeight,
      });
    };

    updateSize(element.clientWidth, element.clientHeight);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      updateSize(entry.contentRect.width, entry.contentRect.height);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return useMemo(() => {
    const { totalDays, currentDayIndex, grid, dots } = getDotsSnapshot({
      width: containerSize.width,
      height: containerSize.height,
      gapXPercent,
      gapYPercent,
      spaceTopPercent,
      spaceRightPercent,
      spaceBottomPercent,
      spaceLeftPercent,
      totalDotsOverride: totalDots,
      completedCountOverride: completedCount,
    });

    return {
      containerRef,
      width: containerSize.width,
      height: containerSize.height,
      totalDays,
      currentDayIndex,
      grid,
      dots,
    };
  }, [
    containerSize.height,
    containerSize.width,
    gapXPercent,
    gapYPercent,
    spaceBottomPercent,
    completedCount,
    spaceLeftPercent,
    spaceRightPercent,
    spaceTopPercent,
    totalDots,
  ]);
};

export default useDotsGrid;
