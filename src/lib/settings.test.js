import { DEFAULT_PATTERN, DEFAULT_SHIFT_TYPES, decodeSettings, encodeSettings, getSharedSettings, sanitizeSettings } from './settings';

const settings = {
  start: '2026-03-05',
  year: 2026,
  shiftTypes: [...DEFAULT_SHIFT_TYPES, { id: 'long', label: 'Lá fada ☀', code: 'L', color: '#ff9800', striped: false, isOff: false }],
  pattern: DEFAULT_PATTERN,
  markTodayInExports: true,
};

describe('settings encoding', () => {
  it('round trips, including non-ASCII labels', () => {
    expect(decodeSettings(encodeSettings(settings))).toEqual(settings);
  });

  it('reads settings from a share link query string', () => {
    expect(getSharedSettings(`?s=${encodeSettings(settings)}`)).toEqual(settings);
    expect(getSharedSettings('')).toBeNull();
  });

  it('returns null for garbage', () => {
    expect(decodeSettings('not-valid-base64!!')).toBeNull();
  });
});

describe('sanitizeSettings', () => {
  it('rejects colours that are not hex values', () => {
    const result = sanitizeSettings({
      ...settings,
      shiftTypes: [{ ...DEFAULT_SHIFT_TYPES[0], color: 'red; background-image: url(evil)' }],
    });
    expect(result.shiftTypes[0].color).toBe('#ffffff');
  });

  it('drops pattern blocks for unknown shift types and clamps counts', () => {
    const result = sanitizeSettings({
      ...settings,
      pattern: [{ typeId: 'missing', count: 2 }, { typeId: 'day', count: 1000 }, { typeId: 'off', count: 'x' }],
    });
    expect(result.pattern).toEqual([{ typeId: 'day', count: 99 }, { typeId: 'off', count: 0 }]);
  });

  it('falls back to defaults for invalid dates, years and empty shift types', () => {
    const result = sanitizeSettings({ ...settings, start: '2026-02-31', year: 99999 });
    expect(result.start).not.toBe('2026-02-31');
    expect(result.year).toBe(2200);
    expect(sanitizeSettings({ ...settings, shiftTypes: [] }).shiftTypes).toEqual(DEFAULT_SHIFT_TYPES);
  });
});
