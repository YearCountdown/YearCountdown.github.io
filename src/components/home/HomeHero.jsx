import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

import heroMessages from '../../content/heroMessages.json';
import useCountdown from '../../hooks/useCountdown';

const UNIT_LABELS = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
};

const formatNumber = (value) => String(value).padStart(2, '0');

const getRandomIndex = (length) => {
  return Math.floor(Math.random() * length);
};

const getInitialHeadlineState = () => {
  const currentIndex = getRandomIndex(heroMessages.length);
  const remainingIndices = heroMessages.map((_, index) => index).filter((index) => index !== currentIndex);

  return {
    currentIndex,
    remainingIndices,
  };
};

const CountdownCell = ({ value, label }) => {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7">
      <span className="text-[clamp(2rem,7vw,4.8rem)] font-light leading-none tracking-[0.06em] text-black dark:text-white">
        {formatNumber(value)}
      </span>
      <span className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/42 dark:text-white/42 sm:text-[0.68rem]">
        {label}
      </span>
    </div>
  );
};

const HomeHero = () => {
  const countdown = useCountdown();
  const [headlineState, setHeadlineState] = useState(getInitialHeadlineState);
  const headlineRef = useRef(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeadlineState((current) => {
        let available = current.remainingIndices;

        if (!available.length) {
          available = heroMessages.map((_, index) => index).filter((index) => index !== current.currentIndex);
        }

        const nextPoolIndex = getRandomIndex(available.length);
        const nextIndex = available[nextPoolIndex];
        const nextRemaining = available.filter((_, index) => index !== nextPoolIndex);

        return {
          currentIndex: nextIndex,
          remainingIndices: nextRemaining,
        };
      });
    }, 4200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!headlineRef.current) {
      return;
    }

    gsap.fromTo(
      headlineRef.current,
      { y: 18, autoAlpha: 0, filter: 'blur(6px)' },
      {
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'transform,filter',
      },
    );
  }, [headlineState.currentIndex]);

  const headline = heroMessages[headlineState.currentIndex];

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
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-10 lg:pb-16 lg:pt-36"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-home-hero-shape className="absolute bottom-[10%] left-[5%] h-10 w-10 border border-black/10 dark:border-white/10" />
        <div data-home-hero-shape className="absolute bottom-[9%] left-[10%] h-0 w-0 border-b-[22px] border-l-[16px] border-r-[16px] border-b-black/10 border-l-transparent border-r-transparent dark:border-b-white/10" />
        <div data-home-hero-shape className="absolute bottom-[8%] right-[6%] h-12 w-12 rounded-tl-full border-l border-t border-black/10 dark:border-white/10" />
        <div data-home-hero-shape className="absolute bottom-[12%] right-[12%] h-10 w-10 rounded-t-full border border-b-0 border-black/10 dark:border-white/10" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-center lg:gap-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center space-y-5 text-center lg:mx-0 lg:items-start lg:text-left lg:space-y-6">
          <p className="text-xs uppercase tracking-[0.36em] text-black/45 dark:text-white/45">Present Year</p>
          <h1 ref={headlineRef} className="text-[clamp(1.68rem,4.8vw,3.48rem)] font-light uppercase leading-[0.9] tracking-[0.08em] text-black dark:text-white">
            {headline}
          </h1>
          <p className="text-lg font-light uppercase tracking-[0.24em] text-black/56 dark:text-white/56 sm:text-xl">
            See the year as one clear measure.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-3 lg:justify-start">
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

        <div className="mx-auto w-full max-w-2xl justify-self-center lg:mx-0 lg:justify-self-end">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
