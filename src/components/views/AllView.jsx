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
  const countdown = useCountdown();
  const progress = useYearProgress(decimals);
  const totalDots = dotsMode === 'custom' ? dotsCount : undefined;
  const completedDots =
    dotsMode === 'custom' ? Math.round((progress.percentage / 100) * Math.max(1, dotsCount)) : undefined;
  const { containerRef, dots, grid, width, height } = useDotsGrid({
    gapXPercent: gapX,
    gapYPercent: gapY,
    spaceTopPercent: spaceTop,
    spaceRightPercent: spaceRight,
    spaceBottomPercent: spaceBottom,
    spaceLeftPercent: spaceLeft,
    totalDots,
    completedCount: completedDots,
  });
  const textToneColor = getToneColor(textTone);
  const contentWidth = grid.innerWidth;
  const contentHeight = grid.innerHeight;
  const contentLeft = grid.leftPx;
  const contentTop = grid.topPx;
  const minContent = Math.min(contentWidth || 0, contentHeight || 0);
  const moduleInset = clamp(minContent * 0.04, 12, 34);
  const isCompact = contentWidth < 560 || contentHeight < 460;
  const percentBoxScale =
    percentBoxSize === 'small' ? 0.22 : percentBoxSize === 'large' ? 0.34 : 0.28;
  const percentBoxWidth = clamp(contentWidth * (isCompact ? 0.6 : percentBoxScale), 168, 360);
  const percentBoxHeight = clamp(contentHeight * (isCompact ? 0.18 : 0.22), 94, 180);
  const percentBoxLeft = isCompact
    ? contentLeft + (contentWidth - percentBoxWidth) / 2
    : contentLeft + contentWidth - moduleInset - percentBoxWidth;
  const percentBoxTop = contentTop + contentHeight - moduleInset - percentBoxHeight;
  const daysBlockWidth = clamp(contentWidth * (isCompact ? 0.58 : 0.26), 144, 320);
  const daysBlockHeight = clamp(contentHeight * (isCompact ? 0.17 : 0.2), 86, 190);
  const daysBlockLeft = isCompact ? contentLeft + (contentWidth - daysBlockWidth) / 2 : contentLeft + moduleInset;
  const daysBlockTop = contentTop + moduleInset;
  const daysNumberSize = clamp(Math.min(daysBlockWidth, daysBlockHeight) * 0.56 * daysFontSize, 24, 140);
  const daysLabelSize = clamp(daysNumberSize * 0.16, 11, 22);
  const percentageLength = progress.percentageLabel.length;
  const percentageFontSize = clamp(
    Math.min(percentBoxWidth, percentBoxHeight) * (percentageLength > 6 ? 0.2 : 0.24),
    22,
    72,
  );
  const progressBarHeight = clamp(percentBoxHeight * 0.12, 6, 18);
  const cardSurface = getCardSurface(primaryColor, textToneColor);

  return (
    <section
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: alternateColor }}
    >
      <div
        className="absolute grid"
        style={{
          left: `${contentLeft}px`,
          top: `${contentTop}px`,
          width: `${contentWidth}px`,
          height: `${contentHeight}px`,
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

      {showPerimeter && contentWidth > 0 && contentHeight > 0 ? (
        <PerimeterProgress
          viewportWidth={width}
          viewportHeight={height}
          x={contentLeft}
          y={contentTop}
          width={contentWidth}
          height={contentHeight}
          percentage={progress.percentage}
          strokeWidth={perimeterThickness}
          primaryColor={primaryColor}
          alternateColor={alternateColor}
        />
      ) : null}

      {showDays && contentWidth > 0 && contentHeight > 0 ? (
        <div
          className="absolute flex flex-col justify-center rounded-[1.75rem] px-6 py-5 backdrop-blur-xl"
          style={{
            left: `${daysBlockLeft}px`,
            top: `${daysBlockTop}px`,
            width: `${daysBlockWidth}px`,
            minHeight: `${daysBlockHeight}px`,
            ...cardSurface,
          }}
        >
          {daysLabel ? (
            <p
              className="uppercase"
              style={{
                fontSize: `${daysLabelSize}px`,
                letterSpacing: '0.24em',
                color: withAlpha(textToneColor, 0.6),
              }}
            >
              Days Left
            </p>
          ) : null}
          <span
            className="mt-2 block font-light leading-none"
            style={{
              fontSize: `${daysNumberSize}px`,
              letterSpacing: '-0.06em',
              color: primaryColor,
            }}
          >
            {countdown.days}
          </span>
        </div>
      ) : null}

      {showPercentBox && contentWidth > 0 && contentHeight > 0 ? (
        <div
          className="absolute flex flex-col rounded-[1.75rem] px-6 py-5 backdrop-blur-xl"
          style={{
            left: `${percentBoxLeft}px`,
            top: `${percentBoxTop}px`,
            width: `${percentBoxWidth}px`,
            minHeight: `${percentBoxHeight}px`,
            ...cardSurface,
          }}
        >
          <p
            className="uppercase"
            style={{
              fontSize: `${clamp(percentageFontSize * 0.22, 11, 18)}px`,
              letterSpacing: '0.24em',
              color: withAlpha(textToneColor, 0.6),
            }}
          >
            Year Done
          </p>
          <span
            className="mt-2 block font-light leading-none"
            style={{
              fontSize: `${percentageFontSize}px`,
              letterSpacing: '-0.06em',
              color: textToneColor,
            }}
          >
            {progress.percentageLabel}
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
                width: `${progress.percentage}%`,
                height: '100%',
                backgroundColor: primaryColor,
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AllView;
