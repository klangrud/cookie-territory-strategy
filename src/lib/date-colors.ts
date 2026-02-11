export const DATE_COLORS = {
  past: { color: "#d1d5db", label: "Past" },
  thisWeekend: { color: "#16a34a", label: "This Weekend" },
  nextWeekend: { color: "#2563eb", label: "Next Weekend" },
  future: { color: "#9ca3af", label: "2+ Weeks Out" },
} as const;

export type DateCategory = keyof typeof DATE_COLORS;

export function getDateCategory(dateStr: string): DateCategory {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  if (date < today) return "past";

  // Find upcoming Saturday
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7; // if Saturday, next Saturday
  const thisSaturday = new Date(today);
  thisSaturday.setDate(today.getDate() + (dayOfWeek === 6 ? 0 : daysUntilSaturday));

  const thisSunday = new Date(thisSaturday);
  thisSunday.setDate(thisSaturday.getDate() + 1);

  const nextSaturday = new Date(thisSaturday);
  nextSaturday.setDate(thisSaturday.getDate() + 7);

  const nextSunday = new Date(nextSaturday);
  nextSunday.setDate(nextSaturday.getDate() + 1);

  const dateTime = date.getTime();

  if (dateTime === thisSaturday.getTime() || dateTime === thisSunday.getTime()) {
    return "thisWeekend";
  }

  if (dateTime === nextSaturday.getTime() || dateTime === nextSunday.getTime()) {
    return "nextWeekend";
  }

  return "future";
}

export function getDateColor(dateStr: string): string {
  return DATE_COLORS[getDateCategory(dateStr)].color;
}
