import { useMemo, useRef, useState } from "react";
import ChartWrapper from "../core/ChartWrapper";
import AxisLinear from "../core/AxisLinear";
import AxisBand from "../core/AxisBand";
import Legend from "../core/Legend";
import { linearScale, bandScale } from "../core/scales";
import { makeTicks, type YTicks } from "../core/ticks";
import { createColorScale } from "../core/colorScale";
import type { Padding } from "../core/types";
import styles from "./LineChart.module.scss";

export type GroupLineDatum = {
  label: string;
  values: Record<string, number>;
};

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

type LineGroupChartProps = {
  data: GroupLineDatum[];
  height?: number;
  seriesOrder?: string[];
  colors?: Record<string, string>;
  strokeWidth?: number;
  showDots?: boolean;
  dotRadius?: number;
  rotateLabels?: boolean;
  categoryGap?: number;
  valueAxis?: ValueAxisOpts;
  framePadding?: Partial<Padding>;
  seriesLabels?: Record<string, string>;
  legend?: LegendOpts;
  area?: boolean;
};

type TooltipState = {
  show: boolean;
  left: number;
  top: number;
  label: string;
  series: string;
  value: number;
};

export default function LineGroupChart({
  data,
  height = 360,
  seriesOrder,
  colors,
  strokeWidth = 2,
  showDots = true,
  dotRadius = 3,
  rotateLabels = false,
  categoryGap = 0.2,
  valueAxis,
  framePadding,
  seriesLabels,
  legend = { show: true, position: "top" },
  area = false,
}: LineGroupChartProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const displayOf = (key: string) => seriesLabels?.[key] ?? key;

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

  const updateTooltip = (
    e: React.MouseEvent<SVGCircleElement, MouseEvent> | null,
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

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
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
          const xBand = bandScale(labels, 0, innerWidth, categoryGap);
          const yScale = linearScale(vMin, vMax, innerHeight, 0);

          // 각 시리즈별로 포인트와 라인 데이터 생성
          const seriesData = useMemo(() => {
            return inferredKeys.map((seriesKey) => {
              const points = data.map((d) => {
                const cx = xBand.getX(d.label) + xBand.bandWidth / 2;
                const cy = yScale(Math.max(0, d.values[seriesKey] ?? 0));
                return {
                  label: d.label,
                  series: seriesKey,
                  value: d.values[seriesKey] ?? 0,
                  cx,
                  cy,
                };
              });

              const lineD = points.length > 0 
                ? ["M", points[0].cx, points[0].cy]
                    .concat(...points.slice(1).map((p) => ["L", p.cx, p.cy]))
                    .join(" ")
                : "";

              const areaD = area && points.length > 0
                ? (() => {
                    const baselineY = yScale(vMin); // Y축 최솟값을 기준으로 설정
                    const [first, ...rest] = points;
                    const main = ["M", first.cx, first.cy]
                      .concat(...rest.map((p) => ["L", p.cx, p.cy]))
                      .join(" ");
                    const closing = `L ${points[points.length - 1].cx} ${baselineY} L ${first.cx} ${baselineY} Z`;
                    return `${main} ${closing}`;
                  })()
                : "";

              return {
                seriesKey,
                points,
                lineD,
                areaD,
                color: colorOf(seriesKey),
              };
            });
          }, [data, xBand, yScale, inferredKeys, colorOf, area]);

          return (
            <>
              {/* 1) Y축 */}
              <AxisLinear
                ticks={ticks}
                scale={yScale}
                length={innerWidth}
                side="left"
                grid
                formatTick={valueAxis?.formatTick}
              />

              {/* 2) X축 */}
              <g transform={`translate(0, ${innerHeight})`}>
                <AxisBand
                  labels={labels}
                  getPos={xBand.getX}
                  bandWidth={xBand.bandWidth}
                  side="bottom"
                  rotate={rotateLabels}
                  tickPadding={20}
                />
              </g>

              {/* 3) 영역 (area) */}
              {area && 
                seriesData.map(({ seriesKey, areaD, color }) => (
                  <path
                    key={`area-${seriesKey}`}
                    d={areaD}
                    fill={color}
                    className={styles.area}
                  />
                ))
              }

              {/* 4) 라인들 */}
              {seriesData.map(({ seriesKey, lineD, color }) => (
                <path
                  key={`line-${seriesKey}`}
                  d={lineD}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1} // CSS 애니메이션용
                  className={styles.line}
                />
              ))}

              {/* 5) 포인트들 */}
              {showDots &&
                seriesData.map(({ seriesKey, points, color }) =>
                  points.map((p) => (
                    <circle
                      key={`${seriesKey}-${p.label}`}
                      cx={p.cx}
                      cy={p.cy}
                      r={dotRadius}
                      fill={color}
                      className={styles.dot}
                      onMouseEnter={(e) => updateTooltip(e, p)}
                      onMouseMove={(e) => updateTooltip(e, p)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))
                )}
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
