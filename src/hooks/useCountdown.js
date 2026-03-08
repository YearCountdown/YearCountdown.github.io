import { useEffect, useMemo, useState } from 'react';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const getCountdownTarget = () => {
  const now = new Date();
  return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
};

const clampDiff = (targetTime, nowTime) => {
  return Math.max(0, targetTime - nowTime);
};

const getCountdownParts = (diff) => {
  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / MINUTE);
  const seconds = Math.floor((diff % MINUTE) / SECOND);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalDays: Math.floor(diff / DAY),
    totalHours: Math.floor(diff / HOUR),
    totalMinutes: Math.floor(diff / MINUTE),
    totalSeconds: Math.floor(diff / SECOND),
  };
};

const useCountdown = () => {
  const [target] = useState(() => getCountdownTarget());
  const [nowTime, setNowTime] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTime(Date.now());
    }, SECOND);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return useMemo(() => {
    const diff = clampDiff(target.getTime(), nowTime);

    return {
      target,
      diff,
      ...getCountdownParts(diff),
    };
  }, [nowTime, target]);
};

export default useCountdown;
