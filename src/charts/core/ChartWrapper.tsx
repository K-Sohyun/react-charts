import React, { useRef, useEffect, useState } from "react";

type Props = {
  width?: number;
  height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  children: (inner: {
    innerWidth: number;
    innerHeight: number;
  }) => React.ReactNode;
};

export default function ChartWrapper({
  width,
  height = 360,
  padding = { top: 24, right: 24, bottom: 40, left: 40 },
  children,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState<number>(width ?? 640);

  useEffect(() => {
    if (width) return;
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.max(e.contentRect.width, 320));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const outerW = width ?? w;
  const innerWidth = outerW - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  return (
    <div ref={ref} style={{ width: width ? `${width}px` : "100%" }}>
      <svg
        width={outerW}
        height={height}
        viewBox={`0 0 ${outerW} ${height}`}
        style={{ maxWidth: "100%", height: "auto", display: "block" }}
      >
        <g transform={`translate(${padding.left},${padding.top})`}>
          {children({ innerWidth, innerHeight })}
        </g>
      </svg>
    </div>
  );
}
