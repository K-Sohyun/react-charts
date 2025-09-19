import BarChart from "./charts/BarChart/BarChart";
import type { BarDatum } from "./charts/BarChart/BarChart";

const sample: BarDatum[] = [
  { label: "Mon", value: 21 },
  { label: "Tue", value: 39 },
  { label: "Wed", value: 64 },
  { label: "Thu", value: 82 },
  { label: "Fri", value: 40 },
];

export default function App() {
  return (
    <main className="page-container">
      <h2 className="sub-title">BarChart 데모</h2>
      <BarChart
        data={sample}
        rotateLabels
        padding={{ bottom: 50 }}
        y={{ min: 0, max: 100, ticks: { step: 25 } }}
      />
    </main>
  );
}
