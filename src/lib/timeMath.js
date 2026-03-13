export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const SYSTEM_TIMEZONE = '';
export const INVALID_TIMEZONE_FALLBACK = 'UTC+0';

const MIN_TIMEZONE_OFFSET_MINUTES = -12 * 60;
const MAX_TIMEZONE_OFFSET_MINUTES = 14 * 60;
const TIMEZONE_PATTERN = /^UTC(?:([+-]?)(\d{1,2})(?::?(\d{2}))?)?$/i;

const getNowTimeValue = (value) => {
  if (value instanceof Date) {
    return value.getTime();
  }

  return Number.isFinite(value) ? value : Date.now();
};

export const formatTimezoneOffset = (offsetMinutes) => {
  if (!Number.isFinite(offsetMinutes)) {
    return INVALID_TIMEZONE_FALLBACK;
  }

  const absoluteMinutes = Math.abs(Math.trunc(offsetMinutes));
  const sign = offsetMinutes < 0 ? '-' : '+';
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;

  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }

  return `UTC${sign}${hours}:${String(minutes).padStart(2, '0')}`;
};

export const parseTimezoneOffsetMinutes = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim().toUpperCase().replace(/\s+/g, '');

  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(TIMEZONE_PATTERN);

  if (!match) {
    return null;
  }

  const sign = match[1];
  const hoursGroup = match[2];
  const minutesGroup = match[3];

  if (!hoursGroup) {
    return 0;
  }

  const hours = Number.parseInt(hoursGroup, 10);
  const minutes = minutesGroup ? Number.parseInt(minutesGroup, 10) : 0;

  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || minutes >= 60) {
    return null;
  }

  const absoluteMinutes = hours * 60 + minutes;
  const offsetMinutes = sign === '-' ? -absoluteMinutes : absoluteMinutes;

  if (
    offsetMinutes < MIN_TIMEZONE_OFFSET_MINUTES ||
    offsetMinutes > MAX_TIMEZONE_OFFSET_MINUTES
  ) {
    return null;
  }

  return offsetMinutes;
};

export const normalizeTimezoneSetting = (value, fallback = SYSTEM_TIMEZONE) => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  const offsetMinutes = parseTimezoneOffsetMinutes(trimmed);

  if (offsetMinutes === null) {
    return fallback;
  }

  return formatTimezoneOffset(offsetMinutes);
};

const getResolvedTimezoneOffsetMinutes = (timezone) => {
  if (typeof timezone !== 'string' || !timezone.trim()) {
    return null;
  }

  const offsetMinutes = parseTimezoneOffsetMinutes(timezone);

  return offsetMinutes === null ? 0 : offsetMinutes;
};

const getClockYear = (nowTime, timezoneOffsetMinutes) => {
  if (timezoneOffsetMinutes === null) {
    return new Date(nowTime).getFullYear();
  }

  return new Date(nowTime + timezoneOffsetMinutes * MINUTE).getUTCFullYear();
};

const getYearBoundary = (year, timezoneOffsetMinutes) => {
  if (timezoneOffsetMinutes === null) {
    return new Date(year, 0, 1, 0, 0, 0, 0);
  }

  return new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0) - timezoneOffsetMinutes * MINUTE);
};

export const clampCountdownDiff = (targetTime, nowTime) => {
  return Math.max(0, targetTime - nowTime);
};

export const getCountdownTarget = (nowTime = Date.now(), timezone = SYSTEM_TIMEZONE) => {
  const resolvedNowTime = getNowTimeValue(nowTime);
  const timezoneOffsetMinutes = getResolvedTimezoneOffsetMinutes(timezone);
  const year = getClockYear(resolvedNowTime, timezoneOffsetMinutes);

  return getYearBoundary(year + 1, timezoneOffsetMinutes);
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

export const getCountdownSnapshot = (nowTime = Date.now(), timezone = SYSTEM_TIMEZONE) => {
  const resolvedNowTime = getNowTimeValue(nowTime);
  const now = new Date(resolvedNowTime);
  const target = getCountdownTarget(resolvedNowTime, timezone);
  const diff = clampCountdownDiff(target.getTime(), resolvedNowTime);

  return {
    now,
    target,
    diff,
    ...getCountdownParts(diff),
  };
};

export const getYearProgress = (nowTime = Date.now(), timezone = SYSTEM_TIMEZONE) => {
  const resolvedNowTime = getNowTimeValue(nowTime);
  const timezoneOffsetMinutes = getResolvedTimezoneOffsetMinutes(timezone);
  const year = getClockYear(resolvedNowTime, timezoneOffsetMinutes);
  const start = getYearBoundary(year, timezoneOffsetMinutes);
  const end = getYearBoundary(year + 1, timezoneOffsetMinutes);
  const elapsedMs = Math.max(0, Math.min(end.getTime() - start.getTime(), resolvedNowTime - start.getTime()));
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

export const getYearMeta = (nowTime = Date.now(), timezone = SYSTEM_TIMEZONE) => {
  const resolvedNowTime = getNowTimeValue(nowTime);
  const { start, end } = getYearProgress(resolvedNowTime, timezone);
  const totalDays = Math.round((end.getTime() - start.getTime()) / DAY);
  const currentDayIndex = Math.max(
    0,
    Math.min(totalDays - 1, Math.floor((resolvedNowTime - start.getTime()) / DAY)),
  );

  return {
    totalDays,
    currentDayIndex,
  };
};
