import useCountdown from '../../hooks/useCountdown';

const MODE_LABELS = {
  all: 'Year ends in',
  days: 'Days remaining',
  hours: 'Hours remaining',
  minutes: 'Minutes remaining',
  seconds: 'Seconds remaining',
};

const UNIT_LABELS = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
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

const CountdownUnit = ({ value, label, showLabels }) => {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center">
      <span className="block text-[clamp(2.8rem,11vw,7rem)] font-light leading-none tracking-[0.08em] text-black dark:text-white">
        {formatNumber(value)}
      </span>
      {showLabels ? (
        <span className="mt-3 text-[0.62rem] uppercase tracking-[0.28em] text-black/42 dark:text-white/42 sm:text-[0.68rem]">
          {label}
        </span>
      ) : null}
    </div>
  );
};

const CountdownView = ({ mode = 'all', frame = true, labels = true }) => {
  const countdown = useCountdown();

  if (mode !== 'all') {
    const singleValue = getSingleModeValue(countdown, mode);
    const minDigits = mode === 'seconds' || mode === 'minutes' ? 2 : 2;

    return (
      <section className="flex h-full w-full items-center justify-center">
        <div
          className={`mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 text-center ${
            frame ? 'rounded-[2rem] border border-black/10 px-6 py-10 dark:border-white/10 sm:px-10 sm:py-12' : ''
          }`}
        >
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-black/38 dark:text-white/38">
            {MODE_LABELS[mode]}
          </p>
          <span className="block text-[clamp(4rem,19vw,11rem)] font-light leading-none tracking-[0.08em] text-black dark:text-white">
            {formatNumber(singleValue, minDigits)}
          </span>
          {labels ? (
            <span className="text-[0.65rem] uppercase tracking-[0.34em] text-black/42 dark:text-white/42">
              {UNIT_LABELS[mode]}
            </span>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full w-full items-center justify-center">
      <div
        className={`mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-8 text-center ${
          frame ? 'rounded-[2rem] border border-black/10 px-6 py-10 dark:border-white/10 sm:px-10 sm:py-12 lg:px-14 lg:py-14' : ''
        }`}
      >
        <p className="text-[0.62rem] uppercase tracking-[0.34em] text-black/38 dark:text-white/38">
          {MODE_LABELS.all}
        </p>

        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4 md:gap-x-8 lg:gap-x-10">
          <CountdownUnit value={countdown.days} label={UNIT_LABELS.days} showLabels={labels} />
          <CountdownUnit value={countdown.hours} label={UNIT_LABELS.hours} showLabels={labels} />
          <CountdownUnit value={countdown.minutes} label={UNIT_LABELS.minutes} showLabels={labels} />
          <CountdownUnit value={countdown.seconds} label={UNIT_LABELS.seconds} showLabels={labels} />
        </div>
      </div>
    </section>
  );
};

export default CountdownView;
