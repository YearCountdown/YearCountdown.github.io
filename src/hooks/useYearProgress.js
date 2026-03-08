import { useEffect, useMemo, useState } from 'react';

const SECOND = 1000;

const getYearProgress = (nowTime) => {
  const now = new Date(nowTime);
  const year = now.getFullYear();
  const start = new Date(year, 0, 1, 0, 0, 0, 0);
  const end = new Date(year + 1, 0, 1, 0, 0, 0, 0);
  const elapsedMs = Math.max(0, now.getTime() - start.getTime());
  const totalMs = end.getTime() - start.getTime();
  const percentage = totalMs === 0 ? 0 : (elapsedMs / totalMs) * 100;

  return {
    year,
    start,
    end,
    elapsedMs,
    totalMs,
    percentage,
  };
};

const useYearProgress = (decimals = 2) => {
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
    const progress = getYearProgress(nowTime);

    return {
      ...progress,
      percentageLabel: `${progress.percentage.toFixed(decimals)}%`,
    };
  }, [decimals, nowTime]);
};

export default useYearProgress;
