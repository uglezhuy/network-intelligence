import { useEffect, useState } from "react";
import { API_BASE } from "../../../api";

type LastEventsMonitorsProps = {
  monitorsUser: any[];
  events: any[];
};

function LastEventsMonitors({ monitorsUser }: LastEventsMonitorsProps) {
  const [selectedMonitor, setSelectedMonitor] = useState<any | null>(null);
  const [resultMonitor, setResultMonitor] = useState<any[]>([]);

  useEffect(() => {
    if (selectedMonitor === null) {
      setResultMonitor([]);
      return;
    }

    async function getMonitorResult() {
      const response = await fetch(
        `${API_BASE}/api/eaventsResolts/${selectedMonitor.id}`,
      );

      const data = await response.json();

      setResultMonitor(data);
    }

    getMonitorResult();
  }, [selectedMonitor]);

  return (
    <div>
      <div>Последние события</div>

      <div>
        <button onClick={() => setSelectedMonitor(null)}> Все</button>
        {monitorsUser.map(function (monitor) {
          return (
            <button
              key={monitor.id}
              onClick={() => setSelectedMonitor(monitor)}
            >
              {monitor.target}
            </button>
          );
        })}
        {selectedMonitor === null ? (
          <>
            <div>Последние события всех мониторов</div>
          </>
        ) : (
          <>
            <div>Последнее событие монитора {selectedMonitor.target}</div>
            <div>Статус: {selectedMonitor.status}</div>
            <div> Интервал: {selectedMonitor.interval_minutes} минут</div>
            <div>
              <div>События:</div>
              {resultMonitor.map(function (result) {
                return (
                  <div key={result.id}>
                    <div>Параметр: {result.parameter}</div>
                    <div>Дата: {result.created_at}</div>
                    <div>
                      {result.old_value} → {result.new_value}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}{" "}
      </div>
    </div>
  );
}

export default LastEventsMonitors;
