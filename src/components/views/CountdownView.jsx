import useCountdown from '../../hooks/useCountdown';
import useResponsiveCountdown from '../../hooks/useResponsiveCountdown';
import { withAlpha } from '../../lib/viewColors';

const MODE_LABELS = {
  all: 'Year ends in',
  days: 'Days remaining',
  hours: 'Hours remaining',
  minutes: 'Minutes remaining',
  seconds: 'Seconds remaining',
};

const SHORT_MODE_LABELS = {
  all: 'Ends in',
  days: 'Days left',
  hours: 'Hours left',
  minutes: 'Minutes left',
  seconds: 'Seconds left',
};

const UNIT_LABELS = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
};

const SHORT_UNIT_LABELS = {
  days: 'D',
  hours: 'H',
  minutes: 'M',
  seconds: 'S',
};

const formatNumber = (value, minDigits = 2) => {
  return String(value).padStart(minDigits, '0');
};

const getSingleModeValue = (countdown, mode) => {
  switch (mode) {
    case 'days':
      return countdown.totalDays;
    case 'hours':
      return countdown.totalHours;
    case 'minutes':
      return countdown.totalMinutes;
    case 'seconds':
      return countdown.totalSeconds;
    default:
      return 0;
  }
};

const CountdownUnit = ({ value, label, showLabels, tokens, primaryColor, alternateColor }) => {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center">
      <span
        className="block font-light leading-none"
        style={{
          fontSize: `${tokens.numberSize}px`,
          letterSpacing: `${tokens.numberTracking}em`,
          color: primaryColor,
        }}
      >
        {formatNumber(value)}
      </span>
      {showLabels ? (
        <span
          className="mt-2 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap uppercase"
          style={{
            fontSize: `${tokens.labelSize}px`,
            letterSpacing: `${tokens.labelTracking}em`,
            marginTop: `${Math.max(4, tokens.labelSize * 0.65)}px`,
            color: alternateColor,
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
};

const getShellStyle = ({ frame, tokens }) => {
  if (!frame) {
    return {
      gap: `${tokens.stackGap}px`,
    };
  }

  return {
    gap: `${tokens.stackGap}px`,
    padding: `${tokens.frame.y}px ${tokens.frame.x}px`,
    borderRadius: `${tokens.frame.radius}px`,
    border: '1px solid var(--countdown-frame-color)',
  };
};

const CountdownView = ({
  mode = 'all',
  frame = false,
  labels = true,
  fontSize = 1,
  primaryColor,
  alternateColor,
  textToneColor,
}) => {
  const countdown = useCountdown();
  const { containerRef, tokens } = useResponsiveCountdown({ mode, labels });
  const scaledTokens = {
    ...tokens,
    subtitleSize: tokens.subtitleSize * fontSize,
    numberSize: tokens.numberSize * fontSize,
    labelSize: tokens.labelSize * fontSize,
  };
  const modeLabel = tokens.tier === 'micro' ? SHORT_MODE_LABELS[mode] : MODE_LABELS[mode];

  if (mode !== 'all') {
    const singleValue = getSingleModeValue(countdown, mode);
    const unitLabel = tokens.useShortLabels ? SHORT_UNIT_LABELS[mode] : UNIT_LABELS[mode];

    return (
      <section
        ref={containerRef}
        className="flex h-full w-full items-center justify-center overflow-hidden"
        style={{
          '--countdown-frame-color': withAlpha(textToneColor, 0.22),
          backgroundColor: alternateColor,
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center text-center" style={getShellStyle({ frame, tokens: scaledTokens })}>
            <p
              className="uppercase"
              style={{
                fontSize: `${scaledTokens.subtitleSize}px`,
                letterSpacing: `${tokens.subtitleTracking}em`,
                color: withAlpha(textToneColor, 0.68),
              }}
            >
              {modeLabel}
            </p>
            <span
              className="block font-light leading-none"
              style={{
                fontSize: `${scaledTokens.numberSize}px`,
                letterSpacing: `${tokens.numberTracking}em`,
                color: primaryColor,
              }}
            >
              {formatNumber(singleValue)}
            </span>
            {labels ? (
              <span
                className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap uppercase"
                style={{
                  fontSize: `${scaledTokens.labelSize}px`,
                  letterSpacing: `${tokens.labelTracking}em`,
                  color: withAlpha(textToneColor, 0.82),
                }}
              >
                {unitLabel}
              </span>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        '--countdown-frame-color': withAlpha(textToneColor, 0.22),
        backgroundColor: alternateColor,
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center text-center" style={getShellStyle({ frame, tokens: scaledTokens })}>
          <p
            className="uppercase"
            style={{
              fontSize: `${scaledTokens.subtitleSize}px`,
              letterSpacing: `${tokens.subtitleTracking}em`,
              color: withAlpha(textToneColor, 0.68),
            }}
          >
            {tokens.tier === 'micro' ? SHORT_MODE_LABELS.all : MODE_LABELS.all}
          </p>

          <div
            className="grid w-full min-w-0 items-center"
            style={{
              gridTemplateColumns: `repeat(${tokens.columns}, minmax(0, 1fr))`,
              gap: `${tokens.gap}px`,
            }}
          >
            <CountdownUnit
              value={countdown.days}
              label={tokens.useShortLabels ? SHORT_UNIT_LABELS.days : UNIT_LABELS.days}
              showLabels={labels}
              tokens={scaledTokens}
              primaryColor={primaryColor}
              alternateColor={withAlpha(textToneColor, 0.82)}
            />
            <CountdownUnit
              value={countdown.hours}
              label={tokens.useShortLabels ? SHORT_UNIT_LABELS.hours : UNIT_LABELS.hours}
              showLabels={labels}
              tokens={scaledTokens}
              primaryColor={primaryColor}
              alternateColor={withAlpha(textToneColor, 0.82)}
            />
            <CountdownUnit
              value={countdown.minutes}
              label={tokens.useShortLabels ? SHORT_UNIT_LABELS.minutes : UNIT_LABELS.minutes}
              showLabels={labels}
              tokens={scaledTokens}
              primaryColor={primaryColor}
              alternateColor={withAlpha(textToneColor, 0.82)}
            />
            <CountdownUnit
              value={countdown.seconds}
              label={tokens.useShortLabels ? SHORT_UNIT_LABELS.seconds : UNIT_LABELS.seconds}
              showLabels={labels}
              tokens={scaledTokens}
              primaryColor={primaryColor}
              alternateColor={withAlpha(textToneColor, 0.82)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownView;
