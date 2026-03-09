import React from 'react';

import { getDotsSnapshot } from './dotsMath';
import { getCountdownSnapshot, getYearProgress } from './timeMath';
import {
  VIEW_BRAND_TONE_MODES,
  getContrastingTextColor,
  getColorLuminance,
  getToneColor,
  normalizeViewBrandToneMode,
  resolveViewTextTone,
  withAlpha,
} from './viewColors';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatCountdownNumber = (value) => String(value).padStart(2, '0');

const getResolvedTextToneColor = ({ backgroundColor, textToneMode }) => {
  const tone = resolveViewTextTone({
    mode: normalizeViewBrandToneMode(textToneMode ?? VIEW_BRAND_TONE_MODES.AUTO),
    backgroundColor,
  });

  return getToneColor(tone);
};

const getWallpaperSurfacePalette = (primary, alternate) => {
  const isLightBackground = getColorLuminance(alternate) > 0.52;
  const subtleAlpha = isLightBackground ? 0.06 : 0.12;
  const trackAlpha = isLightBackground ? 0.14 : 0.22;

  return {
    primary,
    mutedSurface: withAlpha(primary, subtleAlpha),
    outlineTrack: withAlpha(primary, trackAlpha),
    textOnElapsed: getContrastingTextColor(primary),
    textOnRemaining: getContrastingTextColor(alternate),
  };
};

const getTriangleRotation = ({ triangleMode, triangleAngle, index }) => {
  if (triangleMode === 'angle') {
    return triangleAngle;
  }

  if (triangleMode === 'inverted') {
    return 180;
  }

  if (triangleMode === 'alternating') {
    return index % 2 === 0 ? 0 : 180;
  }

  return 0;
};

const getPieLayout = ({ width, height, shape, fullScreen, inset, outerX, outerY }) => {
  const minDimension = Math.min(width, height);
  const insetPx = (minDimension * inset) / 100;
  const insetWidth = Math.max(0, width - insetPx * 2);
  const insetHeight = Math.max(0, height - insetPx * 2);
  const outerXPx = (insetWidth * outerX) / 100;
  const outerYPx = (insetHeight * outerY) / 100;
  const drawWidth = Math.max(0, insetWidth - outerXPx * 2);
  const drawHeight = Math.max(0, insetHeight - outerYPx * 2);
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

  const boxLeft = insetPx + outerXPx + (drawWidth - boxWidth) / 2;
  const boxTop = insetPx + outerYPx + (shapeAreaHeight - boxHeight) / 2;
  const shapeMin = Math.max(0, Math.min(boxWidth, boxHeight));

  return {
    boxLeft,
    boxTop,
    boxWidth,
    boxHeight,
    labelY: insetPx + outerYPx + shapeAreaHeight + belowLabelGap,
    labelHeight: belowLabelHeight,
    showBelowLabel,
    fullScreenFontSize: clamp(shapeMin * (shape === 'rectangle' && fullScreen ? 0.15 : 0.2), 32, 100),
    belowFontSize: clamp(shapeMin * 0.095, 18, 42),
  };
};

const getProgressLayout = ({ width, height, mode, fullScreen, inset, outerX, outerY }) => {
  const minDimension = Math.min(width, height);
  const insetPx = (minDimension * inset) / 100;
  const insetWidth = Math.max(0, width - insetPx * 2);
  const insetHeight = Math.max(0, height - insetPx * 2);
  const outerXPx = (insetWidth * outerX) / 100;
  const outerYPx = (insetHeight * outerY) / 100;
  const drawWidth = Math.max(0, insetWidth - outerXPx * 2);
  const drawHeight = Math.max(0, insetHeight - outerYPx * 2);
  const boxWidth = fullScreen ? drawWidth : drawWidth * (mode === 'field' ? 0.8 : 0.74);
  const boxHeight = fullScreen ? drawHeight : drawHeight * (mode === 'field' ? 0.68 : 0.5);
  const boxLeft = insetPx + outerXPx + (drawWidth - boxWidth) / 2;
  const boxTop = insetPx + outerYPx + (drawHeight - boxHeight) / 2;
  const textBase = Math.min(boxWidth, boxHeight);

  return {
    boxLeft,
    boxTop,
    boxWidth,
    boxHeight,
    fullScreenFontSize: clamp(textBase * (mode === 'field' ? 0.13 : 0.11), 16, 64),
    centeredFontSize: clamp(textBase * (mode === 'field' ? 0.16 : 0.14), 20, 84),
  };
};

