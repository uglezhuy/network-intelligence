import { useEffect, useState } from "react";
import { API_BASE } from "../../api";
import { MonitorChart } from "../graphics/MonitorChart";
import { StatusChart } from "../graphics/StatusChart";
import {
  Average,
  Max,
  Min,
  Availability,
  CheckCount,
} from "./sec/AverageMaxMin";

type ResoltMonitorScanProps = {
  page: string;
  monitorId: number | null;
};

function ResoltMonitorScan({ monitorId }: ResoltMonitorScanProps) {
  const [resultMonitor, setResultMonitor] = useState<any[]>([]);
  const [period, setPeriod] = useState("1h");
  console.log("Вывод монитора с ID:", monitorId);

  useEffect(() => {
    if (monitorId === null) {
      setResultMonitor([]);
      return;
    }

    async function getMonitorResult() {
      try {
        const resoltMonitor = await fetch(
          `${API_BASE}/api/monitorsResolts/${monitorId}`,
        );

        const data = await resoltMonitor.json();

        console.log("Все данные монитора:", data);

        setResultMonitor(data);
      } catch (error) {
        console.error("Ошибка получения результата монитора:", error);
      }
    }

    getMonitorResult();
  }, [monitorId]);

  return (
    <>
      {monitorId !== null ? (
        <>
          <div>Результат сканирования:</div>
          <div>Выбран монитор с ID: {monitorId}</div>
          <div>Количество результатов: {resultMonitor.length}</div>

          <div>График задержки</div>

          <MonitorChart
            monitorId={monitorId}
            period={period}
            type="responseTime"
          />

          <MonitorChart
            monitorId={monitorId}
            period={period}
            type="bodySizeKB"
          />

          <StatusChart monitorId={monitorId} period={period} />

          <Average monitorId={monitorId} period={period} />
          <Min monitorId={monitorId} period={period} />
          <Max monitorId={monitorId} period={period} />
          <Availability monitorId={monitorId} period={period} />
          <CheckCount monitorId={monitorId} period={period} />

          <div>Период мониторинга:</div>

          <button onClick={() => setPeriod("1h")}>1 час</button>
          <button onClick={() => setPeriod("6h")}>6 часов</button>
          <button onClick={() => setPeriod("24h")}>1 день</button>
          <button onClick={() => setPeriod("7d")}>7 дней</button>
          <button onClick={() => setPeriod("30d")}>30 дней</button>

          <div>Мониторинг:</div>
          <div>Выбран монитор с ID: {monitorId}</div>

          {resultMonitor.map((result: any) => (
            <div key={result.id}>
              <hr />

              <div>Дата: {result.created_at}</div>
              <div>
                HTTP-статус: {result.data?.http?.status ?? "Нет данных"}
              </div>
              <div>
                Время ответа: {result.data?.http?.responseTime ?? "Нет данных"}{" "}
                мс
              </div>
              <div>
                Размер ответа: {result.data?.http?.bodySizeKB ?? "Нет данных"}{" "}
                КБ
              </div>

              <button
                onClick={() => {
                  // пу пу пу пу хз ка лучше реализовать
                  console.log(
                    "пу пу пу пу хз ка лучше реализовать",
                    result.data,
                  );
                }}
              >
                Подробнее
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(result.data, null, 2),
                  );
                }}
              >
                Скопировать JSON
              </button>
            </div>
          ))}
        </>
      ) : (
        <div>Выберите монитор, чтобы посмотреть подробный анализ.</div>
      )}
    </>
  );
}

export default ResoltMonitorScan;
