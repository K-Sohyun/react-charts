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
  { label: "Jan", values: { data1: 42, data2: 72 } },
  { label: "Feb", values: { data1: 31, data2: 22 } },
  { label: "Mar", values: { data1: 50, data2: 68 } },
  { label: "Apr", values: { data1: 46, data2: 84 } },
];

export default function App() {
  return (
    <main className="page-container">
      <h2 className="page-title">BarChart 데모</h2>

      {/* 1) 단일 세로 */}
      <section style={{ marginBottom: "4rem" }}>
        <h3 className="sub-title">단일 세로 막대차트</h3>
        <BarChart
          data={sample}
          orientation="vertical"
          rotateLabels
          padding={{ bottom: 60, left: 50 }}
          y={{ min: 0, max: 100, ticks: { step: 25 } }}
          barColor="#60a5fa"
          xPadding={0.2}
        />
      </section>

      {/* 2) 단일 가로 */}
      <section style={{ marginBottom: "4rem" }}>
        <h3 className="sub-title">단일 가로 막대차트</h3>
        <BarChart
          data={sample}
          orientation="horizontal"
          padding={{ left: 70, bottom: 30 }}
          valueAxis={{ min: 0, max: 100, ticks: { step: 25 } }}
          barColor="#60a5fa"
          bandPadding={0.2}
        />
      </section>

      {/* 3) 그룹 세로 */}
      <section style={{ marginBottom: "4rem" }}>
        <h3 className="sub-title">그룹 세로 막대차트</h3>
        <BarGroupChart
          data={grouped}
          orientation="vertical"
          seriesOrder={["data1", "data2"]}
          colors={{ data1: "#fbbf24", data2: "#60a5fa" }}
          xPadding={0.2} // 바깥(X) 밴드
          innerPadding={0.2} // 시리즈 밴드
          padding={{ bottom: 60, left: 50 }}
          y={{ min: 0, max: 100, ticks: { step: 25 } }}
        />
      </section>

      {/* 4) 그룹 가로 */}
      <section style={{ marginBottom: "4rem" }}>
        <h3 className="sub-title">그룹 가로 막대차트</h3>
        <BarGroupChart
          data={grouped}
          height={460}
          orientation="horizontal"
          seriesOrder={["data1", "data2"]}
          colors={{ data1: "#fbbf24", data2: "#60a5fa" }}
          bandPadding={0.2} // 바깥(Y) 밴드
          innerPadding={0.3} // 시리즈 밴드
          padding={{ left: 70, bottom: 30 }}
          valueAxis={{ min: 0, max: 100, ticks: { step: 25 } }}
        />
      </section>
    </main>
  );
}
