import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

import useCountdown from '../../hooks/useCountdown';

const HERO_MESSAGES = [
  {
    eyebrow: 'Present Year',
    title: 'See the year as one clear measure.',
    body: 'Switch between numerical time, spatial days, clipped progress, and full-canvas views without adding noise to the shell.',
  },
  {
    eyebrow: 'Focused Views',
    title: 'Move between modes without losing context.',
    body: 'Countdown, Dots, Pie, and Progress each reduce the same year into a different visual logic, all driven by the same clock.',
  },
  {
    eyebrow: 'Quiet Interface',
    title: 'Keep the chrome light and the year visible.',
    body: 'Theme-aware routes, compact controls, shareable embeds, and minimal layouts keep attention on the time itself.',
  },
];

const UNIT_LABELS = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
};

const formatNumber = (value) => String(value).padStart(2, '0');

const CountdownCell = ({ value, label }) => {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center border border-black/8 px-4 py-5 dark:border-white/8 sm:px-5 sm:py-6">
      <span className="text-[clamp(2rem,7vw,4.8rem)] font-light leading-none tracking-[0.06em] text-black dark:text-white">
        {formatNumber(value)}
      </span>
      <span className="mt-3 text-[0.62rem] uppercase tracking-[0.28em] text-black/42 dark:text-white/42 sm:text-[0.68rem]">
        {label}
      </span>
    </div>
  );
};

const HomeHero = () => {
  const countdown = useCountdown();
  const [messageIndex, setMessageIndex] = useState(0);
  const textRef = useRef(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % HERO_MESSAGES.length);
    }, 4200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!textRef.current) {
      return;
    }

    gsap.fromTo(
      textRef.current.children,
      { y: 14, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.06,
        clearProps: 'transform',
      },
    );
  }, [messageIndex]);

  const message = HERO_MESSAGES[messageIndex];

  const heroLinks = useMemo(
    () => [
      { label: 'Countdown', to: '/view/countdown' },
      { label: 'Dots', to: '/view/dots' },
      { label: 'Pie', to: '/view/pie' },
      { label: 'Progress', to: '/view/progress' },
    ],
    [],
  );

  return (
    <section id="hero" className="relative flex min-h-screen w-full items-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-10 lg:pb-16 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-home-shape className="absolute left-[8%] top-[20%] h-12 w-12 rounded-full border border-black/8 dark:border-white/8" />
        <div data-home-shape className="absolute right-[12%] top-[16%] h-16 w-16 border border-black/8 dark:border-white/8" />
        <div data-home-shape className="absolute bottom-[18%] left-[14%] h-20 w-px bg-black/10 dark:bg-white/10" />
        <div data-home-shape className="absolute bottom-[14%] right-[10%] h-10 w-10 rotate-45 border border-black/8 dark:border-white/8" />
      </div>

      <div className="relative z-10 grid w-full gap-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-end lg:gap-10">
        <div ref={textRef} className="max-w-2xl space-y-6 lg:space-y-7">
          <p className="text-xs uppercase tracking-[0.36em] text-black/45 dark:text-white/45">{message.eyebrow}</p>
          <h1 className="text-5xl font-light uppercase leading-none tracking-[0.08em] text-balance text-black dark:text-white sm:text-6xl lg:text-7xl">
            {message.title}
          </h1>
          <p className="max-w-xl text-base leading-8 text-black/60 dark:text-white/60 sm:text-lg">
            {message.body}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
            {heroLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs uppercase tracking-[0.3em] text-black/52 transition-colors hover:text-black dark:text-white/52 dark:hover:text-white sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="ml-auto w-full max-w-2xl">
          <div className="grid grid-cols-2 gap-px bg-black/8 dark:bg-white/8">
            <CountdownCell value={countdown.days} label={UNIT_LABELS.days} />
            <CountdownCell value={countdown.hours} label={UNIT_LABELS.hours} />
            <CountdownCell value={countdown.minutes} label={UNIT_LABELS.minutes} />
            <CountdownCell value={countdown.seconds} label={UNIT_LABELS.seconds} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
