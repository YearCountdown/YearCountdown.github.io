import { useEffect, useMemo, useRef, useState } from 'react';

const DAY = 24 * 60 * 60 * 1000;

const getYearMeta = () => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeapYear ? 366 : 365;
  const currentDayIndex = Math.floor((now.getTime() - startOfYear.getTime()) / DAY);

  return {
    totalDays,
    currentDayIndex,
  };
};

const clampPositiveNumber = (value) => {
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const getBestGrid = ({ totalDots, width, height, gapPercent, insetPercent }) => {
  const minDimension = Math.min(width, height);
  const insetPx = clampPositiveNumber((minDimension * insetPercent) / 100);
  const innerWidth = Math.max(0, width - insetPx * 2);
  const innerHeight = Math.max(0, height - insetPx * 2);
  const gapPx = clampPositiveNumber((Math.min(innerWidth, innerHeight) * gapPercent) / 100);

  let best = {
    rows: totalDots,
    columns: 1,
    dotSize: 0,
    gapPx,
    insetPx,
    innerWidth,
    innerHeight,
  };

  for (let columns = 1; columns <= totalDots; columns += 1) {
    const rows = Math.ceil(totalDots / columns);
    const maxWidthSize = (innerWidth - gapPx * (columns - 1)) / columns;
    const maxHeightSize = (innerHeight - gapPx * (rows - 1)) / rows;
    const dotSize = Math.floor(Math.min(maxWidthSize, maxHeightSize));

    if (dotSize <= 0) {
      continue;
    }

    if (dotSize > best.dotSize) {
      best = {
        rows,
        columns,
        dotSize,
        gapPx,
        insetPx,
        innerWidth,
        innerHeight,
      };
    }
  }

  return best;
};

const useDotsGrid = ({ gapPercent, insetPercent }) => {
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
    const { totalDays, currentDayIndex } = getYearMeta();
    const grid = getBestGrid({
      totalDots: totalDays,
      width: containerSize.width,
      height: containerSize.height,
      gapPercent,
      insetPercent,
    });

    const visibleDots = Array.from({ length: totalDays }, (_, index) => {
      if (index < currentDayIndex) {
        return { key: `past-${index}`, status: 'past' };
      }

      if (index === currentDayIndex) {
        return { key: `current-${index}`, status: 'current' };
      }

      return { key: `future-${index}`, status: 'future' };
    });

    const fillerCount = Math.max(0, grid.rows * grid.columns - visibleDots.length);
    const fillerDots = Array.from({ length: fillerCount }, (_, index) => ({
      key: `filler-${index}`,
      status: 'filler',
    }));

    return {
      containerRef,
      totalDays,
      currentDayIndex,
      grid,
      dots: [...visibleDots, ...fillerDots],
    };
  }, [containerSize.height, containerSize.width, gapPercent, insetPercent]);
};

export default useDotsGrid;
