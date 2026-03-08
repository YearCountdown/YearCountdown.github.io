import { useEffect, useMemo, useState } from 'react';

import { useTheme } from '../../context/ThemeContext';
import useCountdown from '../../hooks/useCountdown';
import useYearProgress from '../../hooks/useYearProgress';

const padNumber = (value) => String(value).padStart(2, '0');

const getLockScreenTime = () => {
  const now = new Date();
  return {
    hours: padNumber(now.getHours()),
    minutes: padNumber(now.getMinutes()),
    dateLabel: now.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
  };
};

const IPhoneLockscreenVector = () => {
  const { theme } = useTheme();
  const countdown = useCountdown();
  const { percentage, percentageLabel } = useYearProgress(1);
  const [clock, setClock] = useState(getLockScreenTime);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(getLockScreenTime());
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const dots = useMemo(() => {
    const total = 24;
    const filled = Math.max(1, Math.round((percentage / 100) * total));

    return Array.from({ length: total }, (_, index) => index < filled);
  }, [percentage]);

  const palette =
    theme === 'dark'
      ? {
          frame: 'rgba(255,255,255,0.18)',
          chrome: 'rgba(255,255,255,0.22)',
          screen: 'rgb(9 9 11)',
          text: 'rgb(255 255 255)',
          muted: 'rgba(255,255,255,0.48)',
          faint: 'rgba(255,255,255,0.12)',
          accent: 'rgba(255,255,255,0.16)',
          fill: 'rgb(255 255 255)',
          fillMuted: 'rgba(255,255,255,0.2)',
        }
      : {
          frame: 'rgba(0,0,0,0.16)',
          chrome: 'rgba(0,0,0,0.18)',
          screen: 'rgb(245 245 244)',
          text: 'rgb(0 0 0)',
          muted: 'rgba(0,0,0,0.48)',
          faint: 'rgba(0,0,0,0.1)',
          accent: 'rgba(0,0,0,0.08)',
          fill: 'rgb(0 0 0)',
          fillMuted: 'rgba(0,0,0,0.16)',
        };

  return (
    <div className="relative flex min-h-[32rem] items-center justify-center overflow-hidden bg-stone-100 px-6 py-10 dark:bg-zinc-950 sm:min-h-[36rem] sm:px-8 sm:py-12 lg:min-h-[40rem]">
      <div data-wallpaper-accent className="pointer-events-none absolute left-[8%] top-[16%] h-16 w-16 border border-black/10 dark:border-white/10 sm:h-20 sm:w-20" />
      <div data-wallpaper-accent className="pointer-events-none absolute left-[15%] bottom-[14%] h-0 w-0 border-b-[38px] border-l-[24px] border-r-[24px] border-b-black/10 border-l-transparent border-r-transparent dark:border-b-white/10 sm:border-b-[48px] sm:border-l-[30px] sm:border-r-[30px]" />
      <div data-wallpaper-accent className="pointer-events-none absolute right-[10%] top-[18%] h-[4.5rem] w-[4.5rem] rounded-t-full border border-b-0 border-black/10 dark:border-white/10 sm:h-24 sm:w-24" />
      <div data-wallpaper-accent className="pointer-events-none absolute right-[12%] bottom-[12%] h-20 w-20 rounded-tl-full border-l border-t border-black/10 dark:border-white/10 sm:h-28 sm:w-28" />

      <div data-wallpaper-device className="relative z-10 mx-auto aspect-[0.5] w-full max-w-[18rem] sm:max-w-[20rem] lg:max-w-[22rem]">
        <div
          className="absolute inset-0 rounded-[3.2rem] border backdrop-blur-[1px]"
          style={{ borderColor: palette.frame, backgroundColor: palette.accent }}
        />
        <div className="absolute left-1/2 top-[0.75rem] h-[1.8rem] w-[6.5rem] -translate-x-1/2 rounded-full" style={{ backgroundColor: palette.chrome }} />
        <div className="absolute left-[0.4rem] top-[7.3rem] h-16 w-px rounded-full" style={{ backgroundColor: palette.chrome }} />
        <div className="absolute right-[0.4rem] top-[8.5rem] h-24 w-px rounded-full" style={{ backgroundColor: palette.chrome }} />

        <div
          className="absolute inset-[0.55rem] overflow-hidden rounded-[2.7rem]"
          style={{ backgroundColor: palette.screen, color: palette.text }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: palette.screen }} />

          <div data-wallpaper-screen-shape className="absolute left-1/2 top-[17%] h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: palette.faint }} />
          <svg
            data-wallpaper-screen-shape
            viewBox="0 0 200 200"
            className="absolute left-1/2 top-[18%] h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 opacity-90 sm:h-[17rem] sm:w-[17rem]"
            aria-hidden="true"
          >
            <circle cx="100" cy="100" r="72" fill="none" stroke={palette.fillMuted} strokeWidth="4" />
            <circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke={palette.fill}
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 72}
              strokeDashoffset={(2 * Math.PI * 72) * (1 - percentage / 100)}
              transform="rotate(-90 100 100)"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-x-0 top-[4.4rem] z-10 px-6 text-center sm:px-7">
            <p className="text-[0.68rem] uppercase tracking-[0.28em]" style={{ color: palette.muted }}>
              {clock.dateLabel}
            </p>
            <div className="mt-1 text-[clamp(3.25rem,7vw,4.8rem)] font-light leading-none tracking-[-0.08em]">
              {clock.hours}:{clock.minutes}
            </div>
          </div>

          <div className="absolute inset-x-5 top-[12.4rem] z-10 grid grid-cols-2 gap-3 sm:inset-x-6 sm:top-[13rem]">
            <div className="rounded-[1.25rem] border px-4 py-3" style={{ borderColor: palette.frame, backgroundColor: palette.accent }}>
              <p className="text-[0.58rem] uppercase tracking-[0.26em]" style={{ color: palette.muted }}>
                Days Left
              </p>
              <p className="mt-2 text-2xl font-light tracking-[-0.05em]">{countdown.days}</p>
            </div>
            <div className="rounded-[1.25rem] border px-4 py-3" style={{ borderColor: palette.frame, backgroundColor: palette.accent }}>
              <p className="text-[0.58rem] uppercase tracking-[0.26em]" style={{ color: palette.muted }}>
                Year Done
              </p>
              <p className="mt-2 text-2xl font-light tracking-[-0.05em]">{percentageLabel}</p>
            </div>
          </div>

          <div className="absolute inset-x-6 bottom-[5.4rem] z-10">
            <div className="grid grid-cols-6 gap-2">
              {dots.map((filled, index) => (
                <span
                  key={index}
                  data-wallpaper-screen-shape
                  className="aspect-square rounded-full border"
                  style={{
                    borderColor: filled ? palette.fill : palette.fillMuted,
                    backgroundColor: filled ? palette.fill : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-x-6 bottom-6 z-10 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.22em]" style={{ color: palette.muted }}>
            <span>YearCountdown</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPhoneLockscreenVector;
