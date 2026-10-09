import StatCard from "./src/StatCard";
import LastEventsMonitors from "./src/LastEventsMonitors";
import { API_BASE } from "../../api";
import { useEffect, useState } from "react";

type DashboardProps = {
  page: string;
};

function Dashboard({ page }: DashboardProps) {
  const TEST_USER_ID = 503362430; // временный тг айди для тестов

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
  const [eventCount, setEventCount] = useState<number>(0);
  const [events, setEvents] = useState<any[]>([]);
  const [availability, setAvailability] = useState<number | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          `${API_BASE}/api/dashboard/${TEST_USER_ID}`,
        );

        if (!response.ok) {
          throw new Error("Ошибка загрузки Dashboard");
        }

        const data = await response.json();

        console.log("Dashboard data:", data);

        setMyMonitors(data.monitors);
        setEvents(data.events);
        setScanCount(data.scanCount);
        setEventCount(data.eventCount);
      } catch (error) {
        console.error("loadDashboard:", error);
      }
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    async function loadAvailability() {
      const activeMonitors = MyMonitors.filter(
        (monitor) => monitor.status === "active",
      );

      if (activeMonitors.length === 0) {
        setAvailability(null);
        return;
      }

      try {
        const results = await Promise.all(
          activeMonitors.map(async (monitor) => {
            const response = await fetch(
              `${API_BASE}/api/monitorHistory/${monitor.id}?period=24`,
            );

            if (!response.ok) {
              throw new Error(`Ошибка загрузки истории монитора ${monitor.id}`);
            }

            return response.json();
          }),
        );

        let totalCount = 0;
        let successCount = 0;

        for (const history of results) {
          totalCount += history.length;

          successCount += history.filter(
            (item: any) => item.status === 200,
          ).length;
        }

        if (totalCount > 0) {
          setAvailability((successCount / totalCount) * 100);
        } else {
          setAvailability(null);
        }
      } catch (error) {
        console.error("Ошибка загрузки доступности:", error);

        setAvailability(null);
      }
    }

    if (MyMonitors.length > 0) {
      loadAvailability();
    }
  }, [MyMonitors]);

  const totalMonitors = MyMonitors.length;

  const activeMonitors = MyMonitors.filter(
    (monitor) => monitor.status === "active",
  ).length;

  const inactiveMonitors = MyMonitors.filter(
    (monitor) => monitor.status !== "active",
  ).length;

  return (
    <aside>
      <h1>{page}</h1>

      <div>
        <StatCard
          title="Мониторы"
          value={totalMonitors}
          description={`${activeMonitors} активных, ${inactiveMonitors} неактивных`}
        />

        <StatCard
          title="Сканирований"
          value={scanCount}
          description="за всё время"
        />

        <StatCard
          title="События"
          value={eventCount}
          description="за всё время"
        />

        <StatCard
          title="Доступность"
          value={availability !== null ? `${availability.toFixed(1)}%` : "—"}
          description="за 24 часа"
        />

        <LastEventsMonitors monitorsUser={MyMonitors} events={events} />
      </div>

      <div></div>
    </aside>
  );
}

export default Dashboard;
