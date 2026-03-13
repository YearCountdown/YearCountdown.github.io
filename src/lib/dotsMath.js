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
  spaceTopPercent,
  spaceRightPercent,
  spaceBottomPercent,
  spaceLeftPercent,
}) => {
  const minDimension = Math.min(width, height);
  const topPx = clampPositiveNumber((minDimension * spaceTopPercent) / 100);
  const rightPx = clampPositiveNumber((minDimension * spaceRightPercent) / 100);
  const bottomPx = clampPositiveNumber((minDimension * spaceBottomPercent) / 100);
  const leftPx = clampPositiveNumber((minDimension * spaceLeftPercent) / 100);
  const innerWidth = Math.max(0, width - leftPx - rightPx);
  const innerHeight = Math.max(0, height - topPx - bottomPx);
  const spacingBase = Math.min(innerWidth, innerHeight);
  const gapXPx = clampPositiveNumber((spacingBase * gapXPercent) / 100);
  const gapYPx = clampPositiveNumber((spacingBase * gapYPercent) / 100);

  let best = {
    rows: totalDots,
    columns: 1,
    dotSize: 0,
    gapXPx,
    gapYPx,
    topPx,
    rightPx,
    bottomPx,
    leftPx,
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
        topPx,
        rightPx,
        bottomPx,
        leftPx,
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
  spaceTopPercent,
  spaceRightPercent,
  spaceBottomPercent,
  spaceLeftPercent,
  totalDotsOverride,
  completedCountOverride,
  nowTime = Date.now(),
  timezone,
}) => {
  const { totalDays, currentDayIndex } = getYearMeta(nowTime, timezone);
  const totalDots = Number.isFinite(totalDotsOverride)
    ? Math.max(1, Math.round(totalDotsOverride))
    : totalDays;
  const grid = getBestDotsGrid({
    totalDots,
    width,
    height,
    gapXPercent,
    gapYPercent,
    spaceTopPercent,
    spaceRightPercent,
    spaceBottomPercent,
    spaceLeftPercent,
  });

  const completedCount = Number.isFinite(completedCountOverride)
    ? Math.max(0, Math.min(totalDots, Math.round(completedCountOverride)))
    : Math.max(0, Math.min(totalDots, currentDayIndex + 1));

  const visibleDots = Array.from({ length: totalDots }, (_, index) => {
    if (Number.isFinite(totalDotsOverride)) {
      return {
        key: `${index < completedCount ? 'past' : 'future'}-${index}`,
        status: index < completedCount ? 'past' : 'future',
      };
    }

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
    totalDays: totalDots,
    currentDayIndex,
    completedCount,
    grid,
    dots: [...visibleDots, ...fillerDots],
  };
};
