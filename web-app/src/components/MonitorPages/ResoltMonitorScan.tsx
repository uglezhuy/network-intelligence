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
      <div>Результат сканирования:</div>
      <div>Выбран монитор с ID: {monitorId}</div>
      <div>Количество результатов: {resultMonitor.length}</div>
      <div> Переод времен сканирования (произвольная метка пока в днях) {}</div>
      <div> График задержки</div>
      <MonitorChart monitorId={monitorId} period={period} type="responseTime" />
      <MonitorChart monitorId={monitorId} period={period} type="bodySizeKB" />
      <StatusChart monitorId={monitorId} period={period} />

      <Average monitorId={monitorId} period={period} />
      <Min monitorId={monitorId} period={period} />
      <Max monitorId={monitorId} period={period} />
      <Availability monitorId={monitorId} period={period} />
      <CheckCount monitorId={monitorId} period={period} />

      <div> Введите длительность сканирования</div>
      <button onClick={() => setPeriod("1h")}>1 час</button>

      <button onClick={() => setPeriod("6h")}>6 часов</button>

      <button onClick={() => setPeriod("24h")}>1 день</button>

      <button onClick={() => setPeriod("7d")}>7 дней</button>

      <button onClick={() => setPeriod("30d")}>30 дней</button>

      <div>МОНИТОРИНГ:</div>
      <div>Выбран монитор с ID: {monitorId}</div>
      {resultMonitor.map((result) => (
        <div key={result.id}>
          <hr />
          <hr />
          <hr />

          <div>ID результата: {result.id}</div>
          <div>Дата: {result.created_at}</div>
          <div>{JSON.stringify(result.data, null, 2)}</div>
          <hr />
          <hr />
          <hr />
        </div>
      ))}
    </>
  );
}

export default ResoltMonitorScan;
