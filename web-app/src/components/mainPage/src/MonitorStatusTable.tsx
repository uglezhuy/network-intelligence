type Monitor = {
  monitorId: number;
  target: string;
  status: string;
  interval_minutes: number | string;
  availability: number | string | null;
  averageResponseTime: number | string | null;
  lastCheckedAt: string | null;
};

type MonitorStatusTableProps = {
  smollInfoMonitors: Monitor[];
};

function MonitorStatusTable({ smollInfoMonitors }: MonitorStatusTableProps) {
  return (
    <div>
      <h2>Состояние мониторов</h2>
      <p>Краткая сводка по отслеживаемым ресурсам</p>

      <table>
        <thead>
          <tr>
            <th>Ресурс</th>
            <th>Состояние</th>
            <th>Интервал скинирования</th>
            <th>Доступность</th>
            <th>Средний ответ</th>
            <th>Последняя проверка</th>
          </tr>
        </thead>

        <tbody>
          {smollInfoMonitors.map((monitor) => (
            <tr key={monitor.monitorId}>
              <td>{monitor.target}</td>

              <td>
                {monitor.status === "active" ? "🟢Активен🟢" : "🔴Остановлен🔴"}
              </td>
              <td> {Number(monitor.interval_minutes) * 60} сек.</td>

              <td>
                {monitor.availability !== null
                  ? `${Number(monitor.availability).toFixed(1)}%`
                  : "Нет данных"}
              </td>

              <td>
                {monitor.averageResponseTime !== null
                  ? `${Number(monitor.averageResponseTime).toLocaleString("ru-RU")} мс`
                  : "Нет данных"}
              </td>

              <td>
                {monitor.lastCheckedAt
                  ? new Date(monitor.lastCheckedAt).toLocaleTimeString(
                      "ru-RU",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : "Нет проверок"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {smollInfoMonitors.length === 0 && <p>У вас пока нет мониторов.</p>}
    </div>
  );
}

export default MonitorStatusTable;
