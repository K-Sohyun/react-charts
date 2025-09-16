import ChartWrapper from "../core/ChartWrapper";
import { linearScale, bandScale } from "../core/scales";
import styles from "./BarChart.module.scss";

export type BarDatum = { label: string; value: number };

type BarChartProps = {
  data: BarDatum[];
  height?: number;
  barColor?: string;
  rotateLabels?: boolean;
  yDomain?: { min?: number; max: number };
  padding?: Partial<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;
};

export default function BarChart({
  data,
  height = 360,
  barColor = "#60a5fa",
  rotateLabels = false,
  yDomain,
  padding,
}: BarChartProps) {
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);

  // 데이터 기반 기본값
  const dataMax = Math.max(...values, 0);
  const yMin = yDomain?.min ?? 0;
  const yMax = yDomain?.max ?? dataMax;

  return (
    <div className={styles.wrapper}>
      <ChartWrapper height={height} padding={padding}>
        {({ innerWidth, innerHeight }) => {
          const xBand = bandScale(labels, 0, innerWidth, 0.4);
          const yScale = linearScale(yMin, yMax, innerHeight, 0);
          const ticks = [yMin, Math.round((yMin + yMax) / 2), yMax];

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

              {/* X축 라벨 */}
              {labels.map((lab) => {
                const x = xBand.getX(lab);
                const bw = xBand.bandWidth;
                const cx = x + bw / 2; // 막대 중앙
                return (
                  <text
                    key={`xlab-${lab}`}
                    x={cx}
                    y={innerHeight + 20}
                    fontSize={12}
                    fill="#6b7280"
                    textAnchor={rotateLabels ? "end" : "middle"}
                    dominantBaseline="hanging"
                    transform={
                      rotateLabels
                        ? `rotate(-40, ${cx}, ${innerHeight + 10})`
                        : ""
                    }
                  >
                    {lab}
                  </text>
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
