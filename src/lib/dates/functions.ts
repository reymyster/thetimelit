import { match } from "ts-pattern";

export function addToDate({
  date,
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}: {
  date: Date;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}) {
  return new Date(
    date.getFullYear() + years,
    date.getMonth() + months,
    date.getDate() + days,
    date.getHours() + hours,
    date.getMinutes() + minutes,
    date.getSeconds() + seconds,
    date.getMilliseconds() + milliseconds,
  );
}

export type TemporalPeriod = "year" | "month" | "day" | "hour" | "minute";

export function timeUntilNext(period: TemporalPeriod) {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = now.getMonth();
  const DD = now.getDate();
  const HH = now.getHours();
  const mm = now.getMinutes();

  const next = match(period)
    .returnType<Date>()
    .with("year", () => new Date(YYYY + 1, 0, 1, 0, 0, 0, 0))
    .with("month", () => new Date(YYYY, MM + 1, 1, 0, 0, 0, 0))
    .with("day", () => new Date(YYYY, MM, DD + 1, 0, 0, 0, 0))
    .with("hour", () => new Date(YYYY, MM, DD, HH + 1, 0, 0, 0))
    .with("minute", () => new Date(YYYY, MM, DD, HH, mm + 1, 0, 0))
    .exhaustive();

  return next.valueOf() - now.valueOf();
}
