import ResoltMonitorScan from "./ResoltEventsScan";

import { useEffect, useState } from "react";

type MonitorsPageProps = {
  page: string;
};

const TEST_USER_ID = 503362430; //временный тг айди  для тестов

function EaventsPage({ page }: MonitorsPageProps) {
  //////////////////////////////////////////////
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

  const [selectedMonitorId, setSelectedMonitorId] = useState<number | null>(
    null,
  );

  async function ShowMonitorsALL() {
    const response = await fetch(
      `http://localhost:3000/api/monitorsUser/${TEST_USER_ID}`, // pfхарженный айди для тестов
    );
    const data = await response.json();
    setResultMyMonitors(data);
  }

  useEffect(() => {
    ShowMonitorsALL();
  }, []);

  return (
    <>
      <div>Результаты Событии мониторинга:</div>
      {resultMyMonitors.map((monitor) => (
        <div key={monitor.id}>
          <div>
            #{monitor.id} — {monitor.target}
          </div>
          <div>Интервал: {monitor.interval_minutes} мин</div>
          <div>Статус: {monitor.status}</div>
          <div> Статусы уведомлений</div>
          <div>Telegram монитор: {monitor.send_monitor_notificationsTG}</div>
          <div>Telegram изменения: {monitor.send_event_notificationsTG}</div>

          <div>MAX монитор: {monitor.send_monitor_notificationsMAX}</div>
          <div>MAX изменения: {monitor.send_event_notificationsMAX}</div>

          <button onClick={() => setSelectedMonitorId(monitor.id)}>
            Отобразить данные
          </button>
        </div>
      ))}

      <ResoltMonitorScan page={page} monitorId={selectedMonitorId} />
    </>
  );
}

export default EaventsPage;
