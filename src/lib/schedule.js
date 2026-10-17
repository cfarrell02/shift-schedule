const MS_PER_DAY = 24 * 60 * 60 * 1000;

const pad = (n) => String(n).padStart(2, '0');

// Parses a "YYYY-MM-DD" string as a local date (new Date("YYYY-MM-DD") would parse as UTC)
export const parseDateInput = (value) => {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [y, m, d] = match.slice(1).map(Number);
  const date = new Date(y, m - 1, d);
  // Reject dates that overflowed, e.g. 2026-02-31
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
};

export const formatDateInput = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Whole days from a to b, unaffected by daylight saving changes
export const daysBetween = (a, b) =>
  Math.round(
    (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
      Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
      MS_PER_DAY
  );

const mod = (n, m) => ((n % m) + m) % m;

// [{ typeId: 'day', count: 2 }, ...] -> ['day', 'day', ...]
export const expandPattern = (pattern) =>
  pattern.flatMap(({ typeId, count }) => Array(Math.max(0, Math.floor(Number(count) || 0))).fill(typeId));

// Shift type id worked on `date`, given the cycle starts on `start`. Works for dates before `start` too.
export const shiftOn = (date, start, sequence) =>
  sequence.length > 0 ? sequence[mod(daysBetween(start, date), sequence.length)] : null;

// Six full weeks (Sunday first) covering the month, padded with days from the neighbouring months
export const buildMonth = (year, month, start, sequence) => {
  const firstWeekday = new Date(year, month, 1).getDay();
  const weeks = [];
  for (let week = 0; week < 6; week++) {
    const days = [];
    for (let weekday = 0; weekday < 7; weekday++) {
      const date = new Date(year, month, 1 - firstWeekday + week * 7 + weekday);
      days.push({ date, inMonth: date.getMonth() === month, typeId: shiftOn(date, start, sequence) });
    }
    weeks.push(days);
  }
  return { name: new Date(year, month, 1).toLocaleString('default', { month: 'long' }), weeks };
};

export const buildYear = (year, start, sequence) =>
  Array.from({ length: 12 }, (_, month) => buildMonth(year, month, start, sequence));

const formatIcsDate = (date) => `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;

const formatIcsTimestamp = (date) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T` +
  `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;

const escapeIcsText = (text) =>
  text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// iCalendar file with an all-day event for every working day in `year`
export const buildIcs = ({ year, start, sequence, shiftTypes, now = new Date() }) => {
  const typesById = new Map(shiftTypes.map((type) => [type.id, type]));
  const stamp = formatIcsTimestamp(now);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//shift-schedule//EN',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:Shift Schedule ${year}`,
  ];

  for (let date = new Date(year, 0, 1); date.getFullYear() === year; ) {
    const next = new Date(year, date.getMonth(), date.getDate() + 1);
    const type = typesById.get(shiftOn(date, start, sequence));
    if (type && !type.isOff) {
      lines.push(
        'BEGIN:VEVENT',
        `UID:${formatIcsDate(date)}-${type.id}@shift-schedule`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${formatIcsDate(date)}`,
        `DTEND;VALUE=DATE:${formatIcsDate(next)}`,
        `SUMMARY:${escapeIcsText(type.label)}`,
        'END:VEVENT'
      );
    }
    date = next;
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
};