const getFittedProgressLabel = ({ percentage, decimals, fontSize, width, mode }) => {
  const safeDecimals = clamp(Math.round(decimals), 0, 10);
  const charWidthFactor = mode === 'field' ? 0.58 : 0.54;
  const maxChars = Math.max(4, Math.floor(width / Math.max(fontSize * charWidthFactor, 1)));
  let currentDecimals = safeDecimals;
  let label = `${percentage.toFixed(currentDecimals)}%`;

  while (currentDecimals > 0 && label.length > maxChars) {
    currentDecimals -= 1;
    label = `${percentage.toFixed(currentDecimals)}%`;
  }

  if (label.length > maxChars) {
    const sliceLength = Math.max(3, maxChars - 1);
    label = `${label.slice(0, sliceLength)}…`;
  }

  const estimatedWidth = label.length * fontSize * charWidthFactor;
  const fitScale = estimatedWidth > width ? width / estimatedWidth : 1;

  return {
    label,
    fontSize: Math.max(12, fontSize * fitScale),
  };
};

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

const renderCountdownWallpaper = ({ width, height, viewState, textToneColor }) => {
  const countdown = getCountdownSnapshot();
  const isAllMode = viewState.mode === 'all';
  const minDimension = Math.min(width, height);
  const fontScale = viewState.fontSize ?? 1;
  const shellPadding = clamp(minDimension * 0.06, 20, 56);
  const titleSize = clamp(minDimension * 0.04 * fontScale, 14, 34);
  const numberSize = clamp(minDimension * (isAllMode ? 0.14 : 0.24) * fontScale, 28, 180);
  const labelSize = clamp(minDimension * 0.03 * fontScale, 10, 24);
  const frameStyle = viewState.frame
    ? {
        border: `1px solid ${withAlpha(textToneColor, 0.22)}`,
        borderRadius: clamp(minDimension * 0.06, 18, 34),
      }
    : {};

  if (!isAllMode) {
    const valueMap = {
      days: countdown.totalDays,
      hours: countdown.totalHours,
      minutes: countdown.totalMinutes,
      seconds: countdown.totalSeconds,
    };

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: viewState.alternate,
          color: textToneColor,
          padding: shellPadding,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: clamp(minDimension * 0.03, 10, 26),
            ...frameStyle,
          }}
        >
          <div style={{ fontSize: titleSize, textTransform: 'uppercase', letterSpacing: '0.22em', opacity: 0.72 }}>
            {viewState.mode} remaining
          </div>
          <div style={{ fontSize: numberSize, lineHeight: 1, fontWeight: 300, color: viewState.primary }}>
            {formatCountdownNumber(valueMap[viewState.mode] ?? 0)}
          </div>
          {viewState.labels ? (
            <div style={{ fontSize: labelSize, textTransform: 'uppercase', letterSpacing: '0.26em', opacity: 0.84 }}>
              {viewState.mode}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  const items = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: viewState.alternate,
        color: textToneColor,
        padding: shellPadding,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: clamp(minDimension * 0.03, 10, 26),
          ...frameStyle,
        }}
      >
        <div style={{ fontSize: titleSize, textTransform: 'uppercase', letterSpacing: '0.22em', opacity: 0.72 }}>
          Year ends in
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {items.map((item) => (
            <div
              key={item.label}
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: clamp(minDimension * 0.03, 12, 28),
              }}
            >
              <div style={{ fontSize: numberSize, lineHeight: 1, fontWeight: 300, color: viewState.primary }}>
                {formatCountdownNumber(item.value)}
              </div>
              {viewState.labels ? (
                <div style={{ marginTop: clamp(minDimension * 0.015, 6, 14), fontSize: labelSize, textTransform: 'uppercase', letterSpacing: '0.22em', opacity: 0.84 }}>
                  {item.label}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const renderDotsWallpaper = ({ width, height, viewState }) => {
  const snapshot = getDotsSnapshot({
    width,
    height,
    gapXPercent: viewState.gapX,
    gapYPercent: viewState.gapY,
    insetPercent: viewState.inset,
    outerXPercent: viewState.outerX,
    outerYPercent: viewState.outerY,
  });
  const { grid, dots } = snapshot;
  const extraX = Math.max(0, grid.innerWidth - grid.columns * grid.dotSize - grid.gapXPx * (grid.columns - 1));
  const extraY = Math.max(0, grid.innerHeight - grid.rows * grid.dotSize - grid.gapYPx * (grid.rows - 1));
  const effectiveGapX = grid.columns > 1 ? grid.gapXPx + extraX / (grid.columns - 1) : 0;
  const effectiveGapY = grid.rows > 1 ? grid.gapYPx + extraY / (grid.rows - 1) : 0;
  const startX = grid.insetPx + grid.outerXPx;
  const startY = grid.insetPx + grid.outerYPx;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <rect x="0" y="0" width={width} height={height} fill={viewState.alternate} />
      {dots.map((dot, index) => {
        if (dot.status === 'filler') {
          return null;
        }

        const column = index % grid.columns;
        const row = Math.floor(index / grid.columns);
        const x = startX + column * (grid.dotSize + effectiveGapX);
        const y = startY + row * (grid.dotSize + effectiveGapY);
        const fill = dot.status === 'future' ? withAlpha(viewState.primary, viewState.inactiveOpacity / 100) : viewState.primary;

        if (viewState.shape === 'circle') {
          return (
            <circle
              key={dot.key}
              cx={x + grid.dotSize / 2}
              cy={y + grid.dotSize / 2}
              r={grid.dotSize / 2}
              fill={fill}
            />
          );
        }

        if (viewState.shape === 'square') {
          return (
            <rect
              key={dot.key}
              x={x}
              y={y}
              width={grid.dotSize}
              height={grid.dotSize}
              rx={grid.dotSize * 0.12}
              ry={grid.dotSize * 0.12}
              fill={fill}
            />
          );
        }

        const rotation = getTriangleRotation({
          triangleMode: viewState.triangleMode,
          triangleAngle: viewState.triangleAngle,
          index,
        });

        return (
          <g
            key={dot.key}
            transform={`translate(${x + grid.dotSize / 2} ${y + grid.dotSize / 2}) rotate(${rotation}) translate(${-grid.dotSize / 2} ${-grid.dotSize / 2})`}
          >
            <polygon points={`${grid.dotSize / 2},0 0,${grid.dotSize} ${grid.dotSize},${grid.dotSize}`} fill={fill} />
          </g>
        );
      })}
    </svg>
  );
};

const renderPieWallpaper = ({ width, height, viewState, textToneColor }) => {
  const progress = getYearProgress();
  const layout = getPieLayout({
    width,
    height,
    shape: viewState.shape,
    fullScreen: viewState.fullScreen,
    inset: viewState.inset,
    outerX: viewState.outerX,
    outerY: viewState.outerY,
  });
  const palette = getWallpaperSurfacePalette(viewState.primary, viewState.alternate);
  const centerX = layout.boxLeft + layout.boxWidth / 2;
  const centerY = layout.boxTop + layout.boxHeight / 2;
  const label = `${progress.percentage.toFixed(viewState.decimals)}%`;
  const isRectangle = viewState.shape === 'rectangle';
  const isFilled = viewState.style === 'filled';

  let artwork = null;

  if (isRectangle && isFilled) {
    const radius = Math.hypot(layout.boxWidth, layout.boxHeight);
    const sectorPath = getSectorPath({ centerX, centerY, radius, percentage: progress.percentage });

    artwork = (
      <>
        <rect x={layout.boxLeft} y={layout.boxTop} width={layout.boxWidth} height={layout.boxHeight} fill={palette.mutedSurface} />
        {sectorPath ? <path d={sectorPath} fill={palette.primary} /> : null}
      </>
    );
  } else if (isRectangle) {
    const strokeWidth = clamp(Math.min(layout.boxWidth, layout.boxHeight) * 0.045, 2, 8);
    const inset = strokeWidth / 2;
    const rectWidth = Math.max(0, layout.boxWidth - strokeWidth);
    const rectHeight = Math.max(0, layout.boxHeight - strokeWidth);
    const perimeter = 2 * (rectWidth + rectHeight);
    const pathD = [
      `M ${layout.boxLeft + inset + rectWidth / 2} ${layout.boxTop + inset}`,
      `L ${layout.boxLeft + inset + rectWidth} ${layout.boxTop + inset}`,
      `L ${layout.boxLeft + inset + rectWidth} ${layout.boxTop + inset + rectHeight}`,
      `L ${layout.boxLeft + inset} ${layout.boxTop + inset + rectHeight}`,
      `L ${layout.boxLeft + inset} ${layout.boxTop + inset}`,
      `L ${layout.boxLeft + inset + rectWidth / 2} ${layout.boxTop + inset}`,
    ].join(' ');

    artwork = (
      <>
        <path d={pathD} fill="none" stroke={palette.outlineTrack} strokeWidth={strokeWidth} />
        <path
          d={pathD}
          fill="none"
          stroke={palette.primary}
          strokeWidth={strokeWidth}
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter * (1 - progress.percentage / 100)}
        />
      </>
    );
  } else if (isFilled) {
    const radius = Math.min(layout.boxWidth, layout.boxHeight) * 0.48;
    const sectorPath = getSectorPath({ centerX, centerY, radius, percentage: progress.percentage });

    artwork = (
      <>
        <circle cx={centerX} cy={centerY} r={radius} fill={palette.mutedSurface} />
        {sectorPath ? <path d={sectorPath} fill={palette.primary} /> : null}
      </>
    );
  } else {
    const radius = Math.min(layout.boxWidth, layout.boxHeight) * 0.43;
    const strokeWidth = clamp(Math.min(layout.boxWidth, layout.boxHeight) * 0.055, 2, 8);
    const circumference = 2 * Math.PI * radius;

    artwork = (
      <>
        <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={palette.outlineTrack} strokeWidth={strokeWidth} />
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={palette.primary}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress.percentage / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${centerX} ${centerY})`}
        />
      </>
    );
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <rect x="0" y="0" width={width} height={height} fill={viewState.alternate} />
      {artwork}
      {viewState.fullScreen ? (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textToneColor}
          style={{ fontSize: `${layout.fullScreenFontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          {label}
        </text>
      ) : (
        <text
          x="50%"
          y={layout.labelY + layout.labelHeight * 0.64}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textToneColor}
          style={{ fontSize: `${layout.belowFontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

const renderProgressWallpaper = ({ width, height, viewState, textToneColor }) => {
  const progress = getYearProgress();
  const palette = getWallpaperSurfacePalette(viewState.primary, viewState.alternate);
  const layout = getProgressLayout({
    width,
    height,
    mode: viewState.mode,
    fullScreen: viewState.fullScreen,
    inset: viewState.inset,
    outerX: viewState.outerX,
    outerY: viewState.outerY,
  });
  const textScale = viewState.fullScreen ? layout.fullScreenFontSize : layout.centeredFontSize;
  const fitted = getFittedProgressLabel({
    percentage: progress.percentage,
    decimals: viewState.decimals,
    fontSize: textScale * viewState.fontSize,
    width: layout.boxWidth,
    mode: viewState.mode,
  });

  if (viewState.mode === 'line') {
    const lineThickness = clamp(viewState.lineWidth, 2, Math.max(2, layout.boxHeight * 0.4));
    const lineY = layout.boxTop + layout.boxHeight / 2 - lineThickness / 2;
    const progressWidth = (layout.boxWidth * progress.percentage) / 100;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        <rect x="0" y="0" width={width} height={height} fill={viewState.alternate} />
        <rect x={layout.boxLeft} y={lineY} width={layout.boxWidth} height={lineThickness} fill={palette.outlineTrack} />
        <rect x={layout.boxLeft} y={lineY} width={progressWidth} height={lineThickness} fill={palette.primary} />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textToneColor}
          style={{ fontSize: `${fitted.fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          {fitted.label}
        </text>
      </svg>
    );
  }

  const progressWidth = (layout.boxWidth * progress.percentage) / 100;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <clipPath id="progress-elapsed">
          <rect x={layout.boxLeft} y={layout.boxTop} width={progressWidth} height={layout.boxHeight} />
        </clipPath>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill={viewState.alternate} />
      <rect x={layout.boxLeft} y={layout.boxTop} width={layout.boxWidth} height={layout.boxHeight} fill={palette.mutedSurface} />
      <rect x={layout.boxLeft} y={layout.boxTop} width={progressWidth} height={layout.boxHeight} fill={palette.primary} />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={palette.textOnRemaining}
        style={{ fontSize: `${fitted.fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
      >
        {fitted.label}
      </text>
      <g clipPath="url(#progress-elapsed)">
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={palette.textOnElapsed}
          style={{ fontSize: `${fitted.fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          {fitted.label}
        </text>
      </g>
    </svg>
  );
};

export const renderWallpaperView = ({ viewId, width, height, theme, viewState, textToneMode }) => {
  const textToneColor = getResolvedTextToneColor({
    backgroundColor: viewState.alternate,
    textToneMode,
  });

  if (viewId === 'countdown') {
    return renderCountdownWallpaper({ width, height, theme, viewState, textToneColor });
  }

  if (viewId === 'dots') {
    return renderDotsWallpaper({ width, height, viewState });
  }

  if (viewId === 'pie') {
    return renderPieWallpaper({ width, height, theme, viewState, textToneColor });
  }

  if (viewId === 'progress') {
    return renderProgressWallpaper({ width, height, theme, viewState, textToneColor });
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        color: '#111111',
      }}
    >
      Unsupported wallpaper view
    </div>
  );
};
