import { useEffect, useMemo, useRef, useState } from 'react';

import useCountdown from '../../hooks/useCountdown';
import useDotsGrid from '../../hooks/useDotsGrid';
import useYearProgress from '../../hooks/useYearProgress';
import { getToneColor, getViewSurfacePalette, withAlpha } from '../../lib/viewColors';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getTriangleRotation = ({ triangleMode, triangleAngle, row, column }) => {
  if (triangleMode === 'angle') {
    return triangleAngle;
  }

  if (triangleMode === 'inverted') {
    return 180;
  }

  if (triangleMode === 'alternating') {
    return (row + column) % 2 === 0 ? 0 : 180;
  }

  return 0;
};

const getDotStyle = ({ status, shape, size, rotation, primaryColor, inactiveOpacity }) => {
  if (status === 'filler') {
    return {
      visibility: 'hidden',
      width: `${size}px`,
      height: `${size}px`,
    };
  }

  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: status === 'future' ? withAlpha(primaryColor, inactiveOpacity / 100) : primaryColor,
    transform: `rotate(${rotation}deg)`,
  };

  if (shape === 'circle') {
    return {
      ...baseStyle,
      borderRadius: '9999px',
    };
  }

  if (shape === 'square') {
    return {
      ...baseStyle,
      borderRadius: '12%',
    };
  }

  return {
    ...baseStyle,
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  };
};

const getCardSurface = (primaryColor, textToneColor) => ({
  backgroundColor: withAlpha(primaryColor, 0.06),
  border: `1px solid ${withAlpha(textToneColor, 0.14)}`,
  boxShadow: `0 20px 50px ${withAlpha(textToneColor, 0.08)}`,
});

const getPerimeterPath = ({ x, y, width, height, strokeWidth }) => {
  const inset = strokeWidth / 2;
  const rectWidth = Math.max(0, width - strokeWidth);
  const rectHeight = Math.max(0, height - strokeWidth);

  return [
    `M ${x + inset + rectWidth / 2} ${y + inset}`,
    `L ${x + inset + rectWidth} ${y + inset}`,
    `L ${x + inset + rectWidth} ${y + inset + rectHeight}`,
    `L ${x + inset} ${y + inset + rectHeight}`,
    `L ${x + inset} ${y + inset}`,
    `L ${x + inset + rectWidth / 2} ${y + inset}`,
  ].join(' ');
};

const PerimeterProgress = ({
  viewportWidth,
  viewportHeight,
  x,
  y,
  width,
  height,
  percentage,
  strokeWidth,
  primaryColor,
  alternateColor,
}) => {
  const palette = getViewSurfacePalette(primaryColor, alternateColor);
  const perimeter = 2 * (Math.max(0, width - strokeWidth) + Math.max(0, height - strokeWidth));
  const pathD = getPerimeterPath({ x, y, width, height, strokeWidth });

  return (
    <svg
      className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
      viewBox={`0 0 ${Math.max(viewportWidth, 1)} ${Math.max(viewportHeight, 1)}`}
      aria-hidden="true"
    >
      <path d={pathD} fill="none" stroke={palette.outlineTrack} strokeWidth={strokeWidth} strokeLinecap="butt" />
      <path
        d={pathD}
        fill="none"
        stroke={palette.primary}
        strokeWidth={strokeWidth}
        strokeDasharray={perimeter}
        strokeDashoffset={perimeter * (1 - percentage / 100)}
        strokeLinecap="round"
      />
    </svg>
  );
};

const DaysCard = ({ countdownDays, daysLabel, daysFontSize, width, height, primaryColor, textToneColor }) => {
  const cardSurface = getCardSurface(primaryColor, textToneColor);
  const base = Math.min(width, height);
  const horizontalPadding = clamp(base * 0.12, 14, 24);
  const verticalPadding = clamp(base * 0.1, 12, 20);
  const radius = clamp(base * 0.18, 18, 28);
  const numberSize = clamp(base * 0.44 * daysFontSize, 18, 112);
  const labelSize = clamp(numberSize * 0.15, 9, 18);

  return (
    <div
      className="flex h-full w-full min-w-0 flex-col justify-center backdrop-blur-xl"
      style={{
        ...cardSurface,
        borderRadius: `${radius}px`,
        padding: `${verticalPadding}px ${horizontalPadding}px`,
      }}
    >
      {daysLabel ? (
        <p
          className="overflow-hidden text-ellipsis whitespace-nowrap uppercase"
          style={{
            fontSize: `${labelSize}px`,
            letterSpacing: '0.24em',
            color: withAlpha(textToneColor, 0.6),
          }}
        >
          Days Left
        </p>
      ) : null}
      <span
        className="mt-2 block overflow-hidden text-ellipsis whitespace-nowrap font-light leading-none"
        style={{
          fontSize: `${numberSize}px`,
          letterSpacing: '-0.06em',
          color: primaryColor,
        }}
      >
        {countdownDays}
      </span>
    </div>
  );
};

