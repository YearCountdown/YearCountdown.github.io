import { useId } from 'react';

import usePieLayout from '../../hooks/usePieLayout';
import useYearProgress from '../../hooks/useYearProgress';
import { getViewSurfacePalette } from '../../lib/viewColors';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const getSectorPath = ({ centerX, centerY, radius, percentage }) => {
  if (percentage <= 0) {
    return '';
  }

  if (percentage >= 100) {
    return `M ${centerX} ${centerY} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
  }

  const angle = (percentage / 100) * 360;
  const start = polarToCartesian(centerX, centerY, radius, 0);
  const end = polarToCartesian(centerX, centerY, radius, angle);
  const largeArcFlag = angle > 180 ? 1 : 0;

  return [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
};

const getSurfaceColors = (primaryColor, alternateColor) => {
  const palette = getViewSurfacePalette(primaryColor, alternateColor);

  return {
    elapsed: palette.primary,
    remaining: palette.mutedSurface,
    outlineTrack: palette.outlineTrack,
    outlineFill: palette.primary,
    textOnElapsed: palette.textOnElapsed,
    textOnRemaining: palette.textOnRemaining,
  };
};

const FilledCenterLabel = ({ label, fontSize, outerClipId, sectorClipId, centerX, centerY, primaryColor, alternateColor }) => {
  const colors = getSurfaceColors(primaryColor, alternateColor);

  return (
    <>
      <g clipPath={`url(#${outerClipId})`}>
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={colors.textOnRemaining}
          style={{ fontSize: `${fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          {label}
        </text>
      </g>
      <g clipPath={`url(#${outerClipId})`}>
        <g clipPath={`url(#${sectorClipId})`}>
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors.textOnElapsed}
            style={{ fontSize: `${fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
          >
            {label}
          </text>
        </g>
      </g>
    </>
  );
};

const CircleFilled = ({ width, height, percentage, label, ids, showCenterLabel, fontSize, primaryColor, alternateColor }) => {
  const colors = getSurfaceColors(primaryColor, alternateColor);
  const centerX = width / 2;
  const centerY = height / 2;
  const clipRadius = Math.min(width, height) * 0.48;
  const sectorRadius = clipRadius;
  const sectorPath = getSectorPath({ centerX, centerY, radius: sectorRadius, percentage });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <clipPath id={ids.outer}>
          <circle cx={centerX} cy={centerY} r={clipRadius} />
        </clipPath>
        <clipPath id={ids.sector}>
          {sectorPath ? <path d={sectorPath} /> : null}
        </clipPath>
      </defs>

      <circle cx={centerX} cy={centerY} r={clipRadius} fill={colors.remaining} />
      {sectorPath ? <path d={sectorPath} fill={colors.elapsed} /> : null}
      {showCenterLabel ? (
        <FilledCenterLabel
          label={label}
          fontSize={fontSize}
          outerClipId={ids.outer}
          sectorClipId={ids.sector}
          centerX={centerX}
          centerY={centerY}
          primaryColor={primaryColor}
          alternateColor={alternateColor}
        />
      ) : null}
    </svg>
  );
};

const CircleOutline = ({ width, height, percentage, label, showCenterLabel, fontSize, primaryColor, alternateColor }) => {
  const colors = getSurfaceColors(primaryColor, alternateColor);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.43;
  const strokeWidth = clamp(Math.min(width, height) * 0.055, 2, 8);
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" aria-hidden="true">
      <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={colors.outlineTrack} strokeWidth={strokeWidth} />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={colors.outlineFill}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percentage / 100)}
        strokeLinecap="round"
        transform={`rotate(-90 ${centerX} ${centerY})`}
      />
      {showCenterLabel ? (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={alternateColor}
          style={{ fontSize: `${fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
};

const RectFilled = ({ width, height, percentage, label, ids, showCenterLabel, fontSize, primaryColor, alternateColor }) => {
  const colors = getSurfaceColors(primaryColor, alternateColor);
  const centerX = width / 2;
  const centerY = height / 2;
  const sectorRadius = Math.hypot(width, height);
  const sectorPath = getSectorPath({ centerX, centerY, radius: sectorRadius, percentage });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <clipPath id={ids.outer}>
          <rect x="0" y="0" width={width} height={height} rx="0" ry="0" />
        </clipPath>
        <clipPath id={ids.sector}>
          {sectorPath ? <path d={sectorPath} /> : null}
        </clipPath>
      </defs>

      <rect x="0" y="0" width={width} height={height} fill={colors.remaining} />
      <g clipPath={`url(#${ids.outer})`}>{sectorPath ? <path d={sectorPath} fill={colors.elapsed} /> : null}</g>
      {showCenterLabel ? (
        <FilledCenterLabel
          label={label}
          fontSize={fontSize}
          outerClipId={ids.outer}
          sectorClipId={ids.sector}
          centerX={centerX}
          centerY={centerY}
          primaryColor={primaryColor}
          alternateColor={alternateColor}
        />
      ) : null}
    </svg>
  );
};

const RectOutline = ({ width, height, percentage, label, showCenterLabel, fontSize, primaryColor, alternateColor }) => {
  const colors = getSurfaceColors(primaryColor, alternateColor);
  const centerX = width / 2;
  const centerY = height / 2;
  const strokeWidth = clamp(Math.min(width, height) * 0.045, 2, 8);
  const inset = strokeWidth / 2;
  const rectWidth = Math.max(0, width - strokeWidth);
  const rectHeight = Math.max(0, height - strokeWidth);
  const perimeter = 2 * (rectWidth + rectHeight);
  const pathD = [
    `M ${inset + rectWidth / 2} ${inset}`,
    `L ${inset + rectWidth} ${inset}`,
    `L ${inset + rectWidth} ${inset + rectHeight}`,
    `L ${inset} ${inset + rectHeight}`,
    `L ${inset} ${inset}`,
    `L ${inset + rectWidth / 2} ${inset}`,
  ].join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" aria-hidden="true">
      <path d={pathD} fill="none" stroke={colors.outlineTrack} strokeWidth={strokeWidth} strokeLinecap="butt" />
      <path
        d={pathD}
        fill="none"
        stroke={colors.outlineFill}
        strokeWidth={strokeWidth}
        strokeDasharray={perimeter}
        strokeDashoffset={perimeter * (1 - percentage / 100)}
        strokeLinecap="butt"
      />
      {showCenterLabel ? (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={alternateColor}
          style={{ fontSize: `${fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
};

const PieView = ({
  shape = 'circle',
  style = 'filled',
  fullScreen = false,
  decimals = 2,
  spaceTop = 0,
  spaceRight = 0,
  spaceBottom = 0,
  spaceLeft = 0,
  primaryColor,
  alternateColor,
  textToneColor,
}) => {
  const { percentage, percentageLabel } = useYearProgress(decimals);
  const { containerRef, layout } = usePieLayout({
    shape,
    fullScreen,
    spaceTopPercent: spaceTop,
    spaceRightPercent: spaceRight,
    spaceBottomPercent: spaceBottom,
    spaceLeftPercent: spaceLeft,
  });
  const clipIdBase = useId().replace(/:/g, '');
  const isRectangle = shape === 'rectangle';
  const isFilled = style === 'filled';
  const showCenterLabel = fullScreen;
  const ids = {
    outer: `${clipIdBase}-${isRectangle ? 'rect' : 'circle'}-outer`,
    sector: `${clipIdBase}-${isRectangle ? 'rect' : 'circle'}-sector`,
  };

  return (
    <section
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ color: textToneColor, backgroundColor: alternateColor }}
    >
      <div
        className="absolute"
        style={{
          left: `${layout.boxLeft}px`,
          top: `${layout.boxTop}px`,
          width: `${layout.boxWidth}px`,
          height: `${layout.boxHeight}px`,
        }}
      >
        {isRectangle ? (
          isFilled ? (
            <RectFilled
              width={layout.boxWidth}
              height={layout.boxHeight}
              percentage={percentage}
              label={percentageLabel}
              ids={ids}
              showCenterLabel={showCenterLabel}
              fontSize={layout.fullScreenFontSize}
              primaryColor={primaryColor}
              alternateColor={alternateColor}
            />
          ) : (
            <RectOutline
              width={layout.boxWidth}
              height={layout.boxHeight}
              percentage={percentage}
              label={percentageLabel}
              showCenterLabel={showCenterLabel}
              fontSize={layout.fullScreenFontSize}
              primaryColor={primaryColor}
              alternateColor={alternateColor}
            />
          )
        ) : isFilled ? (
          <CircleFilled
            width={layout.boxWidth}
            height={layout.boxHeight}
            percentage={percentage}
            label={percentageLabel}
            ids={ids}
            showCenterLabel={showCenterLabel}
            fontSize={layout.fullScreenFontSize}
            primaryColor={primaryColor}
            alternateColor={alternateColor}
          />
        ) : (
          <CircleOutline
            width={layout.boxWidth}
            height={layout.boxHeight}
            percentage={percentage}
            label={percentageLabel}
            showCenterLabel={showCenterLabel}
            fontSize={layout.fullScreenFontSize}
            primaryColor={primaryColor}
            alternateColor={alternateColor}
          />
        )}
      </div>

      {layout.showBelowLabel ? (
        <div
          className="absolute text-center"
          style={{
            left: 0,
            right: 0,
            top: `${layout.labelY}px`,
            minHeight: `${layout.labelHeight}px`,
            fontSize: `${layout.belowFontSize}px`,
            fontWeight: 300,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: textToneColor,
          }}
        >
          {percentageLabel}
        </div>
      ) : null}
    </section>
  );
};

export default PieView;
