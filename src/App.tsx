import BarChart from "./charts/BarChart/BarChart";
import BarGroupChart from "./charts/BarChart/BarGroupChart";
import type { BarDatum } from "./charts/BarChart/BarChart";
import type { GroupBarDatum } from "./charts/BarChart/BarGroupChart";

const sample: BarDatum[] = [
  { label: "Mon", value: 21 },
  { label: "Tue", value: 39 },
  { label: "Wed", value: 64 },
  { label: "Thu", value: 82 },
  { label: "Fri", value: 40 },
];

const grouped: GroupBarDatum[] = [
  { label: "Jan", values: { data1: 42, data2: 72, data3: 60 } },
  { label: "Feb", values: { data1: 31, data2: 22, data3: 30 } },
  { label: "Mar", values: { data1: 50, data2: 68, data3: 55 } },
  { label: "Apr", values: { data1: 50, data2: 68, data3: 55 } },
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

      <BarGroupChart
        data={grouped}
        seriesOrder={["data1", "data2", "data3"]} // 미지정시 data에서 추론
        colors={{ data1: "#9ca3af", data2: "#60a5fa", data3: "#fbbf24" }} // 미지정시 기본 팔레트
        xPadding={0.2}
        innerPadding={0.2}
        y={{ min: 0, max: 100, ticks: { step: 25 } }}
        padding={{ bottom: 48, left: 48 }}
      />
    </main>
  );
}
