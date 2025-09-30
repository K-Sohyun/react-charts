import React, { useRef, useEffect, useState } from "react";
import type { Padding } from "../core/types";

type ChartWrapperProps = {
  width?: number;
  height?: number;
  framePadding?: Partial<Padding>;
  children: (inner: {
    innerWidth: number;
    innerHeight: number;
  }) => React.ReactNode;
};

export default function ChartWrapper({
  width,
  height = 360,
  framePadding,
  children,
}: ChartWrapperProps) {
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

  const defaultPadding: Padding = { top: 24, right: 24, bottom: 40, left: 40 };
  const pad: Padding = { ...defaultPadding, ...(framePadding ?? {}) };

  const outerW = width ?? w;
  const innerWidth = outerW - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;

  return (
    <div ref={ref} style={{ width: width ? `${width}px` : "100%" }}>
      <svg
        width={outerW}
        height={height}
        viewBox={`0 0 ${outerW} ${height}`}
        style={{ maxWidth: "100%", height: "auto", display: "block" }}
      >
        <g transform={`translate(${pad.left},${pad.top})`}>
          {children({ innerWidth, innerHeight })}
        </g>
      </svg>
    </div>
  );
}
