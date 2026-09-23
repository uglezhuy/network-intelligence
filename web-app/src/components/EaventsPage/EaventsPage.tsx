import { useEffect, useState } from "react";
import ResoltMonitorEaventsnts from "./ResoltMonitorScan";

type EaventsPageProps = {
  page: string;
};

function EaventsPage({ page }: EaventsPageProps) {
  const [URL, setURL] = useState("");

  const [resultScanEavents, setResultScan] = useState(
    "идет сканирования событий",
  );

  async function eaventsPrint() {
    console.log(" сытибия скана запущены");

    const response = await fetch(`http://localhost:3000/api/scan/${URL}`);

    const data = await response.json();

    console.log("Результат сканирования:", data);

    setResultScan(JSON.stringify(data, null, 2));
  }

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

  async function ShowMonitorsALL() {
    console.log("Вывод доступных мониторов событий:", URL);

    const response = await fetch(
      `http://localhost:3000/api/monitorsUser/503362430`, // pfхарженный айди для тестов
    );

    const data = await response.json();

    console.log("Поток сканирования и событий:", data);

    setResultMyMonitors(data);
  }

  async function stopMonitorID(monitorId: number) {
    console.log("Оставнока  монитора событий:", URL);

    await fetch(`http://localhost:3000/api/stopMonitor/${monitorId}`);

    console.log("Остановка монитора событий завершена:", monitorId);
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

    console.log("Удаление монитора событий завершено:", monitorId);
    ShowMonitorsALL();
  }

  useEffect(() => {
    ShowMonitorsALL();
  }, []);

  return (
    <>
      <div>Активные моинторы событийна id 503362430 захаржено {}</div>
      <div>
        {page}

        <div>Введите URL для мониторинга событий</div>

        <input
          type="text"
          value={URL}
          onChange={(event) => setURL(event.target.value)}
        />
      </div>
      <button>Мониторить события</button>
      <div>Результаты мониторинга события:</div>
      {resultMyMonitors.map((monitor) => (
        <div key={monitor.id}>
          <div>
            #{monitor.id} — {monitor.target}
          </div>

          <div>Интервал: {monitor.interval_minutes} мин</div>

          <div>Статус: {monitor.status}</div>

          <button>Отобразить</button>
          <button onClick={() => StartMonitorID(monitor.id)}>Запустить</button>
          <button onClick={() => stopMonitorID(monitor.id)}>Остановить</button>
          <button onClick={() => deleteMonitorID(monitor.id)}>Удалить</button>
        </div>
      ))}

      <ResoltMonitorEaventsnts page={page} />
    </>
  );
}

export default EaventsPage;
