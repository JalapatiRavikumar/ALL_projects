export function compactNumber(n?: number | null): string {
  if (n === null || n === undefined) return "—";
  if (n < 1000) return String(n);
  const units = ["K", "M", "B"];
  let u = -1;
  let v = n;
  while (v >= 1000 && u < units.length - 1) {
    v /= 1000;
    u++;
  }
  return `${v.toFixed(v < 10 ? 1 : 0)}${units[u]}`;
}

export function formatDuration(seconds?: number | null): string {
  if (!seconds && seconds !== 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatPercent(n?: number | null): string {
  if (n === null || n === undefined) return "—";
  return `${n.toFixed(2)}%`;
}
