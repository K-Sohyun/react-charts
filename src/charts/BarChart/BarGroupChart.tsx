import { useEffect, useRef, useState } from "react";
import ChartWrapper from "../core/ChartWrapper";
import AxisLinear from "../core/AxisLinear";
import AxisBand from "../core/AxisBand";
import Legend from "../core/Legend";
import { linearScale, bandScale } from "../core/scales";
import { makeTicks, type YTicks } from "../core/ticks";
import { createColorScale } from "../core/colorScale";
import type { Padding } from "../core/types";
import styles from "./BarChart.module.scss";

export type GroupBarDatum = {
  label: string;
  values: Record<string, number>;
};

type Orientation = "vertical" | "horizontal";

type ValueAxisOpts = {
  min?: number;
  max?: number;
  ticks?: YTicks;
  formatTick?: (v: number) => string | number;
};

type LegendOpts = {
  show?: boolean;
  position?: "top" | "right";
};

type BarGroupChartProps = {
  data: GroupBarDatum[];
  orientation?: Orientation;
  height?: number;
  seriesOrder?: string[];
  colors?: Record<string, string>;
  categoryGap?: number; // 카테고리(라벨) 간격
  seriesGap?: number; // 시리즈 간격
  valueAxis?: ValueAxisOpts; // 값축
  framePadding?: Partial<Padding>;
  seriesLabels?: Record<string, string>;
  legend?: LegendOpts; // 내부 Legend on/off & 위치
};

type TooltipState = {
  show: boolean;
  left: number;
  top: number;
  label: string; // 카테고리 라벨
  series: string; // 데이터 키
  value: number;
};

export default function BarGroupChart({
  data,
  orientation = "vertical",
  height = 360,
  seriesOrder,
  colors,
  categoryGap = 0.2,
  seriesGap = 0.2,
  valueAxis,
  framePadding,
  seriesLabels,
  legend = { show: true, position: "top" },
}: BarGroupChartProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const updateTooltip = (
    e: React.MouseEvent<SVGRectElement, MouseEvent> | null,
    payload?: { label: string; series: string; value: number }
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

  const displayOf = (key: string) => seriesLabels?.[key] ?? key;

  const isVertical = orientation === "vertical";

  const inferredKeys =
    seriesOrder ??
    Array.from(new Set(data.flatMap((d) => Object.keys(d.values))));

  const labels = data.map((d) => d.label);

  const allValues = data.flatMap((d) =>
    inferredKeys.map((k) => d.values[k] ?? 0)
  );
  const dataMax = allValues.length ? Math.max(...allValues, 0) : 0;

  const vMin = valueAxis?.min ?? 0;
  const vMaxRaw = valueAxis?.max ?? dataMax;
  const vMax = vMaxRaw === vMin ? vMin + 1 : vMaxRaw;

  const ticks = makeTicks(vMin, vMax, valueAxis?.ticks);

  // 차트/범례가 같은 color scale 사용
  const colorOf = createColorScale(inferredKeys, colors);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${isVertical ? styles.vert : styles.hori}`}
    >
      {/* 내부 Legend 렌더 (옵션) */}
      {legend?.show && (
        <Legend
          seriesOrder={inferredKeys}
          seriesLabels={
            seriesLabels ?? Object.fromEntries(inferredKeys.map((k) => [k, k]))
          }
          getColor={colorOf}
          position={legend.position ?? "top"}
        />
      )}

      <ChartWrapper height={height} framePadding={framePadding}>
        {({ innerWidth, innerHeight }) => {
          // 바깥/안쪽 밴드
          const outer = isVertical
            ? bandScale(labels, 0, innerWidth, categoryGap) // X 밴드
            : bandScale(labels, 0, innerHeight, categoryGap); // Y 밴드
          const inner = bandScale(inferredKeys, 0, outer.bandWidth, seriesGap);

          // 값 축
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
                    getPos={outer.getX}
                    bandWidth={outer.bandWidth}
                    side="bottom"
                    tickPadding={20}
                  />
                </g>
              ) : (
                <AxisBand
                  labels={labels}
                  getPos={outer.getX}
                  bandWidth={outer.bandWidth}
                  side="left"
                />
              )}

              {/* 3) 그룹 막대 */}
              {data.map((d, gi) => {
                const base = outer.getX(d.label);
                return inferredKeys.map((key, si) => {
                  const val = Math.max(0, d.values[key] ?? 0); // 음수면 0으로

                  if (isVertical) {
                    const x = base + inner.getX(key);
                    const bw = inner.bandWidth;
                    const y1 = valueScale(val);
                    const h = innerHeight - y1;
                    return (
                      <rect
                        key={`${d.label}-${key}`}
                        x={x}
                        y={y1}
                        width={bw}
                        height={h}
                        rx={6}
                        fill={colorOf(key)}
                        className={`${styles.bar} ${
                          isAnimated ? styles.barAnimated : ""
                        }`}
                        style={{
                          transitionDelay: `${
                            (gi * inferredKeys.length + si) * 30
                          }ms`,
                        }}
                        onMouseEnter={(e) =>
                          updateTooltip(e, {
                            label: d.label,
                            series: key,
                            value: val,
                          })
                        }
                        onMouseMove={(e) =>
                          updateTooltip(e, {
                            label: d.label,
                            series: key,
                            value: val,
                          })
                        }
                        onMouseLeave={() => updateTooltip(null)}
                      />
                    );
                  } else {
                    const yPos = base + inner.getX(key);
                    const bh = inner.bandWidth;
                    const x0 = valueScale(0);
                    const x1 = valueScale(val);
                    const x = Math.min(x0, x1);
                    const w = Math.abs(x1 - x0);
                    return (
                      <rect
                        key={`${d.label}-${key}`}
                        x={x}
                        y={yPos}
                        width={w}
                        height={bh}
                        rx={6}
                        fill={colorOf(key)}
                        className={`${styles.bar} ${
                          isAnimated ? styles.barAnimated : ""
                        }`}
                        style={{
                          transitionDelay: `${
                            (gi * inferredKeys.length + si) * 30
                          }ms`,
                        }}
                        onMouseEnter={(e) =>
                          updateTooltip(e, {
                            label: d.label,
                            series: key,
                            value: val,
                          })
                        }
                        onMouseMove={(e) =>
                          updateTooltip(e, {
                            label: d.label,
                            series: key,
                            value: val,
                          })
                        }
                        onMouseLeave={() => updateTooltip(null)}
                      />
                    );
                  }
                });
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
          <strong>{tooltip.label}</strong>
          {" · "}
          {displayOf(tooltip.series)}
          {" : "}
          {tooltip.value}
        </div>
      )}
    </div>
  );
}
