import ResoltMonitorScan from "./ResoltMonitorScan";

import { useEffect, useState } from "react";
import { API_BASE } from "../../api";

type MonitorsPageProps = {
  page: string;
};

const TEST_USER_ID = 503362430; //временный тг айди  для тестов

function MonitorsPage({ page }: MonitorsPageProps) {
  const [URL, setURL] = useState("");
  const [min, setMin] = useState(0.1);
  const [minCrtSh, setMinCrtSh] = useState(60);

  const [includeSubdomains, setIncludeSubdomains] = useState<boolean>(false);

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
      `${API_BASE}/api/monitorsUser/${TEST_USER_ID}`, // временный тестовый ID
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
      "min",
      min,
      "minCrtSh",
      minCrtSh,
      "includeSubdomains",
      includeSubdomains,
    );
    fetch(`${API_BASE}/api/addMonitor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: URL,
        interval_minutes: min,
        minCrtSh: minCrtSh,

        send_monitor_notificationsTG: TgSendMonitorNotifications,
        send_event_notificationsTG: TgSendEventNotifications,

        send_monitor_notificationsMAX: MaxSendMonitorNotifications,
        send_event_notificationsMAX: MaxSendEventNotifications,

        includeSubdomains: includeSubdomains,
      }),
    });
    console.log("Добавление монитора завершено:", URL, min);
    ShowMonitorsALL();
  }

  async function stopMonitorID(monitorId: number) {
    console.log("Оставнока  монитора:", URL);

    await fetch(`${API_BASE}/api/stopMonitor/${monitorId}`);

    console.log("Остановка монитора завершена:", monitorId);
    ShowMonitorsALL();
  }
  async function StartMonitorID(monitorId: number) {
    console.log("Запуск  монитора:", URL);

    await fetch(`${API_BASE}/api/startMonitor/${monitorId}`);

    console.log("Запуск монитора завершен:", monitorId);
    ShowMonitorsALL();
  }
  async function deleteMonitorID(monitorId: number) {
    console.log("Удаление  монитора:", URL);

    await fetch(`${API_BASE}/api/deleteMonitor/${monitorId}`);

    console.log("Удаление монитора завершено:", monitorId);
    ShowMonitorsALL();
  }

  useEffect(() => {
    ShowMonitorsALL();
  }, []);

  return (
    <>
      <h1>{page}</h1>
      <div>
        Активные моинторы на id ${TEST_USER_ID} захаржено {}
      </div>
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
        <label>
          <input
            type="checkbox"
            id="myCheck"
            checked={includeSubdomains}
            onChange={(e) => setIncludeSubdomains(e.target.checked)}
          />
          Включить поиск поддоменов (скрость запроса значительно увеличивается и
          работа не гарнтироввана// https://crt.sh/ стрый api новый новый
          https://crt.sh/?q=%25.URL.com&output=json.) )
        </label>
        {includeSubdomains && (
          <div>
            <div>
              Введите интервал для api crt.sh (поиск поддомнов по сертификатам
              огрничения api 5 запросов в минуту){" "}
            </div>
            <input
              type="number"
              value={minCrtSh}
              onChange={(event) => setMinCrtSh(Number(event.target.value))}
            />
          </div>
        )}
        <hr />
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
        <hr />
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
        <button onClick={() => insertMonitorURL(min)}>Мониторить</button>{" "}
      </div>
      <hr />
      <h2>Мои мониторы</h2>

      {resultMyMonitors.map((monitor) => (
        <div key={monitor.id}>
          <hr />

          {/* Основная информация */}
          <h3>
            #{monitor.id} — {monitor.target}
          </h3>

          <div>
            Статус:{" "}
            {monitor.status === "active" ? "🟢 Активен" : "🔴 Остановлен"}
          </div>

          <div>Интервал проверки: {monitor.interval_minutes} мин</div>

          {/* Основная статистика за всё время  api/monitorHistory*/}

          <summary>Статистика мониторинга</summary>

          <div>
            Всего проверок: ***{/* количество проверок api/monitorHistory */}
          </div>

          <div>Обычных сканирований: 24****</div>

          <div>Поисков поддоменов: 8****</div>

          <div>
            Доступность: ***{/* процент доступности  api/monitorHistory*/}%
          </div>

          <div>
            Среднее время ответа: ***{/* среднее время  api/monitorHistory*/} мс
          </div>

          <div>
            Последняя проверка:{" "}
            {/* дата последней проверки  api/monitorHistory*/}
          </div>

          <table>
            <thead>
              <tr>
                <th>Последняя проверка</th>
                <th>HTTP</th>
                <th>Поддомены</th>
                <th>Задержка</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09.10.2026, 13:40 ***</td>
                <td>200***</td>
                <td>17***</td>
                <td>231*** мс</td>
              </tr>
            </tbody>
          </table>

          <summary>Настройки уведомлений</summary>

          <table>
            <thead>
              <tr>
                <th>Платформа</th>
                <th>Результаты проверок</th>
                <th>События</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Telegram</td>
                <td>
                  {monitor.send_monitor_notificationsTG
                    ? "Включены"
                    : "Выключены"}
                </td>
                <td>
                  {monitor.send_event_notificationsTG
                    ? "Включены"
                    : "Выключены"}
                </td>
              </tr>

              <tr>
                <td>MAX</td>
                <td>
                  {monitor.send_monitor_notificationsMAX
                    ? "Включены"
                    : "Выключены"}
                </td>
                <td>
                  {monitor.send_event_notificationsMAX
                    ? "Включены"
                    : "Выключены"}
                </td>
              </tr>
            </tbody>
          </table>

          <p>
            <button onClick={() => setSelectedMonitorId(monitor.id)}>
              Отобразить данные
            </button>{" "}
            {monitor.status === "active" ? (
              <button onClick={() => stopMonitorID(monitor.id)}>
                Остановить
              </button>
            ) : (
              <button onClick={() => StartMonitorID(monitor.id)}>
                Запустить
              </button>
            )}{" "}
            <button onClick={() => deleteMonitorID(monitor.id)}>Удалить</button>
          </p>
        </div>
      ))}

      <ResoltMonitorScan page={page} monitorId={selectedMonitorId} />
    </>
  );
}

export default MonitorsPage;
