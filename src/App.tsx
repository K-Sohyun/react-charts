import BarChart from "./charts/BarChart/BarChart";
import type { BarDatum } from "./charts/BarChart/BarChart";

const sample: BarDatum[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 30 },
  { label: "Wed", value: 18 },
  { label: "Thu", value: 42 },
  { label: "Fri", value: 26 },
];

export default function App() {
  return (
    <main className="page-container">
      <h2 className="sub-title">BarChart 데모</h2>
      <BarChart data={sample} />
    </main>
  );
}
