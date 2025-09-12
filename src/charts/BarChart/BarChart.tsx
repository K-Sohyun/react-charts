import ChartWrapper from "../core/ChartWrapper";
import { linearScale, bandScale } from "../core/scales";
import styles from "./BarChart.module.scss";

export type BarDatum = { label: string; value: number };
type BarChartProps = { data: BarDatum[]; height?: number; barColor?: string };

export default function BarChart({
  data,
  height = 360,
  barColor = "#60a5fa",
}: BarChartProps) {
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 0);

  return (
    <div className={styles.wrapper}>
      <ChartWrapper height={height}>
        {({ innerWidth, innerHeight }) => {
          const xBand = bandScale(labels, 0, innerWidth, 0.2);
          const yScale = linearScale(0, max, innerHeight, 0);
          const ticks = [0, Math.round(max * 0.5), max];

          return (
            <>
              {/* 그리드 & Y축 라벨 */}
              {ticks.map((t, i) => {
                const y = yScale(t);
                return (
                  <g key={`${t}-${i}`}>
                    <line
                      x1={0}
                      y1={y}
                      x2={innerWidth}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={-8}
                      y={y}
                      fontSize={12}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fill="#6b7280"
                    >
                      {t}
                    </text>
                  </g>
                );
              })}
              {/* 막대 */}
              {data.map((d) => {
                const x = xBand.getX(d.label);
                const bw = xBand.bandWidth;
                const h = innerHeight - yScale(d.value);
                const y = yScale(d.value);
                return (
                  <rect
                    key={d.label}
                    x={x}
                    y={y}
                    width={bw}
                    height={h}
                    fill={barColor}
                    rx={6}
                  />
                );
              })}
            </>
          );
        }}
      </ChartWrapper>
    </div>
  );
}
