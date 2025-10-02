type LegendProps = {
  seriesOrder: string[];
  seriesLabels: Record<string, string>;
  getColor?: (key: string) => string;
  colors?: Record<string, string>;
  position?: "top" | "right";
};

export default function Legend({
  seriesOrder,
  seriesLabels,
  getColor,
  colors,
  position = "top",
}: LegendProps) {
  const colorOf = getColor ?? ((k: string) => colors?.[k] ?? "#9ca3af");
  return (
    <div className={position === "right" ? "legend legend--right" : "legend"}>
      {seriesOrder.map((key) => (
        <div key={key} className="legend__item">
          <div
            className="legend__color"
            style={{ backgroundColor: colorOf(key) }}
          />
          <span className="legend__label">{seriesLabels[key] ?? key}</span>
        </div>
      ))}
    </div>
  );
}
