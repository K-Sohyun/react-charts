import { useEffect, useRef, useState } from "react";
import ChartWrapper from "../core/ChartWrapper";
import { linearScale, bandScale } from "../core/scales";
import { makeTicks, type YTicks } from "../core/ticks";
import AxisLinear from "../core/AxisLinear";
import AxisBand from "../core/AxisBand";
import styles from "./BarChart.module.scss";

export type GroupBarDatum = {
  label: string;
  values: Record<string, number>;
};

type Orientation = "vertical" | "horizontal";

type BarGroupChartProps = {
  data: GroupBarDatum[];
  orientation?: Orientation;
  height?: number;
  seriesOrder?: string[];
  colors?: Record<string, string>;
  xPadding?: number; // vertical: 바깥(X) 밴드
  bandPadding?: number; // horizontal: 바깥(Y) 밴드
  innerPadding?: number; // 안쪽(시리즈) 밴드
  y?: { min?: number; max?: number; ticks?: YTicks }; // vertical 값축
  valueAxis?: { min?: number; max?: number; ticks?: YTicks }; // horizontal 값축
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
  series: string;
  value: number;
};

export default function BarGroupChart({
  data,
  orientation = "vertical",
  height = 360,
  seriesOrder,
  colors,
  xPadding = 0.2,
  bandPadding = 0.2,
  innerPadding = 0.2,
  y,
  valueAxis,
  padding,
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

  const isVertical = orientation === "vertical";
  const inferredKeys =
    seriesOrder ??
    Array.from(new Set(data.flatMap((d) => Object.keys(d.values))));
  const labels = data.map((d) => d.label);

  const allValues = data.flatMap((d) =>
    inferredKeys.map((k) => d.values[k] ?? 0)
  );
  const dataMax = allValues.length ? Math.max(...allValues, 0) : 0;

  const vMin = isVertical ? y?.min ?? 0 : valueAxis?.min ?? 0;
  const vMaxRaw = isVertical ? y?.max ?? dataMax : valueAxis?.max ?? dataMax;
  const vMax = vMaxRaw === vMin ? vMin + 1 : vMaxRaw;
  const ticks = makeTicks(vMin, vMax, isVertical ? y?.ticks : valueAxis?.ticks);

  const defaultPalette = [
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#f472b6",
  ];
  const colorOf = (key: string, idx: number) =>
    colors?.[key] ?? defaultPalette[idx % defaultPalette.length];

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${isVertical ? styles.vert : styles.hori}`}
    >
      <ChartWrapper height={height} padding={padding}>
        {({ innerWidth, innerHeight }) => {
          // 바깥/안쪽 밴드
          const outer = isVertical
            ? bandScale(labels, 0, innerWidth, xPadding) // X 밴드
            : bandScale(labels, 0, innerHeight, bandPadding); // Y 밴드
          const inner = bandScale(
            inferredKeys,
            0,
            outer.bandWidth,
            innerPadding
          );

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
                  const val = d.values[key] ?? 0;

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
                        fill={colorOf(key, si)}
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
                        onMouseLeave={() => setTooltip(null)}
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
                        fill={colorOf(key, si)}
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
                        onMouseLeave={() => setTooltip(null)}
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
          <strong>{tooltip.label}</strong> · {tooltip.series}: {tooltip.value}
        </div>
      )}
    </div>
  );
}
