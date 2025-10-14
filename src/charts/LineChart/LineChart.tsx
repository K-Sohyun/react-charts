import { useMemo, useRef, useState } from "react";
import ChartWrapper from "../core/ChartWrapper";
import AxisLinear from "../core/AxisLinear";
import AxisBand from "../core/AxisBand";
import { linearScale, bandScale } from "../core/scales";
import { makeTicks } from "../core/ticks";
import type { YTicks } from "../core/ticks";
import type { Padding } from "../core/types";
import styles from "./LineChart.module.scss";

export type LineDatum = { label: string; value: number };

type ValueAxisOpts = {
  min?: number;
  max?: number;
  ticks?: YTicks;
  formatTick?: (v: number) => string | number;
};

type LineChartProps = {
  data: LineDatum[];
  height?: number;
  color?: string; // 선 & 포인트 기본 색
  strokeWidth?: number; // 선 두께
  showDots?: boolean; // 포인트 표시
  dotRadius?: number; // 포인트 반지름
  rotateLabels?: boolean; // X 라벨 회전
  categoryGap?: number; // band padding
  valueAxis?: ValueAxisOpts;
  framePadding?: Partial<Padding>;
  area?: boolean; // 영역(면) 채우기
  lineDurationMs?: number; // 라인 그리기 시간 (CSS var로 전달)
  dotFadeMs?: number; // 점 페이드인 시간 (CSS var로 전달)
};

type TooltipState = {
  show: boolean;
  left: number;
  top: number;
  label: string;
  value: number;
};

export default function LineChart({
  data,
  height = 360,
  color = "#4f83cc",
  strokeWidth = 2,
  showDots = true,
  dotRadius = 3,
  rotateLabels = false,
  categoryGap = 0.2,
  valueAxis,
  framePadding,
  area = false,
  lineDurationMs = 900,
  dotFadeMs = 200,
}: LineChartProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const labels = data.map((d) => d.label);
  const values = data.map((d) => Math.max(0, d.value));
  const dataMax = values.length ? Math.max(...values, 0) : 0;

  const vMin = valueAxis?.min ?? 0;
  const vMaxRaw = valueAxis?.max ?? dataMax;
  const vMax = vMaxRaw === vMin ? vMin + 1 : vMaxRaw;
  const ticks = makeTicks(vMin, vMax, valueAxis?.ticks);

  const updateTooltip = (
    e: React.MouseEvent<SVGCircleElement, MouseEvent> | null,
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
      className={styles.wrapper}
      style={
        {
          // CSS 변수로 애니메이션 시간 전달
          ["--line-dur" as any]: `${lineDurationMs}ms`,
          ["--dot-fade" as any]: `${dotFadeMs}ms`,
        } as React.CSSProperties
      }
    >
      <ChartWrapper height={height} framePadding={framePadding}>
        {({ innerWidth, innerHeight }) => {
          const xBand = bandScale(labels, 0, innerWidth, categoryGap);
          const yScale = linearScale(vMin, vMax, innerHeight, 0);

          const points = useMemo(
            () =>
              data.map((d) => {
                const cx = xBand.getX(d.label) + xBand.bandWidth / 2;
                const cy = yScale(Math.max(0, d.value));
                return { ...d, cx, cy };
              }),
            [data, xBand, yScale]
          );

          const lineD = useMemo(() => {
            if (!points.length) return "";
            const [first, ...rest] = points;
            return ["M", first.cx, first.cy]
              .concat(...rest.map((p) => ["L", p.cx, p.cy]))
              .join(" ");
          }, [points]);

          const areaD = useMemo(() => {
            if (!area || !points.length) return "";
            const baselineY = yScale(0);
            const [first, ...rest] = points;
            const main = ["M", first.cx, first.cy]
              .concat(...rest.map((p) => ["L", p.cx, p.cy]))
              .join(" ");
            const closing = `L ${points[points.length - 1].cx} ${baselineY} L ${
              first.cx
            } ${baselineY} Z`;
            return `${main} ${closing}`;
          }, [area, points, yScale]);

          return (
            <>
              <AxisLinear
                ticks={ticks}
                scale={yScale}
                length={innerWidth}
                side="left"
                grid
                formatTick={valueAxis?.formatTick}
              />

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

              {area && <path d={areaD} fill={color} className={styles.area} />}

              <path
                d={lineD}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1} // CSS 애니메이션용
                className={styles.line}
              />

              {showDots &&
                points.map((p) => (
                  <circle
                    key={p.label}
                    cx={p.cx}
                    cy={p.cy}
                    r={dotRadius}
                    fill={color}
                    className={styles.dot} // 제자리 페이드인
                    onMouseEnter={(e) => updateTooltip(e, p)}
                    onMouseMove={(e) => updateTooltip(e, p)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
            </>
          );
        }}
      </ChartWrapper>

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
