type AxisLinearProps = {
  ticks: number[];
  scale: (v: number) => number;
  length: number; // side="left"면 innerWidth, side="bottom"이면 innerHeight
  side: "left" | "bottom"; // "left": 왼쪽 값 축(Y), "bottom": 아래 값 축(X)
  formatTick?: (v: number) => string | number;
  grid?: boolean;
  gridDash?: string;
  fontSize?: number;
  tickPadding?: number;
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
