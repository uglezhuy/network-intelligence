import ResoltMonitorScan from "./ResoltMonitorScan";

import { useEffect, useState } from "react";

type MonitorsPageProps = {
  page: string;
};

function MonitorsPage({ page }: MonitorsPageProps) {
  const [URL, setURL] = useState("");
  type ResultMyMonitor = {
    id: number;
    target: string;
    interval_minutes: number;
    status: string;
    telegram_user_id: number;
  };

  const [resultMyMonitors, setResultMyMonitors] = useState<ResultMyMonitor[]>(
    [],
  );

  const [selectedMonitorId, setSelectedMonitorId] = useState<number | null>(
    null,
  );

  async function ShowMonitorsALL() {
    const response = await fetch(
      `http://localhost:3000/api/monitorsUser/503362430`, // pfхарженный айди для тестов
    );
    const data = await response.json();
    setResultMyMonitors(data);
  }
  function insertMonitorURL() {
    console.log("Добавление монитора:", URL);
    fetch(`http://localhost:3000/api/addMonitor/${URL}`);
    console.log("Добавление монитора завершено:", URL);
    ShowMonitorsALL();
  }

  async function stopMonitorID(monitorId: number) {
    console.log("Оставнока  монитора:", URL);

    await fetch(`http://localhost:3000/api/stopMonitor/${monitorId}`);

    console.log("Остановка монитора завершена:", monitorId);
    ShowMonitorsALL();
  }
  async function StartMonitorID(monitorId: number) {
    console.log("Запуск  монитора:", URL);

    await fetch(`http://localhost:3000/api/startMonitor/${monitorId}`);

    console.log("Запуск монитора завершен:", monitorId);
    ShowMonitorsALL();
  }
  async function deleteMonitorID(monitorId: number) {
    console.log("Удаление  монитора:", URL);

    await fetch(`http://localhost:3000/api/deleteMonitor/${monitorId}`);

    console.log("Удаление монитора завершено:", monitorId);
    ShowMonitorsALL();
  }

  useEffect(() => {
    ShowMonitorsALL();
  }, []);

  return (
    <>
      <div>Активные моинторы на id 503362430 захаржено {}</div>
      <div>
        {page}

        <div>Введите URL для мониторинга </div>

        <input
          type="text"
          value={URL}
          onChange={(event) => setURL(event.target.value)}
        />

        <button onClick={insertMonitorURL}>Мониторить</button>
      </div>
      <button>Мониторить</button>
      <div>Результаты мониторинга:</div>
      {resultMyMonitors.map((monitor) => (
        <div key={monitor.id}>
          <div>
            #{monitor.id} — {monitor.target}
          </div>
          <div>Интервал: {monitor.interval_minutes} мин</div>
          <div>Статус: {monitor.status}</div>
          <button onClick={() => setSelectedMonitorId(monitor.id)}>
            Отобразить данные
          </button>
          <button onClick={() => StartMonitorID(monitor.id)}>Запустить</button>
          <button onClick={() => stopMonitorID(monitor.id)}>Остановить</button>
          <button onClick={() => deleteMonitorID(monitor.id)}>Удалить</button>
        </div>
      ))}

      <ResoltMonitorScan page={page} monitorId={selectedMonitorId} />
    </>
  );
}

export default MonitorsPage;