const PercentCard = ({ percentageLabel, percentage, width, height, primaryColor, textToneColor }) => {
  const cardSurface = getCardSurface(primaryColor, textToneColor);
  const base = Math.min(width, height);
  const horizontalPadding = clamp(base * 0.12, 14, 24);
  const verticalPadding = clamp(base * 0.1, 12, 20);
  const radius = clamp(base * 0.18, 18, 28);
  const percentageFontSize = clamp(base * (percentageLabel.length > 6 ? 0.18 : 0.21), 18, 60);
  const labelSize = clamp(percentageFontSize * 0.22, 10, 18);
  const progressBarHeight = clamp(height * 0.09, 6, 16);

  return (
    <div
      className="flex h-full w-full min-w-0 flex-col backdrop-blur-xl"
      style={{
        ...cardSurface,
        borderRadius: `${radius}px`,
        padding: `${verticalPadding}px ${horizontalPadding}px`,
      }}
    >
      <p
        className="overflow-hidden text-ellipsis whitespace-nowrap uppercase"
        style={{
          fontSize: `${labelSize}px`,
          letterSpacing: '0.24em',
          color: withAlpha(textToneColor, 0.6),
        }}
      >
        Year Done
      </p>
      <span
        className="mt-2 block overflow-hidden text-ellipsis whitespace-nowrap font-light leading-none"
        style={{
          fontSize: `${percentageFontSize}px`,
          letterSpacing: '-0.06em',
          color: textToneColor,
        }}
      >
        {percentageLabel}
      </span>
      <div
        className="mt-auto overflow-hidden rounded-full"
        style={{
          height: `${progressBarHeight}px`,
          backgroundColor: withAlpha(textToneColor, 0.1),
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: primaryColor,
          }}
        />
      </div>
    </div>
  );
};

