import { getYearMeta } from './timeMath';

const clampPositiveNumber = (value) => {
  return Number.isFinite(value) && value > 0 ? value : 0;
};

export const getBestDotsGrid = ({
  totalDots,
  width,
  height,
  gapXPercent,
  gapYPercent,
  insetPercent,
  outerXPercent,
  outerYPercent,
}) => {
  const minDimension = Math.min(width, height);
  const insetPx = clampPositiveNumber((minDimension * insetPercent) / 100);
  const insetWidth = Math.max(0, width - insetPx * 2);
  const insetHeight = Math.max(0, height - insetPx * 2);
  const outerXPx = clampPositiveNumber((insetWidth * outerXPercent) / 100);
  const outerYPx = clampPositiveNumber((insetHeight * outerYPercent) / 100);
  const innerWidth = Math.max(0, insetWidth - outerXPx * 2);
  const innerHeight = Math.max(0, insetHeight - outerYPx * 2);
  const spacingBase = Math.min(innerWidth, innerHeight);
  const gapXPx = clampPositiveNumber((spacingBase * gapXPercent) / 100);
  const gapYPx = clampPositiveNumber((spacingBase * gapYPercent) / 100);

  let best = {
    rows: totalDots,
    columns: 1,
    dotSize: 0,
    gapXPx,
    gapYPx,
    insetPx,
    outerXPx,
    outerYPx,
    innerWidth,
    innerHeight,
  };

  for (let columns = 1; columns <= totalDots; columns += 1) {
    const rows = Math.ceil(totalDots / columns);
    const maxWidthSize = (innerWidth - gapXPx * (columns - 1)) / columns;
    const maxHeightSize = (innerHeight - gapYPx * (rows - 1)) / rows;
    const dotSize = Math.floor(Math.min(maxWidthSize, maxHeightSize));

    if (dotSize <= 0) {
      continue;
    }

    if (dotSize > best.dotSize) {
      best = {
        rows,
        columns,
        dotSize,
        gapXPx,
        gapYPx,
        insetPx,
        outerXPx,
        outerYPx,
        innerWidth,
        innerHeight,
      };
    }
  }

  return best;
};

export const getDotsSnapshot = ({
  width,
  height,
  gapXPercent,
  gapYPercent,
  insetPercent,
  outerXPercent,
  outerYPercent,
  nowTime = Date.now(),
}) => {
  const { totalDays, currentDayIndex } = getYearMeta(nowTime);
  const grid = getBestDotsGrid({
    totalDots: totalDays,
    width,
    height,
    gapXPercent,
    gapYPercent,
    insetPercent,
    outerXPercent,
    outerYPercent,
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
    totalDays,
    currentDayIndex,
    grid,
    dots: [...visibleDots, ...fillerDots],
  };
};
