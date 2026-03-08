import { useId } from 'react';

import { useTheme } from '../../context/ThemeContext';
import usePieLayout from '../../hooks/usePieLayout';
import useYearProgress from '../../hooks/useYearProgress';

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

const getSurfaceColors = () => {
  return {
    elapsed: 'var(--pie-elapsed, currentColor)',
    remaining: 'var(--pie-remaining, transparent)',
    outlineTrack: 'color-mix(in srgb, currentColor 14%, transparent)',
    outlineFill: 'currentColor',
    textOnElapsed: 'var(--pie-on-elapsed, var(--pie-remaining, white))',
    textOnRemaining: 'var(--pie-on-remaining, currentColor)',
  };
};

const FilledCenterLabel = ({ label, fontSize, outerClipId, sectorClipId, centerX, centerY }) => {
  const colors = getSurfaceColors();

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

const CircleFilled = ({ width, height, percentage, label, ids, showCenterLabel, fontSize }) => {
  const colors = getSurfaceColors();
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
        />
      ) : null}
    </svg>
  );
};

const CircleOutline = ({ width, height, percentage, label, showCenterLabel, fontSize }) => {
  const colors = getSurfaceColors();
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
          fill="currentColor"
          style={{ fontSize: `${fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
};

const RectFilled = ({ width, height, percentage, label, ids, showCenterLabel, fontSize }) => {
  const colors = getSurfaceColors();
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
        />
      ) : null}
    </svg>
  );
};

const RectOutline = ({ width, height, percentage, label, ids, showCenterLabel, fontSize }) => {
  const colors = getSurfaceColors();
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.hypot(width, height) / 2;
  const strokeWidth = clamp(Math.min(width, height) * 0.06, 2, 8);
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <clipPath id={ids.outer}>
          <rect x="0" y="0" width={width} height={height} rx="0" ry="0" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${ids.outer})`}>
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
      </g>
      {showCenterLabel ? (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
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
  inset = 0,
  outerX = 0,
  outerY = 0,
}) => {
  const { theme } = useTheme();
  const { percentage, percentageLabel } = useYearProgress(decimals);
  const { containerRef, layout } = usePieLayout({
    shape,
    fullScreen,
    insetPercent: inset,
    outerXPercent: outerX,
    outerYPercent: outerY,
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
      className="relative h-full w-full overflow-hidden text-black dark:text-white"
      style={{
        '--pie-elapsed': theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(0 0 0)',
        '--pie-remaining': theme === 'dark' ? 'rgb(9 9 11)' : 'rgb(255 255 255)',
        '--pie-on-elapsed': theme === 'dark' ? 'rgb(9 9 11)' : 'rgb(255 255 255)',
        '--pie-on-remaining': 'currentColor',
      }}
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
            />
          ) : (
            <RectOutline
              width={layout.boxWidth}
              height={layout.boxHeight}
              percentage={percentage}
              label={percentageLabel}
              ids={ids}
              showCenterLabel={showCenterLabel}
              fontSize={layout.fullScreenFontSize}
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
          />
        ) : (
          <CircleOutline
            width={layout.boxWidth}
            height={layout.boxHeight}
            percentage={percentage}
            label={percentageLabel}
            showCenterLabel={showCenterLabel}
            fontSize={layout.fullScreenFontSize}
          />
        )}
      </div>

      {layout.showBelowLabel ? (
        <div
          className="absolute text-center text-black dark:text-white"
          style={{
            left: 0,
            right: 0,
            top: `${layout.labelY}px`,
            minHeight: `${layout.labelHeight}px`,
            fontSize: `${layout.belowFontSize}px`,
            fontWeight: 300,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          {percentageLabel}
        </div>
      ) : null}
    </section>
  );
};

export default PieView;
