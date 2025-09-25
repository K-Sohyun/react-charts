type AxisBandProps = {
  labels: string[];
  getPos: (lab: string) => number;
  bandWidth: number;
  side: "bottom" | "left";
  rotate?: boolean; // bottom일 때만 의미
  fontSize?: number;
  tickPadding?: number; // bottom일 때 라벨 y 오프셋(px)
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
