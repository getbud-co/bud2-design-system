/** Timezone-free date representation */
export interface CalendarDate { year: number; month: number; day: number; }

export const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const MONTH_LABELS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function daysInMonth(year: number, month: number): number { return new Date(year, month, 0).getDate(); }
export function firstDayOfWeek(year: number, month: number): number { return new Date(year, month - 1, 1).getDay(); }
export function prevMonth(d: CalendarDate): CalendarDate { return d.month === 1 ? { year: d.year - 1, month: 12, day: 1 } : { year: d.year, month: d.month - 1, day: 1 }; }
export function nextMonth(d: CalendarDate): CalendarDate { return d.month === 12 ? { year: d.year + 1, month: 1, day: 1 } : { year: d.year, month: d.month + 1, day: 1 }; }
export function isSameDay(a: CalendarDate, b: CalendarDate): boolean { return a.year === b.year && a.month === b.month && a.day === b.day; }
export function today(): CalendarDate { const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate() }; }
export function isToday(d: CalendarDate): boolean { return isSameDay(d, today()); }
export function compareDates(a: CalendarDate, b: CalendarDate): number {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}
export function isDisabled(d: CalendarDate, minDate?: CalendarDate, maxDate?: CalendarDate): boolean {
  if (minDate && compareDates(d, minDate) < 0) return true;
  if (maxDate && compareDates(d, maxDate) > 0) return true;
  return false;
}
function pad2(n: number): string { return n < 10 ? `0${n}` : `${n}`; }
export function formatDate(d: CalendarDate): string { return `${pad2(d.day)}/${pad2(d.month)}/${d.year}`; }
export function parseDate(str: string): CalendarDate | null {
  const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const day = parseInt(m[1], 10), month = parseInt(m[2], 10), year = parseInt(m[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month) || year < 1900 || year > 2100) return null;
  return { year, month, day };
}
