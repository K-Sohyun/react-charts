type AxisXProps = {
  labels: string[];
  getX: (lab: string) => number;
  bandWidth: number;
  innerHeight: number;
  rotate?: boolean;
};

export default function AxisX({
  labels,
  getX,
  bandWidth,
  innerHeight,
  rotate,
}: AxisXProps) {
  return (
    <>
      {labels.map((lab) => {
        const cx = getX(lab) + bandWidth / 2;
        return (
          <text
            key={`xlab-${lab}`}
            x={cx}
            y={innerHeight + 20}
            fontSize={12}
            fill="#777"
            textAnchor={rotate ? "end" : "middle"}
            dominantBaseline="hanging"
            transform={rotate ? `rotate(-40, ${cx}, ${innerHeight + 20})` : ""}
          >
            {lab}
          </text>
        );
      })}
    </>
  );
}
