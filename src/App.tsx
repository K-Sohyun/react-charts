import BarChart from "./charts/BarChart/BarChart";
import BarGroupChart from "./charts/BarChart/BarGroupChart";
import LineChart from "./charts/LineChart/LineChart";
import type { BarDatum } from "./charts/BarChart/BarChart";
import type { GroupBarDatum } from "./charts/BarChart/BarGroupChart";
import type { LineDatum } from "./charts/LineChart/LineChart";

// 1) 단일 세로
const barSample: BarDatum[] = [
  { label: "1월", value: 50 },
  { label: "2월", value: 40 },
  { label: "3월", value: 48 },
  { label: "4월", value: 52 },
  { label: "5월", value: 64 },
  { label: "6월", value: 50 },
  { label: "7월", value: 76 },
  { label: "8월", value: 70 },
  { label: "9월", value: 80 },
  { label: "10월", value: 66 },
  { label: "11월", value: 80 },
  { label: "12월", value: 84 },
];

// 2) 단일 가로
const barSample2: BarDatum[] = [
  { label: "A", value: 21 },
  { label: "B", value: 39 },
  { label: "C", value: 64 },
  { label: "D", value: 82 },
  { label: "E", value: 40 },
];

// 3) 그룹 세로
const barSample3: GroupBarDatum[] = [
  { label: "2022", values: { plan: 60, actual: 50 } },
  { label: "2023", values: { plan: 80, actual: 64 } },
  { label: "2024", values: { plan: 74, actual: 70 } },
  { label: "2025", values: { plan: 75, actual: 81 } },
];

// 4) 그룹 가로
const barSample4: GroupBarDatum[] = [
  { label: "영업", values: { completed: 64, waiting: 3, pending: 14 } },
  { label: "개발", values: { completed: 78, waiting: 5, pending: 26 } },
  { label: "디자인", values: { completed: 60, waiting: 2, pending: 8 } },
];

// 5) 단일 라인
const lineSample: LineDatum[] = [
  { label: "1월", value: 12000 },
  { label: "2월", value: 18500 },
  { label: "3월", value: 9200 },
  { label: "4월", value: 23100 },
  { label: "5월", value: 15800 },
  { label: "6월", value: 19600 },
  { label: "7월", value: 22400 },
];

export default function App() {
  return (
    <main className="page-container">
      <h2 className="page-title">Dashboard Charts</h2>

      {/* 1) 단일 세로 */}
      <section className="chart-section">
        <h3 className="sub-title">단일 세로 막대 차트</h3>
        <BarChart
          data={barSample}
          orientation="vertical"
          rotateLabels
          framePadding={{ bottom: 60, left: 40 }}
          valueAxis={{
            min: 0,
            max: 100,
            ticks: { step: 20 },
          }}
          barColor="#73a7d9"
          categoryGap={0.25}
        />
      </section>

      {/* 2) 단일 가로 */}
      <section className="chart-section">
        <h3 className="sub-title">단일 가로 막대 차트</h3>
        <BarChart
          data={barSample2}
          orientation="horizontal"
          framePadding={{ bottom: 30 }}
          valueAxis={{
            min: 0,
            max: 100,
            ticks: { step: 20 },
            formatTick: (v) => `${v}%`,
          }}
          barColor="#ffc860"
          categoryGap={0.4}
        />
      </section>

      {/* 3) 그룹 세로 */}
      <section className="chart-section">
        <h3 className="sub-title">그룹 세로 막대 차트</h3>
        <BarGroupChart
          data={barSample3}
          orientation="vertical"
          seriesOrder={["plan", "actual"]}
          seriesLabels={{ plan: "목표", actual: "실적" }}
          colors={{ plan: "#afc5db", actual: "#ffc2a0" }}
          categoryGap={0.4}
          seriesGap={0.2}
          framePadding={{ left: 30 }}
          valueAxis={{ min: 0, max: 100, ticks: { step: 20 } }}
        />
      </section>

      {/* 4) 그룹 가로 */}
      <section className="chart-section">
        <h3 className="sub-title">그룹 가로 막대 차트</h3>
        <BarGroupChart
          data={barSample4}
          height={440}
          orientation="horizontal"
          seriesOrder={["completed", "waiting", "pending"]}
          seriesLabels={{
            completed: "완료",
            waiting: "대기중",
            pending: "진행중",
          }}
          colors={{
            completed: "#d7d7d7",
            waiting: "#C49BCF",
            pending: "#FF9B66",
          }}
          categoryGap={0.2}
          seriesGap={0.3}
          framePadding={{ top: 40, bottom: 30, left: 60 }}
          valueAxis={{
            min: 0,
            max: 100,
            ticks: { step: 20 },
            formatTick: (v) => `${v}건`,
          }}
          legend={{ show: true, position: "right" }}
        />
      </section>

      {/* 5) 단일 라인 */}
      <section className="chart-section">
        <h3 className="sub-title">단일 라인 차트</h3>
        <LineChart
          data={lineSample}
          height={360}
          color="#60a5fa"
          strokeWidth={2}
          showDots={true}
          dotRadius={4}
          area={true} // 면 채우기 활성화
          categoryGap={0.15} // X 밴드 간격
          rotateLabels={false} // X 라벨 회전
          valueAxis={{
            min: 0,
            max: 25000,
            ticks: { step: 5000 },
            formatTick: (v) => `${Math.round(v / 1000)}K`,
          }}
        />
      </section>
    </main>
  );
}
