import useCountdown from '../../hooks/useCountdown';
import useResponsiveCountdown from '../../hooks/useResponsiveCountdown';

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

const CountdownUnit = ({ value, label, showLabels, tokens }) => {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center">
      <span
        className="block font-light leading-none text-black dark:text-white"
        style={{
          fontSize: `${tokens.numberSize}px`,
          letterSpacing: `${tokens.numberTracking}em`,
        }}
      >
        {formatNumber(value)}
      </span>
      {showLabels ? (
        <span
          className="mt-2 uppercase text-black/42 dark:text-white/42"
          style={{
            fontSize: `${tokens.labelSize}px`,
            letterSpacing: `${tokens.labelTracking}em`,
            marginTop: `${Math.max(4, tokens.labelSize * 0.65)}px`,
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
    border: '1px solid color-mix(in srgb, currentColor 12%, transparent)',
  };
};

const CountdownView = ({ mode = 'all', frame = false, labels = true }) => {
  const countdown = useCountdown();
  const { containerRef, tokens } = useResponsiveCountdown({ mode, labels });
  const modeLabel = tokens.tier === 'micro' ? SHORT_MODE_LABELS[mode] : MODE_LABELS[mode];

  if (mode !== 'all') {
    const singleValue = getSingleModeValue(countdown, mode);
    const unitLabel = tokens.useShortLabels ? SHORT_UNIT_LABELS[mode] : UNIT_LABELS[mode];

    return (
      <section ref={containerRef} className="flex h-full w-full items-center justify-center overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center text-center" style={getShellStyle({ frame, tokens })}>
            <p
              className="uppercase text-black/38 dark:text-white/38"
              style={{
                fontSize: `${tokens.subtitleSize}px`,
                letterSpacing: `${tokens.subtitleTracking}em`,
              }}
            >
              {modeLabel}
            </p>
            <span
              className="block font-light leading-none text-black dark:text-white"
              style={{
                fontSize: `${tokens.numberSize}px`,
                letterSpacing: `${tokens.numberTracking}em`,
              }}
            >
              {formatNumber(singleValue)}
            </span>
            {labels ? (
              <span
                className="uppercase text-black/42 dark:text-white/42"
                style={{
                  fontSize: `${tokens.labelSize}px`,
                  letterSpacing: `${tokens.labelTracking}em`,
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
    <section ref={containerRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center text-center" style={getShellStyle({ frame, tokens })}>
          <p
            className="uppercase text-black/38 dark:text-white/38"
            style={{
              fontSize: `${tokens.subtitleSize}px`,
              letterSpacing: `${tokens.subtitleTracking}em`,
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
              tokens={tokens}
            />
            <CountdownUnit
              value={countdown.hours}
              label={tokens.useShortLabels ? SHORT_UNIT_LABELS.hours : UNIT_LABELS.hours}
              showLabels={labels}
              tokens={tokens}
            />
            <CountdownUnit
              value={countdown.minutes}
              label={tokens.useShortLabels ? SHORT_UNIT_LABELS.minutes : UNIT_LABELS.minutes}
              showLabels={labels}
              tokens={tokens}
            />
            <CountdownUnit
              value={countdown.seconds}
              label={tokens.useShortLabels ? SHORT_UNIT_LABELS.seconds : UNIT_LABELS.seconds}
              showLabels={labels}
              tokens={tokens}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownView;
