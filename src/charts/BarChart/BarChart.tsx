import { useRef, useState, useEffect } from "react";
import ChartWrapper from "../core/ChartWrapper";
import { linearScale, bandScale } from "../core/scales";
import { makeTicks } from "../core/ticks";
import type { YTicks } from "../core/ticks";
import AxisY from "../core/AxisY";
import AxisX from "../core/AxisX";
import styles from "./BarChart.module.scss";

export type BarDatum = { label: string; value: number };

type BarChartProps = {
  data: BarDatum[];
  height?: number;
  barColor?: string;
  rotateLabels?: boolean;
  xPadding?: number;
  y?: {
    min?: number;
    max?: number;
    ticks?: YTicks;
  };
  padding?: Partial<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;
};

type TooltipState = {
  show: boolean;
  left: number;
  top: number;
  label: string;
  value: number;
};

export default function BarChart({
  data,
  height = 360,
  barColor = "#60a5fa",
  rotateLabels = false,
  xPadding = 0.2,
  y,
  padding,
}: BarChartProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // 애니메이션 발동
  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);

  const dataMax = Math.max(...values, 0);
  const yMin = y?.min ?? 0;
  const yMax = y?.max ?? dataMax;

  const ticks = makeTicks(yMin, yMax, y?.ticks);

  // 툴팁 업데이트 단일 함수
  const updateTooltip = (
    e: React.MouseEvent<SVGRectElement, MouseEvent> | null,
    payload?: { label: string; value: number }
  ) => {
    if (!e || !payload) {
      setTooltip(null);
      return;
    }
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      show: true,
      left: e.clientX - rect.left,
      top: e.clientY - rect.top - 8,
      label: payload.label,
      value: payload.value,
    });
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <ChartWrapper height={height} padding={padding}>
        {({ innerWidth, innerHeight }) => {
          const xBand = bandScale(labels, 0, innerWidth, xPadding);
          const yScale = linearScale(yMin, yMax, innerHeight, 0);

          return (
            <>
              <AxisY ticks={ticks} scale={yScale} innerWidth={innerWidth} />
              <AxisX
                labels={labels}
                getX={xBand.getX}
                bandWidth={xBand.bandWidth}
                innerHeight={innerHeight}
                rotate={rotateLabels}
              />

              {data.map((d, i) => {
                const x = xBand.getX(d.label);
                const bw = xBand.bandWidth;
                const yPos = yScale(d.value);
                const h = innerHeight - yPos;

                return (
                  <rect
                    key={d.label}
                    x={x}
                    y={yPos}
                    width={bw}
                    height={h}
                    fill={barColor}
                    rx={6}
                    onMouseEnter={(e) => updateTooltip(e, d)}
                    onMouseMove={(e) => updateTooltip(e, d)}
                    onMouseLeave={() => updateTooltip(null)}
                    className={`${styles.bar} ${
                      isAnimated ? styles.barAnimated : ""
                    }`}
                    style={{ transitionDelay: `${i * 40}ms` }}
                  />
                );
              })}
            </>
          );
        }}
      </ChartWrapper>

      {/* HTML 툴팁 */}
      {tooltip?.show && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          <strong>{tooltip.label}</strong> · {tooltip.value}
        </div>
      )}
    </div>
  );
}
