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

  async function ShowMonitors() {
    console.log("Вывод доступных мониторов:", URL);

    const response = await fetch(
      `http://localhost:3000/api/monitors/503362430`, // pfхарженный айди для тестов
    );

    const data = await response.json();

    console.log("Поток сканирования:", data);

    setResultMyMonitors(data);
  }

  async function stopMonitorID(monitorId: number) {
    console.log("Оставнока  монитора:", URL);

    await fetch(`http://localhost:3000/api/stopMonitor/${monitorId}`);

    console.log("Остановка монитора завершена:", monitorId);
    ShowMonitors();
  }

  useEffect(() => {
    ShowMonitors();
  }, []);

  async function montoring() {}

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
      </div>
      <button onClick={montoring}>Мониторить</button>
      <div>Результаты мониторинга:</div>
      {resultMyMonitors.map((monitor) => (
        <div key={monitor.id}>
          <div>
            #{monitor.id} — {monitor.target}
          </div>

          <div>Интервал: {monitor.interval_minutes} мин</div>

          <div>Статус: {monitor.status}</div>

          <button>Отобразить</button>
          <button onClick={() => stopMonitorID(monitor.id)}>Остановить</button>
          <button>Удалить</button>
        </div>
      ))}
    </>
  );
}

export default MonitorsPage;
