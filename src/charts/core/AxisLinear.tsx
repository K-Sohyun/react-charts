type AxisLinearProps = {
  ticks: number[]; // 축에 표시할 눈금 값 배열
  scale: (v: number) => number; // 값을 SVG 좌표로 변환하는 함수 (linearScale)
  length: number; // 눈금선 길이 (left면 innerWidth, bottom이면 innerHeight)
  side: "left" | "bottom"; // 축의 방향 결정
  grid?: boolean; // 눈금선(그리드 라인) 표시 여부
  formatTick?: (v: number) => string | number; // 눈금 라벨 포맷 함수
  gridDash?: string; // 눈금선 점선 패턴 (예: "4 4")
  fontSize?: number; // 눈금 라벨 폰트 크기
  tickPadding?: number; // 눈금 라벨과 축 사이의 여백
};

export default function AxisLinear({
  ticks,
  scale,
  length,
  side,
  formatTick,
  grid = true,
  gridDash = "4 4",
  fontSize = 12,
  tickPadding = 8,
}: AxisLinearProps) {
  const isLeft = side === "left";

  return (
    <>
      {ticks.map((t, i) => {
        const pos = scale(t);

        return isLeft ? (
          <g key={`${t}-${i}`}>
            {grid && (
              <line
                x1={0}
                y1={pos}
                x2={length}
                y2={pos}
                stroke="#d7d7d7"
                strokeDasharray={gridDash}
                shapeRendering="crispEdges"
              />
            )}
            <text
              x={-tickPadding}
              y={pos}
              fontSize={fontSize}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#777"
            >
              {formatTick ? formatTick(t) : t}
            </text>
          </g>
        ) : (
          <g key={`${t}-${i}`}>
            {grid && (
              <line
                x1={pos}
                y1={0}
                x2={pos}
                y2={length}
                stroke="#d7d7d7"
                strokeDasharray={gridDash}
                shapeRendering="crispEdges"
              />
            )}
            <text
              x={pos}
              y={length + 14}
              fontSize={fontSize}
              textAnchor="middle"
              dominantBaseline="hanging"
              fill="#777"
            >
              {formatTick ? formatTick(t) : t}
            </text>
          </g>
        );
      })}
    </>
  );
}
