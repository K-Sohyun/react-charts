type AxisYProps = {
  ticks: number[];
  scale: (v: number) => number;
  innerWidth: number;
};

export default function AxisY({ ticks, scale, innerWidth }: AxisYProps) {
  return (
    <>
      {ticks.map((t, i) => {
        const y = scale(t);
        return (
          <g key={`${t}-${i}`}>
            <line
              x1={0}
              y1={y}
              x2={innerWidth}
              y2={y}
              stroke="#d7d7d7"
              strokeDasharray="4 4"
            />
            <text
              x={-8}
              y={y}
              fontSize={12}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#777"
            >
              {t}
            </text>
          </g>
        );
      })}
    </>
  );
}
