/**
 * linearScale
 * 데이터 값(dMin~dMax)을 화면 좌표(rMin~rMax)로 선형 변환
 * (예: y축 값 → 픽셀 위치)
 *
 * @param dMin  데이터 최소값
 * @param dMax  데이터 최대값
 * @param rMin  출력 범위 시작 (좌표 최소값)
 * @param rMax  출력 범위 끝 (좌표 최대값)
 * @returns     입력 값(v)을 좌표로 변환하는 함수
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
 * 카테고리 라벨 배열을 일정 간격의 밴드(막대) 좌표로 변환
 * (예: x축 카테고리 위치 + 막대 너비)
 *
 * @param labels   카테고리 라벨 배열
 * @param rMin     출력 범위 시작 (x축 시작 좌표)
 * @param rMax     출력 범위 끝 (x축 끝 좌표)
 * @param padding  밴드 사이 여백 비율 (0~1, 기본 0.1)
 * @returns        x(라벨→좌표), bandWidth(밴드 너비)
 */
export const bandScale = (
  labels: string[],
  rMin: number,
  rMax: number,
  padding = 0.1
) => {
  const n = Math.max(labels.length, 1); // 라벨 개수
  const total = rMax - rMin; // 전체 범위
  const step = total / (n + padding * (n + 1)); // 밴드+여백 간격
  const band = step * (1 - padding); // 막대 너비
  const offset = rMin + step * padding; // 첫 막대 시작 위치
  const map = new Map(labels.map((lab, i) => [lab, offset + i * step]));
  return { getX: (lab: string) => map.get(lab) ?? 0, bandWidth: band }; // 객체 반환
};
