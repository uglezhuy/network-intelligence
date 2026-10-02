import { useEffect, useState } from "react";
import { API_BASE } from "../../api";
import { MonitorChart } from "../graphics/MonitorChart";

type ResoltMonitorScanProps = {
  page: string;
  monitorId: number | null;
};

function ResoltMonitorScan({ monitorId }: ResoltMonitorScanProps) {
  const [resultMonitor, setResultMonitor] = useState<any[]>([]);
  const [lengthMonitor, setLengthMonitor] = useState("");

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
      <MonitorChart monitorId={monitorId} lengthMonitor={lengthMonitor} />
      <div> Введите длительность сканирования</div>
      <input
        type="text"
        value={lengthMonitor}
        onChange={(event) => setLengthMonitor(event.target.value)}
      />
      <button onClick={() => setLengthMonitor(lengthMonitor)}>
        Примернить длительность
      </button>{" "}
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