const AllView = ({
  dotsMode = 'days',
  dotsCount = 365,
  showDays = true,
  showPercentBox = true,
  showPerimeter = true,
  shape = 'circle',
  triangleMode = 'alternating',
  triangleAngle = 0,
  gapX = 0.5,
  gapY = 0.5,
  inactiveOpacity = 5,
  daysFontSize = 1,
  daysLabel = true,
  decimals = 2,
  percentBoxSize = 'medium',
  perimeterThickness = 6,
  spaceTop = 0,
  spaceRight = 0,
  spaceBottom = 0,
  spaceLeft = 0,
  primaryColor,
  alternateColor,
  textTone,
}) => {
  const outerRef = useRef(null);
  const [outerSize, setOuterSize] = useState({ width: 0, height: 0 });
  const countdown = useCountdown();
  const progress = useYearProgress(decimals);
  const totalDots = dotsMode === 'custom' ? dotsCount : undefined;
  const completedDots =
    dotsMode === 'custom' ? Math.round((progress.percentage / 100) * Math.max(1, dotsCount)) : undefined;
  const { containerRef: dotsRef, dots, grid } = useDotsGrid({
    gapXPercent: gapX,
    gapYPercent: gapY,
    spaceTopPercent: 0,
    spaceRightPercent: 0,
    spaceBottomPercent: 0,
    spaceLeftPercent: 0,
    totalDots,
    completedCount: completedDots,
  });
  const textToneColor = getToneColor(textTone);

  useEffect(() => {
    const element = outerRef.current;

    if (!element) {
      return undefined;
    }

    const updateSize = () => {
      setOuterSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      setOuterSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const layout = useMemo(() => {
    const width = Math.max(outerSize.width, 0);
    const height = Math.max(outerSize.height, 0);
    const base = Math.min(width, height);
    const frameLeft = (base * spaceLeft) / 100;
    const frameRight = (base * spaceRight) / 100;
    const frameTop = (base * spaceTop) / 100;
    const frameBottom = (base * spaceBottom) / 100;
    const frameWidth = Math.max(0, width - frameLeft - frameRight);
    const frameHeight = Math.max(0, height - frameTop - frameBottom);
    const frameMin = Math.min(frameWidth, frameHeight);
    const perimeterInset = showPerimeter ? clamp(perimeterThickness * 1.5 + frameMin * 0.018, 10, 36) : 0;
    const contentLeft = frameLeft + perimeterInset;
    const contentTop = frameTop + perimeterInset;
    const contentWidth = Math.max(0, frameWidth - perimeterInset * 2);
    const contentHeight = Math.max(0, frameHeight - perimeterInset * 2);
    const topItemCount = Number(showDays) + Number(showPercentBox);
    const aspectRatio = contentHeight > 0 ? contentWidth / contentHeight : 1;
    const isNarrow = contentWidth < 720;
    const isShort = contentHeight < 520;
    const isStacked = topItemCount === 2 && (contentWidth < 760 || contentHeight < 560 || aspectRatio < 1.2);
    const topGap = topItemCount > 0 ? clamp(frameMin * 0.028, 10, 24) : 0;
    const preferredTopHeight =
      topItemCount === 0
        ? 0
        : topItemCount === 1
          ? clamp(contentHeight * (isShort ? 0.16 : 0.14), 68, 128)
          : isStacked
            ? clamp(contentHeight * (isShort ? 0.3 : 0.26), 120, 210)
            : clamp(contentHeight * (isNarrow ? 0.2 : 0.17), 82, 150);
    const maxTopHeight =
      topItemCount === 0
        ? 0
        : topItemCount === 1
          ? contentHeight * 0.22
          : isStacked
            ? contentHeight * 0.36
            : contentHeight * 0.24;
    const topHeight = topItemCount === 0 ? 0 : Math.min(preferredTopHeight, maxTopHeight);
    const dotsTop = contentTop + topHeight + topGap;
    const dotsHeight = Math.max(0, contentHeight - topHeight - topGap);
    const topColumns = topItemCount === 2 && !isStacked ? 2 : 1;
    const topRows = topItemCount === 2 && isStacked ? 2 : topItemCount > 0 ? 1 : 0;
    const percentBoxShare =
      percentBoxSize === 'small' ? 0.42 : percentBoxSize === 'large' ? 0.58 : 0.5;
    const daysBoxWidth =
      topColumns === 2 ? Math.max(0, (contentWidth - topGap) * (1 - percentBoxShare)) : contentWidth;
    const percentBoxWidth =
      topColumns === 2 ? Math.max(0, (contentWidth - topGap) * percentBoxShare) : contentWidth;
    const topCellHeight =
      topItemCount === 0
        ? 0
        : topRows === 2
          ? (topHeight - topGap) / 2
          : topHeight;

    return {
      viewportWidth: width,
      viewportHeight: height,
      frameLeft,
      frameTop,
      frameWidth,
      frameHeight,
      contentLeft,
      contentTop,
      contentWidth,
      contentHeight,
      topGap,
      topHeight,
      dotsTop,
      dotsHeight,
      topColumns,
      topRows,
      daysBoxWidth,
      percentBoxWidth,
      topCellHeight,
    };
  }, [
    outerSize.height,
    outerSize.width,
    perimeterThickness,
    percentBoxSize,
    showDays,
    showPercentBox,
    showPerimeter,
    spaceBottom,
    spaceLeft,
    spaceRight,
    spaceTop,
  ]);

  return (
    <section
      ref={outerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: alternateColor }}
    >
      {showPerimeter && layout.frameWidth > 0 && layout.frameHeight > 0 ? (
        <PerimeterProgress
          viewportWidth={layout.viewportWidth}
          viewportHeight={layout.viewportHeight}
          x={layout.frameLeft}
          y={layout.frameTop}
          width={layout.frameWidth}
          height={layout.frameHeight}
          percentage={progress.percentage}
          strokeWidth={perimeterThickness}
          primaryColor={primaryColor}
          alternateColor={alternateColor}
        />
      ) : null}

      {layout.topHeight > 0 ? (
        <div
          className="absolute grid"
          style={{
            left: `${layout.contentLeft}px`,
            top: `${layout.contentTop}px`,
            width: `${layout.contentWidth}px`,
            height: `${layout.topHeight}px`,
            gridTemplateColumns: `repeat(${layout.topColumns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${layout.topRows}, minmax(0, 1fr))`,
            gap: `${layout.topGap}px`,
          }}
        >
          {showDays ? (
            <DaysCard
              countdownDays={countdown.days}
              daysLabel={daysLabel}
              daysFontSize={daysFontSize}
              width={layout.daysBoxWidth}
              height={layout.topCellHeight}
              primaryColor={primaryColor}
              textToneColor={textToneColor}
            />
          ) : null}
          {showPercentBox ? (
            <PercentCard
              percentageLabel={progress.percentageLabel}
              percentage={progress.percentage}
              width={layout.percentBoxWidth}
              height={layout.topCellHeight}
              primaryColor={primaryColor}
              textToneColor={textToneColor}
            />
          ) : null}
        </div>
      ) : null}

      {layout.dotsHeight > 0 ? (
        <div
          ref={dotsRef}
          className="absolute overflow-hidden"
          style={{
            left: `${layout.contentLeft}px`,
            top: `${layout.dotsTop}px`,
            width: `${layout.contentWidth}px`,
            height: `${layout.dotsHeight}px`,
          }}
        >
          <div
            className="absolute grid"
            style={{
              left: `${grid.leftPx}px`,
              top: `${grid.topPx}px`,
              width: `${grid.innerWidth}px`,
              height: `${grid.innerHeight}px`,
              gridTemplateColumns: `repeat(${grid.columns}, ${grid.dotSize}px)`,
              gridAutoRows: `${grid.dotSize}px`,
              columnGap: `${grid.gapXPx}px`,
              rowGap: `${grid.gapYPx}px`,
              justifyContent: 'space-between',
              alignContent: 'space-between',
            }}
          >
            {dots.map((dot, index) => {
              const column = index % grid.columns;
              const row = Math.floor(index / grid.columns);

              return (
                <div
                  key={dot.key}
                  aria-hidden="true"
                  style={getDotStyle({
                    status: dot.status,
                    shape,
                    size: grid.dotSize,
                    rotation:
                      shape === 'triangle'
                        ? getTriangleRotation({
                            triangleMode,
                            triangleAngle,
                            row,
                            column,
                          })
                        : 0,
                    primaryColor,
                    inactiveOpacity,
                  })}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AllView;
