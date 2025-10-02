export const DEFAULT_PALETTE = [
  "#73A7D9",
  "#FFC84C",
  "#95D1A9",
  "#C49BCF",
  "#FF9B66",
  "#AEC1E5",
];

export function createColorScale(
  order: string[],
  overrides?: Record<string, string>,
  palette: string[] = DEFAULT_PALETTE
) {
  const map = new Map<string, string>();
  if (overrides)
    for (const k of Object.keys(overrides)) map.set(k, overrides[k]);
  order.forEach((k, i) => {
    if (!map.has(k)) map.set(k, palette[i % palette.length]);
  });
  return (key: string) => map.get(key) ?? palette[0];
}
