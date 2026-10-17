import { formatDateInput, parseDateInput } from './schedule';

const STORAGE_KEY = 'shift-schedule-settings';
const SHARE_PARAM = 's';
const MAX_SHIFT_TYPES = 12;
const MAX_PATTERN_BLOCKS = 30;
export const MAX_BLOCK_DAYS = 99;
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2200;

export const DEFAULT_SHIFT_TYPES = [
  { id: 'day', label: 'Day Shift', code: 'D', color: '#4caf50', striped: true, isOff: false },
  { id: 'night', label: 'Night Shift', code: 'N', color: '#2196f3', striped: true, isOff: false },
  { id: 'off', label: 'Off', code: '', color: '#ffffff', striped: false, isOff: true },
];

export const DEFAULT_PATTERN = [
  { typeId: 'day', count: 2 },
  { typeId: 'night', count: 2 },
  { typeId: 'off', count: 4 },
];

export const defaultSettings = () => ({
  start: formatDateInput(new Date()),
  year: new Date().getFullYear(),
  shiftTypes: DEFAULT_SHIFT_TYPES,
  pattern: DEFAULT_PATTERN,
  markTodayInExports: false,
});

export const clampInt = (value, min, max) => {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};

const sanitizeShiftType = (raw) => {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string' || !/^[\w-]{1,40}$/.test(raw.id)) return null;
  return {
    id: raw.id,
    label: typeof raw.label === 'string' ? raw.label.slice(0, 40) : raw.id,
    code: typeof raw.code === 'string' ? raw.code.slice(0, 3) : '',
    // Colours end up in inline styles, so only accept plain hex values
    color: typeof raw.color === 'string' && /^#[0-9a-f]{6}$/i.test(raw.color) ? raw.color : '#ffffff',
    striped: Boolean(raw.striped),
    isOff: Boolean(raw.isOff),
  };
};

// Settings can come from a shared link or old local storage, so validate everything
export const sanitizeSettings = (raw) => {
  const fallback = defaultSettings();
  if (!raw || typeof raw !== 'object') return fallback;

  const shiftTypes = [];
  for (const type of Array.isArray(raw.shiftTypes) ? raw.shiftTypes : []) {
    const clean = sanitizeShiftType(type);
    if (clean && !shiftTypes.some((t) => t.id === clean.id)) shiftTypes.push(clean);
  }
  if (shiftTypes.length === 0) return fallback;

  const pattern = (Array.isArray(raw.pattern) ? raw.pattern : [])
    .filter((block) => block && shiftTypes.some((t) => t.id === block.typeId))
    .map((block) => ({ typeId: block.typeId, count: clampInt(block.count, 0, MAX_BLOCK_DAYS) }));

  return {
    start: parseDateInput(raw.start) ? raw.start : fallback.start,
    year: clampInt(raw.year ?? fallback.year, MIN_YEAR, MAX_YEAR),
    shiftTypes: shiftTypes.slice(0, MAX_SHIFT_TYPES),
    pattern: pattern.slice(0, MAX_PATTERN_BLOCKS),
    markTodayInExports: Boolean(raw.markTodayInExports),
  };
};

export const canAddShiftType = (shiftTypes) => shiftTypes.length < MAX_SHIFT_TYPES;
export const canAddPatternBlock = (pattern) => pattern.length < MAX_PATTERN_BLOCKS;

const toBase64Url = (text) => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (encoded) => {
  const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
};

export const encodeSettings = (settings) => toBase64Url(JSON.stringify(settings));

export const decodeSettings = (encoded) => {
  try {
    return sanitizeSettings(JSON.parse(fromBase64Url(encoded)));
  } catch {
    return null;
  }
};

export const buildShareUrl = (settings, location = window.location) =>
  `${location.origin}${location.pathname}?${SHARE_PARAM}=${encodeSettings(settings)}`;

export const getSharedSettings = (search) => {
  const encoded = new URLSearchParams(search).get(SHARE_PARAM);
  return encoded ? decodeSettings(encoded) : null;
};

export const loadStoredSettings = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? sanitizeSettings(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
};

export const storeSettings = (settings) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable (private browsing, blocked cookies); settings just won't persist
  }
};

export const loadInitialSettings = (search = window.location.search) =>
  getSharedSettings(search) ?? loadStoredSettings() ?? defaultSettings();
