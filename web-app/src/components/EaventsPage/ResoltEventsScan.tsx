import { useEffect, useState } from "react";
import { API_BASE } from "../../api";

type ResoltMonitorScanProps = {
  page: string;
  monitorId: number | null;
};

function ResoltEventsScan({ monitorId }: ResoltMonitorScanProps) {
  const [resultMonitor, setResultMonitor] = useState<any[]>([]);
  console.log("Вывод монитора с ID:", monitorId);

  useEffect(() => {
    if (monitorId === null) {
      setResultMonitor([]);
      return;
    }

    async function getMonitorResult() {
      try {
        const resoltMonitor = await fetch(
          `${API_BASE}/api/eaventsResolts/${monitorId}`,
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
      <div>Результат событий мониторинга:</div>

      <div>СОБЫТИЯ:</div>

      <div>Выбраны события монитор с ID: {monitorId}</div>

      {resultMonitor.map((result) => (
        <div key={result.id}>
          <hr />

          <div>ID результата: {result.id}</div>
          <div>Дата: {result.created_at}</div>
          <div>Параметор:{result.parameter}</div>
          <div>Старое значение:{result.old_value}</div>
          <div>Новое значение:{result.new_value}</div>
        </div>
      ))}
    </>
  );
}

export default ResoltEventsScan;
