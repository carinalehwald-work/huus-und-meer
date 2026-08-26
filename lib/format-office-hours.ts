const dayLabels: Record<string, string> = {
  montag: "Mo",
  dienstag: "Di",
  mittwoch: "Mi",
  donnerstag: "Do",
  freitag: "Fr",
  samstag: "Sa",
  sonntag: "So",
};

const orderedDays = Object.keys(dayLabels);

function formatDayRanges(days: string[]): string[] {
  if (!days.length) return [];
  const ranges: string[] = [];
  let rangeStart = days[0];
  let previous = days[0];

  for (const day of days.slice(1)) {
    if (orderedDays.indexOf(day) === orderedDays.indexOf(previous) + 1) {
      previous = day;
      continue;
    }
    ranges.push(rangeStart === previous ? dayLabels[rangeStart] : `${dayLabels[rangeStart]} – ${dayLabels[previous]}`);
    rangeStart = day;
    previous = day;
  }

  ranges.push(rangeStart === previous ? dayLabels[rangeStart] : `${dayLabels[rangeStart]} – ${dayLabels[previous]}`);
  return ranges;
}

export function formatOfficeHours(value: unknown): string | null {
  if (!Array.isArray(value)) return null;

  const entries = value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const group = item as Record<string, unknown>;
    const days = Array.isArray(group.tage)
      ? group.tage.filter((day): day is string => typeof day === "string" && day in dayLabels).sort((a, b) => orderedDays.indexOf(a) - orderedDays.indexOf(b))
      : [];
    if (!days.length) return [];

    const rule = [
      typeof group.von === "string" && typeof group.bis === "string" ? `von ${group.von}–${group.bis} Uhr` : null,
      group.nachVereinbarung === true ? "Nach Vereinbarung" : null,
      group.termineNachVereinbarung === true ? "Termine nach Vereinbarung" : null,
    ].filter((entry): entry is string => Boolean(entry)).join(" · ");

    return rule ? formatDayRanges(days).map((range) => `${range} ${rule}`) : [];
  });

  return entries.length ? entries.join(" · ") : null;
}
