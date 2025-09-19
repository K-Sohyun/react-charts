export type YTicks = number[] | { step: number } | { count: number };

/**
 * makeTicks
 * Y축 눈금 생성 유틸
 */
export function makeTicks(
  yMin: number,
  yMax: number,
  ticks?: YTicks
): number[] {
  if (!ticks) {
    const mid = Math.round((yMin + yMax) / 2);
    return [yMin, mid, yMax];
  }
  if (Array.isArray(ticks)) return ticks;

  if ("step" in ticks) {
    const step = Math.max(1, ticks.step);
    const start = Math.ceil(yMin / step) * step;
    const arr: number[] = [];
    for (let v = start; v <= yMax; v += step) arr.push(v);
    if (arr[0] !== yMin) arr.unshift(yMin);
    if (arr[arr.length - 1] !== yMax) arr.push(yMax);
    return arr;
  }

  if ("count" in ticks) {
    const count = Math.max(1, Math.floor(ticks.count));
    const arr: number[] = [];
    for (let i = 0; i <= count; i++) {
      const t = yMin + ((yMax - yMin) * i) / count;
      arr.push(Math.round(t));
    }
    return arr;
  }

  return [yMin, yMax];
}
