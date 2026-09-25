import { useEffect, useState } from "react";

type ResoltMonitorScanProps = {
  page: string;
  monitorId: number | null;
};

function ResoltMonitorScan({ page, monitorId }: ResoltMonitorScanProps) {
  const [resultMonitor, setResultMonitor] = useState<any[]>([]);
  console.log("Вывод монитора с ID:", monitorId);

  useEffect(() => {
    async function getMonitorResult() {
      try {
        const resoltMonitor = await fetch(
          `http://localhost:3000/api/monitorsResolts/${monitorId}`,
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
