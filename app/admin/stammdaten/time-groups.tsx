"use client";

import { useMemo, useState } from "react";

const days = [
  ["montag", "Montag"], ["dienstag", "Dienstag"], ["mittwoch", "Mittwoch"],
  ["donnerstag", "Donnerstag"], ["freitag", "Freitag"], ["samstag", "Samstag"], ["sonntag", "Sonntag"],
] as const;

type Day = (typeof days)[number][0];
export type TimeGroup = { tage: Day[]; von: string | null; bis: string | null; nachVereinbarung: boolean; termineNachVereinbarung: boolean; reihenfolge: number };

const input = "mt-1 min-h-11 w-full rounded-xl border border-mist-line bg-ice px-3 text-sm text-ink";

function emptyGroup(reihenfolge: number): TimeGroup {
  return { tage: [], von: null, bis: null, nachVereinbarung: false, termineNachVereinbarung: false, reihenfolge };
}

export function TimeGroups({ initialGroups }: { initialGroups: TimeGroup[] }) {
  const [groups, setGroups] = useState(initialGroups);
  const assignedDays = useMemo(() => new Set(groups.flatMap((group) => group.tage)), [groups]);
  const update = (index: number, change: Partial<TimeGroup>) => setGroups((current) => current.map((group, position) => position === index ? { ...group, ...change } : group));
  const move = (index: number, direction: -1 | 1) => setGroups((current) => {
    const target = index + direction;
    if (target < 0 || target >= current.length) return current;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    return next.map((group, position) => ({ ...group, reihenfolge: position }));
  });

  return <section className="rounded-2xl border border-mist-line bg-ice p-5 shadow-sm sm:p-7">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-semibold">Bürozeiten</h2><p className="mt-1 max-w-2xl text-sm text-ink/70">Fasse Wochentage mit derselben Regel in einer Zeitgruppe zusammen. Nicht zugeordnete Tage gelten als geschlossen.</p></div><button className="min-h-11 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-ice" onClick={() => setGroups((current) => [...current, emptyGroup(current.length)])} type="button">Zeitgruppe hinzufügen</button></div>
    <input name="zeitgruppen" type="hidden" value={JSON.stringify(groups.map((group, index) => ({ ...group, reihenfolge: index })))} />
    <div className="mt-5 space-y-4">{groups.map((group, index) => <article className="rounded-xl border border-mist-line bg-mist p-4 sm:p-5" key={`${group.reihenfolge}-${index}`}><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">Zeitgruppe {index + 1}</h3><div className="flex items-center gap-1 text-sm font-semibold text-brand"><button aria-label={`Zeitgruppe ${index + 1} nach oben`} className="min-h-10 px-2 disabled:text-ink/30" disabled={index === 0} onClick={() => move(index, -1)} type="button">↑</button><button aria-label={`Zeitgruppe ${index + 1} nach unten`} className="min-h-10 px-2 disabled:text-ink/30" disabled={index === groups.length - 1} onClick={() => move(index, 1)} type="button">↓</button><button className="min-h-10 px-2 text-red" onClick={() => setGroups((current) => current.filter((_, position) => position !== index).map((item, position) => ({ ...item, reihenfolge: position })))} type="button">Löschen</button></div></div><fieldset className="mt-4"><legend className="text-sm font-semibold">Wochentage</legend><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{days.map(([day, label]) => { const selected = group.tage.includes(day); const unavailable = !selected && assignedDays.has(day); return <label className={`flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm ${unavailable ? "text-ink/40" : "bg-ice"}`} key={day}><input checked={selected} disabled={unavailable} onChange={() => update(index, { tage: selected ? group.tage.filter((item) => item !== day) : [...group.tage, day] })} type="checkbox" />{label}</label>; })}</div></fieldset><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="text-sm font-semibold">Von<input className={input} onChange={(event) => update(index, { von: event.target.value || null })} type="time" value={group.von ?? ""} /></label><label className="text-sm font-semibold">Bis<input className={input} onChange={(event) => update(index, { bis: event.target.value || null })} type="time" value={group.bis ?? ""} /></label><label className="flex min-h-11 items-center gap-2 self-end text-sm"><input checked={group.nachVereinbarung} onChange={(event) => update(index, { nachVereinbarung: event.target.checked })} type="checkbox" />Nach Vereinbarung</label><label className="flex min-h-11 items-center gap-2 self-end text-sm"><input checked={group.termineNachVereinbarung} onChange={(event) => update(index, { termineNachVereinbarung: event.target.checked })} type="checkbox" />Termine nach Vereinbarung</label></div></article>)}</div>
    {groups.length === 0 ? <p className="mt-5 rounded-xl bg-mist p-4 text-sm text-ink/70">Es sind keine Zeitgruppen angelegt. Alle Wochentage gelten als geschlossen.</p> : null}
  </section>;
}
