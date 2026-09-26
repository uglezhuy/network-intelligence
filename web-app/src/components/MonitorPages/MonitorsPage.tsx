import ResoltMonitorScan from "./ResoltMonitorScan";

import { useEffect, useState } from "react";

type MonitorsPageProps = {
  page: string;
};

function MonitorsPage({ page }: MonitorsPageProps) {
  const [URL, setURL] = useState("");
  const [min, setMin] = useState(0.1);

  ///TG///
  const [TgSendMonitorNotifications, TgSetSendMonitorNotifications] =
    useState(false);
  const [TgSendEventNotifications, TgSetSendEventNotifications] =
    useState(false);
  //////////////////////////////////////////////
  ///MAX///
  const [MaxSendMonitorNotifications, MaxSetSendMonitorNotifications] =
    useState(false);
  const [MaxSendEventNotifications, MaxSetSendEventNotifications] =
    useState(false);
  //////////////////////////////////////////////
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
  function insertMonitorURL(min: number) {
    console.log("Добавление монитора:", URL, min);
    console.log(
      "параметры уведомлений TG и MAX:",
      "TgSendMonitorNotifications",
      TgSendMonitorNotifications,
      "TgSendEventNotifications",
      TgSendEventNotifications,
      "MaxSendMonitorNotifications",
      MaxSendMonitorNotifications,
      "MaxSendEventNotifications",
      MaxSendEventNotifications,
    );
    fetch("http://localhost:3000/api/addMonitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: URL,
        interval_minutes: min,

        send_monitor_notificationsBot: TgSendMonitorNotifications,
        send_event_notificationsBot: TgSendEventNotifications,

        send_monitor_notificationsMAX: MaxSendMonitorNotifications,
        send_event_notificationsMAX: MaxSendEventNotifications,
      }),
    });
    console.log("Добавление монитора завершено:", URL, min);
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
        <div>Введите интервал в минутах </div>
        <input
          type="number"
          value={min}
          onChange={(event) => setMin(Number(event.target.value))}
        />
        /////////////////////////////TG///////////////////////////
        <div>
          <div>Уведомления в Telegram</div>

          <label>
            <input
              type="checkbox"
              checked={TgSendMonitorNotifications}
              onChange={(event) =>
                TgSetSendMonitorNotifications(event.target.checked)
              }
            />
            Результаты проверок
          </label>

          <div>Получать уведомление после каждой проверки</div>

          <label>
            <input
              type="checkbox"
              checked={TgSendEventNotifications}
              onChange={(event) =>
                TgSetSendEventNotifications(event.target.checked)
              }
            />
            События
          </label>

          <div>Получать уведомление, если обнаружено изменение</div>
        </div>
        ////////////////////////MAX//////////////////////////////////////
        <div>
          <div>Уведомления в MAX</div>

          <label>
            <input
              type="checkbox"
              checked={MaxSendMonitorNotifications}
              onChange={(event) =>
                MaxSetSendMonitorNotifications(event.target.checked)
              }
            />
            Результаты проверок
          </label>

          <div>Получать уведомление после каждой проверки</div>

          <label>
            <input
              type="checkbox"
              checked={MaxSendEventNotifications}
              onChange={(event) =>
                MaxSetSendEventNotifications(event.target.checked)
              }
            />
            События
          </label>

          <div>Получать уведомление, если обнаружено изменение</div>
        </div>
        //////////////////////////////////////////////////////////////
        <button onClick={() => insertMonitorURL(min)}>Мониторить</button>{" "}
      </div>

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
