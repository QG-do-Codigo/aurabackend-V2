const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function getWeekDays(referenceDate: Date = new Date()): Date[] {
  const base = startOfDay(referenceDate);
  const day = base.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = (day + 6) % 7; // Monday => 0, Sunday => 6
  const monday = new Date(base);
  monday.setDate(base.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  for (let i = 0; i < 7; i += 1) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    current.setHours(0, 0, 0, 0);
    days.push(current);
  }

  return days;
}

export function differenceInCalendarDays(later: Date, earlier: Date): number {
  const utcLater = Date.UTC(
    later.getFullYear(),
    later.getMonth(),
    later.getDate(),
  );
  const utcEarlier = Date.UTC(
    earlier.getFullYear(),
    earlier.getMonth(),
    earlier.getDate(),
  );
  return Math.floor((utcLater - utcEarlier) / MS_PER_DAY);
}

