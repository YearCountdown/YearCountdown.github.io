import { useId } from 'react';

import { useTheme } from '../../context/ThemeContext';
import useProgressLayout from '../../hooks/useProgressLayout';
import useYearProgress from '../../hooks/useYearProgress';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const FieldTextLayers = ({ label, fontSize, width, height, progressWidth, theme, clipId }) => {
  const remaining = theme === 'dark' ? 'rgb(9 9 11)' : 'rgb(255 255 255)';
  const elapsed = theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(0 0 0)';
  const onElapsed = theme === 'dark' ? 'rgb(9 9 11)' : 'rgb(255 255 255)';

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
        fill={elapsed}
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
      <rect x="0" y="0" width={width} height={height} fill={remaining} opacity="0" />
    </svg>
  );
};

const FieldMode = ({ width, height, percentage, label, fontSize, theme }) => {
  const clipId = useId().replace(/:/g, '');
  const progressWidth = Math.max(0, Math.min(width, (width * percentage) / 100));
  const remaining = theme === 'dark' ? 'rgb(9 9 11)' : 'rgb(255 255 255)';
  const elapsed = theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(0 0 0)';

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
        theme={theme}
        clipId={clipId}
      />
    </div>
  );
};

const LineMode = ({ width, height, percentage, label, fontSize, lineWidth, theme }) => {
  const remaining = theme === 'dark' ? 'color-mix(in srgb, white 16%, transparent)' : 'color-mix(in srgb, black 16%, transparent)';
  const elapsed = theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(0 0 0)';
  const lineThickness = clamp(lineWidth, 2, Math.max(2, height * 0.4));
  const lineY = height / 2 - lineThickness / 2;

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
      <div className="absolute inset-0 flex items-center justify-center text-black dark:text-white">
        <div
          className="text-center"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: 300,
            letterSpacing: '-0.04em',
            lineHeight: 1,
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
  inset = 0,
  outerX = 0,
  outerY = 0,
}) => {
  const { theme } = useTheme();
  const { percentage, percentageLabel } = useYearProgress(decimals);
  const { containerRef, layout } = useProgressLayout({
    mode,
    fullScreen,
    insetPercent: inset,
    outerXPercent: outerX,
    outerYPercent: outerY,
  });
  const textScale = fullScreen ? layout.fullScreenFontSize : layout.centeredFontSize;
  const computedFontSize = textScale * fontSize;

  return (
    <section ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div
        className="absolute"
        style={{
          left: `${layout.boxLeft}px`,
          top: `${layout.boxTop}px`,
          width: `${layout.boxWidth}px`,
          height: `${layout.boxHeight}px`,
        }}
      >
        {mode === 'line' ? (
          <LineMode
            width={layout.boxWidth}
            height={layout.boxHeight}
            percentage={percentage}
            label={percentageLabel}
            fontSize={computedFontSize}
            lineWidth={lineWidth}
            theme={theme}
          />
        ) : (
          <FieldMode
            width={layout.boxWidth}
            height={layout.boxHeight}
            percentage={percentage}
            label={percentageLabel}
            fontSize={computedFontSize}
            theme={theme}
          />
        )}
      </div>
    </section>
  );
};

export default ProgressView;
