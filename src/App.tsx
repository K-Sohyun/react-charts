import BarChart from "./charts/BarChart/BarChart";
import type { BarDatum } from "./charts/BarChart/BarChart";

const sample: BarDatum[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 39 },
  { label: "Wed", value: 26 },
  { label: "Thu", value: 82 },
  { label: "Fri", value: 50 },
];

export default function App() {
  return (
    <main className="page-container">
      <h2 className="sub-title">BarChart 데모</h2>
      <BarChart
        data={sample}
        yDomain={{ max: 100 }}
        padding={{ bottom: 50 }}
        rotateLabels
      />
    </main>
  );
}
