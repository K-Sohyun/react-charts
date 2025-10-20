/**
 * linearScale
 * 데이터 값(dMin~dMax)을 화면 좌표(rMin~rMax)로 선형 변환
 * 
 * - dMin/dMax : 데이터 도메인 범위
 * - rMin/rMax : 픽셀 좌표 범위
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
 * 
 * - labels : 카테고리 라벨 배열 (예: ["1월", "2월", "3월"])
 * - rMin/rMax : 픽셀 좌표 범위 (예: 0 → innerWidth)
 * - gapRatio : 막대차트는 0~1(간격 비율), 라인차트는 위치 조절 자유 값
 */
export const bandScale = (
  labels: string[],
  rMin: number,
  rMax: number,
  gapRatio = 0.2
) => {
  const n = Math.max(labels.length, 1);
  const total = rMax - rMin;

  const totalGap = total * gapRatio;
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
