import BarChart from "./charts/BarChart/BarChart";
import BarGroupChart from "./charts/BarChart/BarGroupChart";
import type { BarDatum } from "./charts/BarChart/BarChart";
import type { GroupBarDatum } from "./charts/BarChart/BarGroupChart";

// 1) 월별 매출(천만원) — 단일 세로
const revenueMonthly: BarDatum[] = [
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

// 2) 프로젝트별 진행률 — 단일 가로
const projectProgress: BarDatum[] = [
  { label: "A", value: 21 },
  { label: "B", value: 39 },
  { label: "C", value: 64 },
  { label: "D", value: 82 },
  { label: "E", value: 40 },
];

// 3) 연도별 목표 vs 실적 — 그룹 세로
const yearPlanActual: GroupBarDatum[] = [
  { label: "2022", values: { plan: 60, actual: 50 } },
  { label: "2023", values: { plan: 80, actual: 64 } },
  { label: "2024", values: { plan: 74, actual: 70 } },
  { label: "2025", values: { plan: 75, actual: 81 } },
];

// 4) 부서별 프로젝트 완료 건수 — 그룹 가로
const deptProjects: GroupBarDatum[] = [
  { label: "영업", values: { completed: 64, waiting: 3, pending: 14 } },
  { label: "개발", values: { completed: 78, waiting: 5, pending: 26 } },
  { label: "디자인", values: { completed: 60, waiting: 2, pending: 8 } },
];

export default function App() {
  return (
    <main className="page-container">
      <h2 className="page-title">Dashboard Charts</h2>

      {/* 1) 월별 매출 — 단일 세로 */}
      <section className="chart-section">
        <h3 className="sub-title">월별 매출 (단위: 천만원)</h3>
        <BarChart
          data={revenueMonthly}
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

      {/* 2) 프로젝트별 진행률 — 단일 가로 */}
      <section className="chart-section">
        <h3 className="sub-title">프로젝트별 진행률</h3>
        <BarChart
          data={projectProgress}
          orientation="horizontal"
          framePadding={{ bottom: 30, left: 50 }}
          valueAxis={{
            min: 0,
            max: 100,
            ticks: { step: 20 },
            formatTick: (v) => `${v}%`,
          }}
          barColor="#ffc860"
          categoryGap={0.3}
        />
      </section>

      {/* 3) 연도별 목표 vs 실적 — 그룹 세로 */}
      <section className="chart-section">
        <h3 className="sub-title">연도별 목표 vs 실적</h3>
        <BarGroupChart
          data={yearPlanActual}
          orientation="vertical"
          seriesOrder={["plan", "actual"]}
          seriesLabels={{ plan: "목표", actual: "실적" }}
          colors={{ plan: "#afc5db", actual: "#ffc2a0" }}
          categoryGap={0.22}
          seriesGap={0.22}
          framePadding={{ bottom: 60, left: 30 }}
          valueAxis={{ min: 0, max: 100, ticks: { step: 20 } }}
        />
      </section>

      {/* 4) 부서별 프로젝트 완료 건수 — 그룹 가로 */}
      <section className="chart-section">
        <h3 className="sub-title">부서별 프로젝트 완료 건수</h3>
        <BarGroupChart
          data={deptProjects}
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
          categoryGap={0.25}
          seriesGap={0.28}
          framePadding={{ top: 40, bottom: 30, left: 70 }}
          valueAxis={{
            min: 0,
            max: 100,
            ticks: { step: 20 },
            formatTick: (v) => `${v}건`,
          }}
          legend={{ show: true, position: "right" }}
        />
      </section>
    </main>
  );
}
