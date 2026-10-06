import StatCard from "./src/StatCard";
import { API_BASE } from "../../api";
import { useEffect, useState } from "react";

type DashboardProps = {
  page: string;
};

function Dashboard({ page }: DashboardProps) {
  const TEST_USER_ID = 503362430; //временный тг айди  для тестов
  type ResultMyMonitor = {
    id: number;
    target: string;
    interval_minutes: number;
    status: string;
    telegram_user_id: number;
    send_monitor_notificationsTG: boolean;
    send_event_notificationsTG: boolean;
    send_monitor_notificationsMAX: boolean;
    send_event_notificationsMAX: boolean;
  };

  const [resultMyMonitors, setResultMyMonitors] = useState<ResultMyMonitor[]>(
    [],
  );
  async function ShowMonitorsALL() {
    const response = await fetch(
      `${API_BASE}/api/monitorsUser/${TEST_USER_ID}`, // временный тестовый ID
    );
    const data = await response.json();
    setResultMyMonitors(data);
  }
  function summaryMonitors() {
    const totalMonitors = resultMyMonitors.length;
    const activeMonitors = resultMyMonitors.filter(
      (monitor) => monitor.status === "active",
    ).length;
    const inactiveMonitors = totalMonitors - activeMonitors;

    return {
      totalMonitors,
      activeMonitors,
      inactiveMonitors,
    };
  }

  return (
    <aside>
      <div>{page}</div>
      <div>
        <StatCard
          title="Мониторы"
          value={summaryMonitors().totalMonitors}
          description={`${summaryMonitors().activeMonitors} активных`}
          trend="+2 за неделю"
        />

        <StatCard
          title="Доступность"
          value="99.8%"
          description="за 24 часа"
          trend="+0.3%"
        />

        <StatCard
          title="События"
          value="3"
          description="2 критичных"
          trend="+1 за сутки"
        />

        <StatCard
          title="Сканирования"
          value="248"
          description="за неделю"
          trend="+24 за неделю"
        />
      </div>
    </aside>
  );
}

export default Dashboard;
