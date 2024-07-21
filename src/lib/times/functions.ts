export function getNumberFromTimeString(
  s: string | undefined,
): number | undefined {
  if (!s || s.trim().length === 0) return undefined;

  return parseInt(s.replace(":", ""), 10);
}

export function getTimeStringFromNumber(
  n: number | null | undefined,
): string | undefined {
  if (typeof n !== "number") return undefined;

  const hour = Math.floor(n / 100)
    .toString()
    .padStart(2, "0");
  const minute = (n % 100).toString().padStart(2, "0");

  return `${hour}:${minute}`;
}
