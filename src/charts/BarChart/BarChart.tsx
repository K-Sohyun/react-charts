import { useRef, useState, useEffect } from "react";
import ChartWrapper from "../core/ChartWrapper";
import { linearScale, bandScale } from "../core/scales";
import { makeTicks } from "../core/ticks";
import type { YTicks } from "../core/ticks";
import type { Padding } from "../core/types";
import AxisLinear from "../core/AxisLinear";
import AxisBand from "../core/AxisBand";
import styles from "./BarChart.module.scss";

export type BarDatum = { label: string; value: number };

type Orientation = "vertical" | "horizontal";

type ValueAxisOpts = {
  min?: number;
  max?: number;
  ticks?: YTicks;
  formatTick?: (v: number) => string | number;
};

type BarChartProps = {
  data: BarDatum[];
  orientation?: Orientation;
  height?: number;
  barColor?: string;
  rotateLabels?: boolean; // vertical에서 X 라벨 회전
  categoryGap?: number; // 카테고리(라벨) 간격
  valueAxis?: ValueAxisOpts; // 값축
  framePadding?: Partial<Padding>;
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
  orientation = "vertical",
  height = 360,
  barColor = "#73a7d9",
  rotateLabels = false,
  categoryGap = 0.2,
  valueAxis,
  framePadding,
}: BarChartProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const dataMax = values.length ? Math.max(...values, 0) : 0;

  const isVertical = orientation === "vertical";
  const vMin = valueAxis?.min ?? 0;
  const vMaxRaw = valueAxis?.max ?? dataMax;
  const vMax = vMaxRaw === vMin ? vMin + 1 : vMaxRaw;
  const ticks = makeTicks(vMin, vMax, valueAxis?.ticks);

  const updateTooltip = (
    e: React.MouseEvent<SVGRectElement, MouseEvent> | null,
    payload?: { label: string; value: number }
  ) => {
    if (!e || !payload) return setTooltip(null);
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      show: true,
      left: e.clientX - rect.left,
      top: e.clientY - rect.top - 8,
      ...payload,
    });
  };

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${isVertical ? styles.vert : styles.hori}`}
    >
      <ChartWrapper height={height} framePadding={framePadding}>
        {({ innerWidth, innerHeight }) => {
          const band = isVertical
            ? bandScale(labels, 0, innerWidth, categoryGap) // X 밴드
            : bandScale(labels, 0, innerHeight, categoryGap); // Y 밴드

          const valueScale = isVertical
            ? linearScale(vMin, vMax, innerHeight, 0) // 값→Y
            : linearScale(vMin, vMax, 0, innerWidth); // 값→X

          return (
            <>
              {/* 1) 값 축 */}
              <AxisLinear
                ticks={ticks}
                scale={valueScale}
                length={isVertical ? innerWidth : innerHeight}
                side={isVertical ? "left" : "bottom"}
                grid
                formatTick={valueAxis?.formatTick}
              />

              {/* 2) 범주 축 */}
              {isVertical ? (
                <g transform={`translate(0, ${innerHeight})`}>
                  <AxisBand
                    labels={labels}
                    getPos={band.getX}
                    bandWidth={band.bandWidth}
                    side="bottom"
                    rotate={rotateLabels}
                    tickPadding={20}
                  />
                </g>
              ) : (
                <AxisBand
                  labels={labels}
                  getPos={band.getX}
                  bandWidth={band.bandWidth}
                  side="left"
                />
              )}

              {/* 3) 막대 */}
              {data.map((d, i) => {
                const safeValue = Math.max(0, d.value); // 음수면 0으로

                if (isVertical) {
                  const x = band.getX(d.label);
                  const bw = band.bandWidth;
                  const y1 = valueScale(safeValue);
                  const h = innerHeight - y1;
                  return (
                    <rect
                      key={d.label}
                      x={x}
                      y={y1}
                      width={bw}
                      height={h}
                      rx={6}
                      fill={barColor}
                      className={`${styles.bar} ${
                        isAnimated ? styles.barAnimated : ""
                      }`}
                      style={{ transitionDelay: `${i * 40}ms` }}
                      onMouseEnter={(e) => updateTooltip(e, d)}
                      onMouseMove={(e) => updateTooltip(e, d)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                } else {
                  const yPos = band.getX(d.label);
                  const bh = band.bandWidth;
                  const x0 = valueScale(0);
                  const x1 = valueScale(safeValue);
                  const x = Math.min(x0, x1);
                  const w = Math.abs(x1 - x0);
                  return (
                    <rect
                      key={d.label}
                      x={x}
                      y={yPos}
                      width={w}
                      height={bh}
                      rx={6}
                      fill={barColor}
                      className={`${styles.bar} ${
                        isAnimated ? styles.barAnimated : ""
                      }`}
                      style={{ transitionDelay: `${i * 40}ms` }}
                      onMouseEnter={(e) => updateTooltip(e, d)}
                      onMouseMove={(e) => updateTooltip(e, d)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                }
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
