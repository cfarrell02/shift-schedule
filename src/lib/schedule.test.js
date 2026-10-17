import {
  buildIcs,
  buildMonth,
  daysBetween,
  expandPattern,
  formatDateInput,
  parseDateInput,
  shiftOn,
} from './schedule';

const pattern = [
  { typeId: 'day', count: 2 },
  { typeId: 'night', count: 2 },
  { typeId: 'off', count: 4 },
];
const sequence = expandPattern(pattern);

describe('parseDateInput', () => {
  it('parses as a local date', () => {
    const date = parseDateInput('2026-03-05');
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 2, 5]);
  });

  it('rejects invalid input', () => {
    expect(parseDateInput('')).toBeNull();
    expect(parseDateInput('2026-02-31')).toBeNull();
    expect(parseDateInput(undefined)).toBeNull();
  });

  it('round trips with formatDateInput', () => {
    expect(formatDateInput(parseDateInput('2026-12-09'))).toBe('2026-12-09');
  });
});

describe('daysBetween', () => {
  it('ignores daylight saving changes', () => {
    expect(daysBetween(new Date(2026, 2, 28), new Date(2026, 2, 30))).toBe(2);
    expect(daysBetween(new Date(2026, 9, 24), new Date(2026, 9, 26))).toBe(2);
  });

  it('is negative for earlier dates', () => {
    expect(daysBetween(new Date(2026, 0, 10), new Date(2026, 0, 1))).toBe(-9);
  });
});

describe('expandPattern', () => {
  it('expands blocks and ignores bad counts', () => {
    expect(sequence).toEqual(['day', 'day', 'night', 'night', 'off', 'off', 'off', 'off']);
    expect(expandPattern([{ typeId: 'day', count: NaN }, { typeId: 'off', count: -2 }])).toEqual([]);
  });
});

describe('shiftOn', () => {
  it('uses the full start date, not just the day of month', () => {
    const start = new Date(2026, 2, 5);
    expect(shiftOn(new Date(2026, 2, 5), start, sequence)).toBe('day');
    expect(shiftOn(new Date(2026, 2, 7), start, sequence)).toBe('night');
    // 2026-01-05 is 59 days before, 59 % 8 = 3 → 8 - 3 = index 5
    expect(shiftOn(new Date(2026, 0, 5), start, sequence)).toBe('off');
  });

  it('never returns undefined for dates well before the start', () => {
    const short = expandPattern([{ typeId: 'a', count: 1 }, { typeId: 'b', count: 1 }, { typeId: 'c', count: 1 }]);
    const start = new Date(2026, 0, 6);
    for (let d = 1; d <= 6; d++) {
      expect(shiftOn(new Date(2026, 0, d), start, short)).toBeDefined();
    }
    expect(shiftOn(new Date(2026, 0, 4), start, short)).toBe('b');
  });

  it('handles start dates after the target', () => {
    expect(shiftOn(new Date(2026, 0, 1), new Date(2027, 5, 1), sequence)).not.toBeUndefined();
  });

  it('returns null for an empty pattern', () => {
    expect(shiftOn(new Date(), new Date(), [])).toBeNull();
  });
});

describe('buildMonth', () => {
  it('always has six weeks starting on Sunday, padded with neighbouring months', () => {
    // February 2026 starts on a Sunday
    const month = buildMonth(2026, 1, new Date(2026, 0, 1), sequence);
    expect(month.weeks).toHaveLength(6);
    expect(month.weeks.every((week) => week.length === 7)).toBe(true);
    expect(month.weeks[0][0].date.getDate()).toBe(1);
    expect(month.weeks[4][0].inMonth).toBe(false);

    // March 2026 starts on a Sunday too; April starts on a Wednesday
    const april = buildMonth(2026, 3, new Date(2026, 0, 1), sequence);
    expect(april.weeks[0][0]).toMatchObject({ inMonth: false });
    expect(april.weeks[0][0].date.getDate()).toBe(29);
    expect(april.weeks[0][3].date.getDate()).toBe(1);
  });

  it('carries the pattern across month boundaries', () => {
    const start = new Date(2026, 0, 1);
    const april = buildMonth(2026, 3, start, sequence);
    for (const week of april.weeks) {
      for (const day of week) {
        expect(day.typeId).toBe(shiftOn(day.date, start, sequence));
      }
    }
  });
});

describe('buildIcs', () => {
  const shiftTypes = [
    { id: 'day', label: 'Day Shift', isOff: false },
    { id: 'night', label: 'Night, late', isOff: false },
    { id: 'off', label: 'Off', isOff: true },
  ];
  const ics = buildIcs({
    year: 2026,
    start: new Date(2026, 0, 1),
    sequence,
    shiftTypes,
    now: new Date(Date.UTC(2026, 0, 1, 12, 0, 0)),
  });

  it('creates an event for each working day only', () => {
    // 365 days, 4 of every 8 working: 45 full cycles (180) + 5 remaining days (4 working)
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(184);
    expect(ics).toContain('DTSTART;VALUE=DATE:20260101\r\nDTEND;VALUE=DATE:20260102');
    expect(ics).not.toContain('SUMMARY:Off');
  });

  it('escapes text and uses CRLF line endings', () => {
    expect(ics).toContain('SUMMARY:Night\\, late');
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });
});
