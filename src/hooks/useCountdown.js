import { useEffect, useMemo, useState } from 'react';

import { SECOND, getCountdownSnapshot } from '../lib/timeMath';

const useCountdown = (timezone) => {
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
    return {
      ...getCountdownSnapshot(nowTime, timezone),
    };
  }, [nowTime, timezone]);
};

export default useCountdown;
