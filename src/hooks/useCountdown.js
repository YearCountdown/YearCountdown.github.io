import { useEffect, useMemo, useState } from 'react';

import { SECOND, getCountdownSnapshot, getCountdownTarget } from '../lib/timeMath';

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
    return {
      ...getCountdownSnapshot(nowTime),
      target,
    };
  }, [nowTime, target]);
};

export default useCountdown;
