import { useEffect, useRef, useState } from "react";
import ChartWrapper from "../core/ChartWrapper";
import { linearScale, bandScale } from "../core/scales";
import { makeTicks, type YTicks } from "../core/ticks";
import AxisY from "../core/AxisY";
import AxisX from "../core/AxisX";
import styles from "./BarChart.module.scss"; // BarChart와 공유

// 데이터 타입
export type GroupBarDatum = {
  label: string; // 카테고리명 (예: "1월")
  values: Record<string, number>; // 시리즈별 값 (예: { plan: 30, actual: 22 })
};

type BarGroupChartProps = {
  data: GroupBarDatum[];
  height?: number;
  seriesOrder?: string[]; // 시리즈 순서(미지정 시 data에서 추론)
  colors?: Record<string, string>; // 시리즈별 색 (없으면 기본 팔레트)
  xPadding?: number; // 바깥쪽(카테고리) padding 0~1
  innerPadding?: number; // 안쪽(시리즈) padding 0~1
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

// 툴팁 타입
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
  height = 360,
  seriesOrder,
  colors,
  xPadding = 0.2,
  innerPadding = 0.2,
  y,
  padding,
}: BarGroupChartProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // 애니메이션
  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // 툴팁 상태
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const updateTooltip = (
    e: React.MouseEvent<SVGRectElement, MouseEvent> | null,
    payload?: { label: string; series: string; value: number }
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
      ...payload,
    });
  };

  // 시리즈 키 추론
  const inferredKeys =
    seriesOrder ??
    Array.from(new Set(data.flatMap((d) => Object.keys(d.values))));

  const labels = data.map((d) => d.label);

  // y 범위: 모든 시리즈 값의 최대
  const allValues = data.flatMap((d) =>
    inferredKeys.map((k) => d.values[k] ?? 0)
  );
  const dataMax = allValues.length ? Math.max(...allValues, 0) : 0;

  const yMin = y?.min ?? 0;
  const yMaxRaw = y?.max ?? dataMax;
  const yMax = yMaxRaw === yMin ? yMin + 1 : yMaxRaw;

  const ticks = makeTicks(yMin, yMax, y?.ticks);

  // 기본 색상 팔레트
  const defaultPalette = [
    "#60a5fa",
    "#fbbf24",
    "#34d399",
    "#f87171",
    "#a78bfa",
    "#f472b6",
  ];
  const colorOf = (key: string, idx: number) =>
    colors?.[key] ?? defaultPalette[idx % defaultPalette.length];

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <ChartWrapper height={height} padding={padding}>
        {({ innerWidth, innerHeight }) => {
          // 1) 바깥쪽 밴드: 카테고리 배치
          const outer = bandScale(labels, 0, innerWidth, xPadding);
          // 2) 안쪽 밴드: 각 카테고리 내부의 시리즈 배치
          const inner = bandScale(
            inferredKeys,
            0,
            outer.bandWidth,
            innerPadding
          );
          const yScale = linearScale(yMin, yMax, innerHeight, 0);

          return (
            <>
              {/* Y축 + 그리드 */}
              <AxisY ticks={ticks} scale={yScale} innerWidth={innerWidth} />

              {/* 그룹 막대 */}
              {data.map((d, gi) => {
                const groupX = outer.getX(d.label);
                return inferredKeys.map((key, si) => {
                  const x = groupX + inner.getX(key);
                  const bw = inner.bandWidth;
                  const val = d.values[key] ?? 0;
                  const yPos = yScale(val);
                  const h = innerHeight - yPos;
                  return (
                    <rect
                      key={`${d.label}-${key}`}
                      x={x}
                      y={yPos}
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
                      // 툴팁 이벤트
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
                });
              })}

              {/* X축 */}
              <AxisX
                labels={labels}
                getX={outer.getX}
                bandWidth={outer.bandWidth}
                innerHeight={innerHeight}
                rotate={false}
              />
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
          <strong>{tooltip.label}</strong> · {tooltip.series} : {tooltip.value}
        </div>
      )}
    </div>
  );
}
