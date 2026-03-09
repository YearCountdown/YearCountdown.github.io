const VIEW_PREFERENCES_COOKIE_KEY = 'yc_view_preferences';
const VIEW_PREFERENCES_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const safeParsePreferences = (value) => {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const readViewPreferencesCookie = () => {
  if (typeof document === 'undefined') {
    return {};
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${VIEW_PREFERENCES_COOKIE_KEY}=([^;]*)`),
  );

  if (!match) {
    return {};
  }

  try {
    return safeParsePreferences(decodeURIComponent(match[1]));
  } catch {
    return {};
  }
};

export const writeViewPreferencesCookie = (preferences) => {
  if (typeof document === 'undefined') {
    return;
  }

  const payload = encodeURIComponent(JSON.stringify(preferences));
  document.cookie = `${VIEW_PREFERENCES_COOKIE_KEY}=${payload}; Max-Age=${VIEW_PREFERENCES_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
};
