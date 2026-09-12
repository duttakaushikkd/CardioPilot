const monthIndex: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11
};

export function parseReportDate(value: string) {
  const native = new Date(value);
  if (!Number.isNaN(native.getTime())) return native;

  const normalized = value.trim().replace(/,/g, " ").replace(/\s+/g, " ");
  const match = normalized.match(/^(\d{1,2})[/-]([A-Za-z]{3,9})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2})\s*([AP]M)?)?/i);
  if (!match) throw new Error(`Could not parse report date "${value}". Please use YYYY-MM-DD or DD/MMM/YYYY.`);

  const [, dayRaw, monthRaw, yearRaw, hourRaw = "0", minuteRaw = "0", meridiemRaw] = match;
  const month = monthIndex[monthRaw.toLowerCase()];
  if (month === undefined) throw new Error(`Could not parse report month "${monthRaw}".`);

  let hour = Number(hourRaw);
  const meridiem = meridiemRaw?.toUpperCase();
  if (meridiem === "PM" && hour < 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  const parsed = new Date(Number(yearRaw), month, Number(dayRaw), hour, Number(minuteRaw));
  if (Number.isNaN(parsed.getTime())) throw new Error(`Could not parse report date "${value}".`);
  return parsed;
}
