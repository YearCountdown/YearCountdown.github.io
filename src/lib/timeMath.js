export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const clampCountdownDiff = (targetTime, nowTime) => {
  return Math.max(0, targetTime - nowTime);
};

export const getCountdownTarget = (nowDate = new Date()) => {
  return new Date(nowDate.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
};

export const getCountdownParts = (diff) => {
  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    totalDays: Math.floor(diff / DAY),
    totalHours: Math.floor(diff / HOUR),
    totalMinutes: Math.floor(diff / MINUTE),
    totalSeconds: Math.floor(diff / SECOND),
  };
};

export const getCountdownSnapshot = (nowTime = Date.now()) => {
  const now = new Date(nowTime);
  const target = getCountdownTarget(now);
  const diff = clampCountdownDiff(target.getTime(), nowTime);

  return {
    now,
    target,
    diff,
    ...getCountdownParts(diff),
  };
};

export const getYearProgress = (nowTime = Date.now()) => {
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

export const getYearMeta = (nowTime = Date.now()) => {
  const now = new Date(nowTime);
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeapYear ? 366 : 365;
  const currentDayIndex = Math.floor((now.getTime() - startOfYear.getTime()) / DAY);

  return {
    totalDays,
    currentDayIndex,
  };
};
