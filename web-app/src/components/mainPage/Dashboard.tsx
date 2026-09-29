import { MonitorChart } from "../graphics/MonitorChart";

type DashboardProps = {
  page: string;
};

function Dashboard({ page }: DashboardProps) {
  return (
    <aside>
      <div>
        <h2>История проверки</h2>
        <MonitorChart /> // тестовая графика
      </div>
      <div>{page}</div>
    </aside>
  );
}

export default Dashboard;
