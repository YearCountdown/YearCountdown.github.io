import { useEffect, useMemo, useState } from 'react';

import { SECOND, getYearProgress } from '../lib/timeMath';

const useYearProgress = (decimals = 2, timezone) => {
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
    const progress = getYearProgress(nowTime, timezone);

    return {
      ...progress,
      percentageLabel: `${progress.percentage.toFixed(decimals)}%`,
    };
  }, [decimals, nowTime, timezone]);
};

export default useYearProgress;
