import { useId } from 'react';

import useProgressLayout from '../../hooks/useProgressLayout';
import useYearProgress from '../../hooks/useYearProgress';
import { getViewSurfacePalette } from '../../lib/viewColors';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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

const FieldTextLayers = ({ label, fontSize, width, height, progressWidth, primaryColor, alternateColor, clipId }) => {
  const palette = getViewSurfacePalette(primaryColor, alternateColor);
  const onRemaining = palette.textOnRemaining;
  const onElapsed = palette.textOnElapsed;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <clipPath id={`${clipId}-elapsed`}>
          <rect x="0" y="0" width={progressWidth} height={height} />
        </clipPath>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={onRemaining}
        style={{ fontSize: `${fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
      >
        {label}
      </text>
      <g clipPath={`url(#${clipId}-elapsed)`}>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={onElapsed}
          style={{ fontSize: `${fontSize}px`, fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          {label}
        </text>
      </g>
      <rect x="0" y="0" width={width} height={height} fill={palette.mutedSurface} opacity="0" />
    </svg>
  );
};

const FieldMode = ({ width, height, percentage, label, fontSize, primaryColor, alternateColor }) => {
  const clipId = useId().replace(/:/g, '');
  const progressWidth = Math.max(0, Math.min(width, (width * percentage) / 100));
  const palette = getViewSurfacePalette(primaryColor, alternateColor);
  const remaining = palette.mutedSurface;
  const elapsed = palette.primary;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: remaining }} />
      <div className="absolute inset-y-0 left-0" style={{ width: `${progressWidth}px`, backgroundColor: elapsed }} />
      <FieldTextLayers
        label={label}
        fontSize={fontSize}
        width={width}
        height={height}
        progressWidth={progressWidth}
        primaryColor={primaryColor}
        alternateColor={alternateColor}
        clipId={clipId}
      />
    </div>
  );
};

const LineMode = ({ width, height, percentage, label, fontSize, lineWidth, primaryColor, alternateColor, textToneColor }) => {
  const palette = getViewSurfacePalette(primaryColor, alternateColor);
  const remaining = palette.outlineTrack;
  const elapsed = palette.primary;
  const lineThickness = clamp(lineWidth, 2, Math.max(2, height * 0.4));
  const labelGap = clamp(fontSize * 0.18, 3, 10);
  const labelBand = clamp(fontSize * 1.02, 16, Math.max(16, height * 0.18));
  const blockHeight = labelBand + labelGap + lineThickness;
  const blockTop = Math.max(0, (height - blockHeight) / 2);
  const lineY = blockTop + labelBand + labelGap;

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute left-0"
        style={{
          top: `${lineY}px`,
          width: `${width}px`,
          height: `${lineThickness}px`,
          backgroundColor: remaining,
        }}
      />
      <div
        className="absolute left-0"
        style={{
          top: `${lineY}px`,
          width: `${(width * percentage) / 100}px`,
          height: `${lineThickness}px`,
          backgroundColor: elapsed,
        }}
      />
      <div
        className="absolute inset-x-0 flex items-start justify-center"
        style={{
          top: `${blockTop}px`,
          height: `${labelBand}px`,
        }}
      >
        <div
          className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-3 text-center"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: 300,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: textToneColor,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

const ProgressView = ({
  mode = 'field',
  fullScreen = true,
  decimals = 2,
  fontSize = 1,
  lineWidth = 12,
  spaceTop = 0,
  spaceRight = 0,
  spaceBottom = 0,
  spaceLeft = 0,
  primaryColor,
  alternateColor,
  textToneColor,
}) => {
  const { percentage } = useYearProgress(decimals);
  const { containerRef, layout } = useProgressLayout({
    mode,
    fullScreen,
    spaceTopPercent: spaceTop,
    spaceRightPercent: spaceRight,
    spaceBottomPercent: spaceBottom,
    spaceLeftPercent: spaceLeft,
  });
  const textScale = fullScreen ? layout.fullScreenFontSize : layout.centeredFontSize;
  const baseFontSize = textScale * fontSize;
  const fittedLabel = getFittedProgressLabel({
    percentage,
    decimals,
    fontSize: baseFontSize,
    width: layout.boxWidth,
    mode,
  });

  return (
    <section ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ backgroundColor: alternateColor }}>
      <div
        className="absolute"
        style={{
          left: `${layout.contentLeft}px`,
          top: `${layout.contentTop}px`,
          width: `${layout.contentWidth}px`,
          height: `${layout.contentHeight}px`,
        }}
      >
        <div
          className="absolute"
          style={{
            left: `${layout.boxOffsetLeft}px`,
            top: `${layout.boxOffsetTop}px`,
            width: `${layout.boxWidth}px`,
            height: `${layout.boxHeight}px`,
          }}
        >
          {mode === 'line' ? (
            <LineMode
              width={layout.boxWidth}
              height={layout.boxHeight}
              percentage={percentage}
              label={fittedLabel.label}
              fontSize={fittedLabel.fontSize}
              lineWidth={lineWidth}
              primaryColor={primaryColor}
              alternateColor={alternateColor}
              textToneColor={textToneColor}
            />
          ) : (
            <FieldMode
              width={layout.boxWidth}
              height={layout.boxHeight}
              percentage={percentage}
              label={fittedLabel.label}
              fontSize={fittedLabel.fontSize}
              primaryColor={primaryColor}
              alternateColor={alternateColor}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgressView;
