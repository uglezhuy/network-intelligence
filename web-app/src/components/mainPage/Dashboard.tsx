import StatCard from "./src/StatCard";
import { API_BASE } from "../../api";
import { useEffect, useState } from "react";

type DashboardProps = {
  page: string;
};

function Dashboard({ page }: DashboardProps) {
  const TEST_USER_ID = 503362430; //временный тг айди  для тестов
  type MyMonitors = {
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

  const [MyMonitors, setMyMonitors] = useState<MyMonitors[]>([]);
  const [scanCount, setScanCount] = useState<number>(0);

  useEffect(() => {
    async function ShowMonitorsALL() {
      try {
        const response = await fetch(
          `${API_BASE}/api/monitorsUser/${TEST_USER_ID}`,
        );
        if (!response.ok) throw new Error("Ошибка загрузки мониторов");
        const data = await response.json();
        setMyMonitors(data);
      } catch (error) {
        console.error("ShowMonitorsALL:", error);
      }
    }
    async function ShowResoltMomitors() {
      try {
        const response = await fetch(
          `${API_BASE}/api/scanCount/${TEST_USER_ID}`,
        );
        if (!response.ok) throw new Error("Ошибка загрузки внирований");
        const data = await response.json();
        setScanCount(data.scanCount);
      } catch (error) {
        console.error("ShowScansALL:", error);
      }
    }
    ShowMonitorsALL();
    ShowResoltMomitors();
  }, []);

  function summaryMonitors() {
    const totalMonitors = MyMonitors.length;
    const activeMonitors = MyMonitors.filter(
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
          description={`${summaryMonitors().activeMonitors} активных, ${summaryMonitors().inactiveMonitors} неактивных`}
        />

        <StatCard
          title="Сканирований"
          value={scanCount}
          description="за всё время"
        />

        <LastEventsMonitors />
      </div>

      <div></div>
    </aside>
  );
}

export default Dashboard;
