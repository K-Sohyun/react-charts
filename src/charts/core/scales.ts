/**
 * linearScale
 * 데이터 값(dMin~dMax)을 화면 좌표(rMin~rMax)로 선형 변환
 */
export const linearScale = (
  dMin: number,
  dMax: number,
  rMin: number,
  rMax: number
) => {
  const d = dMax - dMin || 1; // 데이터 범위 (0 방지)
  const r = rMax - rMin; // 출력 범위
  return (v: number) => rMin + ((v - dMin) / d) * r;
};

/**
 * bandScale
 * 카테고리 라벨 배열을 일정 간격의 밴드 좌표로 변환
 */
export const bandScale = (
  labels: string[],
  rMin: number,
  rMax: number,
  padding = 0.2 // 기본값 props에서 주입 가능
) => {
  const n = Math.max(labels.length, 1);
  const total = rMax - rMin;

  const totalGap = total * padding;
  const gapWidth = totalGap / (n + 1);
  const barWidth = (total - totalGap) / n;

  const offset = rMin + gapWidth;
  const map = new Map(
    labels.map((lab, i) => [lab, offset + i * (barWidth + gapWidth)])
  );

  return {
    getX: (lab: string) => map.get(lab) ?? 0,
    bandWidth: barWidth,
    gapWidth,
  };
};
