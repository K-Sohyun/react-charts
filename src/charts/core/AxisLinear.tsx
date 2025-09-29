type AxisLinearProps = {
  ticks: number[]; // 축에 표시할 눈금선 리스트
  scale: (v: number) => number; // 값을 픽셀좌표로 바꾸는 함수 (linearScale)
  length: number; // 그리드 라인의 길이 (left면 innerWidth, bottom이면 innerHeight)
  side: "left" | "bottom"; // 축의 방향 결정
  grid?: boolean; // 그리드 라인 표시 여부
  gridDash?: string; // 점선 패턴 "4 4" 같은 것
  fontSize?: number; // 라벨 폰트 크기
  tickPadding?: number; // 라벨과 축 사이 여백
};

export default function AxisLinear({
  ticks,
  scale,
  length,
  side,
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
            ></text>
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
            ></text>
          </g>
        );
      })}
    </>
  );
}
