type AxisBandProps = {
  labels: string[]; // 축에 표시할 카테고리 라벨 배열
  getPos: (lab: string) => number; // 라벨 밴드의 시작 좌표 반환 (bottom: x, left: y)
  bandWidth: number; // 각 밴드의 픽셀 너비 (center = getPos(lab) + bandWidth/2 로 계산)
  side: "bottom" | "left"; // 축 위치 ("bottom": X축 라벨, "left": Y축 라벨)
  rotate?: boolean; // bottom일 때만 의미, true면 회전
  fontSize?: number; // 라벨 폰트 크기
  tickPadding?: number; // bottom일 때 라벨의 세로 오프셋
};

export default function AxisBand({
  labels,
  getPos,
  bandWidth,
  side,
  rotate = false,
  fontSize = 12,
  tickPadding = 20,
}: AxisBandProps) {
  const isBottom = side === "bottom";

  return (
    <>
      {labels.map((lab) => {
        const center = getPos(lab) + bandWidth / 2;

        return isBottom ? (
          <text
            key={`xlab-${lab}`}
            x={center}
            y={tickPadding}
            fontSize={fontSize}
            fill="#777"
            textAnchor={rotate ? "end" : "middle"}
            dominantBaseline="hanging"
            transform={
              rotate ? `rotate(-40, ${center}, ${tickPadding})` : undefined
            }
          >
            {lab}
          </text>
        ) : (
          <text
            key={`ylab-${lab}`}
            x={-20}
            y={center}
            fontSize={fontSize}
            fill="#777"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {lab}
          </text>
        );
      })}
    </>
  );
}
